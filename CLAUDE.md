# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — run the dev server (Turbopack via Next 16 default) at http://localhost:3000
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm lint` — run ESLint (flat config, `eslint.config.mjs`)

No test runner is configured.

## Stack

- **Next.js 16** with the App Router (`app/` directory, no `pages/`)
- **React 19** + **TypeScript** (strict mode, `@/*` path alias maps to repo root)
- **Tailwind CSS v4** via `@tailwindcss/postcss` — config lives inline in `app/globals.css` using `@import "tailwindcss"` and `@theme inline { ... }`. There is no `tailwind.config.*` file; theme tokens (`--color-background`, `--font-sans`, etc.) are declared in CSS.
- ESLint via `eslint-config-next` (core-web-vitals + typescript presets)

## Architecture notes

- `app/layout.tsx` is the root layout. It wires the Geist + Geist Mono fonts via `next/font/google` and exposes them as `--font-geist-sans` / `--font-geist-mono` CSS variables, consumed by the `@theme` block in `globals.css`. Add new fonts here, not in CSS imports.
- The `<body>` uses `min-h-full flex flex-col` so page roots can rely on `flex-1` to fill the viewport — keep this in mind when adding new top-level pages.
- Dark mode uses `prefers-color-scheme` (no class toggling) — `:root` variables flip in a `@media` block in `globals.css`.

## Repo state

This is freshly bootstrapped from `create-next-app` — `app/page.tsx` is still the default landing page. Both `package-lock.json` and `pnpm-lock.yaml` are checked in; pnpm appears to be the active manager (newer lockfile, matches `.next` build output). Pick one and remove the other before the project grows.
