# P04 — 2D and 3D continuity

**Status:** PASS · **CP:** CP-04

## Outcome

The same saved objects survive 2D, 3D, orbit, and return to 2D.

## PASS gates

- Three viewer reads the live project.
- Orbit controls work without mutating the project.
- IDs, positions, rotations, and counts remain unchanged.
- Loading and error states do not hide the return path.
- Unit and browser journeys pass.

**Evidence:** `results/planner/world-standard-wave/04-orbit-continuity/`

**Next:** P05.
