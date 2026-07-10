# Open3D planner feature tree

## Live 2-D canvas

**`canvas-stage/PlannerCanvasStage`** — native HTML canvas + procedural Block2D (`furnitureBlock2D`, walls). No Fabric. No borrowed SVG/GLB on the plan.

Implementation source: `features/planner/_archive/canvas-feasibility/FeasibilityCanvas.tsx` (re-exported as `PlannerCanvasStage`).

## Export

JSON, SVG, PNG, PDF, DXF from the same procedural scene (`shared/export/exportUtils.ts`). Furniture draws as rects / Block2D — not catalog symbol files.

## Archived / reference only

| Path | Role |
|------|------|
| `canvas-fabric-stage/` | Former Fabric 2-D stage — not mounted in production workspace |
| `_archive/canvas-feasibility/` | Source for `PlannerCanvasStage` + unit tests |
| `_archive/fabric/` | Legacy Fabric workspace |
