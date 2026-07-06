# Phase 1 — Baseline Evidence (Blocking)

## Purpose

**Blocking** for all later phases. No Phase 4b/7 threshold work without artifacts.

## Commands

Standard baseline logs → `site/results/baseline-*.log` (see prior phase file).

## Deliverables

| Artifact | Use |
|----------|-----|
| `baseline-eslint-taxonomy.json` | Bucket counts (P/A/M/U/T/S) summing to ~351 |
| `site/scripts/generate-eslint-taxonomy.mjs` | Regenerate from lint log |
| `baseline-hollow-tests.json` | Tags: api, marketing (~17), other |
| `phase07-planner-thresholds.json` | Baseline % + 5pp targets |
| `baseline-coverage-site-gaps.csv` | **All** sub-threshold site files |
| `baseline-playwright-skips.json` | Gate specs only |

Copy `plans/cross-pack-handshakes.template.json` → `site/results/cross-pack-handshakes.json`.

## Acceptance Checklist

- [x] All artifacts exist (`site/results/baseline-*`, `phase07-planner-thresholds.json`).
- [x] Taxonomy bucket sum matches lint log total (380 = 350 errors + 30 warnings).
- [x] **Blocking** gate for Phases 02–10.
