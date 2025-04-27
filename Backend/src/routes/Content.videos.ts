// routes/videos.ts
import { Request, Response, Router } from "express";
import { videoService } from "../services/Content.videos";
import { MulterRequest, upload } from "../utils/config/multer";
import { authMiddleware } from "../middleware/authMiddleware";
import { videoStreamingController } from "../repository/videostreaming";

export const VideoRoute = Router();

// Get all videos
VideoRoute.get('/all', (req: Request, res: Response) => {
  return videoService.getAllVideos(req, res);
});

// Stream video with support for range requests
VideoRoute.get('/stream/:videoId', (req: Request, res: Response) => {
  return videoStreamingController.streamVideo(req, res);
});

// Stream video from AWS Bucket URL.
VideoRoute.get('/stream/:videoUrl', (req: Request, res: Response) => {
  return videoStreamingController.streamFromS3Url(req, res);
})

// Upload new video
VideoRoute.post('/upload/:hotelId',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  authMiddleware,
  (req: Request, res: Response) => {
    return videoService.uploadVideo(req as MulterRequest, res);
  }
);

// Update video details
VideoRoute.patch('/update/:videoId', authMiddleware, (req: Request, res: Response) => {
  return videoService.updateVideo(req, res);
});

// Delete video
VideoRoute.delete('/delete/:videoId', authMiddleware, (req: Request, res: Response) => {
  return videoService.deleteVideo(req, res);
});

// Increment view count
VideoRoute.patch('/:videoId/views', authMiddleware, (req: Request, res: Response) => {
  return videoService.incrementViewCount(req, res);
});
