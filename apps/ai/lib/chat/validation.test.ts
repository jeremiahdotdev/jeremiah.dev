import { describe, expect, it } from "vitest";

import { MAX_HISTORY_MESSAGES } from "@/lib/chat/constants";
import { trimHistory, validateChatRequest } from "@/lib/chat/validation";

describe("validateChatRequest", () => {
  it("rejects malformed bodies", () => {
    const result = validateChatRequest(null);

    expect(result).toEqual({
      error: "Request body must be a JSON object.",
      success: false,
    });
  });

  it("rejects missing turnstile tokens", () => {
    const result = validateChatRequest({
      message: "Hello",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toContain("Turnstile");
    }
  });

  it("rejects unsupported roles", () => {
    const result = validateChatRequest({
      history: [{ content: "hello", role: "system" }],
      message: "Hi",
      turnstileToken: "token",
    });

    expect(result).toEqual({
      error: "History messages must use valid roles and text content.",
      success: false,
    });
  });

  it("trims and truncates history", () => {
    const history = Array.from({ length: MAX_HISTORY_MESSAGES + 5 }, (_, index) => ({
      content: `message ${index}`,
      role: index % 2 === 0 ? "user" : "assistant",
    })) as Array<{ content: string; role: "user" | "assistant" }>;
    const result = validateChatRequest({
      history,
      message: "  Hi there  ",
      turnstileToken: " token ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.history).toHaveLength(MAX_HISTORY_MESSAGES);
      expect(result.data.message).toBe("Hi there");
      expect(result.data.turnstileToken).toBe("token");
    }

    expect(trimHistory(history)).toHaveLength(MAX_HISTORY_MESSAGES);
  });
});
