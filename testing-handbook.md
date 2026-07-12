# Testing Handbook

## Purpose

Tests are evidence only when their command, exit status, stdout, stderr, warnings, skips, and artifacts are preserved. A green assertion count with masked output is incomplete and must not be used for sign-off.

This handbook governs Vitest, Playwright, accessibility, lint, typecheck, build, coverage, and release-gate runs in this repository.

## Mandatory Run Record

Every gate run must record:

- exact command and working directory;
- revision, branch, and dirty-worktree state;
- operator, start/end timestamps, duration, and exit code;
- stdout and stderr log locations;
- structured result, console, trace, screenshot, and coverage artifact locations;
- skipped tests, filtered scope, retries, timeouts, and environment limitations;
- classification of every warning or expected diagnostic.

If any required record is missing, status is **INCOMPLETE**, not passed.

## Required Artifacts

All test, lint, typecheck, build, Playwright, accessibility, coverage, and audit runs land under repo-root `results/<module>/<phase>/<cmd>/` in the standardized `<cmd>-run.json` + `<cmd>-raw.log` format (never to the repo root, `E:`, or any other drive path).

Agent reports belong in `agents-work/reports/` (see `plan/README.md`). Raw run artifacts stay under `results/` only.

### Vitest

- Results: `results/tests/vitest-results.json`
- Site results: `results/tests/vitest-site-results.json`
- Console output: `results/tests/vitest-console.json`
- Site console output: `results/tests/vitest-site-console.json`
- Human reports: `results/tests/vitest-results.{csv,html}` and site equivalents
- Coverage: paths documented in `START.md`

Console artifacts must contain stdout and stderr with stream, test identity or task ID, timestamp, and content. CSV/HTML reports must expose console, stderr, and stdout counts.

### Playwright And Accessibility

- Retain raw JSON, HTML, traces, screenshots, videos, browser console, failed requests, web-server stdout, and web-server stderr.
- Navigation timeouts, intercepted clicks, browser errors, failed requests, and server errors are gate evidence.
- Forced clicks, disabled checks, hidden overlays, and unexplained timeout increases are not remedies.

### Visual screenshots (owner standing — 2026-07-09)

When testing the **planner** or **any site page** in a browser (manual, Playwright, or DevTools), **take a couple of PNG screenshots** and save them under the relevant evidence folder (e.g. `results/planner/.../` or `results/<module>/.../`). Prefer viewport captures of before/after or key states (home, guest setup, open3d 2D, open3d 3D). Screenshots are part of the run record — do not rely on text-only pass claims for UI work.

### Coverage — correct files + achievable bars (2026-07-09)

| Command | What is in the denominator | Bar |
|---------|----------------------------|-----|
| `test:coverage` | **Gate:** pure open3d catalog/model/lib + shared boq/export | **70/60/70/70** |
| `test:coverage:site` | Scoped site logic | **85/75/85/85** |
| `test:coverage:inventory` | Broad dark-product meter | **no threshold** |

**Out of the gate denominator:** `_archive` fabric, catalog **svg/** pipeline, scripts, public SVGs, giant UI shells (FeasibilityCanvas, OOPlannerWorkspace, …).

Do **not** thrash to hit 90% on inventory total. Per-file still truths a slice. Policy: `site/scripts/coverage-policy.mjs` · `vitest.shared.ts` · `Failures.md` § 0408.

### Static Gates

Lint, typecheck, build, secret lint, and audit commands must retain raw stdout/stderr and exit code. A timeout without an exit code is inconclusive.

## No-Delete And No-Bypass Rule

Never delete, truncate, suppress, filter out, or bypass test evidence before review and sign-off.

Prohibited examples:

- removing or disabling a console reporter;
- using `--silent` for a sign-off run;
- redirecting output to null without a structured artifact and retained raw log;
- mocking `console.error` or `console.warn` only to hide output;
- swallowing failures with `|| true`, unconditional catches, or forced exit code 0;
- removing assertions, tests, reporters, traces, screenshots, or coverage to obtain green status;
- cleaning artifacts after a run but before evidence review;
- treating skipped, timed-out, interrupted, or blocked checks as passed.

Cleaning is allowed only before a new run or after evidence has been reviewed and archived. Historical evidence under archive/results/ is kept (archive over delete; no removal of archived run logs).

## Expected Diagnostics

Some stderr is intentional, such as fallback, retry, and failure-path tests. It must still be captured.

An expected diagnostic is acceptable only when:

1. The test deliberately triggers the error path.
2. The behavior and diagnostic are asserted.
3. The artifact identifies the originating test.
4. The message is classified as expected with a reason and owner.
5. Unexpected messages still fail review.

React `act()` warnings, invalid DOM props/nesting, hydration errors, unhandled rejections, empty URLs, browser errors, and resource failures are actionable unless proven otherwise.

## TypeScript `any` Policy

`@typescript-eslint/no-explicit-any` is mandatory for handwritten production, planner, script, and configuration code.

- No broad production exemption is allowed.
- A temporary file exception requires an adjacent explanation, owner, reason, and removal condition.
- `features/planner/canvas-fabric/lib/helpers.ts` has no `any` and must not have a `no-explicit-any` exemption.
- Tests and `__mocks__` are exempt because they intentionally construct partial external/runtime shapes; the exemption must remain narrowly scoped.
- Generated, vendored, build, coverage, result, cache, and tool-output trees are exempt because they are not handwritten source.
- Generated database/client types are regenerated and are not manually edited.
- Scripts are not exempt; they use the separate script typecheck.

Replacing `any` with `unknown as T`, blanket assertions, non-null assertions, or disabled rules is not a repair.

## Warning Review

1. Group console entries by message and originating test.
2. Separate expected error-path diagnostics from actionable warnings.
3. Fix shared mock or runtime boundaries before editing many individual tests.
4. Rerun targeted tests and require zero unexpected console entries.
5. Rerun the full affected suite and preserve its console artifact.

Warnings are not ignored merely because tests pass.

## Background Runs

Background execution is allowed when:

- the process is hidden and identifiable;
- raw stdout/stderr are redirected to named files on `E:`;
- structured repository artifacts are still generated;
- process ID, command, and log paths are recorded;
- completion is checked by exit status, not elapsed time.

## Sign-Off

Sign-off requires:

- all required commands completed on one unchanged revision;
- exit codes and artifacts agree;
- no unexplained console output, skips, retries, or timeouts;
- all expected diagnostics are classified;
- no reporter, rule, test, or artifact was bypassed;
- missing `Failures.md` or another required policy file is disclosed as a blocker.

## Locking This Handbook

The live policy is `testing-handbook.md`. No frozen copy exists on this tree today.

Locking procedure:

1. Update the live file first.
2. Add or update the locked copy under `docs/Lockedfiles/` in the same change.
3. Update routing references in live and locked repository docs.
4. Run documentation and test-configuration checks.
5. Commit both copies together.
6. Protect these paths with CODEOWNERS and branch-protection review rules.

The Windows read-only attribute is not a durable Git lock. Until CODEOWNERS and branch protection exist, the locked copy is a procedural frozen snapshot.
