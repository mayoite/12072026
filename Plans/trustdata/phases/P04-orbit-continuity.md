# P04 — Orbit Continuity (W4)

> **For agentic workers:** REQUIRED: `/using-superpowers` + skills as fit (`test-driven-development`, `verification-before-completion`, `systematic-debugging`, `chrome-devtools` for live checks). Do **not** implement until owner unlocks after workflow briefing. Checkboxes track execution progress.
>
> **Gate W4:** 2D↔3D toggle preserves **entity pose**; **3D orbit** is **enabled by default**. Proof: unit green now · Playwright + console clean under evidence dir (this phase lays the Playwright contract; full journey may share `02-browser-open3d-journey` once P07 lands).

**Parent:** [00-START.md](../00-START.md) · [INDEX.md](../INDEX.md)  
**Design authority:** `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §W4  
**Prev:** [P03-select-delete.md](./P03-select-delete.md) · **Next:** [P05-symbols-svg.md](./P05-symbols-svg.md)  
**Checkpoint:** **CP-04** (see end of this file + `checkpoints/CHECKPOINTS.md`)  
**Evidence root:** `results/planner/world-standard-wave/04-orbit-continuity/`  
**Approach:** **A** (product journey on FeasibilityCanvas + document model)

---

## Goal

A facilities buyer on `/planner/open3d` (or guest) can:

1. Place furniture in **2D**, switch to **3D**, and see the **same entity ids, position (mm), and rotation**.
2. Switch **3D → 2D → 3D** without pose drift or id rewrite.
3. **Orbit** the 3D scene immediately (no hidden “enable orbit” toggle, no orbit-off default).
4. Leave a **clean console** on the 2D↔3D path.

**Out of scope this phase (do not expand):** mesh photoreal (P08), save honesty (P06), select/delete (P03), Fabric full-stage cutover, walk/first-person camera, competitor UI copy.

---

## Architecture (data as truth)

```
Open3dProject (UUID entities, mm)
    │  position + rotation on furniture / wall geometry
    ├── 2D: FeasibilityCanvas reads project (OOPlannerWorkspace viewMode === "2d")
    └── 3D: Lazy3DViewer → ThreeViewerInner
              └── buildOpen3dSceneNodes(project) → meshes tagged userData.entityId
              └── OrbitControls when enableControls === true (DEFAULT ON)
```

**Continuity rule:** View mode is chrome only. **Document** is the only pose authority. Switching modes must **not** mutate furniture `position` / `rotation` / `id`. 3D rebuilds from `buildOpen3dSceneNodes`; it must not invent new poses.

**Orbit rule (inspiration pattern only — research, not plagiarism):** Industry web planners treat **orbit/pan/zoom as the default 3D navigation** (Sketchfab-style orbit grammar; Planner5D/Floorplanner explicit 2D|3D toggler with state continuity). O&O ships **our** OrbitControls wiring on Three.js examples controls — MIT Three package — custom chrome, no competitor assets/code.

---

## Tech stack (locked)

| Layer | Choice |
|-------|--------|
| Workspace | `OOPlannerWorkspace` + `WorkspaceShell` / `TopBar` 2D\|3D radiogroup |
| 2D interim | `FeasibilityCanvas` |
| 3D | Three.js + `three/examples/jsm/controls/OrbitControls.js` via `ThreeViewerInner` |
| Lazy mount | `ThreeLazyViewer` (`Lazy3DViewer`) |
| Pose model | `Open3dFurnitureItem.position` / `.rotation` + wall geometry in `open3d/model/types.ts` |
| Unit tests | Vitest |
| Browser (later in phase / shared journey) | Playwright |

---

## Honest baseline (repo facts before edits)

| Fact | Path / evidence |
|------|-----------------|
| View mode local state `"2d" \| "3d"` | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` — `useState`; TopBar radiogroup |
| 3D branch mounts | `viewMode === "2d" ? Feasibility… : <Lazy3DViewer projectData={workspaceCanvas.project} />` |
| Lazy props default `enableControls = true` | `ThreeLazyViewer.tsx` |
| Orbit constructed when `enableControls` | `ThreeViewerInner.tsx` — `new OrbitControls(camera, renderer.domElement)` + damping |
| Document → nodes pose map | `buildOpen3dSceneNodes.ts` — `xMm/yMm/rotation` from furniture |
| Pure unit continuity already green | `tests/unit/features/planner/open3d/documentViewContinuity.test.ts` · `results/planner/document-view-continuity/` |
| WAVE note “no orbit” | `results/planner/world-standard-wave/WAVE.md` — treat as **stale product claim** until re-verified; code path defaults ON but **must be asserted** (explicit prop, testids, Playwright drag) |
| Legacy R3F orbit memory (inspiration only) | `site/features/planner/3d/Planner3DViewer.tsx` camera memory — **do not** copy into open3d unless needed; W4 is **entity pose**, not camera bookmark |

