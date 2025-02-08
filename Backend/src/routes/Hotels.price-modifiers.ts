
import { Router, Request, Response } from "express";
import { HotelPriceModifierService } from '../services/Hotel.price-modifiers'
import { authMiddleware } from "../middleware/authMiddleware";
export const HotelPriceModifiersRoutes = Router();

HotelPriceModifiersRoutes.post('/create/:roomId', authMiddleware, (req: Request, res: Response) => {
  return HotelPriceModifierService.createPriceModifier(req, res)
});

HotelPriceModifiersRoutes.get('/:roomId', (req: Request, res: Response) => {
  return HotelPriceModifierService.getPriceModifiersByRoomId(req, res)
});


HotelPriceModifiersRoutes.get('/hot-deals', (req: Request, res: Response) => {
  return HotelPriceModifierService.getHotDeals(req, res)
});

HotelPriceModifiersRoutes.patch('/update/:roomId/:discountId', authMiddleware, (req: Request, res: Response) => {
  return HotelPriceModifierService.updatePriceModifier(req, res)
});

HotelPriceModifiersRoutes.delete('/delete/:roomId/:discountId', authMiddleware, (req: Request, res: Response) => {
  return HotelPriceModifierService.deletePriceModifier(req, res)
});

