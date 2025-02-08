// Routes (booking.routes.ts)
import { Router, Request, Response } from "express";
import { BookingService } from "../services/Hotel.booking";

export const BookingRoutes = Router();

BookingRoutes.post('/create/:hotelId/:roomId', (req: Request, res: Response) => {
  return BookingService.createBooking(req, res);
});

BookingRoutes.get('/:userId', (req: Request, res: Response) => {
  return BookingService.getUserBookings(req, res);
});

BookingRoutes.get('/:bookingId', (req: Request, res: Response) => {
  return BookingService.getSpecificBooking(req, res);
});

BookingRoutes.patch('/update/:bookingId', (req: Request, res: Response) => {
  return BookingService.updateBooking(req, res);
});

BookingRoutes.patch('/cancel/:bookingId', (req: Request, res: Response) => {
  return BookingService.cancelBooking(req, res);
});

