# CP-04-SCRATCH-VERDICT — P04 Scratch Agent 3 (independent score)

| Field | Value |
|-------|--------|
| **Seat** | P04 Scratch Agent 3 — independent score after agents 0–2 |
| **Date** | 2026-07-10 |
| **Checkout** | `D:\OandO07072026` only (no worktrees) |
| **Tip at score** | `d4c80c35bcc0a6b3ec1dcba3a96c7986be3ecb5a` (re-read after pull; tip moves with trustdata stamps) |
| **Bar** | NO PAPER MOON. Plan score ≠ product. Unit alone ≠ W4. Pass only if unit + browser green on **same HEAD**. |
| **Evidence root** | `results/planner/world-standard-wave/04-orbit-continuity/` |

---

## Explicit voids (read first)

| Claim source | Status this seat |
|--------------|------------------|
| Phase-card `P04-orbit-continuity.md` **PASS 2026-07-09** | **VOID / paper** — not product proof on this tip |
| Plan rating APPROVE-WITH-FIXES **7.5 / 10** | **≠ product** — brief quality only; does not authorize W4 PASS |
| Historical `browser-run.json` / NOTES from 968efb36 era | **Not inherited** as this-tip dual-green |
| Unit 34/34 alone | **≠ W4 overall** |
| Soft paper `status: pass` without same-HEAD dual logs | **Forbidden** |

---

## 1. Product three-layer (code only — live read)

Independent re-read of product lines on tip (product open3d orbit path unchanged since wiring land `f692ca96`):

### Layer 1 — defaults ON → **CLOSED**

| Cite | Fact |
|------|------|
| `site/features/planner/open3d/3d/orbitDefaults.ts` **L7** | `OPEN3D_ORBIT_DEFAULT_ENABLED = true as const` |
| same **L13–15** | `getOpen3dViewerControlProps(): { enableControls: true }` |
| `ThreeLazyViewer.tsx` **L145** | `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED` |
| `ThreeViewerInner.tsx` **L68** | `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED` |
| `ThreeViewerInner.tsx` **L171–186** | `new OrbitControls(...)` when enabled; damping 0.08; polar clamp; dist 1–40 |

### Layer 2 — workspace explicit wiring → **CLOSED**

| Cite | Fact |
|------|------|
| `OOPlannerWorkspace.tsx` **L13–16** | imports `Lazy3DViewer`, `getOpen3dViewerControlProps` |
| same **L1057–1060** | `<Lazy3DViewer projectData={…} {...getOpen3dViewerControlProps()} />` |

Defaults alone would be FAIL for W4; explicit spread is present.

### Layer 3 — DOM attr + construct path (code) → **CLOSED** (code); proof dual → **OPEN**

| Cite | Fact |
|------|------|
| `ThreeViewerInner.tsx` **L77–78** | `orbitEnabled` state starts false; set after construct |
| same **L340** | `data-orbit-enabled={orbitEnabled ? "true" : "false"}` on `three-viewer-container` |

**Product-layer table**

| Layer | From code | Status |
|-------|-----------|--------|
| **1 Defaults** | constant + Lazy + Inner ON + OrbitControls construct | **CLOSED** |
| **2 Workspace** | spread `getOpen3dViewerControlProps()` | **CLOSED** |
| **3 DOM / dual proof** | attr in code **CLOSED**; unit+browser same HEAD | **OPEN** (proof gate) |

---

## 2. Unit pack — this tip / deposited evidence

**Verdict: pass** (green deposits on disk; product under test unchanged)

