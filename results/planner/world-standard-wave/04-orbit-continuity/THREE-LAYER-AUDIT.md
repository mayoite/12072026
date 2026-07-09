# P04 three-layer orbit audit

**Date:** 2026-07-09  
**Mode:** Read-only code audit (findings only)  
**Scope:** Product open3d path under `site/features/planner/open3d/`  
**Out of scope as product:** `archive/open3d-next-staging/`, unit test opt-out fixtures

## Verdict

| # | Check | Result |
|---|--------|--------|
| 1 | OOPlannerWorkspace → `getOpen3dViewerControlProps()` / `enableControls: true` | **PASS** |
| 2 | `data-orbit-enabled` on `three-viewer-container` | **PASS** |
| 3 | `OPEN3D_ORBIT_DEFAULT_ENABLED === true` | **PASS** |
| 4 | No `enableControls={false}` on product path | **PASS** |
| 5 | `buildOpen3dSceneNodes` pose fields | **PASS** |

**Overall:** Three-layer orbit contract is wired correctly in product code.

---

## Layer map (W4)

| Layer | File | Role |
|-------|------|------|
| Contract / defaults | `site/features/planner/open3d/3d/orbitDefaults.ts` | `OPEN3D_ORBIT_DEFAULT_ENABLED`, `getOpen3dViewerControlProps()` |
| Product mount | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Spreads control props onto `Lazy3DViewer` in 3D branch |
| Lazy wrapper | `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` | Default + pass-through `enableControls` → Inner |
| Viewer shell | `site/features/planner/open3d/3d/ThreeViewerInner.tsx` | Constructs `OrbitControls`; sets `data-orbit-enabled` |
| Document → scene | `site/features/planner/open3d/3d/buildOpen3dSceneNodes.ts` | Pose fields for 2D↔3D continuity |

---

## 1. OOPlannerWorkspace uses `getOpen3dViewerControlProps()` / enableControls true

**PASS**

- Import:

```13:16:site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
import {
  Lazy3DViewer,
  getOpen3dViewerControlProps,
} from "../3d/ThreeLazyViewer";
```

- Product 3D mount (only product `Lazy3DViewer` usage under `site/`):

```976:979:site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
          <Lazy3DViewer
            projectData={workspaceCanvas.project}
            {...getOpen3dViewerControlProps()}
          />
```

- Helper return type forces true:

```13:15:site/features/planner/open3d/3d/orbitDefaults.ts
export function getOpen3dViewerControlProps(): { enableControls: true } {
  return { enableControls: OPEN3D_ORBIT_DEFAULT_ENABLED };
}
```

Host wiring: `Open3dNativeHost` → `OOPlannerWorkspace` only (no alternate product mount that skips the helper).

---

## 2. `data-orbit-enabled` on `three-viewer-container`

**PASS**

```335:342:site/features/planner/open3d/3d/ThreeViewerInner.tsx
  return (
    <div
      className={styles.container}
      data-testid="three-viewer-container"
      data-orbit-enabled={orbitEnabled ? "true" : "false"}
    >
      <div ref={containerRef} className={styles.viewerRoot} />
    </div>
  );
```

- `orbitEnabled` state set `true` after successful `OrbitControls` construct when `enableControls` is true; `false` when controls disabled or not constructed.
- E2E selector contract: `[data-testid="three-viewer-container"][data-orbit-enabled="true"]` in `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts`.
- Note: attribute is `"false"` until async scene setup finishes (initial React state is `false`). Product intent after ready is `"true"`.

---

## 3. `OPEN3D_ORBIT_DEFAULT_ENABLED` is true

**PASS**

```6:7:site/features/planner/open3d/3d/orbitDefaults.ts
/** Product default: OrbitControls ON for open3d 3D view. */
export const OPEN3D_ORBIT_DEFAULT_ENABLED = true as const;
```

Used as default in:

- `ThreeLazyViewer`: `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED`
- `ThreeViewerInner`: `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED`
- Re-exported from `ThreeLazyViewer.tsx` and `3d/index.ts`

---

## 4. No `enableControls={false}` on product path

**PASS**

Repo hits for `enableControls={false}` / `enableControls: false`:

