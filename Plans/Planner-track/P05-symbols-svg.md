# P05 — W2 symbol quality + SVG path honesty

**Status:** REPROVE — live Fabric Block2D multiprim raise landed. The latest visual pack is a candidate, not current-checkout PASS.

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

## Live truth (re-verify 2026-07-11)

| Piece | Status |
|-------|--------|
| `furnitureBlockUsesCenteredPath` | Always **`false`** in library |
| `modularCabinetBlock` | Multiprim in library — not empty box |
| Units | `furnitureBlock2D.cabinet-v0.test.ts` exists |
| **Live Fabric paint** | `createFabricFurnitureBlock` multiprim is wired — re-prove |
| Evidence pack | `eyes/` shows the raised candidate; still re-run on final checkout |

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

## Kill order (unchecked)

- [ ] Re-run cabinet-v0 vitest → `05-symbols-svg/`
- [ ] Port multiprim paint to Fabric stage (or prove equivalent)
- [ ] Visual on **live Fabric** canvas only
- [ ] SVG honesty NOTES
- [ ] No competitor art · sole Fabric host

**W2 symbol half red until** live Fabric shows readable cabinet-v0 (library-only PASS = incomplete).  
Do **not** wait on P07/P08 to close this card.  
**Next (sequence):** [P06](./P06-save-honesty.md).
