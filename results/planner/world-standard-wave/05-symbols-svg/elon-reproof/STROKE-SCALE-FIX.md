# Live symbol solid-box — root cause + fix (Elon re-proof)

**Date:** 2026-07-09

## Root cause
Feasibility applies `context.scale(transform.scale)` (~0.05–0.15). Block2D stroke widths were authored in **mm** (1–2). After scale they became **sub-pixel**, so only the solid outer fill read — multi-prim detail (front/back, stile, handles) vanished.

## Fix
`resolveCanvasStrokeWidthMm` + `applyStrokeWidth` in `renderBlock2DToCanvas.ts`: floor stroke to ≥1.25 screen px in user units. Dash lengths similarly floored for lines.

## Proof
- Unit: `resolveCanvasStrokeWidthMm(1.5, 0.1) ≈ 12.5`
- CP-05 suite **20/20** green after fix
- Re-check live: place modular cabinet, zoom — strokes should remain visible

## Honesty
Units always proved multi-prim geometry. Live FAIL was **paint scale**, not missing prims.
