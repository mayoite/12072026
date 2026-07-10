# P04 / W4 Orbit Continuity — SCRATCH BASELINE

**Agent:** P04 Scratch Agent 0 — honest baseline  
**Date (local):** 2026-07-10  
**Tip at write:** see `HEAD.txt`  
**Status:** **open** — phase card W4 PASS is **INVALID** until a full new pack (units + browser) is proven on this tip.  
**Rule:** Live code only. Do not inherit prior `results/04-*` PASS claims. Unit logs alone ≠ W4.

---

## 1. Product code facts (live read)

### 1.1 `orbitDefaults` — `OPEN3D_ORBIT_DEFAULT_ENABLED`

**File:** `site/features/planner/open3d/3d/orbitDefaults.ts`

| Fact | Value | Cite |
|------|-------|------|
| Constant | `OPEN3D_ORBIT_DEFAULT_ENABLED = true as const` | L7 |
| Helper | `getOpen3dViewerControlProps(): { enableControls: true }` | L13–15 |
| Return | `{ enableControls: OPEN3D_ORBIT_DEFAULT_ENABLED }` → always `{ enableControls: true }` | L14 |

```ts
export const OPEN3D_ORBIT_DEFAULT_ENABLED = true as const;
// ...
export function getOpen3dViewerControlProps(): { enableControls: true } {
  return { enableControls: OPEN3D_ORBIT_DEFAULT_ENABLED };
}
```

### 1.2 `OOPlannerWorkspace` spreads `getOpen3dViewerControlProps`?

**YES** — product layer 2 is wired in source.

| Item | Cite |
|------|------|
| Import | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` L13–16: `Lazy3DViewer`, `getOpen3dViewerControlProps` from `../3d/ThreeLazyViewer` |
| Mount | L1057–1060: `<Lazy3DViewer projectData={...} {...getOpen3dViewerControlProps()} />` |

```tsx
// OOPlannerWorkspace.tsx ~1057–1060
<Lazy3DViewer
  projectData={workspaceCanvas.project}
  {...getOpen3dViewerControlProps()}
/>
```

### 1.3 `data-orbit-enabled` on `ThreeViewerInner`?

**YES** — present on the inner container.

| Item | Cite |
|------|------|
| Default prop | `ThreeViewerInner.tsx` L68: `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED` |
| Attribute | L337–341: `data-testid="three-viewer-container"` + `data-orbit-enabled={orbitEnabled ? "true" : "false"}` |
| State | L78–79: `orbitEnabled` state set after OrbitControls construct (or false when opt-out) |

```tsx
// ThreeViewerInner.tsx ~337–341
<div
  className={styles.container}
  data-testid="three-viewer-container"
  data-orbit-enabled={orbitEnabled ? "true" : "false"}
>
```

### 1.4 Lazy defaults (layer 1 companion)

| Item | Cite |
|------|------|
| Lazy default | `ThreeLazyViewer.tsx` L145: `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED` |
| Canvas testid | L169: `data-testid="planner-3d-canvas"` on wrapper **div** |
| Re-exports | L16–17: re-exports `OPEN3D_ORBIT_DEFAULT_ENABLED`, `getOpen3dViewerControlProps` |

---

## 2. Three-layer product table (code presence — not proof)

| Layer | Requirement | Present in product source? | Notes |
|-------|-------------|----------------------------|-------|
| **1 Defaults** | Lazy + Inner default ON via `OPEN3D_ORBIT_DEFAULT_ENABLED` | **YES** | `orbitDefaults.ts` L7; Inner L68; Lazy L145 |
| **2 Workspace** | `OOPlannerWorkspace` spreads `getOpen3dViewerControlProps()` | **YES** | L1057–1060 |
| **3 DOM / construct** | `data-orbit-enabled` + unit construct-spy + browser | **PARTIAL (code YES / proof OPEN)** | Attr on Inner L340; unit files exist; **browser pack not proven this scratch** |

**Proof status for W4:** **OPEN** (this file is baseline only).

---

## 3. Unit / e2e files that exist (paths)

Checked on disk under `.` (paths relative to repo root):

| Role | Path | Exists |
|------|------|--------|
| Orbit unit (layer 1+3 construct / attr) | `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx` | YES |
| Workspace wiring unit (layer 2) | `site/tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts` | YES |
| Pose continuity unit | `site/tests/unit/features/planner/open3d/poseContinuityW4.test.ts` | YES |
| Document view continuity (related) | `site/tests/unit/features/planner/open3d/documentViewContinuity.test.ts` | YES |
| Playwright W4 e2e | `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts` | YES |
| Manifest gate (W4 name) | `site/tests/unit/config/playwrightOpen3dWorldSpecs.test.ts` | YES (asserts W4 → w4 spec) |

**Not counted as W4 product path:** legacy `Planner3DViewer` / `ThreeViewer.test.tsx` / `planner-j4-3d-parity` orbit tests — different stacks or historical.

---

## 4. Evidence folder inventory (scratch start)

**Canonical dir:** `results/planner/world-standard-wave/04-orbit-continuity/`

### Present before / at scratch write (stale or concurrent — **not** phase PASS)

| File | Notes |
|------|--------|
| `HEAD.txt` | Prior/concurrent tip stamp — **rewritten** by this baseline |
| `unit-orbit-pack.log` | Concurrent/prior unit tee — **not** accepted as W4 Done |
| `unit-pose-pack.log` | Concurrent/prior unit tee — **not** accepted as W4 Done |
| `dev-server-w4.log` | Dev-server noise (port conflict / next ready) — **not** browser proof |

### Missing for W4 Done (at scratch)

| Artifact | Status |
|----------|--------|
| `SCRATCH-BASELINE.md` | **This file** (created) |
| `run.json` status `open` | Created by this baseline |
| Browser PNGs (`01-*`, `02-3d-orbit-on.png`, …) | **MISSING** |
| `browser-run.json` / Playwright raw log for W4 | **MISSING** |
| `NOTES.md` / `PHASE-SUMMARY.md` with honest green close | **MISSING** |
| Full re-proven unit + browser on **one** tip with Fabric OFF | **NOT DONE** |

**Honesty:** Even if unit logs show green tests, **unit alone ≠ W4**. Phase PASS remains **invalid** until browser E2E + complete pack land on the tip under proof.

---

## 5. What this agent does / does not claim

| Claim | Status |
|-------|--------|
| Product three-layer **code** present | YES / YES / YES (attr) — see table §2 |
| W4 phase PASS | **NO** — INVALID / open |
| Browser orbit left-drag proven | **NO** — not in this pack |
| Prior phase-card or stale `results/` PASS | **REJECTED** |

---

## 6. Next (not this agent)

1. Re-run unit packs with Fabric OFF; tee unfiltered logs here.  
2. Playwright `open3d-w4-orbit-continuity.spec.ts` with screenshots + `browser-run.json`.  
3. Only then flip `run.json` / NOTES toward pass — never paper moon.
