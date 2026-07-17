# Site world-standard completion plan

Status: OPEN.

**Proof bar:** For new PASS claims and release, follow `COMPLETION-CONTRACT.md` (stricter evidence). This file keeps the detailed phase checklist (S0–S7).

Owner instruction: Site only. Agents only when the owner asks; parent re-verifies gates.

## Outcome

Deliver a professional commercial public website.

The product loop is:

1. Admin publishes inventory.
2. Site informs and qualifies visitors.
3. Visitor enters Planner with product / campaign identity.
4. Customer designs, generates branded BOQ, sends to Oando.

Site owns acquisition, discovery, contact, SEO, and Site→Planner entry continuity — not Planner layout or Admin inventory.

## Truth rules

- Live code wins.
- Fresh browser behaviour wins.
- Every checklist item starts unchecked unless freshly proved in this session.
- Unit tests do not prove UI acceptance.
- Old reports do not prove completion.
- `results/` contains raw output only.
- Active blockers belong in `Failures.md`.
- No Site failure may be hidden behind a later phase.
- No completed item may remain marked `OPEN`.
- No unverified item may be marked complete.
- OPEN / FAIL / PASS / PARTIAL per `COMPLETION-CONTRACT.md` §2.
- Viewport / CWV / production SEO claims need current runs — never re-claim from old ticks.

## Scope boundary

Included:

- `site/app/(site)/` public marketing routes
- `site/app/robots.ts`, `site/app/sitemap.ts`, root/`(site)` not-found
- `site/components/` marketing presentation
- `site/features/site/` data, assistant, advisor
- Site analytics / consent / attribution / SEO helpers
- Site→Planner entry (`PlannerLaunchLink`, query params, choose-product)
- Public product listing and detail (consume released catalog)
- Contact / customer-query forms (public)
- i18n marketing locales (`en`, `hi`, `fr`, `de`, `es`)
- Site a11y, performance (CWV), brand surfaces

Excluded:

- Planner workspace implementation (`plan/Planner/*`)
- Admin catalog authoring / SVG editor redesign
- DB-SVG cutover ownership
- CRM ops UI redesign
- Tech-docs product work

Inbound Planner entry is a Site exit contract. Layout editing defects are Planner. Catalog emptiness for commercial PASS is Admin/data dependency; Site still owns honest empty UX.

## Non-negotiable product decisions

- One primary commercial intent per primary landing.
- Accessible names for icon-only controls.
- Animated / split headings produce correct accessible text (spaces preserved).
- Every route has exactly one classification: public indexable | public noindex | auth-protected | redirect | operational/dead.
- `robots.ts` / `sitemap.ts` live at App Router root (`app/`), driven by classification + `SITE_URL` (never hardcoded localhost when env provides site URL; production default is public origin).
- JSON-LD matches visible released fields only.
- Consent before analytics emit.
- Forms: CSRF where applicable, rate limits, success/error/live regions; API error envelopes surface human messages.
- Public chrome never exposes Admin destinations.
- Unknown solutions slugs hard-404 (`dynamicParams = false` + `notFound`), not soft marketing shells.
- Demo list prices never presented as approved commercial prices.
- `localePrefix: 'never'`; marketing i18n only via `next-intl` as locked.

## External benchmark

Capability only — no copying assets, layout, or trade dress.

| Source | Expectation |
|--------|-------------|
| Haworth / Steelcase | Need → proof → product → planning → contact continuity |
| Baymard product lists | Filters, sort, compare, loading, empty as one system |
| Google Search Essentials | Indexing floor, no soft-404 commercial pages |
| Google product data | Structured data = visible truth |
| web.dev a11y / CWV | Tap targets, contrast, LCP/INP risk on image-heavy home |

## Current verified position

Execution update: 2026-07-17 (FIX-SITE).

| Phase | Execution status | Truth |
|---|---|---|
| S0 | PARTIAL | Isolation rules documented; full Site browser bootstrap proof open |
| S1 | PARTIAL | robots/sitemap unit PASS (FIX-SITE); host via SITE_URL; production re-probe OPEN |
| S2 | OPEN / PARTIAL | Landing hierarchy + SF-01 heading a11y not re-proved this session |
| S3 | PARTIAL | Footer no-admin + contact error envelope unit PASS; live form delivery OPEN |
| S4 | PARTIAL | Planner entry unit green; product discovery env-dependent |
| S5 | OPEN | Content + i18n parity proof open |
| S6 | PARTIAL | Planner entry params unit-covered; production analytics receipt OPEN |
| S7 | OPEN | Release gates + CWV + full browser matrix open |

**Failure registry:** `COMPLETION-CONTRACT.md` §7 (**SF-01–SF-21**). Update only with fresh evidence.  
**Browser matrix:** `COMPLETION-CONTRACT.md` §9. No screenshots-only PASS.

Fresh local unit (this session): robots/sitemap/siteUrl, footer no-admin, solutions hard-404, plannerEntry, CustomerQueryForm/ContactTeaser error parsing — run commands in agent fix report. **Not** production SEO pass. **Not** 6-viewport PASS.

