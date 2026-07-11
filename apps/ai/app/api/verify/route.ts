import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { verifyTurnstileToken } from "@/lib/turnstile/verify";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    token?: string;
  };
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const remoteIp = forwardedFor?.split(",")[0]?.trim();
  const verificationResult = await verifyTurnstileToken({
    remoteIp,
    token: body.token ?? "",
  });

  if (!verificationResult.success) {
    const status =
      verificationResult.code === "TURNSTILE_MISSING"
        ? 400
        : verificationResult.code === "TURNSTILE_UNAVAILABLE"
          ? 503
          : 403;

    return NextResponse.json(
      { message: verificationResult.error, success: false },
      { status },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
