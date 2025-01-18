import express, { Express, Request, Response } from "express";
import { SECRETS } from "./src/utils/helpers";
import dotenv from "dotenv";
const app: Express = express();
const port = SECRETS.PORT;
import { authRoutes } from "./src/routes/auth";
import { authMiddleware } from "./src/middleware/authMiddleware";
import { ProfileRoute } from "./src/routes/profile";
import { HotelBasicDataRoutes } from "./src/routes/Hotels.basic-data";
import { HotelRoomsRoutes } from "./src/routes/Hotels.rooms";
import { HotelPricingAvailabilityRoutes } from "./src/routes/Hotels.pricing-availability";
import { HotelPriceModifiersRoutes } from "./src/routes/Hotels.price-modifiers";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { BookingRoutes } from "./src/routes/Hotel.booking";
import { ReviewRoute } from "./src/routes/Hotel.user-reviews";
import { HotelMediaRoute } from "./src/routes/Hotel.media";
import { VideoRoute } from "./src/routes/Content.videos";
dotenv.config();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/api/v1/test', (req: Request, res: Response) => {
  res.json('Welcome')
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', authMiddleware, ProfileRoute);
app.use('/api/v1/hotels', authMiddleware, HotelBasicDataRoutes);
app.use('/api/v1/hotels/rooms', authMiddleware, HotelRoomsRoutes);
app.use('/api/v1/hotels/availability', authMiddleware, HotelPricingAvailabilityRoutes);
app.use('/api/v1/hotels/discounts', authMiddleware, HotelPriceModifiersRoutes);
app.use('/api/v1/hotels/booking', authMiddleware, BookingRoutes);
app.use('/api/v1/hotels/reviews', authMiddleware, ReviewRoute);
app.use('/api/v1/hotels/Media', authMiddleware, HotelMediaRoute);
app.use('/api/v1/content/videos', authMiddleware, VideoRoute);


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
