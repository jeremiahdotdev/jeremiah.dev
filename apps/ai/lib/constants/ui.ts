export const INITIAL_RESPONSE = "Ask anything about me. I am an open book.";
export const REQUEST_TIMEOUT_MS = 30_000;
export const THINKING_FRAMES = [
  "Thinking.\u00A0\u00A0",
  "Thinking..\u00A0",
  "Thinking...",
] as const;
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
export const TURNSTILE_TIMEOUT_MS = 12_000;
