import { Response } from "express";
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES, RESPONSE_MESSAGES } from "./constants";

export const sendSuccessResponse = (statusCode: number, message: string, res: Response, data?: any) => {        
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}

export const sendErrorResponse = (statusCode: number, message: string, res: Response, data?: any) => {
    res.status(statusCode).json({
        success: false,
        message,
        data,
    });
}
