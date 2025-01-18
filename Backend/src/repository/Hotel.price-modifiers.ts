import { Request } from "express";
import { HttpStatusCodes } from "../utils/helpers";
import { database } from "../utils/config/database";
import { eq, and } from "drizzle-orm";
import { DataResponse } from "../utils/types";
import { priceModifiers } from "../utils/config/schema";

// Define types using Drizzle's type inference
type NewPriceModifier = typeof priceModifiers.$inferInsert;
type PriceModifier = typeof priceModifiers.$inferSelect;

class PriceModifierOperations {
  async createPriceModifier(req: Request): Promise<DataResponse> {
    const roomId = req.params.roomId;
    try {
      const modifierData: NewPriceModifier = {
        room_id: roomId,
        modifier_type: req.body.modifier_type,
        percentage: req.body.percentage,
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date)
      };

      const [createdModifier] = await database
        .insert(priceModifiers)
        .values(modifierData)
        .returning();

      return {
        data: createdModifier,
        message: "Price modifier created successfully",
        status: HttpStatusCodes.CREATED
      };
    } catch (error) {
      return {
        data: null,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  async getPriceModifiersByRoomId(req: Request): Promise<DataResponse> {
    const roomId = req.params.roomId;

    try {
      const modifiers = await database
        .select()
        .from(priceModifiers)
        .where(eq(priceModifiers.room_id, roomId));

      return {
        data: modifiers,
        message: "Price modifiers fetched successfully",
        status: HttpStatusCodes.OK
      };
    } catch (error) {
      return {
        data: null,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  async updatePriceModifier(req: Request): Promise<DataResponse> {
    const { roomId, discountId } = req.params;
    const updateData = req.body;

    try {
      const updatedData: Partial<NewPriceModifier> = {
        ...updateData,
        updated_at: new Date(),
        start_date: updateData.start_date ? new Date(updateData.start_date) : undefined,
        end_date: updateData.end_date ? new Date(updateData.end_date) : undefined
      };

      const [updatedModifier] = await database
        .update(priceModifiers)
        .set(updatedData)
        .where(
          and(
            eq(priceModifiers.room_id, roomId),
            eq(priceModifiers.id, discountId)
          )
        )
        .returning();

      if (!updatedModifier) {
        return {
          data: null,
          message: "Price modifier not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      return {
        data: updatedModifier,
        message: "Price modifier updated successfully",
        status: HttpStatusCodes.OK
      };
    } catch (error) {
      return {
        data: null,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }

  async deletePriceModifier(req: Request): Promise<DataResponse> {
    const { roomId, discountId } = req.params;

    try {
      const [deletedModifier] = await database
        .delete(priceModifiers)
        .where(
          and(
            eq(priceModifiers.room_id, roomId),
            eq(priceModifiers.id, discountId)
          )
        )
        .returning();

      if (!deletedModifier) {
        return {
          data: null,
          message: "Price modifier not found",
          status: HttpStatusCodes.NOT_FOUND
        };
      }

      return {
        data: deletedModifier,
        message: "Price modifier deleted successfully",
        status: HttpStatusCodes.OK
      };
    } catch (error) {
      return {
        data: null,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR
      };
    }
  }
}

export const priceModifierOperation = new PriceModifierOperations();
