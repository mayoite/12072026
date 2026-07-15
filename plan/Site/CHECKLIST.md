# Site checklist

Status only. Code map: `FEATURES.md`. Requirements: `PHASES-01-02.md`, `PHASES-03-05.md`.

Reconciled against `site/` on 2026-07-15. **Implemented-in-code items live in FEATURES.md, not here.**

Open acceptance and browser proof only. No checked boxes (plan purity).

## Shared start gate

- [ ] Catalog-writing tests satisfy Admin Step 0 isolation.
- [ ] Site catalog fixtures never change canonical catalog files.
- [ ] Browser tests use normal controls without forced clicks.
- [ ] Each Site command overwrites its stable results folder.

## Phase 1 — measurement and foundation

- [ ] Production-like `window.va` event receipt verified.
- [ ] Funnel, source, failure, and page reporting dashboards.
- [ ] `SITE-PERF-01` … `SITE-PERF-03` field CWV budgets recorded and met.
- [ ] Critical console, request, hydration failures removed (fresh prod-like run).
- [ ] `SITE-SEO-01`, `SITE-SEO-03`, `SITE-SEO-04` browser/prod recheck (unit contracts exist; not browser PASS).

## Phase 2 — commercial landing pages

- [ ] Customer segments, pages, and nav mapped to one intent + next action.
- [ ] `SITE-NAV-01`, `SITE-NAV-02`, `SITE-NAV-04`.
- [ ] `SITE-FORM-01` … `SITE-FORM-04`.
- [ ] `SITE-MOB-01` … `SITE-MOB-03`.
- [ ] `SITE-A11Y-01` … `SITE-A11Y-04` (smoke spec is not full AA sign-off).
- [ ] Page-to-Planner conversion events on all primary CTAs (not header/showcase/PDP only).

## Phase 3 — search-led content

- [ ] `SITE-CONTENT-01` … `SITE-CONTENT-03`.
- [ ] Search-evidence workflow, ownership, and review dates on content pages.

## Phase 4 — public product discovery

- [ ] Released Products DB catalog only through server API (no fixture fallback in production).
- [ ] `SITE-PROD-01` … `SITE-PROD-03`, `SITE-PROD-05`, `SITE-PROD-06`.
- [ ] `SITE-PLAN-02` … `SITE-PLAN-03` Planner confirms imported product context.
- [ ] `SITE-MOB-04` phone product filters and comparison.
- [ ] `SITE-PROD-04` / `SITE-PLAN-01` fresh browser proof (partial code exists in FEATURES.md).

## Phase 5 — structured data and release proof

- [ ] `SITE-SEO-04` structured data matches visible released content (browser).
- [ ] Sitemap, robots, redirects, and lifecycle agree (fresh browser/prod recheck).
- [ ] Full journey recheck in production-like build.
- [ ] Monitoring for route, schema, analytics, catalog, and conversion failures.

## Completion

- [ ] Public visitors discover truthful content and products without developer help.
- [ ] Product identity survives Site → Planner entry (Planner import proof).
- [ ] Discovery → handoff journey measurable end-to-end.
- [ ] Fresh commands and exit codes recorded here.
- [ ] Only active failures remain in `../../Failures.md`.
