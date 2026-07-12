import type { ChatMessage } from "@/lib/types/chat";

import {
  getApprovedProfileDocuments,
  getApprovedProfileTopics,
  type ApprovedProfileTopic,
} from "./profile";

const DEFAULT_TOPICS: ApprovedProfileTopic[] = ["career", "academics"];
const approvedProfileDocuments = getApprovedProfileDocuments();
const ALL_TOPICS = getApprovedProfileTopics();

const broadContextKeywords = [
  "tell me about yourself",
  "who are you",
  "who is jeremiah",
  "introduce yourself",
  "your background",
  "overall profile",
  "professional profile",
  "full background",
];

function normalizeText(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokenizeWords(text: string) {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function maxAllowedDistance(keyword: string) {
  const compactLength = keyword.replace(/\s+/g, "").length;

  if (compactLength <= 5) {
    return 1;
  }

  if (compactLength <= 10) {
    return 2;
  }

  return 3;
}

function hasNearTokenMatch(token: string, candidates: string[]) {
  const maxDistance = maxAllowedDistance(token);

  return candidates.some(
    (candidate) =>
      boundedLevenshteinDistance(token, candidate, maxDistance) <= maxDistance,
  );
}

function boundedLevenshteinDistance(left: string, right: string, maxDistance: number) {
  const leftLength = left.length;
  const rightLength = right.length;

  if (Math.abs(leftLength - rightLength) > maxDistance) {
    return maxDistance + 1;
  }

  let previous = new Array(rightLength + 1);
  let current = new Array(rightLength + 1);

  for (let index = 0; index <= rightLength; index += 1) {
    previous[index] = index;
  }

  for (let row = 1; row <= leftLength; row += 1) {
    current[0] = row;
    let rowMin = current[0];

    for (let column = 1; column <= rightLength; column += 1) {
      const substitutionCost = left[row - 1] === right[column - 1] ? 0 : 1;
      current[column] = Math.min(
        previous[column] + 1,
        current[column - 1] + 1,
        previous[column - 1] + substitutionCost,
      );
      rowMin = Math.min(rowMin, current[column]);
    }

    if (rowMin > maxDistance) {
      return maxDistance + 1;
    }

    [previous, current] = [current, previous];
  }

  return previous[rightLength];
}

function hasNearKeywordMatch(normalizedText: string, keyword: string) {
  const textTokens = tokenizeWords(normalizedText);
  const keywordTokens = tokenizeWords(keyword);
  const compactKeyword = keywordTokens.join("");

  if (
    keywordTokens.length === 0 ||
    textTokens.length < keywordTokens.length ||
    compactKeyword.length < 4
  ) {
    return false;
  }

  const keywordPhrase = keywordTokens.join(" ");
  const maxDistance = maxAllowedDistance(keywordPhrase);

  for (
    let startIndex = 0;
    startIndex <= textTokens.length - keywordTokens.length;
    startIndex += 1
  ) {
    const candidate = textTokens
      .slice(startIndex, startIndex + keywordTokens.length)
      .join(" ");

    if (
      boundedLevenshteinDistance(keywordPhrase, candidate, maxDistance) <=
      maxDistance
    ) {
      return true;
    }
  }

  if (keywordTokens.length > 1) {
    const significantKeywordTokens = keywordTokens.filter(
      (token) => token.length >= 3,
    );

    if (significantKeywordTokens.length > 0) {
      const nearTokenMatches = significantKeywordTokens.filter((token) =>
        hasNearTokenMatch(token, textTokens),
      ).length;
      const requiredMatches = Math.max(
        2,
        Math.ceil(significantKeywordTokens.length * 0.67),
      );

      if (nearTokenMatches >= requiredMatches) {
        return true;
      }
    }
  }

  return false;
}

function parseRegexKeyword(keyword: string) {
  const trimmed = keyword.trim();

  if (!trimmed.startsWith("regex:")) {
    return null;
  }

  const rawPattern = trimmed.slice("regex:".length).trim();

  if (!rawPattern) {
    return null;
  }

  // Supports both `regex:pattern` and `regex:/pattern/flags` formats.
  if (rawPattern.startsWith("/") && rawPattern.length > 1) {
    const lastSlashIndex = rawPattern.lastIndexOf("/");

    if (lastSlashIndex > 0) {
      const body = rawPattern.slice(1, lastSlashIndex);
      const rawFlags = rawPattern.slice(lastSlashIndex + 1);
      const flags = rawFlags.includes("i") ? rawFlags : `${rawFlags}i`;

      try {
        return new RegExp(body, flags);
      } catch {
        return null;
      }
    }
  }

  try {
    return new RegExp(rawPattern, "i");
  } catch {
    return null;
  }
}

function scoreKeywordMatches(
  text: string,
  topic: ApprovedProfileTopic,
  overrideKeywords?: string[],
) {
  const normalized = normalizeText(text);
  const keywords = overrideKeywords ?? approvedProfileDocuments[topic].keywords;
  let score = 0;

  for (const keyword of keywords) {
    const regexKeyword = parseRegexKeyword(keyword);

    if (regexKeyword) {
      if (regexKeyword.test(normalized)) {
        score += 2;
      }

      continue;
    }

    const pattern = new RegExp(`\\b${escapeRegExp(keyword.toLowerCase())}\\b`, "i");
    const exactScore = keyword.includes(" ") ? 2 : 1;
    const nearScore = keyword.includes(" ") ? 1 : 0.5;

    if (pattern.test(normalized)) {
      score += exactScore;
      continue;
    }

    if (hasNearKeywordMatch(normalized, keyword)) {
      score += nearScore;
    }
  }

  return score;
}

function scoreText(text: string) {
  const normalized = normalizeText(text);
  const scores = new Map<ApprovedProfileTopic, number>(
    ALL_TOPICS.map((topic) => [topic, 0] as const),
  );

  if (scoreKeywordMatches(normalized, "career", broadContextKeywords) > 0) {
    return {
      broad: true,
      scores,
    };
  }

  for (const topic of ALL_TOPICS) {
    scores.set(topic, scoreKeywordMatches(normalized, topic));
  }

  return {
    broad: false,
    scores,
  };
}

export function inferProfileTopics({
  history = [],
  message,
}: {
  history?: ChatMessage[];
  message: string;
}) {
  const messageScore = scoreText(message);

  if (messageScore.broad) {
    return ALL_TOPICS;
  }

  const scores = new Map(messageScore.scores);
  const recentUserHistory = history
    .filter((item) => item.role === "user")
    .slice(-3);

  for (const entry of recentUserHistory) {
    const historyScore = scoreText(entry.content);

    if (historyScore.broad) {
      return ALL_TOPICS;
    }

    for (const topic of ALL_TOPICS) {
      const current = scores.get(topic) ?? 0;
      const historyWeight = historyScore.scores.get(topic) ?? 0;
      const historyTopicMultiplier = topic === "personal" ? 0.25 : 0.5;

      // History informs continuity, but the current prompt still dominates.
      scores.set(topic, current + historyWeight * historyTopicMultiplier);
    }
  }

  const sorted = [...scores.entries()]
    .filter(([, score]) => score > 0)
    .sort((left, right) => right[1] - left[1]);

  if (sorted.length === 0) {
    return DEFAULT_TOPICS;
  }

  const topScore = sorted[0][1];
  const selected = sorted
    .filter(
      ([, score]) =>
        score >= 1 && (score >= Math.max(topScore - 1, 1) || score >= topScore * 0.5),
    )
    .map(([topic]) => topic);

  return selected.length > 0 ? selected : DEFAULT_TOPICS;
}
