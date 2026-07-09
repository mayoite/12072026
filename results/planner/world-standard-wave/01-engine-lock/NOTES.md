# P02 — Engine lock (lightweight)

**Date:** 2026-07-09  
**Checkout:** `D:\OandO07072026` (main only)  
**HEAD at write:** `6461924b064819e71833ad6a470436a5a2b7c15f`  
**Approach:** **A** — ship W1–W8 on FeasibilityCanvas + document model first; Fabric v7 full stage remains 2D **destination** (not abandoned).  
**Unlock:** Implementation unlock already recorded in `Plans/trustdata/00-START.md` (2026-07-09).  
**Scope:** Evidence only. No package churn. No product feature edits. No dual-home thrash.

Package pins: [PACKAGE-PIN.md](./PACKAGE-PIN.md).

---

## Locked stack (binding)

| Layer | Choice | Live today? | Entry |
|-------|--------|-------------|--------|
| 2D **destination** | Fabric.js v7 full stage | Furniture overlay only, flag **OFF** | `fabric@7.4.0` · `open3d/canvas-fabric-stage/` |
| 2D **interim** | FeasibilityCanvas (Canvas 2D) | **Yes** — sole interactive 2D | `open3d/canvas-feasibility/FeasibilityCanvas.tsx` |
| 3D planner | Three + orbit **ON** default | **Yes** | `three@^0.185.1` · `ThreeLazyViewer` / `ThreeViewerInner` · `orbitDefaults.ts` |
| Hybrid | **Forbidden** | No Konva+Fabric dual interactive | Fail-forward: Konva **full** only if Fabric spike fails with evidence — still no hybrid |
| Admin single-asset | `@google/model-viewer` | Admin SVG preview only | not planner workspace engine |

---

## Flag (Fabric furniture only)

| Item | Value |
|------|--------|
| Env | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` |
| Enable rule | exact `"1"` only |
| File | `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` |
| Consumer | `OOPlannerWorkspace.tsx` — when ON, mounts `FurnitureFabricLayer` over Feasibility; Feasibility still owns walls/draw |

`site/features/planner/lib/featureFlags.ts` is **not** the Fabric engine switch.

---

## Host / engines (no thrash)

```
Document (UUID, mm)
  ├── 2D live: FeasibilityCanvas
  ├── 2D flag: FurnitureFabricLayer (migration spike; default OFF)
  ├── 2D dest: Fabric full stage (Phase 2B later; archive at _archive/fabric/)
  └── 3D: Lazy3DViewer → ThreeViewerInner (OrbitControls when enableControls true)
```

Routes (all end in same workspace engines):

- `/planner/open3d` → `Open3dPlannerHost` → … → `OOPlannerWorkspace`  
- `/planner/guest` | `/planner/canvas` → `Open3dPlannerWorkspaceRoute` → same host chain  
- `/planner/fabric*` → permanent redirect to `/planner/open3d/` (not a live Fabric product path)

---

## Anti-thrash (short)

1. Do not re-open engine choice in P03+.  
2. One interactive 2D product path at a time; flag-ON Fabric furniture is spike, not dual-CAD forever.  
3. Archive ≠ live. Never re-wire guest/canvas to `_archive/fabric`.  
4. Fabric is destination, not “insurance.”  
5. Orbit ON is the 3D nav model; do not hard-off to green flaky tests.  
6. model-viewer stays admin-only.  
7. No competitor assets into `site/`. Success metric: BOQ/quote path > photoreal thrash.  
8. Pins recorded in PACKAGE-PIN — do not upgrade engines in this phase.

---

## Honest status

Engines **confirmed in writing** for Approach A: Feasibility interim + Fabric destination + Three/orbit. Fabric not fully cut over (expected). Flag OFF (expected). Full CP-02 owner checkbox pack / vitest re-run pack can land later under this folder; this NOTES + PACKAGE-PIN freeze identity so agents stop thrashing.

**Next product gate after lock:** P03 select/delete (W3) — not engine rework.
