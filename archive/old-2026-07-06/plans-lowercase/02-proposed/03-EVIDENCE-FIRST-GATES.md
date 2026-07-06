# 03 — Evidence-First Gates

Status: Start immediately after 02.
Owner: __________
Exit date: __________
Depends on: 02
[PARALLEL-OK with 04]

## Goal

Stop narrative progress. Every claimed pass must map to one evidence folder from one unchanged revision.

## Tasks

1. Add or standardize an evidence wrapper script for all gate commands.
2. For each gate command write:
   - `<cmd>-run.json`
   - `<cmd>-raw.log`
   - commit SHA
   - timestamp
3. Re-capture fresh evidence for:
   - typecheck,
   - lint,
   - unit tests,
   - integration tests,
   - planner E2E,
   - accessibility,
   - build.
4. Mark all older evidence folders as `STALE` unless re-run on the chosen baseline SHA.
5. Update `Failures.md` only from re-run results.

## Exit criteria

- A claimed pass without evidence is impossible in practice.
- Handover can only cite fresh evidence.
- One revision has a clean evidence tree, even if failures remain open.
