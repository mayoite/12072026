# Architecture

- Read `docs/architecture/` before placing code.
- Admin and Planner are the product domains.
- Fabric is the sole interactive 2D canvas.
- Three.js is the 3D engine.
- One normalized document drives 2D, 3D, save, and BOQ.
- Published SVG is the primary 2D product symbol.
- `Block2D` is a fallback.
- **Live SVG authority = disk** (`inventory/descriptors/`, `public/svg-catalog/`) until Failures.md cutover is proved.
- **Target SVG authority = Products DB + R2** revision artifacts (not live yet).
- Admin publish: disk first (live); server-only DB transaction (target). Dual-write optional when Products DB + R2 ready ≠ cutover.
- Planner imports through a server catalog API (DB-aware + disk fallback today).
- Static catalog files are **live** SVG today; after cutover they become migration inputs or fixtures only.
- Parametric brand geometry pen = **Maker.js only**. Live form/CLI/publish use `drawLinearDesk` / `renderLinearDeskSvg` (Maker). Template multipath is deprecated residual only.
- Do not create parallel canvas, catalog, or planner trees.
- Preserve stable identity and millimetre units.
