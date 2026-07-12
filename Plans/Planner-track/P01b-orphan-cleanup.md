# P01b — Orphan cleanup (post restructure)

**Status:** DONE slice (T1–T2, D1–D2, A1–A3 landed this checkout) · residual C dual-trees + N naming optional  


**After:** P01 inventory · P01a dead-path work · layout simplify (`editor` / `canvas` / `3d` / `project`)  
**Board:** [BOARD](./BOARD.md) · one Planner ID at a time  

**Live product (do not “fix”):**  
- Routes: `/planner/guest` · `/planner/canvas`  
- Shell: `features/planner/editor` + `ui/PlannerHost`  
- 2D: `features/planner/canvas` (`PlannerFabricStage` / testid `planner-fabric-stage`)  
- 3D: `features/planner/3d/ThreeLazyViewer` (+ orbit)  
- Project model: `features/planner/project/*`  

**Owner truth:** Planner Fabric on guest/canvas was already active; archive shell was never the buyer host. Cleanup removes ghosts so agents/tests stop lying.

---

## Task list

### Phase 1 — Tests that import deleted archive (high)

| ID | Task | Done when |
|----|------|-----------|
| T1 | Inventory all tests importing `@/features/planner/canvas-fabric` or old archive editor shorts | List under evidence NOTES |
| T2 | **Delete or move** `tests/integration/planner-editor-*` and `planner-canvas-fabric-*` (and unit twins) out of default vitest include | Suite no longer resolves missing modules |
| T3 | Confirm vitest exclude patterns cover leftovers; remove obsolete excludes when files gone | `pnpm --filter oando-site exec vitest run` smoke (or targeted) green for non-orphan suite |
| T4 | Quarantine/fix `tech-stack-generator` demos that import deleted `canvas-fabric` | Docs/demo only; not product |

### Phase 2 — Dual 3D (medium)

| ID | Task | Done when |
|----|------|-----------|
| D1 | Confirm live path is only `ThreeLazyViewer` / `ThreeViewerInner` from `editor/OOPlannerWorkspace` | Grep + one unit |
| D2 | **Retire or quarantine** `Planner3DViewer` if unused by app routes (tests + tech-stack only) | No second live viewer; NOTES say keep/delete |
| D3 | Optional: rename `buildPlannerSceneNodes` / `Open3d*` types later (not blocking) | Named residual only |

### Phase 3 — Dual catalog / model / store trees (medium)

| ID | Task | Done when |
|----|------|-----------|
| C1 | Document map: **live engine** = `project/*` · **domain/legacy** = top-level `catalog/`, `model/`, `store/`, `lib/`, `persistence/` | Short table in this card or CONTENTS |
| C2 | Grep app + editor importers: which top-level trees are still required | List “keep for marketing/tools” vs “candidate merge/delete” |
| C3 | No silent merge of `project/model` into `model` without open3d-project migration plan | Avoid big-bang unless owner asks |

### Phase 4 — Half-dead AI / hooks (medium–low)

| ID | Task | Done when |
|----|------|-----------|
| A1 | `AIAssistDrawer`: require `workspaceBridge` only; remove dead fabric runtime branches | Live left panel still works with bridge |
| A2 | Delete or isolate `useFabricPlannerState` if nothing in `editor/` imports it | Grep clean |
| A3 | Prefer `useWorkspaceKeyboard` over hooks/useKeyboardShortcuts for live shell | One keyboard path |
| A4 | Keep `applyLayoutToWorkspace` / `extractProjectPlacements` (live); leave no-op `applySuggestedLayout` / `extractCanvasPlacements` only if still needed by drawer | Named residual |

### Phase 5 — Naming leftovers (low, optional)

| ID | Task | Done when |
|----|------|-----------|
| N1 | Leave `public/vendor/open3d-floorplan` + `public/cdn/planner/open3d` unless owner wants asset rename | Explicit keep |
| N2 | Locked CSS filename `open3d-workspace.css` — do not edit locked tree without owner | Fence respected |
| N3 | Type/env renames `Open3d*` → `Planner*` — separate card if desired | Not required for orphan close |

### Phase 6 — Evidence + board

| ID | Task | Done when |
|----|------|-----------|
| E1 | Evidence: `results/planner/world-standard-wave/00-product-truth/orphan-cleanup/` HEAD · run.json · NOTES | Fresh this checkout |
| E2 | `hostWiringP01` still green after T2 | 4/4 |
| E3 | BOARD next action points past P01b when T1–T2 + D1–D2 done | Honest next kill |

---

## Kill list

- Reintroduce `features/planner/_archive` or product aliases to archive  
- Treat archive unit green as W3/W5 product  
- “Fix” orphans by importing deleted `_archive` from live code  
- Merge dual trees without importer map (C2)  
- Push without owner ask  

---

## Next action (only)

**T1 → T2:** list then delete/quarantine tests that import missing `@/features/planner/canvas-fabric`.
