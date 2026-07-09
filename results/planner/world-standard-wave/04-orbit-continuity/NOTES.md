# P04 / W4 — Orbit + pose continuity (serial land 2026-07-09)

## Goal
Orbit ON by default; 2D↔3D uses **document** as pose authority.

## Landed this session

| Item | Status | Evidence |
|------|--------|----------|
| Orbit defaults (prior) | Unit green | prior vitest logs |
| **Document ↔ scene pose continuity** | **Unit green** | `poseContinuityW4.test.ts` + `pose-continuity-vitest-raw.log` |
| Document rotation = degrees; scene nodes = radians | Asserted in continuity unit | matches `buildOpen3dSceneNodes` |
| **Guest /planner 500 (node:fs / NodeIO in client)** | **Fixed** | webpack client fallbacks; GLB validate server-only dynamic import |
| Browser e2e place → 3D orbit → 2D count | **Not green yet** | `open3d-w4-orbit-continuity.spec.ts` + `playwright-raw.log` — place click/count flaky (inventory/status intercept) |

## Honest residual (next session, same phase if continuing)

- Stabilize W4 Playwright: place path + `data-orbit-enabled` + 2D restore (use proven systems-v0 place helper patterns until green).
- Optional: left-drag orbit interaction (not required for this land).

## Commands (unit)

```
cd site
pnpm exec vitest run tests/unit/features/planner/open3d/poseContinuityW4.test.ts
# 1 passed
```

## Stop reason

Right stop: **real unit continuity + guest loadability fix** shipped. Browser residual not forced green with weak e2e thrash.
