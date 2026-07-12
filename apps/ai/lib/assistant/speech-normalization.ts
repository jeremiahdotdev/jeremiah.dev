import { MAX_SPEECH_TEXT_LENGTH } from "@/lib/assistant/speech-config";

const abbreviationReplacements = [
  [/\bUI\/UX\b/g, "UI and UX"],
  [/\bAWS\b/g, "A W S"],
  [/\bGCP\b/g, "Google Cloud"],
  [/\bGTM\b/g, "Google Tag Manager"],
  [/\bWebGL\b/g, "Web G L"],
  [/\bNext\.js\b/g, "Next J S"],
  [/\b\.NET\b/g, "dot net"],
] as const;

export function normalizeSpeechText(text: string) {
  let normalized = text;

  normalized = normalized.replace(
    /```[\s\S]*?```/g,
    " I included a code example in the text response. ",
  );
  normalized = normalized.replace(/`([^`]+)`/g, "$1");
  normalized = normalized.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, "$1");
  normalized = normalized.replace(/https?:\/\/\S+/g, "");
  normalized = normalized.replace(/\[\d+\]/g, "");
  normalized = normalized.replace(/\(\s*Source:[^)]+\)/gi, "");
  normalized = normalized.replace(/^#{1,6}\s*/gm, "");
  normalized = normalized.replace(/^>\s?/gm, "");
  normalized = normalized.replace(/^\s*[-*]\s+/gm, "");
  normalized = normalized.replace(/^\s*\d+\.\s+/gm, "");
  normalized = normalized.replace(/^\s*\|\s*/gm, "");
  normalized = normalized.replace(/\s*\|\s*/g, " ");
  normalized = normalized.replace(/^\s*[-*_]{3,}\s*$/gm, "");
  normalized = normalized.replace(/\*\*(.*?)\*\*/g, "$1");
  normalized = normalized.replace(/__(.*?)__/g, "$1");
  normalized = normalized.replace(/\*(.*?)\*/g, "$1");
  normalized = normalized.replace(/_(.*?)_/g, "$1");
  normalized = normalized.replace(/~~(.*?)~~/g, "$1");

  for (const [pattern, replacement] of abbreviationReplacements) {
    normalized = normalized.replace(pattern, replacement);
  }

  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

export function validateNormalizedSpeechText(text: string) {
  if (!text.trim()) {
    return {
      error: "There is no speakable assistant response.",
      success: false as const,
    };
  }

  if (text.length > MAX_SPEECH_TEXT_LENGTH) {
    return {
      error: "This response is too long to synthesize.",
      success: false as const,
    };
  }

  return {
    success: true as const,
    text,
  };
}
