# TDD-4 — Site SEO / public route tests

**Date:** 2026-07-17  
**Exit:** unit GREEN (focused suite) · production SEO re-probe still **OPEN**

## RED → GREEN

| Gap | RED | GREEN |
|-----|-----|-------|
| Legacy `/products/category/[slug]` | Stale test mocked missing `CategoryPageView`; `permanentRedirect` undefined → fail | Rewrote for hard `notFound` + `permanentRedirect('/products/:id/')` + noindex metadata |
| robots host from env | Prior tests only compared static `SITE_URL` import | `tests/unit/app/robots.test.ts` — resetModules + `NEXT_PUBLIC_SITE_URL` / default / vercel.app |
| sitemap host from env | Same | `tests/unit/app/sitemap.test.ts` — env host on static + catalog URLs; no localhost |
| Footer Admin | Mocked `SITE_FOOTER_NAV` made “no Admin” hollow | Real nav data + rendered links assert no `/admin` |
| Root not-found | No name-mirror test | `tests/unit/app/not-found.test.tsx` — noindex metadata, recovery links, no Admin |
| Planning → Planner entry | Smoke only | Asserts `/planner` + `/contact` links, no Admin |

## Commands (exit 0)

```text
pnpm --filter oando-site exec vitest run \
  tests/unit/app/robots.test.ts \
  tests/unit/app/sitemap.test.ts \
  tests/unit/app/not-found.test.tsx \
  tests/unit/components/site/Footer.test.tsx \
  "tests/unit/app/(site)/products/category/[slug]/page.test.tsx" \
  "tests/unit/app/(site)/planning/page.test.tsx" \
  "tests/unit/app/(site)/robots.test.ts" \
  "tests/unit/app/(site)/sitemap.test.ts" \
  "tests/unit/app/(site)/solutions/[category]/page.test.tsx" \
  tests/unit/features/site/data/navigation.test.ts \
  tests/unit/features/site/data/contact.test.ts \
  tests/unit/lib/siteUrl.test.ts \
  tests/unit/lib/analytics/plannerEntry.test.ts \
  tests/unit/features/site/data/siteSeoAcceptance.test.ts
```

**Result:** 14 files, 60 tests, exit 0.

## Already covered (verified pass)

- Solutions unknown slug hard-404 (`dynamicParams=false` + `notFound`)
- Contact pure helpers (`toTelHref`, `buildMailtoHref`, `buildWhatsAppHref`)
- `plannerEntry` helpers
- Hard redirects: brochure, catalog, gallery, imprint, news, social, support-ivr, tracking
- Navigation data no Admin in header/footer

## Residual OPEN

- **Production host SEO re-probe** (live robots/sitemap on deploy host) — unit ≠ production.
- Browser titles/canonicals / contact form delivery not in this agent.

## Source changes

None required — production SEO routes already use `SITE_URL`; work was test truth.
