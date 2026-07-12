export {
  defaultVoiceSettings,
  ELEVENLABS_TIMEOUT_MS,
  MAX_SPEECH_TEXT_LENGTH,
  SPEECH_RATE_LIMIT_MAX_REQUESTS,
  SPEECH_RATE_LIMIT_WINDOW_MS,
  SPEECH_TOKEN_TTL_MS,
} from "@/lib/constants/assistant";

import {
  DEFAULT_ELEVENLABS_MODEL_ID,
  DEFAULT_ELEVENLABS_OUTPUT_FORMAT,
} from "@/lib/constants/assistant";

export function getSpeechSigningSecret() {
  return process.env.ASSISTANT_SPEECH_SIGNING_SECRET ?? "";
}

export function getElevenLabsConfig() {
  const apiKey =
    process.env.ELEVENLABS_API_KEY ?? process.env.ELEVEN_LABS_KEY ?? "";
  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? "";
  const modelId =
    process.env.ELEVENLABS_MODEL_ID ?? DEFAULT_ELEVENLABS_MODEL_ID;
  const outputFormat =
    process.env.ELEVENLABS_OUTPUT_FORMAT ?? DEFAULT_ELEVENLABS_OUTPUT_FORMAT;

  return {
    apiKey,
    modelId,
    outputFormat,
    voiceId,
  };
}
