# P05 SVG honesty — elon re-proof

**Command:** `cd site; pnpm run scripts:smoke:svg:batch`  
**Timestamp:** 2026-07-09T23:05Z  
**Exit code:** **0**

## Result

```
OK  scripts\generate-svg\_fixtures\chaise.json slug=chaise-lounge-001 bytes=453
OK  scripts\generate-svg\_fixtures\missing-geometry.json slug=missing-geom-fallback-001 bytes=422
OK  scripts\generate-svg\_fixtures\sectional.json slug=sectional-sofa-001 bytes=477
OK  scripts\generate-svg\_fixtures\side-table.json slug=side-table-001 bytes=613

smoke:svg:batch fixtures=4 ok=4 fail=0
```

- fixtures=4 ok=4 fail=0
- log: `results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty/svg-batch-raw-elon.log`
- honesty overwrite: `04-svg-honesty/svg-batch-raw.log`

## Honesty (Block2D ≠ publish)

From `04-svg-honesty/NOTES.md` — still true, unchanged by this re-run:

| True | Not true |
|------|----------|
| Publish compile → `compileSvgForPublish` / `public/svg-catalog/{slug}.svg` | “SVG is the FeasibilityCanvas authority.” |
| CLI smokes prove **publish pipeline** only | “cabinet-v0 plan mark is published SVG.” |
| Open3d plan canvas uses **Block2D**, not `/svg-catalog/*.svg` | “Portal svg-catalog proves planner place symbols.” |

**Gate claim:** smoke exit 0 proves publish fixture path; it does **not** prove plan-canvas Block2D symbol authority.
