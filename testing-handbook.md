# Testing handbook

## Truth

- A test is evidence only for the behavior it executes.
- A green unit test does not prove a browser workflow.
- Missing output, hidden skips, or suppressed errors make a run incomplete.
- Old result files do not prove current status.

## Isolation

- Tests use temporary data.
- Catalog tests copy fixtures outside canonical catalog paths.
- Cleanup runs in `finally`.
- Repeat runs must be idempotent.
- A failed test must not leave product files changed.
- Browser tests must not use forced clicks as a remedy.

## Result layout

Raw output belongs under:

```text
results/<track>/<run-id>/
  logs/
  reports/
  screenshots/
  traces/
```

Use `admin`, `planner`, `site`, or `tooling` as the track.

Use a UTC timestamp plus a short purpose as the run ID.

Do not write test output under `site/`.

Do not store PASS, done, or plan state in `results/`.

## Run record

Record:

- exact command and working directory;
- start and end time;
- exit code;
- selected scope;
- retries, skips, and timeouts;
- stdout and stderr paths;
- browser console and failed requests;
- screenshots or traces when relevant;
- dirty-worktree impact.

## Selection

- Run focused unit and integration tests while changing code.
- Run a focused browser journey for UI acceptance.
- Run typecheck and lint for affected packages.
- Run broad coverage and release gates only for their intended decision.

Record completion in the relevant track checklist.

Record active failures in `Failures.md`.
