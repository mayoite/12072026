# Site completion contract

**Status:** OPEN  
**Authority:** This file is the **execution contract** for finishing the public **Site** track.  
**Relation to `FINISH-PLAN.md`:** Same product journey and phase intent (S0–S7). **Stricter** evidence, SEO, a11y, and reporting rules. Where this file and `FINISH-PLAN.md` conflict on **how to prove done**, **this file wins**. Product scope still matches FINISH-PLAN.

**Code maps:** `FEATURES.md` (live paths).  
**Detailed checklist:** `FINISH-PLAN.md` (S0–S7, SF registry, browser matrix).  
**UI bar:** `docs/architecture/09-SITE-UI-BENCHMARK.md`  
**Domain:** `docs/architecture/02-DOMAINS.md` (Site owns public visitors; not Planner layout or Admin inventory)  
**Security bar:** `docs/architecture/10-SECURITY-BENCHMARK.md` (public forms, auth redirects, no secret leakage)  
**i18n bar:** `docs/Lockedfiles/03-dependencies-engines-current.md` + `site/i18n/`  
**Active blockers:** `../../Failures.md` (real unresolved only)  
**Agent reports:** `../../agent-reports/` — short files + INDEX, never one mega dump

---

## 1. Outcome

Deliver a **professional commercial public website** that:

1. **Informs** visitors (who Oando is, solutions, proof, trust).  
2. **Discovers** released products (categories, identity, empty states honest).  
3. **Qualifies** intent (contact, quote cart, compare).  
4. **Hands off** to Planner (or login) with continuous product / campaign identity.  
5. **Measures** conversion without inventing catalog or price truth.

**Benchmark:** Haworth / Steelcase-class journey continuity (need → product → planning → contact), not their trade dress.  
**Not:** Planner canvas work, Admin SVG authoring, CRM redesign, tech-docs product.

Product loop (repo truth): **Admin publishes inventory → Site acquires visitors → Planner designs → BOQ → Oando.**

---

## 2. Truth rules (non-negotiable)

| Rule | Meaning |
|------|---------|
| Live code wins | Not plan ticks, not agent prose |
| Fresh browser wins | UI claims need current Chromium on current source |
| Unit ≠ browser | Unit-green never proves layout, SEO render, or form delivery |
| `results/` is not proof | Raw tool output only |
| Old reports die | Dated UI benchmarks do not clear items |
| OPEN / FAIL / PASS / PARTIAL | OPEN = unverified; FAIL = fresh fail; PASS = §2.1; PARTIAL = code without full proof |
| No silent skip | No `test.skip`, no forced clicks, no timeout masks |
| No handwritten `any` | Handwritten product/test code |
| Secrets | `.env.local` only |
| No catalog invention | Site never invents stock, price, or SKU not in released sources |
| Demo / commercial | Demo list prices never presented as approved commercial prices |

### 2.1 What counts as PASS

All that apply must be true:

1. **Code** on the claimed path (`FEATURES.md` or this file).  
2. **Unit** for pure logic: focused vitest exit 0, named files.  
3. **Browser** for customer-visible behaviour: Playwright or documented Chromium — route, viewport, steps, console errors = 0, failed requests (document/XHR) = 0.  
4. **SEO claims**: rendered HTML (title, canonical, robots, JSON-LD match visible fields).  
5. **Forms / analytics**: success path proved against real or staging backend, or explicit FAIL when env missing (not silent PASS).  
6. **Command + exit** in the same session as the PASS claim.  
7. Checkbox / SF status updated only with that evidence.

**Code only + unit** → **PARTIAL**, leave unchecked.

---

## 3. Evidence protocol

### 3.1 Gates (Site release acceptance)

From repo root — all exit **0** for release claim:

| Gate | Command |
|------|---------|
| Layout | `pnpm run check:layout` |
| Lint | `pnpm run lint` |
| Typecheck | `pnpm run typecheck` (stable; no `.next/dev/types` race) |
| Unit (site-relevant) | focused vitest on `features/site`, `components/home`, `app/(site)`, analytics, catalog site, sitemap/robots |
| A11y smoke | `pnpm --filter oando-site run test:a11y` and/or `tests/e2e/site-a11y-smoke.spec.ts` |
| i18n parity | `pnpm --filter oando-site run check:i18n:parity` when locales claimed |
| Build | `pnpm run build` (or site production build) |

Any gate FAIL → feature work may continue; **release PASS forbidden**.

### 3.2 Report shape (every slice)

`agent-reports/YYYY-MM-DD-site-<slice>.md` (≤50 lines):

