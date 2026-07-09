# Legacy coverage scripts (2026-07-09)

Archived because they assumed old trees / frozen bars.

| Script | Why archived |
|--------|----------------|
| analyze-hooks-coverage.mjs | Scans `features/planner/hooks/` only; pre-open3d; div0 risk if empty |

## Current (keep in site/scripts)

| Script | Role |
|--------|------|
| coverage-policy.mjs | Gate bars + agent readme |
| coverage-metrics.mjs | Live counters + dual rollup |
| analyze-coverage-gap.mjs | Dual rollup diagnostic |
| generate-coverage-report.mjs | HTML/CSV from vitest dirs |
| generate-coverage-summary.mjs | docs:sync:coverage runner |
| analyze-coverage-report.mjs | COVERAGE-REPORT.md (updated to policy) |
| refresh-coverage-summary-from-json.mjs | Re-aggregate without re-run |

Do not resurrect frozen totals or 90% full-monorepo chase.
