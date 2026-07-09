# P02 — Engine lock confirmation

> **For agentic workers:** REQUIRED SUB-SKILL: `/using-superpowers`. Load verification / TDD skills when collecting evidence.  
> **Scope:** Plan + evidence only until owner unlocks implementation. **Do not** re-pick engines, swap packages, or start Fabric full cutover in this phase.  
> **Checkout:** `D:\OandO07072026` only · **No worktrees** · Commit landable evidence slices as you go · Push only on owner ask.

**Goal:** Confirm once, in writing and in repo evidence, the locked 2D/3D stack from Plan A + research (`MASTER-CHART` / `ENGINE-DECISION`) so later phases stop thrashing engines and only ship product gates (W1–W8) on the locked path.

**Architecture (locked document model):**

```
Document (UUID entities, mm)
  ├── 2D destination: Fabric.js v7 full stage (flag path exists; default OFF)
  ├── 2D interim (live): FeasibilityCanvas (Canvas 2D API)
  ├── 3D: Three.js + @react-three/fiber path + OrbitControls ON by default
  ├── Catalog: O&O manufacturer SKUs + Block2D + modular mesh (not this phase)
  └── Persist: IDB first; cloud honesty later (not this phase)
```

**Tech stack (locked — do not re-debate in P03+):**

