import { Audio, IAudio } from "../models/audio.model";
import { RESPONSE_MESSAGES, TRANSCRIPTION_AUDIO } from "../utils/constants";

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Minimal mock download: simulate network latency and basic URL validation
const mockDownloadAudio = async (audioUrl: string): Promise<void> => {
  if (!/^https?:\/\//i.test(audioUrl)) {
    throw new Error(RESPONSE_MESSAGES.INVALID_AUDIO_URL);
  }
  console.log(`[download] starting mock download: ${audioUrl}`);
  await delay(100); // simulate a short network delay
  console.log(`[download] completed mock download: ${audioUrl}`);
};

// Simple retry helper with linear backoff
const retry = async <T>(fn: () => Promise<T>, attempts = 3, baseMs = 100): Promise<T> => {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const opName = fn.name || "operation";
    const startedAt = Date.now();
    console.log(`[retry] ${opName} attempt ${attempt + 1}/${attempts}`);
    try {
      const result = await fn();
      const durationMs = Date.now() - startedAt;
      console.log(`[retry] ${opName} success in ${durationMs}ms`);
      return result;
    } catch (error) {
      lastError = error;
      const durationMs = Date.now() - startedAt;
      const willRetry = attempt < attempts - 1;
      const backoffMs = baseMs * (attempt + 1);
      console.log(
        `[retry] ${opName} failed on attempt ${attempt + 1}/${attempts} after ${durationMs}ms: ${
          error instanceof Error ? error.message : String(error)
        }${willRetry ? ` | retrying in ${backoffMs}ms` : " | no more retries"}`
      );
      if (willRetry) {
        await delay(backoffMs);
      }
    }
  }
  throw lastError;
};

export const createAudio = async (audioUrl: string): Promise<IAudio> => {
  await retry(() => mockDownloadAudio(audioUrl), 3, 100);

    //Mock audio
    const transcription = TRANSCRIPTION_AUDIO.message;

    const audio = await Audio.create({ audioUrl, transcription });
    return await audio.save();
}




