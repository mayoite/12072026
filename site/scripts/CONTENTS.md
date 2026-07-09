# CLI scripts

## Why this folder exists

One-off and recurring maintenance: seed, migrations, catalog ingest, audits, recovery, doc generation.

## What is here

- TypeScript (.ts), Node (.mjs), Python (.py), shell deploy scripts
- generate-docs.mjs — CONTENTS.md + test inventory (+ optional coverage)
- `_audit-stale-scripts.mjs` — package/route/feature stale-script scan

## Rules

- Wire recurring tasks to package.json
- Write outputs to results/
- Prefer archive over delete for dead scripts

## Stale / archived scripts (2026-07-09)

- Sweep report: `../../results/site/scripts-audit/SCRIPTS-SWEEP-2026-07-09.md`
- Coverage map: `COVERAGE-SCRIPTS.md`
- Archives: `archive/site/scripts/2026-07-09-stale/`, `.../2026-07-09-coverage-legacy/`, `.../2026-07-09-scripts-sweep/`

## See also

- `../../DOC-MAP.md`

---
*Pointer updated 2026-07-09 scripts sweep. Full folder manifest via `generate-contents-md.mjs` / `docs:sync:all`.*
