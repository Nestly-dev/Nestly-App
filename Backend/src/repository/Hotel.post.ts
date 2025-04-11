// repository/hotelPost.ts
import { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/helpers";
import { database } from "../utils/config/database";
import { DataResponse } from "../utils/types";
import { MulterRequest } from "../utils/config/multer";
import { hotelPosts, hotels } from '../utils/config/schema';
import { eq } from "drizzle-orm";
import fileUpload from "./File.upload";

// Define types using Drizzle's type inference
type NewHotelPost = typeof hotelPosts.$inferInsert;

class HotelPostRepo {
  async uploadHotelPost(
    req: MulterRequest,
    res: Response,
    postData: Omit<NewHotelPost, 'id' | 'url' | 'created_at' | 'updated_at'>
  ): Promise<DataResponse> {
    try {
      if (!req.file) {
        return {
          message: "No post file provided",
          data: '',
          status: HttpStatusCodes.BAD_REQUEST
        };
      }

      const postUrl = await fileUpload.uploadFileToS3(req.file);
      if (typeof postUrl !== 'string') {
        return {
          message: "Failed to upload post",
          data: '',
          status: HttpStatusCodes.INTERNAL_SERVER_ERROR
        };
      }

      const data = {
        hotel_id: postData.hotel_id,
        caption: postData.caption,
        postDescription: postData.postDescription,
        url: postUrl,
        created_at: new Date(),
        updated_at: new Date()
      };

      const createdPost = await database
        .insert(hotelPosts)
        .values(data)
        .returning();

      return {
        data: createdPost[0],
        status: HttpStatusCodes.CREATED,
        message: "Hotel post uploaded successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  async updateHotelPost(
    req: MulterRequest,
    res: Response,
    postData: Partial<Pick<NewHotelPost, 'caption' | 'postDescription'>>
  ): Promise<DataResponse> {
    const post_id = req.params.postId;
    try {
      // Create update data object based on schema
      const data: Partial<NewHotelPost> = {
        ...postData,
        updated_at: new Date()
      };

      // Handle file upload if there is one
      if (req.file) {
        const postUrl = await fileUpload.uploadFileToS3(req.file);
        if (typeof postUrl !== 'string') {
          return {
            message: "Failed to upload post image",
            data: '',
            status: HttpStatusCodes.INTERNAL_SERVER_ERROR
          };
        }
        data.url = postUrl;
      }

      const updatedPost = await database
        .update(hotelPosts)
        .set(data)
        .where(eq(hotelPosts.id, post_id))
        .returning()
        .then((rows) => rows[0]);

      return {
        data: updatedPost,
        status: HttpStatusCodes.OK,
        message: "Hotel post updated successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  async getAllHotelPosts(req: Request, res: Response): Promise<DataResponse> {
    try {
      const postData = await database
        .select({
          id: hotelPosts.id,
          post_caption: hotelPosts.caption,
          hotel_id: hotelPosts.hotel_id,
          hotel_name: hotels.name,
          postDescription: hotelPosts.postDescription,
          url: hotelPosts.url,
          created_at: hotelPosts.created_at,
          updated_at: hotelPosts.updated_at,
        })
        .from(hotelPosts)
        .innerJoin(hotels, eq(hotelPosts.hotel_id, hotels.id))
        .orderBy(hotelPosts.created_at);

      return {
        data: postData,
        status: HttpStatusCodes.OK,
        message: "All hotel posts retrieved successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  async getHotelPostById(req: Request, res: Response): Promise<DataResponse> {
    try {
      const postData = await database
        .select({
          id: hotelPosts.id,
          post_caption: hotelPosts.caption,
          hotel_id: hotelPosts.hotel_id,
          hotel_name: hotels.name,
          postDescription: hotelPosts.postDescription,
          url: hotelPosts.url,
          created_at: hotelPosts.created_at,
          updated_at: hotelPosts.updated_at,
        })
        .from(hotelPosts)
        .innerJoin(hotels, eq(hotelPosts.hotel_id, hotels.id))
        .orderBy(hotelPosts.created_at)
        .where(eq(hotelPosts.hotel_id, hotels.id));

      return {
        data: postData,
        status: HttpStatusCodes.OK,
        message: "All hotel posts retrieved successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  async deleteHotelPost(req: Request, res: Response): Promise<DataResponse> {
    const post_id = req.params.postId;
    try {
      const deletedPost = await database
        .delete(hotelPosts)
        .where(eq(hotelPosts.id, post_id))
        .returning()
        .then((rows) => rows[0]);

      return {
        data: deletedPost,
        status: HttpStatusCodes.OK,
        message: "Hotel post deleted successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }
}

export const hotelPostRepository = new HotelPostRepo();
