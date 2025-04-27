// Repository (booking.repository.ts)
import { Request } from "express";
import { HttpStatusCodes } from "../utils/helpers";
import { database } from "../utils/config/database";
import { and, eq } from "drizzle-orm";
import { DataResponse } from "../utils/types";
import { bookings } from "../utils/config/schema";
import { roomOperationsRepository } from "./Hotel.pricing-availability";

// Define types using Drizzle's type inference
type NewBooking = typeof bookings.$inferInsert;
type Booking = typeof bookings.$inferSelect;

class BookingRepository {
  // Create - Create New Booking
  async createBookingOldVersion(req: Request): Promise<DataResponse> {
    const { hotelId, roomId } = req.params;
    const userId = req.user?.id
    try {
      const bookingData: NewBooking = {
        user_id: userId as string,
        hotel_id: hotelId,
        room_id: roomId,
        check_in_date: new Date(req.body.check_in_date),
        check_out_date: new Date(req.body.check_out_date),
        num_guests: req.body.num_guests,
        total_price: req.body.total_price,
        currency: req.body.currency || 'USD',
        payment_status: req.body.payment_status
      };

      const [createdBooking] = await database
        .insert(bookings)
        .values(bookingData)
        .returning();

      return {
        data: createdBooking,
        message: "Booking created successfully",
        status: HttpStatusCodes.CREATED
      };
    } catch (error) {
      return {
        data: null,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  // Create - Create New Booking
  async createBooking(req: Request): Promise<DataResponse> {
    const { hotelId, roomId } = req.params;
    const userId = req.user?.id;
    const checkInDate = new Date(req.body.check_in_date);
    const checkOutDate = new Date(req.body.check_out_date);

    try {
      // Check if room is available for the requested period
      const isAvailable = await roomOperationsRepository.isRoomAvailableForPeriod(
        roomId,
        checkInDate,
        checkOutDate
      );

      if (!isAvailable) {
        return {
          data: null,
          message: "Room is not available for the selected dates",
          status: HttpStatusCodes.BAD_REQUEST
        };
      }

      const bookingData: NewBooking = {
        user_id: userId as string,
        hotel_id: hotelId,
        room_id: roomId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_guests: req.body.num_guests,
        total_price: req.body.total_price,
        currency: req.body.currency || 'USD',
        payment_status: req.body.payment_status
      };

      // Payment Procedure, Stripe



      // Create booking in transaction
        const [booking] = await database
          .insert(bookings)
          .values(bookingData)
          .returning();

        // Update room availability
         await roomOperationsRepository.updateRoomAvailabilityForDateRange(
          roomId,
          checkInDate,
          checkOutDate,
          false // Set as unavailable
        );

      return {
        data: booking,
        message: "Booking created successfully",
        status: HttpStatusCodes.CREATED
      };
    } catch (error) {
      return {
        data: null,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  // Read - Get All User Bookings
  async getUserBookings(req: Request): Promise<DataResponse> {
    const userId = req.params.userId;

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

  // Update - Cancel Booking Old Version
  async cancelBookingOldVersion(req: Request): Promise<DataResponse> {
    const bookingId = req.params.bookingId;
    const { cancellation_reason } = req.body;

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

      return {
        data: cancelledBooking,
        message: "Booking cancelled successfully",
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

      // Cancel booking in transaction
        const [cancelBooking] = await database
          .update(bookings)
          .set({
            cancelled: true,
            cancellation_timestamp: new Date(),
            cancellation_reason,
            updated_at: new Date()
          })
          .where(eq(bookings.id, bookingId))
          .returning();

        // Update room availability
        await roomOperationsRepository.updateRoomAvailabilityForDateRange(
          existingBooking.room_id,
          existingBooking.check_in_date,
          existingBooking.check_out_date,
          true // Set as available
        );

      return {
        data: cancelBooking,
        message: "Booking cancelled successfully",
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

}

export const bookingRepository = new BookingRepository();
