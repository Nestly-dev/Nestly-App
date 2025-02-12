import { Router, Request, Response } from "express";
import { HotelRoomService } from "../services/Hotel.room";
import { MulterRequest } from "../utils/config/multer";
import { authMiddleware } from "../middleware/authMiddleware";
export const HotelRoomsRoutes = Router();

HotelRoomsRoutes.get('/:hotelId', (req: Request, res: Response) => {
  return HotelRoomService.getRoomByHotelId(req as MulterRequest, res)
});

HotelRoomsRoutes.get('/:hotelId/:roomId', (req: Request, res: Response) => {
  return HotelRoomService.getSpecificRoom(req as MulterRequest, res)
});

HotelRoomsRoutes.post('/register/:hotelId', authMiddleware, (req: Request, res: Response) => {
  return HotelRoomService.createRoom(req as MulterRequest, res)
});

HotelRoomsRoutes.patch('/update/:hotelId/:roomId', authMiddleware, (req: Request, res: Response) => {
  return HotelRoomService.updateRoom(req as MulterRequest, res)
});

HotelRoomsRoutes.delete('/delete/:hotelId/:roomId', authMiddleware, (req: Request, res: Response) => {
  return HotelRoomService.deleteRoom(req, res)
});

HotelRoomsRoutes.delete('/delete/:hotelId', authMiddleware, (req: Request, res: Response) => {
  return HotelRoomService.deleteAllRoom(req, res)
});

