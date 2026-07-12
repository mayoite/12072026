# Planner module — current baseline

**Frozen pair date:** 2026-07-05 · **Live overlay:** 2026-07-11

## Live truth (re-check every task)

| Topic | Where |
|-------|--------|
| Routes + hosts | `site/app/planner/` · `site/features/planner/project/` |
| **Live 2D** | `PlannerCanvasStage` → `features/planner/canvas` (`data-testid="planner-fabric-stage"`) |
| Feasibility / `canvas-feasibility` | **Does not exist. Will not exist.** No live path, no archive path — do not invent `_archive/canvas-feasibility/` |
| Legacy Fabric shell only | `_archive/fabric/` (historical); `/planner/fabric*` redirects to open3d |
| Stack constraints | [`Plans/Planner-track/CONSTRAINTS.md`](../../Plans/Planner-track/CONSTRAINTS.md) |
| Package pins | `site/package.json` at execute time |
| Execute / W gates | [`Plans/Planner-track/`](../../Plans/Planner-track/) (flat cards) |
| Open3D README | `site/features/planner/project/README.md` |

## Summary

Open3d is the active product path (guest/canvas host open3d workspace). **Fabric.js stage is the sole live interactive 2D** (owner accepted). Raise select / Block2D / draw **on Fabric**.  
SVG catalog = **inventory publish only**; full inventory drawing tools live in Admin A4 studio — not as a second room planner. Never recreate Feasibility / `canvas-feasibility`.

**Do not copy package versions into Plans.** Update this overlay only when locking a new baseline.
