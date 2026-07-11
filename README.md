This repository is now a `pnpm` workspace monorepo.

## Layout

```text
apps/
  ai/         WebGL portfolio chat assistant
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
pnpm dev:ai
pnpm dev:portfolio
pnpm build:ai
pnpm build
pnpm lint:ai
pnpm build:portfolio
pnpm lint
pnpm sanity:seed
```

## AI app setup

The portfolio assistant lives in `apps/ai`.

Local setup:

```bash
cp apps/ai/.env.example apps/ai/.env.local
pnpm dev:ai
```

Required environment variables for `apps/ai`:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
CLOUDFLARE_TURNSTILE_SECRET_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=
```

Key assistant files:

- System prompt: `apps/ai/lib/assistant/system-prompt.ts`
- Approved Jeremiah profile context: `apps/ai/lib/assistant/profile.ts`
- Chat API route: `apps/ai/app/api/chat/route.ts`
- OpenAI service: `apps/ai/lib/openai/service.ts`
- Turnstile verification utility: `apps/ai/lib/turnstile/verify.ts`

Request flow:

1. The client submits the current message, recent validated history, and a Turnstile token to `app/api/chat/route.ts`.
2. The route validates the body, applies rate limiting, and verifies the Turnstile token with Cloudflare.
3. Only after Turnstile succeeds does the route call the isolated OpenAI service.
4. The OpenAI service builds the assistant instructions from the dedicated system prompt and approved Jeremiah profile context, then calls the Responses API with `OPENAI_MODEL`.
5. The client renders a single assistant response bubble, with loading, retry, and inline error handling.

You can start editing the portfolio site by modifying `apps/portfolio/app/page.tsx`, or the AI assistant by modifying `apps/ai/app/page.tsx`.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
