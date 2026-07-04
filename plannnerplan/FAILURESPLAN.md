# Planner Failures Plan

Date: 2026-07-03  
Authority: `plannnerplan/00-start.md` required reading #3

## Purpose

Records plan-specific failures, blockers, skips, incomplete evidence, ownership, and resolution history for the Open3D-to-Next.js planner replacement.

## Live failure log

The authoritative running log is repo-root **`Failures.md`**. Update it after every material checkpoint per `AGENTS.md`.

## Status vocabulary

Use only: Planned, Implemented, Verified in staging, Promoted, Verified in production path, Piloted, Accepted, Deferred/blocked — per `IMPLEMENTATION-DECISIONS.md`.

## Active failure IDs

| ID | Summary | Phase | Owner | Status |
|---|---|---|---|---|
| PLAN-FAIL-015 | Schema validation for safeRead | 03 | Catalog agent | Open |
| PLAN-FAIL-016 | Placement ID collision risk | 03 | Catalog agent | Open |
| PLAN-FAIL-017 | generatedAt hardcoded to 0 | 03A | SVG agent | Open |
| PLAN-FAIL-018 | Missing tests: fixture gallery, 10K perf, batch placement, dimension filter | 03A | Test agent | Open |
| PLAN-FAIL-003 | Playwright verification | 01B | — | Deferred → Phase 05 |
| PLAN-FAIL-004 | Phase 03A targeted checks | 03A | — | Deferred → Phase 05 |

## Cross-phase blockers (2026-07-03)

- **Coverage floor (90%)** — OOPlanner global coverage ~58%; hard floor not met. Evidence: `results/planner/phase-05/ooplanner-coverage-retry-2/`, `Failures.md`.
- **Phase 05 acceptance** — browser/visual/workflow gates missing. Evidence: `plannnerplan/phases/05/evidence.md`.
- **Phase 06/07** — Phase 06 in progress; Phase 07 blocked on promotion manifest.
- **FAILURES-HISTORY.md / FAILURES-CURRENT.md** — referenced in `Failures.md` but not yet created; this file is the interim plan failure index.

## Evidence integrity

All gate runs must preserve artifacts under `results/<module>/<phase>/<cmd>/` per `testing-handbook.md`. Skipped, blocked, or artifact-missing checks are not passes.
