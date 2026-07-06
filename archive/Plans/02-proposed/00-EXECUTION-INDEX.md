# 00 — Execution Index

Status: Proposed execution authority.
Purpose: Replace scattered operational instructions with one ordered plan set.
Read order: 00 -> 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 08 -> 09.

## What these files replace

- `plann/HANDOVER.md` as the day-to-day action queue.
- `plann/PHASE-1.md` as the active execution checklist for Open3D shell and SVG pilot work.
- `plann/PHASE-2.md` for route-promotion sequencing and descriptor clean-up timing.
- `plans/2026-07-05_phase1-execution/quality-gates.md` as the active enforcement sequence.
- `plans/2026-07-05_phase1-execution/plan-*` files as separate fragmented execution notes.

## What stays authoritative but reference-only

- `PACKAGES.md` for dependency decisions.
- `plans/2026-07-05_phase1-execution/implementation-decisions.md` for technical rationale.
- `AGENTS.md`, `Failures.md`, `testing-handbook.md` for conduct and evidence policy.

## Operating rule

Do not start a later file before the earlier file's exit criteria are met, except where a file says `[PARALLEL-OK]`.
