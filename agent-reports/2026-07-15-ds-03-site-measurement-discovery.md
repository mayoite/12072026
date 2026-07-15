# DS-03 — Site measurement, discovery & Planner entry

**Status:** Options design only. Not implemented.  
**UI verified this session:** **No.** Evidence is code + `plan/Site/*` + FEATURES. Live homepage/products not opened here.  
**Problem cluster:** Conversion funnel mostly unwired; sitemap ≠ route classification; fixture catalog fallback; weak Site→Planner identity/campaign handoff; SEO/CWV/a11y acceptance open.

---

## Goal

Public visitors discover truthful Oando content and released products, enter Planner with stable product/campaign context, and leave a measurable funnel from view → entry → (later) handoff.

---

## Option A — Measurement-first, content later

**What:** Wire the full conversion contract (`PAGE_VIEW` through `HANDOFF_*` where Site owns), consent gate, source/campaign survival into Planner, production-like `va` proof. Defer content/SEO polish until funnel is real.

| Pros | Cons |
|---|---|
| Stops flying blind on acquisition | Pages still imperfect for SEO/a11y |
| Small code surface vs full site redesign | Needs Planner to emit its half of events |
| Aligns Phase 1 checklist | No pretty CWV story yet |

**Best when:** Owner needs analytics truth before marketing expansion.  
**Effort:** Low–Medium · **Risk:** Low · **Unblocks:** Funnel dashboards, campaign ROI

### Solution shape

1. Emit `PAGE_VIEW` on public routes with consent.  
2. All primary CTAs fire `PLANNER_ENTRY` (not header-only).  
3. Query/session: `utm_*` + product/family id into Planner entry URL/state.  
4. Privacy filter + dedupe already partially exist — finish wire-up.  
5. Staging proof: capture `window.va` (or sink) for one full path.  
6. Sitemap generation from `routeClassification` only.

---

## Option B — Released catalog-only discovery

**What:** Production Site products API **never** serves fixture fallback. Empty/error states only. Product detail stops hardcoding `InStock` unless DB says so. JSON-LD matches visible released fields only. Identity handoff to Planner required on “Design” CTAs.

| Pros | Cons |
|---|---|
| Stops lying to search engines and buyers | Empty site if DB unset — needs seed/ops |
| Aligns commercial honesty | Blocks offline/demo marketing without staging data |
| Cleaner Site→Planner contract | Depends on Admin/DB product rows quality |

**Best when:** Public catalog must be trusted inventory.  
**Effort:** Medium · **Risk:** Medium (empty pages) · **Unblocks:** SITE-PROD / SITE-PLAN acceptance

### Solution shape

1. `lib/catalog/sources.ts`: fixture only when `ALLOW_CATALOG_FIXTURE=1` and non-production.  
2. Product pages: availability from released row; no always-InStock.  
3. Compare/quote-cart/choose-product: pass stable product id into Planner.  
4. Structured data validation script vs rendered HTML.  
5. Phone filters/comparison to benchmark minimum.  
6. Monitoring: catalog fetch failure alerts.

---

## Option C — Commercial page quality pass (UI/SEO/CWV)

**What:** Close Site UI benchmark IDs (nav, forms, mobile, a11y smoke→AA on primary journeys), CWV field budgets, search-led content ownership, robots/sitemap lifecycle. Measurement and catalog honesty only at smoke level.

| Pros | Cons |
|---|---|
| Marketing-ready look/feel | Can ship pretty pages with wrong catalog/analytics |
| Matches design-system and a11y debt | Highest UI work; needs real browser verification |
| SEO structure gains | Does not fix Planner or Admin authority |

**Best when:** Brand/launch date is the pressure.  
**Effort:** High · **Risk:** Medium (scope creep) · **Unblocks:** SITE-NAV/FORM/MOB/A11Y/SEO phases

### Solution shape

1. Fresh Playwright + axe on primary routes; no force-clicks.  
2. Forms: consent, success/error, keyboard.  
3. Mobile nav and product filters.  
4. Metadata/sitemap/robots single source.  
5. Content review dates and search-evidence fields on key pages.  
6. Field CWV capture (RUM or controlled Lighthouse with **Chrome**, not claimed from MCP gap).

---

## Recommendation

**Sequence A → B → C.** Measure first, stop fixture lies second, polish third. Doing C first recreates “looks done, isn’t.”

---

## UI debt tied to this DS (unverified live)

| Surface | Claimed gap (docs/code) | Needs live proof |
|---|---|---|
| Homepage | Hero/trust in data; no CWV/mobile proof | 1440 + 390, LCP element |
| Header CTAs | Planner entry tracking incomplete | Click path + network/analytics |
| Product grid/detail | Empty/error partial; stock honesty | Filter empty, DB-off vs DB-on |
| Contact form | Consent / SITE-FORM open | Keyboard + error recovery |
| Sitemap vs classification | Manual STATIC_PATHS drift | Diff indexable set |

---

## Key decisions (when owner picks)

1. Production empty catalog vs fixture (B).  
2. Consent required before any `PAGE_VIEW` (A).  
3. AA full site vs primary journeys only (C).

## Open questions

1. Is Vercel Analytics (`va`) the only sink, or also first-party?  
2. Which product id is canonical into Planner (slug, UUID, SKU)?  
3. Launch date for public catalog empty-state acceptability?

## PR plan (after option pick)

| PR | Depends | Content |
|---|---|---|
| S1 | — | Conversion emit + consent + CTA coverage |
| S2 | S1 | Campaign/product context into Planner entry |
| S3 | — | Fixture forbidden in production; availability truth |
| S4 | S3 | Sitemap from classification + JSON-LD check |
| S5 | browser | Mobile/a11y/CWV primary journey pass |

---

*Agent report. Not checklist PASS. Not UI verification.*
