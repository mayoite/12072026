# A2 — SVG pipeline (raised bar)

**Status:** OPEN — not complete. Live Admin kill.

**Goal:** Honest path admin author → server compile → `site/public/svg-catalog/{slug}.svg` on disk, with census and publish ritual — not “a few SVGs and hope.”

**Bar:** [03-QUALITY-BAR](../03-QUALITY-BAR.md) · Locked: `docs/Lockedfiles/svg-pipeline/current.md`

## Key code

| Area | Path |
|------|------|
| Publish compile | `site/features/planner/asset-engine/svg/compileSvgForPublish.ts` |
| Stages | `site/features/planner/asset-engine/svg/runSvgCompileStages.ts` |
| CLI fixtures | `site/scripts/generate-svg.mjs` |
| Admin API | `site/app/api/admin/svg-editor/route.ts` |
| Editor UI | `site/features/planner/admin/svg-editor/` |

## Done when (all unchecked until proven)

- [ ] Census of `svg-catalog/*.svg` with publish path per slug
- [ ] Publish E2E re-green after pipeline change (A1 path)
- [ ] Written residuals (OPEN debt) under evidence — no silent ship
- [ ] Evidence only under `results/planner/global-standard-revision/modules/admin-svg-pipeline/`

**A1 E2E green ≠ A2 module complete.**
