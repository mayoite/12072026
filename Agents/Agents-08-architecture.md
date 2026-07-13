# Architecture

- Read `docs/architecture/` before placing code.
- Admin and Planner are the product domains.
- Fabric is the sole interactive 2D canvas.
- Three.js is the 3D engine.
- One normalized document drives 2D, 3D, save, and BOQ.
- Published SVG is the primary 2D product symbol.
- `Block2D` is a fallback.
- The Products database is the released catalog and SVG authority.
- Admin writes through a server-only transaction.
- Planner imports through a server catalog API.
- Static catalog files are migration inputs or isolated fixtures only.
- Do not create parallel canvas, catalog, or planner trees.
- Preserve stable identity and millimetre units.
