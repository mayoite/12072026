# P02 — Engine lock

**Status:** WAIVE / CONTINUE — owner deferral still unlocks later work. Re-prove Fabric-sole on the final handover checkout; the 2026-07-11 29/29 run is not current-session proof.

**Gate:** CP-02 — lock the **upgraded** stack in writing. Later phases ship on it; no engine rollback.  
**Evidence:** `results/planner/world-standard-wave/01-engine-lock/` only (never `02-engine-lock/`).  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [CONSTRAINTS](./CONSTRAINTS.md) · [BOARD](./BOARD.md)

**Goal:** Freeze Fabric-sole + Three/orbit. Reject any plan that reopens Feasibility as live 2D.

---

## Locked stack (upgrade — code 2026-07-11)

| Layer | Locked choice | Live path |
|-------|---------------|-----------|
| **2D host** | Fabric.js **v7** sole interactive plan canvas | `PlannerCanvasStage` → `canvas-fabric-stage/Open3dFabricStage` |
| Walls + furniture | Drawn **in** Fabric stage (layer visibility) | Not Feasibility; not flag-gated overlay |
| Flag leftover | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` | Module + tests only — **not** product host switch |
| `FurnitureFabricLayer` | Spike leftover | Not mounted by workspace |
| FeasibilityCanvas | **Archived** | `_archive/canvas-feasibility/` — restore = owner unlock only |
| 3D planner | Three + orbit ON | `Lazy3DViewer` + `getOpen3dViewerControlProps()` |
| Admin 3D preview | `@google/model-viewer` | Admin SVG only |
| Hybrid ban | One interactive 2D host | No Konva; no second Fabric product shell |

```
Document (UUID, mm)
  → 2D: Fabric stage (sole) · 3D: Three + orbit
  → Persist: IDB first (P06)
```

**Pins:** `site/package.json` — `fabric@7.4.0`. Refresh `PACKAGE-PIN.md`.  
**Do not** re-apply old ENGINE-LOCK text that says “Feasibility interim / Fabric overlay when flag ON” — that freezes a **downgrade**.

---

## Anti-thrash (upgrade protection)

- Do not re-open engines in P03+ without owner.
- Do not prove W3/W5/W8 on Feasibility “because flag OFF.”
- Raise missing behavior **on Fabric** (select, Block2D symbols, draw tools) — that is the upgrade path.
- Research = inspiration only — no competitor assets in `site/`.

---

## Kill order

- [x] Rewrite ENGINE-LOCK-RECORD / ENTRYPOINT-MAP to **Fabric-sole** (explicitly retire Feasibility-interim freeze)
- [x] FLAG-INVENTORY: leftover only; not host authority
- [x] PACKAGE-PIN matches this `package.json`
- [x] CONSTRAINTS matches this card
- [x] `../../results/planner/world-standard-wave/01-engine-lock/OWNER-SIGNOFF-STATUS.md` **OPEN** (honest; no forged owner green) — written owner deferral still absent
- [x] No product engine swap / no Feasibility un-archive this phase

**Still open:** owner marks or owner-worded deferral in `OWNER-SIGNOFF.md` before CP-02 PASS.

**Next:** [P03](./P03-select-delete.md) after CP-02 fresh proof or owner WAIVE.
