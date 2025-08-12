import { Router } from "express";
import { createAudioController } from "../controllers/audio.controller";

const router = Router();

router.post("/transcription", createAudioController);

export default router;