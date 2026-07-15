import { describe, expect, it } from "vitest";

import {
  normalizeSpeechText,
  validateNormalizedSpeechText,
} from "@/lib/speech/normalization";

describe("speech normalization", () => {
  it("removes markdown and urls", () => {
    const normalized = normalizeSpeechText(
      "## Heading\nHere is **bold** and _italic_ and [a link](https://example.com) and https://openai.com\n> quoted line",
    );

    expect(normalized).toBe("Heading Here is bold and italic and a link and quoted line");
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
