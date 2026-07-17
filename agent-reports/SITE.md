# Site — status

**Date:** 2026-07-17  
**Deploy SEO:** unit host/env contracts GREEN (TDD-4); **production re-probe OPEN**  
**Plans target:** `plan/Site/COMPLETION-CONTRACT.md` · `FINISH-PLAN.md` · `FEATURES.md`  
**TDD-4 report:** `agent-reports/2026-07-17-tdd4-site-seo.md`

## Agents (active)

| Agent | Scope | Status |
|-------|--------|--------|
| Docs 1 / 3 / 5 | Plan docs | **RUNNING** (do not cancel) |
| **FIX-SITE** | SEO routes, public hygiene, FINISH-PLAN, entry/contact | **RUNNING** |
| **TDD-4** | robots/sitemap env host, Footer Admin, redirects, not-found | **DONE** — 14 files / 60 tests · `2026-07-17-tdd4-site-seo.md` |
| **S-W2** | SF-02 titles + host SEO honesty | **DONE** — unit 80 tests · `2026-07-17-sw2-titles-seo.md` |
| **FIX-SITE** | SEO product + plans | **DONE** earlier |

## S-W2

**Slice:** SF-02 double-brand titles + SEO title helpers; host honesty via `SITE_URL` (TDD-4 kept green).

| Proof | Detail |
|-------|--------|
| Helpers | `resolveDocumentTitle` collapses multi brand pipes; `title.absolute` on all `buildPageMetadata` |
| Layout | Portal + SVG catalog layouts use absolute single-brand titles |
| Host | Canonicals / metadataBase from normalized caller origin; no localhost invent |
| Command | 8 vitest files / 80 tests exit 0 (includes robots/sitemap + siteUrl) |
| Layout guard | `pnpm run check:layout` OK |
| Residual | Browser titles OPEN; guest portal page string title left (not layout); production re-probe OPEN |

## Last known product truth
- robots/sitemap driven by `SITE_URL` (env / production default; not localhost) — unit proved via resetModules  
- Footer real nav has no public Admin link — unit  
- Unknown solutions + legacy category alias hard-404/redirect — unit  
- Contact + plannerEntry pure helpers covered  
- **SF-02 unit:** document titles resolve to ≤1 pure brand pipe segment; absolute metadata; TDD-4 still green  
- 6-viewport overflow checks claimed earlier — not re-run this session  

## Open next
1. Production host SEO re-probe (robots/sitemap live)  
2. Browser title/canonical recheck (SF-02 browser bar)  
3. Docs land Site FINISH-PLAN parity  
4. Live contact / Planner entry browser  

## Checklist (owner order 2026-07-17)

`plan/Site/FINISH-PLAN.md` ticks: S1 robots/sitemap/hard-404, S3 footer/contact unit, S4 Planner entry **[PASS]**. SF-02 **unit PASS** / browser OPEN. Production SEO / browser matrix OPEN.

## Bar
Dev SEO pass ≠ production SEO pass.  
Unit title pass ≠ browser title pass.
