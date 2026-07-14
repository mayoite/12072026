# Site checklist

Status only. Code map: `FEATURES.md`. Requirements: `PHASE-01` … `PHASE-05`.

Reconciled against `site/` on 2026-07-14. **Implemented-in-code items live in FEATURES.md, not here.**

## Shared start gate

- [ ] Catalog-writing tests satisfy Admin Step 0 isolation.
- [ ] Site catalog fixtures never change canonical catalog files.
- [ ] Browser tests use normal controls without forced clicks.
- [ ] Each Site command overwrites its stable results folder.

## Phase 1 — measurement and foundation

- [x] `SITE-IA-01` every `(site)` `page.tsx` route classified (`routeClassification.test.ts`).
- [x] `SITE-IA-02` public routes have audience, intent, owner, canonical, primary action in registry.
- [x] `SITE-IA-03` `/catalog` redirects to downloads (`catalog/page.tsx`).
- [x] `SITE-MEASURE-02` conversion dedupe (`conversionContract.test.ts`).
- [x] `SITE-MEASURE-03` analytics privacy filter (`conversionContract.test.ts`).
- [x] `SITE-SEO-02` title suffix dedup in `buildPageMetadata` (`lib/site-data/seo.ts`).
- [ ] `SITE-MEASURE-01` full funnel measurable in production (`PAGE_VIEW` + downstream events unwired).
- [ ] Source and campaign context survives Site → Planner entry.
- [ ] Consent gating wired before emit.
- [ ] Production-like `window.va` event receipt verified.
- [ ] Funnel, source, failure, and page reporting dashboards.
- [ ] `SITE-SEO-01`, `SITE-SEO-03` metadata / sitemap / robots aligned with `routeClassification.ts`.
- [ ] `SITE-PERF-01` … `SITE-PERF-03` field CWV budgets recorded and met.
- [ ] Critical console, request, hydration failures removed (fresh prod-like run).

## Phase 2 — commercial landing pages

- [x] `SITE-NAV-03` quote-cart link has accessible name (`Header.tsx`).
- [x] `SITE-HOME-01` … `SITE-HOME-04` homepage audience, value, proof, CTA, hero reading order, trust provenance (`homepage.ts`, `HomepageHero.test.tsx`).
- [ ] Customer segments, pages, and nav mapped to one intent + next action.
- [ ] `SITE-NAV-01`, `SITE-NAV-02`, `SITE-NAV-04`.
- [ ] `SITE-FORM-01` … `SITE-FORM-04`.
- [ ] `SITE-MOB-01` … `SITE-MOB-03`.
- [ ] `SITE-A11Y-01` … `SITE-A11Y-04` (smoke spec is not full AA sign-off).
- [ ] Page-to-Planner conversion events on all primary CTAs (not header-only).

## Phase 3 — search-led content

- [ ] `SITE-CONTENT-01` … `SITE-CONTENT-03`.
- [ ] Search-evidence workflow, ownership, and review dates on content pages.

## Phase 4 — public product discovery

- [x] `SITE-PROD-04` (partial) loading, error, filter-empty, category-empty in `FilterGridInner.tsx`.
- [ ] Released Products DB catalog only through server API (no fixture fallback in production).
- [ ] `SITE-PROD-01` … `SITE-PROD-03`, `SITE-PROD-05`, `SITE-PROD-06`.
- [ ] `SITE-PLAN-01` … `SITE-PLAN-03` product/family identity and campaign context into Planner.
- [ ] `SITE-MOB-04` phone product filters and comparison.

## Phase 5 — structured data and release proof

- [ ] `SITE-SEO-04` structured data matches visible released content.
- [ ] Sitemap, robots, redirects, and lifecycle agree.
- [ ] Full journey recheck in production-like build.
- [ ] Monitoring for route, schema, analytics, catalog, and conversion failures.

## Completion

- [ ] Public visitors discover truthful content and products without developer help.
- [ ] Product identity survives Site → Planner entry.
- [ ] Discovery → handoff journey measurable end-to-end.
- [ ] Fresh commands and exit codes recorded here.
- [ ] Only active failures remain in `../../Failures.md`.
