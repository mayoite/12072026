# TDD-1 — Planner catalog / PF-22

**Date:** 2026-07-17  
**Command:** `pnpm --filter oando-site exec vitest run tests/unit/features/planner/catalog` → **693 pass** (family browse **14**)

## Cycles

| # | Test | RED | GREEN | Exit |
|---|------|-----|-------|------|
| 1 | `buildCatalogListMetadata exposes name, sku, family, variant, and dims when present` | not a function | added `buildCatalogListMetadata` + type | 1→0 |
| 2 | `…nulls blank sku/variant and dashes empty dims` | n/a (impl already) | stayed green | 0 |
| 3 | family taxonomy/category/Other + depth facets/counts + compare dims/seats | characterization of existing | green | 0 |
| 4 | `compare table names and sku align with list metadata` | untrimmed shortName | compare uses list meta | 1→0 |
| 5 | `maps inventory facet fields into CatalogFacetFilters` | not a function | `catalogFacetsFromPanelFields` | 1→0 |

## Files

- `site/features/planner/catalog/catalogFamilyBrowse.ts`
- `site/tests/unit/features/planner/catalog/catalogFamilyBrowse.test.ts`
- `site/features/planner/editor/InventoryPanel.tsx` (wire list meta + facet mapper)

## Residual OPEN

- Browser proof of family group UI + compare table still OPEN (unit ≠ browser).
- Depth facets in helpers; inventory state still width-only UI.
- PF-22 full product acceptance still FAIL until browser.
