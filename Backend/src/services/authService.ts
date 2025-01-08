// src/services/AuthenticationService.ts
import { Request, Response } from 'express';
import { HttpStatusCodes } from '../utils/helpers';
import { loginDataType, RegisterUserTypes, resetPasswordDataType, UserDataProfile } from '../utils/types';
import { AuthenticationRepository } from '../repository/User';


export class AuthenticationService {
  private repository: AuthenticationRepository = new AuthenticationRepository;

  // Register Service
  async register(req: Request, res: Response): Promise<Response> {
    const userData: RegisterUserTypes = req.body;
    try {
      // Validate the validity of the email (format)
      const { message, status } = await this.repository.validateUserData(userData);
      if (status !== HttpStatusCodes.OK) {
        return res.status(status).json({
          status: status,
          message: message
        })
      }
      // Check if user exists in the database
      const { emailValidationMessage, emailValidationStatus } = await this.repository.checkExistingUser(userData.email);

      // user Exists in the database
      if (emailValidationStatus !== HttpStatusCodes.OK) {
        return res.status(emailValidationStatus).json({
          status: emailValidationStatus,
          message: emailValidationMessage
        })
      }
      // Register user because the user doesnot exist in the database
      const hashedPassword = await this.repository.hashPassword(userData.password);
      const newUser = await this.repository.createUser({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        email_verified: false
      });

      const user = newUser as UserDataProfile;
      const { email } = user;
      // create verification token
      const verificationToken = await this.repository.generateToken(email);
      const verificationLink = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;

      return res.status(HttpStatusCodes.CREATED).json({
        message: "User registered successfully. Please check your email to verify your account.",
        user,
        emailVerificationLink: verificationLink
      });
    } catch (error) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  // Login Service
  async login(req: Request, res: Response): Promise<Response> {
    const loginData: loginDataType = req.body
    try {
      const user = await this.repository.findUserByEmail(loginData.email);
      if (!user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({
          message: 'Invalid email',
        });
      }

      const isPasswordValid = await this.repository.comparePasswords(loginData.password, user.password);
      if (!isPasswordValid) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({
          message: 'Invalid password',
        });
      }
      // Generate token
      const token = await this.repository.generateToken(loginData.email);
      await res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7
      });

      return res.status(HttpStatusCodes.OK).json({
        message: 'Login successful',
        user
      });
    } catch (error) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  // Forgot password
  async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    try {
      const user = await this.repository.findUserByEmail(email);
      if (!user) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          message: 'No account found with this email address.',
        });
      }

      const resetToken = await this.repository.generateResetToken(email);
      const resetLink = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

      return res.status(HttpStatusCodes.OK).json({
        message: 'Password reset link has been sent to your email.',
        resetLink
      });
    } catch (error) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  // Reset Password
  async resetPassword(req: Request, res: Response): Promise<Response> {
    const { resetToken } = req.params;
    const { password, confirmPassword }: resetPasswordDataType = req.body;

    try {
      if (password !== confirmPassword) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          message: 'Passwords do not match',
        });
      }

      const tokenPayload = await this.repository.verifyResetToken(resetToken);

      if (!tokenPayload) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          message: 'Invalid or expired reset token',
        });
      }

      const hashedPassword = await this.repository.hashPassword(password);
      await this.repository.updateUserPassword(tokenPayload.email, hashedPassword);

      return res.status(HttpStatusCodes.OK).json({
        message: 'Password has been reset successfully',
      });
    } catch (error) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  // Verify Email
  async verifyEmail(req: Request, res: Response): Promise<Response> {
    const { verifyToken } = req.params;
    try {
      const payload = await this.repository.verifyEmailToken(verifyToken);

      if (!payload) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          message: 'Invalid or expired verification token.',
        });
      }

      const user = await this.repository.findUserByEmail(payload.email);

      if (!user) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          message: 'User not found.',
        });
      }

      if (user.email_verified) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          message: 'This email is already verified.',
        });
      }

      await this.repository.markEmailAsVerified(payload.email);

      return res.status(HttpStatusCodes.OK).json({
        message: 'Email verified successfully.',
      });
    } catch (error) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
    });
    // Send a response indicating successful logout
    return res.status(HttpStatusCodes.OK).json({ message: 'Successfully logged out' });
  }

}
