# 02 — Single Authority Execution Contract

Status: Required before feature work.
Owner: __________
Exit date: __________
Depends on: 01

## Goal

Shrink operational authority to one contract so implementation stops bouncing between START, HANDOVER, PHASE docs, revision docs, and Lockedfiles.

## Tasks

1. Create `plann/EXECUTION-CONTRACT.md`.
2. Put only these sections in it:
   - current route in scope,
   - frozen routes,
   - locked stack decisions,
   - current blockers,
   - exact execution order,
   - evidence rule.
3. Add a 2-line banner to these files pointing to the contract:
   - `plann/HANDOVER.md`
   - `plann/PHASE-1.md`
   - `plann/PHASE-2.md`
   - `plann/START.md`
4. Do not duplicate technical rationale there; link to implementation-decisions instead.
5. State clearly that `/planner/open3d` is the only active route until promotion gates pass.

## Exit criteria

- One execution contract exists.
- Handover and phase docs stop acting as competing action lists.
- Any engineer can tell what is live work in under 2 minutes.
