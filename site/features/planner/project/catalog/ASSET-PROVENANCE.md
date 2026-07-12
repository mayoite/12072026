# Open3D Asset Provenance

## Classification

All assets from the Open3D donor are classified as **demo-only reference assets**, not production catalog items.

- **Runtime/editor assets** (textures, models) may be copied to `site/public/cdn/planner/canvas` after Phase 08 approval (legacy slot `open3d/` is empty — do not write there).
- **Product/catalog assets** (real furniture images, 3D models) remain R2/DB-backed and never committed to git.

## Textures

Source: `open3d-floorplan/static/textures/`
License: CC0 1.0 Universal (Public Domain) via ambientCG
Classification: Demo-only runtime textures

| File | Source | ID |
|---|---|---|
| brick.jpg | ambientCG | Bricks097 (1K Color) |
| exposed-brick.jpg | ambientCG | Bricks059 (1K Color) |
| stone.jpg | ambientCG | Rock051 (1K Color) |
| wood-panel.jpg | ambientCG | WoodSiding009 (1K Color) |
| concrete.jpg | ambientCG | Concrete048 (1K Color) |
| subway-tile.jpg | ambientCG | Tiles093 (1K Color) |
| floor-light-oak.jpg | ambientCG | WoodFloor040 (1K Color) |
| floor-walnut.jpg | ambientCG | WoodFloor043 (1K Color) |
| floor-bamboo.jpg | ambientCG | WoodFloor012 (1K Color) |
| floor-laminate.jpg | ambientCG | WoodFloor048 (1K Color) |
| floor-tile-white.jpg | ambientCG | Tiles074 (1K Color) |
| floor-tile-gray.jpg | ambientCG | Tiles101 (1K Color) |
| floor-porcelain.jpg | ambientCG | Tiles099 (1K Color) |
| floor-marble-white.jpg | ambientCG | Marble012 (1K Color) |
| floor-marble-dark.jpg | ambientCG | Marble006 (1K Color) |
| floor-carpet-beige.jpg | ambientCG | Carpet008 (1K Color) |
| floor-carpet-gray.jpg | ambientCG | Carpet007 (1K Color) |
| floor-concrete.jpg | ambientCG | Concrete034 (1K Color) |
| floor-slate.jpg | ambientCG | Rock030 (1K Color) |
| floor-vinyl.jpg | ambientCG | WoodFloor024 (1K Color) |

## 3D Models (GLB)

Source: `open3d-floorplan/static/models/`
License: Unknown — demo-only, do not use in production catalog
Classification: Demo reference models for fallback geometry sizing

All GLB files in `static/models/` are demo assets. They represent approximate furniture dimensions for UI proof-of-concept only. Real product models are stored in R2/DB and referenced by URL at runtime.

## SVG Symbols

Generated from canonical typed definitions in `catalog/svg/svgSymbols.ts`.
Classification module: `cleanup/assetClassification.ts`.
No external SVG markup is used as source. All symbols are deterministic, theme-separated, and sanitization-tested.

## Notes

- Legacy `widthMm`/`heightMm` fields in the donor store centimetre values (naming debt). Conversion layer in `unitConversion.ts` handles this explicitly.
- Asset validation in `assetValidation.ts` enforces origin allowlist for runtime URLs.
- Missing asset fallback in `svgFallback.ts` and `fallbackGeometry.ts` provides visible geometry when assets fail to load.
