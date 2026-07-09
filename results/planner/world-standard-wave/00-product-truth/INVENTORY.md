# Product inventory — open3d (P01)

**Date:** 2026-07-09  
**Checkout:** `D:\OandO07072026` (main only, no worktrees)  
**Approach:** A  
**Scope:** Inventory only — code + existing evidence. Not a ship-quality claim.

## One-paragraph reality

A guest can open `/planner/guest` or `/planner/open3d`, draw walls on **FeasibilityCanvas**, place catalog furniture (including cabinet-v0 and workstation-v0 multiparts with legs), toggle 2D/3D with orbit ON by default, select/delete/undo with browser proof under `03-select-delete/`, and autosave **locally** (IDB) with honest local labels. Fabric full stage is **not** live; flag-gated furniture overlay default OFF. Cloud member save is not the default product path. Mesh is modular multiparts (box-group), not photoreal.

## Engine truth

| Layer | Live engine | Flag / archive / redirect |
|-------|-------------|---------------------------|
| 2D interim | FeasibilityCanvas (Canvas 2D) | `open3d/canvas-feasibility/FeasibilityCanvas.tsx` |
| 2D destination | Fabric.js v7 full stage | Flag path `canvas-fabric-stage/`; default OFF |
| 2D Fabric overlay | OFF unless `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1` | `fabricFurnitureFlag.ts` |
| 3D | Three + orbit default ON | `ThreeLazyViewer` / `ThreeViewerInner` / `orbitDefaults.ts` |
| Fabric URLs | Permanent redirect → open3d | `site/config/build/next.config.js` |
| Archive | `_archive/fabric/` | Not live pages |

## Host / routes

| Route | Page | Host |
|-------|------|------|
| `/planner/guest` | `(workspace)/guest/page.tsx` | `Open3dPlannerWorkspaceRoute` → `Open3dPlannerHost` |
| `/planner/canvas` | `(workspace)/canvas/page.tsx` | same |
| `/planner/open3d` | `open3d/page.tsx` | direct `Open3dPlannerHost` (no WorkspaceRoute) |

Chain: Host → `Open3dNativeHost` → `OOPlannerWorkspace` → FeasibilityCanvas / ThreeLazyViewer.

## Gate snapshot (W1–W8)

| Gate | Code | Unit | Browser | Blocker one-liner |
|------|------|------|---------|-------------------|
| W1 Draw | present | present | journey pack | door opening step residual if any |
| W2 Place | present | present | journey + systems | symbols quality separate CP-05 |
| W3 Select/delete | present | 30/30 + legs suite | PASS `03-select-delete/` | openings select stretch |
| W4 Orbit/continuity | orbit ON | unit green | **OPEN residual** e2e | browser place/count fail historically |
| W5 Save reload | IDB autosave | continuity unit | PASS save-reload | — |
| W6 Honesty | local labels | status unit | PASS | cloud not wired |
| W7 Mesh bar | cabinet-v0 multiparts | PASS `08-mesh-quality/` | visual smoke | not photoreal |
| W8 Shortcuts | map-driven | PASS | — | — |

## Evidence index

- Greps: `w1-draw-rg.txt` … `w8-shortcuts-rg.txt`, `host-wiring-rg.txt`, `fabric-flag-rg.txt`
- Matrix: `CAPABILITY-MATRIX.md`
- Claims: `CLAIMS-REGISTER.md`, `CONTRADICTIONS.md`
- Notes: `NOTE-FeasibilityCanvas.md`, `NOTE-OOPlannerWorkspace.md`, `NOTE-ThreeViewerInner.md`
- Coverage: `EVIDENCE-COVERAGE.md`
- Smoke: `vitest-capability-smoke-raw.log` (27/27 ok)
- Lightweight prior: `NOTES.md`

## Inputs for P02 engine lock

Freeze: Feasibility interim + Fabric destination + Three/orbit ON + no hybrid + flag OFF default. See `01-engine-lock/`.

## CP-01

- status: **pass**
- reviewer: agent (executing; evidence complete)
- date: 2026-07-09
- notes: Canonical INVENTORY + CONTRADICTIONS + greps + smoke; lightweight NOTES superseded as summary only
