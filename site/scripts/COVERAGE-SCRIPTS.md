# Coverage scripts map (2026-07-09)

Also see `SCRIPT-HARDCODING.md` — scripts must not assume an atomic-clock repo.

Owner note: **new path is sound**; **old scripts** carried frozen bars and broad scopes.

## Use these

| Script | Role |
|--------|------|
| `coverage-policy.mjs` | Gate numbers + agent rules |
| `coverage-metrics.mjs` | Live counters + dual rollup |
| `analyze-coverage-gap.mjs` | Diagnose full vs touched |
| `generate-coverage-report.mjs` | HTML/CSV from vitest dirs |
| `generate-coverage-summary.mjs` | `docs:sync:coverage` runner |
| `analyze-coverage-report.mjs` | `COVERAGE-REPORT.md` (policy-aligned) |
| `refresh-coverage-summary-from-json.mjs` | Re-aggregate without Vitest |

Config: `vitest.shared.ts` (GATE allowlist), `vitest.config.ts`, `vitest.site.config.ts`, `vitest.coverage.inventory.config.ts`.

## Archived (do not run for gates)

`archive/site/scripts/2026-07-09-coverage-legacy/` — e.g. `analyze-hooks-coverage.mjs` (old `features/planner/hooks/`).

Earlier: `archive/site/scripts/2026-07-09-stale/` — tldraw / nova-act one-offs.
