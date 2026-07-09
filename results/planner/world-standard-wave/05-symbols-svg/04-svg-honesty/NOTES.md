# SVG path honesty (P05)

## What is true
1. Publish compile authority = compileSvgForPublish → pipelineCore+normalize
2. Admin publish wire = publishDescriptorWithPipeline → public/svg-catalog/{slug}.svg
3. CLI fixtures: pnpm run scripts:smoke:svg / scripts:smoke:svg:batch
4. V1 svgCompiler.server.ts = v1-reference-only
5. Open3d plan canvas does not draw from /svg-catalog/*.svg today (Block2D)
6. generateCabinetV0Footprint is mesh/helper — not canvas Block2D

## What is not true
1. “SVG is the FeasibilityCanvas authority.”
2. “cabinet-v0 plan mark is published SVG.”
3. “Portal svg-catalog proves planner place symbols.”
4. “furnitureBlockUsesCenteredPath means modular prims are centered.” (fixed always false)

## Smoke result this run
- scripts:smoke:svg:batch exit: **0** (fixtures=4 ok=4 fail=0)
- log: `04-svg-honesty/svg-batch-raw.log`
- elon re-proof: `04-svg-honesty/svg-batch-raw-elon.log` + `elon-reproof/SVG-SMOKE.md` (exit **0**, 2026-07-09)
- **Block2D ≠ publish:** smoke proves publish fixtures only; open3d plan canvas remains Block2D (not svg-catalog authority)
