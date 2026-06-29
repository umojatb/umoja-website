# Design-sync notes

## Build requirements

- Run `pnpm exec tsc --project tsconfig.ds.json` to regenerate `types/` before the converter if source has changed significantly (though the converter auto-reads from `src/` via `--entry ./src/ds-entry.tsx`).
- Generate combined CSS if globals.css changes: `pnpm exec postcss src/app/globals.css -o .ds-build-css/tailwind-generated.css` (postcss-cli is in `.ds-sync/node_modules`), then rebuild `combined.css`.

## Known quirks

- `next/image` and `next/link` are shimmed in preview builds via `nextShimPlugin` in `.ds-sync/lib/previews.mjs` — they render as native `<img>` / `<a>` in the preview. The main bundle loads Next.js normally since it only runs in the design agent context.
- `src/lib/search.ts` regex was changed from literal combining chars to `̀-ͯ` to avoid Chromium charset issues in Playwright `setContent` context.
- `process.env` is broadly shimmed in both the main bundle and preview builds to handle `NEXT_PUBLIC_*` and `NEXT_RUNTIME` references from `src/lib/site-config.ts` and `next/image`.

## Rebuild command

```bash
pnpm exec tsc --project tsconfig.ds.json && \
.ds-sync/node_modules/.bin/postcss src/app/globals.css -o .ds-build-css/tailwind-generated.css && \
python3 -c "open('.ds-build-css/combined.css','wb').write(b'/* Google Fonts */\n@import url(\"https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;1,400&family=Manrope:wght@400;500;600;700;800&display=swap\");\n:root{--font-ibm-plex-sans:\"IBM Plex Sans\",system-ui,sans-serif;--font-manrope:\"Manrope\",system-ui,sans-serif;}\n'.encode()+open('.ds-build-css/tailwind-generated.css','rb').read())" && \
node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./src/ds-entry.tsx --out ./ds-bundle && \
node .ds-sync/package-validate.mjs ./ds-bundle
```
