import { describe, expect, it } from "vitest";

import {
  executeApprovedProfileContextSelection,
  parseApprovedProfileContextSelection,
} from "@/lib/context/context-tools";

describe("context tools", () => {
  it("parses a valid category selection", () => {
    expect(
      parseApprovedProfileContextSelection(
        JSON.stringify({
          category: "career",
        }),
      ),
    ).toEqual({
      category: "career",
    });
  });

  it("rejects selections without a valid category", () => {
    expect(() =>
      parseApprovedProfileContextSelection(
        JSON.stringify({
          category: "unknown",
        }),
      ),
    ).toThrow("Context tool call must include a valid category.");
  });

  it("returns approved context for the selected category", () => {
    const output = executeApprovedProfileContextSelection({
      category: "career",
    });

    expect(output.topic.topic).toBe("career");
    expect(output.context).toContain("## Professional summary");
    expect(output.context).toContain("## Professional experience");
  });
});
