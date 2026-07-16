# Admin track

## Outcome

Admin governs trusted inventory. Planner customers consume only published products, SVG revisions, families, and approved prices.

## Editor authority

Manual SVG authoring uses **Excalidraw** (`@excalidraw/excalidraw`) embedded in the Admin shell.

- **Live code:** `features/admin/svg-editor/editor/ExcalidrawClient.tsx`, loaded from `AdminSvgEditorShell.tsx`.
- **Host owns:** identity, millimetre footprint, dimension panel, grid snapping, validation, draft state, compile preview, and publish.
- **Editor exports:** sanitized SVG bytes via `exportToSvg`; `excalidrawElements` persist with the descriptor for reopen.
- **Not in use:** SVG.js scene canvas (`SvgStudioCanvas`), SVG-Edit iframe, or a second SVG engine.
- **Legacy bridge:** `scene/sceneFromDescriptor` and `sceneParts` remain for older descriptors until migration is proven.

`plan/svgblunder/` described an SVG-Edit recovery path. Excalidraw is the active Admin editor decision.

## Files (5)

| File | Role |
|---|---|
| `README.md` | Track outcome, editor authority, phase index |
| `PHASES-01-02.md` | Excalidraw authoring + catalog lifecycle |
| `PHASES-03-04.md` | Product families + commercial governance |
| `FEATURES.md` | Plan phase → code path → honest gap |
| `CHECKLIST.md` | Open acceptance work and browser proof only |

## Features

`FEATURES.md` maps each plan phase to code paths and known gaps. Live code and fresh checks are authoritative.

## Status

`CHECKLIST.md` records open acceptance work and browser proof only.

## Start gate

Step 0 test isolation runs before catalog-writing tests. See first section of `CHECKLIST.md`.

Only catalog-writing work waits. Read-only and isolated work continues.

## Blockers

| Gap | Blocks only |
|---|---|
| Failed test isolation | Catalog-writing tests |
| Stub DB dual-write (disk still authority) | Live DB-SVG cutover proof |
| Missing external service | That service’s direct check |

## Interface authority

`../../docs/architecture/07-ADMIN-UI-BENCHMARK.md` — `ADM-*` acceptance IDs.

## Completion

Admin governs a configurable, priced, approved catalog. Planner consumes the same released product safely.
