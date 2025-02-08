import { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/helpers";
import { database } from "../utils/config/database";
import { DataResponse } from "../utils/types";
import { MulterRequest } from "../utils/config/multer";
import { videos } from '../utils/config/schema';
import { eq } from "drizzle-orm";
import fileUpload from "./file.upload";
import { sql } from "drizzle-orm";

// Define types using Drizzle's type inference
type NewVideo = typeof videos.$inferInsert;
type Video = typeof videos.$inferSelect;

class VideoRepo {
  async uploadVideo(
    req: MulterRequest,
    res: Response
  ): Promise<DataResponse> {
    try {
      const hotelId = req.params.hotelId;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Upload video file
      const videoUrl = await fileUpload.uploadFileToS3(files.video[0]);
      if (typeof videoUrl !== 'string') {
        return {
          message: "Failed to upload video",
          data: '',
          status: HttpStatusCodes.INTERNAL_SERVER_ERROR
        };
      }

      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (files.thumbnail && files.thumbnail[0]) {
        thumbnailUrl = await fileUpload.uploadFileToS3(files.thumbnail[0]);
        if (typeof thumbnailUrl !== 'string') {
          return {
            message: "Failed to upload thumbnail",
            data: '',
            status: HttpStatusCodes.INTERNAL_SERVER_ERROR
          };
        }
      }

      const data: NewVideo = {
        hotel_id: hotelId,
        video_url: videoUrl,
        title: req.body.title,
        thumbnail_url: thumbnailUrl,
        view_count: 0,
        created_at: new Date(),
        updated_at: new Date()
      };

      const createdVideo = await database
        .insert(videos)
        .values(data)
        .returning();

      return {
        data: createdVideo[0],
        status: HttpStatusCodes.CREATED,
        message: "Video Uploaded Successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  async updateVideo(
    req: Request,
    res: Response,
    videoData: Partial<Pick<Video, 'title'>>
  ): Promise<DataResponse> {
    const video_id = req.params.videoId;
    try {
      const data: Partial<Video> = {
        ...videoData,
        updated_at: new Date()
      };

      const updatedVideo = await database
        .update(videos)
        .set(data)
        .where(eq(videos.id, video_id))
        .returning()
        .then((rows) => rows[0]);

      return {
        data: updatedVideo,
        status: HttpStatusCodes.OK,
        message: "Video Updated Successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error as string,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  async getVideo(req: Request, res: Response): Promise<DataResponse> {
    try {
      const video_id = req.params.videoId;
      const videoData = await database
        .select()
        .from(videos)
        .where(eq(videos.id, video_id))
        .limit(1);

      return {
        data: videoData[0],
        status: HttpStatusCodes.OK,
        message: "Video Retrieved Successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error as string,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  async getAllVideos(req: Request, res: Response): Promise<DataResponse> {
    try {
      const videosData = await database
        .select()
        .from(videos)
      return {
        data: videosData,
        status: HttpStatusCodes.OK,
        message: "Videos Retrieved Successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error as string,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  /*
  async getVideosByCategory(req: Request, res: Response): Promise<DataResponse> {
    try {
      const category = req.params.category;
      const videosData = await database
        .select()
        .from(videos)
        .where(eq(videos.category, category))

      return {
        data: videosData,
        status: HttpStatusCodes.OK,
        message: "Videos Retrieved Successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error as string,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }
*/
  async deleteVideo(req: Request, res: Response): Promise<DataResponse> {
    const video_id = req.params.videoId;
    try {
      const deletedVideo = await database
        .delete(videos)
        .where(eq(videos.id, video_id))
        .returning()
        .then((rows) => rows[0]);

      return {
        data: deletedVideo,
        status: HttpStatusCodes.OK,
        message: "Video Deleted Successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error as string,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  async incrementViewCount(req: Request, res: Response): Promise<DataResponse> {
    const video_id = req.params.videoId;
    try {
      const updatedVideo = await database
        .update(videos)
        .set({
          view_count: sql`${videos.view_count} + 1`,
          updated_at: new Date()
        })
        .where(eq(videos.id, video_id))
        .returning()
        .then((rows) => rows[0]);

      return {
        data: updatedVideo,
        status: HttpStatusCodes.OK,
        message: "View Count Incremented Successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error as string,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }
}

export const videoRepository = new VideoRepo();
