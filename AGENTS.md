# Project Notes

## General

- Prefer `condition && <Element />` over `condition ? <Element /> : null` for straightforward conditional rendering.
- Prefer `useEffectEvent` over `useCallback` for stable event-style handlers in React code when that pattern fits the code. If the callback is not an effect/event-style handler, prefer a plain function before reaching for `useCallback`.

## Code Style

- Prefer `condition && "class-name"` over `condition ? "class-name" : ""` when passing optional classes into `twMerge` or similar class helpers.

## Portfolio Cards

Portfolio cards are generated from GitHub repository data plus optional assets stored in each repository.

### Required GitHub Repository Data

Each project card expects the normal GitHub repository fields:

- `name`: Used as the card title.
- `description`: Used as the card description and summary.
- `html_url`: Used for the GitHub/repository link.
- `homepage`: Optional. When present, it becomes the `View Site` link.
- `topics`: Optional. Rendered as project badges.
- `private`: Determines whether assets must be loaded through the GitHub API.
- `pushed_at`: Used to order projects by last worked on.
- `languages_url`: Used to fetch language percentages and colors.

### Portfolio Asset Directory

Project-specific card assets live in:

```text
.portfolio
```

The configured filenames are in `config.json` under `github.portfolio`.

### Recommended Files

Add these files to a project repository when creating a custom portfolio card:

- `.portfolio/thumbnail.png`: Project avatar/thumbnail shown on the card.
- `.portfolio/portfolio.css`: Optional card theme CSS. If this file is missing, the default portfolio theme is used.
- `.portfolio/portfolio-dark.css`: Optional dark-mode overrides for card theme CSS.
- `.portfolio/card.webp`: Optional light-mode card background image.
- `.portfolio/card-dark.webp`: Optional dark-mode card background image.

### Theme CSS Hooks

`portfolio.css` can style these classes:

- `.portfolio-card-background`: The absolute card background layer.
- `.portfolio-surface`: Shared surface style for description and badges.
- `.portfolio-footer-surface`: Shared footer overlay and footer icon block style.
- `.portfolio-url`: GitHub and `View Site` links.
- `.portfolio-url:hover`: Optional link hover override. The component already provides a universal opacity hover.

The app provides these CSS variables on each card:

- `--portfolio-card-image`: Light card background image URL, or `none`.
- `--portfolio-card-dark-image`: Dark card background image URL, or `none`.
- `--portfolio-url-color`: Primary language color. The default theme uses this as the link color.

### Private Repositories

Private repositories cannot expose raw GitHub asset URLs to the browser. The API layer reads files from `.portfolio` and converts them to `data:` URLs when needed.

For private repositories, include the same files in `.portfolio`; do not rely on public raw URLs.

### Defaults

If no repository theme exists, the default theme is loaded from `components/projects/portfolio.css` and `components/projects/portfolio-dark.css`.

The default theme:

- Uses `hsl(var(--card))` as the card background.
- Does not use a fallback card image.
- Uses the primary language color for links.
- Falls back to `hsl(var(--primary))` if no language color is available.

## Assistant Profile JSON Files

Use this section when creating a new profile context file under `apps/ai/lib/assistant/profile-data` (for example `projects.json`).

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
