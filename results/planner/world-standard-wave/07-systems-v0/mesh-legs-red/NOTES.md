# Mesh legs RED — workstation modular posts

**Date:** 2026-07-09  
**Scope:** TDD RED only — no production changes to `workstationMeshV0.ts`.  
**Test file:** `site/tests/unit/features/planner/open3d/workstationMeshV0.legs.test.ts`  
**Log:** `vitest-red.log`

## Result

| Metric | Value |
|--------|--------|
| Files | 1 failed |
| Tests | **7 failed / 7** |
| Failure mode | Missing feature (`leg*` parts length **0**, expected ≥ 4) |
| Import/typo errors | None |

## Fail summary (all: no legs in plan)

1. **linear desk+pedestal plan includes named leg parts** — `expected 0 to be >= 4` (message: named leg parts under desk e.g. leg-desk-0..3)
2. **leg height equals heightMm - WORKTOP_THICKNESS_MM** — `expected 0 to be >= 4`
3. **leg cross-section 40–60mm** — `expected 0 to be >= 4`
4. **legs sit under desk (leg top ≈ worktop bottom)** — `expected 0 to be >= 4`
5. **L-shape more legs than linear** — `linearLegs.length expected 0 >= 4`
6. **mesh children unique + include legs** — `legNames.length expected 0 >= 4`
7. **non-leg modules keep roles/names + legs exist** — roles/names of modules would hold; fails on `legs.length expected 0 >= 4`

## Intent for GREEN (not done here)

- Add named leg parts under desk/return (e.g. `leg-desk-0..3`, `leg-return-*`)
- Height ≈ `heightMm - WORKTOP_THICKNESS_MM`; section ~40–60mm; top under worktop bottom
- L-shape: more legs than linear desk-only; unique `mesh.name` across children
- Keep non-leg part names/roles: desk, return, pedestal, panel, overhead

## Command

```text
pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d/workstationMeshV0.legs.test.ts
```
