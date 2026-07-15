const profileJsonSchemaExample = `{
  "description": "High-level guidance for AI about how to use this file.",
  "keywords": ["keyword", "keyword phrase"],
  "sections": [
    {
      "heading": "Section title",
      "points": [
        "Approved factual statement 1.",
        "Approved factual statement 2."
      ]
    }
  ]
}`;

export const profileJsonAuthoringPrompt = `You are generating one approved profile context JSON file for Jeremiah.dev.

Target location:
- The file belongs under packages/profile-data.

Output requirements:
- Return exactly one valid JSON object.
- Do not include markdown fences, comments, explanations, or trailing commas.
- Use this exact top-level shape:

${profileJsonSchemaExample}

Schema rules:
- description must be present and explain how the AI should use the file.
- keywords must be an array of discoverability terms, including likely user phrasings and synonyms when helpful.
- sections must be an array of objects with:
  - heading: a short section title.
  - points: an array of complete factual sentences.

Writing rules:
- Keep all content factual, concise, and approved for model grounding.
- Prefer neutral summary language over marketing language.
- Use sections for topical grouping.
- Keep points scannable, typically 2 to 5 points per section when there is enough approved information.
- Match the tone used in the existing profile files such as career.json and academics.json.
- Prefer broad context over brittle implementation trivia.
- If information is uncertain, omit it instead of guessing.
- If a topic has no approved details yet, include an empty points array for that heading.

Safety rules:
- Do not invent facts, dates, credentials, employers, beliefs, or personal details.
- Do not include secrets, credentials, private URLs, internal-only identifiers, or filesystem paths in points.
- Do not include sensitive information unless it has been explicitly approved in the source material.

Validation checklist:
- The JSON is valid.
- description is clear.
- keywords are useful for retrieval.
- section headings are distinct and meaningful.
- every non-empty point is a complete sentence.
- no sensitive or path-specific data is present.

When source notes are incomplete:
- preserve only what is explicitly supported.
- do not fill gaps with plausible guesses.
- keep the file useful by writing a cautious description and only the approved points.`;

export function buildProfileJsonAuthoringPrompt(topicName?: string) {
  if (!topicName?.trim()) {
    return profileJsonAuthoringPrompt;
  }

  return `${profileJsonAuthoringPrompt}

Current task:
- Generate the JSON file for the topic "${topicName.trim()}".
- Choose headings and keywords that fit this topic.
- Keep the content aligned with the approved facts supplied for this topic.`;
}
