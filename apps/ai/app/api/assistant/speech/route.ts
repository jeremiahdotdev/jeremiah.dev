import { headers } from "next/headers";
import type { SpeechRequest } from "@/lib/types/speech";
import { createSpeechResponse } from "@/lib/assistant/create-speech-response";

export async function POST(request: Request) {
  let body: SpeechRequest;

  try {
    body = (await request.json()) as SpeechRequest;
  } catch {
    return Response.json(
      {
        code: "INVALID_REQUEST",
        error: "Malformed JSON request body.",
        success: false,
      },
      { status: 400 },
    );
  }

  const headerStore = await headers();
  const remoteIp =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return createSpeechResponse({
    body,
    remoteIp,
    signal: request.signal,
  });
}
