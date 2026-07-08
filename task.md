# Hard-path vertical slice (SVG + generate mesh/GLB + 2D/3D)

**Priority:** most difficult first (user). Soft UI is add-on.

## 00 Setup
- [x] Parallel explore: SVG, parametric/GLB, canvas↔R3F, tests
- [x] Policy: Fabric full 2D, modular generate-first, GLB exception

## 01 SVG system
- [x] Restore `site/scripts/generate-svg.mjs` → `runPipeline` + write `public/svg-catalog`
- [x] CLI smoke: fixtures → `public/svg-catalog/*.svg` (`results/planner/svg-cli-smoke/`)
- [x] Puck publish fail-closed: pipeline before persist (`publishDescriptorWithPipeline`)
- [ ] Full admin UI publish browser smoke when ready

## 02 Generate mesh (must-do modular)
- [x] `modularCabinetV0` options → footprint + multi-part mesh
- [x] ParametricBuilder hooks + unit tests
- [x] Wire catalog place → modular flag + multi-part 3D (`geometryMode` / `createSceneObjectFromNode`)
- [x] 2D modular footprint via `resolveFurniture2DFootprint`
- [ ] Optional GLB export from modular group (later)

## 03 Canvas / document / 3D
- [x] `buildOpen3dSceneNodes` pure adapter + tests
- [x] `ThreeViewerInner` rebuilds walls+furniture from project (entity ids)
- [x] Placement + entity ids: `newEntityId()` / crypto.randomUUID only (incl. JSON recovery)
- [x] 02B.1 geometry unit net: pick/snap/pointInPolygon tests
- [x] Fabric furniture stage (flag OFF default): `canvas-fabric-stage` + mapper tests
- [x] Fabric pan/zoom sync via `CanvasStatusSnapshot.transform`
- [ ] Browser smoke with flag ON
- [ ] Fabric full cutover (walls/rooms/tools)

## 04 Verify
- [x] Targeted vitest hard-path — exit 0 → `results/planner/hard-path/vitest-hard-path/`
- [x] Agent batch: modular-place + canvas-geometry + crypto residual → `results/planner/*/`
- [x] Wave3: modular-2d + fabric-stage + svg-cli + docs truth → evidence dirs
