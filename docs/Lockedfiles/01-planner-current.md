# Planner module — current baseline

**Frozen pair date:** 2026-07-05 · **Live overlay:** 2026-07-11

## Live truth (re-check every task)

| Topic | Where |
|-------|--------|
| Routes + hosts | `site/app/planner/` · `site/features/planner/{editor,canvas,3d,project,ui}` |
| **Document stack** | Document (**UUID v7**, mm) → 2D Fabric sole · 3D Three+orbit → Persist local first · mint `lib/newEntityId` |
| **Forbidden downgrade** | Dual plan canvas · W gates on `planner-2d-canvas` · restore `_archive/fabric` host · R3F as Lazy3D sub · drop RAC without owner explain |
| **Live 2D** | `PlannerCanvasStage` → `features/planner/canvas` (`data-testid="planner-fabric-stage"`) |
| **Canvas toolbar** | `react-aria-components` on `editor/CanvasToolRail` — lock [P09](../../Plans/Planner-track/P09-shortcuts-chrome.md) |
| Icons | Phosphor only — no lucide-react |
| Feasibility / `canvas-feasibility` | **Does not exist. Will not exist.** Do not invent |
| Legacy URLs | `/planner/open3d` · `/planner/fabric*` → **301 canvas** (archive shell deleted) |
| Stack constraints | [`Plans/Planner-track/CONSTRAINTS.md`](../../Plans/Planner-track/CONSTRAINTS.md) |
| Package pins | `site/package.json` at execute time |
| Execute / W gates | [`Plans/Planner-track/`](../../Plans/Planner-track/) (flat cards) |
| Project README | `site/features/planner/project/README.md` |

## Summary

Live product layout = `editor` + `canvas` + `3d` + `project` + `ui` under `features/planner/` (guest/canvas routes). **No** product `open3d/` folder. **Fabric.js stage is the sole live interactive 2D** (owner accepted). Raise select / Block2D / draw **on Fabric**.  
SVG catalog = **inventory publish only**; full inventory drawing tools live in Admin A4 studio — not as a second room planner. Never recreate Feasibility / `canvas-feasibility`.

**Do not copy package versions into Plans.** Update this overlay only when locking a new baseline.
