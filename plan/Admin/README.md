# Admin track

## Outcome

Admin governs trusted inventory. Planner customers consume only published products, SVG revisions, families, and approved prices.

## Phases

1. `PHASE-01-authoring-quality.md` — SVG-first authoring, preview, deterministic publish.
2. `PHASE-02-catalog-lifecycle.md` — catalog contract, ingestion, DB publication, Planner handoff.
3. `PHASE-03-product-families.md` — configurable families, compatibility, 2D/3D/BOQ parity.
4. `PHASE-04-commercial-governance.md` — price books, approval, retirement, rollback, audit.

## Features

`FEATURES.md` maps each plan phase to code paths and known gaps. Reconciled against `site/` on 2026-07-14.

## Status

`CHECKLIST.md` records open acceptance work and browser proof only.

## Start gate

Step 0 test isolation runs before catalog-writing tests. See first section of `CHECKLIST.md`.

Only catalog-writing work waits. Read-only and isolated work continues.

## Blockers

| Gap | Blocks only |
|---|---|
| Failed test isolation | Catalog-writing tests |
| Disk-only publish | Live DB-SVG cutover proof |
| Missing external service | That service’s direct check |

## Interface authority

`../../docs/architecture/07-ADMIN-UI-BENCHMARK.md` — `ADM-*` acceptance IDs.

## Completion

Admin governs a configurable, priced, approved catalog. Planner consumes the same released product safely.
