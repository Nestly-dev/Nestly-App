import express, { Express, Request, Response } from "express";
import { SECRETS } from "./src/utils/helpers";
import dotenv from "dotenv";
const app: Express = express();
const port = SECRETS.PORT;
import { authRoutes } from "./src/routes/auth";
import { authMiddleware } from "./src/middleware/authMiddleware";
import { ProfileRoute } from "./src/routes/profile";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
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


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
