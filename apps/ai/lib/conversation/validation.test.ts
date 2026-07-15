import { describe, expect, it } from "vitest";

import { MAX_CONVERSATION_HISTORY_MESSAGES } from "@/lib/constants/conversation";
import {
  trimConversationHistory,
  validateConversationRequest,
} from "@/lib/conversation/validation";

describe("validateConversationRequest", () => {
  it("rejects malformed bodies", () => {
    const result = validateConversationRequest(null);

    expect(result).toEqual({
      error: "Request body must be a JSON object.",
      success: false,
    });
  });

  it("rejects missing turnstile tokens", () => {
    const result = validateConversationRequest({
      input: {
        message: "Hello",
        mode: "text",
      },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toContain("Turnstile");
    }
  });

  it("rejects unsupported roles", () => {
    const result = validateConversationRequest({
      history: [{ content: "hello", role: "system" }],
      input: {
        message: "Hi",
        mode: "text",
      },
      turnstileToken: "token",
    });

    expect(result).toEqual({
      error: "History messages must use valid roles and text content.",
      success: false,
    });
  });

  it("trims and truncates history", () => {
    const history = Array.from(
      { length: MAX_CONVERSATION_HISTORY_MESSAGES + 5 },
      (_, index) => ({
        content: `message ${index}`,
        role: index % 2 === 0 ? "user" : "assistant",
      }),
    ) as Array<{ content: string; role: "user" | "assistant" }>;
    const result = validateConversationRequest({
      history,
      input: {
        message: "  Hi there  ",
        mode: "text",
      },
      turnstileToken: " token ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.history).toHaveLength(MAX_CONVERSATION_HISTORY_MESSAGES);
      expect(result.data.input).toEqual({
        message: "Hi there",
        mode: "text",
      });
      expect(result.data.turnstileToken).toBe("token");
    }

    expect(trimConversationHistory(history)).toHaveLength(MAX_CONVERSATION_HISTORY_MESSAGES);
  });

  it("accepts supported voice input", () => {
    const result = validateConversationRequest({
      input: {
        audio: {
          data: "UklGRiQAAABXQVZFZm10IA==",
          filename: "message.webm",
          mimeType: "audio/webm",
        },
        mode: "voice",
      },
      turnstileToken: "token",
    });

    expect(result.success).toBe(true);
  });
});
