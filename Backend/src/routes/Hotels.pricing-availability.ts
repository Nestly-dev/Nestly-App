import { Router, Request, Response } from "express";
import { RoomOperationService } from "../services/Hotel.pricing-availability";
import { MulterRequest } from "../utils/config/multer";
export const HotelPricingAvailabilityRoutes = Router();

// Room Pricing Operations
HotelPricingAvailabilityRoutes.get('/roomPricing/:roomId', (req: Request, res: Response) => {
  return RoomOperationService.getRoomPricingByRoomId(req, res)
});

HotelPricingAvailabilityRoutes.post('/roomPricing/:roomId', (req: Request, res: Response) => {
  return RoomOperationService.createRoomPricing(req, res)
});

HotelPricingAvailabilityRoutes.patch('/roomPricing/:roomId/:pricingId', (req: Request, res: Response) => {
  return RoomOperationService.updateRoomPricing(req as MulterRequest, res)
});

HotelPricingAvailabilityRoutes.delete('/roomPricing/:roomId/:pricingId', (req: Request, res: Response) => {
  return RoomOperationService.deleteRoomPricing(req as MulterRequest, res)
});

// Room Availability
HotelPricingAvailabilityRoutes.post('/roomAvailability/:roomId', (req: Request, res: Response) => {
  return RoomOperationService.createRoomAvailability(req, res)
});

HotelPricingAvailabilityRoutes.get('/roomAvailability/:roomId', (req: Request, res: Response) => {
  return RoomOperationService.getRoomAvailability(req, res)
});

HotelPricingAvailabilityRoutes.patch('/roomAvailability/:roomId/:availabilityId', (req: Request, res: Response) => {
  return RoomOperationService.createRoomAvailability(req, res)
});

HotelPricingAvailabilityRoutes.delete('/roomAvailability/:roomId/:availabilityId', (req: Request, res: Response) => {
  return RoomOperationService.createRoomAvailability(req, res)
});

