# Hard-path vertical slice (SVG + generate mesh/GLB + 2D/3D)

**Priority:** most difficult first (user). Soft UI is add-on.

## 00 Setup
- [x] Parallel explore: SVG, parametric/GLB, canvas↔R3F, tests
- [x] Policy: Fabric full 2D, modular generate-first, GLB exception

## 01 SVG system
- [x] Restore `site/scripts/generate-svg.mjs` → `runPipeline` + write `public/svg-catalog`
- [x] CLI smoke: fixtures → `public/svg-catalog/*.svg` (`results/planner/svg-cli-smoke/`)
- [x] Puck publish fail-closed: pipeline before persist (`publishDescriptorWithPipeline`)
- [x] **Asset-engine SVG skeleton ordered** (`asset-engine/stages.ts` S0–S7)
- [x] **S1 normalize** BlockDescriptor depth/fixed → pipeline IR; admin side-table compiles
- [x] **Publish authority entry** `compileSvgForPublish` → `runSvgCompileStages` (S1–S3) then S4 `runSvgPipeline` / generate-svg.mjs
- [x] **Authority decided** publish = `pipelineCore+normalize` via `compileSvgForPublish`; V1 = `v1-reference-only` (retained, not on publish wire). Dual-compiler “unify/delete V1” is **not** an open hard-path item.
- [ ] Residual: full admin UI publish browser smoke (when ready)

## 02 Generate mesh (must-do modular)
- [x] `modularCabinetV0` options → footprint + multi-part mesh
- [x] ParametricBuilder hooks + unit tests
- [x] Wire catalog place → modular flag + multi-part 3D (`geometryMode` / `createSceneObjectFromNode`)
- [x] 2D modular footprint via `resolveFurniture2DFootprint`
- [x] Modular GLB **plan** helper (policy-safe path)
- [x] **Asset-engine mesh skeleton ordered** (G0–G8); G5 binary GLB in-memory + G6 validate
- [x] **G7 extrude plan (partial)** pure `extrudeSvgPlan` under catalog-assets/generated/ (binary still admin island)
- [x] **G5→doc stamp (partial)** `stampFurnitureGeneratedGlb` → `generatedGlbUrl` (place still procedural default)
- [x] **G8 viewer load (partial)** `ThreeViewerInner` async `loadGeneratedGlbObject` when `shouldLoadGlb(generatedGlbUrl)` — landed unit path; not full product
- [x] **P0.2 part A** `writeGeneratedGlbToPublic` + `exportModularAndWrite` + place writes under `site/public/catalog-assets/generated/` then stamp (`results/planner/p0-2-glb-write/`)
- [ ] Residual G8: remote CDN upload modular GLB on publish (optional; local public write landed)
- [ ] Residual G8: browser smoke — stamped `generatedGlbUrl` loads in open3d viewer (cache / scale still out)

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
- [ ] Wave-superpowers evidence pack → `results/planner/wave-superpowers/run.json` (template + agent list; fill vitest after full re-run)

## Stage honesty (landed G8 partial + authority)

| Stage | Status | Note |
|-------|--------|------|
| svg-s2-compile | **implemented** | Publish authority = `pipelineCore+normalize` via `compileSvgForPublish`; V1 = `v1-reference-only` (not deleted, not publish) |
| mesh-g8-viewer-load-glb | **partial** | Viewer async replace landed; residuals = upload + browser smoke + product polish |
| svg-s5-artifacts-png | stub | unchanged |
| mesh-g7-extrude-svg | partial | pure plan + admin island binary |
