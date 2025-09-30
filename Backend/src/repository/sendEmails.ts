import { sendEmail } from '../repository/mailjet';
import { emailingOptions } from '../utils/EmailingTemplates';
import { SECRETS } from "../utils/helpers";

type EmailFormat = {
  complainerEmail?: string,
  email?: string,
  firstname?: string,
  username?: string,
  managerEmail?: string,
  password?: string
  subject?: string,
  hotelName?: string,
  message?: string,
  inviteeUsername?: string,
  inviteeEmail?: string,
  emailTemplate?: string
}

export async function sendComplainsEmail({
  firstname,
  complainerEmail,
  hotelName,
  subject,
  message
}: EmailFormat): Promise<void> {
  // Get the complaint email template
  const complainsEmails = emailingOptions.clientComplains(
    firstname as string,
    complainerEmail as string,
    hotelName as string,
    subject as string,
    message as string
  );

  const viaEmail = "atnestly@gmail.com"

  try {
    await sendEmail({
      to: viaEmail,
      toName: "Hotel Complaints Team",
      subject: subject as string,
      htmlPart: complainsEmails,
    });
  } catch (error) {
    console.error('Error sending complaint email:', error);
    throw new Error('Failed to send complaint email');
  }
}

export async function sendHotelManagementCredentials({
  username,
  password,
  managerEmail,
  subject
}: EmailFormat): Promise<void> {
  // Get the credentials email template
  const emailTemplateFormat = emailingOptions.temporaryHotelAdminLoginPassword(
    username as string,
    password as string
  );

  try {
    await sendEmail({
      to: managerEmail as string,
      toName: "Hotel Manager",
      subject: subject || 'Hotel Management Credentials',
      htmlPart: emailTemplateFormat,
    });
  } catch (error) {
    console.error('Error sending credentials email:', error);
    throw new Error('Failed to send credentials email');
  }
}

export async function sendForgotPasswordEmail({
  firstname,
  password,
  email
}: EmailFormat): Promise<void> {
  const emailTemplate = emailingOptions.forgotPassword(
    firstname as string,
    password as string
  );

  try {
    await sendEmail({
      to: email as string,
      toName: firstname || "User",
      subject: 'Via Password Reset',
      htmlPart: emailTemplate,
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

export async function sendPasswordUpdateEmail({
  firstname,
  password,
  email
}: EmailFormat): Promise<void> {
  const emailTemplate = emailingOptions.updatePassword(
    firstname as string,
    password as string
  );

  try {
    await sendEmail({
      to: email as string,
      toName: firstname || "User",
      subject: 'Via Password Updated',
      htmlPart: emailTemplate,
    });
  } catch (error) {
    console.error('Error sending password update email:', error);
    throw new Error('Failed to send password update email');
  }
}

export async function inviteViaAdmin({
  inviteeUsername,
  inviteeEmail,
  emailTemplate
}: EmailFormat): Promise<void> {
  // Get the credentials email template

  try {
    await sendEmail({
      to: inviteeEmail as string,
      toName: inviteeUsername as string,
      subject: 'Via Admin Credentials',
      htmlPart: emailTemplate as string,
    });
  } catch (error) {
    console.error('Error sending credentials email:', error);
    throw new Error('Failed to send credentials email');
  }
}

export async function inviteHotelManager({
  inviteeUsername,
  inviteeEmail,
  emailTemplate
}: EmailFormat): Promise<void> {
  // Get the credentials email template

  try {
    await sendEmail({
      to: inviteeEmail as string,
      toName: inviteeUsername as string,
      subject: 'Hotel Management Credentials',
      htmlPart: emailTemplate as string,
    });
  } catch (error) {
    console.error('Error sending credentials email:', error);
    throw new Error('Failed to send credentials email');
  }
}

export async function inviteCustomer({
  inviteeUsername,
  inviteeEmail,
  emailTemplate
}: EmailFormat): Promise<void> {
  // Get the credentials email template

  try {
    await sendEmail({
      to: inviteeEmail as string,
      toName: inviteeUsername as string,
      subject: 'Customer Login Credentials',
      htmlPart: emailTemplate as string,
    });
  } catch (error) {
    console.error('Error sending credentials email:', error);
    throw new Error('Failed to send credentials email');
  }
}

export async function softwareGlitchEmail({
  username,
  emailTemplate
}: EmailFormat): Promise<void> {
  // Get the credentials email template

  try {
    await sendEmail({
      to: "ialainquentin@gmail.com",
      toName: username as string,
      subject: '[Action Needed]: Software Glitch Reported',
      htmlPart: emailTemplate as string,
    });
  } catch (error) {
    console.error('Error sending credentials email:', error);
    throw new Error('Failed to send credentials email');
  }
}