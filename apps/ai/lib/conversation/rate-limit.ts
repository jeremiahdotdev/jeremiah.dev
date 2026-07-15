import {
  CONVERSATION_RATE_LIMIT_MAX_REQUESTS,
  CONVERSATION_RATE_LIMIT_WINDOW_MS,
} from "@/lib/constants/conversation";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

export function applyConversationRateLimit(
  key: string,
  options: {
    maxRequests?: number;
    windowMs?: number;
  } = {},
) {
  const now = Date.now();
  const windowMs = options.windowMs ?? CONVERSATION_RATE_LIMIT_WINDOW_MS;
  const maxRequests = options.maxRequests ?? CONVERSATION_RATE_LIMIT_MAX_REQUESTS;
  const entry = (() => {
    const existing = rateLimitStore.get(key);

    if (!existing || existing.resetAt <= now) {
      const freshEntry = {
        count: 0,
        resetAt: now + windowMs,
      };

      rateLimitStore.set(key, freshEntry);
      return freshEntry;
    }

    return existing;
  })();
  entry.count += 1;

  return {
    limited: entry.count > maxRequests,
    retryAfterMs: Math.max(entry.resetAt - now, 0),
  };
}
