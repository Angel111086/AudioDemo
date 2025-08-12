import { Request, Response } from "express";
import { createAudio } from "../services/audio.service";
import { sendSuccessResponse, sendErrorResponse } from "../utils/responseHandler";
import { HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES, RESPONSE_MESSAGES } from "../utils/constants";
import { AudioRequest, AudioResponse } from "../types/audio";

export const createAudioController = async (req: Request, res: Response) => {
    try {
        const { audioUrl } = req.body as AudioRequest;

        if (!audioUrl) {
            sendErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, HTTP_STATUS_MESSAGES.BAD_REQUEST, res, RESPONSE_MESSAGES.AUDIO_NOT_FOUND);
            return;
        }

        const audio = await createAudio(audioUrl);
        const audioResponse: AudioResponse = {
            id: audio._id.toString(),   
            audioUrl: audio.audioUrl,
            transcription: audio.transcription,
            createdAt: audio.createdAt,
        }
        sendSuccessResponse(HTTP_STATUS_CODES.CREATED, RESPONSE_MESSAGES.AUDIO_CREATED, res, audioResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : RESPONSE_MESSAGES.UNEXPECTED_ERROR;
        const isInvalidUrl = message === RESPONSE_MESSAGES.INVALID_AUDIO_URL;
        const statusCode = isInvalidUrl ? HTTP_STATUS_CODES.BAD_REQUEST : HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        const statusMessage = isInvalidUrl ? HTTP_STATUS_MESSAGES.BAD_REQUEST : HTTP_STATUS_MESSAGES.INTERNAL_SERVER_ERROR;
        sendErrorResponse(statusCode, statusMessage, res, { error: message });
    }
}