| Location | Classification |
|----------|----------------|
| `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx` | Unit opt-out fixture only |
| Product `site/features/planner/open3d/**` | **No false** |

Product path only:

- `OOPlannerWorkspace` spreads `getOpen3dViewerControlProps()` → `{ enableControls: true }`
- No other `Lazy3DViewer` / `ThreeViewerInner` product mounts under `site/features` set false

Archive staging (`archive/open3d-next-staging/`) is not the live product path.

---

## 5. `buildOpen3dSceneNodes` pose fields

**PASS** — document remains pose authority; nodes carry continuity fields.

### Node pose surface (`Open3dSceneNode`)

| Field | Role |
|-------|------|
| `id` | Entity continuity (wall / furniture id) |
| `kind` | `"wall"` \| `"furniture"` |
| `xMm`, `yMm` | Plan-mm center (y → world Z at render) |
| `widthMm`, `depthMm`, `heightMm` | Footprint / extrusion mm |
| `rotation` | **Radians** about vertical (document furniture rotation is **degrees**) |
| `color`, `catalogId` | Presentation / identity extras |
| `geometryMode`, `modularOptions`, `workstationOptions` | Mesh path (not pose) |
| `generatedGlbUrl` | Optional GLB replace (not pose) |

### Furniture mapping

```110:119:site/features/planner/open3d/3d/buildOpen3dSceneNodes.ts
    nodes.push({
      id: item.id,
      kind: "furniture",
      xMm: item.position.x,
      yMm: item.position.y,
      widthMm,
      depthMm,
      heightMm,
      // Document rotation is degrees (2D canvas, properties); scene nodes are radians.
      rotation: degreesToRadians(item.rotation),
```

### Wall mapping

- Center from segment mid: `xMm`/`yMm`
- Length → `widthMm`; thickness → `depthMm`; height → `heightMm`
- `rotation` from `atan2(dy, dx)` (radians)

### Viewer rebuild (no document mutation)

`ThreeViewerInner` rebuilds from `buildOpen3dSceneNodes(projectData)` on project change — pure adapter; document not rewritten by the viewer.

Unit lock: `site/tests/unit/features/planner/open3d/poseContinuityW4.test.ts` asserts id/position/rotation continuity and degrees→radians.

---

## Orbit construct path (inner layer)

When `enableControls` is true:

```170:188:site/features/planner/open3d/3d/ThreeViewerInner.tsx
        if (enableControls && camera && renderer) {
          const { OrbitControls } = await import(
            "three/examples/jsm/controls/OrbitControls.js"
          );
          // ...
          const orbit = new OrbitControls(camera, renderer.domElement);
          // damping, target, polar/distance limits
          setOrbitEnabled(true);
        } else if (!disposed) {
          setOrbitEnabled(false);
        }
```

---

## Residuals (honesty, not code-contract failures)

- Browser e2e W4 (`open3d-w4-orbit-continuity.spec.ts`) noted flaky on place/count in phase `NOTES.md`; **code contract still PASS** — residual is browser stability, not missing orbit wiring.
- `data-orbit-enabled` starts `"false"` until controls construct; tests must wait for ready, not assert first paint.
- Marketing/demo `site/components/ThreeViewer.tsx` uses drei `OrbitControls` separately — not open3d product planner path.

---

## Sources audited

- `D:\OandO07072026\site\features\planner\open3d\3d\orbitDefaults.ts`
- `D:\OandO07072026\site\features\planner\open3d\3d\ThreeLazyViewer.tsx`
- `D:\OandO07072026\site\features\planner\open3d\3d\ThreeViewerInner.tsx`
- `D:\OandO07072026\site\features\planner\open3d\3d\buildOpen3dSceneNodes.ts`
- `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx`
- `D:\OandO07072026\site\features\planner\open3d\ui\Open3dNativeHost.tsx`
- `D:\OandO07072026\site\tests\unit\features\planner\open3d\orbitControlsDefault.test.tsx`
- `D:\OandO07072026\site\tests\unit\features\planner\open3d\poseContinuityW4.test.ts`
- `D:\OandO07072026\site\tests\e2e\open3d-w4-orbit-continuity.spec.ts`
