import Mailjet from 'node-mailjet';
import { SECRETS } from '../utils/helpers';

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY || '',
  process.env.MAILJET_API_SECRET || ''
);

export interface EmailData {
  to: string;
  toName?: string;
  subject: string;
  textPart?: string;
  htmlPart?: string;
  templateId?: number;
  variables?: Record<string, any>;
}

export const sendEmail = async (emailData: EmailData) => {
  if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_API_SECRET) {
    console.error('Mailjet credentials are not configured');
    throw new Error('Email service is not configured');
  }

  try {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL || 'noreply@nestly.com',
            Name: process.env.MAILJET_SENDER_NAME || 'Nestly',
          },
          To: [
            {
              Email: emailData.to,
              Name: emailData.toName || emailData.to,
            },
          ],
          Subject: emailData.subject,
          TextPart: emailData.textPart,
          HTMLPart: emailData.htmlPart,
          TemplateID: emailData.templateId,
          TemplateLanguage: emailData.templateId ? true : undefined,
          Variables: emailData.variables,
        },
      ],
    });

    const result = await request;
    return result.body;
  } catch (error: any) {
    console.error('Error sending email:', error.statusCode, error.message);
    throw error;
  }
};

export default mailjet;