```text
# Title
Verdict: PASS | PARTIAL | FAIL | OPEN
Evidence: commands + exits + routes + viewports
Done (path)
Not done (why)
```

Plus `agent-reports/YYYY-MM-DD-INDEX.md`.  
**Forbidden:** one multi-thousand-line dump as sole deliverable.

### 3.3 Agents

| Role | Must |
|------|------|
| Implementer | Code + tests; no PASS without commands |
| Parent | Re-run gates; write INDEX |
| Never | Mark FINISH-PLAN / SF items PASS without parent evidence |

---

## 4. Scope boundary

### In

- `site/app/(site)/` public and shared marketing routes  
- `site/app/sitemap.ts`, `site/app/robots.ts`  
- `site/components/` marketing presentation  
- `site/features/site/` data, assistant, advisor  
- Site analytics / consent / attribution / SEO helpers  
- Site→Planner entry (`PlannerLaunchLink`, query params, choose-product)  
- Public product listing and detail (consume released catalog)  
- Contact / customer-query forms (public)  
- i18n marketing locales (`en`, `hi`, `fr`, `de`, `es`)  
- Sitemap, robots, route classification  
- Site a11y, performance (CWV), brand surfaces (ecru paper where marketing tokens apply)

### Out

- Planner workspace implementation (see `plan/Planner/COMPLETION-CONTRACT.md`)  
- Admin catalog authoring / SVG editor redesign  
- DB-SVG cutover ownership (Admin/architecture; Site only **consumes** released catalog)  
- CRM ops UI  
- Tech-docs generator product work  

### Cross-track

| Dependency | Rule |
|------------|------|
| Empty catalog | Site may show honest empty state; **PASS for discovery requires** at least one released product category with products in the target env, or an explicit owner-accepted demo fixture env |
| Planner entry | Continuity of `siteProduct` / campaign params is Site exit; layout editing is Planner |
| Dual brand titles | Fix on Site metadata helpers |
| Canonical host | `SITE_URL` / env must agree with classification and robots host before SEO release PASS |

---

## 5. Product non-negotiables

- One primary commercial intent per primary landing (homepage hierarchy).  
- Accessible names for icon-only controls (quote cart, language, etc.).  
- Animated / split headings must produce **correct accessible text** (spaces preserved).  
- Every route has exactly one classification: public indexable | public noindex | auth-protected | redirect | operational/dead.  
- JSON-LD matches **visible** released fields only (no invented `InStock`).  
- Consent before analytics emit.  
- Forms: CSRF where applicable, rate limits, success/error/live regions.  
- Images: meaningful `alt` or decorative; no silent 400 hero assets on primary paths.  
- Light marketing surfaces respect brand **ecru** paper stack where `--surface-*` apply (not accidental cool grey-only if tokens say ecru).  
- `localePrefix: 'never'`; marketing i18n only via `next-intl` as locked.  
- No competitor assets or trade dress.

---

## 6. External benchmark (capability only)

| Source | Expectation |
|--------|-------------|
| Haworth / Steelcase | Need → proof → product → planning → contact continuity |
| Baymard product lists | Filters, sort, compare, loading, empty as one system |
| Google Search Essentials | Indexing floor, no soft-404 commercial pages |
| Google product data | Structured data = visible truth |
| web.dev a11y / CWV | Tap targets, contrast, LCP/INP risk on image-heavy home |

No copying assets, layout, or trade dress. Stable requirement IDs: `09-SITE-UI-BENCHMARK.md` (SITE-IA-*, SITE-HOME-*, SITE-PROD-*, …).

---

## 7. Failure registry (SF) — Site failures

Statuses: **PASS** | **PARTIAL** | **FAIL** | **OPEN**.  
Update only with fresh evidence. Seed mirrors `FINISH-PLAN.md` (2026-07-17 code read). **Not a browser PASS.**

