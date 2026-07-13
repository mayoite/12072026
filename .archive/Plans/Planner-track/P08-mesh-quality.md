# P08 — 3D mesh quality

**Status:** REPROVE · **CP:** CP-08

## Outcome

Cabinet-v0 reads as toe, carcass, and door in the live Three viewer.

## PASS gates

- Part names, order, size, and count match the saved option set.
- Mesh height and 2D footprint stay dimensionally true.
- Materials and lighting separate the parts without wireframe labels.
- 2D↔3D switching preserves identity and pose.
- Real WebGL screenshots pass at desktop and mobile sizes.

No photoreal claim. No R3F rewrite. No static designer GLB substitute.

**Evidence:** `results/planner/world-standard-wave/08-mesh-quality/`

**Next:** P09.
