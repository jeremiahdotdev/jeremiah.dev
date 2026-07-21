# Project Notes

## General

- Prefer `condition && <Element />` over `condition ? <Element /> : null` for straightforward conditional rendering.
- Prefer `useEffectEvent` over `useCallback` for stable event-style handlers in React code when that pattern fits the code. If the callback is not an effect/event-style handler, prefer a plain function before reaching for `useCallback`.

## Code Style

- Prefer `condition && "class-name"` over `condition ? "class-name" : ""` when passing optional classes into `twMerge` or similar class helpers.

## Assistant Profile JSON Files

Use this section when creating a new profile context file under `packages/profile-data` (for example `projects.json`).

### Required Shape

Each file should use this schema:

```json
{
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
}
```

### Writing Rules

- Keep all content factual, concise, and approved for model grounding.
- Prefer neutral summary language over marketing language.
- Use `description` to explain the intent of the file and how the assistant should behave when details are missing.
- Put discoverability terms in `keywords` (synonyms, variants, common user phrasings).
- Use `sections` for topical grouping.
- Each section should contain a `heading` and a `points` array of complete sentences.
- Do not include local file system paths in section points.
- Do not include secrets, tokens, credentials, private URLs, or internal-only identifiers.
- If information is uncertain, omit it from the file rather than guessing.

### Style Consistency

- Match the tone used in existing files like `career.json` and `academics.json`.
- Keep bullets scannable (typically 2-5 points per section).
- Prefer broad technical context and responsibilities over fragile implementation trivia.
- If a topic has no approved details yet, include an empty `points` array for that heading.

### Validation Checklist

- JSON is valid (no trailing commas or comments).
- `description` is present and clear.
- `keywords` includes likely user query terms.
- `sections` headings are distinct and meaningful.
- Every non-empty point is a complete sentence.
- No sensitive or path-specific data is present.

