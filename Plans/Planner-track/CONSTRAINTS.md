# Planner-track constraints

| Record | Path |
|--------|------|
| Engine lock evidence | `results/planner/world-standard-wave/01-engine-lock/` |
| Package pins | `site/package.json` only |
| Execute card | [P02](./P02-engine-lock.md) |

| Topic | Decision |
|-------|----------|
| Approach | **A** - product journey first |
| **Document stack (locked)** | Document (**UUID v7**, **mm**) → **2D** Fabric stage sole · **3D** Three + orbit → **Persist** local first ([P06](./P06-save-honesty.md)) · mint: `lib/newEntityId` |
| Live product layout | `features/planner/editor` · `canvas` · `3d` · `project` · `ui` |
| **Not product folders** | **No** `features/planner/open3d/` · **no** product `workspace/` package folder as host tree |
| Live 2D | `PlannerFabricStage` as `PlannerCanvasStage` · testid **`planner-fabric-stage` only** |
| Live routes | `/planner/guest` · `/planner/canvas` only |
| Legacy URLs | `/planner/open3d` · `/planner/fabric` → **301 `/planner/canvas/`** (redirects, not live product trees) |
| **Canvas toolbar** | **`react-aria-components@1.19.0`** on `CanvasToolRail` (+ map-owned tools) — see [P09](./P09-shortcuts-chrome.md) |
| **Tool requirements** | **live** (select/pan/wall/opening/door/window/place) required for W1/W8 · **deferred** (room/dimension/text) arm-only until raised — `CANVAS_TOOL_REQUIREMENT` |
| Icons | `@phosphor-icons/react` only — **no lucide-react** |
| SVG catalog | **Inventory publish only** — not plan-draw |
| Second plan host | **Does not exist. Do not create.** |
| Forbidden downgrade | Dual interactive plan canvas · prove W gates on archive `planner-2d-canvas` · re-add `_archive/fabric` as product host · R3F as Lazy3D substitute · drop RAC toolbar without owner explain |
| Forbidden (other) | `canvas-feasibility` · catalog SVG as plan-draw · inventing `modules/` mazes |
| Raise gaps | Port select / Block2D / draw onto Fabric |
| Licenses | [`docs/Lockedfiles/03-dependencies-engines-current.md`](../../docs/Lockedfiles/03-dependencies-engines-current.md) |
| Status enum (Plans) | `OPEN` · `REPROVE` · `DONE` · `PASS slice` · `WAIVE` (plus full `PASS` when card + proof say so) |

**CP-02 honesty:** owner gate stays **OPEN** until owner PASS or dated WAIVE — unit/chrome under `01-engine-lock/` do not forge PASS. See [P02](./P02-engine-lock.md).

Override only via [START.md](./START.md). Re-prove [CHECKPOINTS](./CHECKPOINTS.md) on this tree.
