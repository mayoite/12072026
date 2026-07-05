# CONSOLIDATED (see resolved-failures.md)

This part file was an intermediate slice from agent 3/8 during 8-agent parallel dispatch.
Content merged into resolved-failures.md on 2026-07-04.
Safe to delete this file.

### Live planner restore (PlannerErrorBoundary)

- Scope: `/planner/guest` compile failure after Phase 07 route swap / fabric archive.
- Root cause: `site/app/planner/layout.tsx` imports `@/features/planner/editor/PlannerErrorBoundary`; webpack resolved to missing `site/features/planner/editor/` (tsconfig alias to `_archive/fabric/editor` not applied by Next dev bundler).
- Correction: restored `site/features/planner/editor/PlannerErrorBoundary.tsx`; added `plannerArchiveAliases` to `site/config/build/next.config.js` webpack + turbopack `resolveAlias`.
- Verified: `results/planner/phase-01a/typecheck/` — `pnpm --filter oando-site run typecheck` exit 0.
- Verified: `results/planner/phase-01b/targeted-tests/` — 3 files, 13 tests exit 0.
- Verified: `results/planner/phase-01a/browser-guest/` and `phase-01b/browser-guest/` — manual desktop mount at `http://localhost:3000/planner/guest/`.
- Skipped: Playwright formal gate, coverage 95%, tablet matrix, perf/bundle, commit, push.

### Phase 07 Structure Mirror Retry

- Scope: OOPlanner gate fixes (three.js mocks, test typecheck) + `site/features/planner/open3d/` directory alignment with structure-mirror mapping.
- Verified: `results/planner/phase-07/structure-mirror-retry/tests/` — `npm test` exit 0; 26 files, 922 tests.
- Verified: `results/planner/phase-07/structure-mirror-retry/typecheck/` — OOPlanner `npm run typecheck` exit 0.
- Verified: `results/planner/phase-07/structure-mirror-retry/site-typecheck/` — `pnpm --filter oando-site run typecheck` exit 0.
- Correction: `threeViewerInner` mock (`vi.hoisted`, `__esModule`, scene child traverse); test-only catalog color/material field names; `persistence.test` fetch filter typing; `exportPhase06` door array widening; site open3d moves (`3d/`, `shared/export/`, `catalog/inventory/`, `catalog/svg/`, `shared/document/`, `lib/`, `model/actions/`) + import rewrites.
- Skipped: commit, push, OOPlanner delete, open3d-next-staging `src/` tree moves (tests-only parity fixes).

### Phase 04 Perf Budgets And Site open3d Sync (follow-up)

- Scope: Phase 04 perf budgets on `site/features/planner/open3d/`; port persistence tests; verify typecheck.
- Verified: `results/planner/phase-04/perf/` — 4 benchmark tests exit 0; permission gate p95 `0.001ms` (<1ms), member load p95 `0.022ms` (<500ms), member save p95 `0.011ms` (<2s), promotion save p95 `0.016ms` (<2s).
- Verified: `results/planner/phase-04/typecheck/` — `pnpm run typecheck` exit 0.
- Verified: `results/planner/phase-04/persistence-targeted/` — 6 files, 191 tests exit 0 on site paths under `site/tests/unit/features/planner/open3d/persistence/`.
- Sync: `TopBar` guest gating, `guestProjectRepository`, and command permission wiring already present in `site/features/planner/open3d/` (import-path-only deltas vs OOPlanner mirror).
- Skipped: build, commit, push, browser/route workflow.
