# ENGINE-LOCK-RECORD — P02 Approach A freeze re-prove

**Phase:** P02 engine lock (evidence only — **no product edits**)  
**Evidence folder (canonical):** `results/planner/world-standard-wave/01-engine-lock/`  
**Never use:** `02-engine-lock/` (reserved for other wave work)  
**Record date:** 2026-07-10  
**HEAD:** see `HEAD.txt` / `run.json`  
**Verdict context:** `plans1/P02-engine-lock/CODE-REVIEW-REPORT.md` → **APPROVE-WITH-FIXES** (re-prove only; do not rebuild engines)

---

## Freeze statement (live repo truth)

This phase **documents and unit-re-proves** the already-shipped stack. No Fabric cutover, no package upgrades, no Konva, no P03/P04 product work.

### 1. 2D interim — FeasibilityCanvas (Canvas 2D API)

| Claim | Live truth |
|-------|------------|
| Sole furniture/walls path when Fabric flag **OFF** | `FeasibilityCanvas` from `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` mounted in `OOPlannerWorkspace.tsx` |
| Implementation | Native Canvas 2D context (`getContext("2d")`) — not Fabric, not Konva |
| When Fabric ON | Workspace sets `feasibilityLayerVisibility` with `furniture: false` and mounts Fabric furniture overlay; **walls stay on FeasibilityCanvas** |

**Source:** `OOPlannerWorkspace.tsx` ~232–241, ~924–958; `FeasibilityCanvas.tsx`.

### 2. Fabric — exact env `"1"` only

| Claim | Live truth |
|-------|------------|
| Env key | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` (`OPEN3D_FABRIC_FURNITURE_ENV`) |
| Enable predicate | `env[key] === "1"` only |
| Default | **OFF** (missing / `"true"` / `"yes"` / `"0"` / other → false) |
| Stage code | `site/features/planner/open3d/canvas-fabric-stage/` (spike / optional overlay) |
| Reader | `fabricFurnitureFlag.ts` → `isOpen3dFabricFurnitureEnabled()` |

**Unit proof:** `furnitureFabricMapper.test.ts` (flag + mapper suite) — log `fabricMapper.log`.

### 3. Orbit — product authority

| Claim | Live truth |
|-------|------------|
| Default constant | `OPEN3D_ORBIT_DEFAULT_ENABLED = true` in `orbitDefaults.ts` |
| Product helper | `getOpen3dViewerControlProps(): { enableControls: true }` |
| Workspace mount | `<Lazy3DViewer {...getOpen3dViewerControlProps()} />` (~1010–1012) |
| Viewer default | `ThreeViewerInner` / `ThreeLazyViewer` default `enableControls = OPEN3D_ORBIT_DEFAULT_ENABLED` |

**Unit proof:** `orbitControlsDefault.test.tsx` — log `orbitControlsDefault.log`.

### 4. Package pins (`site/package.json`)

| Package | Pinned / range (live) |
|---------|------------------------|
| `fabric` | **`7.4.0`** (exact) |
| `three` | `^0.185.1` |
| `@react-three/fiber` | `^9.6.1` |
| `@react-three/drei` | `^10.7.7` |
| `@google/model-viewer` | `^4.3.1` (admin / preview path) |

### 5. Hybrid ban — Konva absent

| Claim | Live truth |
|-------|------------|
| `konva` | **Absent** from `site/package.json` |
| `react-konva` | **Absent** from `site/package.json` |

### 6. Host wiring (P01 chain still true)

| Claim | Live truth |
|-------|------------|
| guest / canvas | Open3d hybrid host → workspace (Feasibility + Three) |
| `/planner/open3d` | Native open3d pilot host |
| Fabric furniture | Gated by `isOpen3dFabricFurnitureEnabled` (default OFF) |

**Unit proof:** `hostWiringP01.test.ts` — log `hostWiringP01.log`.

### 7. Product edits this phase

| Claim | Status |
|-------|--------|
| Product / engine source changes | **None** — evidence pack only under `results/planner/world-standard-wave/01-engine-lock/` |
| Engine rebuild / Fabric cutover / package bump | **Out of scope** |

---

## Unit freeze pack (this run)

| Suite | Path | Log | Exit |
|-------|------|-----|------|
| Orbit | `tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx` | `orbitControlsDefault.log` | 0 |
| Host wiring | `tests/unit/features/planner/open3d/hostWiringP01.test.ts` | `hostWiringP01.log` | 0 |
| Fabric mapper + flag | `tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts` | `fabricMapper.log` | 0 |

Optional combined: `unit-freeze-pack.log` if present.

---

## Out of band (not this phase)

- Chrome-devtools / browser smoke for open3d journey may land under other wave folders (e.g. `02-browser-open3d-journey/`) — **not required** for this freeze re-prove pack.
- No rebuild of flag, fabric stage, Feasibility, orbitDefaults, or host chains.
