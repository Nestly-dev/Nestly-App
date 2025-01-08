import { Request, Response } from "express";
import { HttpStatusCodes } from "../utils/helpers";
import { database } from "../utils/config/database";
import { DataResponse, profileDataTypes, updateProfileDataTypes } from "../utils/types";
import { userProfiles, userTable } from '../utils/config/schema';
import { eq } from "drizzle-orm";


export class profileRepo {
  async checkExistingProfile(
    req: Request, res: Response,
  ): Promise<boolean> {
    const profile_id = req.user?.id as string;
    const existingUser = await database
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, profile_id))
      .limit(1);

    if (existingUser.length > 0) {
      return true
    }
    return false;
  }

  async registerProfile(req: Request, res: Response, profileData: profileDataTypes): Promise<DataResponse> {
    const existingProfile = await this.checkExistingProfile(req, res);
    const id = req.user?.id as string
    try {
      const data = {
        user_id: id,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone_number: profileData.phone_number,
        date_of_birth: profileData.date_of_birth,
        avatar_url: profileData.avatar_url,
        preferred_language: profileData.preferred_language,
        preferred_currency: profileData.preferred_currency
      }
      // First check if a given user has profile Registered.
      if (!existingProfile) {
        return {
          data: '',
          status: HttpStatusCodes.UNAUTHORIZED,
          message: "You can't Register Profile twice"
        }
      }
      const createProfile = await database
        .insert(userProfiles)
        .values(data)
        .returning()
        .then((rows) => rows[0]);
      return {
        data: createProfile,
        status: HttpStatusCodes.CREATED,
        message: "User Profile Created Successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error as string,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      }
    }

  }

  async updateProfile(req: Request, res: Response, profileData: updateProfileDataTypes): Promise<DataResponse> {
    const profile_id = req.params.profileId
    try {
      const data = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone_number: profileData.phone_number,
        date_of_birth: profileData.date_of_birth,
        avatar_url: profileData.avatar_url,
        preferred_language: profileData.preferred_language,
        preferred_currency: profileData.preferred_currency
      }
      const updatedProfile = await database
        .update(userProfiles)
        .set(data)
        .where(eq(userProfiles.id, profile_id))
        .returning()
        .then((rows) => rows[0]);
      return {
        data: updatedProfile,
        status: HttpStatusCodes.CREATED,
        message: "User Profile Updated Successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error as string,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      }
    }

  }

  async getSingleProfile(req: Request, res: Response): Promise<DataResponse> {
    try {
      const profile_id = req.params.profileId
      const profileData = await database
        .select({
          // User fields (excluding password)
          userId: userTable.id,
          profileId: userProfiles.id,
          username: userTable.username,
          firstName: userProfiles.first_name,
          lastName: userProfiles.last_name,
          email: userTable.email,
          default_auth_provider: userTable.auth_provider,
          phoneNumber: userProfiles.phone_number,
          dateOfBirth: userProfiles.date_of_birth,
          avatarUrl: userProfiles.avatar_url,
          preferredLanguage: userProfiles.preferred_language,
          preferredCurrency: userProfiles.preferred_currency,
          createdAt: userProfiles.created_at,
          updatedAt: userProfiles.updated_at
        })
        .from(userProfiles)
        .where(eq(userProfiles.id, profile_id))
        .innerJoin(userTable, eq(userProfiles.user_id, userTable.id));
      return {
        data: profileData,
        status: HttpStatusCodes.OK,
        message: "User Profile Retrieved Successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error as string,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      }
    }

  }

  async getAllProfile(req: Request, res: Response): Promise<DataResponse> {
    try {
      const profileData = await database
        .select({
          userId: userTable.id,
          profileId: userProfiles.id,
          username: userTable.username,
          firstName: userProfiles.first_name,
          lastName: userProfiles.last_name,
          email: userTable.email,
          default_auth_provider: userTable.auth_provider,
          phoneNumber: userProfiles.phone_number,
          dateOfBirth: userProfiles.date_of_birth,
          avatarUrl: userProfiles.avatar_url,
          preferredLanguage: userProfiles.preferred_language,
          preferredCurrency: userProfiles.preferred_currency,
          createdAt: userProfiles.created_at,
          updatedAt: userProfiles.updated_at
        })
        .from(userProfiles)
        .innerJoin(userTable, eq(userProfiles.user_id, userTable.id));
      return {
        data: profileData,
        status: HttpStatusCodes.OK,
        message: "User Profiles Retrieved Successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error as string,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      }
    }

  }

  async deleteProfile(req: Request, res: Response): Promise<DataResponse> {
    const profile_id = req.params.profileId
    try {
      const deletedProfile = await database
        .delete(userProfiles)
        .where(eq(userProfiles.id, profile_id))
        .returning()
        .then((rows) => rows[0]);
      return {
        data: deletedProfile,
        status: HttpStatusCodes.OK,
        message: "User Profile deleted Successfully"
      };
    } catch (error) {
      return {
        data: '',
        message: error as string,
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      }
    }

  }
}
export const profileRepository = new profileRepo();

