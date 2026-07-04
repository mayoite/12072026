# Phase 04 Evidence

Date: 2026-07-03

## Scope

Guest/member/admin auth and persistence contracts in `open3d-next-staging/` with mirror validation in `OOPlanner/`. Site planner APIs (`plannerCloudApi.ts`, `plannerSaves.ts`, `plannerPermissions.ts`, `route-contract.json`) remain read-only per phase governance.

## Verified

| Command | CWD | Exit | Evidence |
|---|---|---|---|
| `npm test -- tests/permissions.test.ts tests/persistence.test.ts tests/persistenceErrors.test.ts tests/memberPlanRepository.test.ts tests/guestPromotion.test.ts tests/topBarGuest.test.tsx` | `open3d-next-staging/` | 0 | `results/planner/phase-04/staging-targeted-retry-2/` — 6 files, 189 tests |
| `npm run typecheck` | `open3d-next-staging/` | 0 | `results/planner/phase-04/staging-typecheck/` |
| Phase-scoped persistence coverage (see include list below) | `open3d-next-staging/` | 0 | `results/planner/phase-04/staging-persistence-coverage-final/` — stmts 98.75%, branches 97.54%, funcs 100%, lines 100% |
| Same targeted test bundle | `OOPlanner/` | 0 | `results/planner/phase-04/ooplanner-targeted-retry-3/` — 6 files, 191 tests |
| Phase-scoped persistence coverage (`src/lib/commands/*` includes) | `OOPlanner/` | 0 | `results/planner/phase-04/ooplanner-persistence-coverage-final/` — stmts 98.75%, branches 97.54%, funcs 100%, lines 100% |

Phase-scoped coverage include list:

- `src/persistence/**`
- `src/commands/permission.ts` and `src/commands/plannerAccessContext.ts` (staging)
- `src/lib/commands/permission.ts` and `src/lib/commands/plannerAccessContext.ts` (OOPlanner)

## Fixes applied this run

- `open3d-next-staging/tests/persistence.test.ts` — guest `/api/plans` isolation fixture; guest repository corruption branch coverage.
- `open3d-next-staging/tests/guestPromotion.test.ts` — `forbidden` and default network-message branches.
- `open3d-next-staging/tests/topBarGuest.test.tsx` — guest UI hides Import/Export.
- `open3d-next-staging/src/components/workspace/TopBar.tsx` — `accessContext` gate for persist/import/export actions.
- `open3d-next-staging/src/components/workspace/WorkspaceShell.tsx` — passes `accessContext` to TopBar.
- `OOPlanner/` — mirrored persistence tests, TopBar guest gate (`src/editor/TopBar.tsx`), commands sync (`src/lib/commands/*`).

## Open / deferred

- Repo-wide OOPlanner coverage (~57–59%) remains below the 90% hard floor; Phase 04 acceptance uses **phase-scoped persistence coverage** only.
- Background image payload handling (04-SCHEMA-02) is **decided deferred to Phase 05** (decision log entry in `04-guest-member-admin-auth-and-persistence.md`).
- Performance budgets (save/load p95, permission gate <1ms) not benchmarked this run.
- Full persistence UX (dialogs, toasts, promotion trigger) remains Phase 05.
- Browser/route workflow gates deferred per `QUALITY-GATES.md` Phase 04 table.

## Skipped

- Playwright/browser, build, site integration, commit, push.
