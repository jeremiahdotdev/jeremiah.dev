# Portfolio technical review

Reviewed the uncommitted portfolio changes and new files against `HEAD` (`42f3e14`), the root `AGENTS.md`, existing Sanity contracts, and the requested styling/component conventions. This is a technical review of the current work, not a historical audit of every commit or a content rewrite.

The academic section retains its original layout, concise descriptions, and typography hierarchy. Its intended short descriptions now live in shared fallback/seed data. The subsequent [Sanity ownership cleanup](sanity-content-ownership.md) removes the audited overrides and prepares one targeted migration for descriptions, awards, career skills, summaries, navigation, and labels. **The remote update has not run because this workspace has no Sanity project configuration or authenticated token.**

## Findings that still need work

| Priority | Finding | Evidence and recommended next step |
| --- | --- | --- |
| P2 | The new project product-summary section cannot appear with the current data. | [parseProject](../apps/portfolio/server/service/parseProjects.ts) populates `summary` and `description` from the same GitHub description. [ProjectCard](../apps/portfolio/components/projects/project-card.tsx) suppresses duplicate content, so “The product” has no distinct source. Either remove this unused section or add a deliberate separate editorial field. |
| P2, existing data | The Scrum Master role ends before it starts. | [career.tsx](../apps/portfolio/data/career.tsx) and the existing seed use June 2025 as the start and March 2025 as the end. This requires a factual correction; no date was guessed. Add start/end ordering validation to the schema after correcting the record. |
| P3 | Career domain data is recovered from presentation output. | [career-milestones.ts](../apps/portfolio/lib/career-milestones.ts) reparses formatted dates and traverses React/PortableText props to reconstruct summary text. Preserve raw timestamps and normalize summaries in the data loader before rendering. The new Sanity summary field reduces reliance on this fallback. |
| P3 | Experience still means summed employer spans. | [getCareerExperience](../apps/portfolio/server/service/getCareerExperience.ts) now rounds correctly, but overlapping employers would count twice and gaps within one employer span would count as worked time. Define the desired meaning before changing the calculation to merged date intervals. |
| P3 | Any bracketed project text becomes a status badge. | [project-description.ts](../apps/portfolio/lib/project-description.ts) removes all `[text]` from prose. Ordinary bracketed writing or link labels can change meaning. Prefer structured status metadata or an explicitly documented set of status tags. |
| P3 | Status text does not inherit its semantic color. | [ProjectStatusBadge](../apps/portfolio/components/projects/project-status-badge.tsx) colors the parent, but the caption variant supplies its own muted color. If colored label text is intended, add a controlled typography tone rather than a local class override. |
| P3 | Long typewriter phrases can overlap typing/deletion timers. | [TypeHeading](../apps/portfolio/components/shared/type-heading.tsx) begins erasing after 2.5 seconds regardless of phrase length. Long CMS phrases can still be typing then. Derive the schedule from character count or use a sequential animation state machine. |

## AGENTS.md comparison

