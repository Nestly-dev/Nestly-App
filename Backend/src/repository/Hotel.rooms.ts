import { Request } from "express";
import { HttpStatusCodes } from "../utils/helpers";
import { database } from "../utils/config/database";
import { eq, and } from "drizzle-orm";
import { DataResponse } from "../utils/types";
import { room } from "../utils/config/schema";

// Define types using Drizzle's type inference
type NewRoom = typeof room.$inferInsert;
type Room = typeof room.$inferSelect;

class Rooms {
  // Create - Register New Room Type
  async RegisterRoom(req: Request): Promise<DataResponse> {
    const hotelId = req.params.hotelId
    try {
      const roomData: NewRoom = {
        hotel_id: hotelId,
        type: req.body.type,
        description: req.body.description,
        max_occupancy: req.body.max_occupancy,
        num_beds: req.body.num_beds,
        room_size: req.body.room_size,
        floor_level: req.body.floor_level
      };

      const [createdRoom] = await database
        .insert(room)
        .values(roomData)
        .returning();

      return {
        data: createdRoom,
        message: "Room type created successfully",
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
  // Read - Get All Room Types for a Hotel
  async getRoomTypesByHotelId(req: Request): Promise<DataResponse> {
    const hotelId = req.params.hotelId;

    try {
      const hotelRoomTypes = await database
        .select()
        .from(room)
        .where(eq(room.hotel_id, hotelId));

      return {
        data: hotelRoomTypes,
        message: "Room types fetched successfully",
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

  // Read - Get Specific Room Type
  async getSpecificRoomType(req: Request): Promise<DataResponse> {
    const { hotelId, roomTypeId } = req.params;

    try {
      const [roomType] = await database
        .select()
        .from(room)
        .where(
          and(
            eq(room.hotel_id, hotelId),
            eq(room.id, roomTypeId)
          )
        );

      if (!roomType) {
        return {
          data: null,
          message: "Room type not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      return {
        data: roomType,
        message: "Room type fetched successfully",
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

  // Update - Update Room Type
  async updateRoomType(req: Request): Promise<DataResponse> {
    const { hotelId, roomTypeId } = req.params;
    const updateData = req.body;

    try {
      // Check if room type exists
      const [existingRoomType] = await database
        .select()
        .from(room)
        .where(
          and(
            eq(room.hotel_id, hotelId),
            eq(room.id, roomTypeId)
          )
        );

      if (!existingRoomType) {
        return {
          data: null,
          message: "Room type not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      const updatedData: Partial<NewRoom> = {
        ...updateData,
        updated_at: new Date()
      };

      const [updatedRoomType] = await database
        .update(room)
        .set(updatedData)
        .where(
          and(
            eq(room.hotel_id, hotelId),
            eq(room.id, roomTypeId)
          )
        )
        .returning();

      return {
        data: updatedRoomType,
        message: "Room type updated successfully",
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

  // Delete - Delete Room Type
  async deleteRoomType(req: Request): Promise<DataResponse> {
    const { hotelId, roomTypeId } = req.params;

    try {
      const [deletedRoomType] = await database
        .delete(room)
        .where(
          and(
            eq(room.hotel_id, hotelId),
            eq(room.id, roomTypeId)
          )
        )
        .returning();

      if (!deletedRoomType) {
        return {
          data: null,
          message: "Room type not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      return {
        data: deletedRoomType,
        message: "Room type deleted successfully",
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

  // Delete - Delete All Room Types for a Hotel
  async deleteAllRoomTypes(req: Request): Promise<DataResponse> {
    const hotelId = req.params.hotelId;
    try {
      const deletedRoomTypes = await database
        .delete(room)
        .where(eq(room.hotel_id, hotelId))
        .returning();

      return {
        data: deletedRoomTypes,
        message: "All room types deleted successfully",
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

export const roomRepository = new Rooms();

