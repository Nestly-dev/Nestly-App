import { Request, Response } from "express";
import { roomRepository } from "../repository/Hotel.rooms";
import { MulterRequest } from "../utils/config/multer";
import { HttpStatusCodes } from '../utils/helpers';


class HotelRooms {
  async createRoom(req: Request, res: Response): Promise<Response> {
    try {
      const { data, message, status } = await roomRepository.RegisterRoom(req);
      return res.status(status).json({
        message: message,
        data: data
      })

    } catch (error) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error
      })
    }
  }

  async getRoomByHotelId(req: Request, res: Response) {
    try {
      const { data, message, status } = await roomRepository.getRoomTypesByHotelId(req);
      return res.status(status).json({
        message: message,
        data: data
      })

    } catch (error) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error
      })
    }
  }

  async getSpecificRoom(req: MulterRequest, res: Response) {
    try {
      const { data, message, status } = await roomRepository.getSpecificRoomType(req);
      return res.status(status).json({
        message: message,
        data: data
      })

    } catch (error) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error
      })
    }
  }

  async updateRoom(req: Request, res: Response) {
    try {
      const { data, message, status } = await roomRepository.updateRoomType(req);
      return res.status(status).json({
        message: message,
        data: data
      })

    } catch (error) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error
      })
    }
  }

  async deleteRoom(req: Request, res: Response) {
    try {
      const { data, message, status } = await roomRepository.deleteRoomType(req);
      return res.status(status).json({
        message: message,
        data: data
      })

    } catch (error) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error
      })
    }
  }

  async deleteAllRoom(req: Request, res: Response) {
    try {
      const { data, message, status } = await roomRepository.deleteAllRoomTypes(req);
      return res.status(status).json({
        message: message,
        data: data
      })

    } catch (error) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error
      })
    }
  }
}

export const HotelRoomService = new HotelRooms()

