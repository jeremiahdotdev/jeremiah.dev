import OpenAI, { toFile } from "openai";
import type { EasyInputMessage } from "openai/resources/responses/responses";

import { getApprovedProfileContext } from "@/lib/assistant/profile";
import { assistantSystemPrompt } from "@/lib/assistant/system-prompt";
import { inferProfileTopics } from "@/lib/assistant/topic-router";
import { MAX_AUDIO_BYTES } from "@/lib/chat/constants";
import type { ChatAudioInput } from "@/lib/chat/contracts";
import { MAX_OPENAI_OUTPUT_TOKENS } from "@/lib/chat/constants";
import type { ChatMessage } from "@/lib/chat/contracts";

const DEFAULT_MODEL = "gpt-5.6-luna";
const DEFAULT_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";

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

export async function transcribeAudioMessage(audio: ChatAudioInput) {
  const client = getOpenAIClient();
  const model =
    process.env.OPENAI_TRANSCRIPTION_MODEL ?? DEFAULT_TRANSCRIPTION_MODEL;
  const bytes = Buffer.from(audio.data, "base64");

  if (!bytes.length || bytes.byteLength > MAX_AUDIO_BYTES) {
    throw new Error("Audio input is invalid or too large.");
  }

  const transcription = await client.audio.transcriptions.create({
    file: await toFile(bytes, audio.filename, {
      type: audio.mimeType,
    }),
    model,
  });
  const text = transcription.text.trim();

  if (!text) {
    throw new Error("OpenAI returned an empty transcription.");
  }

  return text;
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
