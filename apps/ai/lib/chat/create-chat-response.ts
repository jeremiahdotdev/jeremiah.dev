import { createSpeechToken } from "@/lib/assistant/speech-authorization";
import type { ChatResponse } from "@/lib/types/chat";
import { applyRateLimit } from "@/lib/chat/rate-limit";
import { trimHistory, validateChatRequest } from "@/lib/chat/validation";
import { verifyTurnstileToken } from "@/lib/gateways/turnstile";
import {
  generateChatResponse,
  transcribeAudioMessage,
} from "@/lib/gateways/openai";

const OPENAI_TIMEOUT_MS = 45_000;

function jsonResponse(body: ChatResponse, status: number) {
  return Response.json(body, { status });
}

function withTimeout<T>(promise: Promise<T>, message: string) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(message));
      }, OPENAI_TIMEOUT_MS);
    }),
  ]);
}

export async function createChatResponse({
  rawBody,
  remoteIp,
}: {
  rawBody: unknown;
  remoteIp: string;
}) {
  const validation = validateChatRequest(rawBody);

  if (!validation.success) {
    return jsonResponse(
      {
        code: "INVALID_REQUEST",
        error: validation.error,
        success: false,
      },
      400,
    );
  }

  const rateLimit = applyRateLimit(remoteIp);

  if (rateLimit.limited) {
    return jsonResponse(
      {
        code: "RATE_LIMITED",
        error: "Too many requests. Please wait a moment and try again.",
        success: false,
      },
      429,
    );
  }

  const turnstile = await verifyTurnstileToken({
    remoteIp: remoteIp === "unknown" ? undefined : remoteIp,
    token: validation.data.turnstileToken,
  });

  if (!turnstile.success) {
    const status =
      turnstile.code === "TURNSTILE_UNAVAILABLE"
        ? 503
        : turnstile.code === "TURNSTILE_MISSING"
          ? 400
          : 403;

    return jsonResponse(
      {
        code: "TURNSTILE_FAILED",
        error: turnstile.error,
        success: false,
      },
      status,
    );
  }

  try {
    const userMessage = await withTimeout(
      validation.data.input.mode === "voice"
        ? transcribeAudioMessage(validation.data.input.audio)
        : Promise.resolve(validation.data.input.message),
      "OpenAI request timed out.",
    );
    const content = await withTimeout(
      generateChatResponse({
        history: trimHistory(validation.data.history ?? []),
        message: userMessage,
      }),
      "OpenAI request timed out.",
    );

    return jsonResponse(
      {
        message: {
          content,
          role: "assistant",
          speechToken: createSpeechToken(content),
        },
        success: true,
        userMessage: {
          content: userMessage,
          role: "user",
        },
      },
      200,
    );
  } catch (error) {
    console.error("Chat route failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      ip: remoteIp,
    });

    return jsonResponse(
      {
        code: "OPENAI_FAILED",
        error: "The assistant is unavailable right now. Please try again.",
        success: false,
      },
      502,
    );
  }
}
