# 10 — Route Promotion to Guest and Canvas

Status: Last.
Owner: __________
Exit date: __________
Depends on: 03, 04, 05, 06, 07 complete on one unchanged revision

## Goal

Promote only after Open3D shell and SVG pilot are both proven on one revision.

## Tasks

1. Confirm 03 through 07 all pass on one commit SHA.
2. Re-run full gate bundle on that exact SHA.
3. Compare screenshots, saved docs, permissions, and bundle boundaries.
4. Promote shared shell and command layer to `/planner/guest` first.
5. Verify guest persistence boundaries and restrictions.
6. Promote to `/planner/canvas` only after guest passes.
7. Keep fallback routes through stabilization.

## Exit criteria

- Promotion is based on evidence, not confidence.
- Guest promotion is isolated from canvas promotion.
- Rollback remains route-scoped and reversible.
