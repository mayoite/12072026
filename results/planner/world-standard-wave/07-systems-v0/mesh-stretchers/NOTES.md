# Workstation mesh raise v2 — stretchers

**Date:** 2026-07-10  
**Pick:** **B** (product raise) — not A (03→04→05 re-sticker)  
**Gate prerequisite:** `gate:open3d` green on tip (prior phase)  

## Bar (this phase)

| Criterion | Result |
|-----------|--------|
| ≥2 named stretchers under linear desk | **PASS** |
| L-shape desk + return stretchers | **PASS** |
| Unique names; geometry under worktop | **PASS** |
| Legs non-reg | **PASS** |
| Photoreal / handles / Fabric | **Out of scope** |

## Implementation

- `workstationMeshV0.ts`: `stretchersForWorktopPrim` → `stretcher-{desk\|return}-front|back`
- Constants: `STRETCHER_SECTION_MM`, `STRETCHER_HEIGHT_FRAC`
- TDD: `workstationMeshV0.stretchers.test.ts` RED→GREEN
- Counts updated in mesh + legs + scene factory tests

## Evidence

- `vitest.log` — **35/35** pass (mesh + legs + stretchers + createSceneObjectFromNode)

## Residual (honest)

Still modular boxes — not photoreal. No handles/AO. Product ship **not** claimed. Next raise could be material hierarchy or visual smoke PNG.  