**Gaps this phase closes:**

1. **Explicit contract** that open3d always passes `enableControls={true}` (no silent default drift).
2. **Unit/TDD** for orbit-default + enableControls plumbing + pose stable across simulated 2D↔3D rebuilds.
3. **DOM/test hooks** so Playwright can prove orbit + continuity without brittle internals.
4. **Evidence folder** `04-orbit-continuity/` with commands, logs, and (when unlocked for browser) screenshots.

---

## File map (touch only these for W4)

| Role | Absolute path |
|------|----------------|
| Orbit host | `D:\OandO07072026\site\features\planner\open3d\3d\ThreeViewerInner.tsx` |
| Lazy wrapper + defaults | `D:\OandO07072026\site\features\planner\open3d\3d\ThreeLazyViewer.tsx` |
| View mode + project into 3D | `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx` |
| Toggle chrome | `D:\OandO07072026\site\features\planner\open3d\editor\TopBar.tsx` (only if labels/testids needed) |
| Entity pose types | `D:\OandO07072026\site\features\planner\open3d\model\types.ts` (read; edit only if pose fields wrong — expected **no change**) |
| Pure pose adapter | `D:\OandO07072026\site\features\planner\open3d\3d\buildOpen3dSceneNodes.ts` (read/extend tests; code change only if pose bug found) |
| Existing continuity unit | `D:\OandO07072026\site\tests\unit\features\planner\open3d\documentViewContinuity.test.ts` |
| **New** orbit contract unit | `D:\OandO07072026\site\tests\unit\features\planner\open3d\orbitControlsDefault.test.ts` |
| **New** lazy props contract unit | `D:\OandO07072026\site\tests\unit\features\planner\open3d\threeLazyViewerOrbit.test.tsx` |
| Playwright (phase end / shared) | `D:\OandO07072026\site\tests\e2e\open3d-world-standard-journey.spec.ts` (create or extend; W4 section) |
| Evidence | `D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity\` |

Do **not** thrash `Planner3DViewer.tsx` (non-open3d path) unless a shared pure helper is extracted for tests.

---

## Task list (TDD first)

### Task 00 — Setup / evidence scaffold

**Skills:** verification-before-completion  

- [ ] Create `results/planner/world-standard-wave/04-orbit-continuity/` if missing.
- [ ] Write `NOTES.md` in that folder with HEAD commit, approach A, W4 wording, files planned.
- [ ] Confirm P03 (select/delete) is not required to *complete unit work* for orbit; browser journey may still need a placed item from inventory (document can be seeded in unit tests without P03 UI).

**Done when:** folder exists; NOTES records scope; no product code changed yet.

---

### Task 01 — RED: unit contract for entity pose continuity (2D↔3D same project)

**Skills:** test-driven-development  

**File:** extend `site/tests/unit/features/planner/open3d/documentViewContinuity.test.ts`  
**or** add sibling `viewModePoseContinuity.test.ts` if file is getting crowded — prefer **one focused file** still under `tests/unit/features/planner/open3d/`.

**Cases (all pure; no WebGL):**

1. **Stable ids across rebuild:** After `addFurniture` + `updateFurniture` pose, two consecutive `buildOpen3dSceneNodes(project)` calls return identical `id`, `xMm`, `yMm`, `rotation` for furniture.
2. **Simulated view toggle:** Mutate nothing on project; call `buildOpen3dSceneNodes` → hold snapshot → call again (models “leave 3D unmount / remount”). Snapshots deep-equal for furniture pose fields.
3. **Pose edit survives “return to 2D”:** `updateFurniture` position/rotation; rebuild nodes; assert node pose equals document furniture pose (not degrees/radians mix-up). Document stores rotation as used by `buildOpen3dSceneNodes` today (radians about vertical for nodes — assert exact equality with what the pure action stores).
4. **Wall + furniture both continuous:** wall id and furniture id unchanged after pose-only furniture update.

**Commands:**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose
```

