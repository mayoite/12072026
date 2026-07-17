# Planner Agent 2 — PF-22 catalog family / compare

**Date:** 2026-07-17

## Verdict
PASS (unit) — family group, facet filters, card fields, usable compare table. Browser not run.

## Evidence
- `pnpm --filter oando-site exec vitest run tests/unit/features/planner/catalog/catalogFamilyBrowse.test.ts tests/unit/features/planner/catalog/inventory/inventoryState.test.ts tests/unit/features/planner/editor/InventoryPanel.test.tsx` → **17/17 pass**
- `pnpm run check:layout` → OK

## Done
- Pure helpers: `catalogFamilyBrowse.ts` (resolve/group/filter/compare)
- Optional `family` on `PlannerCatalogItem`; mapping sets from configurator family
- Inventory state: family/material/availability/seats/width facets + RESET
- InventoryPanel: family chips, conditional facets, group headers, family/variant/SKU/dims/availability, compare table (max 4)

## Not done
- Browser proof (UI-CAT / PF-22 browser)
- Depth-only dim facet; plan ticks not updated

## Files
- `site/features/planner/catalog/catalogFamilyBrowse.ts`
- `site/features/planner/catalog/catalogTypes.ts`
- `site/features/planner/catalog/catalogMapping.ts`
- `site/features/planner/catalog/index.ts`
- `site/features/planner/catalog/inventory/inventoryState.ts`
- `site/features/planner/editor/InventoryPanel.tsx`
- `site/tests/unit/features/planner/catalog/catalogFamilyBrowse.test.ts`
- `site/tests/unit/features/planner/catalog/inventory/inventoryState.test.ts`
- `site/tests/unit/features/planner/editor/InventoryPanel.test.tsx`
