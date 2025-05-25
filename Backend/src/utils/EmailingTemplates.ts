const template = (firstname: string, OTP: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Via Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff;">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; width: 56px; height: 56px; background-color: #f5f3e6; border-radius: 10px; position: relative; margin-bottom: 15px;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); width: 20px; height: 20px; background-color: #8c7c36;"></div>
      </div>
      <div style="text-align: center; font-size: 36px; font-weight: bold; color: #8c7c36; margin-bottom: 50px;">Via</div>
    </div>
    <div style="text-align: left; padding: 0 20px;">
      <div style="font-size: 24px; font-weight: bold; margin-bottom: 25px;">Hi ${firstname},</div>
      <div style="font-size: 16px; color: #333333; margin-bottom: 30px;">
        You recently requested to reset your password for your Via account. Please use the temporary password below to log in:
      </div>
      <div style="background-color: #f7f7f7; padding: 30px; text-align: center; border-radius: 4px; margin: 30px 0;">
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #333333; margin-bottom: 15px;">${OTP}</div>
        <div style="font-size: 14px; color: #666666;">This password will expire in 24 hours</div>
      </div>
      <div style="margin: 30px 0; color: #666666;">
        If you didn't request this password reset, please ignore this email.
      </div>
      <div style="margin: 40px 0;">
        Best regards,<br>
        The Via Team
      </div>
    </div>
    <div style="text-align: center; padding: 30px 0; color: #666666; border-top: 1px solid #eeeeee; font-size: 14px;">
      <div style="margin-bottom: 15px;">Need help? Contact our <a href="#" style="color: #8c7c36; text-decoration: none;">support team</a></div>
      <div style="margin: 15px 0;">
        <a href="#" style="color: #666666; text-decoration: none; margin: 0 5px;">Privacy Policy</a> •
        <a href="#" style="color: #666666; text-decoration: none; margin: 0 5px;">Terms of Service</a> •
        <a href="#" style="color: #666666; text-decoration: none; margin: 0 5px;">Unsubscribe</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

class EmailingOptions {
  forgotPassword(firstname: string, OTP: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Via Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff;">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; width: 56px; height: 56px; background-color: #f5f3e6; border-radius: 10px; position: relative; margin-bottom: 15px;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); width: 20px; height: 20px; background-color: #8c7c36;"></div>
      </div>
      <div style="text-align: center; font-size: 36px; font-weight: bold; color: #8c7c36; margin-bottom: 50px;">Via</div>
    </div>
    <div style="text-align: left; padding: 0 20px;">
      <div style="font-size: 24px; font-weight: bold; margin-bottom: 25px;">Hi ${firstname},</div>
      <div style="font-size: 16px; color: #333333; margin-bottom: 30px;">
        You recently requested to reset your password for your Via account. Please use the temporary password below to log in:
      </div>
      <div style="background-color: #f7f7f7; padding: 30px; text-align: center; border-radius: 4px; margin: 30px 0;">
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #333333; margin-bottom: 15px;">${OTP}</div>
        <div style="font-size: 14px; color: #666666;">This password will expire in 24 hours</div>
      </div>
      <div style="margin: 30px 0; color: #666666;">
        If you didn't request this password reset, please ignore this email.
      </div>
      <div style="margin: 40px 0;">
        Best regards,<br>
        The Via Team
      </div>
    </div>
    <div style="text-align: center; padding: 30px 0; color: #666666; border-top: 1px solid #eeeeee; font-size: 14px;">
      <div style="margin-bottom: 15px;">Need help? Contact our <a href="#" style="color: #8c7c36; text-decoration: none;">support team</a></div>
      <div style="margin: 15px 0;">
        <a href="#" style="color: #666666; text-decoration: none; margin: 0 5px;">Privacy Policy</a> •
        <a href="#" style="color: #666666; text-decoration: none; margin: 0 5px;">Terms of Service</a> •
        <a href="#" style="color: #666666; text-decoration: none; margin: 0 5px;">Unsubscribe</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
  }

  temporaryHotelAdminLoginPassword(firstname: string, OTP: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Via Admin Access</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff;">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; width: 56px; height: 56px; background-color: #f5f3e6; border-radius: 10px; position: relative; margin-bottom: 15px;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); width: 20px; height: 20px; background-color: #8c7c36;"></div>
      </div>
      <div style="text-align: center; font-size: 36px; font-weight: bold; color: #8c7c36; margin-bottom: 50px;">Via</div>
    </div>
    <div style="text-align: left; padding: 0 20px;">
      <div style="font-size: 24px; font-weight: bold; margin-bottom: 25px;">Hello ${firstname},</div>
      <div style="font-size: 16px; color: #333333; margin-bottom: 30px;">
        Welcome to the Via Hotel Management Platform. Here is your temporary login password to access your hotel admin dashboard:
      </div>
      <div style="background-color: #f7f7f7; padding: 30px; text-align: center; border-radius: 4px; margin: 30px 0;">
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #333333; margin-bottom: 15px;">${OTP}</div>
        <div style="font-size: 14px; color: #666666;">Please change your password after logging in. This password will expire in 48 hours.</div>
      </div>
      <div style="margin: 30px 0; color: #666666;">
        If you were not expecting this access or have any questions, kindly reach out to our support team.
      </div>
      <div style="margin: 40px 0;">
        Sincerely,<br>
        The Via Team
      </div>
    </div>
    <div style="text-align: center; padding: 30px 0; color: #666666; border-top: 1px solid #eeeeee; font-size: 14px;">
      <div style="margin-bottom: 15px;">Need help? Contact our <a href="#" style="color: #8c7c36; text-decoration: none;">support team</a></div>
      <div style="margin: 15px 0;">
        <a href="#" style="color: #666666; text-decoration: none; margin: 0 5px;">Privacy Policy</a> •
        <a href="#" style="color: #666666; text-decoration: none; margin: 0 5px;">Terms of Service</a> •
        <a href="#" style="color: #666666; text-decoration: none; margin: 0 5px;">Unsubscribe</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
  }

  updatePassword(firstname: string, OTP: string) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Via  Password Updated</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #fff;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-block; width: 56px; height: 56px; background-color: #f5f3e6; border-radius: 10px; position: relative; margin-bottom: 15px;">
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); width: 20px; height: 20px; background-color: #8c7c36;"></div>
        </div>
        <div style="font-size: 36px; font-weight: bold; color: #8c7c36;">Via </div>
      </div>
      <div style="padding: 0 20px;">
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 25px;">Hi ${firstname},</div>
        <div style="font-size: 16px; margin-bottom: 30px;">
          Your password has been successfully updated. You can now log in using the temporary password below:
        </div>
        <div style="background-color: #f7f7f7; padding: 30px; text-align: center; border-radius: 4px; margin: 30px 0;">
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #333;">${OTP}</div>
          <div style="font-size: 14px; color: #666;">This password will expire in 24 hours</div>
        </div>
        <div style="margin: 30px 0; color: #666;">
          If you did not make this change, please reset your password immediately and contact our support team.
        </div>
        <div style="margin: 40px 0;">
          Best regards,<br />
          The Via  Team
        </div>
      </div>
      <div style="text-align: center; padding: 30px 0; color: #666; border-top: 1px solid #eee; font-size: 14px;">
        <div style="margin-bottom: 15px;">Need help? Contact our <a href="#" style="color: #8c7c36; text-decoration: none;">support team</a></div>
        <div style="margin: 15px 0;">
          <a href="#" style="color: #666; text-decoration: none; margin: 0 5px;">Privacy Policy</a> •
          <a href="#" style="color: #666; text-decoration: none; margin: 0 5px;">Terms of Service</a> •
          <a href="#" style="color: #666; text-decoration: none; margin: 0 5px;">Unsubscribe</a>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  }

  clientComplains(name: string, email: string, hotelName: string, subject: string, message: string) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Client Complaint Received</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">

        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #8c7c36 0%, #a69147 100%); text-align: center; padding: 40px 20px;">
          <div style="display: inline-block; width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; position: relative; margin-bottom: 20px;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px; background-color: white; border-radius: 3px; transform: translate(-50%, -50%) rotate(45deg);"></div>
          </div>
          <h1 style="color: white; font-size: 28px; font-weight: 600; margin: 0; letter-spacing: 1px;">Via Travels</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px;">Client Complaint Notification</p>
        </div>

        <!-- Content Section -->
        <div style="padding: 40px 30px;">
          <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 20px; color: #2c3e50;">Dear Administrator,</h2>

          <p style="font-size: 16px; margin-bottom: 30px; color: #555;">
            A new complaint has been submitted. Please review the details below and take appropriate action.
          </p>

          <!-- Complaint Details Card -->
          <div style="background-color: #f8f9fa; border-left: 4px solid #8c7c36; padding: 25px; border-radius: 6px; margin-bottom: 30px;">
            <h3 style="color: #8c7c36; font-size: 18px; font-weight: 600; margin: 0 0 20px 0;">Complaint Details</h3>

            <div style="margin-bottom: 15px;">
              <strong style="color: #2c3e50; display: inline-block; width: 140px;">Client Name:</strong>
              <span style="color: #555;">${name}</span>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #2c3e50; display: inline-block; width: 140px;">Client Email:</strong>
              <span style="color: #555;">${email}</span>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #2c3e50; display: inline-block; width: 140px;">Hotel Property:</strong>
              <span style="color: #555;">${hotelName}</span>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #2c3e50; display: inline-block; width: 140px;">Subject:</strong>
              <span style="color: #555;">${subject}</span>
            </div>

            <div style="margin-top: 20px;">
              <strong style="color: #2c3e50;">Message:</strong>
              <div style="margin-top: 8px; padding: 15px; background-color: white; border-radius: 4px; border: 1px solid #e1e8ed; color: #555; white-space: pre-line;">${message}</div>
            </div>
          </div>

          <!-- Action Required -->
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
            <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">⚠️ Action Required</h4>
            <p style="color: #856404; margin: 0; font-size: 14px;">
              Please review this complaint promptly and respond to the client within 24 hours. If additional information is needed, contact the client directly using the provided email address.
            </p>
          </div>

          <p style="color: #666; font-size: 14px; margin-bottom: 30px;">
            This complaint was submitted on ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}.
          </p>

          <div style="margin: 40px 0; color: #555;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0 0 0; font-weight: 600; color: #8c7c36;">The Via Travels</p>
          </div>
        </div>

        <!-- Footer Section -->
        <div style="background-color: #f8f9fa; text-align: center; padding: 30px 20px; border-top: 1px solid #e9ecef;">
          <p style="color: #666; font-size: 14px; margin: 0 0 15px 0;">
            Need assistance? Contact our <a href="mailto:support@viahotels.com" style="color: #8c7c36; text-decoration: none; font-weight: 500;">support team</a>
          </p>

          <div style="margin: 15px 0;">
            <a href="#" style="color: #666; text-decoration: none; margin: 0 10px; font-size: 13px;">Privacy Policy</a>
            <span style="color: #ccc;">•</span>
            <a href="#" style="color: #666; text-decoration: none; margin: 0 10px; font-size: 13px;">Terms of Service</a>
            <span style="color: #ccc;">•</span>
            <a href="#" style="color: #666; text-decoration: none; margin: 0 10px; font-size: 13px;">Contact Us</a>
          </div>

          <p style="color: #999; font-size: 12px; margin: 20px 0 0 0;">
            © ${new Date().getFullYear()} Via Travels. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  </body>
  </html>
  `;
  }

}

export const emailingOptions = new EmailingOptions();
