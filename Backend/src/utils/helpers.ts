import { config } from "dotenv";
config();

interface EnvironmentVariables {
  ACCESS_TOKEN_SECRET: string;
  SALT_ROUNDS: number;
  PORT: number;
  NODE_ENV: "development" | "production";
  NEON_DATABASE_URL: string,
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
  PORT: parseInt(process.env.PORT!),
  NODE_ENV: process.env.NODE_ENV as "development" | "production",
  NEON_DATABASE_URL: process.env.NEON_DATABASE_URL!,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS!)
}


