# A2 — SVG pipeline (raised bar)

**Status:** OPEN — not complete.

**Goal:** Honest path admin author → server compile → `site/public/svg-catalog/{slug}.svg` on disk, with census — not “a few SVGs and hope.”

**Honesty:** Publish path ≠ plan-draw path. Live planner 2D is Fabric ([CONSTRAINTS](../Planner-track/CONSTRAINTS.md)).

**Bar:** [00-QUALITY-BAR](../00-QUALITY-BAR.md)

## Key code

| Area | Path |
|------|------|
| Publish compile | `site/features/planner/asset-engine/svg/compileSvgForPublish.ts` |
| Stages | `site/features/planner/asset-engine/svg/runSvgCompileStages.ts` |
| CLI fixtures | `site/scripts/generate-svg.mjs` |
| Admin API | `site/app/api/admin/svg-editor/route.ts` |
| Editor UI | `site/features/planner/admin/svg-editor/` |

## Done when (unchecked)

- [ ] Census of `svg-catalog/*.svg` with publish path per slug
- [ ] Publish E2E re-green after pipeline change (A1)
- [ ] Written residuals under evidence — no silent ship
- [ ] Evidence under `results/planner/admin-svg-pipeline/` (flat; no Plans `modules/` maze)

**A1 E2E green ≠ A2 complete.**

## UI execution slice

- [ ] List shows live descriptor count.
- [ ] List shows published artifact count.
- [ ] Each row shows artifact state and byte size.
- [ ] Revision files stay excluded from live counts.

**Reason:** File counts alone confuse revisions with live assets.

**Implementation:** UI slice landed. Census proof remains OPEN.
