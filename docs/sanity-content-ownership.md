# Sanity content ownership

The portfolio now reads the intended values from Sanity without the audited component overrides. Existing layout, concise academic copy, and badge wording are preserved in fallback data and the targeted migration.

## Runtime changes

- `siteSettings.careerSkills` owns the complete ordered skills carousel. The client no longer prepends featured skills, deduplicates authored entries, or merges local URLs/tooltips into fetched content. An empty array hides the carousel.
- Academic awards use `focusKey` to associate with a focus's stable `_key` and `label` for their compact badge text. Regex-based assignment and label rewriting are gone. Unassigned awards remain visible as general commendations.
- The menu follows Sanity navigation order directly.
- Career, project, carousel, menu, footer, and academic labels use dictionary fields with matching Studio fields. Existing AI labels/URL also have editable schema fields.
- Career role summaries are authored fields; an empty summary stays empty. An empty employer result stays empty, and dangling role skill references are skipped without replacing the whole career with fallback data.
- Authored empty metadata and emblem strings stay empty. Missing configuration/data or failed fetches still use the existing offline fallback path.

## Targeted content migration

`apps/portfolio/scripts/migrate-content-ownership.mjs` prepares these changes:

1. Replace the three academic focus descriptions with the original approved short paragraphs.
2. Populate missing compact award labels and explicit focus associations, preserving the current badge placement and order.
3. Create missing Jenkins, Next.js, Expo, and React Native skill documents, preserving existing matching skill metadata.
4. Populate the missing ordered career skills reference list from the current featured and role skills.
5. Populate missing career role summaries and dictionary fields, retaining existing authored values, including empty lists/strings.
6. Reorder existing navigation entries to Home, Academics, Career, Projects, Contact while preserving their labels, IDs, and icons.

The migration reads published documents and corresponding drafts, validates expected records and array keys, backs up its snapshot and patch plan, and applies one transaction with document revision checks. It verifies every changed field afterward. A hidden migration version makes later runs no-ops so future CMS edits are not overwritten. Draft-only featured skills require resolution before the transaction can run.

The existing broad seed script also has the new fields for a fresh dataset. It is not used to migrate an existing dataset because it replaces documents.

Preview the approved content locally without a connection:

```sh
node apps/portfolio/scripts/migrate-content-ownership.mjs
```

Load an existing environment file containing `NEXT_PUBLIC_SANITY_PROJECT_ID`, the intended `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_WRITE_TOKEN`, then inspect the actual patches:

```sh
node --env-file=/path/to/existing.env apps/portfolio/scripts/migrate-content-ownership.mjs --dry-run
```

Apply and verify:

```sh
node --env-file=/path/to/existing.env apps/portfolio/scripts/migrate-content-ownership.mjs --apply
```

An existing Sanity CLI login or `SANITY_AUTH_TOKEN` can supply authentication instead of the project write token. Credentials are never printed by the migration.

## Current execution status

The code/schema changes and targeted migration are prepared. **No remote Sanity documents have been changed.** The local portfolio has no configured project ID/token, and the existing Sanity CLI configuration contains no login token. A connected dry run stops at the missing-configuration check before any network request or mutation. Applying the requested Sanity update requires the existing configuration location or an authenticated connection.

Validation passed: 24 migration tests; mocked CMS ownership checks for authored fields, ordering, empty lists, and dangling references; dictionary/schema parity; portfolio ESLint and TypeScript; production build; and local Chrome checks at phone, tablet, and desktop sizes. Browser checks preserved carousel focus and menu navigation. The separate removal of viewport scaling was retained during verification.

Run the migration tests with:

```sh
node --test apps/portfolio/scripts/lib/content-ownership.test.mjs
```
