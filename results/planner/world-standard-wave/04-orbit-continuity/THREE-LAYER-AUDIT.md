# THREE-LAYER-AUDIT — P04 / W4 Orbit Continuity

| Field | Value |
|-------|--------|
| **Seat** | P04 three-layer audit + coherent pack |
| **Date** | 2026-07-10 |
| **Checkout** | `D:\OandO07072026` only (no worktrees) |
| **Tip at audit write** | `bb0531685e7e714acb6026d0afcb214ba6e68f7a` |
| **Bar** | NO PAPER MOON · unit alone ≠ W4 · pass only if unit+browser green **same tip** |
| **Evidence root** | `results/planner/world-standard-wave/04-orbit-continuity/` |

---

## Layer 1 — Defaults ON (product)

**Verdict: CLOSED in product source.** Defaults alone are not W4 Done (need Layer 2 + Layer 3).

| Claim | Live cite | Fact |
|-------|-----------|------|
| Product constant ON | `site/features/planner/open3d/3d/orbitDefaults.ts` **L7** | `OPEN3D_ORBIT_DEFAULT_ENABLED = true as const` |
| Typed helper forces true | same file **L13–15** | `getOpen3dViewerControlProps(): { enableControls: true }` returns `{ enableControls: OPEN3D_ORBIT_DEFAULT_ENABLED }` |
| **ThreeViewerInner** default ON | `site/features/planner/open3d/3d/ThreeViewerInner.tsx` **L68** | `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED` |
| OrbitControls construct when enabled | same **L171–186** | dynamic `import("three/examples/jsm/controls/OrbitControls.js")`; damping `0.08`; `maxPolarAngle = Math.PI/2 - 0.05`; min/max distance 1/40 |
| DOM truth attr | same **L337–341** | `data-testid="three-viewer-container"` + `data-orbit-enabled={orbitEnabled ? "true" : "false"}` |
| **ThreeLazyViewer / Lazy3DViewer** default ON | `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` **L145** | `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED` |
| Lazy passes prop through | same **L173–178** | `enableControls={enableControls}` into lazy inner |
| Lazy host testid (div) | same **L166–169** | `data-testid="planner-3d-canvas"` on **div** (anti-J4: not canvas) |
| Re-export helper | same **L15–18** | re-exports `OPEN3D_ORBIT_DEFAULT_ENABLED`, `getOpen3dViewerControlProps` |

**False-green trap:** claiming “orbit works” from Layer 1 alone. Workspace could omit props and still inherit defaults — Layer 2 must force explicit product wiring.

---

## Layer 2 — Workspace explicit wiring

**Verdict: CLOSED in product source.**

| Claim | Live cite | Fact |
|-------|-----------|------|
| Import | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` **L13–16** | `Lazy3DViewer`, `getOpen3dViewerControlProps` from `../3d/ThreeLazyViewer` |
| 3D mount spreads helper | same **L1057–1060** | ```tsx<br/><Lazy3DViewer<br/>  projectData={workspaceCanvas.project}<br/>  {...getOpen3dViewerControlProps()}<br>/>``` |
| Unit lock (source scan) | `site/tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts` | asserts helper `enableControls: true` **and** workspace file spreads helper into Lazy3DViewer |

**False-green trap:** product default ON with workspace omitting the spread — silent opt-out of the product contract. Layer 2 + wiring unit close that hole.

---

## Layer 3 — Unit + browser evidence status

**Verdict: PARTIAL deposits — overall not same-tip dual-green. W4 product claim = NO.**

### 3A Unit evidence (on disk under this folder)

| Pack / log | Result | Notes |
|------------|--------|-------|
| `unit-orbit-pack.log` | **9/9** exit 0 | orbitControlsDefault + poseContinuityW4 + workspaceOrbitWiring |
| `unit-pose-pack.log` | **26/26** exit 0 | pose + adapter suites |
| `unit-p04-pack-raw.log` | **34/34** exit 0 | full W4 unit pack (5 files) |
| `unit-pack-deposit.json` | status open (unit seat) | deposit HEAD **`b8109733c0c7a1e0657a2989576f27060f4a6bd5`** |
| Per-suite raw logs | green | orbitControlsDefault 6; poseContinuityW4 1; workspaceOrbitWiring 2; buildOpen3dSceneNodes 11; createSceneObjectFromNode 14 |

**Unit alone ≠ W4.** Unit packs are green deposits, not a closed hard gate.

### 3B Browser evidence (on disk under this folder)

| Artifact | Result | Notes |
|----------|--------|-------|
| `browser-run.json` | `"status": "browser-green"` | furniture 0→4→4; `orbitEnabled: true`; consoleErrorCount 0 |
| `browser-w4-raw.log` / `browser-w4-playwright-live.log` / `playwright-raw.log` | **1 passed** (latest) | `open3d-w4-orbit-continuity.spec.ts` place → 3D orbit attr → 2D count |
| PNGs | present | `01-2d-after-place.png`, `02-3d-orbit-on.png`, `03-2d-restored.png` |
| HEAD pin in `browser-run.json` | **MISSING** | no tip field — cannot lock same-HEAD with unit deposit |
| Browser proves | count + `data-orbit-enabled=true` + 2D↔3D count stable + optional left-drag | **does not** prove entity ids / mm / document rotation (units only) |

### 3C Same-tip dual-green?

| Check | Status |
|-------|--------|
| Unit green deposit | YES (at `b8109733…` and earlier logs) |
| Browser green deposit | YES (artifacts on disk; latest logs 1 passed) |
| Unit HEAD == browser HEAD == tip `bb053168…` | **NO — not locked** |
| **Layer 3 closed?** | **NO** |

**Hard gate law:** `run.json` overall `status` may be **`pass`** only when unit **and** browser are green on the **same tip**. Otherwise **`open`**.

---

## Rotation honesty (supporting Layer 3 pose)

| Layer | Unit | Cite |
|-------|------|------|
| **Document furniture rotation** | **degrees** | `model/units.ts` `normalizeDegrees` / `degreesToRadians`; unit `orbitControlsDefault` degrees contract |
| **Scene nodes** | **radians** | `buildOpen3dSceneNodes.ts` **L118–119** comment + `degreesToRadians(item.rotation)` |
| **Mesh** | intentional sign flip | `createSceneObjectFromNode` `rotation.y = -node.rotation` — **not** pose drift |

Phase-card prose that says “document + scene nodes = radians” is **false** for furniture document fields. Live contract = **degrees document → radians nodes**.

---

## Three-layer scoreboard (audit write)

| Layer | Product source | Proof artifacts | Closed for W4 Done? |
|-------|----------------|-----------------|---------------------|
| **1 Defaults ON** | **CLOSED** (Inner L68 + Lazy L145 + orbitDefaults L7) | unit construct spy green | product yes; not Done alone |
| **2 Workspace wiring** | **CLOSED** (OOPlannerWorkspace L1057–1060) | workspaceOrbitWiring unit green | product yes; not Done alone |
| **3 Unit + browser same tip** | specs + deposits exist | unit green @ `b8109733…`; browser-green deposit **without** same-tip lock | **NO** |

**Overall W4 product claim: NO · coherent pack status: `open`**
