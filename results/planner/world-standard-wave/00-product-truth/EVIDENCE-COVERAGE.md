# EVIDENCE-COVERAGE (P01)

| Concern | Unit test path(s) | results/planner/* | Covers W? | Gap |
|---------|-------------------|-------------------|-----------|-----|
| Keyboard delete/tools | open3dWorkspaceKeyboard.test.tsx | 09-shortcuts-chrome, 03-select-delete | W3 W8 | — |
| Feasibility draw | open3dFeasibilityCanvas.test.tsx | 02-browser-open3d-journey | W1 | — |
| Save continuity | saveReloadContinuity.test.ts | 06-save-honesty | W5 | — |
| Status honesty | workspaceStatusLabels.test.ts | 06-save-honesty | W6 | — |
| 3D viewer | threeViewerInner.test.tsx | 04-orbit-continuity unit | W4 partial | browser residual |
| Fabric flag | furnitureFabricMapper.test.ts | 01-engine-lock | P02 | — |
| Mesh cabinet | modularCabinetV0*.test.ts | 08-mesh-quality | W7 | — |
| Mesh workstation | workstationMeshV0*.test.ts | 07-systems-v0 | systems v0 | — |

Notes:

- `world-standard-wave/` now holds gate evidence folders (not research-only).
- Journey folder `02-browser-open3d-journey/` is CP-07 evidence (landed).
- Prior P0 dirs prove spines; not full buyer product.
