import { Response } from 'express';
import { database } from '../utils/config/database';
import { userTable } from '../utils/config/schema';
import { NoDataResponse, RegisterUserTypes } from '../utils/types';
import { eq } from 'drizzle-orm';
import { hash } from 'bcrypt';
import { HttpStatusCodes } from '../utils/helpers';
import { SECRETS } from '../utils/helpers';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as EmailValidator from 'email-validator';


export class AuthenticationRepository {
  private static readonly SALT_ROUNDS = SECRETS.SALT_ROUNDS;

  async checkExistingUser(
    email: string,
  ): Promise<{ emailValidationStatus: number, emailValidationMessage: string }> {
    const existingUser = await database
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        emailValidationStatus: HttpStatusCodes.UNAUTHORIZED,
        emailValidationMessage: 'User already exists',
      }
    }
    return {
      emailValidationStatus: HttpStatusCodes.OK,
      emailValidationMessage: 'Register user',
    };
  }

  async createUser(userData: RegisterUserTypes): Promise<object> {
    const createdUser = await database
      .insert(userTable)
      .values(userData)
      .returning()
      .then((rows) => rows[0]);
    return createdUser;
  }

  async validateUserData(
    userData: RegisterUserTypes,
  ): Promise<NoDataResponse> {
    if (!EmailValidator.validate(userData.email)) {
      return {
        message: 'Invalid email format',
        status: HttpStatusCodes.UNAUTHORIZED,
      };
    }
    if (userData.password.length < 8) {
      return {
        message: 'Password must be at least 8 characters long',
        status: HttpStatusCodes.BAD_REQUEST,
      };
    }
    return {
      message: "valid email",
      status: HttpStatusCodes.OK
    }
  }
  
  async hashPassword(password: string): Promise<string> {
    return hash(password, AuthenticationRepository.SALT_ROUNDS);
  }

  async findUserByEmail(email: string): Promise<Record<string, any>> {
    const user = await database
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);
    return user[0];
  }

  async findUserById(userId: string): Promise<object[]> {
    const user = await database
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);
    return user;
  }

  async comparePasswords(
    loginDataPassword: string,
    userPassword: string,
  ): Promise<Boolean> {
    const comparePasswordCredentials = await bcrypt.compare(
      loginDataPassword,
      userPassword,
    );
    return comparePasswordCredentials;
  }

  async generateToken(email: string): Promise<string> {
    const token = jwt.sign({ email }, SECRETS.ACCESS_TOKEN_SECRET);
    return token;
  }

  async generateResetToken(email: string): Promise<string> {
    return jwt.sign({ email }, SECRETS.ACCESS_TOKEN_SECRET, { expiresIn: '15min' });
  }

  async verifyResetToken(token: string): Promise<{ email: string } | null> {
    try {
      const payload = jwt.verify(token, SECRETS.ACCESS_TOKEN_SECRET) as {
        email: string;
      };
      return payload;
    } catch (error) {
      return null;
    }
  }

  async updateUserPassword(
    email: string,
    hashedPassword: string,
  ): Promise<void> {
    await database
      .update(userTable)
      .set({ password: hashedPassword })
      .where(eq(userTable.email, email));
  }

  async verifyEmailToken(token: string): Promise<{ email: string } | null> {
    try {
      const payload = jwt.verify(token, SECRETS.ACCESS_TOKEN_SECRET) as {
        email: string;
      };
      return payload;
    } catch (error) {
      return null;
    }
  }

  async markEmailAsVerified(email: string): Promise<void> {
    await database
      .update(userTable)
      .set({ email_verified: true })
      .where(eq(userTable.email, email));
  }
}