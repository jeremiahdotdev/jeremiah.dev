import OpenAI from "openai";
import type { EasyInputMessage } from "openai/resources/responses/responses";

import { getApprovedProfileContext } from "@/lib/assistant/profile";
import { assistantSystemPrompt } from "@/lib/assistant/system-prompt";
import { inferProfileTopics } from "@/lib/assistant/topic-router";
import { MAX_OPENAI_OUTPUT_TOKENS } from "@/lib/chat/constants";
import type { ChatMessage } from "@/lib/chat/contracts";

const DEFAULT_MODEL = "gpt-5.6-luna";

let openAIClient: OpenAI | null = null;

function getOpenAIClient() {
  if (openAIClient) {
    return openAIClient;
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY.");
  }

  openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return openAIClient;
}

function toInputMessages(history: ChatMessage[], message: string): EasyInputMessage[] {
  return [
    ...history.map((item) => ({
      content: item.content,
      role: item.role,
      type: "message" as const,
    })),
    {
      content: message,
      role: "user",
      type: "message",
    },
  ];
}

export async function generateChatResponse({
  history,
  message,
}: {
  history: ChatMessage[];
  message: string;
}) {
  const client = getOpenAIClient();
  const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;
  let profileContext = "";

  try {
    const topics = inferProfileTopics({
      history,
      message,
    });
    profileContext = getApprovedProfileContext(topics).trim();
  } catch {
    profileContext = "";
  }

  const instructions = profileContext
    ? [
        assistantSystemPrompt,
        "Approved profile context:",
        profileContext,
      ].join("\n\n")
    : assistantSystemPrompt;

  const response = await client.responses.create({
    input: toInputMessages(history, message),
    instructions,
    max_output_tokens: MAX_OPENAI_OUTPUT_TOKENS,
    model,
    store: false,
  });
  const answer = response.output_text.trim();

  if (!answer) {
    throw new Error("OpenAI returned an empty response.");
  }

  return answer;
}
