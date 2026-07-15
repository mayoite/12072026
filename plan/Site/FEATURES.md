# Site features

Repo-sourced index: **plan phase → code path → honest gap**. Reconciled against `site/` on 2026-07-15.

| Doc | Role |
|---|---|
| `PHASES-01-02.md`, `PHASES-03-05.md` | What to build and prove |
| This file | What exists in code today |
| `CHECKLIST.md` | Open acceptance work only |

**Code roots:** `site/app/(site)/` · `site/components/` · `site/features/site/` (`data/`, `assistant/`, `advisor/`) · `site/lib/analytics/` · `site/lib/catalog/site/`

---

## Phase 1 — measurement and foundation

Plan: `PHASES-01-02.md` (Phase 1)

| Feature | Code | Gap |
|---|---|---|
| Route classification | `features/site/data/routeClassification.ts`, `tests/unit/features/site/data/routeClassification.test.ts` | Consumed by `sitemap.ts` and `robots.ts` |
| Conversion contract | `lib/analytics/conversionContract.ts`, `conversionContract.test.ts` | Funnel wired through consent-gated emit; Planner downstream events still unwired |
| Site emitters | `lib/analytics/siteEvents.ts`, `TrackedLink.tsx`, `PlannerLaunchLink.tsx`, `SiteConversionTracker.tsx` | `PAGE_VIEW`, `PLANNER_ENTRY`, CTA events; production `window.va` receipt unverified |
| Attribution | `lib/analytics/siteAttribution.ts`, `lib/analytics/plannerEntry.ts` | Cookies + query params on Planner entry; Planner import confirmation open |
| Consent | `lib/consent.ts` | Gating before emit; timed accept banner proof open |
| Planner workspace events | `conversionContract.ts` defines `PROJECT_START`, `BOQ_*`, `HANDOFF_*` | **Planner never imports** `trackConversionEvent` |
| SEO helpers | `features/site/data/seo.ts`, `siteSeoContract.ts`, `lib/analytics/seo.ts` | Unit contracts for SEO-01/03/04; browser recheck open |
| Sitemap / robots | `app/(site)/sitemap.ts`, `robots.ts` | Driven by classification; utilities + portal noindex; browser recheck open |
| Legacy redirect | `app/(site)/catalog/page.tsx` | `/catalog` → `/downloads` |

---

## Phase 2 — commercial landing pages

Plan: `PHASES-01-02.md` (Phase 2)

| Feature | Code | Gap |
|---|---|---|
| Homepage | `app/(site)/page.tsx`, `HomepageHero.tsx`, `features/site/data/homepage.ts` | Trust provenance in data; **no** CWV/mobile proof |
| Generic hero fallback | `components/home/Hero.tsx` `onError` | Homepage uses `HomepageHero.tsx` without same fallback |
| Global nav | `components/site/Header.tsx`, `MobileNavDrawer.tsx` | Quote-cart `aria-label` done; `SITE-NAV-01/02/04` open |
| Forms | `components/contact/CustomerQueryForm.tsx` | Success/error exist; consent + `SITE-FORM-*` open |
| A11y smoke | `tests/e2e/site-a11y-smoke.spec.ts` | Axe critical/serious on 10 routes; not WCAG 2.2 AA sign-off |
| Planner CTAs | `Header.tsx`, `PlannerToolsShowcase.tsx`, `InteractiveTools.tsx`, `TrackedLink.tsx`, `PlannerLaunchLink.tsx` | Primary showcase + choose-product wired; other page CTAs partial |

---

## Phase 3 — search-led content

Plan: `PHASES-03-05.md` (Phase 3)

| Feature | Code | Gap |
|---|---|---|
| Content pages | `app/(site)/about/`, `planning/`, `solutions/`, `news/`, etc. | No search-evidence workflow or `SITE-CONTENT-*` proof |
| Route copy | `features/site/data/routeCopy.ts` | Not systematically measured |

---

## Phase 4 — public product discovery

Plan: `PHASES-03-05.md` (Phase 4)

| Feature | Code | Gap |
|---|---|---|
| Catalog source | `lib/catalog/site/getProducts.ts` → `lib/catalog/sources.ts` | Drizzle when configured; fixture fallback when not |
| Category grid | `products/[category]/FilterGridInner.tsx` | Loading/error/empty states; **no** stale/recovery UI |
| Product detail | `products/[category]/[product]/page.tsx`, `ProductViewer.tsx` | JSON-LD; **Design in Planner** CTA with `siteProduct`/`siteCategory`; Planner import confirmation open |
| Choose product | `features/shared/entry/ChooseProductPage.tsx` | `PlannerLaunchLink` on workspace entry |
| Compare / quote cart | `CompareDock.tsx`, `quote-cart/page.tsx` | `SITE-PLAN-*` partial |

---

## Phase 5 — structured data and release proof

Plan: `PHASES-03-05.md` (Phase 5)

| Feature | Code | Gap |
|---|---|---|
| JSON-LD | homepage, product/category pages; `buildProductJsonLd` matches visible fields (no invented InStock) | Browser rendered validation + catalog-wide parity open |
| Release recheck | — | Full journey + monitoring proof open |

---

## Tests

`tests/unit/lib/analytics/conversionContract.test.ts` · `tests/unit/lib/analytics/siteEvents.test.ts` · `tests/unit/lib/analytics/plannerEntry.test.ts` · `tests/unit/lib/analytics/siteAttribution.test.ts` · `tests/unit/features/site/data/routeClassification.test.ts` · `tests/unit/app/(site)/sitemap.test.ts` · `tests/unit/app/(site)/robots.test.ts` · `tests/e2e/site-a11y-smoke.spec.ts`

---

## Reference (not truth)

`CHECKLIST.md` · `PHASES-01-02.md` · `PHASES-03-05.md` · `docs/architecture/09-SITE-UI-BENCHMARK.md`