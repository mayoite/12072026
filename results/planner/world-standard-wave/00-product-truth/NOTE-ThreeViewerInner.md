# NOTE — ThreeViewerInner (P01 deep read)

## 1. Scene construction entry
Builds scene from open3d project nodes via `buildOpen3dSceneNodes` + `createSceneObjectFromNode`.

## 2. OrbitControls
Dynamic import when `enableControls` true. Default ON via Lazy3DViewer / orbitDefaults. Workspace should not pass false.

## 3. GLB vs procedural
Procedural first (modular cabinet / workstation / box). Async GLB replace when policy-allowed `generatedGlbUrl`.

## 4. Continuity / camera
Document is pose authority for 2D↔3D; P04 unit continuity.

## 5. Failure modes
Late unmount cancel load; WebGL init error panel; missing dimensions → fallback box.

## 6. Docs conflict
WAVE may say “no orbit” — **code default orbit ON**. Cite: ThreeLazyViewer props + ThreeViewerInner OrbitControls path. See CONTRADICTIONS X03.
