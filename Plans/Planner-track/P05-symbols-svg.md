# P05 — W2 symbol quality + SVG path honesty

**Status:** **PASS** (agent 2026-07-12 — publish multipath + Fabric cabinet e2e + honesty split on this checkout).

**Gate:** **W2 symbol half** / CP-05 — readable **cabinet-v0** on the **live** plan canvas; honest Block2D vs SVG-publish.  
**Evidence:** `results/planner/world-standard-wave/05-symbols-svg/`  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Cabinet-v0 readable on Fabric stage. Never claim `/svg-catalog/*.svg` as plan-draw path.  
**Upgrade rule:** Port Block2D (or Fabric multiprim equivalent) **onto** `PlannerFabricStage` only. Do **not** add a second plan host to show symbols.

**Out of scope:** Mesh redesign · second plan host · SVGR · CDN SVG · place-count journey (that is P07) · mesh toe/carcass (that is P08).

**Depends:** P01 + P02 only (Fabric-sole lock). **Not blocked by** P07/P08 — those cards come **after** this one in sequence.

**Related later (not dependencies):** [P07](./P07-draw-place-journey.md) place deltas · [P08](./P08-mesh-quality.md) 3D mesh parts.

---

## Authority (honest)

```
Library: furnitureBlock2DFromItem → Block2D prims  (raised; unit-proven)
Live canvas TODAY: PlannerFabricStage → createFabricFurnitureBlock multiprim
Re-prove: buyer-readable cabinet + peer on the current checkout
Publish: compileSvgForPublish → public/svg-catalog/{slug}.svg  (not plan-draw)
```

Live plan paint = Fabric multiprim only. SVG catalog = inventory publish only.

---

## Live truth (re-verify 2026-07-12 Slice A)

| Piece | Status |
|-------|--------|
| `furnitureBlockUsesCenteredPath` | Always **`false`** in library |
| `modularCabinetBlock` | Multiprim in library — not empty box |
| Units | cabinet-v0 + fabricBlock2D + renderBlock2D: **32 tests green** (logs under evidence/) |
| **Live Fabric paint** | `createFabricFurnitureBlock` multiprim wired; e2e `open3d-p05-cabinet-multiprim` **PASS** (eyes PNG multiprim) |
| SVG publish honesty | Plan ≠ catalog; NOTES: `agents-work/P05-SVG-HONESTY-NOTES.md` |
| **CP-05** | **PASS** — publish per-block paths + cp05/p05 browser green; honesty split in spec + `stages.ts` |

---

## Touch list

| Path | Role |
|------|------|
| `…/catalog/furnitureBlock2D.ts` | Keep multiprim + centeredPath false |
| `canvas/PlannerFabricStage.tsx` | Multiprim paint is wired; re-prove final visuals |
| `site/lib/catalog/renderBlock2DToCanvas.ts` | Paint helper (adapt or Fabric port) |
| Units | cabinet-v0 · stage paint regression when wired |
| Honesty | Block2D = plan; SVG = publish |

---

## Kill order

- [x] Re-run cabinet-v0 vitest → `05-symbols-svg/` (22/22 with fabric + workstation peers)
- [x] Port multiprim paint to Fabric stage (or prove equivalent) — live path proven; no product gap this slice
- [x] Visual on **live Fabric** canvas only — `browser/p05-scratch-cabinet-canvas.png` multiprim (body/door/handle)
- [x] SVG honesty NOTES — `agents-work/P05-SVG-HONESTY-NOTES.md`
- [x] No competitor art · sole Fabric host (`planner-fabric-stage`)

**W2 symbol half (cabinet multiprim on Fabric):** green on this re-run.  
**CP-05 full gate:** still red — published `/svg-catalog` multipath residual (not Fabric Block2D).  
Do **not** wait on P07/P08 to close symbol multiprim.  
**Next (sequence):** [P06](./P06-save-honesty.md).
