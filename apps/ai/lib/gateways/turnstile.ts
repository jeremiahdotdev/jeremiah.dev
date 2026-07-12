type TurnstileVerificationResult =
  | {
      success: true;
    }
  | {
      code:
        | "TURNSTILE_FAILED"
        | "TURNSTILE_MISSING"
        | "TURNSTILE_UNAVAILABLE";
      error: string;
      success: false;
    };

type CloudflareVerificationResponse = {
  "error-codes"?: string[];
  success: boolean;
};

function getTurnstileSecret() {
  return (
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ??
    process.env.TURNSTILE_SECRET_KEY
  );
}

export async function verifyTurnstileToken({
  remoteIp,
  token,
}: {
  remoteIp?: string;
  token: string;
}): Promise<TurnstileVerificationResult> {
  if (!token.trim()) {
    return {
      code: "TURNSTILE_MISSING",
      error: "Turnstile verification token is required.",
      success: false,
    };
  }

  const secret = getTurnstileSecret();

  if (!secret) {
    return {
      code: "TURNSTILE_UNAVAILABLE",
      error: "Turnstile verification is not configured.",
      success: false,
    };
  }

  const formData = new URLSearchParams();
  formData.set("response", token);
  formData.set("secret", secret);

  if (remoteIp) {
    formData.set("remoteip", remoteIp);
  }

  let response: Response;

  try {
    response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      },
    );
  } catch {
    return {
      code: "TURNSTILE_UNAVAILABLE",
      error: "Turnstile verification is unavailable right now.",
      success: false,
    };
  }

  if (!response.ok) {
    return {
      code: "TURNSTILE_UNAVAILABLE",
      error: "Turnstile verification is unavailable right now.",
      success: false,
    };
  }

  const result = (await response.json()) as CloudflareVerificationResponse;

  if (!result.success) {
    const errorCodes = result["error-codes"] ?? [];
    const isReplayOrExpired = errorCodes.includes("timeout-or-duplicate");

    return {
      code: "TURNSTILE_FAILED",
      error: isReplayOrExpired
        ? "Turnstile verification expired. Please try again."
        : "Turnstile verification failed.",
      success: false,
    };
  }

  return { success: true };
}
