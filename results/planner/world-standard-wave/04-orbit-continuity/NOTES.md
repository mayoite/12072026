# P04 unit pack seat — NOTES

**Date:** 2026-07-10  
**HEAD:** `382ab73f336cabdf9e76cad683d1a3b7fa1a47f8`  
**Seat:** unit orbit/pose re-prove only

## Results

| Pack | Log | Files | Tests | Exit |
|------|-----|-------|-------|------|
| Orbit (W4 core) | `unit-orbit-pack.log` | 3 | **9/9** | 0 |
| Pose + adapter | `unit-pose-pack.log` | 3 | **26/26** | 0 |

### Orbit pack files
- `orbitControlsDefault.test.tsx` — 6
- `poseContinuityW4.test.ts` — 1
- `workspaceOrbitWiring.test.ts` — 2

### Pose/adapter pack files
- `poseContinuityW4.test.ts` — 1 (also in orbit pack)
- `buildOpen3dSceneNodes.test.ts` — 11
- `createSceneObjectFromNode.test.ts` — 14

## Honesty

- **status: open** — unit green ≠ W4 overall PASS.
- Browser orbit/continuity gate not executed by this seat.
- First multi-file vitest invocation dropped `workspaceOrbitWiring` (2/3 files); re-ran with quoted paths → full **3/3 files, 9/9**.
