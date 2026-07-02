# Project Notes

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
public/portfolio
```

The configured filenames are in `config.json` under `github.portfolio`.

### Recommended Files

Add these files to a project repository when creating a custom portfolio card:

- `public/portfolio/thumbnail.png`: Project avatar/thumbnail shown on the card.
- `public/portfolio/portfolio.css`: Optional card theme CSS. If this file is missing, the default portfolio theme is used.
- `public/portfolio/card.webp`: Optional light-mode card background image.
- `public/portfolio/card-dark.webp`: Optional dark-mode card background image.

### Theme CSS Hooks

`portfolio.css` can style these classes:

- `.portfolio-card-background`: The absolute card background layer.
- `.portfolio-surface`: Shared surface style for description, badges, footer overlay, and icon block.
- `.portfolio-surface p`: Description typography.
- `.portfolio-url`: GitHub and `View Site` links.
- `.portfolio-url:hover`: Optional link hover override. The component already provides a universal opacity hover.

The app provides these CSS variables on each card:

- `--portfolio-card-image`: Light card background image URL, or `none`.
- `--portfolio-card-dark-image`: Dark card background image URL, or `none`.
- `--portfolio-url-color`: Primary language color. The default theme uses this as the link color.

### Private Repositories

Private repositories cannot expose raw GitHub asset URLs to the browser. The API layer reads files from `public/portfolio` and converts them to `data:` URLs when needed.

For private repositories, include the same files in `public/portfolio`; do not rely on public raw URLs.

### Defaults

If no `portfolio.css` exists, the default theme in `components/projects/theme.css` is used.

The default theme:

- Uses `hsl(var(--card))` as the card background.
- Does not use a fallback card image.
- Uses the primary language color for links.
- Falls back to `hsl(var(--primary))` if no language color is available.
