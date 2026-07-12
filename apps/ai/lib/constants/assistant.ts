export const DEFAULT_ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
export const DEFAULT_ELEVENLABS_OUTPUT_FORMAT = "mp3_44100_128";
export const ELEVENLABS_TIMEOUT_MS = 20_000;
export const MAX_SPEECH_TEXT_LENGTH = 2_500;
export const SPEECH_RATE_LIMIT_MAX_REQUESTS = 6;
export const SPEECH_RATE_LIMIT_WINDOW_MS = 5 * 60_000;
export const SPEECH_TOKEN_TTL_MS = 10 * 60_000;

export const defaultVoiceSettings = {
  similarity_boost: 0.8,
  stability: 0.55,
  style: 0.1,
  use_speaker_boost: true,
};
