import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get: vi.fn((name: string) =>
      name === "x-forwarded-for" ? "127.0.0.1" : null,
    ),
  })),
}));

vi.mock("@/lib/assistant/speech-authorization", () => ({
  verifySpeechToken: vi.fn(),
}));

vi.mock("@/lib/assistant/text-to-speech", () => ({
  synthesizeSpeech: vi.fn(),
}));

import { POST } from "@/app/api/assistant/speech/route";
import { verifySpeechToken } from "@/lib/assistant/speech-authorization";
import { synthesizeSpeech } from "@/lib/assistant/text-to-speech";

const mockedVerifySpeechToken = vi.mocked(verifySpeechToken);
const mockedSynthesizeSpeech = vi.mocked(synthesizeSpeech);

describe("POST /api/assistant/speech", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid bodies", async () => {
    const response = await POST(
      new Request("http://localhost/api/assistant/speech", {
        body: JSON.stringify({ speechToken: "token" }),
        method: "POST",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.code).toBe("INVALID_REQUEST");
  });

  it("rejects invalid speech tokens", async () => {
    mockedVerifySpeechToken.mockReturnValueOnce({
      error: "Invalid speech authorization token.",
      success: false,
    });

    const response = await POST(
      new Request("http://localhost/api/assistant/speech", {
        body: JSON.stringify({
          speechToken: "token",
          text: "Hello",
        }),
        method: "POST",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload.code).toBe("INVALID_SPEECH_TOKEN");
    expect(mockedSynthesizeSpeech).not.toHaveBeenCalled();
  });

  it("streams audio on success", async () => {
    mockedVerifySpeechToken.mockReturnValueOnce({ success: true });
    mockedSynthesizeSpeech.mockResolvedValueOnce(
      new Response(new ReadableStream(), {
        headers: {
          "Content-Type": "audio/mpeg",
        },
        status: 200,
      }),
    );

    const response = await POST(
      new Request("http://localhost/api/assistant/speech", {
        body: JSON.stringify({
          speechToken: "token",
          text: "Hello there",
        }),
        method: "POST",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("audio/mpeg");
  });

  it("returns a safe provider failure", async () => {
    mockedVerifySpeechToken.mockReturnValueOnce({ success: true });
    mockedSynthesizeSpeech.mockResolvedValueOnce(
      new Response(null, { status: 401 }),
    );

    const response = await POST(
      new Request("http://localhost/api/assistant/speech", {
        body: JSON.stringify({
          speechToken: "token",
          text: "Hello there",
        }),
        method: "POST",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.code).toBe("TTS_FAILED");
  });

  it("handles timeouts from elevenlabs", async () => {
    mockedVerifySpeechToken.mockReturnValueOnce({ success: true });
    mockedSynthesizeSpeech.mockRejectedValueOnce(
      Object.assign(new Error("aborted"), { name: "AbortError" }),
    );

    const response = await POST(
      new Request("http://localhost/api/assistant/speech", {
        body: JSON.stringify({
          speechToken: "token",
          text: "Hello there",
        }),
        method: "POST",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe("Voice synthesis timed out.");
  });
});
