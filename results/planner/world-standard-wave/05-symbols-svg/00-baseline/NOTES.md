# P05 baseline

- Date: 2026-07-09
- Canvas draw path: FeasibilityCanvas → furnitureBlock2DFromItem → renderBlock2DCentered
- cabinet-v0 modular symbol today: **2 prims** (rect + dashed center line) — not product-readable yet
- furnitureBlockUsesCenteredPath: returns true but modular prims are top-left; unused — fix in Task 2
- SVG catalog path: compileSvgForPublish → public/svg-catalog (not canvas authority)
- generateCabinetV0Footprint: centered path string helper — not Feasibility draw authority
- Ethics: no competitor SVG
- Baseline vitest log: vitest-raw.log
