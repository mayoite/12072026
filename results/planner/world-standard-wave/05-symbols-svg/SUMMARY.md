# SUMMARY — P05 / CP-05 (W2 + S7 plan canvas draws published SVG)

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` (main only)  
**Status:** **PASS** (S7 hard path: canvas `drawImage` of `/svg-catalog/*.svg`)

---

## Done (gate)

| Claim | Proof |
|-------|--------|
| cabinet-v0 not empty black blob | Unit multi-prim; browser `02-cabinet-v0-canvas.png` light carcass |
| pair vs slab geometry differs | Unit + prim JSON |
| `furnitureBlockUsesCenteredPath` always false | Unit |
| **S7 place stamps published SVG** | Unit `s7CatalogConsume` + API |
| **S7 plan canvas draws published SVG** | `FeasibilityCanvas` + `svgPlanSymbolCache`; browser `05-svg-plan-canvas-draw.png` multi-path chaise |
| SVG load fail → Block2D | Unit cache null remember |
| modular-cabinet-v0 keeps Block2D | Code branch `geometryMode !== modular-cabinet-v0` |
| No competitor SVG | O&O multi-path chaise fixture |

## Not done (correct deferrals)

| Item | Owner phase |
|------|-------------|
| Place journey with live cabinet-v0 PNG pack | **P07** |
| Mesh / toe / carcass beauty | **P08** |
| Boolean publish pipeline multi-path for all fixtures | optional follow-up — chaise hand-tuned; smoke batch can overwrite |

## Commands re-run (this land)

```text
cd site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/catalog/svgPlanSymbolCache.test.ts `
  tests/unit/features/planner/open3d/catalog/s7CatalogConsume.test.ts
# → 9 passed

pnpm exec playwright test -c config/build/playwright.config.ts `
  tests/e2e/open3d-cp05-symbols-s7.spec.ts --reporter=list
# → 1 passed · evidence browser/05-svg-plan-canvas-draw.png
```

## False-green defenses

- Inventory `<img>` alone ≠ S7 product complete.
- Stamp-only without canvas draw = cheat (killed).
- `svgCatalogIsPublishNotCanvasDraw` claim retired (false).
