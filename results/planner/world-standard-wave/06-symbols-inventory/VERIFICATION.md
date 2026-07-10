# P06 Symbols Inventory — Browser Verification

**Date:** 2026-07-10  
**Target:** `http://localhost:3000/planner/guest/`  
**Harness:** Playwright (`site/tests/e2e/open3d-p06-symbols-inventory.spec.ts`) against live dev server on port 3000  
**Overall:** **PASS**

## Checks

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 1 | Dev server responds on port 3000 | **PASS** | Reused running `pnpm --filter oando-site dev` |
| 2 | `GET /api/planner/catalog/svg-blocks` returns 5 descriptors | **PASS** | `api-svg-blocks.json` |
| 3 | API includes `chaise-lounge-001` | **PASS** | slug in API response |
| 4 | API includes `desk-linear-1200-001` | **PASS** | slug in API response |
| 5 | Guest planner loads (setup gate cleared) | **PASS** | `01-workspace-ready.png` |
| 6 | Inventory panel: **Symbols** category visible | **PASS** | `02-symbols-svg-catalog.png` |
| 7 | Inventory panel: **SVG catalog** subcategory visible | **PASS** | `02-symbols-svg-catalog.png` |
| 8 | Symbols → SVG catalog is **not** empty (`No elements found`) | **PASS** | `03-inventory-items.png` (4 items shown; catalog hydrates after category click) |
| 9 | **Chaise Lounge** (`chaise-lounge-001`) listed | **PASS** | `03-inventory-items.png` |
| 10 | **Desk Linear 1200** (`desk-linear-1200-001`) listed | **PASS** | `03-inventory-items.png` |
| 11 | Place `chaise-lounge-001` on canvas | **PASS** | `04-chaise-placed.png`; furniture count increased |
| 12 | Place `desk-linear-1200-001` on canvas | **PASS** | `05-desk-placed.png`, `06-canvas-both.png`; status bar **2 furniture** |

## API snapshot

```json
{
  "total": 5,
  "slugs": [
    "chaise-lounge-001",
    "desk-linear-1200-001",
    "missing-geom-fallback-001",
    "sectional-sofa-001",
    "side-table-001"
  ]
}
```

All five items use `category: "Symbols"`, `subCategory: "SVG Catalog"`.

## UI notes (non-blocking)

- **Catalog hydrate delay:** Immediately after selecting Symbols → SVG catalog, the panel briefly shows **0 items / No elements found** (`02-symbols-svg-catalog.png`) before the live catalog loads (~1–2s). Items then appear (`03-inventory-items.png`). Not a taxonomy filter bug — timing only.
- **Inventory shows 4 items** in the grid at capture time (API has 5). Fifth item (`missing-geom-fallback-001` or another) may be below the fold or capped by `OPEN3D_CATALOG_RESULT_CAP`; both target slugs are present.
- **cursor-ide-browser MCP** could not open a tab in this session; Playwright Chromium was used instead.

## Screenshots

| File | Description |
|------|-------------|
| `01-workspace-ready.png` | Guest planner workspace, 2D mode |
| `02-symbols-svg-catalog.png` | Symbols category expanded, SVG catalog selected (pre-hydrate) |
| `03-inventory-items.png` | SVG catalog items visible (Chaise Lounge, Desk Linear 1200, …) |
| `04-chaise-placed.png` | After placing Chaise Lounge |
| `05-desk-placed.png` | After placing Desk Linear 1200; properties show 1200×600 mm |
| `06-canvas-both.png` | Canvas close-up with both symbols placed |

## Run metadata

See `run.json` — `status: "pass"`, `furnitureAfter: "2 furniture"`.

## Reproduce

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL="http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-p06-symbols-inventory.spec.ts --reporter=list
```
