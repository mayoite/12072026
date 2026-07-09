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

## Not yet
- UI picker for size/shape
- Inventory / click-to-place catalog entry for workstation family
- Client (Philips/Ford) multi-tenant catalogs
- Fabric cutover
- Non-box geometry for workstation modules

## Next
Inventory / catalog UI place path for workstation configs; optional batch helper
