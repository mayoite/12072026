# Site features

Repo-sourced index: **plan phase → code path → honest gap**. Reconciled against `site/` on 2026-07-14.

| Doc | Role |
|---|---|
| `PHASE-01` … `PHASE-05` | What to build and prove |
| This file | What exists in code today |
| `CHECKLIST.md` | Open acceptance work only |

**Code roots:** `site/app/(site)/` · `site/components/` · `site/features/site/` (`data/`, `assistant/`, `advisor/`) · `site/lib/analytics/` · `site/lib/catalog/site/`

---

## Phase 1 — measurement and foundation

Plan: `PHASE-01-measurement-foundation.md`

| Feature | Code | Gap |
|---|---|---|
| Route classification | `features/site/data/routeClassification.ts`, `tests/unit/features/site/data/routeClassification.test.ts` | Not consumed by sitemap/robots |
| Conversion contract | `lib/analytics/conversionContract.ts`, `conversionContract.test.ts` | **Defined**; funnel not wired end-to-end |
| Site emitters | `lib/analytics/siteEvents.ts`, `TrackedLink.tsx`, `Header.tsx` | Only `PLANNER_ENTRY` via `trackPlannerLaunchClicked` |
| Planner workspace events | `conversionContract.ts` defines `PROJECT_START`, `BOQ_*`, `HANDOFF_*` | **Planner never imports** `trackConversionEvent` |
| SEO helpers | `features/site/data/seo.ts`, `lib/analytics/seo.ts` | Partial page coverage |
| Sitemap / robots | `app/(site)/sitemap.ts`, `robots.ts` | Manual `STATIC_PATHS`; includes `/quote-cart`, `/tracking` while classification marks some non-indexable |
| Legacy redirect | `app/(site)/catalog/page.tsx` | `/catalog` → `/downloads` |

---

## Phase 2 — commercial landing pages

Plan: `PHASE-02-commercial-landing-pages.md`

| Feature | Code | Gap |
|---|---|---|
| Homepage | `app/(site)/page.tsx`, `HomepageHero.tsx`, `features/site/data/homepage.ts` | Trust provenance in data; **no** CWV/mobile proof |
| Generic hero fallback | `components/home/Hero.tsx` `onError` | Homepage uses `HomepageHero.tsx` without same fallback |
| Global nav | `components/site/Header.tsx`, `MobileNavDrawer.tsx` | Quote-cart `aria-label` done; `SITE-NAV-01/02/04` open |
| Forms | `components/contact/CustomerQueryForm.tsx` | Success/error exist; consent + `SITE-FORM-*` open |
| A11y smoke | `tests/e2e/site-a11y-smoke.spec.ts` | Axe critical/serious on 10 routes; not WCAG 2.2 AA sign-off |
| Planner CTAs | `Header.tsx`, `InteractiveTools.tsx` → `/planner` | Most page CTAs **don't** fire `planner_entry` |

---

## Phase 3 — search-led content

Plan: `PHASE-03-search-led-content.md`

| Feature | Code | Gap |
|---|---|---|
| Content pages | `app/(site)/about/`, `planning/`, `solutions/`, `news/`, etc. | No search-evidence workflow or `SITE-CONTENT-*` proof |
| Route copy | `features/site/data/routeCopy.ts` | Not systematically measured |

---

## Phase 4 — public product discovery

Plan: `PHASE-04-public-product-discovery.md`

| Feature | Code | Gap |
|---|---|---|
| Catalog source | `lib/catalog/site/getProducts.ts` → `lib/catalog/sources.ts` | Drizzle when configured; fixture fallback when not |
| Category grid | `products/[category]/FilterGridInner.tsx` | Loading/error/empty states; **no** stale/recovery UI |
| Product detail | `products/[category]/[product]/page.tsx`, `ProductViewer.tsx` | JSON-LD; always `InStock`; no Site→Planner identity handoff |
| Choose product | `features/shared/entry/ChooseProductPage.tsx` | Routes to canvas/guest; **no** conversion tracking |
| Compare / quote cart | `CompareDock.tsx`, `quote-cart/page.tsx` | `SITE-PLAN-*` open |

---

## Phase 5 — structured data and release proof

Plan: `PHASE-05-structured-data-release.md`

| Feature | Code | Gap |
|---|---|---|
| JSON-LD | `layout.tsx`, homepage, product/category pages | No rendered validation pipeline |
| Release recheck | — | Full journey + monitoring proof open |

---

## Parallel paths

- **Sitemap vs classification:** `sitemap.ts` hand list vs `PUBLIC_INDEXABLE_ROUTES` in `routeClassification.ts`
- **Analytics:** legacy `site_*` events vs `conversionContract` funnel
- **Catalog:** Drizzle products vs fixture fallback in `lib/catalog/sources.ts`

---

## Tests

`tests/unit/lib/analytics/conversionContract.test.ts` · `tests/unit/features/site/data/routeClassification.test.ts` · `tests/unit/components/home/HomepageHero.test.tsx` · `tests/e2e/site-a11y-smoke.spec.ts`

---

## Reference (not truth)

`CHECKLIST.md` · `PHASE-01` … `PHASE-05` · `docs/architecture/09-SITE-UI-BENCHMARK.md`
