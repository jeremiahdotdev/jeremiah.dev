import { createHmac, timingSafeEqual } from "node:crypto";

import {
  getSpeechSigningSecret,
  SPEECH_TOKEN_TTL_MS,
} from "@/lib/assistant/speech-config";

type SpeechTokenPayload = {
  exp: number;
  textHash: string;
  v: 1;
};

type VerificationResult =
  | {
      success: true;
    }
  | {
      error: string;
      success: false;
    };

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getTextHash(text: string) {
  return createHmac("sha256", "assistant-speech-text")
    .update(text)
    .digest("base64url");
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSpeechToken(text: string) {
  const secret = getSpeechSigningSecret();

  if (!secret) {
    throw new Error("Missing ASSISTANT_SPEECH_SIGNING_SECRET.");
  }

  const payload: SpeechTokenPayload = {
    exp: Date.now() + SPEECH_TOKEN_TTL_MS,
    textHash: getTextHash(text),
    v: 1,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function verifySpeechToken({
  text,
  token,
}: {
  text: string;
  token: string;
}): VerificationResult {
  const secret = getSpeechSigningSecret();

  if (!secret) {
    return {
      error: "Speech authorization is not configured.",
      success: false,
    };
  }

  const [encodedPayload, receivedSignature] = token.split(".");

  if (!encodedPayload || !receivedSignature) {
    return {
      error: "Invalid speech authorization token.",
      success: false,
    };
  }

  const expectedSignature = signPayload(encodedPayload, secret);

  try {
    const receivedBuffer = Buffer.from(receivedSignature, "base64url");
    const expectedBuffer = Buffer.from(expectedSignature, "base64url");

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      return {
        error: "Invalid speech authorization token.",
        success: false,
      };
    }
  } catch {
    return {
      error: "Invalid speech authorization token.",
      success: false,
    };
  }

  let payload: SpeechTokenPayload;

  try {
    payload = JSON.parse(fromBase64Url(encodedPayload)) as SpeechTokenPayload;
  } catch {
    return {
      error: "Invalid speech authorization token.",
      success: false,
    };
  }

  if (payload.v !== 1 || payload.exp <= Date.now()) {
    return {
      error: "Speech authorization has expired.",
      success: false,
    };
  }

  if (payload.textHash !== getTextHash(text)) {
    return {
      error: "Speech authorization does not match this response.",
      success: false,
    };
  }

  return { success: true };
}
