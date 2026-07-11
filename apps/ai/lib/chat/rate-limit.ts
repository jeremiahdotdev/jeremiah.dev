import {
  CHAT_RATE_LIMIT_MAX_REQUESTS,
  CHAT_RATE_LIMIT_WINDOW_MS,
} from "@/lib/chat/constants";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getEntry(key: string, now: number) {
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    const freshEntry = {
      count: 0,
      resetAt: now + CHAT_RATE_LIMIT_WINDOW_MS,
    };

    rateLimitStore.set(key, freshEntry);
    return freshEntry;
  }

  return entry;
}

export function applyRateLimit(key: string) {
  const now = Date.now();
  const entry = getEntry(key, now);
  entry.count += 1;

  return {
    limited: entry.count > CHAT_RATE_LIMIT_MAX_REQUESTS,
    retryAfterMs: Math.max(entry.resetAt - now, 0),
  };
}
