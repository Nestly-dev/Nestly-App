import { Request } from 'express';
import { HttpStatusCodes } from '../utils/helpers';
import { database } from '../utils/config/database';
import { eq } from 'drizzle-orm';
import { DataResponse } from '../utils/types';
import { hotelMedia, hotels, room, roomPricing } from '../utils/config/schema';

// Define types based on your schema
type PaymentOption = 'Visa' | 'MasterCard' | 'Momo';
type HotelStatus = 'active' | 'inactive';

// Use Drizzle's InferModel to get the correct types
type NewHotel = typeof hotels.$inferInsert;
type Hotel = typeof hotels.$inferSelect;

class Hotels {
  // Create - Register New Hotel
  async createHotel(req: Request): Promise<DataResponse> {
    try {
      const hotelData: Omit<NewHotel, 'id' | 'created_at' | 'updated_at'> = {
        name: req.body.name,
        short_description: req.body.short_description,
        long_description: req.body.long_description,
        star_rating: req.body.star_rating,
        property_type: req.body.property_type,
        built_year: req.body.built_year,
        last_renovation_year: req.body.last_renovation_year,
        category: req.body.category,
        street_address: req.body.street_address,
        city: req.body.city,
        state: req.body.state,
        province: req.body.province,
        country: req.body.country,
        postal_code: req.body.postal_code,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        map_url: req.body.map_url,
        total_rooms: req.body.total_rooms,
        cancellation_policy: req.body.cancellation_policy,
        payment_options: req.body.payment_options as PaymentOption[],
        menu_download_url: req.body.menu_download_url,
        sponsored: req.body.sponsored,
        status: req.body.status as HotelStatus,
      };

      const [createdHotel] = await database
        .insert(hotels)
        .values(hotelData)
        .returning();

      return {
        data: createdHotel,
        message: 'Hotel created successfully',
        status: HttpStatusCodes.CREATED,
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

  // Read - Get All Hotels
  async getAllHotels(): Promise<DataResponse> {
    try {
      const hotelsWithMedia = await database
        .select({
          // Hotel details
          id: hotels.id,
          name: hotels.name,
          shortDescription: hotels.short_description,
          longDescription: hotels.long_description,
          starRating: hotels.star_rating,
          propertyType: hotels.property_type,
          builtYear: hotels.built_year,
          lastRenovationYear: hotels.last_renovation_year,
          category: hotels.category,
          // Location details
          streetAddress: hotels.street_address,
          city: hotels.city,
          state: hotels.state,
          province: hotels.province,
          country: hotels.country,
          postalCode: hotels.postal_code,
          latitude: hotels.latitude,
          longitude: hotels.longitude,
          mapUrl: hotels.map_url,
          // Services
          totalRooms: hotels.total_rooms,
          cancellationPolicy: hotels.cancellation_policy,
          paymentOptions: hotels.payment_options,
          menuDownloadUrl: hotels.menu_download_url,
          sponsored: hotels.sponsored,
          status: hotels.status,
          // Media details
          media: hotelMedia
        })
        .from(hotels)
        .leftJoin(hotelMedia, eq(hotels.id, hotelMedia.hotel_id))
        .where(eq(hotels.status, 'active'));
      return {
        data: hotelsWithMedia,
        message: 'Hotels fetched successfully',
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

  // Read - Get Specific Hotel
  async getSpecificHotel(req: Request): Promise<DataResponse> {
    const hotelId = req.params.hotelId;
    try {
      // Fetch Hotel Base Information
      const hotelBase = await database
        .select()
        .from(hotels)
        .where(eq(hotels.id, hotelId))
        .execute();

      if (hotelBase.length === 0) {
        return {
          data: null,
          message: 'Hotel not found',
          status: HttpStatusCodes.NOT_FOUND,
        };
      }

      // Fetch Media in a separate query
      const mediaList = await database
        .select({
          id: hotelMedia.id,
          mediaType: hotelMedia.media_type,
          url: hotelMedia.url,
        })
        .from(hotelMedia)
        .where(eq(hotelMedia.hotel_id, hotelId))
        .execute();

      // Fetch Rooms with Pricing
      const roomsWithPricing = await database
        .select({
          roomId: room.id,
          roomType: room.type,
          maxOccupancy: room.max_occupancy,
          basePrice: roomPricing.base_price,
          currency: roomPricing.currency,
        })
        .from(room)
        .leftJoin(roomPricing, eq(room.id, roomPricing.room_id))
        .where(eq(room.hotel_id, hotelId))
        .execute();

      // Construct complete hotel profile
      const hotelProfile = {
        ...hotelBase[0],
        media: mediaList,
        rooms: roomsWithPricing,
      };

      return {
        data: hotelProfile,
        message: 'Hotel Profile fetched successfully',
        status: HttpStatusCodes.OK,
      };
    } catch (error) {
      console.error('Hotel Profile Fetch Error:', error);
      return {
        data: null,
        message: `Error retrieving hotel profile, ${error}`,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // Update - Update Hotel
  async updateHotel(req: Request): Promise<DataResponse> {
    const hotelId = req.params.hotelId;
    const updateData = req.body;

    try {
      const [existingHotel] = await database
        .select()
        .from(hotels)
        .where(eq(hotels.id, hotelId));

      if (!existingHotel) {
        return {
          data: null,
          message: 'Hotel not found',
          status: HttpStatusCodes.NOT_FOUND,
        };
      }

      const updatedData: Partial<NewHotel> = {
        ...updateData,
        ...(updateData.check_in_time && {
          check_in_time: new Date(updateData.check_in_time),
        }),
        ...(updateData.check_out_time && {
          check_out_time: new Date(updateData.check_out_time),
        }),
        updated_at: new Date(),
      };

      const [updatedHotel] = await database
        .update(hotels)
        .set(updatedData)
        .where(eq(hotels.id, hotelId))
        .returning();

      return {
        data: updatedHotel,
        message: 'Hotel updated successfully',
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

  // Delete - Delete Specific Hotel (Soft Delete)
  async deleteHotel(req: Request): Promise<DataResponse> {
    const hotelId = req.params.hotelId;
    try {
      const [deletedHotel] = await database
        .update(hotels)
        .set({
          status: 'inactive' as HotelStatus,
          updated_at: new Date(),
        })
        .where(eq(hotels.id, hotelId))
        .returning();

      if (!deletedHotel) {
        return {
          data: null,
          message: 'Hotel not found',
          status: HttpStatusCodes.NOT_FOUND,
        };
      }

      return {
        data: deletedHotel,
        message: 'Hotel deleted successfully',
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
}

export const hotelRepository = new Hotels();

