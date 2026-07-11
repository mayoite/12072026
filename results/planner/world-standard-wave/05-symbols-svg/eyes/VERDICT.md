# P05 eyes VERDICT — live plan symbols (PLAN-SYM)

**Date:** 2026-07-11  
**Agent:** PLAN-SYM  
**Host:** `/planner/guest/?plannerDevTools=1` · Fabric sole 2D stage  
**Honesty:** Live paint = **Block2D → `createFabricFurnitureBlock`**. Not `public/svg-catalog/*.svg` as plan-draw.

## Before (honest)

| Observation | Status |
|-------------|--------|
| Cabinet on plan | **Cream/empty solid tile** (HONEST-STATUS 2026-07-10) — multiprim data existed in library, eyes failed |
| Fabric hex colors | `resolveStageColor` treated hex as CSS vars → throw → fallback; contrast weak |
| Inventory Modular Cabinet thumb | Flat placeholder pair-door box |
| Claim “svg-catalog is plan-draw” | **False** — publish path only |

## After (this land)

| Observation | Status |
|-------------|--------|
| Cabinet multiprim on **lower-canvas** | **YES** — body `#e8d9c0` + door band `#c9b89a` + handle `#4a4034` + inner/front/back lines (7 Fabric children) |
| Peer item (chaise) | **YES** — multipath group (16 children) co-visible |
| Inventory thumb | **YES** — raised `placeholder-cabinet.svg` multiprim (body/door/handle) |
| Units | cabinet-v0 + fabricBlock2D paint tests **green** |
| Feasibility restore | **No** |
| svg-catalog as plan-draw claim | **No** |

## Evidence paths

| File | What it proves |
|------|----------------|
| `01-cabinet-multiprim-lower-canvas.png` | Lower-canvas multiprim after place+zoom |
| `02-cabinet-full-ui.png` | Full guest UI; inventory thumb multiprim; props cabinet-v0 |
| `04-cabinet-plus-peer-lower-canvas.png` | Cabinet + chaise peer on plan |
| `05-two-items-full-ui.png` | Full UI two items |
| `06-inventory-cabinet-thumb.png` | Catalog browser thumb crop (if captured) |
| `07-cabinet-multiprim-deselected.png` | Paint without Fabric selection chrome |
| `fabric-objects.json` | Group child dumps (fills/strokes) |
| `run.json` | Diversity + fabric child counts |

## Soft metrics (not the hard bar)

- Canvas diversity sample: uniqueQuantized ≥ 70 (not pure solid)
- Fabric cabinet group childCount = **7** (slab multiprim)
- Chaise group childCount = **16**

## Hard bar (eyes)

- **Cabinet readable multiprim (not cream blob)?** **YES**
- **Colors on plan?** **YES** (body ≠ door ≠ handle)
- **Catalog thumb not blank?** **YES**
- **Dual-gate units?** **PASS** (touched files)
- **Product dual-gate overall?** **PASS for PLAN-SYM symbol raise** — re-prove on clean tip after push

## Code touched

- `site/features/planner/open3d/catalog/furnitureBlock2D.ts` — door band fill, material colors, thicker fractions
- `site/features/planner/canvas-fabric-stage/fabricBlock2D.ts` — hex paint pass-through, stroke floor 1.5px
- `site/features/planner/canvas-fabric-stage/Open3dFabricStage.tsx` — resolveStageColor hex-safe
- `site/public/placeholder-cabinet.svg` — multiprim inventory thumb
- Units: cabinet-v0 + new `fabricBlock2D.test.ts`
