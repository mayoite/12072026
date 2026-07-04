# Benchmark Corpus Index

Date: 2026-07-04

This folder is append-only by design. Do not edit benchmark reports in place; add a new dated report or correction note when evidence changes.

Cross-refs: `docs/superpowers/specs/2026-07-04-plannerplan-global-standard-revision-design.md` (approved design + structure note), `plans/archive/2026-07-04/benchmark.md` (plan-revision benchmark), `plans/archive/2026-07-04/critique.md`, `plannnerplan/critique/plan-revision-2026-07-04.md`, `plannnerplan/IMPLEMENTATION-DECISIONS.md`.

## Current structure (2026-07-04 Global Standard Revision)
- Revision docs (benchmark, critique, HANDOVER, idiothandver, follow-up) archived in `plans/archive/2026-07-04/` (finalized per plan; originals remain in plans/2026-07-04/ for transitional refs).
- Archive copies: `plans/archive/2026-07-04/` (see this archive/README.md).
- `plannnerplan/` retains: `phases/`, governance (`IMPLEMENTATION-DECISIONS.md`, `QUALITY-GATES.md`, `DESIGN-BENCHMARK-PROTOCOL.md`, `FAILURESPLAN.md`, `HANDOVER.md` stub), `critique/plan-revision-2026-07-04.md`, `benchmarks/` (local execution + this INDEX + plan-revision stub for history).
- `plannnerplan/plan/2026-07-04/` retained as move-stub (archive-over-delete; no active references).

## Governance and plan revision

- `phase-00-precheck.md` - baseline governance and precheck evidence.
- `plan-revision-2026-07-04.md` - **moved to plans/archive/2026-07-04/benchmark.md** (first plan-revision benchmark for the planner governance set; see plans/archive/2026-07-04/ for finalized location). Stub left here for git history.
- `REVIEW-WORKFLOW.md` - post-execution critic → QA → UI review sequence for plan revisions; each pass is independent.

## Archived stale plan files (per user request + AGENTS.md archive-over-delete)

The following imported OOFPLWeb advisory docs are archived/stale (references purged from active INDEX per stale-evidence policy and 2026-07-04 global standard revision). They are superseded by `plans/archive/2026-07-04/benchmark.md` and local execution benchmarks. Files remain physically in this `plannnerplan/benchmarks/` directory (no `stale/` subdir populated; archive-over-delete preferred over move/delete).

- 01a-benchmark.md, 01b-*.md, 03a-*.md series (pre-revision advisory docs, now stale).

See git log or directory contents for full traceability. No purge of files themselves.

## Local execution benchmarks

- `conversion-execution-benchmark.md` - conversion-plan execution benchmark.
- `phase-05-benchmark.md` - portal/public render benchmark.
- `phase-06-benchmark.md` - inventory and symbol-consumer benchmark.

## Stale plan files cleanup note
References to stale imported advisory docs purged from active INDEX as part of the global standard revision (see design spec). Files retained in `plannnerplan/benchmarks/` for traceability (not deleted, not moved to subdir). Updated per user request and AGENTS.md. See `docs/superpowers/specs/2026-07-04-plannerplan-global-standard-revision-design.md` for stale-evidence policy.

## Use rule

Treat these as advisory inputs for plan revision. Keep them dated, immutable, and traceable back to the source slice they support. All changes cross-linked to design, benchmark, and critique.
