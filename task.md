# Hard-path vertical slice (SVG + generate mesh/GLB + 2D/3D)

**Priority:** most difficult first (user). Soft UI is add-on.

## 00 Setup
- [x] Parallel explore: SVG, parametric/GLB, canvas↔R3F, tests
- [x] Policy: Fabric full 2D, modular generate-first, GLB exception

## 01 SVG system
- [x] Restore `site/scripts/generate-svg.mjs` → `runPipeline` + write `public/svg-catalog`
- [x] CLI smoke: fixtures → `public/svg-catalog/*.svg` (`results/planner/svg-cli-smoke/`)
- [x] Puck publish fail-closed: pipeline before persist (`publishDescriptorWithPipeline`)
- [x] **Asset-engine SVG skeleton ordered** (`asset-engine/stages.ts` S0–S7) — dual compiler still honest partial
- [x] **S1 normalize** BlockDescriptor depth/fixed → pipeline IR; admin side-table compiles
- [ ] Unify pipelineCore + svgCompiler.server (single compile authority)
- [ ] Full admin UI publish browser smoke when ready

## 02 Generate mesh (must-do modular)
- [x] `modularCabinetV0` options → footprint + multi-part mesh
- [x] ParametricBuilder hooks + unit tests
- [x] Wire catalog place → modular flag + multi-part 3D (`geometryMode` / `createSceneObjectFromNode`)
- [x] 2D modular footprint via `resolveFurniture2DFootprint`
- [x] Modular GLB **plan** helper (policy-safe path)
- [x] **Asset-engine mesh skeleton ordered** (G0–G8); G5 binary GLB in-memory + G6 validate
- [ ] G8 open3d viewer load of generated GLB URL (still procedural)
- [ ] Upload modular GLB to storage on publish

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
- [x] Save/reload continuity unit (envelope + project JSON)
- [x] Entity UUID asserts on place + createOpen3dProject
