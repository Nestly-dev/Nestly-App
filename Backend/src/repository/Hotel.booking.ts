// Repository (booking.repository.ts)
import { Request, Response } from 'express';
import { HttpStatusCodes } from '../utils/helpers';
import { database } from '../utils/config/database';
import { and, eq, sql, lte } from 'drizzle-orm';
import { DataResponse } from '../utils/types';
import { bookings, room } from '../utils/config/schema';
import { roomOperationsRepository } from './Hotel.pricing-availability';
import { IFlutterwavePaymentUserDetails, paymentRepository } from './FlutterwavePayment';
import { hotelRepository } from './Hotels.basic-data';

// Define types using Drizzle's type inference
type NewBooking = typeof bookings.$inferInsert;
type Booking = typeof bookings.$inferSelect;

export interface IBookingPayment {
  amount: number | string;
  currency: string;
  redirect_url?: string;
  name: string;
  email: string;
  phone_number: number | string;
  customizationsTitle: string;
  customizationsDescription: string;
}

class BookingRepository {
  // Create - Create New Booking
  async createBooking(req: Request): Promise<DataResponse> {
    const { hotelId, roomTypeId } = req.params;
    const userId = req.user?.id as string;
    const checkInDate = new Date(req.body.check_in_date);
    const checkOutDate = new Date(req.body.check_out_date);
    const numGuests = req.body.num_guests;
    const numRooms = req.body.num_rooms || 1;
    const preferredCurrency = (req.user?.preferred_currency || 'RWF') as string;
    const total_price = req.body.total_price;

    try {
      // Check availability using dynamic inventory
      const availabilityCheck =
        await roomOperationsRepository.isRoomAvailableForPeriod(
          roomTypeId,
          checkInDate,
          checkOutDate,
          numGuests,
          numRooms,
        );

      if (!availabilityCheck.available) {
        return {
          data: null,
          message: availabilityCheck.reason || 'Rooms are not available',
          status: HttpStatusCodes.BAD_REQUEST,
        };
      }

      // Start database transaction for booking + inventory update
      const bookingData: NewBooking = {
        user_id: userId as string,
        hotel_id: hotelId,
        roomTypeId: roomTypeId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_rooms: numRooms,
        num_guests: numGuests,
        total_price,
        currency: preferredCurrency,
        payment_status: 'pending',
      };

      // Start processing the payment: Get checkout link to use
      // Initialize payment with Flutterwave
      const paymentDetails: IFlutterwavePaymentUserDetails = {
        amount: total_price,
        currency: preferredCurrency,
        name: req.user?.username as string,
        email: req.user?.email as string,
        phone_number: req.user?.phone_number || '',
        customizationsTitle: `Hotel Booking - ${numRooms} Room(s)`,
        customizationsDescription: `Booking for ${numGuests} guest(s) from ${checkInDate.toDateString()} to ${checkOutDate.toDateString()}`,
      };

      // Get SubAccountId of a hotel
      const response = await hotelRepository.getHotelById(hotelId);
      const paymentResponse = await paymentRepository.Payment(paymentDetails, response.data.subaccount_id) as DataResponse;

      if (paymentResponse.status !== HttpStatusCodes.OK) {
        // Something went wrong
        return {
          message: `Payment processing for booking failed, ${paymentResponse.message}`,
          status: paymentResponse.status
        };
      }

      // Create booking first with pending status
      const [pendingBooking] = await database
        .insert(bookings)
        .values(bookingData)
        .returning();

      // Update dynamic inventory - decrease available rooms
      const inventoryUpdated =
        await roomOperationsRepository.decreaseRoomInventory(
          roomTypeId,
          numRooms,
        );

      if (!inventoryUpdated) {
        // Rollback booking if inventory update fails
        await database
          .delete(bookings)
          .where(eq(bookings.id, pendingBooking.id));

        return {
          data: null,
          message: 'Failed to update room inventory',
          status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        };
      }

      if (!paymentResponse || paymentResponse.status !== HttpStatusCodes.OK) {
        // Rollback booking and inventory if payment initialization fails
        await database
          .delete(bookings)
          .where(eq(bookings.id, pendingBooking.id));

        await roomOperationsRepository.increaseRoomInventory(
          roomTypeId,
          numRooms,
        );

        return {
          data: null,
          message: paymentResponse?.message || 'Failed to initialize payment',
          status: paymentResponse?.status || HttpStatusCodes.INTERNAL_SERVER_ERROR,
        };
      }

      // Update booking with payment transaction reference
      const [updatedBooking] = await database
        .update(bookings)
        .set({
          tx_ref: paymentResponse.data?.tx_ref,
          updated_at: new Date()
        })
        .where(eq(bookings.id, pendingBooking.id))
        .returning();

      return {
        message: `Booking created successfully. Please complete payment in 30 minutes using checkout link to confirm your reservation.`,
        data: {
          checkout_url: paymentResponse.data?.checkout_link as string,
          booking: updatedBooking,
          summary: {
            rooms_booked: numRooms,
            guests_accommodated: numGuests,
            capacity_per_room: availabilityCheck.details.maxOccupancy,
            total_capacity: availabilityCheck.details.totalCapacity,
            rooms_remaining:
              availabilityCheck.details.availableInventory - numRooms,
          },
        },
        status: HttpStatusCodes.CREATED,
      };

    } catch (error: any) {
      return {
        data: null,
        message: `Booking creation failed: ${error?.message || error}`,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // method to verify payment status for pending bookings
  async verifyBookingPayment(req: Request): Promise<DataResponse> {
    const { booking_id } = req.params;

    try {
      const [booking] = await database
        .select()
        .from(bookings)
        .where(eq(bookings.id, booking_id));

      if (!booking) {
        return {
          data: null,
          message: 'Booking not found',
          status: HttpStatusCodes.NOT_FOUND,
        };
      }

      if (!booking.tx_ref) {
        return {
          data: null,
          message: 'No transaction reference found for this booking',
          status: HttpStatusCodes.BAD_REQUEST,
        };
      }

      const transactionReference = booking.tx_ref;

      // Verify payment with Flutterwave
      const verificationResponse = await paymentRepository.verifyPayment(transactionReference) as DataResponse;

      if (verificationResponse.status === HttpStatusCodes.OK) {
        // Only update if not already marked as completed
        if (booking.payment_status !== 'completed') {
          const [updatedBooking] = await database
            .update(bookings)
            .set({
              payment_status: 'completed',
              updated_at: new Date(),
            })
            .where(eq(bookings.id, booking_id))
            .returning();

          return {
            message: `Payment verified and booking ${booking_id} confirmed`,
            status: HttpStatusCodes.OK,
            data: updatedBooking
          };
        }

        return {
          message: 'Payment already verified for this booking',
          status: HttpStatusCodes.OK,
          data: booking,
        };
      }

      return {
        message: 'Payment verification failed',
        status: HttpStatusCodes.BAD_REQUEST,
      };
    } catch (error) {
      return {
        data: null,
        message: error instanceof Error
          ? error.message
          : 'Payment verification failed',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // Read - Get All User Bookings
  async getUserBookings(req: Request): Promise<DataResponse> {
    const userId = req.params.userId;
    this.processExpiredCheckouts();
    try {
      const userBookings = await database
        .select()
        .from(bookings)
        .where(
          and(eq(bookings.user_id, userId), eq(bookings.cancelled, false)),
        );
      return {
        data: userBookings,
        message: 'User bookings fetched successfully',
        status: HttpStatusCodes.OK,
      };
    } catch (error) {
      return {
        data: null,
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // Read - Get Specific Booking
  async getSpecificBooking(req: Request): Promise<DataResponse> {
    const bookingId = req.params.bookingId;

    // Free up rooms
    this.processExpiredCheckouts();
    try {
      const [booking] = await database
        .select()
        .from(bookings)
        .where(eq(bookings.id, bookingId));

      if (!booking) {
        return {
          data: null,
          message: 'Booking not found',
          status: HttpStatusCodes.NOT_FOUND,
        };
      }

      return {
        data: booking,
        message: 'Booking fetched successfully',
        status: HttpStatusCodes.OK,
      };
    } catch (error) {
      return {
        data: null,
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // Update - Update Booking
  async updateBooking(req: Request): Promise<DataResponse> {
    const bookingId = req.params.bookingId;
    const updateData = req.body;

    // AutoProcess expired checkouts
    this.processExpiredCheckouts();
    try {
      const [existingBooking] = await database
        .select()
        .from(bookings)
        .where(eq(bookings.id, bookingId));

      if (!existingBooking) {
        return {
          data: null,
          message: 'Booking not found',
          status: HttpStatusCodes.NOT_FOUND,
        };
      }

      const updatedData: Partial<NewBooking> = {
        ...updateData,
        updated_at: new Date(),
      };

      const [updatedBooking] = await database
        .update(bookings)
        .set(updatedData)
        .where(eq(bookings.id, bookingId))
        .returning();

      return {
        data: updatedBooking,
        message: 'Booking updated successfully',
        status: HttpStatusCodes.OK,
      };
    } catch (error) {
      return {
        data: null,
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // Update - Cancel Booking
  async cancelBooking(req: Request): Promise<DataResponse> {
    const bookingId = req.params.bookingId;
    const { cancellation_reason } = req.body;
    // AutoProcess Expired checkouts
    this.processExpiredCheckouts();

    try {
      // Get existing booking
      const [existingBooking] = await database
        .select()
        .from(bookings)
        .where(eq(bookings.id, bookingId));

      if (!existingBooking) {
        return {
          data: null,
          message: 'Booking not found',
          status: HttpStatusCodes.NOT_FOUND,
        };
      }

      if (existingBooking.cancelled) {
        return {
          data: null,
          message: 'Booking is already cancelled',
          status: HttpStatusCodes.BAD_REQUEST,
        };
      }

      // Cancel booking
      const [cancelledBooking] = await database
        .update(bookings)
        .set({
          cancelled: true,
          cancellation_timestamp: new Date(),
          cancellation_reason,
          updated_at: new Date(),
        })
        .where(eq(bookings.id, bookingId))
        .returning();

      // Update dynamic inventory - increase available rooms
      const inventoryUpdated =
        await roomOperationsRepository.increaseRoomInventory(
          existingBooking.roomTypeId,
          existingBooking.num_rooms,
        );

      if (!inventoryUpdated) {
        console.error('Failed to update room inventory after cancellation');
        // Log error but don't fail the cancellation
      }

      return {
        data: {
          ...cancelledBooking,
          summary: {
            rooms_freed: existingBooking.num_rooms,
            guests_affected: existingBooking.num_guests,
            booking_period: {
              check_in: existingBooking.check_in_date,
              check_out: existingBooking.check_out_date,
            },
          },
        },
        message: `Booking cancelled: ${existingBooking.num_rooms} room(s) now available`,
        status: HttpStatusCodes.OK,
      };
    } catch (error) {
      return {
        data: null,
        message: error instanceof Error ? error.message : 'Cancellation failed',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async processExpiredCheckouts(): Promise<number> {
    try {
      const now = new Date();

      // Find all active bookings where checkout time has passed
      const expiredBookings = await database
        .select({
          id: bookings.id,
          roomTypeId: bookings.roomTypeId,
          num_rooms: bookings.num_rooms,
        })
        .from(bookings)
        .where(
          and(
            eq(bookings.cancelled, false),
            lte(bookings.check_out_date, now), // Checkout date/time has passed
          ),
        );

      let totalRoomsFreed = 0;

      // Process each expired booking
      for (const booking of expiredBookings) {
        // Free up the rooms by increasing available inventory
        await database
          .update(room)
          .set({
            available_inventory: sql`${room.available_inventory} + ${booking.num_rooms}`,
            updated_at: new Date(),
          })
          .where(eq(room.id, booking.roomTypeId));

        // Mark booking as processed (optional - set a flag or status)
        await database
          .update(bookings)
          .set({
            updated_at: new Date(),
          })
          .where(eq(bookings.id, booking.id));

        totalRoomsFreed += booking.num_rooms;
      }

      return totalRoomsFreed;
    } catch (error) {
      console.error('Error processing expired checkouts:', error);
      return 0;
    }
  }

  async processExpiredPendingPayments(): Promise<number> {
    try {
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago

      // Find all bookings that are:
      // 1. Created more than 30 minutes ago
      // 2. Still have pending payment status
      // 3. Not already cancelled
      const expiredPendingBookings = await database
        .select({
          id: bookings.id,
          roomTypeId: bookings.roomTypeId,
          num_rooms: bookings.num_rooms,
          user_id: bookings.user_id,
          hotel_id: bookings.hotel_id,
          created_at: bookings.created_at,
          tx_ref: bookings.tx_ref,
        })
        .from(bookings)
        .where(
          and(
            eq(bookings.payment_status, 'pending'),
            eq(bookings.cancelled, false),
            sql`${bookings.created_at} <= ${thirtyMinutesAgo.toISOString()}` // Created more than 30 minutes ago
          ),
        );

      let totalBookingsProcessed = 0;
      let totalRoomsFreed = 0;

      // Process each expired booking
      for (const booking of expiredPendingBookings) {
        try {
          // Mark booking as cancelled due to payment timeout
          await database
            .update(bookings)
            .set({
              cancelled: true,
              payment_status: "failed",
              cancellation_timestamp: new Date(),
              cancellation_reason: 'Payment timeout - booking expired after 30 minutes',
              updated_at: new Date(),
            })
            .where(eq(bookings.id, booking.id));

          // Free up the rooms by increasing available inventory
          const inventoryUpdated = await roomOperationsRepository.increaseRoomInventory(
            booking.roomTypeId,
            booking.num_rooms,
          );

          if (inventoryUpdated) {
            totalRoomsFreed += booking.num_rooms;
            totalBookingsProcessed++;

            console.log(`Expired booking processed: ${booking.id} - ${booking.num_rooms} room(s) freed`);
          } else {
            console.error(`Failed to update inventory for expired booking: ${booking.id}`);
          }
        } catch (error) {
          console.error(`Error processing expired booking ${booking.id}:`, error);
        }
      }

      if (totalBookingsProcessed > 0) {
        console.log(
          `Processed ${totalBookingsProcessed} expired bookings, freed up ${totalRoomsFreed} room(s)`
        );
      }

      return totalBookingsProcessed;
    } catch (error) {
      console.error('Error processing expired pending payments:', error);
      return 0;
    }
  }
}

export const bookingRepository = new BookingRepository();
