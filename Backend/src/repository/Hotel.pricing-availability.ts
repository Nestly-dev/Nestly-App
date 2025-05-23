import { Request } from "express";
import { HttpStatusCodes } from "../utils/helpers";
import { database } from "../utils/config/database";
import { eq, and, inArray, gte, lte, sql } from "drizzle-orm";
import { DataResponse } from "../utils/types";
import { roomPricing, roomAvailability, bookings, room } from "../utils/config/schema";
import { generateDateRange } from "../utils/dateRangeGenerator";

// Define types using Drizzle's type inference
type NewRoomPricing = typeof roomPricing.$inferInsert;
type RoomPricing = typeof roomPricing.$inferSelect;
type NewRoomAvailability = typeof roomAvailability.$inferInsert;
type RoomAvailability = typeof roomAvailability.$inferSelect;

class RoomOperations {
  // Room Pricing CRUD Operations
  async createRoomTypePricing(req: Request): Promise<DataResponse> {
    const roomTypeId = req.params.roomTypeId;
    try {
      const pricingData: NewRoomPricing = {
        roomTypeId: roomTypeId,
        roomFee: req.body.roomFee,
        serviceFee: req.body.serviceFee,
        currency: req.body.currency || 'USD',
        tax_percentage: req.body.tax_percentage,
        child_policy: req.body.child_policy
      };

      const [createdPricing] = await database
        .insert(roomPricing)
        .values(pricingData)
        .returning();

      return {
        data: createdPricing,
        message: "Room pricing created successfully",
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

  async getRoomTypePricingByroomTypeId(req: Request): Promise<DataResponse> {
    const roomTypeId = req.params.roomTypeId;

    try {
      const [pricing] = await database
        .select()
        .from(roomPricing)
        .where(eq(roomPricing.roomTypeId, roomTypeId));

      if (!pricing) {
        return {
          data: null,
          message: "Room pricing not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      return {
        data: pricing,
        message: "Room pricing fetched successfully",
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

  async updateRoomTypePricing(req: Request): Promise<DataResponse> {
    const { roomTypeId, pricingId } = req.params;
    const updateData = req.body;

    try {
      const updatedData: Partial<NewRoomPricing> = {
        ...updateData,
        updated_at: new Date()
      };

      const [updatedPricing] = await database
        .update(roomPricing)
        .set(updatedData)
        .where(
          and(
            eq(roomPricing.roomTypeId, roomTypeId),
            eq(roomPricing.id, pricingId)
          )
        )
        .returning();

      if (!updatedPricing) {
        return {
          data: null,
          message: "Room pricing not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      return {
        data: updatedPricing,
        message: "Room pricing updated successfully",
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

  async deleteRoomTypePricing(req: Request): Promise<DataResponse> {
    const { roomTypeId, pricingId } = req.params;

    try {
      const [deletedPricing] = await database
        .delete(roomPricing)
        .where(
          and(
            eq(roomPricing.roomTypeId, roomTypeId),
            eq(roomPricing.id, pricingId)
          )
        )
        .returning();

      if (!deletedPricing) {
        return {
          data: null,
          message: "Room pricing not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      return {
        data: deletedPricing,
        message: "Room pricing deleted successfully",
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

  // Room Availability CRUD Operations
  async createRoomTypeAvailability(req: Request): Promise<DataResponse> {
    const roomTypeId = req.params.roomTypeId;
    try {
      const availabilityData: NewRoomAvailability = {
        roomTypeId: roomTypeId,
        available: req.body.available,
        date: req.body.date
      };

      const [createdAvailability] = await database
        .insert(roomAvailability)
        .values(availabilityData)
        .returning();

      return {
        data: createdAvailability,
        message: "Room availability created successfully",
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

  async getRoomTypeAvailability(req: Request): Promise<DataResponse> {
    const { roomTypeId } = req.params;

    try {
      const [availability] = await database
        .select()
        .from(roomAvailability)
        .where(
          and(
            eq(roomAvailability.roomTypeId, roomTypeId)          )
        );

      if (!availability) {
        return {
          data: null,
          message: "Room availability not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      return {
        data: availability,
        message: "Room availability fetched successfully",
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

  async updateRoomTypeAvailability(req: Request): Promise<DataResponse> {
    const { roomTypeId, availabilityId } = req.params;
    const updateData = req.body;

    try {
      const updatedData: Partial<NewRoomAvailability> = {
        ...updateData,
        updated_at: new Date()
      };

      const [updatedAvailability] = await database
        .update(roomAvailability)
        .set(updatedData)
        .where(
          and(
            eq(roomAvailability.roomTypeId, roomTypeId),
            eq(roomAvailability.id, availabilityId)
          )
        )
        .returning();

      if (!updatedAvailability) {
        return {
          data: null,
          message: "Room availability not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      return {
        data: updatedAvailability,
        message: "Room availability updated successfully",
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

  async deleteRoomTypeAvailability(req: Request): Promise<DataResponse> {
    const { roomTypeId, availabilityId } = req.params;

    try {
      const [deletedAvailability] = await database
        .delete(roomAvailability)
        .where(
          and(
            eq(roomAvailability.roomTypeId, roomTypeId),
            eq(roomAvailability.id, availabilityId)
          )
        )
        .returning();

      if (!deletedAvailability) {
        return {
          data: null,
          message: "Room availability not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      return {
        data: deletedAvailability,
        message: "Room availability deleted successfully",
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

  async updateRoomTypeAvailabilityForDateRange(
    roomTypeId: string,
    startDate: Date,
    endDate: Date,
    available: boolean
  ): Promise<void> {
    const dateRange = generateDateRange(startDate, endDate);

    for (const date of dateRange) {
      // Check if availability record exists for this date
      const [existingAvailability] = await database
        .select()
        .from(roomAvailability)
        .where(
          and(
            eq(roomAvailability.roomTypeId, roomTypeId),
            eq(roomAvailability.date, date)
          )
        );

      if (existingAvailability) {
        // Update existing record
        await database
          .update(roomAvailability)
          .set({
            available,
            updated_at: new Date()
          })
          .where(
            and(
              eq(roomAvailability.roomTypeId, roomTypeId),
              eq(roomAvailability.date, date)
            )
          );
      } else {
        // Create new record
        await database
          .insert(roomAvailability)
          .values({
            roomTypeId: roomTypeId,
            date,
            available: false,
          });
      }
    }
  }

  async isRoomAvailableForPeriod(
    roomTypeId: string,
    startDate: Date,
    endDate: Date,
    requestedQuantity: number = 1
  ): Promise<{
    available: boolean;
    reason?: string;
    details: {
      roomExists: boolean;
      totalInventory: number;
      bookedQuantity: number;
      availableQuantity: number;
      requestedQuantity: number;
      hasInventory: boolean;
      hasBlockedDates: boolean;
      blockedDates?: string[];
    };
    roomInfo?: {
      roomTypeId: string;
      room_type: string;
      hotel_id: string;
      total_inventory: number;
    };
  }> {
    try {
      // Input validation
      if (!roomTypeId || !startDate || !endDate) {
        return {
          available: false,
          reason: "Missing required parameters: roomTypeId, startDate, or endDate",
          details: {
            roomExists: false,
            totalInventory: 0,
            bookedQuantity: 0,
            availableQuantity: 0,
            requestedQuantity,
            hasInventory: false,
            hasBlockedDates: false
          }
        };
      }

      if (startDate >= endDate) {
        return {
          available: false,
          reason: "Start date must be before end date",
          details: {
            roomExists: false,
            totalInventory: 0,
            bookedQuantity: 0,
            availableQuantity: 0,
            requestedQuantity,
            hasInventory: false,
            hasBlockedDates: false
          }
        };
      }

      if (requestedQuantity <= 0) {
        return {
          available: false,
          reason: "Requested quantity must be greater than 0",
          details: {
            roomExists: false,
            totalInventory: 0,
            bookedQuantity: 0,
            availableQuantity: 0,
            requestedQuantity,
            hasInventory: false,
            hasBlockedDates: false
          }
        };
      }

      // Step 1: Get room type information and verify it exists
      const [roomInfo] = await database
        .select({
          roomTypeId: room.id,
          room_type: room.type,
          total_inventory: room.total_inventory,
          hotel_id: room.hotel_id
        })
        .from(room)
        .where(eq(room.id, roomTypeId))
        .limit(1);

      if (!roomInfo) {
        return {
          available: false,
          reason: "Room type not found",
          details: {
            roomExists: false,
            totalInventory: 0,
            bookedQuantity: 0,
            availableQuantity: 0,
            requestedQuantity,
            hasInventory: false,
            hasBlockedDates: false
          }
        };
      }

      // Step 2: Count existing bookings that overlap with the requested period
      // Booking overlaps if: booking starts before our endDate AND booking ends after our startDate
      const overlappingBookings = await database
        .select({
          booking_count: sql<number>`count(*)`
        })
        .from(bookings)
        .where(
          and(
            eq(bookings.roomTypeId, roomTypeId),
            eq(bookings.cancelled, false), // Only count non-cancelled bookings
            // Date overlap logic: existing booking starts before our end date
            lte(bookings.check_in_date, endDate),
            // AND existing booking ends after our start date
            gte(bookings.check_out_date, startDate)
          )
        );

      const bookedQuantity = Number(overlappingBookings[0]?.booking_count || 0);
      const availableQuantity = Math.max(0, roomInfo.total_inventory - bookedQuantity);
      const hasInventory = availableQuantity >= requestedQuantity;

      // Step 3: Check if we have enough rooms available for the request
      if (!hasInventory) {
        return {
          available: false,
          reason: `Insufficient inventory. You requested ${requestedQuantity} room(s), but only ${availableQuantity} are available. Total inventory: ${roomInfo.total_inventory}, Currently booked: ${bookedQuantity}`,
          details: {
            roomExists: true,
            totalInventory: roomInfo.total_inventory,
            bookedQuantity,
            availableQuantity,
            requestedQuantity,
            hasInventory: false,
            hasBlockedDates: false
          },
          roomInfo: {
            roomTypeId: roomInfo.roomTypeId,
            room_type: roomInfo.room_type,
            hotel_id: roomInfo.hotel_id,
            total_inventory: roomInfo.total_inventory
          }
        };
      }

      // Step 4: All checks passed - room is available!
      return {
        available: true,
        reason: `${requestedQuantity} room(s) available for the requested period`,
        details: {
          roomExists: true,
          totalInventory: roomInfo.total_inventory,
          bookedQuantity,
          availableQuantity,
          requestedQuantity,
          hasInventory: true,
          hasBlockedDates: false
        },
        roomInfo: {
          roomTypeId: roomInfo.roomTypeId,
          room_type: roomInfo.room_type,
          hotel_id: roomInfo.hotel_id,
          total_inventory: roomInfo.total_inventory
        }
      };

    } catch (error) {
      console.error('Error checking room availability:', error);
      return {
        available: false,
        reason: `System error while checking availability: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: {
          roomExists: false,
          totalInventory: 0,
          bookedQuantity: 0,
          availableQuantity: 0,
          requestedQuantity,
          hasInventory: false,
          hasBlockedDates: false
        }
      };
    }
  }
}

export const roomOperationsRepository = new RoomOperations();
