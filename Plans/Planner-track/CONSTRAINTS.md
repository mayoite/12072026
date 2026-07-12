# Planner-track constraints

| Record | Path |
|--------|------|
| Engine lock evidence | `results/planner/world-standard-wave/01-engine-lock/` |
| Package pins | `site/package.json` only |
| Execute card | [P02](./P02-engine-lock.md) |

| Topic | Decision |
|-------|----------|
| Approach | **A** - product journey first |
| Live layout | `features/planner/editor` · `canvas` · `3d` · `project` (no `open3d/` · no `workspace/` folder) |
| Live 2D | `PlannerFabricStage` as `PlannerCanvasStage` · testid `planner-fabric-stage` |
| Live routes | `/planner/guest` · `/planner/canvas` only |
| Legacy URLs | `/planner/open3d` · `/planner/fabric` → **301 `/planner/canvas/`** |
| SVG catalog | **Inventory publish only** — not plan-draw |
| Second plan host | **Does not exist. Do not create.** |
| Forbidden | Dual host · `canvas-feasibility` · archive fabric shell · catalog SVG as plan-draw |
| Raise gaps | Port select / Block2D / draw onto Fabric |
| Licenses | [`docs/Lockedfiles/03-dependencies-engines-current.md`](../../docs/Lockedfiles/03-dependencies-engines-current.md) |

Override only via [START.md](./START.md). Re-prove [CHECKPOINTS](./CHECKPOINTS.md) on this tree.
