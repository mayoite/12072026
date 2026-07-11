# A2 — SVG pipeline (raised bar)

> **Track:** A2 only · **Module:** `admin-svg-pipeline` (global-standard #3) · **Status:** OPEN

## Goal

Honest path from admin author → server compile → **`site/public/svg-catalog/{slug}.svg`** on disk, with census and publish ritual — not “~4 SVGs and hope.”

## Read first

1. [`docs/superpowers/plans/2026-07-10-global-standard-modules.md`](../../../../../docs/superpowers/plans/2026-07-10-global-standard-modules.md) — Task ritual + `admin-svg-pipeline` section
2. [`Plans/03-QUALITY-BAR.md`](../../../../03-QUALITY-BAR.md)
3. Locked contracts: [`docs/Lockedfiles/svg-pipeline/current.md`](../../../../../docs/Lockedfiles/svg-pipeline/current.md)
4. Research notes: [`../research/`](../research/) (SVG-ORA · svgedit). Canvas inventory lives under Planner [P05 research](../../../../Planner-track/phases/P05-symbols-svg/research/) when present.
5. History snapshots (do not edit): [`../supporting/from-plans1-admin-svg/`](../supporting/from-plans1-admin-svg/)

## Module workspace (create when executing)

```text
results/planner/global-standard-revision/modules/admin-svg-pipeline/
  README.md · BRAINSTORM.md · UI-EXPERT.md · SYNTHESIS.md · TASK-LIST.md · evidence/
```

## Key code

| Area | Path |
|------|------|
| Publish compile | `site/features/planner/asset-engine/svg/compileSvgForPublish.ts` |
| Stages | `site/features/planner/asset-engine/svg/runSvgCompileStages.ts` |
| CLI fixtures | `site/scripts/generate-svg.mjs` |
| Admin API | `site/app/api/admin/svg-editor/route.ts` |
| Editor UI | `site/features/planner/admin/svg-editor/` |

## Done when (module complete — not gate theater)

- SYNTHESIS lists raised PASS + OPEN residuals.
- Census of `svg-catalog/*.svg` with publish path per slug.
- Re-prove publish E2E after any pipeline change.
- Evidence only under `modules/admin-svg-pipeline/evidence/`.

**GATE PASS (A1) ≠ module complete (A2).**
