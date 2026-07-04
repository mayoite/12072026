# Fabric planner archive (deprecated)

**Deprecated:** 2026-07-03  
**Replaced by:** `site/features/planner/open3d/` (live hybrid planner on `/planner/guest` and `/planner/canvas`)

Important distinction:

- this archive is the **old top-level Fabric planner route**
- it is **not** the same thing as the Fabric-backed 2-D canvas still used inside `site/features/planner/open3d/canvas-fabric/`

## Contents

- `editor/` — legacy Fabric `PlannerWorkspace` shell, chrome, panels, and tooling
- `canvas-fabric/` — Fabric.js floorplan canvas, draw tools, and runtime bridges

## Rollback

To restore Fabric as the live workspace (emergency only):

1. Revert route pages to `PlannerWorkspaceRoute`:
   - `site/app/planner/(workspace)/guest/page.tsx`
   - `site/app/planner/(workspace)/canvas/page.tsx`
2. Or use the explicit fallback routes (unchanged):
   - `/planner/fabric/guest`
   - `/planner/fabric/canvas`
3. Remove tsconfig/vitest path aliases pointing `@/features/planner/editor` and `canvas-fabric` at this archive if you move folders back to `site/features/planner/`.

## Import shims

Production and tests resolve `@/features/planner/editor/*` and `@/features/planner/canvas-fabric/*` via path aliases in `site/tsconfig.json` and vitest configs — no code should import this archive directly except through those prefixes.
