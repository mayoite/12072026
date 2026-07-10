# SUMMARY — P05 / CP-05 (W2 symbol quality + SVG honesty)

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` (main only)  
**Status:** **PASS** (re-prove after empty evidence dir)

---

## Done (gate)

| Claim | Proof |
|-------|--------|
| cabinet-v0 not empty box (≥4 prims) | Unit pack 22/22; prim JSON pair=7 slab=5 none=6 |
| pair vs slab geometry differs | Mid stile + dual handles vs single handle; unit + prim JSON |
| `furnitureBlockUsesCenteredPath` always false | Unit + JSDoc + prim dump criteria |
| Canvas authority = Block2D | Code path + asset-engine README + honesty NOTES |
| SVG catalog = publish only | `scripts:smoke:svg:batch` exit 0 · 4 fixtures · NOTES |
| No competitor SVG | O&O prims only; no `/svg-catalog` load on Feasibility |

## Not done (correct deferrals)

| Item | Owner phase |
|------|-------------|
| Place journey with live cabinet-v0 PNG | **P07** |
| Mesh / toe / carcass beauty | **P08** |
| Fabric full stage cutover | destination — not W2 |

## Commands re-run

```text
cd site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts
# → 22 passed

pnpm run scripts:smoke:svg:batch
# → fixtures=4 ok=4 fail=0

pnpm exec tsx scripts/p05-dump-cabinet-prims.mts
# → 05-visual/cabinet-v0-prims.json
```

## False-green defenses

- Unit green alone does **not** prove browser place (P07).
- SVG smoke green proves **publish** pipeline, not Feasibility draw path.
- Evidence must live under `05-symbols-svg/` only (this re-prove refilled an emptied dir).