If new file:

```powershell
npx vitest run tests/unit/features/planner/open3d/viewModePoseContinuity.test.ts --reporter=verbose
```

**Evidence:** pipe via `scripts/run-evidence-cmd.ps1` or project equivalent into  
`results/planner/world-standard-wave/04-orbit-continuity/` as `pose-continuity-vitest-raw.log` + `pose-continuity-run.json`.

**Done when:** new assertions exist; if already green from prior work, still re-run and land evidence under **04-orbit-continuity** (do not rely only on `results/planner/document-view-continuity/`).

---

### Task 02 — RED: unit contract for orbit default ON

**Skills:** test-driven-development  

**New file:** `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.ts`

**Intent:** Lock product rule without full WebGL if possible.

**Concrete assertions:**

1. **Prop default:** Export or re-export a tiny pure helper from the 3D module if needed, e.g. `export const OPEN3D_ORBIT_DEFAULT_ENABLED = true as const`, **or** test via `Lazy3DViewer` / `ThreeViewerInner` default props with React Testing Library (mock dynamic `import("three")` and OrbitControls module).
2. **Explicit workspace wiring:** Grep-level unit or source contract test that `OOPlannerWorkspace` 3D branch passes `enableControls={true}` (preferred: small pure `getOpen3dViewerControlProps()` returning `{ enableControls: true }` used by workspace — avoids brittle string greps).
3. **False is opt-out only:** Document in test name that `enableControls={false}` is allowed for tests/stories, **never** the open3d product default.

**Implementation shape (when green):**

```ts
// preferred thin helper — only if workspace wiring is not already obvious
export function getOpen3dViewerControlProps(): { enableControls: true } {
  return { enableControls: true };
}
```

Place helper in `ThreeLazyViewer.tsx` or `open3d/3d/orbitDefaults.ts` — pick one file, export once, use from workspace.

**Mock strategy for component tests:**

- Mock `three` and `three/examples/jsm/controls/OrbitControls.js` so constructors are spies.
- Mount `ThreeViewerInner` with `enableControls` omitted → assert OrbitControls constructor **called**.
- Mount with `enableControls={false}` → assert OrbitControls constructor **not** called.

**Commands:**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.ts --reporter=verbose
```

**Evidence:** `04-orbit-continuity/orbit-default-vitest-raw.log` + `orbit-default-run.json`.

**Done when:** red→green path defined; tests fail if someone flips default to false or removes OrbitControls construction.

---

### Task 03 — GREEN: enable / harden orbit in ThreeViewerInner + Lazy3DViewer

**Skills:** test-driven-development, systematic-debugging  

**Files:**

- `ThreeViewerInner.tsx`
- `ThreeLazyViewer.tsx`

**Required product behavior:**

| Control | Setting |
|---------|---------|
| `enableControls` default | `true` |
| Orbit | constructed whenever `enableControls` |
| Damping | `enableDamping = true`, `dampingFactor ≈ 0.08` (keep current unless tests require exact) |
| Polar clamp | keep ground-friendly max polar (current `Math.PI / 2 - 0.05` is fine) |
| Distance | keep min/max sensible for room-scale mm→m scene |
| Rotate | **left-button drag rotates** (Three OrbitControls default) — do not force middle-only |
| Pan | right-button / ctrl-drag pan (Three defaults) — do not disable pan |
| Zoom | wheel zoom enabled |

**DOM hooks (for Playwright later):**

- Keep `data-testid="planner-3d-canvas"` on lazy root (already).
- Keep `data-testid="three-viewer-container"` on inner (already).
- Add `data-orbit-enabled="true"` on the container when controls are active (set after OrbitControls construction; `"false"` when disabled). Attribute is the Playwright truth, not a visible competitor-style gizmo.

**Anti-patterns (reject):**

- `enableControls={false}` from `OOPlannerWorkspace`.
- Auto-rotate as the only motion (no forced `autoRotate` for product open3d).
- Copying Planner5D/Floorplanner DOM structure or CSS.

**Done when:** Task 02 tests green; orbit attribute present in unit mock path or integration render.

---

### Task 04 — GREEN: OOPlannerWorkspace view mode → project pose into 3D

**Skills:** test-driven-development  

**File:** `OOPlannerWorkspace.tsx`

**Required wiring:**

```tsx
{viewMode === "2d" ? (
  /* existing FeasibilityCanvas tree */
) : (
  <Lazy3DViewer
    projectData={workspaceCanvas.project}
    enableControls={true}
  />
)}
```

Rules:

1. Always pass **current** `workspaceCanvas.project` (floors + furniture pose).
2. Do **not** clone/strip furniture pose when entering 3D.
3. Do **not** clear selection solely because viewMode changed unless P03 already defines that (this phase: prefer preserve selection ids on document; selection chrome may hide in 3D — do not wipe entity pose).
4. `setViewMode` remains the only mode switch; TopBar radiogroup already calls `onViewModeChange`.

**Unit where possible:**

- If workspace is heavy to mount, test the pure control-props helper + document continuity only.
- Optional RTL smoke: mock `Lazy3DViewer` and assert it receives `enableControls: true` and `projectData` with expected furniture pose after a fake place via pure actions injected into a thin wrapper — only if mount cost is acceptable; skip full shell if flaky.

**Done when:** 3D branch explicitly enables orbit; project reference is live document; Task 01–02 still green.

---

### Task 05 — Regression: pure pose adapter + entity ids

**Skills:** verification-before-completion  

**Files (read-first; edit only on failure):**

- `buildOpen3dSceneNodes.ts`
- `model/types.ts` (`Open3dFurnitureItem.position`, `.rotation`)
- `createSceneObjectFromNode` path (mesh world transform must honor node `xMm/yMm/rotation`)

**Commands:**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts tests/unit/features/planner/open3d/documentViewContinuity.test.ts tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts --reporter=verbose
```