| ID | Failure | Bar to clear | Status seed |
|----|---------|--------------|-------------|
| SF-01 | Homepage accessible heading loses spaces | Accessible name matches visible words with spaces | PARTIAL (code: sr-only join) — browser OPEN |
| SF-02 | Document titles double brand suffix | One brand segment in titles | PARTIAL (code: resolveDocumentTitle + absolute) — browser OPEN |
| SF-03 | Workstations / primary category 0 products | Real products or owner-accepted env story | OPEN / env FAIL |
| SF-04 | `/catalog` → downloads hero image broken | Destination images 200 | PARTIAL (code: dmrc-hero; no hero-3 ref) — browser OPEN |
| SF-05 | Route group classification incomplete | Every `(site)` page classified + sitemap/robots agree on target host | PARTIAL (code + unit) |
| SF-06 | Quote-cart / icon controls missing names | Accessible name on all header icons | OPEN (no quote-cart in header today) |
| SF-07 | Commercial hierarchy unclear on home | One primary CTA hierarchy browser-proved | OPEN |
| SF-08 | Planner handoff identity continuity unproved | Product/campaign params survive into Planner entry | PARTIAL (unit + PDP link) — browser OPEN |
| SF-09 | Conversion / form delivery unproved | Contact or query success + analytics receipt | OPEN |
| SF-10 | CWV / heavy homepage unmeasured | Field or lab LCP on home + products | OPEN |
| SF-11 | Planner conversion events never imported on Site path | Events that Site owns emit; document Planner-owned events as out of Site | OPEN |
| SF-12 | i18n parity unproved | `check:i18n:parity` + spot browser locale | OPEN |
| SF-13 | A11y = smoke only | No critical/serious axe on primary journey; WCAG 2.2 AA claim only after full proof | PARTIAL |
| SF-14 | HomepageHero image error fallback | Broken image does not blank hero | PARTIAL (code: onError) — browser OPEN |
| SF-15 | Compare / quote-cart incomplete | Buyer can compare and open quote cart with lines | OPEN |
| SF-16 | Empty/error/stale catalog recovery thin | Loading/error/empty + recovery UI browser-proved | PARTIAL |
| SF-17 | SEO unit-only | Rendered title/description/canonical/hreflang browser recheck | PARTIAL |
| SF-18 | Consent banner timed accept unproved | Consent gate before emit browser | OPEN |
| SF-19 | Soft-404 or thin content pages | Public pages have real content or noindex | PARTIAL |
| SF-20 | Cool monochrome / missing ecru on marketing | Surfaces use brand paper tokens where intended | OPEN until measured |
| SF-21 | **NEW** Canonical host mismatch | Classification base, `SITE_URL`, robots host, and production agree | OPEN |

Add new SF ids; do not bury issues. Keep FINISH-PLAN SF table in sync when statuses change.

---

## 8. Execution phases (S0–S7)

**Same phase ids as `FINISH-PLAN.md` so work maps 1:1.**  
**Difference:** each phase has **Exit gate** + **Proof required** + **Stop condition**. Detailed checkboxes live in FINISH-PLAN.

### S0 — Measurement and isolation

**Proof:** no canonical catalog mutation; deterministic marketing browser bootstrap; baseline SF list reproducible.  
**Exit:** Site tests isolated; browser serves current source.  
**Stop:** if tests write inventory or released DB rows — fix isolation before features.

### S1 — Route truth and SEO floor

**Exit:** No indexable commercial dead-end; titles clean; sitemap/robots agree on target host.  
**Proof:** browser titles/canonicals + unit classification + sitemap/robots tests.  
**Must clear (or owner-accept):** SF-02, SF-04, SF-05, SF-19, SF-21.

### S2 — Landing and commercial hierarchy

**Exit:** First viewport works on 1440×900 and 390×844.  
**Proof:** browser both viewports; axe home; no console/network fail on first load.  
**Must clear:** SF-01, SF-07, SF-14; measure SF-20.

### S3 — Navigation, chrome, forms

**Exit:** Visitor can complete contact without keyboard traps; consent before analytics.  
**Proof:** form e2e or documented staging; a11y smoke on contact; named icon controls.  
**Must clear:** SF-06, SF-09, SF-18.

### S4 — Product discovery

**Exit:** Buyer finds a product and enters Planner with identity (target env).  
**Proof:** browser products → detail → Planner entry; unit getProducts.  
**Must clear:** SF-03, SF-08, SF-15, SF-16 (honest empty still required if env empty).

### S5 — Content and i18n

**Exit:** No half-translated primary nav locales claimed as complete.  
**Proof:** `check:i18n:parity` + browser one secondary locale.  
**Must clear:** SF-12; SF-19 residual thin pages.

### S6 — Analytics and Site→Planner contract

**Exit:** Site-owned funnel events have a proof path.  
**Proof:** unit emitters + browser network or staging sink.  
**Must clear:** SF-08 continuity, SF-11 ownership boundary, SF-18 consent.

### S7 — A11y, performance, release

**Exit:** Site release claim allowed only with §3.1 green + S7 + matrix.  
**Proof:** gates table + browser matrix §9 (desktop + mobile portrait minimum).  
**Must clear:** SF-10, SF-13; no Critical SF open without owner accept.

---

