# Systems v0 — workstation family (2026-07-09)

## What
Pure rules module for one premium workstation family:
- Size grid: 900x600, 900x750, 1200x600, 1500x600
- Shapes: linear + L
- Modules: desk, return, pedestal, panel, overhead
- Matrix expand + layout 5000 instances (no unique assets)
- Plan prims for symbol generation path

## Code
- site/features/planner/open3d/catalog/workstationSystemV0.ts
- site/features/planner/open3d/catalog/placementAction.ts — `placeWorkstationConfigOnProject`
- tests: workstationSystemV0.test.ts (7/7)
- tests: workstationPlacementV0.test.ts (2/2)

## Placement path (2026-07-09)

Pure helper wires workstation rules into open3d document furniture:

- `placeWorkstationConfigOnProject(project, config, position, options?)`
  - catalogId = `workstationConfigKey(config)` (`ws-v0-…`)
  - width/depth from `workstationFootprintMm`
  - height from config.heightMm
  - geometryMode: `"box"` (until modular workstation mesh)
  - action type: `PLACE_WORKSTATION_V0`
  - uses `addFurniture` pure action + dimension stamp

### Unit evidence

```
npx vitest run tests/unit/features/planner/open3d/workstationSystemV0.test.ts \
  tests/unit/features/planner/open3d/workstationPlacementV0.test.ts
# Test Files  2 passed (2)
# Tests  9 passed (9)
```

Cases:
1. linear 1500×600 → furniture length 1, width=1500, depth=600, box, catalogId ws-v0-linear-1500x600-…
2. layoutWorkstationInstances(3) → place each at layout coords → furniture length 3, distinct x grid

## Catalog / inventory place path (2026-07-09)

- `workstationCatalogV0.ts` — `workstationConfigToCatalogItem`, matrix → 8 demo items
- `parseWorkstationConfigKey` / `isWorkstationV0CatalogId` in workstationSystemV0
- Demo catalog seeds all 8 via `OPEN3D_DEMO_CATALOG_ITEMS`
- `placeCatalogItemInProject` routes `ws-v0-…` ids → `placeWorkstationConfigOnProject` (`PLACE_WORKSTATION_V0`)

### Unit evidence

```
npx vitest run workstationSystemV0 workstationPlacementV0 workstationCatalogV0
# Test Files  3 passed (3)
# Tests  16 passed (16)
```

Inventory click-to-place uses existing OOPlannerWorkspace → placeCatalogItemInProject path (no special UI picker yet).

## Not yet
- Dedicated size/shape/module configurator UI (beyond fixed matrix SKUs)
- Client (Philips/Ford) multi-tenant catalogs
- Fabric cutover
- Non-box geometry for workstation modules
- Browser e2e place workstation from inventory

## Plan Block2D symbols (2026-07-09)

- `workstationBlock2DFromItem` in furnitureBlock2D.ts maps plan prims (desk/return/pedestal/panel) → styled Block2D
- Routed from `furnitureBlock2DFromItem` when catalogId is `ws-v0-…`
- Prims normalized into top-left footprint AABB (panel y=-40 shifted in)
- Tests: `furnitureBlock2D.workstation-v0.test.ts` (4/4)

## Browser place (2026-07-09)

- e2e: `open3d-systems-v0-workstation-place.spec.ts` — guest search workstation → place → furniture +1
- Evidence: 10/11 screenshots + browser-place-run.json
- Command: `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-systems-v0-workstation-place.spec.ts` (1 passed ~2.9s)

## Browser place auto-select (2026-07-09)

- After place, asserts auto-select cue: Select tool `aria-pressed` **or** status "Furniture selected" **or** properties not "No Selection"
- Screenshot: `12-selected.png`
- Command (green): same e2e path — 1 passed ~2.4s; `browser-place-run.json` includes `autoSelect` flags

## Batch + BOQ (2026-07-09)

- `placeWorkstationInstancesOnProject` — N grid instances, `PLACE_WORKSTATION_V0_BATCH` (50-unit test)
- `summarizeWorkstationBoqV0(project)` — pure quantity lines by config key (no price yet)
- Place-from-inventory auto-selects furniture + returns to select tool

## Next
Optional BOQ panel UI; modular workstation mesh; Fabric cutover later