**Done when:** all pass; any pose bug fixed with a failing test first; evidence log `04-orbit-continuity/adapter-regression-vitest-raw.log`.

---

### Task 06 — Playwright contract (assert later; write spec now if journey harness exists)

**Skills:** verification-before-completion, chrome-devtools  

**Spec path:** `site/tests/e2e/open3d-world-standard-journey.spec.ts` (W4 block)  
**or** dedicated `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts` if journey file not yet created by P07.

**Browser steps (concrete):**

1. Open guest or open3d planner route used by existing e2e helpers (`enterGuestPlannerWorkspace` pattern from `planner-j4-3d-parity.spec.ts` — adapt to **open3d** host, not archived fabric split).
2. Ensure at least one furniture entity exists (place via inventory **or** seed path available to e2e).
3. Record furniture id + position from document UI or test harness (prefer reading status/properties if exposed; else evaluate store via test hook only if already present — **do not** invent private debug APIs without a testid).
4. Click **3D** radiobutton (`role="radio"` name/label **3D** in TopBar).
5. Wait for `[data-testid="planner-3d-canvas"]` and `[data-orbit-enabled="true"]`.
6. Drag on canvas (left button, ~50px) — assert no page crash; canvas still visible; optional screenshot `01-orbit-drag.png`.
7. Click **2D**, then **3D** again — furniture still present in project; console clean (Playwright console listener: no `error` level from app).
8. Pose assert: same furniture id still in document after toggles (via reload of properties panel, network-free document export if test exposes it, or unit-backed confidence + screenshot of 3D scene with furniture mesh present).

**Evidence artifacts (required when browser runs):**

| File | Content |
|------|---------|
| `playwright-raw.log` | full run |
| `playwright-run.json` | exit code, test names, status |
| `01-3d-mount.png` | 3D visible |
| `02-orbit-drag.png` | after drag |
| `03-back-to-2d.png` | 2D restored |
| `console-messages.txt` | console capture (empty of app errors) |

**Commands (adjust to repo Playwright config):**

```powershell
cd D:\OandO07072026\site
npx playwright test tests/e2e/open3d-w4-orbit-continuity.spec.ts --reporter=line
```

**Honesty:** If Playwright harness for open3d is not ready until P07, **land unit evidence + DOM hooks now**, leave Playwright checkboxes open, and record blocker path in `Failures.md` with link to this phase — do **not** claim W4 browser-green without screenshots.

**Done when:** either (a) Playwright green + artifacts, or (b) unit+hooks green and NOTES explicitly states “Playwright deferred to shared journey; W4 unit contract closed.”

---

### Task 07 — Commit slice + CP-04

