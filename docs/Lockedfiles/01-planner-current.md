# Planner module — current baseline

**Frozen pair date:** 2026-07-05 · **Live overlay:** 2026-07-11

## Live truth (re-check every task)

| Topic | Where |
|-------|--------|
| Routes + hosts | `site/app/planner/` · `site/features/planner/open3d/` |
| **Live 2D** | `PlannerCanvasStage` → `features/planner/canvas-fabric-stage` (`data-testid="open3d-fabric-stage"`) |
| FeasibilityCanvas | `_archive/canvas-feasibility/` only — **not** product 2D |
| Legacy Fabric shell | `_archive/fabric/`; `/planner/fabric*` redirects to open3d |
| Stack constraints | [`Plans/Planner-track/CONSTRAINTS.md`](../../Plans/Planner-track/CONSTRAINTS.md) |
| Package pins | `site/package.json` at execute time |
| Execute / W gates | [`Plans/Planner-track/`](../../Plans/Planner-track/) (flat cards) |
| Open3D README | `site/features/planner/open3d/README.md` |

## Summary

Open3d is the active product path (guest/canvas host open3d workspace). **Fabric.js stage is the sole live interactive 2D** — not Feasibility interim. Raise select / Block2D / draw **on Fabric**; do not un-archive Feasibility to prove gates.

**Do not copy package versions into Plans.** Update this overlay only when locking a new baseline.
