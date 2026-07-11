import {
  MAX_AUDIO_BYTES,
  MAX_HISTORY_MESSAGES,
  MAX_MESSAGE_LENGTH,
} from "@/lib/chat/constants";
import type {
  ChatAudioInput,
  ChatInput,
  ChatMessage,
  ChatRequest,
} from "@/lib/chat/contracts";

type ValidationSuccess = {
  data: ChatRequest;
  success: true;
};

type ValidationFailure = {
  error: string;
  success: false;
};

type ValidationResult = ValidationSuccess | ValidationFailure;

const AUDIO_BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/;
const SUPPORTED_AUDIO_MIME_TYPES = new Set([
  "audio/m4a",
  "audio/mp3",
  "audio/mp4",
  "audio/mpeg",
  "audio/mpga",
  "audio/ogg",
  "audio/webm",
  "audio/wav",
]);

function normalizeMessage(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH) {
    return null;
  }

  return trimmed;
}

function isExpectedRole(value: unknown): value is ChatMessage["role"] {
  return value === "user" || value === "assistant";
}

function normalizeAudioInput(value: unknown): ChatAudioInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const { data, filename, mimeType } = value as {
    data?: unknown;
    filename?: unknown;
    mimeType?: unknown;
  };

  if (
    typeof data !== "string" ||
    typeof filename !== "string" ||
    typeof mimeType !== "string"
  ) {
    return null;
  }

  const normalizedData = data.trim();
  const normalizedFilename = filename.trim();
  const normalizedMimeType = mimeType.trim().toLowerCase();
  const normalizedMimeTypeBase = normalizedMimeType.split(";")[0]?.trim() ?? "";

  if (
    !normalizedData ||
    !normalizedFilename ||
    !SUPPORTED_AUDIO_MIME_TYPES.has(normalizedMimeTypeBase) ||
    !AUDIO_BASE64_PATTERN.test(normalizedData)
  ) {
    return null;
  }

  const estimatedBytes = Math.floor((normalizedData.length * 3) / 4);

  if (estimatedBytes <= 0 || estimatedBytes > MAX_AUDIO_BYTES) {
    return null;
  }

  return {
    data: normalizedData,
    filename: normalizedFilename,
    mimeType: normalizedMimeTypeBase,
  };
}

function normalizeInput(value: unknown): ChatInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const { audio, message, mode } = value as {
    audio?: unknown;
    message?: unknown;
    mode?: unknown;
  };

  if (mode === "text") {
    const normalizedMessage = normalizeMessage(message);

    if (!normalizedMessage) {
      return null;
    }

    return {
      message: normalizedMessage,
      mode,
    };
  }

  if (mode === "voice") {
    const normalizedAudio = normalizeAudioInput(audio);

    if (!normalizedAudio) {
      return null;
    }

    return {
      audio: normalizedAudio,
      mode,
    };
  }

  return null;
}

export function trimHistory(history: ChatMessage[]) {
  return history.slice(-MAX_HISTORY_MESSAGES);
}

export function validateChatRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object.", success: false };
  }

  const { history, input, turnstileToken } = body as {
    history?: unknown;
    input?: unknown;
    turnstileToken?: unknown;
  };
  const normalizedInput = normalizeInput(input);

  if (typeof turnstileToken !== "string" || !turnstileToken.trim()) {
    return {
      error: "Turnstile verification token is required.",
      success: false,
    };
  }

  if (!normalizedInput) {
    return {
      error: "Input must include either a text message or a supported audio clip.",
      success: false,
    };
  }

  if (history === undefined) {
    return {
      data: {
        input: normalizedInput,
        turnstileToken: turnstileToken.trim(),
      },
      success: true,
    };
  }

  if (!Array.isArray(history)) {
    return { error: "History must be an array of messages.", success: false };
  }

  const validatedHistory: ChatMessage[] = [];

  for (const item of history.slice(-MAX_HISTORY_MESSAGES)) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return { error: "History entries must be objects.", success: false };
    }

    const { content, role } = item as {
      content?: unknown;
      role?: unknown;
    };
    const normalizedContent = normalizeMessage(content);

    if (!isExpectedRole(role) || !normalizedContent) {
      return {
        error: "History messages must use valid roles and text content.",
        success: false,
      };
    }

    validatedHistory.push({
      content: normalizedContent,
      role,
    });
  }

  return {
    data: {
      history: validatedHistory,
      input: normalizedInput,
      turnstileToken: turnstileToken.trim(),
    },
    success: true,
  };
}
