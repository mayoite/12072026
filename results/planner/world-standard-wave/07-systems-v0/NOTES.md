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
- tests: workstationSystemV0.test.ts (7/7)

## Not yet
- UI picker for size/shape
- Wire into placementAction / catalog place
- Client (Philips/Ford) multi-tenant catalogs
- Fabric cutover

## Next
placementAction integration: place N instances of a config on open3d document
