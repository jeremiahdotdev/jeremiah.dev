import { headers } from "next/headers";

import { createChatResponse } from "@/lib/chat/create-chat-response";

export async function POST(request: Request) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
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
  return createChatResponse({
    rawBody,
    remoteIp,
  });
}
