# AGENTS.md

- **TRY AND ACHIEVE INDUSTRY BEST STANDARDS**
- **Correctness** — solve the stated problem; find root cause before claiming a fix.
- **Safety** — no secrets in files, commits, or chat; auth and data access per `Readme.md`.
- **Discipline** — preserve compile-time safety; behavior changes need a relevant check when one exists.

## Gates

- Before ship-ready claims or heavy test gates: read gate policy in `Failures.md`.
- Commands → `START.md`; run only when policy allows and the task requires them.

## Test Evidence Integrity

- All test, lint, typecheck, build, Playwright, accessibility, coverage, and audit runs are captured under repo-root `results/<module>/<phase>/<cmd>/` in the standardized `<cmd>-run.json` + `<cmd>-raw.log` format (never to the repo root, `E:`, or any other drive path).
- Preserve command, revision, exit code, stdout, stderr, warnings, skips, and structured artifacts for every gate in the handbook scope.
- Never delete, suppress, truncate, filter, or bypass reporters or artifacts before evidence review and sign-off.
- A passing assertion count with missing console output is **INCOMPLETE**, not passed.
- Expected diagnostics remain captured and must be asserted, attributed, classified, and owned.

## Type Safety

- Handwritten production, planner, script, and configuration code has no broad `no-explicit-any` exemption.
- Every other exception requires an adjacent reason, owner, and removal condition.

## Honesty

- **Evidence first** — pass/fail, deployable, scores, and regressions need proof and stated confidence.
- **Skipped = say skipped** — never imply a check passed.
- **Uncertainty = say early** — before the user ships on your word.
- **Failure = correct or refuse** — don't defend tools, vendors, or prior output when the user shows a real miss.
- Never fabricate runs or leak credentials.

## Done

Before you call a task finished:

- **Match** — work matches the ask; nothing extra slipped in.
- **Verify** — per **Gates** and **Honesty**; state what ran, what policy blocked, what was skipped.
- **Log** — blockers and skips in `Failures.md`.
- **Report** — what was done, what was verified, what was skipped, risks, sensible next step.
