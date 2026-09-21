# Typography

Choose one of the ten semantic variants in `apps/portfolio/components/ui/typography.tsx`.
Use `as` to choose the HTML element independently of its appearance.
All font sizes and responsive rules belong in these variants, using standard
Tailwind utilities. Components cannot pass typography `className` or `style`
overrides, define typography CSS variables, or override text through ancestors.

| Variant | Use for | Base and width sizing | Height sizing |
| --- | --- | --- | --- |
| `display` | Hero text and prominent project names | 48px; `sm` 60px; `lg` 96px | Unchanged |
| `heading` | Page and section headings | 36px; `sm` 48px; `lg` 60px | `hlg` 48px (60px at `lg`); `h2xl` 60px (72px at `lg`) |
| `title` | Card, role, academic focus, diagram titles, and loading labels | 20px; `sm` 30px | `hsm` 30px; `hlg` 36px; `h2xl` 48px |
| `intro` | Introductory and summary statements | 24px; `sm` 30px; `lg` 36px | `hlg` 30px (36px at `lg`); `h2xl` 36px (48px at `lg`) |
| `body` | Descriptions and paragraphs | 16px; `sm` 24px | `hsm` 20px (24px at `sm`); `hlg` 24px; `h2xl` 30px |
| `label` | Section labels and prominent metadata | 16px; `sm` 18px | Unchanged |
| `eyebrow` | Categories, dates, and field labels | 12px; `lg` 14px | `hlg` 14px; `h2xl` 16px |
| `caption` | Badges, employers, helper text, and footer text | 14px; `lg` 16px | `hsm` 16px; `hlg` 18px; `h2xl` 20px |
| `navigation` | Menu items and menu triggers | 14px; `sm` 16px; `lg` 14px | Unchanged |
| `error` | Validation errors and failed actions | 14px; `lg` 16px | Unchanged |

```tsx
<Typography as="h3" variant="title">Software Engineer</Typography>
<Typography variant="body">Description of the role.</Typography>
<Typography as="span" variant="caption">Company name</Typography>
```

`sm` starts at 640px; `lg` starts at 1024px. Use `noWrap` for a single line.
Height breakpoints start at 667px (`hsm`), 812px (`hlg`), and 1024px (`h2xl`).
The height sizing in the table takes precedence when its breakpoint is active.
Use `hoverable` for an opacity change on hover or keyboard focus. Add
`group/typography` to a wrapping button or link to respond across its entire hit
area. Carousel previous/next buttons use `variant="label" hoverable`.
Opacity transitions respect reduced-motion preferences.

Project names and topic badges retain measured text fitting through the shared
`display` and `caption` variants. Runtime measurements update ordinary CSS
properties directly, only to shrink text that would overflow its available width.
This does not change the shared base sizes.

Career cards, academics, and dialogs use the same variants and responsive sizing.
Role titles wrap when needed. Layout spacing remains in component Tailwind
classes: skill badges gain vertical padding at `hsm`, `hlg`, and `h2xl`, while
the skills header stays compact below `hsm`.
