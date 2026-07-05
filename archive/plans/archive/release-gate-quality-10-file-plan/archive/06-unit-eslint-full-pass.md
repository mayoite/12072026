# Phase 6 — ESLint Zero (Non-Assertion)

## Purpose

`pnpm --filter oando-site run lint` → **0 problems** (from ~351 baseline in Phase 1 taxonomy).

## Pre-pass (optional)

```powershell
pnpm --filter oando-site exec eslint -c config/build/eslint.config.mjs tests --fix --max-warnings=0
```

Safe rules only; review diff.

## Marketing tests

`tests/unit/app/(site)/**`: **imports and lint only** — no `expect(...)` edits.

PR diff rule: fail CI if release-gate PR changes `expect(` in those paths.

## Verification

```powershell
pnpm --filter oando-site run lint
pnpm --filter oando-site run typecheck
rg "eslint-disable" site/
```

## Acceptance Checklist

- [x] Lint 0 problems (2026-06-30).
- [x] Typecheck 0 (verified in gate run).
- [x] No assertion edits beyond hollow remediation scope.
- [x] `test:audit:eslint-disable` exit 0.
