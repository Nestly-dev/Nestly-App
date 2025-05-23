// routes/reviews.ts
import { Request, Response, Router } from "express";
import { reviewService } from "../services/Hotel.user-reviews";
import { MulterRequest, upload } from "../utils/config/multer";
import { authMiddleware } from "../middleware/authMiddleware";
import contentAwareImageMiddleware from "../middleware/contentAwareImageMiddleware";

export const ReviewRoute = Router();

// Get all reviews
ReviewRoute.get('/all-reviews', (req: Request, res: Response) => {
  return reviewService.getAllReviews(req, res);
});

// Get a specific review
ReviewRoute.get('/:reviewId', (req: Request, res: Response) => {
  return reviewService.getSpecificReview(req, res);
});

// Get a specific Hotel Review
ReviewRoute.get('/:hotelId', (req: Request, res: Response) => {
  return reviewService.getSpecificHotelReview(req, res);
});

// Create a review
ReviewRoute.post('/create/:hotelId/', authMiddleware, upload.single('media'), contentAwareImageMiddleware({
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 85
}), (req: Request, res: Response) => {
  return reviewService.createReview(req as MulterRequest, res);
});

// Update a review
ReviewRoute.patch('/update/:reviewId', authMiddleware, (req: Request, res: Response) => {
  return reviewService.updateReview(req, res);
});

// Delete a review
ReviewRoute.delete('/delete/:reviewId', authMiddleware, (req: Request, res: Response) => {
  return reviewService.deleteReview(req, res);
});
