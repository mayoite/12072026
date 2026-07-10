# SUMMARY — P05 / CP-05 (scratch baseline — NO PAPER MOON)

**Date:** 2026-07-10  
**Checkout:** `.` (main only)  
**Tip at baseline:** `cca98824` (origin/main)  
**Status:** **FAIL** — not CP-05 PASS

---

## Dual gate (owner law)

| Gate | Required | Actual | Result |
|------|----------|--------|--------|
| Cabinet readable multiprim | Doors/stile/handles/inner lines readable on plan — **not** empty filled box | Cream solid rectangle + thin outline only | **FAIL** |
| S7 plan canvas draws published SVG | Multipath `/svg-catalog/*.svg` after place | Chaise multipath clearly painted | **PASS** (`8ea2d558`) |
| **CP-05 overall** | Both | Cabinet fails | **FAIL** |

**Prior `"pass"` on this SUMMARY / `CP-05.json` is STRUCK.** Unit green + e2e harness green ≠ product gate green.

---

## What works (true)

| Claim | Proof |
|-------|--------|
| cabinet-v0 Block2D **data** is multi-prim | Unit + `05-visual/cabinet-v0-prims.json` (pair=7, slab=5, none=6) |
| pair vs slab geometry differs | Unit + prim JSON |
| Literal cream carcass (not black var-blob) | Browser PNGs — cream fill `#f3efe6` path |
| `furnitureBlockUsesCenteredPath` false | Unit |
| **S7 inventory place stamps published SVG** | Unit `s7CatalogConsume` + API; inventory thumb `/svg-catalog/chaise-lounge-001.svg` |
| **S7 plan canvas draws published SVG** | `FeasibilityCanvas` + `svgPlanSymbolCache`; `browser/05-svg-plan-canvas-draw.png` multipath chaise |
| SVG load fail → Block2D | Unit cache null remember |
| modular-cabinet-v0 keeps Block2D (skips SVG) | Code branch |
| No competitor SVG | O&O multi-path chaise fixture |
| Unit pack historically green | Vitest logs under this folder |

## What does **not** work (false / open)

| Claim | Truth |
|-------|--------|
| Cabinet not empty box on plan | **FALSE** — still empty cream tile at 100% zoom |
| `cabinetV0Block2DReadable` / `notEmptyBox` as product | **FALSE** in browser (true only as unit prim dump) |
| `browserVisualCp05` | **FALSE** |
| Unit multiprim ⇒ browser multiprim | **FALSE** — mm prims collapse to filled rect |
| E2e `canvasDiversity.notPureSolid` proves cabinet | **FALSE** — chaise multipath inflates sample |
| CP-05 PASS / W2 symbol quality closed | **FALSE — OPEN residual** |

## Correct deferrals (not excuses for PASS)

| Item | Owner phase |
|------|-------------|
| Full place journey polish | **P07** |
| Mesh / toe / carcass beauty | **P08** |
| Boolean publish pipeline multi-path for all fixtures | optional follow-up |

## False-green defenses (keep)

- Inventory `<img>` alone ≠ S7 product complete.
- Stamp-only without canvas draw = cheat (S7 draw **is** real for chaise).
- Unit prim counts alone ≠ W2 cabinet quality.
- E2e harness `"status":"pass"` ≠ CP-05 dual-gate pass.
- Writing `pass` in JSON while cabinet is empty box = paper moon — banned.

## Evidence authority

1. **`HONEST-STATUS.md`** — human re-baseline (this seat).  
2. **`CP-05.json`** — machine status **`fail`**.  
3. **Browser PNGs** — pixels over claims.  
4. This SUMMARY — does **not** claim PASS.

## What would flip to PASS

1. Re-shot browser cabinet shows **distinct multiprim** (not filled tile) at default/reasonable zoom.  
2. S7 SVG plan draw still green.  
3. Seat re-proves; then and only then update `CP-05.json` + this SUMMARY.

Until then: **CP-05 = FAIL / residual OPEN.**
