# Workstation mesh legs — GREEN evidence

**Date:** 2026-07-09  
**Checkout:** `D:\oando07072026`  
**Scope:** Verify + evidence for workstation mesh legs (systems v0). No photoreal claim.

## Primary suite (mesh + legs)

**Command:**
```text
cd site
pnpm exec vitest run tests/unit/features/planner/open3d/workstationMeshV0.test.ts tests/unit/features/planner/open3d/workstationMeshV0.legs.test.ts
```

| Metric | Result |
|--------|--------|
| Test files | **2 passed** / 2 |
| Tests | **15 passed** / 15 |
| Failures | **0** |
| Exit code | **0** |
| Duration | ~1.1s |

| File | Tests | Status |
|------|-------|--------|
| `workstationMeshV0.test.ts` | 8 | PASS |
| `workstationMeshV0.legs.test.ts` | 7 | PASS |

Full console: [`vitest-green.log`](./vitest-green.log)

## What legs do

Production: `site/features/planner/open3d/catalog/workstationMeshV0.ts`

- **`LEG_SECTION_MM = 50`** — square post cross-section (mm); tests allow 40–60mm band.
- **`LEG_INSET_MM = 40`** — inset from worktop plan edges toward leg centers.
- **4 posts per desk/return run** — corners under each desk or return plan prim.
- **Names:** `leg-desk-0..3` / `leg-return-0..3` (role stays parent module for save/rebuild).
- **Height:** `heightMm - WORKTOP_THICKNESS_MM` (floor → worktop bottom); center Y = half leg height.
- **Color:** metal-ish `#57534e` (distinct from worktop / pedestal role colors).
- Linear desk-only: 4 desk legs; L-shape desk+return: 4 + 4 = 8 leg parts (plus module slabs).

## Residual honesty (not photoreal)

- Still **boxy procedural boxes** (named BoxGeometry parts), not GLB furniture.
- No metal profiles, feet, stretchers, cable trays, or rounded edges.
- Leg posts are **readable modular markers** so worktops do not float — quality bar is systems-v0 mesh, not catalog product shot.
- Colors/roles are schematic, not PBR materials.

## Non-regression

**Command:**
```text
cd site
pnpm exec vitest run tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts tests/unit/features/planner/open3d/workstationPlacementV0.test.ts
```

| File | Tests | Status |
|------|-------|--------|
| `createSceneObjectFromNode.test.ts` | 11 | PASS |
| `workstationPlacementV0.test.ts` | 4 | PASS |
| **Total** | **15 passed** / 15 | exit **0** |

Full console: [`vitest-nonreg.log`](./vitest-nonreg.log)

### Non-reg fix (legs-related only)

First non-reg run failed **1** test:  
`createSceneObjectFromNode` → `workstation-v0 builds Group with multi-part role meshes and floor origin`  
expected child names `["desk","panel","pedestal"]` but received legs  
`leg-desk-0..3` as well.

**Fix:** Update expected names in  
`site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts`  
to include `leg-desk-0`…`leg-desk-3` (mirrors `countWorkstationV0Parts` + mesh plan).  
No production change for non-reg; production legs already correct (mesh suite green).

### Non-reg log snippet (after fix)
```text
 ✓ tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts (11 tests) 11ms
 ✓ tests/unit/features/planner/open3d/workstationPlacementV0.test.ts (4 tests) 11ms

 Test Files  2 passed (2)
      Tests  15 passed (15)
```

## Paths

| Artifact | Absolute path |
|----------|----------------|
| Evidence dir | `D:\oando07072026\results\planner\world-standard-wave\07-systems-v0\mesh-legs-green\` |
| Primary log | `...\mesh-legs-green\vitest-green.log` |
| Non-reg log | `...\mesh-legs-green\vitest-nonreg.log` |
| These notes | `...\mesh-legs-green\NOTES.md` |
| Production | `D:\oando07072026\site\features\planner\open3d\catalog\workstationMeshV0.ts` |
| Legs tests | `D:\oando07072026\site\tests\unit\features\planner\open3d\workstationMeshV0.legs.test.ts` |
| Mesh tests | `D:\oando07072026\site\tests\unit\features\planner\open3d\workstationMeshV0.test.ts` |
| Scene test (fixed) | `D:\oando07072026\site\tests\unit\features\planner\open3d\createSceneObjectFromNode.test.ts` |

## Verdict

**GREEN** — primary mesh/legs **15/15 pass**; non-reg **15/15 pass** after legs name expectation update.
