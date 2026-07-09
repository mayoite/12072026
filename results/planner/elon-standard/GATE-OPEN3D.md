# GATE-OPEN3D — Elon standard

**Status: PASS**

| Field | Value |
|-------|--------|
| When | 2026-07-09T17:27:39.402Z → 2026-07-09T17:28:41.512Z |
| Command | `$env:PLAYWRIGHT_BASE_URL='http://localhost:3000'; cd site; node scripts/run-open3d-world-e2e.mjs` |
| Base URL | `http://localhost:3000` |
| Exit code | **0** |
| run.json status | **PASS** |
| Workers | 1 |
| Duration | 57.7s (Playwright) |

## Evidence

- `results/planner/world-standard-wave/gate-e2e/run.json` — `status: "PASS"`, `exitCode: 0`
- `results/planner/world-standard-wave/gate-e2e/playwright-raw.log`

## Specs (5/5 passed)

| # | Spec | Result | Time |
|---|------|--------|------|
| 1 | `tests/e2e/open3d-save-honesty.spec.ts` — place furniture, save, hard reload restores furniture count | ✓ | 23.0s |
| 2 | `tests/e2e/open3d-systems-v0-batch-place.spec.ts` — Place 4 seats from configurator → furniture +4 | ✓ | 4.4s |
| 3 | `tests/e2e/open3d-w3-select-delete.spec.ts` — place, select, Delete removes, Ctrl+Z restores | ✓ | 5.0s |
| 4 | `tests/e2e/open3d-w4-orbit-continuity.spec.ts` — place → 3D orbit attr → 2D same count | ✓ | 7.4s |
| 5 | `tests/e2e/open3d-world-standard-journey.spec.ts` — guest enter → draw wall → place ≥2 catalog → 2D/3D | ✓ | 15.8s |

**Summary: 5 passed (57.7s)**

## Fixes

None required. Gate green on first run this session.
