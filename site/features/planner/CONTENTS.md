# features/planner

## Live layout (product — one host)

| Folder | Role |
|--------|------|
| `editor/` | Live shell (`OOPlannerWorkspace`, rails, panels) |
| `canvas/` | Fabric 2D (`PlannerFabricStage`, testid `planner-fabric-stage`) |
| `3d/` | Live Three (`ThreeLazyViewer` / `ThreeViewerInner`) |
| `project/` | Project model, placement catalog, persistence, cleanup |
| `ui/` | `PlannerHost`, `PlannerWorkspaceRoute` |
| `ai/` | Assist drawer + live project bridges |
| `onboarding/`, `landing/`, `help/`, `portal/`, `admin/` | Domain / marketing / admin |

## Dual trees (honest — not a second host)

| Live engine (guest/canvas) | Older parallel (domain / legacy / tools) |
|----------------------------|------------------------------------------|
| `project/model` | top-level `model/` |
| `project/catalog` | top-level `catalog/` |
| `project/store` | top-level `store/` |
| `editor` + `useWorkspaceKeyboard` | removed archive hooks |

Do **not** treat top-level catalog/model/store as the plan canvas host.

## Routes

- Live: `/planner/guest` · `/planner/canvas`
- 301 only: `/planner/open3d` · `/planner/fabric` → `/planner/canvas`

## Naming leftovers (not product trees)

| Leftover | Policy |
|----------|--------|
| `public/vendor/open3d-floorplan/` | Vendor embed pack — keep path (self-contained assets) |
| `public/cdn/planner/canvas/` | Canonical CDN texture destinations (`assetClassification`) |
| `public/cdn/planner/open3d/` | Legacy empty slot — do not write new assets |
| Locked CSS `open3d-workspace.css` | **Fence — do not rename or edit** without CSS unlock |
| Wire JSON `type: open3d-floorplan-project` | Keep for save compatibility |
| Some `open3d-*` CSS classes in editor UI | Prefer `planner-*` for new work; renames need CSS unlock |
| Scripts probing `/planner/open3d` | OK for redirect proof; prefer `/planner/canvas` for host tests |

## Rules

- One interactive 2D host: Fabric on `canvas/`
- No `_archive` fabric shell · no product `open3d/` or `workspace/` folders
- SVG catalog = inventory publish only
