import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get: vi.fn((name: string) =>
      name === "x-forwarded-for" ? "127.0.0.1" : null,
    ),
  })),
}));

vi.mock("@/lib/turnstile/verify", () => ({
  verifyTurnstileToken: vi.fn(),
}));

vi.mock("@/lib/openai/service", () => ({
  generateChatResponse: vi.fn(),
  transcribeAudioMessage: vi.fn(),
}));

vi.mock("@/lib/assistant/speech-authorization", () => ({
  createSpeechToken: vi.fn(() => "speech-token"),
}));

import { POST } from "@/app/api/chat/route";
import { generateChatResponse } from "@/lib/openai/service";
import { transcribeAudioMessage } from "@/lib/openai/service";
import { verifyTurnstileToken } from "@/lib/turnstile/verify";

const mockedGenerateChatResponse = vi.mocked(generateChatResponse);
const mockedTranscribeAudioMessage = vi.mocked(transcribeAudioMessage);
const mockedVerifyTurnstileToken = vi.mocked(verifyTurnstileToken);

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid request bodies", async () => {
    const response = await POST(
      new Request("http://localhost/api/chat", {
        body: JSON.stringify({ turnstileToken: "token" }),
        method: "POST",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.code).toBe("INVALID_REQUEST");
  });

  it("rejects malformed json", async () => {
    const response = await POST(
      new Request("http://localhost/api/chat", {
        body: "{bad json",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.code).toBe("INVALID_REQUEST");
  });

  it("stops when turnstile verification fails", async () => {
    mockedVerifyTurnstileToken.mockResolvedValueOnce({
      code: "TURNSTILE_FAILED",
      error: "Turnstile verification failed.",
      success: false,
    });

    const response = await POST(
      new Request("http://localhost/api/chat", {
        body: JSON.stringify({
          input: {
            message: "Hello",
            mode: "text",
          },
          turnstileToken: "token",
        }),
        method: "POST",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload.code).toBe("TURNSTILE_FAILED");
    expect(mockedGenerateChatResponse).not.toHaveBeenCalled();
  });

  it("returns the assistant message on success", async () => {
    mockedVerifyTurnstileToken.mockResolvedValueOnce({
      success: true,
    });
    mockedGenerateChatResponse.mockResolvedValueOnce("Hello from Jeremiah.");

    const response = await POST(
      new Request("http://localhost/api/chat", {
        body: JSON.stringify({
          history: [{ content: "Earlier", role: "user" }],
          input: {
            message: "Tell me about your work",
            mode: "text",
          },
          turnstileToken: "token",
        }),
        method: "POST",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      message: {
        content: "Hello from Jeremiah.",
        role: "assistant",
        speechToken: "speech-token",
      },
      success: true,
      userMessage: {
        content: "Tell me about your work",
        role: "user",
      },
    });
  });

  it("transcribes voice input before generating a response", async () => {
    mockedVerifyTurnstileToken.mockResolvedValueOnce({
      success: true,
    });
    mockedTranscribeAudioMessage.mockResolvedValueOnce("Voice transcript");
    mockedGenerateChatResponse.mockResolvedValueOnce("Assistant reply");

    const response = await POST(
      new Request("http://localhost/api/chat", {
        body: JSON.stringify({
          input: {
            audio: {
              data: "UklGRiQAAABXQVZFZm10IA==",
              filename: "voice.webm",
              mimeType: "audio/webm",
            },
            mode: "voice",
          },
          turnstileToken: "token",
        }),
        method: "POST",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(mockedTranscribeAudioMessage).toHaveBeenCalledOnce();
    expect(mockedGenerateChatResponse).toHaveBeenCalledWith({
      history: [],
      message: "Voice transcript",
    });
    expect(payload.userMessage.content).toBe("Voice transcript");
  });

  it("returns a safe openai failure", async () => {
    mockedVerifyTurnstileToken.mockResolvedValueOnce({
      success: true,
    });
    mockedGenerateChatResponse.mockRejectedValueOnce(new Error("boom"));

    const response = await POST(
      new Request("http://localhost/api/chat", {
        body: JSON.stringify({
          input: {
            message: "Tell me more",
            mode: "text",
          },
          turnstileToken: "token",
        }),
        method: "POST",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.code).toBe("OPENAI_FAILED");
  });
});