## 9. Browser acceptance matrix

Every cell needs a **fresh** pass. No screenshots-only PASS.  
Copy journey rows from `FINISH-PLAN.md` § Browser acceptance matrix. Viewports:

| Name | Size |
|------|------|
| Desktop | 1440×900 |
| Compact | 1024×768 |
| Mobile portrait | 390×844 |
| Mobile landscape | 844×390 |

| Journey | Desktop | Mobile | Keyboard | Failure state |
|---------|---------|--------|----------|---------------|
| `/` first viewport hierarchy | [ ] | [ ] | [ ] | [ ] |
| Nav → Products categories | [ ] | [ ] | [ ] | [ ] |
| Category with products (non-empty env) | [ ] | [ ] | [ ] | [ ] |
| Empty category honest state | [ ] | [ ] | [ ] | [ ] |
| Product detail + JSON-LD match | [ ] | [ ] | [ ] | [ ] |
| Design in Planner entry params | [ ] | [ ] | [ ] | [ ] |
| Compare / quote cart | [ ] | [ ] | [ ] | [ ] |
| Contact form success | [ ] | [ ] | [ ] | [ ] |
| Consent then analytics | [ ] | [ ] | [ ] | [ ] |
| `/solutions` `/about` `/planning` | [ ] | [ ] | [ ] | [ ] |
| Locale switch (if UI exposes) | [ ] | [ ] | [ ] | [ ] |
| `/catalog` redirect destination healthy | [ ] | [ ] | [ ] | [ ] |
| Auth walls: dashboard/portal (redirect) | [ ] | [ ] | [ ] | [ ] |
| Axe primary set | [ ] | [ ] | — | — |

---

## 10. Required test coverage (minimum)

| Layer | Must cover |
|-------|------------|
| Unit | routeClassification, seo helpers (`resolveDocumentTitle`), conversionContract, siteEvents, attribution, plannerEntry, getProducts empty/error, sitemap/robots, homepage data honesty |
| Component | HomepageHero a11y text + image fallback, Header names, Contact form states |
| E2E | site-a11y-smoke primary routes; product empty/non-empty; Planner entry query |
| SEO | rendered metadata not only unit builders |

Name-mirror where product files change.

---

## 11. Dependency order

```text
S0 isolation
  → S1 route/SEO truth
    → S2 landing hierarchy + heading a11y
      → S3 chrome/forms
        → S4 product discovery ──→ S6 analytics + Planner entry
        → S5 content/i18n
S7 a11y/perf/release (continuous; gates release)
```

Catalog emptiness is an **Admin/data** dependency for S4 commercial PASS; Site still owns honest empty UX.  
A blocker stops **only** direct dependants. Unrelated phases continue.

---

## 12. How this exceeds `FINISH-PLAN.md` and prior fragments

| Area | FINISH-PLAN / FEATURES | This contract |
|------|------------------------|---------------|
| Evidence | Detailed checklists | Explicit PASS recipe + gates |
| Reports | Implicit in plan | Short multi-file + INDEX mandatory |
| SEO / host | Checklist items | SF-21 + rendered HTML required |
| Brand / ecru | SF-20 in plan | Same; measured before PASS |
| False completion | Forbidden | PARTIAL vs PASS operationalized |
| Typecheck hygiene | Stated in gates | No PASS under `.next` type race |
| Phase files | Historical PHASES-* gone | S0–S7 1:1 with FINISH-PLAN |

`FINISH-PLAN.md` remains the detailed execution checklist.  
**Use this contract for new claims of done.**

---

## 13. Immediate priority queue

Owner may reorder; default:

1. **S0/S1** — isolation, route classification audit, titles (SF-02), host align (SF-21), catalog redirect assets (SF-04).  
2. **SF-01 / SF-14** homepage a11y + hero fallback browser.  
3. **S2** commercial hierarchy first viewport.  
4. **S4** product discovery in real env (or document FAIL + Failures.md).  
5. **S3** forms + consent.  
6. **S6** Planner entry continuity.  
7. **S7** release gates + CWV + matrix.

---

## 14. Owner acceptance

Site is **complete** only when:

1. §3.1 all green.  
2. Browser matrix §9: desktop + mobile portrait complete for primary commercial path; keyboard for nav + form or Planner entry.  
3. No Critical SF open (SF-01–05, SF-04 asset, empty primary category without owner accept, SF-21 host).  
4. `FEATURES.md` and `FINISH-PLAN.md` match live code and each other.  
5. Owner sign-off on production-like server (not only `next dev`).

Until then: **Status remains OPEN.**
