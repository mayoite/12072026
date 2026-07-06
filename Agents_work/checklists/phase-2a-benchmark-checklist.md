# Phase 2a Benchmark / Verification Checklist

**Status:** BLOCKED on agent host (2026-07-04)  
**Blocker:** `hostfxr.dll` load failure, HRESULT `0x80070005` — shell cannot execute any command.

Run these locally from repo root `D:\oandO04072026` when the shell works. Capture stdout+stderr into the paths below (per `testing-handbook.md`).

## Prerequisites

- Node/pnpm available
- `pnpm install` completed at repo root
- Do **not** set `VITEST_COVERAGE_RUN=1` for benchmark runs (benchmark describes are skipped under coverage)

## Gate 1 — Typecheck

```bash
pnpm --filter oando-site run typecheck
```

**Evidence:**
- `results/site/quality-remediation/phase-2/typecheck-raw.log`
- `results/site/quality-remediation/phase-2/typecheck-run.json` (update `exitCode`, timestamps, `status`)

**Pass:** exit code `0`

## Gate 2 — API unit tests (envelope migration slice)

```bash
pnpm --dir site exec vitest run tests/unit/app/api/
```

**Evidence:**
- `results/site/quality-remediation/phase-2/vitest-api-raw.log`
- `results/site/quality-remediation/phase-2/vitest-api-run.json`

**Pass:** exit code `0`; all tests in `site/tests/unit/app/api/` green

## Gate 3 — Planner open3d perf/benchmark (if applicable)

Benchmark tests confirmed in repo:

| File | Suite |
|------|-------|
| `tests/unit/features/planner/open3d/persistence/phase04Perf.test.ts` | Phase 04 persistence performance budgets |
| `tests/unit/features/planner/open3d/svgInventory.test.ts` | `large inventory benchmarks` |
| `tests/unit/features/planner/open3d/catalog.test.ts` | `large catalog performance` |

**Recommended command:**

```bash
pnpm --dir site exec vitest run tests/unit/features/planner/open3d -t "benchmark|perf|performance"
```

**Evidence:**
- `results/site/quality-remediation/phase-2/benchmark-raw.log`
- `results/site/quality-remediation/phase-2/benchmark-run.json`

**Pass:** exit code `0`; console `[phase-04-benchmark]` / `[phase-03a-benchmark-exceed]` lines within documented budgets

## Gate 4 — Update summary

After all three gates run, update:

- `results/site/quality-remediation/phase-2/phase-2a-summary.json` — set `overallStatus`, per-gate `exitCode`, `verdict`
- `Failures.md` — replace BLOCKED entry with verified/skipped per actual outcomes

## JSON run record template

```json
{
  "name": "<gate-name>",
  "module": "site",
  "phase": "quality-remediation/phase-2",
  "slice": "phase-2a",
  "command": "<exact command>",
  "cwd": "D:\\oandO04072026",
  "operator": "<your name>",
  "startUtc": "<ISO-8601>",
  "endUtc": "<ISO-8601>",
  "durationSec": 0,
  "exitCode": 0,
  "status": "PASS",
  "rawLog": "results/site/quality-remediation/phase-2/<gate>-raw.log"
}
```

## Sign-off criteria (testing-handbook)

- All commands on one unchanged revision
- Exit codes recorded in JSON + raw logs
- No suppressed output (`--silent`, `|| true`, etc.)
- Unexpected console warnings classified or fixed
- `Failures.md` updated with honest verified/skipped status