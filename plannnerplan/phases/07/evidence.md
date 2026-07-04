# Phase 07 Evidence

Date: 2026-07-03

## Entry Status

- Required predecessors: Phases 01-06 exit gates passed and promotion manifest created.
- **Route swap executed** per user directive (2026-07-03): Fabric stack archived; live `/planner/guest` and `/planner/canvas` wired to native Open3D host.
- Prior blockers (Phase 05/06 gates, promotion manifest) remain documented in `HANDOVER.md`; route swap proceeded on explicit user override with `test:planner` green prerequisite.

## What Ran

| Command | Exit | Evidence |
|---------|------|----------|
| `pnpm --filter oando-site run typecheck` | 0 | `results/planner/phase-07/route-swap/typecheck/` |
| `pnpm --filter oando-site run test:planner` | 0 | `results/planner/phase-07/route-swap/test-planner/` — 385 files, 2409 tests |

## Route swap summary

See `results/planner/phase-07/route-swap/route-table.md`.

- Live routes: `Open3dPlannerHost` → `open3d/ui/Open3dNativeHost` → `open3d/editor/OOPlannerWorkspace`.
- Fabric fallback: `/planner/fabric/guest`, `/planner/fabric/canvas` → `PlannerWorkspaceRoute` → archived Fabric under `_archive/fabric/`.
- `site/config/route-contract.json` updated with fabric fallback paths and notes.
- Import graph proof: `site/features/planner/open3d/cleanup/importGraphProof.ts`.

## Structure mirror (prior slice)

- `plannnerplan/phases/07/structure-mirror.md` — OOPlanner ↔ site folder alignment.
- Evidence: `results/planner/phase-07/structure-mirror/`

## Open3D tests migrate (prerequisite)

- `results/planner/phase-07/open3d-tests-migrate/` — 2408 tests green before route swap.

## Skipped

- Playwright/browser guest/member workflow checks (not in scope this slice).
- Feature-flag cohort activation (explicit `/planner/fabric/*` fallback routes used instead).
- Commit, push.

## Corrections this slice

- Test fixes: `plannerAutosaveIdentity` mocks `Open3dPlannerHost`; `planner-ui-PlannerWorkspaceRoute` hoisted mocks; `planner-catalog-exports` mocks `getCatalog` to avoid timeout.
- `PlannerWorkspaceRoute` uses `@/` import for `PlannerCanvasEnhancements` (fabric fallback only).
- `tsconfig.json` barrel alias `@/features/planner/editor` → archive.
