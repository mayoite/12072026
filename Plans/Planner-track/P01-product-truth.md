# P01 — Product truth inventory

**Status:** REPROVE → **inventory refreshed this checkout** (hostWiring 4/4 + artifacts). Browser W gates still later cards.

**Gate:** CP-01 — map what the live planner **does** vs what docs/UI **claim** (paths required).  
**Evidence:** `results/planner/world-standard-wave/00-product-truth/`  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Inventory so later phases **raise** the **only** live plan canvas — Fabric on `canvas/`. No second plan host.

**Scope:** Inventory only — no product-feature implementation. Evidence under `00-product-truth/` only.

---

## Live canvas (only real place)

| Layer | Live path | Forbidden |
|-------|-----------|-----------|
| Workspace | `features/planner/editor/` (`OOPlannerWorkspace`) | Dual plan host · product `open3d/` folder |
| 2D entry | `project/canvas-stage` → `PlannerCanvasStage` | Any second interactive plan canvas |
| Implementation | `features/planner/canvas/PlannerFabricStage` | Legacy `canvas-fabric-stage` path · archive shells as product proof |
| Browser host | `data-testid="planner-fabric-stage"` | Archive testid `planner-2d-canvas` as PASS host |
| Furniture env flag | Module exists; **not wired** in workspace | Flag as product host switch |
| Walls + furniture | In-stage Fabric when layers on | Split across two hosts |
| 3D | `features/planner/3d/` + `getPlannerViewerControlProps()` | R3F rewrite as W4 substitute |
| On-disk archive | `_archive/fabric/` only (historical shell) | Treat any deleted host as restorable product 2D |

Unit: `hostWiringP01.test.ts` — PlannerCanvasStage sole; no second-host strings in live mounts; no flag in workspace.

---

## Honesty gaps (raise on Fabric — do not roll back)

| Gap | Live fact | Upgrade direction |
|-----|-----------|-------------------|
| W2 symbols | Fabric multiprim via `createFabricFurnitureBlock` | Re-prove buyer-readable cabinet + peer on live Fabric — [P05](./P05-symbols-svg.md) |
| W3 select | Fabric select/delete/undo code may exist | Re-run exact id + pose on this checkout — [P03](./P03-select-delete.md) |
| Stale packs | Old packs name dead second hosts | Re-diff to Fabric-sole only |

---

## Required artifacts (fresh)

| File | Role |
|------|------|
| `../../results/planner/world-standard-wave/00-product-truth/INVENTORY.md` | Fabric-sole hosts, tools surface, W1–W8 code surface |
| `../../results/planner/world-standard-wave/00-product-truth/CONTRADICTIONS.md` | Claim vs code — Block2D/select gaps as Fabric raise only |
| `HEAD.txt` · `run.json` · `NOTES.md` | Checkout, Approach A, vitestSmoke |
| Vitest | Prefer `hostWiringP01` + smoke — ok \| failed \| skipped + reason |

---

## Kill order

- [x] Inventory matches Fabric-sole (cite `project/canvas-stage` + `canvas/PlannerFabricStage` + `planner-fabric-stage`) — `00-product-truth/INVENTORY.md`
- [x] CONTRADICTIONS lists symbol/select gaps as **port-forward on Fabric** — `CONTRADICTIONS.md`
- [x] Route/host graph checked vs `hostWiringP01` (fabric-legacy nodes removed; residual was stale CONTRADICTIONS only)
- [x] Claims vs code — contradictions file
- [x] Vitest recorded on this HEAD — `run.json` 4/4
- [ ] Owner accepts CP-01 → next card only: [P02](./P02-engine-lock.md) (sequence P01→P12)

**Stop log:** `Failures.md` (phase `P01`).
