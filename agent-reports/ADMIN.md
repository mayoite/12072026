# Admin — status

**Date:** 2026-07-17  
**Deploy auth:** **NOT PROVEN** (browser/deploy without bypass OPEN)  
**Plans:** `plan/Admin/COMPLETION-CONTRACT.md` · `FINISH-PLAN.md` · `FEATURES.md`

## Agents

| Agent | Scope | Status |
|-------|--------|--------|
| FIX-ADMIN | Auth product + CRM + plan | **DONE** (77 unit / layout 0) |
| TDD-3 | Auth TDD bypass OFF | **DONE** → `2026-07-17-tdd3-admin-auth.md` |
| EXEC-1 A0 | Test isolation | **DONE** → `2026-07-17-admin-exec1-a0-isolation.md` |
| EXEC-2 A1 | Auth gates | **DONE** → `2026-07-17-admin-exec2-a1-auth.md` |
| EXEC-3 A2 | SVG publish | **DONE** unit → `2026-07-17-admin-exec3-a2-publish.md`; browser **OPEN** |
| EXEC-4 A3 | Dual-write | **DONE** → `2026-07-17-admin-exec4-a3-dualwrite.md` |
| EXEC-5 A4 | Lifecycle / families / prices | **DONE** → `2026-07-17-admin-exec5-a4-catalog.md` |
| EXEC-6 A5/A6 | Ops CRM security | **DONE** → `2026-07-17-admin-exec6-a5-a6-ops.md` |
| A-W2 | AF-06 phone catalog UX | **DONE** unit → `2026-07-17-aw2-phone-catalog.md`; browser **OPEN** |
| A-W3 | AF-07 price book UX | **DONE** unit → `2026-07-17-aw3-price-book.md`; browser **OPEN** |

Parent does not cancel without owner ask.

## Unit truth (this session)

| Area | Result |
|------|--------|
| A0 catalog write isolation guard + tests | **PASS** |
| A1 auth bypass off (proxy/layout/API) | **PASS** |
| A2 SVG disk publish (compile→S4→persist, stale/rollback, mirror) | **PASS** (90 focused tests) |
| A3 dual-write modes | **PASS** (5+4 tests) |
| A4 lifecycle / families / price-book unit | **PASS** (EXEC-5) |
| AF-06 phone catalog UX unit (A-W2) | **PASS** unit; browser **OPEN** |
| AF-07 price book UX unit (A-W3) | **PASS** unit (117 pricing); browser **OPEN** |
| CRM hub + localStorage honesty (EXEC-6) | **PASS** (unit); browser OPEN |
| Ops nav reachability (EXEC-6) | **PASS** (unit); browser OPEN |
| CSRF/rate ops slice (EXEC-6) | **PARTIAL** (AF-14 full matrix OPEN) |
| Browser unauth / deploy auth | **OPEN** |
| DB-SVG cutover | **OPEN** |
| Full release:gate | **NOT CLAIMED** |

## Checklist
Owner-ordered ticks in FINISH-PLAN for unit-proven A0–A1–A3–A7–A9–A10–A11 slice (+ A4 unit paths).

## TopBar package + ecru (owner request)
| Item | Status |
|------|--------|
| Planner package brand \| center \| actions | **DONE** unit |
| Ecru header (not ocean dark) | **DONE** |
| SVG studio topbar ecru flat | **DONE** |
| List `.admin-toolbar` ecru strip | **DONE** |
| Browser visual | **OPEN** |
| Slice | `2026-07-17-admin-topbar-ecru.md` |

## Open next
1. Browser unauth → `/access` without bypass  
2. Browser: Admin topbar ecru + SVG studio + optional SVG publish smoke  
3. AF-06 browser 390×844 (unit done A-W2) + AF-07 browser  
4. CRM/ops browser honesty + full AF-14 matrix when owner asks  
5. DB-SVG cutover remains OPEN until revision authority proven  

## Bar
Bypass-on ≠ deploy auth. Unit ≠ browser for UI release.

---

## X-W1

**Slice:** CSRF + rate-limit mutation matrix (static/unit) — admin ops sample + site forms.  
**Report:** `agent-reports/2026-07-17-xw1-csrf.md`

| Item | Status | Evidence |
|------|--------|----------|
| Static audit matrix (admin mutators) | **PASS** | `test:audit:api-routes` 0; 37 mutator rows |
| Admin ops CSRF/rate source proof | **PASS** (unit) | plans, themes publish, features, price-books action, svg-editor, catalog, manage, theme/manage |
| Site form rate + honeypot | **PASS** (unit) | `customer-queries` optional CSRF; manage CSRF_FAILED |
| `check:layout` | **PASS** | exit 0 |
| Browser CSRF journey | **OPEN** | not run |
| AF-14 full browser matrix | **OPEN** | static sample only |

**Did not touch:** svg-editor publish logic, price-book domain, auth bypass product.

---

## A-W2

**Slice:** AF-06 phone catalog layout — unit-testable UX (cards-priority, labels, ≥44px actions).  
**Report:** `agent-reports/2026-07-17-aw2-phone-catalog.md`

