import { headers } from "next/headers";
import { NextResponse } from "next/server";

import type { ChatResponse } from "@/lib/chat/contracts";
import { applyRateLimit } from "@/lib/chat/rate-limit";
import { trimHistory, validateChatRequest } from "@/lib/chat/validation";
import { generateChatResponse } from "@/lib/openai/service";
import { verifyTurnstileToken } from "@/lib/turnstile/verify";

const OPENAI_TIMEOUT_MS = 25_000;

function jsonResponse(body: ChatResponse, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return jsonResponse(
      {
        code: "INVALID_REQUEST",
        error: "Malformed JSON request body.",
        success: false,
      },
      400,
    );
  }

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

  const headerStore = await headers();
  const remoteIp =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
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
    const content = await Promise.race([
      generateChatResponse({
        history: trimHistory(validation.data.history ?? []),
        message: validation.data.message,
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error("OpenAI request timed out."));
        }, OPENAI_TIMEOUT_MS);
      }),
    ]);

    return jsonResponse(
      {
        message: {
          content,
          role: "assistant",
        },
        success: true,
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
