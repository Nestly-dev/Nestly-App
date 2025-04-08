import { hotelPostService } from './../services/Hotel.posts';
import { Request, Response, Router } from "express";
import { MulterRequest, upload } from "../utils/config/multer";
import { authMiddleware } from "../middleware/authMiddleware";

export const HotelPostRoute = Router();


// Get all posts for a hotel
HotelPostRoute.get('/All-hotels', (req: Request, res: Response) => {
  return hotelPostService.getAllHotelPosts(req, res)
});

// Get all posts for a hotel
HotelPostRoute.get('/:hotelId', (req: Request, res: Response) => {
  return hotelPostService.getHotelPostById(req, res)
});

// Upload Hotel Post
HotelPostRoute.post('/upload/:hotelId', upload.single('media'), authMiddleware, (req: Request, res: Response) => {
  return hotelPostService.uploadPost(req as MulterRequest, res)
});

// Update Hotel Post details
HotelPostRoute.patch('/update/:postId', authMiddleware, (req: Request, res: Response) => {
  return hotelPostService.updatePost(req, res)
});

// Delete media
HotelPostRoute.delete('/delete/:postId', authMiddleware, (req: Request, res: Response) => {
  return hotelPostService.deleteHotelPost(req, res)
});
