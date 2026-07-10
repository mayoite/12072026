# Expert pass — 02 Canvas 2D / Fabric path

**Date:** 2026-07-09 · **Role:** 2D canvas / Fabric-path · **Scope:** plan-only (no product code)  
**Inputs:** P02, P03(+app), P05(+app); live Feasibility / flag / Block2D; ENGINE-DECISION (no re-scrape)

---

## Verdict: **SHIP**

Approach **A** is correct and live-aligned: **FeasibilityCanvas = interim interactive 2D** for W1–W8; **Fabric.js v7 full stage = destination after W** (Plan A 2B.2). Flag furniture overlay is migration spike only, default OFF. Do **not** re-open Konva hybrid or abandon Fabric. Execute P03/P05 on Feasibility as written.

---

## Must-fix P0

1. **W3/W2 prove with Fabric flag OFF** (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` ≠ `"1"`). Flag-ON hides Feasibility furniture draw and mounts `FurnitureFabricLayer` (flat Rects, separate pointer ownership) — dual hit surface + pan/zoom desync risk; not product dual-CAD.
2. **Document selection only** — `workspaceCanvas.selection` + `pickFurnitureAtPoint` on Feasibility select tool. No second selection store; Fabric object selection is not W3 authority.
3. **Block2D = plan-symbol authority today** — `FeasibilityCanvas` → `furnitureBlock2DFromItem` → `renderBlock2DCentered` (top-left prims, canvas centers). Never claim `/svg-catalog/*.svg` or `compileSvgForPublish` as Feasibility draw path.
4. **Keep `canvas-fabric-stage/`** — do not delete flag/mapper/layer while shipping Approach A; destination is not insurance.
5. **P05 `furnitureBlockUsesCenteredPath`** must become always `false` (live: returns `true` for modular-cabinet-v0 while prims are top-left — dead lie).
6. **P03 keyboard** — Delete/Backspace must `preventDefault`; multi-id delete = **one** `updateProject` (live loops N times → N history).

---

## Should-fix P1

1. Select-tool required for furniture pick (default tool often `wall`); Esc clears selection (W3 grammar).
2. Pick padding + top-most (last array) + rotation already in `canvasPicking.ts` — unit-cover before browser.
3. Task 05 coords: `projectToScreen` + `INITIAL_TRANSFORM` `{ origin: (-4000,-2500), scale: 0.1 }` — match Fabric `DEFAULT_FABRIC_STAGE_TRANSFORM`; do not thrash `fitToView` in unit tests.
4. Flag-ON Fabric symbols are **not** W2 (plain Rect, not Block2D); cutover later must rebind Block2D or accept temporary symbol regression.
5. Archive `/planner/fabric/*` (`_archive/fabric/`) ≠ live open3d path.
6. Unknown-SKU box fallback + ≥4-prim cabinet-v0 (carcass/front/doorStyle) per P05; no competitor SVG.

---

## False-reverse risks

| Reverse | Why wrong |
|---------|-----------|
| “Ship Fabric full stage before W gates” | Breaks Approach A; walls/tools still Feasibility; thrash |
| “Fabric is only insurance → delete slice” | Violates ENGINE-DECISION + P02 lock |
| “Enable flag for W3 proof” | Dual pointer; selection/draw split; false green |
| “SVG catalog proves plan symbols” | Publish ≠ canvas; W2 fails honesty |
| “Centered modular prims” | Live prims top-left; only `renderBlock2DCentered` centers |
| “Konva + Fabric hybrid” | Hard ban; fail-forward = Konva **full** only after failed Fabric spike + evidence |
| “`/planner/fabric` is live 2D” | Archive; live = open3d host + Feasibility |

---

## Path truth (live 2026-07-09)

| Role | Path / fact |
|------|-------------|
| Interim 2D | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` — Canvas 2D; walls/rooms/tools; Block2D furniture when `layerVisibility.furniture` |
| Flag | `…/canvas-fabric-stage/fabricFurnitureFlag.ts` — `=== "1"` only; default OFF |
| Flag wire | `OOPlannerWorkspace.tsx` — ON → furniture layer forced off + `FurnitureFabricLayer`; OFF → sole Feasibility |
| Fabric slice | `FurnitureFabricLayer.tsx` + `furnitureFabricMapper.ts` — document mm ↔ screen; entityId = furniture.id; no Fabric JSON persist |
| Pick | `…/lib/geometry/canvasPicking.ts` `pickFurnitureAtPoint` — select tool ~L735 Feasibility |
| Symbols | `…/catalog/furnitureBlock2D.ts` — modular cabinet-v0 = **2 prims** (empty-box bar); fix in P05 |
| Paint | `site/lib/catalog/renderBlock2DToCanvas.ts` `renderBlock2DCentered` |
| Host | open3d / guest / canvas → `OOPlannerWorkspace` (guest/canvas via `Open3dPlannerWorkspaceRoute`) |
| Dest | Fabric v7 full stage after W; not this wave’s cutover |

**Handover:** Ship W on Feasibility + document model; Fabric stays destination post-W; prove W2/W3 flag-OFF; Block2D not SVG.
