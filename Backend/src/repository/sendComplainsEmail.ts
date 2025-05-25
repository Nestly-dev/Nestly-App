import nodemailer from 'nodemailer';
import { emailingOptions } from '../utils/EmailingTemplates';
import { SECRETS } from "../utils/helpers";

type EmailFormat = {
  complainerEmail: string,
  firstname: string,
  subject: string,
  hotelName: string,
  message: string
}

export async function sendComplainsEmail({ firstname, complainerEmail, hotelName, subject, message }: EmailFormat): Promise<void> {
  // Get the OTP and store it
  const complainsEmails = emailingOptions.clientComplains(firstname, complainerEmail, hotelName, subject, message)
  // Configure your email provider - example with Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail", // Replace with your email service
    auth: {
      user: SECRETS.EMAIL_USER,
      pass: SECRETS.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Hotel Complaints" <${SECRETS.EMAIL_USER}>`,
    replyTo: complainerEmail,
    to: SECRETS.EMAIL_USER,
    subject,
    html: complainsEmails,
  });
}
