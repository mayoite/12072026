# P01 — Product truth inventory

**Status:** OPEN / REPROVE — not complete. Old `00-product-truth/` pack = clue only (pre–Fabric-sole).

**Gate:** CP-01 — map what open3d **does** vs what docs/UI **claim** (paths required).  
**Evidence:** `results/planner/world-standard-wave/00-product-truth/`  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Inventory so later phases **raise** the live Fabric host — never restore Feasibility as product 2D.

**Scope:** Inventory only — no product-feature implementation. Evidence under `00-product-truth/` only.

---

## Upgrade lock (code 2026-07-11 — do not reverse)

| Layer | Live (upgrade) | Forbidden downgrade |
|-------|----------------|---------------------|
| 2D host | `PlannerCanvasStage` → `features/planner/canvas-fabric-stage` (`Open3dFabricStage`) | Mount `FeasibilityCanvas` / `canvas-feasibility` again |
| Workspace | `OOPlannerWorkspace` mounts **only** `PlannerCanvasStage` | Dual host / flag-gated Feasibility+overlay |
| Furniture env | Flag module exists; **not wired** in workspace (`hostWiringP01` asserts) | Treat flag-OFF Feasibility as “production proof path” |
| Walls + furniture draw | In-stage Fabric (`Line` / `Rect`) always when layers on | “Walls on Feasibility, furniture on Fabric overlay” |
| 3D | Three + `getOpen3dViewerControlProps()` | R3F rewrite as W4 substitute |
| Archive | `_archive/canvas-feasibility/` · `_archive/fabric/` | Copy archive into live mounts |

Unit already encodes the upgrade: `hostWiringP01.test.ts` (PlannerCanvasStage sole; no Feasibility; no flag in workspace).

---

## Honesty gaps (raise on Fabric — do not roll back)

| Gap | Live fact | Upgrade direction |
|-----|-----------|-------------------|
| W2 symbols | Fabric multiprim paint has landed through `createFabricFurnitureBlock` | Re-prove buyer-readable cabinet + peer on live Fabric — [P05](./P05-symbols-svg.md) |
| W3 select | Fabric select/delete/undo implementation and an older dual-gate pack exist | Re-run exact id + pose proof on this checkout — [P03](./P03-select-delete.md) |
| Stale packs | Old INVENTORY / ENGINE-LOCK still name Feasibility interim | Re-diff artifacts to Fabric-sole |

---

## Required artifacts (fresh)

| File | Role |
|------|------|
| `../../results/planner/world-standard-wave/00-product-truth/INVENTORY.md` | Fabric-sole hosts, tools surface, W1–W8 code surface |
| `../../results/planner/world-standard-wave/00-product-truth/CONTRADICTIONS.md` | Claim vs code — include Block2D/select gaps **without** calling Feasibility live |
| `HEAD.txt` · `run.json` · `NOTES.md` | Checkout, Approach A, vitestSmoke |
| Vitest | Prefer `hostWiringP01` + smoke — ok \| failed \| skipped + reason |

---

## Kill order (unchecked)

- [ ] Inventory matches Fabric-sole (cite `canvas-stage` + `Open3dFabricStage`)
- [ ] CONTRADICTIONS lists symbol/select gaps as **port-forward**, not Feasibility restore
- [ ] Route/host graph matches `importGraphProof` / `hostWiringP01`
- [ ] Claims corpus (`ayushdocs/` + WAVE) vs code
- [ ] Vitest recorded on this HEAD
- [ ] CP-01 → [P02](./P02-engine-lock.md)

**Stop log:** `Failures.md` (phase `P01`).
