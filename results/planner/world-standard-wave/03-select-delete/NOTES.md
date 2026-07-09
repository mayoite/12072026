# W3 select/delete — CP-03 unit + browser (2026-07-09)

## Unit
- applySelectionDelete single-history multi-id
- Delete/Backspace preventDefault
- Esc clears selection
- 30/30 vitest (unit-vitest.log)

## Browser
- tests/e2e/open3d-w3-select-delete.spec.ts
- place → Select → Delete → Ctrl+Z
- 1 passed (playwright-raw.log)
- screenshots 01-04-*.png

## Build notes
- next full build still blocked by /contact createContext (pre-existing)
- e2e ran against turbopack dev (PLAYWRIGHT_BASE_URL)
- fixed Prim fill type on LinePrim in renderBlock2DToCanvas (build hygiene)

## Fabric
- Feasibility/document path; no Fabric furniture flag required
