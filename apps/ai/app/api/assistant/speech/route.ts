import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { normalizeSpeechText, validateNormalizedSpeechText } from "@/lib/assistant/speech-normalization";
import type { SpeechRequest, SpeechResponseError } from "@/lib/assistant/speech-contracts";
import {
  SPEECH_RATE_LIMIT_MAX_REQUESTS,
  SPEECH_RATE_LIMIT_WINDOW_MS,
} from "@/lib/assistant/speech-config";
import { synthesizeSpeech } from "@/lib/assistant/text-to-speech";
import { verifySpeechToken } from "@/lib/assistant/speech-authorization";
import { applyRateLimit } from "@/lib/chat/rate-limit";

function jsonError(body: SpeechResponseError, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let body: SpeechRequest;

  try {
    body = (await request.json()) as SpeechRequest;
  } catch {
    return jsonError(
      {
        code: "INVALID_REQUEST",
        error: "Malformed JSON request body.",
        success: false,
      },
      400,
    );
  }

  if (
    !body ||
    typeof body.text !== "string" ||
    typeof body.speechToken !== "string"
  ) {
    return jsonError(
      {
        code: "INVALID_REQUEST",
        error: "Invalid speech request body.",
        success: false,
      },
      400,
    );
  }

  const authorization = verifySpeechToken({
    text: body.text,
    token: body.speechToken,
  });

  if (!authorization.success) {
    return jsonError(
      {
        code: "INVALID_SPEECH_TOKEN",
        error: authorization.error,
        success: false,
      },
      403,
    );
  }

  const normalizedText = normalizeSpeechText(body.text);
  const validation = validateNormalizedSpeechText(normalizedText);

  if (!validation.success) {
    return jsonError(
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
  const rateLimit = applyRateLimit(`speech:${remoteIp}`, {
    maxRequests: SPEECH_RATE_LIMIT_MAX_REQUESTS,
    windowMs: SPEECH_RATE_LIMIT_WINDOW_MS,
  });

  if (rateLimit.limited) {
    return jsonError(
      {
        code: "RATE_LIMITED",
        error: "Voice playback is temporarily rate limited. Please try again soon.",
        success: false,
      },
      429,
    );
  }

  let upstream: Response;

  try {
    upstream = await synthesizeSpeech({
      signal: request.signal,
      text: validation.text,
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Voice synthesis timed out."
        : "Voice synthesis is unavailable right now.";

    return jsonError(
      {
        code: "TTS_FAILED",
        error: message,
        success: false,
      },
      502,
    );
  }

  if (!upstream.ok || !upstream.body) {
    let message = "Voice synthesis failed.";

    if (upstream.status === 401 || upstream.status === 403) {
      message = "Voice synthesis is not configured correctly.";
    } else if (upstream.status === 429) {
      message = "Voice synthesis is temporarily unavailable due to provider limits.";
    } else if (upstream.status >= 500) {
      message = "Voice synthesis is unavailable right now.";
    }

    return jsonError(
      {
        code: "TTS_FAILED",
        error: message,
        success: false,
      },
      upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502,
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": "audio/mpeg",
      "X-Content-Type-Options": "nosniff",
    },
    status: 200,
  });
}
