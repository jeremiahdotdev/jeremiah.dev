import {
  MAX_HISTORY_MESSAGES,
  MAX_MESSAGE_LENGTH,
} from "@/lib/chat/constants";
import type { ChatMessage, ChatRequest } from "@/lib/chat/contracts";

type ValidationSuccess = {
  data: ChatRequest;
  success: true;
};

type ValidationFailure = {
  error: string;
  success: false;
};

type ValidationResult = ValidationSuccess | ValidationFailure;

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

export function trimHistory(history: ChatMessage[]) {
  return history.slice(-MAX_HISTORY_MESSAGES);
}

export function validateChatRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object.", success: false };
  }

  const { history, message, turnstileToken } = body as {
    history?: unknown;
    message?: unknown;
    turnstileToken?: unknown;
  };

  const normalizedMessage = normalizeMessage(message);

  if (!normalizedMessage) {
    return {
      error: "Message must be non-empty and within the allowed length.",
      success: false,
    };
  }

  if (typeof turnstileToken !== "string" || !turnstileToken.trim()) {
    return {
      error: "Turnstile verification token is required.",
      success: false,
    };
  }

  if (history === undefined) {
    return {
      data: {
        message: normalizedMessage,
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
      message: normalizedMessage,
      turnstileToken: turnstileToken.trim(),
    },
    success: true,
  };
}
