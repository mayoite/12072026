# Site checklist

Code map: `FEATURES.md`. Blockers: `../../Failures.md`.

Fresh commands and exit codes must be recorded here. Old reports prove nothing.

---

## Step 0 — test isolation

- [ ] Catalog-writing tests use Admin Step 0 isolation; fixtures never touch canonical catalog.
- [ ] Browser tests use normal controls; overwrite stable `results/site/` folders only.

---

## Measurement and analytics

- [ ] Production analytics receipt verified in Vercel dashboard — funnel events visible.
  - Transport correct: `sendAnalyticsEvent` calls `vercelTrack()` from package. Test covers this. Needs prod-like deployment to confirm events reach Vercel.
- [ ] `SITE-PERF-01`…`03` field CWV recorded.
- [ ] Fresh prod-like run: no critical console, request, or hydration errors.
- [ ] `PROJECT_START`, `FIRST_PLACEMENT`, `BOQ_GENERATED`, `HANDOFF_*` events wired in Planner and confirmed here.
  - Gap: Planner never imports `trackConversionEvent` today.

---

## SEO

- [ ] `SITE-SEO-01`/`03`/`04` browser recheck — unit contracts exist; not browser PASS yet.
- [ ] Structured data (JSON-LD) browser-rendered validation + catalog-wide parity.
- [ ] Sitemap and robots lifecycle recheck.

---

## Landing, nav, and a11y

- [ ] `SITE-NAV-01`/`02`/`04` — global nav verified in browser.
- [ ] `SITE-FORM-*` — contact form: consent, success, and error states.
- [ ] `SITE-MOB-*` — mobile layout verified.
- [ ] `SITE-A11Y-*` — axe critical/serious clean on primary routes; not yet WCAG 2.2 AA sign-off.
- [ ] Planner conversion wired on all primary CTAs — not header/showcase/PDP only.

---

## Content and products

- [ ] `SITE-CONTENT-01`…`03` search-content system verified.
- [ ] Released catalog served only via server API in production; fallback paths logged and monitored.
  - Fallback is intentional three-tier: DB → R2 nightly snapshot → bundled local index. `canQueryCatalogDatabase()` gates DB path. Not a bug.
- [ ] `SITE-PROD-*`, `SITE-PLAN-02`/`03`, `SITE-MOB-04` verified in browser.
- [ ] Timed accept banner proof — consent-gate before emit.
- [ ] Planner import confirmation on product detail and choose-product flows.

---

## Release

- [ ] Full journey prod-like run clean.
- [ ] Monitoring and alerting verified.
- [ ] Only active failures remain in `../../Failures.md`.
