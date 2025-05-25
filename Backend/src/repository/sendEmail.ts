import nodemailer from 'nodemailer';
import GenerateAndStoreOTP from "../repository/GenerateAndStoreOTP";
import { SECRETS } from "../utils/helpers";

type EmailFormat = {
  receiver: string,
  firstname: string,
  subject: string,
  html?: string
}

export async function sendEmail({ firstname, receiver, subject, html }: EmailFormat) {
  // Get the OTP and store it
  const OTPCode = await GenerateAndStoreOTP.generateAndStoreForgotPasswordOTP(receiver)

  // Configure your email provider - example with Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail", // Replace with your email service
    auth: {
      user: SECRETS.EMAIL_USER,
      pass: SECRETS.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: SECRETS.EMAIL_USER,
    to: receiver,
    subject,
    html,
  });
}