## Execution phases (S0–S7)

### S0 — Measurement and isolation

- [ ] Site-only test run id / output under `results/site/` when used
- [ ] No test mutates canonical catalog or released DB rows
- [ ] Deterministic browser bootstrap for marketing routes
- [ ] Baseline SF list reproducible

**Exit:** Site tests isolated; browser serves current source.  
**Proof:** unit route classification + one Playwright list green.

### S1 — Route truth and SEO floor

- [PASS] Classify every `app/(site)` route (public / noindex / auth / redirect / dead) (classification module + unit; browser OPEN)
- [PASS] `app/sitemap.ts` / `app/robots.ts` match classification (unit FIX-SITE 2026-07-17)
- [ ] Fix double-brand titles (SF-02)
- [ ] Fix broken redirect destinations (SF-04)
- [ ] Canonical + hreflang correct for indexable locales
- [PASS] Soft-404 / thin pages — solutions unknown slugs hard-404 (unit FIX-SITE)
- [ ] Production host SEO re-probe (robots/sitemap live)

**Exit:** No indexable commercial dead-end; titles clean.  
**Proof:** browser titles/canonicals + unit classification + sitemap test + production re-probe.

### S2 — Landing and commercial hierarchy

- [ ] Homepage: audience, value, proof, **one** primary next action above fold
- [ ] SF-01 heading a11y spaces fixed
- [ ] Trust / proof provenance not inventing metrics
- [ ] Planner / Products / Contact CTAs hierarchy consistent
- [ ] Ecru / brand surfaces measured on home (SF-20)

**Exit:** First viewport works on 1440×900 and 390×844.  
**Proof:** browser both viewports; axe home; no console/network fail on first load.

### S3 — Navigation, chrome, forms

- [PASS] Header/mobile nav; public footer has no Admin link (unit FIX-SITE)
- [PASS] Contact / customer query: labels, errors, success (envelope via `readApiErrorMessage`) unit S-W3; live delivery OPEN
- [ ] SF-09 form delivery proved or FAIL with env blocker in Failures.md
- [PASS] Cookie consent before analytics emit (`SiteAnalytics` beforeSend + `hasAnalyticsConsent` + queue unit S-W3); timed accept browser OPEN

**Exit:** Visitor can complete contact without keyboard traps.  
**Proof:** form e2e or documented staging; a11y smoke on contact.

### S4 — Product discovery

- [ ] Category landing with real products in target env (or accepted fixture env)
- [ ] Search, filter, sort, empty/loading/error
- [ ] Product detail: identity, dimensions, media, JSON-LD = visible
- [PASS] Design in Planner CTA with continuous product params (unit SF-08 / plannerEntry FIX-SITE)
- [ ] Compare + quote cart path (SF-15)

**Exit:** Buyer finds a product and enters Planner with identity.  
**Proof:** browser products → detail → Planner entry; unit getProducts.

### S5 — Content and i18n

- [ ] About, solutions, planning, etc. real content or noindex
- [ ] Locale parity gate green
- [ ] Spot-check non-en locale for layout/overflow

**Exit:** No half-translated primary nav locales claimed as complete.  
**Proof:** `check:i18n:parity` + browser one secondary locale.

### S6 — Analytics and Site→Planner contract

- [PARTIAL] `PAGE_VIEW`, CTA, `PLANNER_ENTRY` emitters unit
- [PARTIAL] Attribution cookies / query params unit
- [ ] Production analytics receipt verified or OPEN with owner accept
- [ ] Document which conversion events are Planner-only (not Site FAIL)

**Exit:** Site-owned funnel events have a proof path.  
**Proof:** unit emitters + browser network or staging sink.

### S7 — A11y, performance, release

- [ ] Primary journey axe: no critical/serious
- [ ] Keyboard primary path (nav → products → contact or Planner)
- [ ] Tap targets ≥44px on primary controls where practical
- [ ] Reduced motion respected on marketing motion
- [ ] LCP risk mitigated on home
- [ ] Production-like build + server check
- [ ] FEATURES.md updated from code
- [ ] Failures.md only real open blockers

**Exit:** Site release claim allowed only with COMPLETION-CONTRACT §3.1 green + S7.  
**Proof:** gates table + browser matrix in contract §9.

## Dependency order

```text
S0 isolation
  → S1 route/SEO truth
    → S2 landing hierarchy + heading a11y
      → S3 chrome/forms
        → S4 product discovery ──→ S6 analytics + Planner entry
        → S5 content/i18n
S7 a11y/perf/release (continuous; gates release)
```

## Immediate priority queue

1. **S0/S1** — production SEO re-probe; titles (SF-02); catalog redirect asset (SF-04).
2. **SF-01** homepage accessible heading.
3. **S2** commercial hierarchy first viewport.
4. **S4** product discovery in real env (or document FAIL + Failures.md).
5. **S3** forms live delivery + consent browser.
6. **S6** Planner entry browser continuity.
7. **S7** release gates + CWV.

## Owner acceptance

Site is **complete** only when COMPLETION-CONTRACT §14 is satisfied.

Until then: **Status remains OPEN.**
