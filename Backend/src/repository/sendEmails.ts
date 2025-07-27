import { sendMailjetEmail } from '../repository/mailjet';
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
    await sendMailjetEmail({
      toEmail: viaEmail,
      toName: "Hotel Complaints Team",
      fromEmail: SECRETS.FROM_EMAIL,
      fromName: `${firstname}`,
      subject: subject as string,
      html: complainsEmails,
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
    await sendMailjetEmail({
      toEmail: managerEmail as string,
      toName: "Hotel Manager",
      fromEmail: SECRETS.FROM_EMAIL,
      fromName: "Hotel Management",
      subject: subject || 'Hotel Management Credentials',
      html: emailTemplateFormat,
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
    await sendMailjetEmail({
      toEmail: email as string,
      toName: firstname || "User",
      fromEmail: SECRETS.FROM_EMAIL,
      fromName: "Via Password Reset",
      subject: 'Via Password Reset',
      html: emailTemplate,
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
    await sendMailjetEmail({
      toEmail: email as string,
      toName: firstname || "User",
      fromEmail: SECRETS.FROM_EMAIL,
      fromName: "Via Password Update",
      subject: 'Via Password Updated',
      html: emailTemplate,
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
    await sendMailjetEmail({
      toEmail: inviteeEmail as string,
      toName: inviteeUsername as string,
      fromEmail: SECRETS.FROM_EMAIL,
      fromName: "Via Administration",
      subject: 'Via Admin Credentials',
      html: emailTemplate as string,
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
    await sendMailjetEmail({
      toEmail: inviteeEmail as string,
      toName: inviteeUsername as string,
      fromEmail: SECRETS.FROM_EMAIL,
      fromName: "Hotel Management",
      subject: 'Hotel Management Credentials',
      html: emailTemplate as string,
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
    await sendMailjetEmail({
      toEmail: inviteeEmail as string,
      toName: inviteeUsername as string,
      fromEmail: SECRETS.FROM_EMAIL,
      fromName: "Via Administration",
      subject: 'Customer Login Credentials',
      html: emailTemplate as string,
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
    await sendMailjetEmail({
      toEmail: "ialainquentin@gmail.com",
      toName: username as string,
      fromEmail: SECRETS.FROM_EMAIL,
      fromName: "Software Glitch Report",
      subject: '[Action Needed]: Software Glitch Reported',
      html: emailTemplate as string,
    });
  } catch (error) {
    console.error('Error sending credentials email:', error);
    throw new Error('Failed to send credentials email');
  }
}
