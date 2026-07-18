# Admin — track status

**Date:** 2026-07-18  
**Plan (exactly 4 under `plan/Admin/`):** `CHECKLIST.md` · `FEATURES.md` · `IMPLEMENTATION-PLAN.md` · `REALITY-AND-STACK.md`  
**Part C:** locked Maker.js pen · forms client · Fabric place · Dockview/Aria chrome  
**Tasks:** `IMPLEMENTATION-PLAN.md` · **Stack:** `REALITY-AND-STACK.md`  
**Not proof.** Live code wins.

## Locked stack (target)

Engine pen = Maker.js. Brain = type drawers. Client = forms (no code). Canvas = Fabric. Chrome = Dockview + Aria.  
**AI** = field draft only after C2 (C-AI) — never geometry. **Do not switch pens.**

## Code truth (re-verify)

| Claim | Live | Status |
|-------|------|--------|
| Form/CLI/publish pen | `renderLinearDeskSvg` → `drawLinearDeskFromTemplate` | **K1 OPEN** |
| Maker recipes | `buildLinearDeskMakerModel` etc. — pipeline IR only | PARTIAL |
| Route | `/admin/svg-editor/parametric` | PARTIAL (exists) |
| Schema | `linearDeskFields.ts` full Zod | DONE (unit) |
| Form UI knobs | no pedestalTopGap / pedestalBackInset controls | **K3 OPEN** |
| Units | `units.ts` mm/cm | DONE |

## Open

1. Disk still live SVG authority (`Failures.md` cutover).  
2. **K1** wire form/compile/CLI to Maker only (delete dual-pen).  
3. **K2** unit proves Maker path.  
4. **K3** form UI 1:1 with schema knobs.  
5. **C3** browser: 160 cm → preview → publish.  
6. **C4** guest place 1280 + 390 + BOQ.  
7. Generator greys / G1–G3 (`IMPLEMENTATION-PLAN.md`).  
8. Deploy/browser auth residual (Part B).

## Not this file

Part C evidence and checkboxes: `plan/Admin/CHECKLIST.md` only.