| Rule | Assessment |
| --- | --- |
| Use `&&` for straightforward conditional elements | The reviewed current components generally comply. Ternaries remain where both branches render different meaningful content. |
| Use `&&` for optional classes | The updated class-helper calls follow this rule. |
| Prefer effect events where appropriate; otherwise plain functions before `useCallback` | Carousel subscriptions use `useEffectEvent`; UI click/submit handlers are plain functions. Typewriter helpers are scoped to their effect. An Effect Event is not a general replacement for a JSX event handler; [React documents this restriction](https://react.dev/reference/react/useEffectEvent). |
| Profile JSON schema/content rules | No `packages/profile-data` files changed, so that section is not implicated. The academic fallback JSON is application content, not an assistant profile file. |
| Shared typography must own its styling | This is an additional review requirement rather than an existing AGENTS rule. `Typography` rejects direct `className`/`style` overrides. Removed project-specific DOM font fitting and the private project-title CSS variable. |
| Prefer existing Tailwind values | Also an additional review requirement. Exact matches use standard utilities. Custom dimensions with no equivalent retain their geometry through named theme values or remain documented for a design-token follow-up. |

The requested typography, Tailwind, extraction, and CMS-ownership standards are not currently written into `AGENTS.md`. Adding concise rules there would make future reviews more consistent; this review did not silently change repository policy.

## Fixes applied

- **Academics/content:** Restored the original compact academic layout. Moved the existing short descriptions to [academic-focus-descriptions.json](../apps/portfolio/data/academic-focus-descriptions.json), shared by fallback data and the seed/update scripts. The view renders the loaded description. Added dictionary/Sanity fields for the existing academic introduction, diagram, and accessible labels without expanding their wording.
- **Sanity contract:** Added career role `summary` to the schema, query, and loader. Added the missing optional navigation icon type and restored rendering of CMS-selected navigation icons. New menu labels use dictionary fields; existing title/theme/AI labels reuse existing fields.
- **Career arithmetic:** Sum whole months and round the total once. Current fallback spans total 107 months, giving 8.9 years instead of 9.0. CMS-selected skill icons now take precedence over bundled fallback logos, and card titles/labels can wrap.
- **Project components:** Extracted reusable project links, restored existing dictionary link labels/accessibility text, removed the unused card-list component and ignored callback, and removed the title-fitting component/helper.
- **Carousel interaction:** Mobile project navigation now lives outside inert slides, preserving focus when selection changes. The initial selected index is synchronized. Shared arrow handling respects orientation and skips editable controls and portaled content.
- **Preview behavior:** Restored lazy iframe loading and an overlay while a preview loads/reloads. Removed static inline styling where ordinary utilities suffice; retained data-driven language widths/colors and measured iframe geometry.
- **Shared layout:** The current shared section layout now uses natural document height. The earlier viewport-scaling implementation has been removed.
- **Contact:** Submission handlers no longer use unnecessary callback memoization. CAPTCHA/network failures are handled, failed submissions retain entered text, and cooldown timers are cleaned up.
- **Typewriter:** Empty phrase arrays are safe; timer helpers and cleanup now live in the effect without unnecessary callback chains.
- **Tailwind:** Replaced exact-equivalent arbitrary spacing, widths, outline offsets, viewport heights, scale, and opacity with standard utilities. Repeated career color and 600ms timing use theme tokens. Original 2016px/1920px width limits remain as `max-w-section`/`max-w-project`: Tailwind's existing `screen-2xl` is 1536px, so substituting it would change the layout.

## Sanity ownership follow-up

The audited runtime overrides are removed. Sanity now owns the complete career skills list/order, academic award relationships and badge labels, navigation order, and the new editorial/interface text. Empty CMS lists, empty summaries, and authored metadata are preserved. Dangling role skill references no longer replace the career with local fallback content. Every fallback dictionary field has a matching editable schema field.

The new migration populates the intended values in existing documents while preserving unrelated fields and existing authored values. It replaces the three approved academic descriptions and performs the one-time navigation reorder. Other new fields are populated only when absent. See [Sanity content ownership](sanity-content-ownership.md) for the exact command, validation, and current missing-credentials blocker.

## Further component cleanup

Keep the existing useful boundaries: milestone card, skill card/logo, academic perspective, section container/card/heading, project links, and preview. The larger simplifications are data normalization and removing obsolete paths, not creating wrappers for every markup fragment.

The retired career accordion, floating-controls view, academic summary/carousel components, and their unused helpers and types have been removed after tracing imports from the app routes, Studio configuration, and scripts. The unused `PageSection` `showBorder`/`rotate` props and their callers were also removed. The files under `data` remain active Sanity fallbacks or seed/migration inputs.

The shared typography scale has many feature-specific near-duplicate variants and custom `clamp`/tracking values. Consolidating them into a smaller semantic scale is a separate visual-system change and should preserve the approved layout. Diagram gradients/geometry and preview chrome colors are further token candidates; bracket syntax alone is not proof that a standard utility is equivalent.

## Validation

- Portfolio ESLint, TypeScript, and `git diff --check` passed.
- Production build passed, including route generation.
- Duration assertions covered the current records, repeated short tenures, an empty list, one year, and less than one month.
- Targeted Sanity migration preparation and tests are described in the follow-up document; remote execution is blocked by missing configuration.
- Local Chrome checks passed at 390×844, 768×600, 1024×768, and 1440×900 with no page errors or horizontal document overflow. Verified mobile project selection retains control focus, menu links close the drawer, and the blog grows beyond one viewport. The earlier scaling issue was subsequently removed from the shared layout. External preview pages used local fixtures, so this does not validate third-party site behavior.
