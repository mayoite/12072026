# Coverage scripts — honesty (2026-07-09)

Owner read the coverage tooling and doubted it. Audit found **real bugs**, not just stale labels.

## What was wrong

| Script | Issue | Severity |
|--------|--------|----------|
| `analyze-coverage-gap.mjs` | Hardcoded **19924** / **12034** stmt denominators from an old run | **Misleading % share** |
| same | Only scanned `tests/*.test.ts` top-level (~3 files) while suite is `tests/**` (~500+) | **Broken test-target analysis** |
| same | Froze “70 files / 477 tests” and **tldraw UI** wording | Stale narrative |
| `analyze-coverage-report.mjs` | `PLANNER_BUCKETS` still listed **tldraw** | Cosmetic / wrong map |
| `generate-coverage-summary.mjs` | `isSiteScopeFile` inverted-if hard to read; prefix match fragile | Correctness risk |
| Gates | **PLAN-FAIL-0408** still open — no live 90% proof | Process truth |

## What is actually correct

- `vitest.config.ts` force-`include`s planner/lib/app api so **untested files count as 0%** — intentional honesty (not a bug).
- Playwright does **not** feed V8 coverage — journeys can be green while coverage % stays low.
- `test:coverage` / `generate-coverage-report.mjs` report generation path is fine; the **gap analyzer** was the liar.

## Fixes landed

- `analyze-coverage-gap.mjs` rewritten: live totals, recursive tests, open3d-era root causes.
- `analyze-coverage-report.mjs` bucket list → open3d / editor / asset-engine …
- `generate-coverage-summary.mjs` `isSiteScopeFile` clarified.

## How to use

```bash
# Gate-ish (slow): full coverage
pnpm run test:coverage

# Diagnose why % is low (after coverage-final.json exists)
node scripts/analyze-coverage-gap.mjs
```

Do **not** treat gap script output as a pass/fail gate. Gate remains `Failures.md` **PLAN-FAIL-0408**.
