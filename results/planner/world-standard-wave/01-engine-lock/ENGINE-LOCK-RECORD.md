# ENGINE-LOCK-RECORD — P02 Fabric-sole freeze (upgrade)

**Phase:** P02 engine lock (CP-02) — evidence + unit re-prove  
**Evidence folder (canonical):** `results/planner/world-standard-wave/01-engine-lock/`  
**Never use:** `02-engine-lock/`  
**Record date:** 2026-07-11  
**HEAD:** see `HEAD.txt` / `run.json` / `RUN-META.json`  
**Authority:** live source under `site/` — **not** prior pack text that freezes Feasibility interim (that was a **downgrade freeze**).

---

## Freeze statement (live repo truth — upgrade lock)

This phase **documents and unit-re-proves** the already-shipped **Fabric-sole** stack. No product engine swap. No Feasibility un-archive. No Konva. Do not re-open engines in P03+ without owner.

### 1. 2D host — Fabric.js v7 sole (product)

| Claim | Live truth |
|-------|------------|
| Sole interactive plan canvas | `PlannerCanvasStage` barrel → `Open3dFabricStage` |
| Barrel | `site/features/planner/open3d/canvas-stage/index.ts` re-exports `Open3dFabricStage as PlannerCanvasStage` from `@/features/planner/canvas-fabric-stage/Open3dFabricStage` |
| Implementation | Fabric.js **v7** stage — walls + furniture drawn **in** stage (layer visibility) |
| DOM proof id | `data-testid="open3d-fabric-stage"` |
| Workspace mount | `OOPlannerWorkspace.tsx` mounts **only** `<PlannerCanvasStage … />` in 2D mode — no flag branch, no second host |

**Source:** `OOPlannerWorkspace.tsx` imports from `../canvas-stage`; mount ~L1093–1116.  
**Unit proof:** `hostWiringP01.test.ts` — workspace has `PlannerCanvasStage`; **no** `FeasibilityCanvas` / `canvas-feasibility` / `isOpen3dFabricFurnitureEnabled` wire.

### 2. FeasibilityCanvas — retired from product (not interim)

| Claim | Live truth |
|-------|------------|
| Product 2D host | **Not** Feasibility |
| Live open3d tree | **No** `canvas-feasibility/` under `site/features/planner/open3d/` |
| Workspace | **No** `FeasibilityCanvas` import or mount |
| Plan card archive path | Cards name `_archive/canvas-feasibility/` — **that directory is not present** on this tip; residual only: `site/app/css/core/locked/planner/workspace-FeasibilityCanvas.css` + unrelated geometry suite `feasibility.test.ts` |
| Restore | **Owner unlock only** — do not re-mount as product 2D to “prove” W3/W5/W8 |

**Hard ban:** Any plan that freezes “Feasibility interim / Fabric overlay when flag ON” is a **downgrade** and must be rejected.

### 3. Flag leftover — module + tests only (not product host switch)

| Claim | Live truth |
|-------|------------|
| Env key | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` (`OPEN3D_FABRIC_FURNITURE_ENV`) |
| Enable predicate | `env[key] === "1"` only |
| Reader | `site/features/planner/canvas-fabric-stage/fabricFurnitureFlag.ts` → `isOpen3dFabricFurnitureEnabled()` |
| Workspace wire | **None** — `OOPlannerWorkspace` does not call the flag |
| Product host switch | **No** — Fabric stage is always the 2D host |

**Unit proof:** `furnitureFabricMapper.test.ts` (flag + mapper) + `hostWiringP01` asserts flag not in workspace source.

### 4. FurnitureFabricLayer — spike leftover

| Claim | Live truth |
|-------|------------|
| File | `canvas-fabric-stage/FurnitureFabricLayer.tsx` |
| Barrel export | yes (mapper/flag suite) |
| Mounted by workspace | **No** |

### 5. Orbit — product authority (Three + orbit ON)

| Claim | Live truth |
|-------|------------|
| Default constant | `OPEN3D_ORBIT_DEFAULT_ENABLED = true` in `orbitDefaults.ts` |
| Product helper | `getOpen3dViewerControlProps(): { enableControls: true }` |
| Workspace mount | `<Lazy3DViewer … {...getOpen3dViewerControlProps()} />` |

**Unit proof:** `orbitControlsDefault.test.tsx`.

### 6. Package pins (`site/package.json`)

| Package | Pinned / range (live) |
|---------|------------------------|
| `fabric` | **`7.4.0`** (exact) |
| `three` | `^0.185.1` |
| `@react-three/fiber` | `^9.6.1` |
| `@react-three/drei` | `^10.7.7` |
| `@google/model-viewer` | `^4.3.1` (admin / preview path) |

### 7. Hybrid ban — Konva absent · one interactive 2D host

| Claim | Live truth |
|-------|------------|
| `konva` / `react-konva` | **Absent** from `site/package.json` |
| Second interactive 2D product host | **Banned** |
| Archive Fabric shell | `site/features/planner/_archive/fabric/` — routes `/planner/fabric*` redirect to `/planner/open3d/` |

### 8. Host wiring (P01 chain)

| URL | Chain |
|-----|--------|
| `/planner/guest`, `/planner/canvas` | WorkspaceRoute → `Open3dPlannerHost` → `OOPlannerWorkspace` → **Fabric** `PlannerCanvasStage` + Three |
| `/planner/open3d` | Direct `Open3dPlannerHost` → same workspace |

### 9. Product edits this re-prove

| Claim | Status |
|-------|--------|
| Product / engine source changes | **None this seat** — pack rewrite + unit re-prove only |
| Engine rebuild / Feasibility restore / package bump | **Out of scope** |

---

## Unit freeze pack (this run)

| Suite | Path | Log | Exit |
|-------|------|-----|------|
| Orbit | `tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx` | `unit-freeze-pack.log` | 0 |
| Host wiring | `tests/unit/features/planner/open3d/hostWiringP01.test.ts` | same | 0 |
| Fabric mapper + flag | `tests/unit/features/planner/canvas-fabric-stage/furnitureFabricMapper.test.ts` | same | 0 |

**Totals:** 3 files · **29 tests passed** · all exit 0.

---

## Out of band (not this phase)

- Do **not** prove W3/W5/W8 in this pack.
- Chrome smoke prior artifacts may remain under this folder — optional; not required to re-claim Fabric-sole freeze.
- Owner sign-off remains **OPEN** until human marks or written deferral (`OWNER-SIGNOFF-STATUS.md`).
