import Mailjet from 'node-mailjet';
import { SECRETS } from '../utils/helpers';

// Create a reusable Mailjet connection
const mailjet = Mailjet.apiConnect(
  SECRETS.Node_MailJet_APIKEY_PUBLIC as string,
  SECRETS.Node_MailJet_APIKEY_PRIVATE as string
);

type EmailParams = {
  toEmail: string;
  toName: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  html: string;
  text?: string;
};

/**
 * Send an email using Mailjet
 */
export async function sendMailjetEmail({
  toEmail,
  toName,
  fromEmail,
  fromName,
  subject,
  html,
  text = '',
}: EmailParams): Promise<void> {
  try {
    const request = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName,
          },
          To: [
            {
              Email: toEmail,
              Name: toName,
            },
          ],
          Subject: subject,
          TextPart: text,
          HTMLPart: html,
        },
      ],
    });

    console.log('Email sent');
  } catch (error: any) {
    console.error('Error sending Mailjet email:', error?.statusCode || error);
    throw new Error('Failed to send email');
  }
}
