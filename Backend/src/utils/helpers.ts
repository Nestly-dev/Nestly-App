import { config } from "dotenv";
config();

type EnvironmentVariables = {
  AWS_BUCKET_NAME: string;
  ACCESS_TOKEN_SECRET: string;
  SALT_ROUNDS: number;
  PORT: number;
  NODE_ENV: "development" | "production";
  NEON_DATABASE_URL: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  EMAIL_USER: string
  EMAIL_PASSWORD: string,
  COMPLAINTS_EMAIL: string
}

export enum HttpStatusCodes {
  // Success
  OK = 200,
  // Created Resource
  CREATED = 201,
  // Client Error
  BAD_REQUEST = 400,
  // Unauthorized
  UNAUTHORIZED = 401,
  // Forbidden
  FORBIDDEN = 403,
  // Not Found
  NOT_FOUND = 404,
  // Server Error
  INTERNAL_SERVER_ERROR = 500,
  // Bad Gateway
  BAD_GATEWAY = 502,
}

export const SECRETS: EnvironmentVariables = {
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME as string,
  PORT: parseInt(process.env.PORT!),
  NODE_ENV: process.env.NODE_ENV as "development" | "production",
  NEON_DATABASE_URL: process.env.NEON_DATABASE_URL!,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS!),
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  AWS_REGION: process.env.AWS_REGION as string,
  EMAIL_USER: process.env.EMAIL_USER as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
  COMPLAINTS_EMAIL: process.env.COMPLAINTS_EMAIL as string
}


