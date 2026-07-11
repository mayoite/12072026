# Content Publishing — Current Situation

**Evidence:** Reads of `docs/Lockedfiles/02-svg-pipeline-current.md`, planner admin CONTENTS, portal, and superpowers design.

## Honest State

- SVG catalog on portal is public read-only Puck `Render` (1 per route).
- Admin publish seam (svg-editor) ahead of full 1B compose.
- Publish flows use plannerPublish, artifact compiler in admin.
- Current: 1A/1B not accepted (Lockedfiles baseline).
- Evidence in results/planner/, results/site/, svg-catalog in public.
- Tech stack generator workflows page has no content-publishing module.

## Gaps

- `site-workflows/content-publishing/` absent pre-task.
- Publishing workflow not documented in one place (scattered in admin/planner/portal).
- Admin full compose not complete; portal is preview.
- No generator data source for this workflow slice.
- 1B status per revision: not accepted.

## GS Application

- SVG generation strict Option A + contracts (superpowers §8).
- Global standard visual + anti-copy on published assets.
- Refer/revise `Plans/00-QUALITY-BAR.md`, `docs/Lockedfiles/01-planner-current.md`, `docs/Lockedfiles/02-svg-pipeline-current.md`.
- Evidence: golden tests + run records required.
