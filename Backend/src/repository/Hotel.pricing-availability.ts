import { Request } from "express";
import { HttpStatusCodes } from "../utils/helpers";
import { database } from "../utils/config/database";
import { eq, and } from "drizzle-orm";
import { DataResponse } from "../utils/types";
import { roomPricing, roomAvailability } from "../utils/config/schema";

// Define types using Drizzle's type inference
type NewRoomPricing = typeof roomPricing.$inferInsert;
type RoomPricing = typeof roomPricing.$inferSelect;
type NewRoomAvailability = typeof roomAvailability.$inferInsert;
type RoomAvailability = typeof roomAvailability.$inferSelect;

class RoomOperations {
  // Room Pricing CRUD Operations
  async createRoomPricing(req: Request): Promise<DataResponse> {
    const roomId = req.params.roomId;
    try {
      const pricingData: NewRoomPricing = {
        room_id: roomId,
        base_price: req.body.base_price,
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

  async getRoomPricingByRoomId(req: Request): Promise<DataResponse> {
    const roomId = req.params.roomId;

    try {
      const [pricing] = await database
        .select()
        .from(roomPricing)
        .where(eq(roomPricing.room_id, roomId));

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

  async updateRoomPricing(req: Request): Promise<DataResponse> {
    const { roomId, pricingId } = req.params;
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
            eq(roomPricing.room_id, roomId),
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

  async deleteRoomPricing(req: Request): Promise<DataResponse> {
    const { roomId, pricingId } = req.params;

    try {
      const [deletedPricing] = await database
        .delete(roomPricing)
        .where(
          and(
            eq(roomPricing.room_id, roomId),
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
  async createRoomAvailability(req: Request): Promise<DataResponse> {
    const roomId = req.params.roomId;
    try {
      const availabilityData: NewRoomAvailability = {
        room_id: roomId,
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

  async getRoomAvailability(req: Request): Promise<DataResponse> {
    const { roomId } = req.params;

    try {
      const [availability] = await database
        .select()
        .from(roomAvailability)
        .where(
          and(
            eq(roomAvailability.room_id, roomId)          )
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

  async updateRoomAvailability(req: Request): Promise<DataResponse> {
    const { roomId, availabilityId } = req.params;
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
            eq(roomAvailability.room_id, roomId),
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

  async deleteRoomAvailability(req: Request): Promise<DataResponse> {
    const { roomId, availabilityId } = req.params;

    try {
      const [deletedAvailability] = await database
        .delete(roomAvailability)
        .where(
          and(
            eq(roomAvailability.room_id, roomId),
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
}

export const roomOperationsRepository = new RoomOperations();
