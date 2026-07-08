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
- [ ] Optional GLB export from modular group (later)
- [ ] Wire catalog place → modular flag in furniture item

## 03 Canvas / document / 3D
- [x] `buildOpen3dSceneNodes` pure adapter + tests
- [x] `ThreeViewerInner` rebuilds walls+furniture from project (entity ids)
- [ ] Fabric cutover (2B — full stage)
- [ ] Placement uses crypto.randomUUID consistently

## 04 Verify
- [x] Targeted vitest hard-path — exit 0 → `results/planner/hard-path/vitest-hard-path/`
