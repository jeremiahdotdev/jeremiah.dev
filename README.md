This repository is now a `pnpm` workspace monorepo.

## Layout

```text
apps/
  portfolio/  Current jeremiah.dev Next.js app
packages/     Shared packages for future apps
```

The existing site lives in `apps/portfolio`, and the repository root now owns the workspace-level scripts.

## Getting Started

Install dependencies:

```bash
pnpm dev
```

Run the current site:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Useful workspace commands:

```bash
pnpm dev:portfolio
pnpm build
pnpm build:portfolio
pnpm lint
pnpm sanity:seed
```

You can start editing the site by modifying `apps/portfolio/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
