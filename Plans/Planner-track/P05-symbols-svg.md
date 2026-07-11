# P05 — W2 symbol quality + SVG path honesty

**Status:** OPEN / REPROVE — not complete. Old `05-symbols-svg/` packs are clues only.

**Gate:** **W2 symbol half** / CP-05 — readable **cabinet-v0** plan symbols; honest Block2D vs SVG-publish story.  
**Evidence:** `results/planner/world-standard-wave/05-symbols-svg/`  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Stop empty-box marks for cabinet-v0; never claim `/svg-catalog/*.svg` as Feasibility draw path.

**Place journey** = [P07](./P07-draw-place-journey.md). **Mesh** = [P08](./P08-mesh-quality.md).

**Out of scope:** Mesh redesign · Fabric cutover · SVGR · CDN SVG · loading public SVG as canvas draw · confusing `generateCabinetV0Footprint` with Block2D.

**Depends:** P01 + P02. P03 not required for unit symbol work. Prove with Fabric flag **OFF**.

---

## Authority (must stay honest)

```
Plan canvas → furnitureBlock2DFromItem → Block2D prims → renderBlock2DCentered
  (= W2 plan-symbol authority TODAY)

Admin/CLI → compileSvgForPublish → public/svg-catalog/{slug}.svg
  (= publish authority — NOT Feasibility draw path today)
```

**Gap (re-verify):** `furnitureBlockUsesCenteredPath` must be always **`false`** (modular prims are top-left; canvas centers). Raise modular cabinet-v0 prims (carcass, door cues, handles). Unknown-SKU non-empty fallback. No competitor SVG.

---

## Touch list

| Path | Role |
|------|------|
| `…/catalog/furnitureBlock2D.ts` | Richer `modularCabinetBlock`; centeredPath → false |
| `site/lib/catalog/renderBlock2DToCanvas.ts` | Paint prim kinds if missing |
| `site/lib/catalog/blocks2d.ts` | Styles only if needed |
| `…/catalog/modularCabinetV0.ts` | Optional shared dims |
| Units | `furnitureBlock2D.cabinet-v0.test.ts` (create) · renderBlock2DToCanvas |
| Honesty | asset-engine README · svg batch smoke NOTES |
| Evidence | `05-symbols-svg/` (run.json, logs, visual PNG or prim-JSON) |

Prefix open3d: `site/features/planner/open3d/`. Keep `canvas-fabric-stage/` (destination) — do not delete.

---

## Kill order (unchecked)

- [ ] Baseline greps + vitest log under `05-symbols-svg/`
- [ ] RED unit: cabinet-v0 not empty box; ≥4 prims; centeredPath false; no external SVG/GLB URLs
- [ ] GREEN: readable `modularCabinetBlock` + centeredPath always false
- [ ] Unknown-SKU non-empty guard
- [ ] SVG honesty NOTES: Block2D = canvas; SVG = publish (smoke optional for symbol half)
- [ ] Visual: PNG or prim-JSON (carcass / front / doorStyle differs)
- [ ] CP-05 pack: unit green + honesty + visual; no competitor art

**W2 symbol half red until** unit + honesty + visual agree. SVG smoke fail ≠ automatic symbol fail if NOTES do not claim smoke green.  
**Next:** fill [P06](./P06-save-honesty.md) / kill-order per BOARD.
