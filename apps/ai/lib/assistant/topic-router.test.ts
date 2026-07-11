import { describe, expect, it } from "vitest";

import { inferProfileTopics } from "@/lib/assistant/topic-router";

describe("inferProfileTopics", () => {
  it("routes work and project questions to career", () => {
    expect(
      inferProfileTopics({
        message:
          "What projects has Jeremiah shipped and what is his frontend stack?",
      }),
    ).toEqual(["career"]);
  });

  it("routes education questions to academics", () => {
    expect(
      inferProfileTopics({
        message:
          "What degrees does Jeremiah have and what did he study in college?",
      }),
    ).toEqual(["academics"]);
  });

  it("routes theology questions to theology", () => {
    expect(
      inferProfileTopics({
        message:
          "How does Jeremiah think about theology and Christian apologetics?",
      }),
    ).toEqual(["theology"]);
  });

  it("keeps mixed work and school questions multi-topic", () => {
    expect(
      inferProfileTopics({
        message:
          "How did Jeremiah's mathematics education influence his software engineering work?",
      }),
    ).toEqual(["career", "academics"]);
  });

  it("uses broad context for general profile questions", () => {
    expect(
      inferProfileTopics({
        message: "Tell me about yourself.",
      }),
    ).toEqual(["career", "academics", "theology", "personal", "projects"]);
  });

  it("falls back to career and academics for ambiguous prompts", () => {
    expect(
      inferProfileTopics({
        message: "Can you answer a question for me?",
      }),
    ).toEqual(["career", "academics"]);
  });

  it("uses recent user history to preserve context", () => {
    expect(
      inferProfileTopics({
        history: [
          {
            content: "Tell me about Jeremiah's computer science degree.",
            role: "user",
          },
          {
            content: "He studied computer science and mathematics.",
            role: "assistant",
          },
        ],
        message: "What clubs was he involved in?",
      }),
    ).toEqual(["academics"]);
  });

  it("matches near-miss academic keywords with lower confidence", () => {
    expect(
      inferProfileTopics({
        message: "What was his computre scince background in coleg?",
      }),
    ).toEqual(["academics"]);
  });

  it("matches near-miss career keywords with lower confidence", () => {
    expect(
      inferProfileTopics({
        message: "Tell me about his portfoilo and technolgies at OReilly.",
      }),
    ).toEqual(["career", "projects"]);
  });

  it("routes personal lifestyle questions to personal", () => {
    expect(
      inferProfileTopics({
        message: "What does Jeremiah enjoy outside of work on weekends?",
      }),
    ).toEqual(["personal"]);
  });

  it("matches regex keyword phrasing for build questions", () => {
    expect(
      inferProfileTopics({
        message: "How is it made?",
      }),
    ).toEqual(["career", "projects"]);

    expect(
      inferProfileTopics({
        message: "How was this built?",
      }),
    ).toEqual(["career", "projects"]);
  });

  it("matches regex keyword phrasing for academics", () => {
    expect(
      inferProfileTopics({
        message: "Where did he go to college?",
      }),
    ).toEqual(["academics"]);
  });

  it("matches regex keyword phrasing for theology", () => {
    expect(
      inferProfileTopics({
        message: "How does he think about theology?",
      }),
    ).toEqual(["theology"]);
  });

  it("matches regex keyword phrasing for personal", () => {
    expect(
      inferProfileTopics({
        message: "What does he do outside of work?",
      }),
    ).toEqual(["personal"]);
  });

  it("matches typo-heavy outside-of-work phrasing", () => {
    expect(
      inferProfileTopics({
        message: "What duz he do outsied of wurk on wekends?",
      }),
    ).toEqual(["personal"]);
  });
});
