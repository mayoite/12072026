# EXEC-5 — A4 Catalog lifecycle, families, price books

**Date:** 2026-07-17  
**Agent:** ADMIN-EXEC-5 of 6  
**Plan:** `plan/Admin/FINISH-PLAN.md` § A4 · `COMPLETION-CONTRACT.md` A4 · `FEATURES.md` A4–A6  

## Scope owned

- Lifecycle draft / release (live) / retire / restore (isolated fixtures)
- Product family authoring unit paths
- Price book draft → approve → activate unit paths
- AF-06 phone catalog / AF-07 price book operator UX (unit-testable slices)
- **Out of deep scope:** Planner consumer DB-aware load with disk fallback (left OPEN)
- **Did not touch:** svg-editor dual-write (A3), auth proxy (A1/A2), CRM shell (A6)

## Verdict

| Item | Status | Evidence |
|---|---|---|
| Lifecycle draft → live → retire → restore | **PASS (unit)** | `catalogLifecycle.test.ts` full path + `catalogRetirement` + bulk batch + remainingOpenItems isolated dir |
| Product family authoring | **PASS (unit)** | `AdminProductFamilyForm`, `productFamilyContract` / `productFamilyPersistence`, workstation release |
| Family browser release journey | **OPEN** | ADM-FAM — no Playwright re-run this session |
| Price book draft → approve → activate | **PASS (unit)** | `priceBookService` path test + `priceBookAdmin.server` approve→activate→rollback + audit |
| Price book browser | **OPEN** | ADM-PRICE — no Playwright re-run |
| AF-06 phone catalog | **PARTIAL unit** / **browser OPEN** | cards-priority markup, `data-label`, labeled actions, Name-as-card-header CSS; no 390×844 browser proof |
| AF-07 price books UX | **PARTIAL unit** / **browser OPEN** | currency primary, minor units under Advanced details, activate primary vs approve/rollback outline+danger |
| Planner DB-aware descriptor consumer | **OPEN** | Explicitly out of EXEC-5 deep scope |

Brutal truth: unit-green ≠ browser acceptance. Old Admin UI benchmark FAIL for phone catalog length and commercial risk weight is **mitigated in markup/CSS/unit** but **not re-proven in Chromium**. Do not claim AF-06/AF-07 production PASS.

## Code changes this session

1. **`site/tests/unit/features/admin/svg-editor/lifecycle/catalogLifecycle.test.ts`**  
   Full isolated path: draft → release(live) → retire → restore with buyer-visibility checks.

2. **`site/tests/unit/features/admin/pricing/priceBookService.test.ts`**  
   Explicit draft → approve → activate chain.

3. **`site/tests/unit/features/admin/pricing/AdminPriceBookPageView.test.tsx`**  
   AF-07 unit: primary currency, Advanced minor units, action class hierarchy + availability for active version.

4. **`site/tests/unit/features/admin/catalog/AdminCatalogTable.test.tsx`**  
   AF-06 unit: `data-phone-layout="cards-priority"`, cell labels, non-icon-only actions, paging.

5. **`site/tests/unit/features/admin/catalog/AdminProductFamilyForm.test.tsx`**  
   Migration keep-both authoring control.

6. **`site/app/css/core/locked/admin/admin-pages.css`**  
   Phone cards: treat `data-label="Name"` like Product header (catalog has no Preview column).

## Pre-existing unit coverage (re-verified green)

- `priceBookAdmin.server` approve → activate → rollback + audit  
- `priceBookGovernance` roles / confirm / impact  
- `catalogRetirement`, `bulkLifecycleBatch`, `remainingOpenItems`  
- Shared product family contract + persistence  
- Workstation family release  

## Commands (this session)

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/features/admin/svg-editor/lifecycle/catalogLifecycle.test.ts `
  tests/unit/features/admin/svg-editor/lifecycle/catalogRetirement.test.ts `
  tests/unit/features/admin/svg-editor/lifecycle/bulkLifecycleBatch.test.ts `
  tests/unit/features/admin/pricing/priceBookService.test.ts `
  tests/unit/features/admin/pricing/priceBookAdmin.server.test.ts `
  tests/unit/features/admin/pricing/AdminPriceBookPageView.test.tsx `
  tests/unit/features/admin/catalog/AdminCatalogTable.test.tsx `
  tests/unit/features/admin/catalog/AdminProductFamilyForm.test.tsx `
  tests/unit/features/admin/pricing/priceBookGovernance.test.ts `
  tests/unit/features/shared/catalog/productFamilyContract.test.ts `
  tests/unit/features/shared/catalog/productFamilyPersistence.test.ts `
  tests/unit/features/admin/workstation/workstationFamilyRelease.test.ts `
  tests/unit/features/admin/remainingOpenItems.test.ts
```

**Result:** 13 files, **117 tests passed** (exit 0).

```powershell
pnpm run check:layout
```

**Result:** `check-repo-layout OK — no forbidden site/ paths` (exit 0).

## Isolation / safety

- Lifecycle tests use `mkdtempSync` under OS temp; no canonical `inventory/descriptors` mutation.
- Price book admin tests use temp dirs for file store + audit.
- No commit, no secrets, no `any` added.

## Plan updates

- `FINISH-PLAN.md` A4: first three unit items checked; Planner consumer still open.
- `FEATURES.md` A4/A6 gap lines: AF-06/AF-07 → unit PARTIAL + browser OPEN (not silent FAIL from stale benchmark alone).
- `COMPLETION-CONTRACT.md` A4: EXEC-5 note.

## Next (not this agent)

1. Browser: `/admin/catalog` at 390×844 — no page-level horizontal scroll, card review, paging.
2. Browser: `/admin/price-books` — currency primary, Advanced collapsed, confirm messages, honest auth (ADM-PRICE).
3. Family release journey end-to-end (ADM-FAM).
4. Planner consumer DB-aware load + disk fallback (separate Planner / A4 residual).
