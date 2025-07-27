import express from 'express';
import { Request, Response } from 'express';
import { AuthenticationService } from '../services/authService';
import { authMiddleware } from '../middleware/authMiddleware';
// Create Express router
const Router = express.Router();

// create authService instance
const authService = new AuthenticationService();

Router.post('/register', async (req: Request, res: Response) => {
  authService.register("customer", req, res);
});

Router.post('/register/via-admin', async (req: Request, res: Response) => {
  authService.register("via-admin", req, res);
});

Router.post('/login', async (req: Request, res: Response) => {
  authService.login(req, res);
});

Router.post('/forgot-password', async (req: Request, res: Response) => {
  authService.forgotPassword(req, res);
});

Router.post('/reset-password/:resetToken', async (req: Request, res: Response) => {
  authService.resetPassword(req, res);
});

Router.post('/verify-email/:verifyToken', async (req: Request, res: Response) => {
  authService.verifyEmail(req, res);
});

Router.patch('/update-password', async (req: Request, res: Response) => {
  authService.updatePassword(req, res);
});

Router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  authService.logout(req, res);
});


export const authRoutes = Router;