**Skills:** verification-before-completion  

- [ ] Commit landable slices on main checkout only (**no worktrees**): e.g. `test(open3d): W4 pose continuity units`, `fix(open3d): orbit default ON + workspace wiring`.
- [ ] Do **not** `git push` unless owner asks.
- [ ] Fill CP-04 checklist below.
- [ ] Update `results/planner/world-standard-wave/04-orbit-continuity/NOTES.md` with final HEAD and pass/fail table.

---

## Commands cheat sheet

| Purpose | Command |
|---------|---------|
| Pose continuity units | `npx vitest run tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose` |
| Orbit default units | `npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.ts --reporter=verbose` |
| Scene adapter regression | `npx vitest run tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts --reporter=verbose` |
| Playwright W4 | `npx playwright test tests/e2e/open3d-w4-orbit-continuity.spec.ts` |
| Non-regression (optional) | `pnpm p0:unit` / site vitest planner open3d folder |

All product commands run from `D:\OandO07072026\site` unless noted. Evidence lands under  
`D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity\`.

---

## Acceptance (W4)

| ID | Criterion | Proof |
|----|-----------|--------|
| W4.1 | Furniture/wall **entity ids** stable across 2D↔3D rebuild | Vitest pose continuity |
| W4.2 | Furniture **position + rotation** match document after rebuild | Vitest + (Playwright when run) |
| W4.3 | **Orbit enabled by default** on open3d 3D view | `enableControls={true}` + OrbitControls construct + `data-orbit-enabled="true"` |
| W4.4 | User can drag-orbit without crash | Playwright drag (or chrome-devtools manual note if e2e deferred — must not claim pass without artifact) |
| W4.5 | Console clean on toggle path | Playwright console capture or chrome-devtools session log in evidence dir |
| W4.6 | No competitor code/assets | Review: Three MIT OrbitControls only; patterns from research |

---

## Ethics / research (inspiration only)

| Allowed pattern | Forbidden |
|-----------------|-----------|
| Orbit as **default** 3D navigation | Shipping competitor JS/CSS/GLB/logos |
| Explicit top-bar **2D \| 3D** toggle with document continuity | Cloning Planner5D/Floorplanner chrome trade dress |
| Lazy-load 3D on first 3D activation (already Lazy3DViewer) | Re-scraping competitors into `site/` |
| O&O Phosphor + CSS modules | “Make it look like brand X” |

Research pointers (ideas only): `Plans/Research/RESEARCH-2026-07-05-ui-benchmark.md` §2D/3D mode switch · §3D navigation orbit default · `results/planner/world-standard-wave/WAVE.md`.

---

## CP-04 — Hard stop gate

Record in `checkpoints/CHECKPOINTS.md` when that file exists; complete here regardless:

- [ ] Task 01 pose continuity units green; evidence under `04-orbit-continuity/`
- [ ] Task 02–03 orbit default ON green; `data-orbit-enabled` wired
- [ ] Task 04 workspace passes `enableControls={true}` + live `projectData`
- [ ] Task 05 adapter regression green
- [ ] Task 06 Playwright **either** green with PNGs **or** deferred with honest NOTES (no false “works”)
- [ ] Console-clean claim only with artifact
- [ ] Local commits for landable slices; no push without owner
- [ ] W4 not marked done if orbit disabled or pose drifts

**Unlock next:** P05 symbols/SVG only after CP-04 checked or owner waives in writing.

---

## Status vocabulary

| Word | Meaning |
|------|---------|
| Planned | This file only |
| Unit-green | Vitest evidence in `04-orbit-continuity/` |
| Browser-green | Playwright + screenshots + console log |
| Done (W4) | Unit-green **and** browser-green (or owner-accepted deferral of browser only) |

Do not use “done” for code-complete without evidence paths.

---

## Non-goals recap

- Camera bookmark memory across 2D↔3D (nice later; not W4 entity pose).
- Walk mode / first-person.
- Auto-rotate showcase mode.
- Fixing select/delete (P03) or save labels (P06) in this file’s commit slices.
- Fabric full stage.

---

## Handover one-liner

**W4 = document pose continuity + OrbitControls ON by default on open3d Three path; prove with Vitest under `results/planner/world-standard-wave/04-orbit-continuity/`, then Playwright drag + toggle; superpowers; no worktrees; commit as you go.**
