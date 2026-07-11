import { describe, expect, it } from "vitest";

import {
  normalizeSpeechText,
  validateNormalizedSpeechText,
} from "@/lib/assistant/speech-normalization";

describe("speech normalization", () => {
  it("removes markdown and urls", () => {
    const normalized = normalizeSpeechText(
      "## Heading\nHere is [a link](https://example.com) and https://openai.com",
    );

    expect(normalized).toBe("Heading Here is a link and");
  });

  it("replaces code fences", () => {
    const normalized = normalizeSpeechText(
      "Here is code:\n```ts\nconsole.log('hi')\n```",
    );

    expect(normalized).toContain(
      "I included a code example in the text response.",
    );
  });

  it("expands selected abbreviations", () => {
    const normalized = normalizeSpeechText("WebGL and Next.js run on AWS.");

    expect(normalized).toBe("Web G L and Next J S run on A W S.");
  });

  it("rejects overly long normalized text", () => {
    const normalized = "a".repeat(2_501);

    expect(validateNormalizedSpeechText(normalized)).toEqual({
      error: "This response is too long to synthesize.",
      success: false,
    });
  });
});
