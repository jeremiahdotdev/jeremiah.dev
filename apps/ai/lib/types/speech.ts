export type SpeechRequest = {
  speechToken: string;
  text: string;
};

export type SpeechResponseErrorCode =
  | "INVALID_REQUEST"
  | "INVALID_SPEECH_TOKEN"
  | "RATE_LIMITED"
  | "TTS_FAILED";

export type SpeechResponseError = {
  code: SpeechResponseErrorCode;
  error: string;
  success: false;
};
