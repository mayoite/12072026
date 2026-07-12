# PHASE-01 — Authoring quality (the real SVG fix)

**Parallel:** yes · **Blocks on:** — · **Proof:** live browser + on-disk bytes + unit tests

---

## In plain words
The Admin studio publishes furniture symbols as `.svg` files, but right now they come out as
tiny flat boxes — a single rectangle, 300–480 bytes. A desk and a sofa look almost the same.
This phase makes the studio produce **real, layered** symbols so that when the planner draws them
(Planner PHASE-01), they actually look like furniture.

## File map

| Action | Path |
|--------|------|
| Modify | `site/features/planner/asset-engine/svg/runSvgCompileStages.ts` (or block-emission helper) |
| Modify | `site/features/planner/asset-engine/svg/normalizeDescriptorForPipeline.ts` |
| Modify | `site/public/svg-catalog/chaise-lounge-001.svg` (regenerated via publish) |
| Modify | `site/features/planner/asset-engine/stages.ts` — S7 text (publish + planner consume) |
| Create | `site/tests/unit/features/planner/asset-engine/publishMultipath.test.ts` |
| Read | `site/block-descriptors/chaise-lounge-001.json` |

## What exists today (grounded in code)
- `admin/svg-editor/SvgStudioCanvas.tsx` → `scene/svgJsEngineAdapter.ts` — SVG.js drawing surface.
- `compileSvgForPublish.ts` — publish authority; chaise has 2 blocks but published SVG was 1 merged path.
- `stages.ts` S7 may still say Block2D-only plan paint — stale vs owner lock (planner renders catalog).

## Steps
0. **Baseline reproof (no code):** record `git rev-parse HEAD`; curl chaise SVG pathish count (expect RED
   if 1-path); note in report. Verify inventory preview shows `img[src*="/svg-catalog/"]` before/after publish.
1. **Failing unit:** `publishMultipath.test.ts` — chaise ≥2 pathish, `seat-block` + `backrest-block` ids.
2. **Pipeline fix:** multi-block descriptor → per-block pathish output (not one merged difference path).
3. **Regenerate** `chaise-lounge-001.svg` on disk; verify via HTTP/curl pathish count.
4. **Desk vertical slice:** author layered geometry on SVG.js stage; publish ≥3 pathish elements.
5. **S7 honesty:** update `stages.ts` — publish authority; planner consumes `/svg-catalog/` (primary paint).
6. **Repeat** for remaining four catalog symbols once slice proves out.

## Done when
Boxes in `plan/Admin/CHECKLIST.md` → PHASE-01.

## How to prove
```bash
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/publishMultipath.test.ts tests/unit/features/planner/asset-engine/svgPackageBoundaries.test.ts --reporter=verbose
```
Author desk, publish, inspect on-disk bytes (≥3 pathish). Raw artifacts → `results/admin/phase-01/`.
Report → `agents-work/reports/admin-phase-01.md`.

**Security coupling:** run Security PHASE-05 input matrix on same publish path when both land.

## Guardrails
- Authoring stays **SVG.js in admin**; never import Fabric (`svgPackageBoundaries` green).
- Do not change 3D extrusion path — `makerJsPipeline` / `scenePublishAuthority` tests still pass.
- Pathish bar: ≥2 per block count for 2-block descriptors; ≥3 for multi-part symbols with 3+ parts.

## Out of scope
Wiring planner to render SVG — Planner PHASE-01. Block2D multiprim regression — `open3d-p05-cabinet-multiprim.spec.ts` in Planner P01.