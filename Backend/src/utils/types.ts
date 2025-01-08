import { HttpStatusCodes } from "./helpers";

// Define the newUserTypes type
export type RegisterUserTypes = {
  username: string;
  email: string;
  password: string;
  email_verified: boolean;
};

export type UserDataProfile = {
  id: string;
  username: string;
  email: string;
  password: string;
  auth_provider: string;
  email_verified: boolean;
}

export interface UserTypes {
  id: string;
  username: string;
  email: string;
  password: string;
  auth_provider: string
  email_verified: boolean;
}

export type loginDataType = {
  email: string;
  password: string;
}

export type resetPasswordDataType = {
  email: string;
  password: string;
  confirmPassword: string;
};

export interface NoDataResponse {
  message: string,
  status: number
}

export interface DataResponse {
  message: string,
  status: number,
  data: any
}

export interface profileDataTypes {
  userId: number,
  first_name: string,
  last_name: string,
  phone_number: string,
  date_of_birth: string,
  avatar_url: string,
  preferred_language: string,
  preferred_currency: string
}

export interface updateProfileDataTypes {
  profile_id: string
  first_name: string,
  last_name: string,
  phone_number: string,
  date_of_birth: string,
  avatar_url: string,
  preferred_language: string,
  preferred_currency: string
}

