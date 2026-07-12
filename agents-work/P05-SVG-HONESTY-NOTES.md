# P05 SVG honesty (2026-07-12 Slice A)

**Tracked.** Not a gate artifact. Evidence dump: `results/planner/world-standard-wave/05-symbols-svg/`.

## Two paths — do not conflate

| Path | Owner | What it is | What it is **not** |
|------|--------|------------|--------------------|
| **Live plan paint** | `PlannerFabricStage` → `createFabricFurnitureBlock` → `furnitureBlock2DFromItem` | Fabric multiprim Group from Block2D prims (cabinet-v0 modular multiprim) | Not `/svg-catalog/*.svg` drawImage |
| **SVG catalog publish** | `compileSvgForPublish` → `public/svg-catalog/{slug}.svg` | Inventory / admin publish artifact; catalog `previewImageUrl` | Not the Fabric plan-draw path |

## Live truth (checkout)

- Sole 2D host: `data-testid="planner-fabric-stage"` (`PlannerFabricStage`). No archive host.
- Furniture paint loop always calls `createFabricFurnitureBlock` (no svg-catalog branch in `canvas/`).
- `furnitureBlockUsesCenteredPath` → always `false`.
- `svgPlanSymbolCache` / `drawSvgPlanSymbol` — **unwired** on live plan (unit-only + stale stage notes).
- `stages.ts` S7 text still names plan-canvas SVG draw — **stale**; catalog preview URL ≠ plan paint.

## Prove log (this slice)

| Check | Result |
|-------|--------|
| Units: `furnitureBlock2D.cabinet-v0` + workstation + `fabricBlock2D` | **22/22 green** → dump `cabinet-v0-multiprim-units.log` |
| Units: `renderBlock2DToCanvas` | **10/10 green** → dump `renderBlock2DToCanvas-units.log` |
| E2E: `open3d-p05-cabinet-multiprim` | **PASS** — PNGs + diversity; eyes: multiprim cabinet (body/door/handle), not empty cream tile |
| E2E: `open3d-cp05-symbols-s7` | **FAIL** — published `chaise-lounge-001.svg` has **1** pathish element (need ≥3). Publish multipath residual — **not** Fabric Block2D gap |
| CP-05 overall | **Not green** — do not forge PASS |

## Residual (out of Slice A raise)

1. **Published SVG multipath richness** (e.g. chaise single-path blob) — inventory/publish quality, not plan multiprim.
2. **Stale S7 wording** in `asset-engine/stages.ts` (claim vs live Fabric multiprim).
3. Dead export `isPlannerFabricFurnitureEnabled` (flag unused by stage; paint always multiprim).

## Hard rules for later seats

- Never claim `/svg-catalog/*.svg` as plan-draw.
- W2 symbol half closes on **live Fabric** cabinet-v0 readability + this honesty split.
- Do not wait on P07 place journey or P08 mesh toe/carcass to keep multiprim honest.
