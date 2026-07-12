# P04 / CP-04 W4 — NOTES

**When:** 2026-07-12  
**Call:** agent execute (owner: P04 is agent call)

## Unit

| Pack | Result |
|------|--------|
| poseContinuityW4 | green — document ids/mm/rotation; scene radians |
| orbitControlsDefault | green — enableControls true |
| workspaceOrbitWiring | green — Lazy3DViewer spreads control props |

## Browser

| Proof | Result |
|-------|--------|
| place 4 seats → 3D orbit ON → 2D same **id set** | green (`open3d-w4-orbit-continuity.spec.ts`) |
| `browser-run.json` + PNGs | under this folder |
| Not claimed in browser | live Three mesh userData / mm live assert (unit covers document↔nodes) |

## Verdict

Unit + browser green this session. CP-04 **PASS** (agent call / owner delegated).
