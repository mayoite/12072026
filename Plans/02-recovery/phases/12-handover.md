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

## Do Not Say

1. "Fixed" unless the check passed.
2. "Clean" unless `git status` and relevant gates prove it.
3. "Deployable" unless build and release evidence prove it.
4. "Console clean" without browser console evidence.

## Stop Conditions

1. Evidence is incomplete.
2. Dirty files are unexplained.
3. Next step is not clear.
