# Phase 05 Evidence

Date: 2026-07-03

## Entry Status

- Phase 04 repository/auth contracts: not verified in this run.
- Design benchmark: `phases/05/benchmark.md` read.
- Phase 03A contracts: copied-forward slices tested, but Phase 03A exit remains open.
- Status: staged only; not accepted.

## Copy Target

- Plan revised so reviewed slices are copied into `OOPlanner/` as work proceeds.
- `site/features/planner/open3d/` remains later production promotion only.
- Copied 14 files from `open3d-next-staging/` into `OOPlanner/`.
- Hash check: all copied files matched immediately after copy.

## What Ran

- `OOPlanner/`: `npm test -- tests/catalog.test.ts tests/svgInventory.test.ts tests/persistence.test.ts tests/feasibility.test.ts`
  - Evidence: `results/planner/phase-05/ooplanner-copy-targeted/`
  - Result: pass, 4 files, 312 tests.
- `OOPlanner/`: `npm run typecheck`
  - Evidence: `results/planner/phase-05/ooplanner-typecheck/`
  - Result: fail, `importFromJson` missing import.
- `OOPlanner/`: `npm run typecheck` retry
  - Evidence: `results/planner/phase-05/ooplanner-typecheck-retry-1/`
  - Result: pass.
- `OOPlanner/`: `npm run test:coverage -- --coverage.reportsDirectory ../results/planner/phase-05/ooplanner-coverage/coverage`
  - Evidence: `results/planner/phase-05/ooplanner-coverage/`
  - Result: fail, 2 stale test assertions.
- `OOPlanner/`: coverage retry 1
  - Evidence: `results/planner/phase-05/ooplanner-coverage-retry-1/`
  - Result: fail, 1 stale command-contract assertion.
- `OOPlanner/`: coverage retry 2
  - Evidence: `results/planner/phase-05/ooplanner-coverage-retry-2/`
  - Result: tests pass, coverage fails thresholds.
- `OOPlanner/`: `npm test -- tests/ui.test.tsx tests/doorWindowPlacement.test.ts tests/roomElements.test.ts tests/modelOperations.test.ts tests/domain.test.ts`
  - Evidence: `results/planner/phase-05/ooplanner-canvas-check/`
  - Result: pass, 5 files, 119 tests.

## Verified

- Copied target and staging files hash-match for the current copied slice.
- Targeted `OOPlanner/` tests pass: 312/312.
- `OOPlanner/` typecheck passes after the import fix.
- Full coverage test execution passes assertions: 943/943.
- FeasibilityCanvas/model targeted check passes: 119/119.
- Covered by the canvas check: route host mount, toolbar and keyboard commands, wall draw/preview/cancel/undo, pointer capture, pan, zoom, snapping bypass, door/window placement hooks, room element hooks, wall/furniture/opening/group/history/unit operations.

## Failed

- Coverage gate fails: statements 58.14%, branches 57.52%, functions 59.69%, lines 57.68%.
- This is below the 90% hard floor and 95% target.
- Phase 05 is not accepted because browser/visual/workflow/build/accessibility evidence is still missing.
- Prior "canvas not verified" wording is corrected: the FeasibilityCanvas/model-action slice is implemented and target-tested, but not browser-verified.
- `WorkspaceShell` and `useWorkspaceCanvas` still need direct coverage and acceptance evidence.

## Skipped

- Browser/Playwright visual interaction checks.
- Build.
- Production-path promotion.
- Commit, push, publish, migrations, destructive cleanup.

## Risks

- Phase 05 plan still needs live UI/browser evidence before workspace claims are accepted.
- Large workspace components in `OOPlanner/src/components/workspace/` have little or no coverage.
- Prior Phase 05 completion claims are superseded by this evidence.
