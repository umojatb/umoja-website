# Logo & Brand Asset Checklist

Stack: Next.js 16 App Router

## Source assets

| File | Status | Notes |
|------|--------|-------|
| `public/images/logo/logo.png` | [x] Present | 1536×1024 RGBA, transparent bg, navy+orange icon mark |
| `public/images/logo/logo-white.png` | [x] Derived | All non-transparent px → white; for dark surfaces |

## Favicon + app icon set

| File | Status | Size |
|------|--------|------|
| `public/favicon.ico` | [x] Generated | 16/32/48 multi-size ICO |
| `public/favicon-16x16.png` | [x] Generated | 16×16 |
| `public/favicon-32x32.png` | [x] Generated | 32×32 |
| `public/apple-touch-icon.png` | [x] Generated | 180×180, white bg |
| `public/android-chrome-192x192.png` | [x] Generated | 192×192, navy bg (#1b4079) |
| `public/android-chrome-512x512.png` | [x] Generated | 512×512, navy bg (#1b4079) |
| `src/app/favicon.ico` | [x] Present | App Router serves this as /favicon.ico |

## Web app manifest

| File | Status |
|------|--------|
| `public/site.webmanifest` | [x] Created |

Config: `name "Umoja Africa"`, `theme_color #1b4079`, `background_color #faf8f3`.

## OG / social share image

| File | Status | Size |
|------|--------|------|
| `public/images/og-image.jpg` | [x] Generated | 1200×630, navy bg, color logo centred |

## Head / framework metadata (`src/app/layout.tsx`)

| Tag | Status |
|-----|--------|
| `icons.icon` (favicon, 16, 32) | [x] Wired |
| `icons.apple` (apple-touch-icon) | [x] Wired |
| `manifest` | [x] Wired |
| `viewport.themeColor` | [x] Updated to #1b4079 |
| `openGraph.images` | [x] Wired |
| `twitter.card` summary_large_image | [x] Wired |

## Navbar (`src/components/layout/navbar.tsx`)

| Check | Status |
|-------|--------|
| Logo `<Image>` present | [x] |
| `priority` prop set (above-fold, no LCP delay) | [x] |
| Explicit `width`/`height` props (no layout shift) | [x] 1492×1022 intrinsic |
| Display size fixed via inline style (32px h, auto w) | [x] |
| "Umoja Africa" text hidden below `sm:` (480px) | [x] |
| Text visible at `sm:` and above | [x] |
| `aria-label="Umoja Africa — home"` on link | [x] |
| Color logo (light navbar bg) | [x] |

## Footer (`src/components/layout/footer.tsx`)

| Check | Status |
|-------|--------|
| White logo (`logo-white.png`) used | [x] |
| `aria-hidden="true"` on decorative image | [x] |
| `aria-label="Umoja Africa — home"` on link | [x] |
| Explicit `width`/`height` (1492×1022) + inline 36px h | [x] |

## Build

| Check | Status |
|-------|--------|
| `pnpm build` passes (0 errors) | [x] 24 pages |
| TypeScript clean | [x] |
| Homepage unchanged | [x] |
