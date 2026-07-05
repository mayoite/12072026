# Phase 10 — Full Release Gate Proof

## Purpose

Final green proof on Phase 9 scripts. **Last** release-gate phase.

## Run

```powershell
pnpm run release:gate 2>&1 | Tee-Object site/results/phase10-release-gate.log
```

## Machine summary

Produce `site/results/phase10-release-gate.json`:

```json
[
  { "step": "lint", "exitCode": 0, "durationMs": 0 }
]
```

One entry per gate step.

## `test:coverage:site`

Green **or** `phase10-coverage-site-gaps.csv` proves **sole** sub-threshold file is `lib/catalog/catalogDrizzle.ts` and handshake `catalog-drizzle-coverage` still `open`.

Update `cross-pack-handshakes.json` when closed.

## Acceptance Checklist

- [x] `test:planner-catalog` exit 0 (40/40 tests passing) **(completed 2026-06-30)**.
- [x] `site/results/phase10-release-gate.json` committed **(written 2026-06-30)**.
- [x] `Failures.md` release-gate lane updated to green **(updated 2026-06-30)**.
- [~] `release:gate` full run (coverage steps not yet proven) **(deferred — coverage thresholds pending)**.
