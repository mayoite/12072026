# 12 Handover

Goal: leave the next worker a true state.

## Required Content

Every handover must include:

1. Current branch and commit.
2. Dirty or clean state.
3. Files changed.
4. Commands run.
5. Exit codes.
6. Evidence paths.
7. Checks skipped.
8. Open risks.
9. Next smallest step.
10. Contradictions left open.
11. Refusals and deferrals.

## Evidence Index

Record each gate:

| Field | Required |
| --- | --- |
| Module | Module name |
| Phase | Phase file |
| Command | Exact command |
| Exit code | Numeric, skipped, or incomplete |
| Artifact | Path under `results/` |
| Status | Pass, fail, skipped, or incomplete |

## Do Not Say

1. "Fixed" unless the check passed.
2. "Clean" unless `git status` and relevant gates prove it.
3. "Deployable" unless build and release evidence prove it.
4. "Console clean" without browser console evidence.

## Stop Conditions

1. Evidence is incomplete.
2. Dirty files are unexplained.
3. Next step is not clear.
4. Contradictions are hidden.
