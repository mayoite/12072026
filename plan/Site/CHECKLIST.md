# Site checklist

Open work only (plan purity: no completed ticks here). Code map: `FEATURES.md`.

## Gate

- [ ] Catalog-writing tests use Admin Step 0 isolation; fixtures never touch canonical catalog.
- [ ] Browser tests: normal controls; overwrite stable `results/site/` folders only.

## Measure + SEO

- [ ] Production `window.va` receipt; funnel dashboards.
- [ ] `SITE-PERF-01`…`03` field CWV recorded.
- [ ] Fresh prod-like run: no critical console/request/hydration errors.
- [ ] `SITE-SEO-01`/`03`/`04` browser recheck (unit contracts exist; not browser PASS).

## Landing + a11y

- [ ] Nav/forms/mobile/a11y: `SITE-NAV-*`, `SITE-FORM-*`, `SITE-MOB-*`, `SITE-A11Y-*`.
- [ ] Planner conversion on all primary CTAs (not header/showcase/PDP only).

## Content + products

- [ ] `SITE-CONTENT-01`…`03` search content system.
- [ ] Released catalog only via server API in production; `SITE-PROD-*` / `SITE-PLAN-02`…`03` / `SITE-MOB-04`.

## Release

- [ ] Structured data + sitemap/robots lifecycle recheck; monitoring; full journey prod-like.
