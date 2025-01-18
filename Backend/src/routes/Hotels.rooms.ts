import { Router, Request, Response } from "express";
import { HotelRoomService } from "../services/Hotel.room";
import { MulterRequest } from "../utils/config/multer";
export const HotelRoomsRoutes = Router();

HotelRoomsRoutes.get('/hotel-rooms', (req: Request, res: Response) => {
  return HotelRoomService.getRoomByHotelId(req, res)
});

HotelRoomsRoutes.get('/:hotelId/:roomId', (req: Request, res: Response) => {
  return HotelRoomService.getSpecificRoom(req as MulterRequest, res)
});

HotelRoomsRoutes.post('/register/:hotelId', (req: Request, res: Response) => {
  return HotelRoomService.createRoom(req as MulterRequest, res)
});

HotelRoomsRoutes.patch('/update/:hotelId/:roomId', (req: Request, res: Response) => {
  return HotelRoomService.updateRoom(req as MulterRequest, res)
});

HotelRoomsRoutes.delete('/delete/:hotelId/:roomId', (req: Request, res: Response) => {
  return HotelRoomService.deleteRoom(req, res)
});

HotelRoomsRoutes.delete('/delete/:hotelId', (req: Request, res: Response) => {
  return HotelRoomService.deleteAllRoom(req, res)
});

