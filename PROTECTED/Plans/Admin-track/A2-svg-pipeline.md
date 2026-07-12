# A2 — SVG pipeline (raised bar)

**Status:** DONE — census re-proven 2026-07-12.

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

- [x] Census of `svg-catalog/*.svg` with publish path per slug
- [x] Publish E2E re-green after pipeline change (A1)
- [x] Written residuals under evidence — empty on the proven census
- [x] Evidence under `results/planner/admin-svg-pipeline/` (flat; no Plans `modules/` maze)

**A1 E2E green ≠ A2 complete.**

## UI execution slice

- [x] List shows live descriptor count.
- [x] List shows published artifact count.
- [x] Each row shows artifact state and byte size.
- [x] Revision files stay excluded from live counts.

**Reason:** File counts alone confuse revisions with live assets.

**Proof:** `pnpm --filter oando-site run audit:svg-catalog` → 5 live, 5 published, 16 revision snapshots excluded, 1 latest pointer excluded, 0 orphans. Publish audit fixtures now land under `results/admin/svg-pipeline-fixtures/`, not source fixtures.
