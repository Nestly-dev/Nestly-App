import { Request, Response, Router } from "express";
import { profileService } from "../services/profile";

export const ProfileRoute = Router();

// get all user profiles
ProfileRoute.get('/all-profiles', (req: Request, res: Response) => {
  return profileService.getAllProfile(req, res);
});

// get a specific user profile
ProfileRoute.get('/:profileId', (req: Request, res: Response) => {
  return profileService.getSpecificProfile(req, res);
});

// Register a user profile
ProfileRoute.post('/register', (req: Request, res: Response) => {
  return profileService.registerProfile(req, res);
});

// Update a user Profile
ProfileRoute.patch('/update/:profileId', (req: Request, res: Response) => {
  return profileService.updateProfile(req, res);
});

// Delete a user Profile
ProfileRoute.delete('/delete/:profileId', (req: Request, res: Response) => {
  return profileService.deleteProfile(req, res);
});
