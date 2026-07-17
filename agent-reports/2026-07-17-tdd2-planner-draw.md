# TDD-2 — Planner draw geometry

**Date:** 2026-07-17 · RED→GREEN pure geometry for P4

## Behaviors (RED / GREEN)

| Behavior | RED | GREEN |
|----------|-----|-------|
| `wallEndpointsAfterGripMove` | FAIL (missing) | PASS |
| Grip meta kind/endpoint/id edges | PASS | PASS |
| Selection null/missing → no grips | PASS | PASS |
| Exact clamp 530/3470/midpoint | PASS | PASS |
| Overlap exact `OPENING_GAP_MM` | PASS | PASS |
| excludeId collect + re-place | PASS | PASS |
| Non-finite width → wall-too-short | PASS | PASS |
| Scrambled room wall corners | PASS | PASS |
| Dim chain empty / zero-width open | PASS | PASS |
| Reposition missing / end clamp | PASS | PASS |

## Code

- New: `wallEndpointsAfterGripMove` in `wallEndpointGrips.ts` (+ barrel)
- Tests: canvas grips, openingPlacement, roomOutline, dimensions, openings actions

## Exits (all 0)

- geometry + canvas: **36 files / 228 tests**
- openings actions: **8 tests**
- `pnpm run check:layout` OK

## Residual OPEN

Browser grip reshape + opening drag. Unit ≠ acceptance.