| Item | Status | Evidence |
|------|--------|----------|
| cards-priority markup | **PASS** (unit) | wrap + table + inventory `data-phone-layout` |
| Cell `data-label` set | **PASS** (unit) | Name/Category/Size/Status/Actions |
| Non-icon-only actions | **PASS** (unit) | Edit / Hide\|Show / Delete text |
| ≥44px tap contract | **PASS** (unit + CSS) | `data-min-tap-px="44"`, CSS `min-height: 2.75rem` |
| CSS Name-as-header / paging | **PASS** (unit file contract) | admin-pages.css |
| Browser 390×844 | **OPEN** | not run this agent |
| `check:layout` | **PASS** | exit 0 |
| Focused vitest | **PASS** | 3 files / 21 tests |

**Did not touch:** svg-editor publish, price books, auth, planner, site.

---

## A-W3

**Slice:** AF-07 price book UX — currency primary, minor units under Advanced, action hierarchy.  
**Report:** `agent-reports/2026-07-17-aw3-price-book.md`

| Item | Status | Evidence |
|------|--------|----------|
| Currency primary (rules table) | **PASS** (unit) | `AdminPriceBookPageView` + contract formatters |
| Minor units / adj bps under Advanced | **PASS** (unit) | collapsed `<details>`; not primary headers |
| Activate primary; approve outline; rollback danger | **PASS** (unit) | class + enablement for active/draft/approved |
| Pricing unit suite | **PASS** | 10 files / 117 tests |
| `check:layout` | **PASS** | exit 0 |
| Browser ADM-PRICE | **OPEN** | not run |
| Full release:gate / deploy auth | **OPEN** | not claimed |

**Did not touch:** AF-06 catalog tables, svg-editor, auth, planner, site.

---

## X-W2

**Slice:** Failures.md + DB-SVG honesty only (no product code).  
**Report:** `agent-reports/2026-07-17-xw2-failures.md`

| Item | Status | Evidence |
|------|--------|----------|
| Disk live Admin publish authority | **CONFIRMED** | publish pipeline + catalog paths |
| Dual-write only when DB + R2 ListObjects ok | **CONFIRMED** | `resolveSvgPublishDualWriteDeps` |
| Live R2 ListObjects | **ok** (2026-07-17) | probe; dual-write **can** inject |
| Enabled dual-write = cutover | **NO** | stub payload; Planner disk gate |
| Failures.md DB-SVG cutover | **OPEN** (wording refreshed) | `DB-SVG-01`…`20` |
| Fake cutover PASS | **None** | |

**Did not touch:** svg-editor product paths, auth, CRM, commit.

---

## EXEC-3 A2

**Slice:** SVG authoring + disk publish authority (not DB cutover).  
**Report:** `agent-reports/2026-07-17-admin-exec3-a2-publish.md`

| Item | Status | Evidence |
|------|--------|----------|
| compile → S4 disk → persist; fail-closed compile | **PASS** (unit) | `publishDescriptorWithPipeline` |
| Rollback + stale-draft gates | **PASS** (unit) | rollback + staleDraft + action stale gate |
| UI admits disk authority | **PASS** (unit) | list source, edit shell, publish messages |
| Supabase mirror best-effort (no disk rollback) | **PASS** (unit) | action fail + throw cases |
| Temp roots / no canonical write in tests | **PASS** | mkdtemp pipeline/rollback; action mocks |
| Route dual-write isolation mock | **PASS** | route.test skips inject for disk path |
| Browser publish smoke | **OPEN** | optional; not run |
| DB-SVG / R2 cutover | **OPEN** | Failures.md; not claimed |
| `check:layout` | **PASS** | exit 0 |
| Focused vitest | **PASS** | 11 files / 90 tests |

**Did not touch:** `resolveSvgPublishDualWrite` pure gate (A3), price books, CRM, proxy auth.

---

## EXEC-6 A5/A6

**Slice:** Ops surfaces + CRM localStorage demo honesty + CSRF/rate-limit hygiene on ops mutations.  
**Report:** `agent-reports/2026-07-17-admin-exec6-a5-a6-ops.md`

| Item | Status | Evidence |
|------|--------|----------|
| `/admin/crm` pipeline hub | **PASS** (unit) | hub page + unit |
| CRM localStorage labelled | **PASS** (unit) | workspace banner + page copy; browser OPEN |
| No production CRM claim | **PASS** (copy/unit) | banners + hub |
| Plans/features/analytics/themes/inventory reachable | **PASS** (nav/page unit) | `adminNav` + page tests; browser OPEN |
| Customer-queries manage auth distinct | **PASS** (code) | session **or** token; server-backed inbox |
| CSRF + rate limits (ops slice) | **PARTIAL** | plans, themes publish, features, manage; AF-14 full matrix OPEN |
| `check:layout` | **PASS** | exit 0 |
| Focused unit + eslint | **PASS** | 35 files / 119 tests; focused eslint 0 |
| Full release:gate / deploy auth | **OPEN** | not run / not claimed |

**Did not touch:** svg-editor publish, price books domain, planner.
