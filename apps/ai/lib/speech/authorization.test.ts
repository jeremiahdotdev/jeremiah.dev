import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createSpeechToken,
  verifySpeechToken,
} from "@/lib/speech/authorization";

describe("speech authorization", () => {
  afterEach(() => {
    delete process.env.ASSISTANT_SPEECH_SIGNING_SECRET;
    vi.useRealTimers();
  });

  it("creates and verifies a valid token", () => {
    process.env.ASSISTANT_SPEECH_SIGNING_SECRET = "secret";
    const token = createSpeechToken("Hello there");

    expect(
      verifySpeechToken({
        text: "Hello there",
        token,
      }),
    ).toEqual({ success: true });
  });

  it("rejects expired tokens", () => {
    process.env.ASSISTANT_SPEECH_SIGNING_SECRET = "secret";
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const token = createSpeechToken("Hello there");

    vi.setSystemTime(new Date("2026-01-01T00:11:00Z"));

    expect(
      verifySpeechToken({
        text: "Hello there",
        token,
      }),
    ).toEqual({
      error: "Speech authorization has expired.",
      success: false,
    });
  });

  it("rejects modified text", () => {
    process.env.ASSISTANT_SPEECH_SIGNING_SECRET = "secret";
    const token = createSpeechToken("Hello there");

    expect(
      verifySpeechToken({
        text: "Hello there but different",
        token,
      }),
    ).toEqual({
      error: "Speech authorization does not match this response.",
      success: false,
    });
  });
});
