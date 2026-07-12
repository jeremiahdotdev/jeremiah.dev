import OpenAI, { toFile } from "openai";
import type {
  EasyInputMessage,
  ResponseFunctionToolCall,
  ResponseFunctionToolCallOutputItem,
} from "openai/resources/responses/responses";

import {
  approvedProfileContextTool,
  executeApprovedProfileContextSelection,
  parseApprovedProfileContextSelection,
} from "@/lib/assistant/context-tools";
import { getApprovedProfileTopics } from "@/lib/assistant/profile";
import { assistantSystemPrompt } from "@/lib/assistant/system-prompt";
import { MAX_AUDIO_BYTES, MAX_OPENAI_OUTPUT_TOKENS } from "@/lib/constants/chat";
import type {
  AssistantResponseContent,
  ChatAudioInput,
  ChatMessage,
} from "@/lib/types/chat";

const DEFAULT_MODEL = "gpt-5.6-luna";
const DEFAULT_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";

let openAIClient: OpenAI | null = null;
const approvedProfileTopicNames = getApprovedProfileTopics().join(", ");

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

function buildToolDrivenInstructions() {
  return [
    buildResponseFormatInstructions(),
    assistantSystemPrompt,
    "Approved profile categories are available through the get_approved_profile_context tool.",
    "For questions about Jeremiah's background, work, education, projects, theology, personal life, or how this assistant works, call the tool for the single most relevant category before answering.",
    "If more than one category is needed, call the tool once per category.",
    "Only use information returned by that tool for factual profile claims.",
    "If the user is only greeting you or making small talk that does not need profile facts, you may answer without calling the tool.",
    "Available approved profile categories:",
    approvedProfileTopicNames,
  ].join("\n\n");
}

function buildResponseFormatInstructions() {
  return [
    "Return exactly one JSON object and nothing else.",
    'The JSON object must have two string fields: "displayText" and "speechText".',
    'Keep "speechText" as close as possible to "displayText" while stripping formatting that is awkward to speak.',
    "Do not include markdown fences, code blocks, or extra keys.",
  ].join(" ");
}

function extractJsonObject(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("{")) {
    return trimmed;
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return trimmed;
}

function parseAssistantResponse(text: string): AssistantResponseContent {
  const parsed = JSON.parse(extractJsonObject(text)) as Partial<AssistantResponseContent>;

  if (
    typeof parsed.displayText !== "string" ||
    typeof parsed.speechText !== "string" ||
    !parsed.displayText.trim() ||
    !parsed.speechText.trim()
  ) {
    throw new Error("OpenAI returned an invalid assistant response payload.");
  }

  return {
    displayText: parsed.displayText.trim(),
    speechText: parsed.speechText.trim(),
  };
}

function isApprovedProfileContextToolCall(
  item: { type: string; name?: string },
): item is ResponseFunctionToolCall {
  return (
    item.type === "function_call" &&
    item.name === approvedProfileContextTool.name
  );
}

function toToolOutputItem(
  toolCall: ResponseFunctionToolCall,
): ResponseFunctionToolCallOutputItem {
  const selection = parseApprovedProfileContextSelection(toolCall.arguments);
  const output = executeApprovedProfileContextSelection(selection);

  return {
    call_id: toolCall.call_id,
    output: JSON.stringify(output),
    type: "function_call_output",
  } as ResponseFunctionToolCallOutputItem;
}

async function generateToolSelectedChatResponse({
  client,
  history,
  message,
  model,
}: {
  client: OpenAI;
  history: ChatMessage[];
  message: string;
  model: string;
}) {
  const initialResponse = await client.responses.create({
    input: toInputMessages(history, message),
    instructions: buildToolDrivenInstructions(),
    max_output_tokens: MAX_OPENAI_OUTPUT_TOKENS,
    model,
    store: true,
    tools: [approvedProfileContextTool],
  });
  const toolCalls = initialResponse.output.filter(isApprovedProfileContextToolCall);

  if (toolCalls.length === 0) {
    return parseAssistantResponse(initialResponse.output_text);
  }

  const finalResponse = await client.responses.create({
    input: toolCalls.map(toToolOutputItem),
    instructions: [buildResponseFormatInstructions(), assistantSystemPrompt].join("\n\n"),
    max_output_tokens: MAX_OPENAI_OUTPUT_TOKENS,
    model,
    previous_response_id: initialResponse.id,
    store: false,
  });
  return parseAssistantResponse(finalResponse.output_text);
}

async function generateDirectChatResponse({
  client,
  history,
  message,
  model,
}: {
  client: OpenAI;
  history: ChatMessage[];
  message: string;
  model: string;
}) {
  const response = await client.responses.create({
    input: toInputMessages(history, message),
    instructions: [buildResponseFormatInstructions(), assistantSystemPrompt].join("\n\n"),
    max_output_tokens: MAX_OPENAI_OUTPUT_TOKENS,
    model,
    store: false,
  });
  return parseAssistantResponse(response.output_text);
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

  try {
    return await generateToolSelectedChatResponse({
      client,
      history,
      message,
      model,
    });
  } catch (error) {
    console.error("Tool-driven context selection failed; falling back to a direct response.", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return generateDirectChatResponse({
    client,
    history,
    message,
    model,
  });
}
