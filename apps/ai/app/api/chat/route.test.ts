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
}));

vi.mock("@/lib/assistant/speech-authorization", () => ({
  createSpeechToken: vi.fn(() => "speech-token"),
}));

import { POST } from "@/app/api/chat/route";
import { generateChatResponse } from "@/lib/openai/service";
import { verifyTurnstileToken } from "@/lib/turnstile/verify";

const mockedGenerateChatResponse = vi.mocked(generateChatResponse);
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
          message: "Hello",
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
          message: "Tell me about your work",
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
    });
  });

  it("returns a safe openai failure", async () => {
    mockedVerifyTurnstileToken.mockResolvedValueOnce({
      success: true,
    });
    mockedGenerateChatResponse.mockRejectedValueOnce(new Error("boom"));

    const response = await POST(
      new Request("http://localhost/api/chat", {
        body: JSON.stringify({
          message: "Tell me more",
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
