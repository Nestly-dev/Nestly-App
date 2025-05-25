import { Request, Response } from 'express';
import { HttpStatusCodes } from '../utils/helpers';
import { sendComplainsEmail } from '../repository/sendComplainsEmail';
import { complaintsDataType } from '../utils/types';

export class Complaints {
  async sendComplaints(req: Request, res: Response) {
    try {
      const userData = {
        email: req.user?.email as string,
        username: req.user?.username as string,
      }
      const { hotelName, subject, message }: complaintsDataType = req.body;

      await sendComplainsEmail({
        firstname: userData.username,
        complainerEmail: userData.email,
        hotelName,
        subject,
        message
      });
      return res.status(HttpStatusCodes.OK).json({ message: "Complaint sent successfully." });

    } catch (error) {
      console.error("Error sending complaint email:", error);
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to send complaint." });
    }
  }
}

export const ComplaintService = new Complaints();
