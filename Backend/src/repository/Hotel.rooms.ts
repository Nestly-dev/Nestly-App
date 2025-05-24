import { Request } from "express";
import { HttpStatusCodes } from "../utils/helpers";
import { database } from "../utils/config/database";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { DataResponse } from "../utils/types";
import { bookings, hotels, room } from "../utils/config/schema";
import { RoomAvailabilityInfo, HotelRoomSummary} from "../utils/types";

// Define types using Drizzle's type inference
type NewRoom = typeof room.$inferInsert;
type Room = typeof room.$inferSelect;

class Rooms {
  // Create - Register New Room Type
  async RegisterRoomTypes(req: Request): Promise<DataResponse> {
    const hotelId = req.params.hotelId
    try {
      const roomData: NewRoom = {
        hotel_id: hotelId,
        type: req.body.type,
        description: req.body.description,
        max_occupancy: req.body.max_occupancy,
        num_beds: req.body.num_beds,
        room_size: req.body.room_size,
        total_inventory: req.body.total_inventory,
        available_inventory: req.body.available_inventory
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
        message: "Hotel Rooms fetched successfully",
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
  // Read - Get Hotel Room Types and available rooms
  async getSpecificRoomType(req: Request): Promise<DataResponse> {
    const { hotelId } = req.params;
    const { check_in_date, check_out_date } = req.query;

    try {
      let checkInDate: Date;
      let checkOutDate: Date;

      // If dates are provided, use them; otherwise use current date
      if (check_in_date && check_out_date) {
        checkInDate = new Date(check_in_date as string);
        checkOutDate = new Date(check_out_date as string);
      } else {
        checkInDate = new Date();
        checkOutDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
      }

      // Validate dates
      if (checkInDate >= checkOutDate) {
        return {
          data: null,
          message: "Check-in date must be before check-out date",
          status: HttpStatusCodes.BAD_REQUEST
        };
      }

      // Get all room types for the hotel
      const hotelRooms = await database
        .select({
          room_id: room.id,
          room_type: room.type,
          total_inventory: room.total_inventory,
          max_occupancy: room.max_occupancy,
          num_beds: room.num_beds,
          room_size: room.room_size,
          description: room.description
        })
        .from(room)
        .where(eq(room.hotel_id, hotelId));

      if (hotelRooms.length === 0) {
        return {
          data: null,
          message: "No rooms found for this hotel",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      // Calculate available rooms for each room type
      const roomAvailabilityData: RoomAvailabilityInfo[] = [];

      for (const roomType of hotelRooms) {
        // Count bookings that overlap with the requested period
        const overlappingBookings = await database
          .select({
            booking_count: sql<number>`count(*)`
          })
          .from(bookings)
          .where(
            and(
              eq(bookings.roomTypeId, roomType.room_id),
              eq(bookings.cancelled, false),
              // Check for date overlap: booking starts before check_out and ends after check_in
              lte(bookings.check_in_date, checkOutDate),
              gte(bookings.check_out_date, checkInDate)
            )
          );

        const bookedRoomsCount = Number(overlappingBookings[0]?.booking_count || 0);
        const availableRooms = Math.max(0, roomType.total_inventory - bookedRoomsCount);

        roomAvailabilityData.push({
          room_id: roomType.room_id,
          room_type: roomType.room_type,
          total_inventory: roomType.total_inventory,
          available_rooms: availableRooms,
          booked_rooms: bookedRoomsCount,
          max_occupancy: roomType.max_occupancy,
          num_beds: roomType.num_beds,
          room_size: roomType.room_size,
          description: roomType.description
        });
      }

      // Get hotel information
      const [hotelInfo] = await database
        .select({
          hotel_name: hotels.name
        })
        .from(hotels)
        .where(eq(hotels.id, hotelId))
        .limit(1);

      // Calculate summary statistics
      const totalRooms = roomAvailabilityData.reduce((sum, room) => sum + room.total_inventory, 0);
      const totalAvailableRooms = roomAvailabilityData.reduce((sum, room) => sum + room.available_rooms, 0);
      const totalBookedRooms = roomAvailabilityData.reduce((sum, room) => sum + room.booked_rooms, 0);
      const occupancyRate = totalRooms > 0 ? (totalBookedRooms / totalRooms) * 100 : 0;

      const summary: HotelRoomSummary = {
        hotel_id: hotelId,
        hotel_name: hotelInfo?.hotel_name || 'Unknown Hotel',
        total_room_types: roomAvailabilityData.length,
        total_rooms: totalRooms,
        available_rooms: totalAvailableRooms,
        occupancy_rate: Math.round(occupancyRate * 100) / 100,
        room_types: roomAvailabilityData
      };

      return {
        data: {
          summary,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          date_range_days: Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
        },
        message: "Room availability retrieved successfully",
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
          message: "Rooms not found",
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
        message: "Rooms updated successfully",
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
          message: "Room not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      return {
        data: deletedRoomType,
        message: "Rooms deleted successfully",
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

