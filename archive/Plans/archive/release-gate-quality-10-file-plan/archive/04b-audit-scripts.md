# Phase 4b — Audit Scripts (Early)

## Purpose

Implement guard scripts **before** Phase 5 hollow remediation so progress is measurable.

## Scripts

| File | npm script |
|------|------------|
| `site/scripts/audit-hollow-tests.mjs` | `test:audit:hollow` |
| `site/scripts/audit-gate-skips.mjs` | `test:audit:gate-skips` |
| `site/scripts/audit-eslint-disable.mjs` | `test:audit:eslint-disable` |

### `test:audit:hollow`

Fails on: `expect(true).toBe(true)`, sole `toBeTruthy()`, zero `expect(` per case, empty `catch`.

CLI flag: `--exclude-marketing` optional legacy only — **gate uses full repo audit**.

### `test:audit:gate-skips`

Fails on `test.skip` / `describe.skip` in specs listed in `site/config/build/playwright-gate-specs.json` (create allowlist).

### `test:audit:eslint-disable`

Fails on `eslint-disable` under `site/` (archived paths in script config).

## Wire timing

- **Phase 4b:** scripts exist and run locally
- **Phase 9:** scripts added to `release:gate` and `release:gate:fast`

## Acceptance Checklist

- [x] All three scripts committed.
- [x] `pnpm run test:audit:hollow` exit 0 (full repo, post Phase 5/5b).
- [x] Gate spec allowlist JSON committed (`site/config/build/playwright-gate-specs.json`).
- [ ] Scripts wired into `release:gate:fast` **(required in Phase 09)**.