| Artifact | Result | Notes |
|----------|--------|-------|
| `unit-orbit-pack.log` | **9/9** exit 0 | orbit + wiring + poseContinuityW4 |
| `unit-pose-pack.log` | **26/26** exit 0 | pose + buildSceneNodes + createSceneObject |
| `unit-p04-pack-raw.log` / `unit-p04-scratch-pack-raw.log` | **34/34** exit 0 | 5-file pack |
| `unit-pack-deposit.json` | status open; pack 34/34 | **HEAD pin:** `b8109733…` |
| `NOTES-unit-pack.md` | 34 passed | same deposit HEAD |
| `unit-p04-pack-consolidator-tip.log` | **34/34** | Start at 19:20:12 (no SHA in log body) |
| Per-suite raw logs | green | orbitControlsDefault 6; workspaceOrbitWiring 2; poseContinuityW4 1; adapters 11+14 |

**Honesty:** unit deposit is pinned to **`b8109733`**, not to the browser commit or latest tip. Product orbit files did not change after that deposit, but **same-HEAD dual lock is still missing** in the evidence stamps.

---

## 3. Browser — this tip / deposited evidence

**Verdict: pass** (current Playwright tees green + real PNGs + success `browser-run.json`)

| Artifact | Result | Notes |
|----------|--------|-------|
| `browser-w4-raw.log` | **1 passed** | `open3d-w4-orbit-continuity.spec.ts` |
| `browser-w4-playwright-live.log` | **1 passed** (same worker path) | earlier red run was superseded on disk by later green tees |
| `browser-run.json` | `status: browser-green` | written by successful e2e path |
| `01-2d-after-place.png` | present | 2D + 4 furniture after Place 4 seats |
| `02-3d-orbit-on.png` | present | 3D mode + workstations visible |
| `03-2d-restored.png` | present | 2D restored |
| Commit `6c236ac6` | browser re-prove trustdata | count + orbit attr; H3 honest (not ids/mm/rot) |

**Browser proves (H3):** furniture **count**, `data-orbit-enabled=true`, 2D↔3D count stable, optional left-drag no crash.  
**Browser does not prove:** entity ids, mm position, document rotation degrees (units only).

**Honesty / residual:**

- No SHA field inside `browser-run.json` — HEAD pin not dual-locked with unit deposit.
- Console hard fail-closed still soft in spec (`consoleErrorCount` recorded; no `expect(hardAppErrors).toEqual([])` / no `console-messages.txt`).
- Concurrent `CODE-REVIEW-LIVE.md` captured an earlier **RED** Place-timeout; **this seat scores current disk logs**, which are green after re-prove.

---

## 4. Same-HEAD dual gate

| Requirement | Met? |
|-------------|------|
| Unit green | **YES** (deposit) |
| Browser green | **YES** (current logs + PNGs) |
| **Both on same documented HEAD** | **NO** — unit pin `b8109733` ≠ browser re-prove / tip stamps (`6c236ac6` / later trustdata) |
| Coherent single `run.json` before this seat | Stale / conflicting (code-review said browser missing/RED while artifacts later green) |

**Therefore overall W4 / CP-04 product claim = OPEN** (not PASS, not FAIL of product architecture).

---

## 5. Overall W4

| Axis | Result |
|------|--------|
| Product layers 1–2 + L3 code | **CLOSED** |
| Unit pack | **pass** |
| Browser pack | **pass** (disk re-prove) |
| **Overall W4** | **OPEN** |
| Phase-card PASS | **VOID** |
| Plan 7.5 | **≠ product** |

### Overall: **OPEN**

**Why not PASS:** hard gate requires unit + browser green on **one** pinned HEAD. Deposits are both green but **not same-HEAD locked**.  
**Why not FAIL:** product three-layer code is present; unit and browser artifacts currently green — architecture is not broken; proof pack is incomplete / unpinned.

---

## 6. Residuals (do not thrash product)

1. Re-run **unit 5-file pack + Playwright W4** on one tip; stamp **one** `HEAD.txt` + rewrite `run.json` together.  
2. Optionally hard-assert console + `console-messages.txt` (plan H1).  
3. Keep Done language: browser = count + orbit attr; pose identity = units.  
4. Do not resurrect phase-card PASS without dual-green same HEAD.

---

## 7. Agent 3 return code

```
overall: OPEN
```
