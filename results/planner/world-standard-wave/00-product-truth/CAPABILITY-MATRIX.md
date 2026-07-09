# CAPABILITY-MATRIX — W1–W8 code surface (P01)

Status tokens: `code-present`, `code-partial`, `unit-green`, `unit-missing`, `browser-missing`, `browser-green`, `docs-overclaim`.

| Gate | Symbol / handler exists? | Path (primary) | Wired to UI? | Unit | Browser | Honest status |
|------|--------------------------|----------------|--------------|------|---------|---------------|
| W1 Draw | yes | `FeasibilityCanvas.tsx`, walls actions | yes | unit-green (feasibility) | browser-green journey | code-present+unit-green+browser-green |
| W2 Place | yes | `placementAction.ts`, modularCabinet, inventory | yes | unit-green | browser-green | code-present+unit-green+browser-green |
| W3 Select/delete | yes | pick + `deleteSelection` + keyboard Del/Bksp | yes | unit-green | browser-green `03-select-delete/` | code-present+unit-green+browser-green |
| W4 Orbit/2D↔3D | yes | OrbitControls path, viewMode | yes | unit-green pose | browser-missing residual | code-present+unit-green+browser residual |
| W5 Save reload | yes | autosave flush, projectJson | yes | unit-green continuity | browser-green save-reload | code-present+unit-green+browser-green |
| W6 Honesty | yes | workspaceStatusLabels local | yes | unit-green | browser-green | code-present+unit-green (local only) |
| W7 Mesh | yes | modularCabinetV0, workstationMeshV0 | yes | unit-green | visual smoke | code-present+unit-green (not photoreal) |
| W8 Shortcuts | yes | CANVAS_TOOL_SHORTCUTS map-driven | yes | unit-green | — | code-present+unit-green |

Grep artifacts: `w1-draw-rg.txt` … `w8-shortcuts-rg.txt`.  
Smoke log: `vitest-capability-smoke-raw.log` (27 tests ok).
