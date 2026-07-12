# PHASE-01 — Planner renders published SVG

**Parallel:** yes · **Blocks on:** Admin symbol contract (use a fixture — do not wait) · **Proof:** live browser + screenshots + E2E honesty

---

## In plain words
When a buyer drops furniture on the plan, the planner draws a rough Block2D box. Admin already
publishes proper `.svg` files. **This phase wires the loader** so the real symbol paints on Fabric;
Block2D is fallback only when the file is missing.

**Owner lock:** catalog SVG is **primary** plan paint. Admin authors in SVG.js; planner renders
published bytes via `svgPlanSymbolCache`. Block2D is fallback only when the published file is missing.

## File map

| Action | Path |
|--------|------|
| Modify | `site/features/planner/project/catalog/placementAction.ts` (or render path) |
| Modify | `site/features/planner/project/catalog/svg/svgPlanSymbolCache.ts` — wire `getSvgPlanImage` |
| Modify | `site/features/planner/canvas/fabricBlock2D.ts` — keep as loading/fallback painter |
| Modify | `site/tests/e2e/open3d-cp05-symbols-s7.spec.ts` — planner paints catalog + HTTP multipath |
| Keep | `site/tests/e2e/open3d-p05-cabinet-multiprim.spec.ts` — Block2D fallback when SVG absent |

## What exists today (grounded in code)
- `svgPlanSymbolCache.ts` — loader works; **nothing calls it** in placement path.
- `fabricBlock2D.ts` / `createFabricFurnitureBlock` — current painter (becomes fallback).
- Five fixture files under `public/svg-catalog/` + `block-descriptors/`.

## Steps
0. **Baseline reproof (no code):** run and log on HEAD:
   ```bash
   pnpm --filter oando-site exec vitest run \
     tests/unit/features/planner/modularCabinetV0.test.ts \
     tests/unit/features/planner/fabricBlock2D.test.ts \
     --reporter=verbose
   ```
1. In placement render path, call `getSvgPlanImage(url, onLoaded)`.
2. Paint Block2D while loading; repaint with SVG image on `onLoaded`.
3. On loader `null` (missing/failed), stay on Block2D — no buyer-facing error.
4. Verify scale, rotate, save, hard reload preserve SVG-painted entity.
5. **Rewrite** `open3d-cp05-symbols-s7.spec.ts`: (a) HTTP multipath ≥2 pathish; (b) inventory preview
   `img[src*="/svg-catalog/"]` if applicable; (c) plan canvas paints published SVG on place (not thumb-only).
6. **Regression:** `open3d-p05-cabinet-multiprim.spec.ts` still green for Block2D fallback path.

## Done when
Boxes in `plan/Planner/CHECKLIST.md` → PHASE-01.

## How to prove
Open `/planner/guest`, place catalog item — real symbol paints. Rename `.svg` on disk, reload, place
again — Block2D fallback, no console error. Screenshots desktop + 375×812.

```bash
pnpm --filter oando-site exec playwright test tests/e2e/open3d-cp05-symbols-s7.spec.ts tests/e2e/open3d-p05-cabinet-multiprim.spec.ts -c config/build/playwright.config.ts
```

Raw artifacts → `results/planner/phase-01/`. Report → `agents-work/reports/planner-phase-01.md`.

## Guardrails
- SVG is **primary** paint; Block2D is fallback — never label the box as "the SVG".
- Planner never imports SVG.js (admin only).

## Out of scope
- Improving publish bytes quality — Admin PHASE-01.
- 3D meshes — 2D plan paint only.

## Contract consumed
`public/svg-catalog/{slug}.svg` + `BlockDescriptor`. Build against existing fixture; integrate at seam.