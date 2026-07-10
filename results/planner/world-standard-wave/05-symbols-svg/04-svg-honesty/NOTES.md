# P05 — SVG honesty (publish path seat)

- **Date:** 2026-07-10
- **Seat scope:** Publish-path smoke + honesty notes only. **Not** canvas W2 product work. **Not** full CP-05 alone.
- **HEAD at smoke:** `a4f5d9f8f389f83ec6de3192e0454c106848562c`

## Authority split (do not conflate)

| Surface | Authority | Entry |
|---------|-----------|-------|
| **Canvas (Feasibility plan symbols)** | Block2D prims | `furnitureBlock2DFromItem` → `renderBlock2DCentered` (via `FeasibilityCanvas`) |
| **Publish (catalog SVG files)** | pipelineCore + normalize | `compileSvgForPublish` → `public/svg-catalog/{slug}.svg` |

- **Canvas authority** = `furnitureBlock2DFromItem` → `renderBlock2DCentered`. Feasibility draws furniture from Block2D, not from loaded published SVG.
- **Publish authority** = `compileSvgForPublish` → writes under `public/svg-catalog`.
- **Feasibility does NOT load `/svg-catalog` as the draw path.** W2 acceptance is Block2D-readable plan symbols, not “SVG loaded onto FeasibilityCanvas.”

Doc mirror: `site/features/planner/asset-engine/README.md` § **Canvas vs publish SVG (P05 honesty)** — present at seat time; no README edit required.

## Smoke (publish path)

| Item | Value |
|------|-------|
| Script | `site/package.json` → `scripts:smoke:svg:batch` (`tsx scripts/smoke-svg-fixtures.mjs`) |
| Also present | `scripts:smoke:svg` (single fixture chaise) |
| CWD | `site/` |
| Raw log | `results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty/svg-batch-raw.log` |
| **Exit code** | **0** |
| Result | **PASS** — fixtures=4 ok=4 fail=0 |

Fixture lines (from log):

- OK chaise.json → chaise-lounge-001
- OK missing-geometry.json → missing-geom-fallback-001
- OK sectional.json → sectional-sofa-001
- OK side-table.json → side-table-001

## Honesty rules applied

- Smoke exit code reported honestly: **0 → pass**.
- Do **not** claim smoke green if exit ≠ 0 (N/A this run).
- This seat does **not** claim full CP-05. No `furnitureBlock2D` product code touched.
- Publish smoke green ≠ canvas W2 complete; those are separate authorities.

## Out of scope this seat

- Canvas W2 cabinet-v0 / Block2D product changes
- Visual CP-05 browser proof
- Claiming S7 (inventory place consuming published SVG) implemented
