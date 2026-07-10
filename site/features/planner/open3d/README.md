# Open3D planner route (production hybrid)

Production source of truth for `/planner/guest`, `/planner/canvas`, `/planner/open3d/`.

## Live 2-D

**`canvas-fabric-stage/Open3dFabricStage.tsx`** (Fabric.js) — sole plan canvas. No env flag, no FeasibilityCanvas fallback.

3-D: Three/r3f [`3d/`](./3d).

## Archived (not live)

| Path | Role |
|------|------|
| `features/planner/_archive/canvas-feasibility/` | Old Canvas 2D `FeasibilityCanvas` — tests/reference only |
| `features/planner/_archive/fabric/` | Full legacy Fabric floorplan workspace |

Import archived FeasibilityCanvas only as:

`@/features/planner/_archive/canvas-feasibility/FeasibilityCanvas`

**Do not** import under `open3d/canvas-feasibility/` — that alias was removed.

## Host chain

`Open3dPlannerHost` → `Open3dNativeHost` → `OOPlannerWorkspace` → `Open3dFabricStage` + `ThreeLazyViewer`
