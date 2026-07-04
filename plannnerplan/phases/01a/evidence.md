# 01A Evidence

Date: 2026-07-03  
Status: **PARTIAL**

## Verified (2026-07-03 retry)

- Donor is Svelte 5/Three.js with MIT license.
- Production Open3D code lives in `site/features/planner/open3d/`; live routes `/planner/guest` and `/planner/canvas` mount **Fabric** `PlannerWorkspaceRoute` (Phase 07 rollback until Phase 05 MET).
- `/planner/open3d` mounts native `Open3dPlannerHost` (pilot only).
- `pnpm --filter oando-site run typecheck` exit 0 — `results/planner/phase-01a/typecheck/`.
- Browser: `/planner/guest/` renders Fabric workspace — prior Open3D guest evidence superseded by route rollback (`HANDOVER.md`).
- Canonical theme tokens consumed from `site/app/css/core/planner/open3d.css` and workspace bundle.
- Unit choices (`mm`, `cm`, `m`, `in`, `ft-in`) implemented in open3d model layer.

## Blocking / open failures

1. Global/per-file 95% coverage not met (repo-wide planner coverage ~57–59% per prior runs).
2. OOPlanner lab mirror still has separate quality debt; 01A originally targeted OOPlanner isolation.
3. Full build, lint, accessibility, and Playwright workflow gates not re-run in this slice.
4. `npm ci` moderate vulnerability count not re-audited.

## Evidence paths

- Typecheck: `results/planner/phase-01a/typecheck/typecheck-run.json` + `typecheck-raw.log`
- Browser guest: `results/planner/phase-01a/browser-guest/browser-run.json`
- Prior baseline: `results/planner/phase-01a/staging-browser/` (OOPlanner staging, pre route-swap)

## Verdict

**PARTIAL** — live planner functional again; baseline and type safety on site path verified; coverage and formal workflow gates remain open.
