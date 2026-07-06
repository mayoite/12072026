# Phase 5b — Non-Marketing Hollow Tests

## Purpose

Clear hollow tests outside API and marketing suites.

## In scope

- `tests/unit/features/**`
- `tests/unit/lib/**`
- `tests/integration/**`
- `tests/unit/components/**` except `components/home/**`, `components/site/**`

## Out of scope

- `tests/unit/app/api/**` — Phase 5
- `tests/unit/app/(site)/**` — site-ui Phase 3 (~17 hollow marketing tests)

## Verification

```powershell
pnpm run test:audit:hollow -- --exclude-marketing
pnpm --filter oando-site run test
```

## Acceptance Checklist

- [x] `test:audit:hollow` exit 0 (no `--exclude-marketing`).
- [x] Marketing tests remediated (site-ui assertions in gate path).
- [x] Vitest green.
