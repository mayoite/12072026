# Hard-path vertical slice (SVG + generate mesh/GLB + 2D/3D)

**Priority:** most difficult first (user). Soft UI is add-on.

## 00 Setup
- [x] Parallel explore: SVG, parametric/GLB, canvas↔R3F, tests
- [x] Policy: Fabric full 2D, modular generate-first, GLB exception

## 01 SVG system
- [x] Restore `site/scripts/generate-svg.mjs` → `runPipeline` + write `public/svg-catalog`
- [ ] Live admin publish smoke (manual / API) when ready

## 02 Generate mesh (must-do modular)
- [x] `modularCabinetV0` options → footprint + multi-part mesh
- [x] ParametricBuilder hooks + unit tests
- [x] Wire catalog place → modular flag + multi-part 3D (`geometryMode` / `createSceneObjectFromNode`)
- [ ] Optional GLB export from modular group (later)

## 03 Canvas / document / 3D
- [x] `buildOpen3dSceneNodes` pure adapter + tests
- [x] `ThreeViewerInner` rebuilds walls+furniture from project (entity ids)
- [x] Placement + entity ids: `newEntityId()` / crypto.randomUUID only (incl. JSON recovery)
- [x] 02B.1 geometry unit net: pick/snap/pointInPolygon tests
- [ ] Fabric cutover (2B — full stage)

## 04 Verify
- [x] Targeted vitest hard-path — exit 0 → `results/planner/hard-path/vitest-hard-path/`
- [x] Agent batch: modular-place + canvas-geometry + crypto residual → `results/planner/*/`
