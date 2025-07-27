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
import { HotelPostRoute } from "./src/routes/Hotel.posts";
import { complaintsRoutes } from "./src/routes/Client.complaints";
import { InvitationRoutes } from "./src/routes/invitations";
import { BookingCleanup } from "./src/middleware/booking.cleanup";
dotenv.config();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(BookingCleanup({
  skipRoutes: ['/health', '/status', '/metrics', '/favicon.ico', '/robots.txt'],
  logActivity: process.env.NODE_ENV === 'development'
}));


// Routes
app.get('/api/v1/test', (req: Request, res: Response) => {
  res.json('Welcome')
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', ProfileRoute);
app.use('/api/v1/hotels', HotelBasicDataRoutes);
app.use('/api/v1/hotels/rooms', HotelRoomsRoutes);
app.use('/api/v1/hotels/availability', HotelPricingAvailabilityRoutes);
app.use('/api/v1/hotels/discounts', HotelPriceModifiersRoutes);
app.use('/api/v1/hotels/booking', BookingRoutes);
app.use('/api/v1/hotels/reviews', ReviewRoute);
app.use('/api/v1/hotels/Media', HotelMediaRoute);
app.use('/api/v1/hotels/posts', HotelPostRoute);
app.use('/api/v1/content/videos', VideoRoute);
app.use('/api/v1/complaints', authMiddleware, complaintsRoutes);
app.use('/api/v1/invitation', authMiddleware, InvitationRoutes);


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

