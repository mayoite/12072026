# S-W2 — SF-02 double-brand titles + SEO host honesty

**Date:** 2026-07-17  
**Agent:** S-W2  
**Scope:** title/metadata helpers, required `(site)` layout metadata, matching unit tests  
**Out of scope:** Footer, contact forms, heading hero, planner, admin

## Result

| Item | Status |
|------|--------|
| SF-02 unit (one pure brand pipe segment; absolute titles) | **PASS** |
| Host honesty via caller `SITE_URL` / origin (no localhost invent) | **PASS** (unit) |
| TDD-4 robots/sitemap env host contracts | **PASS** (not broken) |
| Browser title recheck | **OPEN** |
| Production host re-probe | **OPEN** (not this agent) |

## Code changes

### Helpers — `site/features/site/data/seo.ts`

- Hardened `resolveDocumentTitle`: strips trailing pure brand segments, drops mid pure-brand pipes, re-appends **at most one** `| One&Only`; keeps mid-title brand mentions (`About One&Only…`) without a second pure suffix.
- Added `countBrandPipeSegments` for SF-02 contracts.
- Added `normalizeSiteOrigin` (trailing-slash strip only; never invents host).
- `buildCanonicalUrl` / `buildPageMetadata` / `buildSiteMetadata` / locale alternates use normalized origin.
- Page metadata still emits `title: { absolute }` so root `template: %s | One&Only` cannot double-append.

### Bridge re-exports — `site/lib/helpers/seo.ts`

- Re-exports `resolveDocumentTitle`, `countBrandPipeSegments`, `normalizeSiteOrigin`.

### Layout metadata (required for double-brand)

- `site/app/(site)/portal/layout.tsx` → `buildPageMetadata(SITE_URL, …)` absolute `Portal | One&Only`, noindex.
- `site/app/(site)/portal/svg-catalog/layout.tsx` → absolute `SVG catalog | One&Only`, noindex.

## Tests (exit 0)

```text
pnpm --filter oando-site exec vitest run \
  tests/unit/features/site/data/seo.test.ts \
  tests/unit/features/site/data/siteSeoAcceptance.test.ts \
  "tests/unit/app/(site)/portal/layout.test.tsx" \
  "tests/unit/app/(site)/portal/svg-catalog/layout.test.tsx" \
  "tests/unit/app/(site)/dashboard/layout.test.tsx" \
  tests/unit/lib/siteUrl.test.ts \
  tests/unit/app/robots.test.ts \
  tests/unit/app/sitemap.test.ts
```

**Result:** 8 files, **80 tests**, exit **0**.

Also: `pnpm run check:layout` → OK.

## Residual OPEN

- Browser document titles / OG on live routes (SF-02 browser bar).
- Guest portal page still uses a raw string title (`Guest portal | One&Only`) — not a layout; left alone per OWN scope. Template can still double-append if not migrated later.
- Production robots/sitemap re-probe still OPEN (TDD-4 residual).

## Status claim

**Unit GREEN for SF-02 helpers + absolute layout titles + SITE_URL host honesty.**  
Not a browser PASS. Not a production SEO PASS.
