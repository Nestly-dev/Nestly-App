// routes/reviews.ts
import { Request, Response, Router } from "express";
import { reviewService } from "../services/Hotel.user-reviews";
import { MulterRequest, upload } from "../utils/config/multer";

export const ReviewRoute = Router();

// Get all reviews
ReviewRoute.get('/all-reviews', (req: Request, res: Response) => {
  return reviewService.getAllReviews(req, res);
});

// Get a specific review
ReviewRoute.get('/:reviewId', (req: Request, res: Response) => {
  return reviewService.getSpecificReview(req, res);
});

// Create a review
ReviewRoute.post('/create/:hotelId/:bookingId', upload.single('media'), (req: Request, res: Response) => {
  return reviewService.createReview(req as MulterRequest, res);
});

// Update a review
ReviewRoute.patch('/update/:reviewId', (req: Request, res: Response) => {
  return reviewService.updateReview(req, res);
});

// Delete a review
ReviewRoute.delete('/delete/:reviewId', (req: Request, res: Response) => {
  return reviewService.deleteReview(req, res);
});
