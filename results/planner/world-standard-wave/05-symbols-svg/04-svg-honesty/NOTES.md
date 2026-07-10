# P05 — SVG honesty + S7 (publish path + inventory place consume)

- **Date:** 2026-07-10
- **HEAD:** see `../HEAD.txt` / git tip after CP-05 S7 land
- **Owner call:** S7 **is in scope** for P05 (inventory place consumes published SVG URL).

## Authority split (honest)

| Surface | Authority | Entry |
|---------|-----------|-------|
| **Canvas plan symbols (W2)** | Block2D prims | `furnitureBlock2DFromItem` → `renderBlock2DCentered` |
| **Publish (disk SVG)** | pipelineCore + normalize | `compileSvgForPublish` → `public/svg-catalog/{slug}.svg` |
| **S7 inventory / place** | Catalog `previewImageUrl` | `descriptorCatalogBridge` → inventory `<img>` → `placeCatalogItemInProject` stamps `furniture.previewImageUrl` |

- Feasibility **does not** rasterize `/svg-catalog/*.svg` as the plan-draw path. Canvas W2 = Block2D (cabinet-v0 multi-prim).
- S7 **does** mean: published URL is on catalog items, shown in inventory, and **stamped on place**.

## Smoke (publish path)

| Item | Value |
|------|-------|
| `pnpm run scripts:smoke:svg:batch` | exit **0** · fixtures=4 ok=4 |
| Log | `svg-batch-raw.log` |

## S7 proof

| Layer | Evidence |
|-------|----------|
| API | `/api/planner/catalog/svg-blocks/` → `previewImageUrl: /svg-catalog/{slug}.svg` (4 items) |
| Unit | `tests/unit/.../s7CatalogConsume.test.ts` — place stamps URL |
| Browser | `browser/03-inventory-svg-preview.png` · `04-svg-catalog-item-placed.png` · `run.json` |
| Stage registry | `asset-engine/stages.ts` `svg-s7-catalog-consume` = **implemented** |

## W2 canvas proof

| Layer | Evidence |
|-------|----------|
| Unit | cabinet-v0 Block2D ≥4 prims, centeredPath false (22 tests with render pack) |
| Browser | `browser/01-cabinet-v0-placed.png` · `02-cabinet-v0-canvas.png` |

## Explicit non-claims

- Canvas does **not** load SVG path strings as Feasibility prims.
- Full admin SVG editor UX polish is not this seat.
- P07 place journey / P08 mesh remain separate.