| Layer | Choice | Live today | Package / entry |
|-------|--------|------------|-----------------|
| 2D **destination** | Fabric.js v7 full stage | Furniture overlay only, flag OFF | `fabric@7.4.0` · `site/features/planner/open3d/canvas-fabric-stage/` |
| 2D **interim** | FeasibilityCanvas | Sole interactive 2D on open3d routes | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` |
| 3D planner | Three + R3F ecosystem + orbit | `Lazy3DViewer` → `ThreeViewerInner` | `three@^0.185.1`, `@react-three/fiber@^9.6.1`, `@react-three/drei@^10.7.7` |
| 3D admin single-asset | `@google/model-viewer` | Admin SVG editor preview only | `site/features/planner/admin/svg-editor/ModelViewerPreview.tsx` |
| Hybrid ban | **No** Konva + Fabric simultaneous interactive 2D | Enforced by policy + this phase | Fail gate only if Fabric spike is proven unworkable → Konva **full** (still no hybrid) |

**Authority chain (highest wins):** Owner message → `Plans/trustdata/` → `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` → Plan A `Plans/01-execution/core/` → research ideas under `D:\websites\research\2026-07-09-world-standard\` (inspiration only).

**Research sources (ideas only — no competitor code/assets/brands in product):**

| Doc | Path |
|-----|------|
| MASTER-CHART | `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md` |
| ENGINE-DECISION | `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md` |
| Engine slice report | `D:\websites\research\2026-07-09-world-standard\comparison\01-engine\REPORT.md` |
| Repo chart copy | `results/planner/world-standard-wave/COMPARISON-CHART.md` |
| Plan A canvas/engine | `Plans/01-execution/core/00A-START.md`, `Plans/01-execution/core/02B-PHASE-2B-2C.md` |
| World-standard design | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |

**Evidence root for this phase:**

`results/planner/world-standard-wave/02-engine-lock/`

**Checkpoint:** [CP-02](#checkpoint-cp-02) (hard stop before P03 select/delete).

**Default product approach (from 00-START):** Approach **A** — ship W1–W8 on Feasibility + document model first; Fabric remains destination, not abandoned.

---

## Locked stack (record — not open questions)

### 2D

| Decision | Binding text |
|----------|----------------|
| Destination | **Fabric.js v7 full stage** is the product 2D interaction engine (select/move/rotate/group tooling). Cutover is Plan A **2B.2**, not “idle insurance.” |
| Interim | **FeasibilityCanvas** remains live interactive 2D for walls/rooms/tools until Fabric walls land. Approach A may add select/delete/Block2D on Feasibility first. |
| Flag slice | Furniture-only Fabric overlay exists; **default OFF**. Enable only with exact `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1`. |
| Naming | **Fabric.js** = npm package `fabric`. **`/planner/fabric/*`** = archived legacy route under `site/features/planner/_archive/fabric/` — not the live 2D path. |
| Fail gate | Only if Fabric is **proven unworkable** with perf/UX evidence under `results/`: switch to **Konva full stage** (still one engine). **Never** hybrid Canvas+Konva+Fabric interactive layers. |

### 3D

| Decision | Binding text |
|----------|----------------|
| Engine | **Three.js** scene from document model via open3d `ThreeViewerInner` / `Lazy3DViewer`. R3F/drei remain in stack for planner 3D surfaces (including `site/features/planner/3d/Planner3DViewer.tsx`). |
| Orbit | **ON by default** (`enableControls = true` on `Lazy3DViewer` / `ThreeViewerInner`). P04 proves product continuity; P02 only locks that orbit is the chosen nav model. |
| Not planner 3D | `@google/model-viewer` is admin/single-asset orbit preview only — not the planner workspace engine. |
| Unity / other | Forbidden for planner workspace. |

### Catalog / success metric (engine-adjacent locks from research)

| Decision | Binding text |
|----------|----------------|
| Catalog pattern | Manufacturer **SKU-first** (IKEA-class pattern, O&O products) — not a 260k generic model race. |
| Success metric | **BOQ/quote path > photoreal** (do not thrash engines to chase Homestyler/Foyr renders). |
| Mesh | Modular parametric + G5–G8 path; no designer static GLB dump as product default. |

### Explicit non-goals of P02

- Implementing W3 select/delete (that is **P03**).
- Proving 2D↔3D orbit continuity browser pack (that is **P04**).
- Fabric full walls cutover (Plan A 2B.2 after W1–W8 under Approach A).
- Re-scraping competitors; rewriting chrome; cloud save wire.
- Photoreal, multiplayer CRDT, LiDAR/AR.

---

## Where flags and engine entrypoints live

### Feature flags (engine-related)

| Flag / API | File | Behavior |
|------------|------|----------|
| `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` | `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` | `OPEN3D_FABRIC_FURNITURE_ENV`; `isOpen3dFabricFurnitureEnabled()` true **only** when value is exact `"1"`. Default missing/other → OFF. |
| Barrel re-export | `site/features/planner/open3d/canvas-fabric-stage/index.ts` | Exports flag helper + `FurnitureFabricLayer` + mapper types. |
| Workspace consumer | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Calls `isOpen3dFabricFurnitureEnabled()`; when ON, hides Feasibility furniture layer and mounts `FurnitureFabricLayer`. |
| Unit coverage | `site/tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts` | Asserts flag OFF vs `"1"` enable. |
| Prior evidence | `results/planner/fabric-stage-slice/` | Mapper + flag unit pack (do not claim full Fabric stage from this). |
| Open3d README | `site/features/planner/open3d/README.md` | Documents env enable + pointer ownership rules. |

**Not the Fabric engine flag:** `site/features/planner/lib/featureFlags.ts` is the broader product flag registry (`planner2D`, `planner3D`, export/AI flags, etc.). Do **not** add a second Fabric env reader there without owner ask. Engine lock for Fabric furniture is solely `fabricFurnitureFlag.ts`.

### 2D engine files

| Role | Absolute path under repo |
|------|--------------------------|
| Live interim 2D canvas | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` |
| Fabric furniture flag | `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` |
| Fabric furniture layer | `site/features/planner/open3d/canvas-fabric-stage/FurnitureFabricLayer.tsx` |
| Fabric pose mapper | `site/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.ts` |
| Fabric stage styles | `site/features/planner/open3d/canvas-fabric-stage/furnitureFabricLayer.module.css` |
| Fabric stage barrel | `site/features/planner/open3d/canvas-fabric-stage/index.ts` |
| Workspace (2D/3D host + flag wire) | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` |
| Route host chain | `site/features/planner/ui/Open3dPlannerHost.tsx` → `site/features/planner/open3d/ui/Open3dNativeHost.tsx` → workspace |
| Guest route | `site/app/planner/(workspace)/guest/page.tsx` |
| Canvas route | `site/app/planner/(workspace)/canvas/page.tsx` |
| Open3d pilot route | `site/app/planner/open3d/page.tsx` |
| Archived Fabric workspace (not live) | `site/features/planner/_archive/fabric/` |

### 3D engine files

| Role | Absolute path under repo |
|------|--------------------------|
| Lazy 3D entry (`enableControls` default true) | `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` |
| Imperative Three viewer + OrbitControls | `site/features/planner/open3d/3d/ThreeViewerInner.tsx` |
| Scene nodes from document | `site/features/planner/open3d/3d/buildOpen3dSceneNodes.ts` |
| Mesh object creation | `site/features/planner/open3d/3d/createSceneObjectFromNode.ts` |
| Generated GLB load | `site/features/planner/open3d/3d/loadGeneratedGlbObject.ts` |
| 3D barrel | `site/features/planner/open3d/3d/index.ts` |
| R3F planner viewer (orbit/walk chips) | `site/features/planner/3d/Planner3DViewer.tsx` |
| Admin model-viewer only | `site/features/planner/admin/svg-editor/ModelViewerPreview.tsx` |
| GLB path policy | `site/features/planner/lib/glbAssetPolicy.ts` |

### Document / identity (engine-agnostic — do not couple engines to storage shapes)

| Role | Path |
|------|------|
| Entity IDs | `site/features/planner/lib/newEntityId.ts` |
| Open3d model types | `site/features/planner/open3d/model/` |
| Commands / history | `site/features/planner/open3d/store/history.ts`, `site/features/planner/open3d/store/selection.ts` |

---

## Anti-thrash rules (binding for all later phases)

1. **Decide once.** After CP-02 passes, agents must not open PRs titled “evaluate Konva”, “try Babylon”, “disable orbit permanently”, or “Fabric is only insurance” without **owner written override**.
2. **One interactive 2D engine at a time for product tools.** Flag-ON Fabric furniture overlay is a **migration spike**, not a permanent dual-CAD. Do not add a third interactive 2D library.
3. **No hybrid ban exceptions** for “just this toolbar.” Historical thrash = Canvas + Konva + Fabric simultaneous edit ownership.
4. **Archive ≠ live.** Never wire `/planner/fabric/*` as the production guest/canvas path. Live = open3d host + Feasibility (interim) + flag Fabric slice.
5. **Insurance language is invalid.** Fabric is destination until a **failed spike** with evidence under `results/` proves it unworkable; only then Konva **full** replacement.
6. **Approach A does not abandon Fabric.** Shipping select/delete on Feasibility (P03) is allowed; deleting `canvas-fabric-stage/` or the flag is not.
7. **Orbit is the default 3D nav model.** Do not ship planner 3D with controls hard-off to “fix flaky tests.” Tests must enable orbit or assert the default prop path.
8. **Admin model-viewer stays admin-only.** Do not replace `ThreeViewerInner` with model-viewer for the workspace.
9. **Research is inspiration only.** MASTER-CHART winners (RoomSketcher measure, P5D ease, IKEA SKU) inform product gates — never paste competitor UI, CSS, JS, GLB, logos, or brands into `site/`.
10. **Success metric:** Prefer BOQ/quote and plan truth over photoreal thrash that forces engine swaps.
11. **Evidence or it did not happen.** Status claims for engine lock require files under `results/planner/world-standard-wave/02-engine-lock/`.
12. **No worktrees.** All edits and evidence on main checkout `D:\OandO07072026`.

---

## Tasks

### Task 0 — Setup evidence directory and read authority

**Files / dirs:**

- Create: `results/planner/world-standard-wave/02-engine-lock/`
- Read (no edit required): this file, `Plans/trustdata/00-START.md`, `Plans/trustdata/INDEX.md`, `Plans/01-execution/core/00A-START.md` (§2D/3D engine), `Plans/01-execution/core/02B-PHASE-2B-2C.md` (§2B.2), `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` (§3–4), `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md`, `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`

**Steps:**

- [ ] 0.1 Create `results/planner/world-standard-wave/02-engine-lock/` on the main checkout.
- [ ] 0.2 Write `results/planner/world-standard-wave/02-engine-lock/README.md` stating phase goal = confirm lock, not implement Fabric cutover.
- [ ] 0.3 Confirm Approach **A** is still the active default in `Plans/trustdata/00-START.md` (or record owner override A/B/C in the evidence README).

**Done when:** Evidence folder exists; authority docs were read; approach recorded.

---

### Task 1 — Document locked stack in evidence (decision record)

**Write:** `results/planner/world-standard-wave/02-engine-lock/ENGINE-LOCK-RECORD.md`

**Must include exact tables:**

| Layer | Locked choice | Interim / notes |
|-------|---------------|-----------------|
| 2D destination | Fabric.js v7 full stage | Flag path `canvas-fabric-stage/`; default OFF |
| 2D live | FeasibilityCanvas | `canvas-feasibility/FeasibilityCanvas.tsx` |
| 3D | Three + orbit ON default | `ThreeLazyViewer` / `ThreeViewerInner` |
| Hybrid | Forbidden | No Konva+Fabric dual interactive |
| Fail-forward | Konva full only if Fabric spike fails with evidence | Still no hybrid |
| Catalog pattern | Manufacturer SKU | From ENGINE-DECISION |
| Success metric | BOQ/quote > photoreal | From MASTER-CHART §D |

**Steps:**

- [ ] 1.1 Copy decisions from ENGINE-DECISION + MASTER-CHART §D into `ENGINE-LOCK-RECORD.md` using O&O product language only (no competitor brand paste as UI).
- [ ] 1.2 Cite Plan A paths: `Plans/01-execution/core/00A-START.md`, `Plans/01-execution/core/02B-PHASE-2B-2C.md`.
- [ ] 1.3 State Approach A implication: W1–W8 may land on Feasibility first; Fabric remains destination.
- [ ] 1.4 List anti-thrash rules 1–12 from this phase file (short form is fine).

**Done when:** `ENGINE-LOCK-RECORD.md` has no open “maybe Konva now” language unless owner override is quoted.

---

### Task 2 — Flag inventory (code truth)

**Write:** `results/planner/world-standard-wave/02-engine-lock/FLAG-INVENTORY.md`

**Steps:**

- [ ] 2.1 Quote from `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts`: env name `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE`, enable rule `=== "1"`.
- [ ] 2.2 Trace consumers with search (rg) for `isOpen3dFabricFurnitureEnabled` and `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE`; paste match list into the inventory (expected: flag file, index barrel, `OOPlannerWorkspace.tsx`, unit test).
- [ ] 2.3 Record default production behavior: flag OFF → Feasibility sole furniture draw; flag ON → `FurnitureFabricLayer` overlay + Feasibility furniture layer forced off in workspace.
- [ ] 2.4 Explicitly mark `site/features/planner/lib/featureFlags.ts` as **not** controlling Fabric stage.
- [ ] 2.5 Document how to enable for local proof only:

```powershell
# repo-root .env.local — then restart next dev
NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1
```

- [ ] 2.6 Note known flag-ON limits from `site/features/planner/open3d/README.md` (pointer-events / pan-zoom desync) so agents do not claim production dual-mode.

**Done when:** Inventory paths are exact; enable rule is “exact 1 only.”

---

### Task 3 — 2D/3D entrypoint map (code truth)

**Write:** `results/planner/world-standard-wave/02-engine-lock/ENTRYPOINT-MAP.md`

**Steps:**

- [ ] 3.1 Map route → host → workspace → 2D/3D components for:
  - `/planner/open3d` → `site/app/planner/open3d/page.tsx`
  - `/planner/guest` → `site/app/planner/(workspace)/guest/page.tsx`
  - `/planner/canvas` → `site/app/planner/(workspace)/canvas/page.tsx`
- [ ] 3.2 Confirm host chain ends at `OOPlannerWorkspace` mounting:
  - 2D: `FeasibilityCanvas`
  - 3D: `Lazy3DViewer` with default `enableControls`
  - optional: `FurnitureFabricLayer` when flag ON
- [ ] 3.3 Record orbit implementation: `ThreeViewerInner.tsx` dynamic-imports `three/examples/jsm/controls/OrbitControls.js` when `enableControls` is true (default true).
- [ ] 3.4 Record secondary R3F surface: `site/features/planner/3d/Planner3DViewer.tsx` (OrbitControls from drei) — still Three ecosystem; not a second product engine choice.
- [ ] 3.5 Record admin boundary: `ModelViewerPreview.tsx` is single-asset only.
- [ ] 3.6 Record archive boundary: `site/features/planner/_archive/fabric/` is not live guest/canvas.

**Done when:** A new agent can find every engine file without grepping the whole monorepo.

---

### Task 4 — Package lock cross-check

**Write:** `results/planner/world-standard-wave/02-engine-lock/PACKAGE-PIN.md`

**Steps:**

- [ ] 4.1 Read `site/package.json` and record versions for: `fabric`, `three`, `@react-three/fiber`, `@react-three/drei`.
- [ ] 4.2 Assert Fabric major is **v7** (Plan A text: Fabric.js v7). Current pin at lock time: `fabric@7.4.0`.
- [ ] 4.3 Do **not** upgrade/downgrade packages in this phase. If versions differ from this doc after a later intentional bump, update PACKAGE-PIN evidence — do not thrash engines.
- [ ] 4.4 Confirm no Konva dependency is required for the locked stack (search `site/package.json` for `konva` / `react-konva`). Presence of unused packages does not authorize hybrid use.

**Done when:** PACKAGE-PIN lists versions with path to `site/package.json`.

---

### Task 5 — Re-run existing flag unit evidence (no product code change)

**Commands (from repo root, PowerShell):**

```powershell
New-Item -ItemType Directory -Force -Path results\planner\world-standard-wave\02-engine-lock | Out-Null
pnpm --filter oando-site exec vitest run site/tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts --reporter=verbose 2>&1 | Tee-Object -FilePath results\planner\world-standard-wave\02-engine-lock\vitest-fabric-flag-raw.log
```

**Steps:**

- [ ] 5.1 Run the command above on main checkout.
- [ ] 5.2 Save exit code and summary to `results/planner/world-standard-wave/02-engine-lock/vitest-fabric-flag-run.json` (fields: `command`, `exitCode`, `testFile`, `passed`, `failed`, `timestamp`).
- [ ] 5.3 Confirm tests cover flag OFF and `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1` ON cases.
- [ ] 5.4 If tests fail: stop and log in root `Failures.md` — do **not** “fix” by deleting the flag or inventing a second env reader.

**Done when:** Log + run.json exist; exit code 0 or failure filed honestly.

---

### Task 6 — Owner confirmation checkboxes

Owner (human) marks these in this plan file **and** copies the checked state into `results/planner/world-standard-wave/02-engine-lock/OWNER-SIGN OFF.md` (filename may be `OWNER-SIGNOFF.md` if OS dislikes spaces).

**Engine lock:**

- [ ] Owner approves **Fabric.js v7 full stage** as 2D **destination**
- [ ] Owner approves **FeasibilityCanvas** as 2D **interim** under Approach A
- [ ] Owner approves **Three + orbit ON** as planner 3D
- [ ] Owner approves **no Konva + Fabric hybrid**
- [ ] Owner approves fail-forward: Konva **full** only after failed Fabric spike with evidence
- [ ] Owner approves Fabric furniture flag remains **default OFF** until explicit cutover work

**Product strategy (from research, engine-adjacent):**

- [ ] Owner approves manufacturer SKU catalog strategy (O&O products)
- [ ] Owner approves success metric **BOQ/quote path > photoreal**
- [ ] Owner confirms Approach **A** (or writes B/C override in 00-START)

**Process:**

- [ ] Owner unlocks later phases (P03+) for implementation after CP-02
- [ ] Owner acknowledges anti-thrash rules bind agents without re-litigation

**Steps for agent:**

- [ ] 6.1 Present the checkbox list in chat / handover with paths to ENGINE-LOCK-RECORD + FLAG-INVENTORY.
- [ ] 6.2 Do not start P03 implementation until owner checkboxes (or explicit “plan only continue”) are recorded.
- [ ] 6.3 If owner silent and prior 00-START default applies: Approach A may continue **planning**; engine lock still requires owner sign-off before claiming CP-02 green for execution waves.

**Done when:** Sign-off file exists with owner marks or an explicit written deferral.

---

### Task 7 — Anti-thrash enforcement checklist (agent self-audit)

**Write:** `results/planner/world-standard-wave/02-engine-lock/ANTI-THRASH-AUDIT.md`

**Steps:**

- [ ] 7.1 Grep `site/features/planner` for new interactive 2D libs (`konva`, `react-konva`, `pixi`, `paper.js`) introduced as product path — report hits.
- [ ] 7.2 Grep for docs/comments still calling Fabric “insurance only” under live open3d paths; list files to correct **in a later docs pass** (do not mass-rewrite unless owner asks in this phase).
- [ ] 7.3 Confirm `OOPlannerWorkspace` does not import `_archive/fabric` for live tools.
- [ ] 7.4 Confirm orbit default remains true in `ThreeLazyViewer.tsx` / `ThreeViewerInner.tsx`.
- [ ] 7.5 State: “P03+ must not reopen engine choice.”

**Done when:** Audit file lists greps + conclusions; any thrash risk is filed to `Failures.md` if code already violates lock.

---

### Task 8 — Checkpoint pack + phase exit

**Write:** `results/planner/world-standard-wave/02-engine-lock/CP-02-SUMMARY.md`

**Steps:**

- [ ] 8.1 List all artifacts produced under `02-engine-lock/`.
- [ ] 8.2 One-paragraph honest status: engines locked; Fabric not fully cut over; Feasibility live; orbit default on; flag OFF.
- [ ] 8.3 Next phase pointer: `Plans/trustdata/phases/P03-select-delete.md` (**W3**).
- [ ] 8.4 Commit evidence + this plan on main checkout when landable (“commit as we go”); do not push unless owner asks.

**Done when:** CP-02 summary exists and [Checkpoint CP-02](#checkpoint-cp-02) boxes can be checked from evidence paths.

---

## Checkpoint CP-02

**Gate name:** Engine lock confirmed — stop thrash  
**Evidence directory:** `results/planner/world-standard-wave/02-engine-lock/`  
**Hard stop:** Do not execute P03 product code until CP-02 is green **or** owner explicitly waives in writing.

| # | Requirement | Proof path |
|---|-------------|------------|
| CP-02.1 | Locked stack written (Fabric destination, Feasibility interim, Three+orbit, no hybrid) | `.../02-engine-lock/ENGINE-LOCK-RECORD.md` |
| CP-02.2 | Flag location + enable rule documented | `.../02-engine-lock/FLAG-INVENTORY.md` + `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` |
| CP-02.3 | Entrypoint map complete for open3d/guest/canvas | `.../02-engine-lock/ENTRYPOINT-MAP.md` |
| CP-02.4 | Package pins recorded from `site/package.json` | `.../02-engine-lock/PACKAGE-PIN.md` |
| CP-02.5 | Fabric flag unit re-run logged | `.../02-engine-lock/vitest-fabric-flag-raw.log` + `vitest-fabric-flag-run.json` |
| CP-02.6 | Owner engine checkboxes recorded | `.../02-engine-lock/OWNER-SIGNOFF.md` (or plan Task 6 marks + owner message) |
| CP-02.7 | Anti-thrash audit complete | `.../02-engine-lock/ANTI-THRASH-AUDIT.md` |
| CP-02.8 | Summary points to P03 | `.../02-engine-lock/CP-02-SUMMARY.md` |

**CP-02 owner checkboxes:**

- [ ] CP-02.1 satisfied  
- [ ] CP-02.2 satisfied  
- [ ] CP-02.3 satisfied  
- [ ] CP-02.4 satisfied  
- [ ] CP-02.5 satisfied (pass or honest fail filed)  
- [ ] CP-02.6 satisfied  
- [ ] CP-02.7 satisfied  
- [ ] CP-02.8 satisfied  
- [ ] **Unlock P03** (select/delete / W3)

---

## What “done” means for P02

P02 is **done** when:

1. The locked stack is unambiguous in evidence (not only in this plan).
2. Every agent knows **where flags live** (`fabricFurnitureFlag.ts` first).
3. Owner checkboxes (or written override) exist.
4. Anti-thrash rules are filed and grepped.
5. No engine package churn was introduced “for exploration.”

P02 is **not** done when:

- Fabric full stage is still flag-OFF (that is expected).
- Select/delete still broken (P03).
- Orbit product journey unproven in Playwright (P04).

---

## Related paths (quick index)

| Concern | Path |
|---------|------|
| This phase | `Plans/trustdata/phases/P02-engine-lock.md` |
| Start / phase order | `Plans/trustdata/00-START.md` |
| Index | `Plans/trustdata/INDEX.md` |
| Prev | `Plans/trustdata/phases/P01-product-truth.md` |
| Next | `Plans/trustdata/phases/P03-select-delete.md` |
| Plan A 2B.2 | `Plans/01-execution/core/02B-PHASE-2B-2C.md` |
| World-standard design | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |
| Fabric flag | `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` |
| Live 2D | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` |
| Live 3D | `site/features/planner/open3d/3d/ThreeLazyViewer.tsx`, `ThreeViewerInner.tsx` |
| Workspace | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` |
| Evidence | `results/planner/world-standard-wave/02-engine-lock/` |
| Prior Fabric slice evidence | `results/planner/fabric-stage-slice/` |
| Research MASTER-CHART | `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md` |
| Research ENGINE-DECISION | `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md` |
