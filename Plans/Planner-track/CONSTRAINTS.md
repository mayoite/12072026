# Planner constraints (pins)

**Detail:** engine lock → [P02](./P02-engine-lock.md) · toolbar → [P09](./P09-shortcuts-chrome.md) · save → [P06](./P06-save-honesty.md)

| Topic | Lock |
|-------|------|
| Approach | **A** — product journey first |
| Document | UUID v7 · mm store · `lib/newEntityId` |
| 2D host | `PlannerFabricStage` · testid **`planner-fabric-stage` only** |
| 3D | Three + orbit · not R3F substitute for plan host |
| Routes | `/planner/guest` · `/planner/canvas` |
| Legacy | `/planner/open3d` · `/planner/fabric*` → 301 `/planner/canvas/` |
| Layout | `features/planner/{editor,canvas,3d,project,ui}` — **no** product `open3d/` folder |
| Toolbar | `react-aria-components@1.19.0` on `CanvasToolRail` |
| Icons | `@phosphor-icons/react` — no lucide |
| SVG | `/svg-catalog/` = inventory publish only — not plan-draw |
| Fabric pin | `7.4.0` exact (`site/package.json`) |
| Forbidden | Second plan canvas · archive `planner-2d-canvas` proof · `_archive/fabric` as host · `canvas-feasibility` |

Override only via [START.md](./START.md). Status → [BOARD](./BOARD.md).