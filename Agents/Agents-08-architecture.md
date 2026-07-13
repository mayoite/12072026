# Architecture

- Read `docs/architecture/` before placing code.
- Admin and Planner are the product domains.
- Fabric is the sole interactive 2D canvas.
- Three.js is the 3D engine.
- One normalized document drives 2D, 3D, save, and BOQ.
- Published SVG is the primary 2D product symbol.
- `Block2D` is a fallback.
- Public static catalog files are the first authority.
- Do not create parallel canvas, catalog, or planner trees.
- Preserve stable identity and millimetre units.
