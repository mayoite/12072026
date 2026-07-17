# A-W2 — AF-06 phone catalog layout (unit)

**Date:** 2026-07-17  
**Agent:** A-W2  
**Plan:** `plan/Admin/FINISH-PLAN.md` AF-06 · `FEATURES.md` A1/A4 · benchmark phone catalog  

## Scope owned

- `site/features/admin/catalog/**` (table/list UI)
- Admin phone helpers used by catalog (`ui/adminMobileReview.ts`)
- Locked admin CSS for phone cards / catalog paging (`admin-pages.css`)
- Unit tests: `AdminCatalogTable` + phone contracts  

**Did not touch:** svg-editor publish, price books, auth, planner, site.

## Verdict

| Item | Status | Evidence |
|---|---|---|
| cards-priority layout mode | **PASS (unit)** | inventory, wrap, table `data-phone-layout="cards-priority"` via `phoneListLayoutMode()` |
| Cell labels | **PASS (unit)** | `Name` / `Category` / `Size` / `Status` / `Actions` (`ADMIN_CATALOG_PHONE_CELL_LABELS`) |
| Labeled row actions | **PASS (unit)** | visible Edit / Hide\|Show / Delete (not icon-only) |
| ≥44px actions | **PASS (unit + CSS contract)** | `data-min-tap-px="44"`; CSS `min-height: 2.75rem` on card actions + paging + row-actions |
| Name card header (no Preview) | **PASS (CSS contract)** | `:not(:has(td[data-label="Preview"]))` Name span rule |
| Configurator path labels | **PASS (unit)** | sizing type + family in Category/Size |
| Browser 390×844 | **OPEN** | no Chromium this agent |

Brutal truth: unit-green ≠ phone viewport acceptance. Old benchmark “6842px long scan / icon-only” is **mitigated in markup + CSS + unit**. Do not claim production phone PASS without `/admin/catalog` at 390×844.

## Code changes

1. **`site/features/admin/catalog/AdminCatalogTable.tsx`**  
   Uses `phoneListLayoutMode()` + `ADMIN_PHONE_MIN_TAP_PX`. Phone layout on inventory/wrap/table. Row actions + paging expose `data-min-tap-px="44"`.

2. **`site/features/admin/ui/adminMobileReview.ts`**  
   Exports `ADMIN_PHONE_CARDS_MAX_WIDTH_REM` (48), `ADMIN_PHONE_MIN_TAP_PX` (44), `ADMIN_PHONE_MIN_TAP_REM` (2.75), `ADMIN_CATALOG_PHONE_CELL_LABELS`.

3. **`site/app/css/core/locked/admin/admin-pages.css`**  
   Status badge phone rule; catalog inventory no page-level X-scroll; catalog paging full-width ≥44px under cards.

4. **`site/tests/unit/features/admin/catalog/AdminCatalogTable.test.tsx`**  
   AF-06 suite: layout, labels, text actions, tap attrs, CSS file contracts, hidden/Show, configurator, read-only, paging.

5. **`site/tests/unit/features/admin/ui/adminMobileReview.test.ts`**  
   AF-06 constants.

## Commands

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/features/admin/catalog/AdminCatalogTable.test.tsx `
  tests/unit/features/admin/ui/adminMobileReview.test.ts `
  tests/unit/features/admin/remainingOpenItems.test.ts
```

**Result:** 3 files, **21 tests passed** (exit 0).

```powershell
pnpm run check:layout
```

**Result:** `check-repo-layout OK — no forbidden site/ paths` (exit 0).

## Plan updates

- `FINISH-PLAN.md` AF-06 → unit PASS (A-W2); browser OPEN.
- `FEATURES.md` A1 mobile helpers + A4 managed products UI gap lines.
- `ADMIN.md` ## A-W2.

## Next (not this agent)

1. Browser: `/admin/catalog` at 390×844 — no page-level horizontal scroll, card scan, labeled ≥44px taps, paging.
2. Optional: dense “compact review” mode if 50 cards still too long for operators (product call).
