# ADMIN EXEC-6 — A5/A6 Ops/CRM demo + security hygiene

**Date:** 2026-07-17  
**Agent:** ADMIN-EXEC-6 of 6  
**Scope:** Ops surfaces, Admin CRM demo honesty, CSRF/rate-limit slice on ops mutations, layout + focused tests  
**Deploy auth:** **OPEN** (not claimed; `DEV_AUTH_BYPASS` may be on locally)

## Mission map

Parent called this **A5 + A6** (Ops/CRM + security/release). Live `FINISH-PLAN.md` numbers the same work as **A9 / A10 / A11 / A12** (CRM + ops + security + release hygiene). This report uses both labels.

| Parent | FINISH-PLAN | Result |
|--------|-------------|--------|
| A5 CRM hub | A10 | PASS (unit) |
| A5 localStorage labelled | A10 / AF-08 | PASS (unit); browser OPEN |
| A5 ops reachable | A9 | PASS (nav + page units); browser OPEN |
| A6 CSRF/rate slice | A11 / AF-14 | PARTIAL (ops routes verified; full matrix OPEN) |
| A6 layout + focused tests | A12 | PASS for this slice only |
| Full release:gate | A12–A14 | **Not run / not claimed** |

## What changed

### CRM honesty (AF-08)

- Hub + clients/projects/quotes page copy states **browser localStorage demo**, not production CRM.
- Hub distinguishes **server-backed customer queries** from CRM demo store.
- `CrmWorkspaceBanner` always labels **localStorage** + **Not a production CRM**.
- `CrmDemoBanner` mounted on hub when `NEXT_PUBLIC_CRM_DEMO_MODE` is on (env seed switcher).

### Unit drift fixed

- `tests/unit/app/admin/customer-queries/page.test.tsx` — removed hollow `any` render; asserts `CrmSubnav` + `embedded` ops view.
- CRM page/hub/banner tests assert localStorage honesty copy.
- Added `tests/unit/app/admin/analytics/page.test.tsx` (empty folder → real shell unit).

### Ops reachability

- Confirmed `ADMIN_NAV_GROUPS` includes Plans, Features, Analytics, Themes, Inventory, CRM hub, Queries.
- Existing `adminNav.test.ts` + page units green.

### Customer-queries manage auth (distinct)

- Unchanged contract: admin session **or** `x-admin-token` (`CUSTOMER_QUERIES_ADMIN_TOKEN`).
- Not the CRM localStorage store.
- Embedded UI banner: **Server-backed inbox** / Supabase `customer_queries`.
- PATCH already CSRF + rate-limited; unit now asserts **403 CSRF_FAILED**.

### CSRF / rate limits (slice, not full AF-14)

Verified / strengthened tests for:

| Route | CSRF | Rate limit |
|-------|------|------------|
| `PATCH/DELETE /api/admin/plans` | yes | yes |
| `PATCH /api/admin/plans/[id]` | yes | yes |
| `POST /api/admin/themes/publish` | yes | yes |
| `PATCH /api/admin/features` | `requireCsrf: true` via withAuth | yes |
| `PATCH /api/customer-queries/manage` | yes (+ new 403 unit) | yes |

**Not claimed:** full admin mutation matrix (svg-editor owned by other EXECs; remaining catalog routes not exhaustively re-proven here).

## Commands (this session)

| Command | Exit | Notes |
|---------|------|-------|
| Focused vitest CRM/ops/nav/manage/plans/themes/features | **0** | 35 files / 119 tests |
| Focused eslint on EXEC-6 files | **0** | |
| `pnpm run check:layout` | **0** | |
| Full `pnpm run lint` | **not claimed** | Pre-existing planner lint errors outside scope |
| `release:gate` / build / typecheck full | **not run** | |

## Files touched

**Product**

- `site/features/crm/CrmWorkspaceBanner.tsx`
- `site/features/crm/CrmHubView.tsx`
- `site/app/admin/crm/page.tsx`
- `site/app/admin/crm/clients/page.tsx`
- `site/app/admin/crm/projects/page.tsx`
- `site/app/admin/crm/quotes/page.tsx`

**Tests**

- CRM page/hub/banner/quotes/clients/projects tests
- `site/tests/unit/app/admin/customer-queries/page.test.tsx`
- `site/tests/unit/app/admin/analytics/page.test.tsx`
- `site/tests/unit/app/api/customer-queries/manage/route.test.ts`
- `site/tests/unit/app/api/admin/plans/route.test.ts`

**Plan / reports**

- `plan/Admin/FINISH-PLAN.md` (A9–A12, AF-08/14)
- `plan/Admin/FEATURES.md` (A10 honesty + customer-queries distinct)
- `plan/Admin/COMPLETION-CONTRACT.md` (AF-08, A5/A6 proof notes)
- `agent-reports/ADMIN.md`
- this file

## Explicit non-claims

- **No browser proof** for CRM/ops UI acceptance.
- **No production / deploy auth** proof.
- **No production CRM backend**.
- **No full AF-14 CSRF matrix**.
- **No release:gate / build PASS**.
- Did **not** touch svg-editor publish pipeline, price books domain, or planner.

## Residual OPEN

1. Browser: CRM hub + queries + ops shells at desktop/mobile.
2. AF-14 full mutation matrix audit.
3. AF-10 production-auth smoke.
4. Full lint/typecheck/build when owner asks release.
