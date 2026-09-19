export function parseProjectDescription(description: string) {
  const badges: string[] = [];
  const seen = new Set<string>();
  const text = description.replace(/\[([^\[\]]*)\]/g, (_, content: string) => {
    const label = content.replace(/\s+/g, " ").trim();
    const key = label.toLowerCase();

    if (label && !seen.has(key)) {
      badges.push(label);
      seen.add(key);
    }

    return " ";
  });

  return {
    description: text.replace(/\s+/g, " ").replace(/\s+([.,!?;:])/g, "$1").trim(),
    badges,
  };
}

export function splitProjectDescription(description: string) {
  const text = description.trim();
  const sentences = new Intl.Segmenter("en", { granularity: "sentence" }).segment(text);
  const firstSentence = sentences[Symbol.iterator]().next().value?.segment ?? "";

  return {
    intro: firstSentence.trim(),
    remainder: text.slice(firstSentence.length).trim(),
  };
}
