// src/controllers/VideoStreamingController.ts
import { Request, Response } from "express";
import { videoStreamingService } from "../services/VideoStreaming";
import { videoRepository } from "../repository/Content.videos";
import { HttpStatusCodes } from "../utils/helpers";

class VideoStreamingController {
  /**
   * Stream video content directly from S3 bucket
   */
  async streamVideo(req: Request, res: Response): Promise<void> {
    try {
      const videoId = req.params.videoId;
      // Fetch video details from database
      const videoResult = await videoRepository.getVideo(req, res);

      if (videoResult.status !== HttpStatusCodes.OK || !videoResult.data) {
        res.status(HttpStatusCodes.NOT_FOUND).json({
          message: "Video not found"
        });
        return;
      }

      const videoUrl = videoResult.data.video_url;

      // Increment view count asynchronously (don't await)
      videoRepository.incrementViewCount(req, res).catch(err => {
        console.error("Failed to increment view count:", err);
      });

      // Parse S3 URL to get bucket and key
      const s3UrlData = videoStreamingService.parseS3Url(videoUrl);

      if (!s3UrlData) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          message: "Invalid video URL format"
        });
        return;
      }

      // Stream the video
      await videoStreamingService.streamVideo(
        req,
        res,
        s3UrlData.bucketName,
        s3UrlData.key
      );
    } catch (error) {
      console.error("Video streaming error:", error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error streaming video"
      });
    }
  }
}

export const videoStreamingController = new VideoStreamingController();
