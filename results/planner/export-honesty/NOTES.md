# Slice: honest open3d export menu (no PDF/PNG theater)

**Date:** 2026-07-09  
**Evidence:** `vitest-raw.log` (4/4)

## Change

- TopBar Export menu: only **JSON · SVG · BOQ · quote cart** (removed PDF/PNG items)
- `exportPreflight`: READY = json/svg only; pdf/png/dxf → `unsupported` + honest message
- Workspace: no “coming soon” path for formats that pretends ready

## Tests

`exportPhase06.test.ts` — 4 passed
