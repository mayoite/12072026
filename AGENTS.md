# AGENTS.md

## Overrides

- **Conduct only** — how you work in this repo. Which doc to open → `docs/Lockedfiles/ReadmeLocked.md`; repo facts → `Readme.md`; commands → `START.md`.
- **Supersedes** every other rule, skill, and default when they conflict — including the rest of this file. The user's current message wins.
- **Re-read** on every task, retry, or new instruction.
- **Unclear → ask.** Don't infer scope, batch size, or next steps; don't continue alone.

## Permission

- **Act on the ask** — do the reads, edits, and commands the current task requires; don't wait for per-step approval.
- **Stop when scope grows** — need more files, commands, or decisions than the message covers → ask first.
- **Read-only reviews** — review and analysis don't change files or run commands unless the user asked for fixes or runs.
- **Minimum necessary** — no extra files, refactors, or commands beyond what the task needs.

## Standards

- **Correctness** — solve the stated problem; find root cause before claiming a fix.
- **Safety** — no secrets in files, commits, or chat; auth and data access per `Readme.md`.
- **Discipline** — preserve compile-time safety; behavior changes need a relevant check when one exists.
- **Convention** — match surrounding code; read the owning doc (`Readme.md`, `TESTING.md`, etc.) before editing that layer.

## Gates

- Before ship-ready claims or heavy test gates: read gate policy in `Failures.md`.
- Commands → `START.md`; run only when policy allows and the task requires them.
- Test evidence and output integrity → `testing-handbook.md`.

## Test Evidence Integrity

All test, lint, typecheck, build, Playwright, accessibility, coverage, and audit runs are captured under repo-root `results/<module>/<phase>/<cmd>/` in the standardized `<cmd>-run.json` + `<cmd>-raw.log` format (never to the repo root, `E:`, or any other drive path).

- Preserve command, revision, exit code, stdout, stderr, warnings, skips, and structured artifacts for every gate in the handbook scope.
- Never delete, suppress, truncate, filter, or bypass reporters or artifacts before evidence review and sign-off.
- A passing assertion count with missing console output is **INCOMPLETE**, not passed.
- Expected diagnostics remain captured and must be asserted, attributed, classified, and owned.

## Type Safety

- Handwritten production, planner, script, and configuration code has no broad `no-explicit-any` exemption.
- Tests/mocks and generated, vendored, build, coverage, result, cache, and tool-output trees may be narrowly exempt as defined in `testing-handbook.md`.
- Every other exception requires an adjacent reason, owner, and removal condition.

## Honesty

- **Evidence first** — pass/fail, deployable, scores, and regressions need proof and stated confidence.
- **Proof order:** live check first, then status docs per `docs/Lockedfiles/ReadmeLocked.md` — don't trust stale notes over fresh evidence.
- **Skipped = say skipped** — never imply a check passed.
- **Uncertainty = say early** — before the user ships on your word.
- **Failure = correct or refuse** — don't defend tools, vendors, or prior output when the user shows a real miss.
- Never fabricate runs or leak credentials.

## Scope

- Smallest change that solves the task; archive over delete; archive/results/ historical evidence kept (no deletes from archive/); no silent unrelated fixes.
- No commit, push, publish, migrate apply, or destructive ops without ask.
- **Open3D planner:** production code lives in `site/features/planner/open3d/` (site deps). `OOPlanner/` and `open3d-next-staging/` are lab/archive mirrors — not separate pnpm workspace packages.

## Done

Before you call a task finished:

- **Match** — work matches the ask; nothing extra slipped in.
- **Verify** — per **Gates** and **Honesty**; state what ran, what policy blocked, what was skipped.
- **Log** — blockers and skips in `Failures.md`.
- **Report** — what was done, what was verified, what was skipped, risks, sensible next step.
