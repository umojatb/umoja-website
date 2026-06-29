# Umoja Africa — Typography Pass Checklist

Font decision: **Newsreader** (Direction A, warm humanist serif)
Source: Google Fonts, variable weight 200–900, italic axis.
Scope: inner pages only via `.page-serif` wrapper — homepage untouched.

## Sizing targets (from comps)

| Element | Size | Line-height | Weight |
|---------|------|-------------|--------|
| Page H1 (hero) | clamp(2.5rem → 3.875rem) ≈ 56–62 px desktop | 1.04 | 500 |
| Section H2 | current responsive scale (30→48 px) | 1.15 | 600 |
| Card / sub H3 | 1.25 rem (20 px) | 1.3 | 600 |

Body, labels, buttons, and chrome stay in IBM Plex Sans.

## Inner Pages

All inner pages already wrapped in `<InnerPage>` (`.page-serif` class) from
the previous polish pass. Newsreader is applied via the scope rule — no
per-page file changes required.

- [x] `/about`
- [x] `/impact`
- [x] `/programs`
- [x] `/get-involved`
- [x] `/contact`
- [x] `/donate`
- [x] `/annual-reports`
- [x] `/blog`
- [x] `/blog/[slug]`
- [x] `/apply/volunteer`
- [x] `/apply/partner`
- [x] `/success`

## Done when

- [x] All pages use Newsreader for headings via `.page-serif` scope
- [x] Build passes, lint passes
- [x] Homepage and navbar were NOT modified by this pass
