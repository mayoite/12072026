# P01a — Dead-path cleanup

**Status:** OPEN · **Depends:** P01 inventory

## Outcome

Tracked code and tests stop importing removed Planner hosts.

## PASS gates

- No test targets `planner-2d-canvas`.
- No product import reaches `_archive`, `open3d`, or removed Fabric trees.
- Legacy URLs only redirect to `/planner/canvas/`.
- No second host, compatibility shell, or fake adapter is added.
- Layout, import-boundary, and targeted route tests pass.

Archive history. Do not delete owner data.

**Evidence:** `results/planner/world-standard-wave/00-dead-path-cleanup/`

**Next:** P02.
