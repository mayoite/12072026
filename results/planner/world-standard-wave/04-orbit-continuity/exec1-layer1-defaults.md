# P04 Exec 1/5 — Layer-1 product audit (defaults / OrbitControls / data-orbit-enabled)

| Field | Value |
|-------|--------|
| **Track** | P04 orbit continuity (W4) |
| **Seat** | Execute 1/5 — product layer-1 audit |
| **Mode** | A — verify from live source (no greenfield rewrite) |
| **Date** | 2026-07-10 |
| **Repo HEAD** | `f692ca963a68224e2daefee70b65d780a9ef766d` |
| **Phase-card PASS** | **VOID** — re-prove only; this file is source audit, not W4 Done |
| **Product edits** | **None** — no RED one-liner found |

**Sources read (only these three for this seat):**

- `site/features/planner/open3d/3d/orbitDefaults.ts`
- `site/features/planner/open3d/3d/ThreeLazyViewer.tsx`
- `site/features/planner/open3d/3d/ThreeViewerInner.tsx`

**Cross-check:** `plans1/P04-orbit-continuity/CODE-REVIEW-REPORT.md` layer-1 = product Closed (proof layer open).

---

## Verdict

| Gate | Status |
|------|--------|
| **Layer 1 (product defaults ON + construct + attr)** | **CLOSED** |
| RED bug requiring product edit | **None** |
| Layer 2 / 3 / browser proof | **Out of this seat** (not claimed closed here) |

**layer1: CLOSED**

---

## 1. Default ON

### Contract constant

```6:7:site/features/planner/open3d/3d/orbitDefaults.ts
/** Product default: OrbitControls ON for open3d 3D view. */
export const OPEN3D_ORBIT_DEFAULT_ENABLED = true as const;
```

- **Line cite:** `orbitDefaults.ts` **L7** — `OPEN3D_ORBIT_DEFAULT_ENABLED = true as const`
- **Fact:** Product default is literally `true`, not omit-and-hope.

### Explicit helper (type-forced true)

```13:15:site/features/planner/open3d/3d/orbitDefaults.ts
export function getOpen3dViewerControlProps(): { enableControls: true } {
  return { enableControls: OPEN3D_ORBIT_DEFAULT_ENABLED };
}
```

- **Line cite:** `orbitDefaults.ts` **L13–15**
- **Fact:** Return type is `{ enableControls: true }` — silent `false` cannot type-check through the helper.
- **Note:** Helper is the **layer-2** prop path; layer-1 only requires defaults ON. Helper presence strengthens the default contract but does not close layer 2 by itself.

### Lazy wrapper default

```144:146:site/features/planner/open3d/3d/ThreeLazyViewer.tsx
    enableShadows = true,
    enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED,
    backgroundColor,
```

- **Line cite:** `ThreeLazyViewer.tsx` **L145** — `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED`
- **JSDoc:** **L73–74** documents “Enable orbit controls (default: true)”
- **Pass-through:** **L176** — `enableControls={enableControls}` into inner

### Re-export of defaults from lazy module

```15:18:site/features/planner/open3d/3d/ThreeLazyViewer.tsx
export {
  OPEN3D_ORBIT_DEFAULT_ENABLED,
  getOpen3dViewerControlProps,
} from "./orbitDefaults";
```

- **Line cite:** `ThreeLazyViewer.tsx` **L15–18**

### Inner default (construct gate)

```65:69:site/features/planner/open3d/3d/ThreeViewerInner.tsx
export function ThreeViewerInner({
  projectData,
  enableShadows = true,
  enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED,
  backgroundColor = readThreeThemeColor("--surface-page", "#ffffff"),
```

- **Line cite:** `ThreeViewerInner.tsx` **L68** — `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED`
- **Import:** **L29** — `import { OPEN3D_ORBIT_DEFAULT_ENABLED } from "./orbitDefaults"`

### Default-ON checklist

| Check | Path:line | Result |
|-------|-----------|--------|
| Constant is `true` | `orbitDefaults.ts:7` | **PASS** |
| Lazy default uses constant | `ThreeLazyViewer.tsx:145` | **PASS** |
| Inner default uses constant | `ThreeViewerInner.tsx:68` | **PASS** |
| Lazy passes prop to inner | `ThreeLazyViewer.tsx:176` | **PASS** |
| No product hard-default `false` in these three files | (scan) | **PASS** |

---

## 2. OrbitControls construct

### Gate + dynamic import + `new OrbitControls`

```171:189:site/features/planner/open3d/3d/ThreeViewerInner.tsx
        if (enableControls && camera && renderer) {
          const { OrbitControls } = await import(
            "three/examples/jsm/controls/OrbitControls.js"
          );
          if (disposed || !camera || !renderer) return;
          const orbit = new OrbitControls(camera, renderer.domElement);
          orbit.enableDamping = true;
          orbit.dampingFactor = 0.08;
          orbit.target.set(0, 0, 0);
          orbit.maxPolarAngle = Math.PI / 2 - 0.05;
          orbit.minDistance = 1;
          orbit.maxDistance = 40;
          controls = orbit;
          if (!disposed) {
            setOrbitEnabled(true);
          }
        } else if (!disposed) {
          setOrbitEnabled(false);
        }
```

