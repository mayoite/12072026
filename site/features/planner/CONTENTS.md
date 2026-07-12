# features/planner

## Live layout (simplified)

| Folder | Role |
|--------|------|
| `editor/` | Live shell (`OOPlannerWorkspace`, rails, panels) |
| `canvas/` | Fabric 2D stage (`PlannerFabricStage`) |
| `3d/` | Three viewer |
| `project/` | Project model, catalog, persistence, cleanup graph |
| `ui/` | Route hosts (`PlannerHost`, `PlannerWorkspaceRoute`) |
| `catalog/`, `onboarding/`, `admin/`, … | Domain helpers (not a second host) |

## Routes

- `/planner/guest` · `/planner/canvas` — live
- `/planner/open3d` · `/planner/fabric` — 301 → `/planner/canvas`

## Rules

- One interactive 2D host: Fabric on `canvas/`
- Do not reintroduce `open3d/` or `workspace/` product folders
- SVG catalog = inventory publish only
