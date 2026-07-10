# P05 — SVG honesty + S7 (publish + place stamp + **plan canvas draw**)

- **Date:** 2026-07-10
- **HEAD:** see `../HEAD.txt` / git tip after S7 canvas-draw land
- **Owner call:** S7 **is in scope**. Stamping `previewImageUrl` without canvas `drawImage` = **not done**.

## Authority split (honest — after S7 hard path)

| Surface | Authority | Entry |
|---------|-----------|-------|
| **Canvas plan symbols (default / cabinet-v0)** | Block2D prims | `furnitureBlock2DFromItem` → `renderBlock2DCentered` |
| **Canvas plan symbols (published SVG furniture)** | **drawImage of `/svg-catalog/*.svg`** | `svgPlanSymbolCache` → `FeasibilityCanvas` when `previewImageUrl` ends `.svg` and `geometryMode !== modular-cabinet-v0` |
| **Publish (disk SVG)** | pipelineCore + normalize | `compileSvgForPublish` → `public/svg-catalog/{slug}.svg` |
| **S7 inventory / place** | Catalog `previewImageUrl` stamp | `placeCatalogItemInProject` → `furniture.previewImageUrl` |

### What S7 means now (all required)

1. API/catalog items expose `previewImageUrl` `/svg-catalog/{slug}.svg`
2. Place stamps that URL onto furniture
3. FeasibilityCanvas **loads + draws** that SVG into the footprint (`getSvgPlanImage` + `drawSvgPlanSymbol` + `svgPaintGen` redraw)
4. Fallback Block2D if SVG fails to load (or modular-cabinet-v0 keeps parametric Block2D)
5. Units: place stamp + svgPlanSymbolCache
6. Browser: place chaise → canvas shows multi-path symbol (not solid empty blob)

### Explicit non-claims (still true)

- Canvas does **not** parse SVG path strings into Feasibility prim trees — it **rasterizes** via HTMLImage + `drawImage`.
- Boolean pipeline fixtures for sectional/side-table may still be single-path; **chaise** was hand-tuned multi-path O&O original for plan readability (`data-oando-origin="true"`). Re-running `scripts:smoke:svg:batch` **overwrites** public SVG from boolean fixtures — re-apply multi-path chaise after batch if needed.
- Full admin SVG editor UX polish is not this seat.
- P07 place journey / P08 mesh remain separate.

## Smoke (publish path)

| Item | Value |
|------|-------|
| `pnpm run scripts:smoke:svg:batch` | exit **0** · fixtures=4 ok=4 (historical; may rewrite public SVG) |
| Log | `svg-batch-raw.log` |

## S7 proof (canvas draw)

| Layer | Evidence |
|-------|----------|
| API | `/api/planner/catalog/svg-blocks/` → `previewImageUrl: /svg-catalog/{slug}.svg` |
| Unit place stamp | `s7CatalogConsume.test.ts` |
| Unit cache/draw | `svgPlanSymbolCache.test.ts` (load + fail-null + drawImage footprint) |
| Code | `FeasibilityCanvas` SVG branch + `svgPaintGen`; `stages.ts` `svg-s7-catalog-consume` note matches draw |
| Browser | `browser/03-inventory-svg-preview.png` · `04-svg-catalog-item-placed.png` · **`05-svg-plan-canvas-draw.png`** · `run.json` (`s7CanvasDraw`, diversity) |
| Fixture | `public/svg-catalog/chaise-lounge-001.svg` multi-path (seat/back/arm/seams) — not solid rect |

## W2 canvas proof

| Layer | Evidence |
|-------|----------|
| Unit | cabinet-v0 Block2D multi-prim |
| Browser | `browser/01-cabinet-v0-placed.png` · `02-cabinet-v0-canvas.png` |

## Lies killed this land

| Old claim | Truth now |
|-----------|-----------|
| "Feasibility plan draw remains Block2D (not SVG…)" | **False for published SVG furniture** — canvas draws SVG via drawImage |
| "svgCatalogIsPublishNotCanvasDraw" | **Killed** — catalog SVG is now plan-draw authority when stamped |
| "Inventory thumb = S7 complete" | **Killed** — canvas draw required |
| Chaise solid full-rect path | **Improved** multi-path O&O fixture for readable plan paint |