| Fact | Line cite | Value |
|------|-----------|--------|
| Construct only when `enableControls` | `ThreeViewerInner.tsx:171` | gated |
| Module path | `ThreeViewerInner.tsx:172–174` | `three/examples/jsm/controls/OrbitControls.js` |
| **Construct** | `ThreeViewerInner.tsx:176` | `new OrbitControls(camera, renderer.domElement)` |
| Damping ON | `ThreeViewerInner.tsx:177–178` | `enableDamping = true`, `dampingFactor = 0.08` |
| Target origin | `ThreeViewerInner.tsx:179` | `(0, 0, 0)` |
| Polar clamp | `ThreeViewerInner.tsx:180` | `maxPolarAngle = Math.PI / 2 - 0.05` |
| Distance clamp | `ThreeViewerInner.tsx:181–182` | `minDistance = 1`, `maxDistance = 40` |
| Success → state true | `ThreeViewerInner.tsx:184–186` | `setOrbitEnabled(true)` |
| Opt-out → state false | `ThreeViewerInner.tsx:187–189` | `setOrbitEnabled(false)` |
| Animate uses controls | `ThreeViewerInner.tsx:191–193` | `controls?.update()` |
| Dispose on unmount | `ThreeViewerInner.tsx:210–214`, `248–252` | `controls?.dispose()`; `setOrbitEnabled(false)` |
| Effect deps include enableControls | `ThreeViewerInner.tsx:254` | `[three, backgroundColor, enableShadows, enableControls]` |

### Construct checklist

| Check | Result |
|-------|--------|
| Real `new OrbitControls(...)` (not stub-only product path) | **PASS** @ L176 |
| Imperative Three (not R3F open3d port) | **PASS** |
| Damping / polar / distance match plan contract | **PASS** (0.08 / π/2−0.05 / 1–40) |
| Cancel-safe if disposed during import | **PASS** @ L175, L234–238 |

---

## 3. `data-orbit-enabled`

### State (Playwright truth after construct)

```77:78:site/features/planner/open3d/3d/ThreeViewerInner.tsx
  /** Playwright truth: set after OrbitControls construct (or false when opt-out). */
  const [orbitEnabled, setOrbitEnabled] = useState(false);
```

- **Line cite:** `ThreeViewerInner.tsx` **L77–78**
- **Fact:** Initial `false`; flips to `true` only after successful construct (L184–186). Attribute is **post-construct truth**, not “default prop assumed.”

### DOM attribute on inner container

```336:343:site/features/planner/open3d/3d/ThreeViewerInner.tsx
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

| Fact | Line cite |
|------|-----------|
| Test id for e2e | `ThreeViewerInner.tsx:339` — `data-testid="three-viewer-container"` |
| **Orbit attr** | `ThreeViewerInner.tsx:340` — `data-orbit-enabled={orbitEnabled ? "true" : "false"}` |
| Values are string `"true"` / `"false"` (not boolean DOM) | **L340** |

### Lazy wrapper test id (not the orbit attr host)

```166:169:site/features/planner/open3d/3d/ThreeLazyViewer.tsx
    <div
      className={`${styles.viewerRoot} ${className || ""}`}
      data-testid="planner-3d-canvas"
      style={{ backgroundColor: resolvedBg }}
```

- **Line cite:** `ThreeLazyViewer.tsx` **L168** — `data-testid="planner-3d-canvas"` on **outer div**
- **Fact:** Orbit attribute lives on **inner** `three-viewer-container`, not on `planner-3d-canvas`. Matches CODE-REVIEW / plan (anti-J4: canvas testid is the shell div, not WebGL canvas).

### Attr checklist

| Check | Result |
|-------|--------|
| `data-orbit-enabled` present on product mount | **PASS** @ Inner L340 |
| Reflects construct success, not mere prop default | **PASS** (state after L176 + L185) |
| Opt-out path sets `"false"` | **PASS** @ L187–189 → L340 |
| Unmount resets state | **PASS** @ L250 |

---

## 4. RED-bug scan (product one-liner threshold)

| Candidate defect | Assessment |
|------------------|------------|
| Default off | **No** — L7 / L145 / L68 all ON |
| OrbitControls never constructed | **No** — L176 |
| Missing `data-orbit-enabled` | **No** — L340 |
| Attr set before construct without construct path | **No** — starts false; true only after `new OrbitControls` |
| Wrong damping / missing polar clamp | **No** — matches plan |

**Action:** No product edit. Capture-only seat.

---

## 5. Honesty boundary (what this seat does **not** close)

Per three-layer rule and CODE-REVIEW-REPORT:

| Layer | Meaning | This audit |
|-------|---------|------------|
| **1** | Defaults ON + construct + attr in product | **CLOSED** (this file) |
| **2** | Workspace spreads `getOpen3dViewerControlProps()` | **Not audited here** (workspace file out of seat scope) |
| **3** | Unit + browser + artifacts under `04-orbit-continuity/` | **Open** for W4 Done — vitest/browser re-prove is later seats |

**Do not claim:** W4 PASS, browser green, layer-2 closed, or CP-04 from this file alone.

---

## 6. Summary line cites (quick index)

| Claim | File:line |
|-------|-----------|
| Default ON constant | `orbitDefaults.ts:7` |
| Helper forces true | `orbitDefaults.ts:13–15` |
| Lazy default ON | `ThreeLazyViewer.tsx:145` |
| Lazy → inner pass-through | `ThreeLazyViewer.tsx:176` |
| Inner default ON | `ThreeViewerInner.tsx:68` |
| OrbitControls construct | `ThreeViewerInner.tsx:176` |
| Damping 0.08 | `ThreeViewerInner.tsx:177–178` |
| Polar / min / max | `ThreeViewerInner.tsx:180–182` |
| `setOrbitEnabled(true)` post-construct | `ThreeViewerInner.tsx:184–186` |
| `data-orbit-enabled` | `ThreeViewerInner.tsx:340` |
| `data-testid="three-viewer-container"` | `ThreeViewerInner.tsx:339` |
| `data-testid="planner-3d-canvas"` | `ThreeLazyViewer.tsx:168` |

---

## 7. Return code (seat contract)

```
layer1: CLOSED
```

No product diff. Evidence artifact: this file only for Exec 1/5.
