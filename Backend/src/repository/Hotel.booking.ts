// Repository (booking.repository.ts)
import { Request } from "express";
import { HttpStatusCodes } from "../utils/helpers";
import { database } from "../utils/config/database";
import { and, eq, sql, lte } from "drizzle-orm";
import { DataResponse } from "../utils/types";
import { bookings, room } from "../utils/config/schema";
import { roomOperationsRepository } from "./Hotel.pricing-availability";
import { PgColumn } from "drizzle-orm/pg-core";

// Define types using Drizzle's type inference
type NewBooking = typeof bookings.$inferInsert;
type Booking = typeof bookings.$inferSelect;

class BookingRepository {
  // Create - Create New Booking
  async createBooking(req: Request): Promise<DataResponse> {
    const { hotelId, roomTypeId } = req.params;
    const userId = req.user?.id as string;
    const checkInDate = new Date(req.body.check_in_date);
    const checkOutDate = new Date(req.body.check_out_date);
    const numGuests = req.body.num_guests;
    const numRooms = req.body.num_rooms || 1;
    const preferredCurrency = req.user?.preferred_currency;

    // Auto-process Expired Checkouts to free rooms
    this.processExpiredCheckouts()

    try {
      // Check availability using dynamic inventory
      const availabilityCheck = await roomOperationsRepository.isRoomAvailableForPeriod(
        roomTypeId,
        checkInDate,
        checkOutDate,
        numGuests,
        numRooms
      );

      if (!availabilityCheck.available) {
        return {
          data: null,
          message: availabilityCheck.reason || "Rooms are not available",
          status: HttpStatusCodes.BAD_REQUEST
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
        total_price: req.body.total_price,
        currency: preferredCurrency,
        payment_status: "pending"
      };

      // Insert booking
      const [booking] = await database
        .insert(bookings)
        .values(bookingData)
        .returning();

      // Update dynamic inventory - decrease available rooms
      const inventoryUpdated = await roomOperationsRepository.decreaseRoomInventory(roomTypeId, numRooms);

      if (!inventoryUpdated) {
        // Rollback booking if inventory update fails
        await database
          .delete(bookings)
          .where(eq(bookings.id, booking.id));

        return {
          data: null,
          message: "Failed to update room inventory",
          status: HttpStatusCodes.INTERNAL_SERVER_ERROR
        };
      }

      return {
        data: {
          ...booking,
          summary: {
            rooms_booked: numRooms,
            guests_accommodated: numGuests,
            capacity_per_room: availabilityCheck.details.maxOccupancy,
            total_capacity: availabilityCheck.details.totalCapacity,
            rooms_remaining: availabilityCheck.details.availableInventory - numRooms
          }
        },
        message: `Booking created: ${numRooms} room(s) for ${numGuests} guest(s)`,
        status: HttpStatusCodes.CREATED
      };

    } catch (error) {
      return {
        data: null,
        message: error instanceof Error ? error.message : 'Booking creation failed',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  // Read - Get All User Bookings
  async getUserBookings(req: Request): Promise<DataResponse> {
    const userId = req.params.userId;
    this.processExpiredCheckouts()
    try {
      const userBookings = await database
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.user_id, userId),
            eq(bookings.cancelled, false)
          ))
      return {
        data: userBookings,
        message: "User bookings fetched successfully",
        status: HttpStatusCodes.OK
      };
    } catch (error) {
      return {
        data: null,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  // Read - Get Specific Booking
  async getSpecificBooking(req: Request): Promise<DataResponse> {
    const bookingId = req.params.bookingId;

    // Free up rooms
    this.processExpiredCheckouts()
    try {
      const [booking] = await database
        .select()
        .from(bookings)
        .where(eq(bookings.id, bookingId));

      if (!booking) {
        return {
          data: null,
          message: "Booking not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      return {
        data: booking,
        message: "Booking fetched successfully",
        status: HttpStatusCodes.OK
      };
    } catch (error) {
      return {
        data: null,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  // Update - Update Booking
  async updateBooking(req: Request): Promise<DataResponse> {
    const bookingId = req.params.bookingId;
    const updateData = req.body;

    // AutoProcess expired checkouts
    this.processExpiredCheckouts()
    try {
      const [existingBooking] = await database
        .select()
        .from(bookings)
        .where(eq(bookings.id, bookingId));

      if (!existingBooking) {
        return {
          data: null,
          message: "Booking not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      const updatedData: Partial<NewBooking> = {
        ...updateData,
        updated_at: new Date()
      };

      const [updatedBooking] = await database
        .update(bookings)
        .set(updatedData)
        .where(eq(bookings.id, bookingId))
        .returning();

      return {
        data: updatedBooking,
        message: "Booking updated successfully",
        status: HttpStatusCodes.OK
      };
    } catch (error) {
      return {
        data: null,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  // Update - Cancel Booking
  async cancelBooking(req: Request): Promise<DataResponse> {
    const bookingId = req.params.bookingId;
    const { cancellation_reason } = req.body;
    // AutoProcess Expired checkouts
    this.processExpiredCheckouts()

    try {
      // Get existing booking
      const [existingBooking] = await database
        .select()
        .from(bookings)
        .where(eq(bookings.id, bookingId));

      if (!existingBooking) {
        return {
          data: null,
          message: "Booking not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      if (existingBooking.cancelled) {
        return {
          data: null,
          message: "Booking is already cancelled",
          status: HttpStatusCodes.BAD_REQUEST
        };
      }

      // Cancel booking
      const [cancelledBooking] = await database
        .update(bookings)
        .set({
          cancelled: true,
          cancellation_timestamp: new Date(),
          cancellation_reason,
          updated_at: new Date()
        })
        .where(eq(bookings.id, bookingId))
        .returning();

      // Update dynamic inventory - increase available rooms
      const inventoryUpdated = await roomOperationsRepository.increaseRoomInventory(
        existingBooking.roomTypeId,
        existingBooking.num_rooms
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
              check_out: existingBooking.check_out_date
            }
          }
        },
        message: `Booking cancelled: ${existingBooking.num_rooms} room(s) now available`,
        status: HttpStatusCodes.OK
      };

    } catch (error) {
      return {
        data: null,
        message: error instanceof Error ? error.message : 'Cancellation failed',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
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
        num_rooms: bookings.num_rooms
      })
      .from(bookings)
      .where(
        and(
          eq(bookings.cancelled, false),
          lte(bookings.check_out_date, now) // Checkout date/time has passed
        )
      );

    let totalRoomsFreed = 0;

    // Process each expired booking
    for (const booking of expiredBookings) {
      // Free up the rooms by increasing available inventory
      await database
        .update(room)
        .set({
          available_inventory: sql`${room.available_inventory} + ${booking.num_rooms}`,
          updated_at: new Date()
        })
        .where(eq(room.id, booking.roomTypeId));

      // Mark booking as processed (optional - set a flag or status)
      await database
        .update(bookings)
        .set({
          updated_at: new Date()
        })
        .where(eq(bookings.id, booking.id));

      totalRoomsFreed += booking.num_rooms;
    }

    console.log(`Freed ${totalRoomsFreed} rooms from ${expiredBookings.length} expired bookings`);
    return totalRoomsFreed;

  } catch (error) {
    console.error('Error processing expired checkouts:', error);
    return 0;
  }
  }
}

export const bookingRepository = new BookingRepository();
