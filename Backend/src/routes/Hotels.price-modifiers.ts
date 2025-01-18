
import { Router, Request, Response } from "express";
import { HotelPriceModifierService } from '../services/Hotel.price-modifiers'
export const HotelPriceModifiersRoutes = Router();

HotelPriceModifiersRoutes.post('/create/:roomId', (req: Request, res: Response) => {
  return HotelPriceModifierService.createPriceModifier(req, res)
});

HotelPriceModifiersRoutes.get('/:roomId', (req: Request, res: Response) => {
  return HotelPriceModifierService.getPriceModifiersByRoomId(req, res)
});

HotelPriceModifiersRoutes.patch('/update/:roomId/:discountId', (req: Request, res: Response) => {
  return HotelPriceModifierService.updatePriceModifier(req, res)
});

HotelPriceModifiersRoutes.delete('/delete/:roomId/:discountId', (req: Request, res: Response) => {
  return HotelPriceModifierService.deletePriceModifier(req, res)
});

