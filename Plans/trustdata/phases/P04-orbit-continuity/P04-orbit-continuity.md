# P04 — Orbit Continuity (W4)

## Phase status (complete)

| Item | Status | Evidence |
|------|--------|----------|
| W4 / CP-04 | **PASS** 2026-07-09 | `results/planner/world-standard-wave/04-orbit-continuity/` |
| Unit | pose + orbit + adapter green | `pose-continuity-*`, `orbit-default-*`, `adapter-regression-*` |
| Browser | green | Playwright 1 passed; `browser-run.json`; shots 01–03 |
| Three-layer | audited | `THREE-LAYER-AUDIT.md` |

> **For agentic workers:** REQUIRED: `/using-superpowers` + skills as fit (`test-driven-development`, `verification-before-completion`, `systematic-debugging`, `chrome-devtools` for live checks). **W0 UNLOCKED** — implement freely per AGENTS.md. Checkboxes track execution progress.
>
> **Gate W4:** 2D↔3D toggle preserves **entity pose**; **3D orbit** is **enabled by default**. Proof: unit green now · Playwright + console clean under evidence dir (this phase lays the Playwright contract; full journey may share `02-browser-open3d-journey` once P07 lands).
>
> **Reviews:** [P04-suggestions.md](./P04-suggestions.md) · Expert revision 2026-07-09 (end of file).

### Expert pass P0 (2026-07-09)

- **Orbit three-layer rule:** (1) Lazy+Inner defaults ON (live) · (2) workspace **must** pass `enableControls={true}` (or shared control props) — today omit at `OOPlannerWorkspace` · (3) `data-orbit-enabled` on container + unit construct-spy. Layer-1 alone ≠ W4.
- **Rotation correction:** furniture **document + scene nodes = degrees** (live `normalizeDegrees` / pick converts). Do **not** convert furniture to radians to match older plan wording. Mesh `rotation.y = -node.rotation` is intentional plan-Y→world-Z, not pose drift.
- **Pose continuity = document only** (double rebuild deep-equal ids / xMm / yMm / rotation). Stay **imperative Three** — no R3F rewrite mid-W4.
- **Evidence:** `04-orbit-continuity/` only. Anti-J4: radio 2D|3D; `planner-3d-canvas` is a **div**.
- Authority: [EXPERT-PASS.md](../EXPERT-PASS.md) · [03-r3f-3d.md](./03-r3f-3d.md) · [01-react-open3d.md](./01-react-open3d.md).

**Parent:** [01-START-HERE.md](../../01-START-HERE.md) · [02-PROGRAM-INDEX.md](../../02-PROGRAM-INDEX.md)
**Design authority:** `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §W4  
**Prev:** [P03-select-delete.md](../P03-select-delete/P03-select-delete.md) · **Next:** [P05-symbols-svg.md](../P05-symbols-svg/P05-symbols-svg.md)  
**Checkpoint:** **CP-04** (see end of this file + `checkpoints/CHECKPOINTS.md`)  
**Evidence root:** `results/planner/world-standard-wave/04-orbit-continuity/`  
**Approach:** **A** (product journey on FeasibilityCanvas + document model)

---

## Goal

A facilities buyer on `/planner/open3d` or `/planner/guest` (same open3d stack) can:

1. Place furniture in **2D**, switch to **3D**, and see the **same entity ids, position (mm), and rotation**.
2. Switch **3D → 2D → 3D** without pose drift or id rewrite (3D unmounts on 2D; **document** remains sole pose authority).
3. **Orbit** the 3D scene immediately (no hidden “enable orbit” toggle, no orbit-off default; workspace **explicitly** passes `enableControls={true}`).
4. Leave a **clean console** on the 2D↔3D path.

**Out of scope this phase (do not expand):** mesh photoreal (P08), save honesty (P06), select/delete (P03), Fabric full-stage cutover, walk/first-person camera, camera bookmark across view modes, competitor UI copy.

---

## Architecture (data as truth)

```
Open3dProject (UUID entities, mm)
    │  position + rotation on furniture / wall geometry
    ├── 2D: FeasibilityCanvas reads project (OOPlannerWorkspace viewMode === "2d")
    └── 3D: Lazy3DViewer (file ThreeLazyViewer.tsx) → ThreeViewerInner
              └── buildOpen3dSceneNodes(project) → meshes tagged userData.entityId
              └── OrbitControls when enableControls === true (DEFAULT ON + workspace explicit true)
              └── data-orbit-enabled="true"|"false" on three-viewer-container (Playwright truth)
```

**Continuity rule:** View mode is chrome only. **Document** is the only pose authority. Switching modes must **not** mutate furniture `position` / `rotation` / `id`. 3D rebuilds from `buildOpen3dSceneNodes`; it must not invent new poses. Returning to 2D unmounts Lazy3DViewer — that is expected; remount must re-read the same project.

**Rotation convention (locked):** Document + scene nodes use **radians about vertical**. `createSceneObjectFromNode` maps plan Y→world Z and sets `rotation.y = -node.rotation` (Y-up mesh). W4 unit bar asserts **document ↔ node** equality; mesh sign flip is intentional, not pose drift.

**Orbit rule (inspiration pattern only — research, not plagiarism):** Industry web planners treat **orbit/pan/zoom as the default 3D navigation** (Sketchfab-style orbit grammar; Planner5D/Floorplanner explicit 2D|3D toggler with state continuity). O&O ships **our** OrbitControls wiring on Three.js examples controls — MIT Three package — custom chrome, no competitor assets/code.

---

## Tech stack (locked)

| Layer | Choice |
|-------|--------|
| Workspace | `OOPlannerWorkspace` + `WorkspaceShell` / `TopBar` 2D\|3D radiogroup (`role="radio"`) |
| Hosts | `/planner/open3d` (`Open3dPlannerHost`) · `/planner/guest` (`Open3dPlannerWorkspaceRoute`) — same open3d stack |
| 2D interim | `FeasibilityCanvas` |
| 3D | Three.js + `three/examples/jsm/controls/OrbitControls.js` via `ThreeViewerInner` |
| Lazy mount | `ThreeLazyViewer.tsx` exports `Lazy3DViewer` (no separate `LazyViewer.tsx`) |
| Pose model | `Open3dFurnitureItem.position` / `.rotation` + wall geometry in `open3d/model/types.ts` |
| Unit tests | Vitest |
| Browser (later in phase / shared journey) | Playwright — **open3d selectors only** (not legacy J4 button/split) |

---

## Honest baseline (repo facts before edits — verified 2026-07-09)

Three-layer truth (do not collapse into one “orbit works” claim):

| Layer | Status | Path / evidence |
|-------|--------|-----------------|
| **1. Code defaults** | ON | `ThreeViewerInner.tsx` + `ThreeLazyViewer.tsx`: `enableControls = true`; OrbitControls constructed when true; damping `0.08`; polar clamp `Math.PI/2 - 0.05`; distances 1–40 |
| **2. Workspace wiring** | **Gap** | `OOPlannerWorkspace.tsx` ~L756: `<Lazy3DViewer projectData={workspaceCanvas.project} />` — **omits** explicit `enableControls={true}` |
| **3. Proof** | **Absent** | No `orbitControlsDefault` unit; no `data-orbit-enabled`; no `results/planner/world-standard-wave/04-orbit-continuity/` artifacts yet |

| Fact | Path / evidence |
|------|-----------------|
| View mode local state `"2d" \| "3d"` | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` — `useState`; TopBar radiogroup |
| 3D branch mounts | `viewMode === "2d" ? Feasibility… : <Lazy3DViewer projectData={…} />` |
| Lazy props default `enableControls = true` | `ThreeLazyViewer.tsx` |
| Orbit constructed when `enableControls` | `ThreeViewerInner.tsx` — `new OrbitControls(camera, renderer.domElement)` + damping |
| DOM hooks present | `data-testid="planner-3d-canvas"` (**div** root on Lazy) · `data-testid="three-viewer-container"` (inner) · **`data-orbit-enabled` missing** |
| Document → nodes pose map | `buildOpen3dSceneNodes.ts` — `xMm/yMm/rotation` from furniture (radians) |
| Pure unit continuity already green (partial) | `tests/unit/features/planner/open3d/documentViewContinuity.test.ts` · historical `results/planner/document-view-continuity/` — re-home proof under **04-** |
| Existing viewer units (no orbit assert) | `threeViewerInner.test.tsx` · `threeLazy.test.tsx` — extend or add `orbitControlsDefault.test.ts` |
| WAVE note “no orbit” | `results/planner/world-standard-wave/WAVE.md` — **stale vs layer 1**; still valid as **product-proof** failure until layers 2+3 close |
| Legacy R3F / J4 | `Planner3DViewer.tsx` camera memory — **do not** copy for W4. `planner-j4-3d-parity.spec.ts` uses **button** “3D”, split, **middle** drag, `canvas[data-testid=…]` — **forbid copy-paste** for open3d W4 |

**Gaps this phase closes:**

1. **Explicit contract** — workspace always passes `enableControls={true}` (or shared helper returning that object).
2. **Unit/TDD** — orbit-default + construct spy; pose stable across simulated 2D↔3D rebuilds (including double `buildOpen3dSceneNodes`).
3. **DOM hook** — `data-orbit-enabled` so Playwright proves orbit without brittle internals.
4. **Evidence folder** `04-orbit-continuity/` with commands, logs, and (when unlocked for browser) screenshots.

---

## File map (touch only these for W4)

| Role | Absolute path |
|------|----------------|
| Orbit host | `D:\OandO07072026\site\features\planner\open3d\3d\ThreeViewerInner.tsx` |
| Lazy wrapper + defaults | `D:\OandO07072026\site\features\planner\open3d\3d\ThreeLazyViewer.tsx` |
| Optional orbit constant/helper | `D:\OandO07072026\site\features\planner\open3d\3d\orbitDefaults.ts` (create only if workspace wiring needs a pure export; else export from Lazy file) |
| View mode + project into 3D | `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx` |
| Toggle chrome | `D:\OandO07072026\site\features\planner\open3d\editor\TopBar.tsx` (read; edit only if extra testid needed — radios already labeled **2D**/**3D**) |
| Entity pose types | `D:\OandO07072026\site\features\planner\open3d\model\types.ts` (read; edit only if pose fields wrong — expected **no change**) |
| Pure pose adapter | `D:\OandO07072026\site\features\planner\open3d\3d\buildOpen3dSceneNodes.ts` (read/extend tests; code change only if pose bug found) |
| Mesh factory (read) | `D:\OandO07072026\site\features\planner\open3d\3d\createSceneObjectFromNode.ts` (regression only) |
| Existing continuity unit | `D:\OandO07072026\site\tests\unit\features\planner\open3d\documentViewContinuity.test.ts` |
| **Primary** orbit contract unit | `D:\OandO07072026\site\tests\unit\features\planner\open3d\orbitControlsDefault.test.ts` |
| Optional secondary | extend `threeViewerInner.test.tsx` and/or `threeLazy.test.tsx` if construct-spy fits existing mocks — **do not** invent a third parallel `threeLazyViewerOrbit.test.tsx` unless primary cannot cover prop default |
| Playwright (phase end / shared) | `D:\OandO07072026\site\tests\e2e\open3d-w4-orbit-continuity.spec.ts` **or** W4 block in `open3d-world-standard-journey.spec.ts` |
| Evidence | `D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity\` |

Do **not** thrash `Planner3DViewer.tsx` or rewrite `planner-j4-3d-parity.spec.ts` as the W4 proof (legacy chrome).

---

## Task list (TDD first)

### Task 00 — Setup / evidence scaffold

**Skills:** verification-before-completion  

- [ ] Create `results/planner/world-standard-wave/04-orbit-continuity/` if missing.
- [ ] Write `NOTES.md` in that folder with HEAD commit, approach A, W4 wording, three-layer baseline, files planned.
- [ ] Confirm P03 (select/delete) is not required to *complete unit work* for orbit; browser journey may still need a placed item from inventory (document can be seeded in unit tests without P03 UI).

**Done when:** folder exists; NOTES records scope + baseline layers; no product code changed yet.

---

### Task 01 — RED: unit contract for entity pose continuity (2D↔3D same project)

**Skills:** test-driven-development  

**File:** extend `site/tests/unit/features/planner/open3d/documentViewContinuity.test.ts`  
**or** add sibling `viewModePoseContinuity.test.ts` if file is getting crowded — prefer **one focused file** still under `tests/unit/features/planner/open3d/`.

**Cases (all pure; no WebGL):**

1. **Stable ids across rebuild:** After `addFurniture` + `updateFurniture` pose, two consecutive `buildOpen3dSceneNodes(project)` calls return identical `id`, `xMm`, `yMm`, `rotation` for furniture.
2. **Simulated view toggle (double rebuild):** Mutate nothing on project; call `buildOpen3dSceneNodes` → hold snapshot → call again (models “leave 3D unmount / remount”). Snapshots deep-equal for furniture pose fields.
3. **Pose edit survives “return to 2D”:** `updateFurniture` position/rotation; rebuild nodes; assert node pose equals document furniture pose (radians; exact equality with pure action store).
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

**Done when:** new assertions exist (especially double-rebuild); re-run lands evidence under **04-orbit-continuity** (do not rely only on `results/planner/document-view-continuity/`).

---

### Task 02 — RED: unit contract for orbit default ON

**Skills:** test-driven-development  

**Primary file:** `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.ts`  
**Optional:** extend `threeViewerInner.test.tsx` construct-spy cases if mocks already cover setup.

**Intent:** Lock product rule without full WebGL if possible.

**Concrete assertions:**

1. **Prop default:** Export a tiny pure helper/constant, e.g. `export const OPEN3D_ORBIT_DEFAULT_ENABLED = true as const` and/or `getOpen3dViewerControlProps(): { enableControls: true }`, **or** test via `Lazy3DViewer` / `ThreeViewerInner` default props with React Testing Library (mock dynamic `import("three")` and OrbitControls module).
2. **Explicit workspace wiring:** Prefer pure `getOpen3dViewerControlProps()` used by workspace — assert return is `{ enableControls: true }`. Avoid brittle source greps as the only proof.
3. **False is opt-out only:** `enableControls={false}` allowed for tests/stories; **never** the open3d product default or workspace 3D branch.

**Implementation shape (when green):**

```ts
export function getOpen3dViewerControlProps(): { enableControls: true } {
  return { enableControls: true };
}
```

Place helper in `ThreeLazyViewer.tsx` or `open3d/3d/orbitDefaults.ts` — pick **one** file, export once, use from workspace.

**Mock strategy for component tests:**

- Mock `three` and `three/examples/jsm/controls/OrbitControls.js` so constructors are spies.
- Mount `ThreeViewerInner` with `enableControls` omitted → assert OrbitControls constructor **called**.
- Mount with `enableControls={false}` → assert OrbitControls constructor **not** called.
- Assert container exposes `data-orbit-enabled="true"` / `"false"` accordingly (after Task 03 attribute lands; write red first).

**Commands:**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.ts --reporter=verbose
```

**Evidence:** `04-orbit-continuity/orbit-default-vitest-raw.log` + `orbit-default-run.json`.

**Done when:** red→green path defined; tests fail if someone flips default to false, removes OrbitControls construction, or strips workspace explicit enable.

---

### Task 03 — GREEN: enable / harden orbit in ThreeViewerInner + Lazy3DViewer

**Skills:** test-driven-development, systematic-debugging  

**Files:**

- `ThreeViewerInner.tsx`
- `ThreeLazyViewer.tsx`
- optional `orbitDefaults.ts`

**Required product behavior:**

| Control | Setting |
|---------|---------|
| `enableControls` default | `true` (keep) |
| Workspace product path | **must** pass `enableControls={true}` or `{...getOpen3dViewerControlProps()}` |
| Orbit | constructed whenever `enableControls` |
| Damping | `enableDamping = true`, `dampingFactor = 0.08` (keep current) |
| Polar clamp | keep ground-friendly max polar (`Math.PI / 2 - 0.05`) |
| Distance | keep min/max room-scale (`1` / `40` today) |
| Rotate | **left-button drag rotates** (Three OrbitControls default) — do not force middle-only |
| Pan | right-button / ctrl-drag pan (Three defaults) — do not disable pan |
| Zoom | wheel zoom enabled |
| Auto-rotate | **off** for product open3d |

**DOM hooks (for Playwright later):**

- Keep `data-testid="planner-3d-canvas"` on lazy root (already; **div**).
- Keep `data-testid="three-viewer-container"` on inner (already).
- Add `data-orbit-enabled="true"` on the **inner container** when controls are active (set after OrbitControls construction; `"false"` when disabled). Attribute is the Playwright truth, not a visible competitor-style gizmo.

**Anti-patterns (reject):**

- `enableControls={false}` from `OOPlannerWorkspace`.
- Relying on default alone without explicit workspace prop/helper.
- Auto-rotate as the only motion.
- Copying Planner5D/Floorplanner DOM structure or CSS.
- Importing R3F orbit memory from `Planner3DViewer`.

**Done when:** Task 02 tests green; `data-orbit-enabled` present in unit mock path or integration render.

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

Equivalent: spread `getOpen3dViewerControlProps()` so the type system forces `enableControls: true`.

Rules:

1. Always pass **current** `workspaceCanvas.project` (floors + furniture pose).
2. Do **not** clone/strip furniture pose when entering 3D.
3. Do **not** clear selection solely because viewMode changed unless P03 already defines that (this phase: prefer preserve selection ids on document; selection chrome may hide in 3D — do not wipe entity pose).
4. `setViewMode` remains the only mode switch; TopBar radiogroup already calls `onViewModeChange`.
5. Unmount on 2D is OK; remount must not rewrite entity ids/poses.

**Unit where possible:**

- Test the pure control-props helper + document continuity (primary).
- Optional RTL smoke: mock `Lazy3DViewer` and assert it receives `enableControls: true` and `projectData` with expected furniture pose after pure place — only if mount cost is acceptable.

**Done when:** 3D branch explicitly enables orbit; project reference is live document; Task 01–02 still green.

---

### Task 05 — Regression: pure pose adapter + entity ids

**Skills:** verification-before-completion  

**Files (read-first; edit only on failure):**

- `buildOpen3dSceneNodes.ts`
- `model/types.ts` (`Open3dFurnitureItem.position`, `.rotation`)
- `createSceneObjectFromNode` path (mesh world transform honors node `xMm/yMm/rotation`; note intentional `-rotation` on Y)

**Commands:**

```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts tests/unit/features/planner/open3d/documentViewContinuity.test.ts tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts --reporter=verbose
```

**Done when:** all pass; any pose bug fixed with a failing test first; evidence log `04-orbit-continuity/adapter-regression-vitest-raw.log`.

---

### Task 06 — Playwright contract (assert later; write spec now if journey harness exists)

**Skills:** verification-before-completion, chrome-devtools  

**Spec path:** `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts`  
**or** W4 block in `site/tests/e2e/open3d-world-standard-journey.spec.ts` if P07 already created it.

**Do not** copy `planner-j4-3d-parity.spec.ts` selectors (button “3D”, split, middle-button, `canvas[data-testid="planner-3d-canvas"]`).

**Browser steps (concrete):**

1. Open open3d host: guest via `enterGuestPlannerWorkspace` (`/planner/guest/?plannerDevTools=1`) **or** `/planner/open3d` — both mount open3d stack.
2. Ensure at least one furniture entity exists (place via inventory **or** seed path available to e2e).
3. Record furniture id + position from document UI or existing test harness — **do not** invent private debug APIs without a testid.
4. Click **3D** via `getByRole("radio", { name: "3D" })` (TopBar radiogroup).
5. Wait for `[data-testid="planner-3d-canvas"]` (div) and `[data-testid="three-viewer-container"][data-orbit-enabled="true"]`.
6. **Left-button** drag on viewer surface (~50px) — assert no page crash; canvas/container still visible; optional screenshot `02-orbit-drag.png`.
7. Click **2D** radio, then **3D** again — furniture still present in project; console clean (Playwright console listener: no `error` level from app).
8. Pose assert: same furniture id still in document after toggles (properties panel, export hook if already exposed, or unit-backed confidence + screenshot of 3D with furniture mesh present).

**Evidence artifacts (required when browser runs):**

| File | Content |
|------|---------|
| `playwright-raw.log` | full run |
| `playwright-run.json` | exit code, test names, status |
| `01-3d-mount.png` | 3D visible |
| `02-orbit-drag.png` | after left-drag |
| `03-back-to-2d.png` | 2D restored |
| `console-messages.txt` | console capture (empty of app errors) |

**Commands:**

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
- [ ] Update `results/planner/world-standard-wave/04-orbit-continuity/NOTES.md` with final HEAD and pass/fail table (layers 1–3).

---

## Commands cheat sheet

| Purpose | Command |
|---------|---------|
| Pose continuity units | `npx vitest run tests/unit/features/planner/open3d/documentViewContinuity.test.ts --reporter=verbose` |
| Orbit default units | `npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.ts --reporter=verbose` |
| Scene adapter regression | `npx vitest run tests/unit/features/planner/open3d/buildOpen3dSceneNodes.test.ts tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts --reporter=verbose` |
| Playwright W4 | `npx playwright test tests/e2e/open3d-w4-orbit-continuity.spec.ts` |
| Non-regression (optional) | site vitest folder `tests/unit/features/planner/open3d/` |

All product commands run from `D:\OandO07072026\site` unless noted. Evidence lands under  
`D:\OandO07072026\results\planner\world-standard-wave\04-orbit-continuity\`.

---

## Acceptance (W4)

| ID | Criterion | Proof |
|----|-----------|--------|
| W4.1 | Furniture/wall **entity ids** stable across 2D↔3D rebuild | Vitest pose continuity (incl. double rebuild) under `04-orbit-continuity/` |
| W4.2 | Furniture **position + rotation** match document after rebuild | Vitest + (Playwright when run) |
| W4.3 | **Orbit enabled by default** on open3d 3D view | Default true **and** workspace explicit `enableControls={true}` **and** OrbitControls construct **and** `data-orbit-enabled="true"` |
| W4.4 | User can **left-drag** orbit without crash | Playwright drag (or chrome-devtools manual note if e2e deferred — must not claim pass without artifact) |
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

- [ ] Task 01 pose continuity units green (incl. double rebuild); evidence under `04-orbit-continuity/`
- [ ] Task 02–03 orbit default ON green; `data-orbit-enabled` wired on `three-viewer-container`
- [ ] Task 04 workspace **explicitly** passes `enableControls={true}` (or helper) + live `projectData`
- [ ] Task 05 adapter regression green
- [ ] Task 06 Playwright **either** green with PNGs **or** deferred with honest NOTES (no false “works”)
- [ ] Console-clean claim only with artifact
- [ ] Local commits for landable slices; no push without owner; **no worktrees**
- [ ] W4 not marked done if orbit disabled, workspace silent-default only, or pose drifts

**Unlock next:** P05 symbols/SVG only after CP-04 checked or owner waives in writing.

---

## Status vocabulary

| Word | Meaning |
|------|---------|
| Planned | This file only |
| Unit-green | Vitest evidence in `04-orbit-continuity/` + layers 1–2 closed |
| Browser-green | Playwright + screenshots + console log |
| Done (W4) | Unit-green **and** browser-green (or owner-accepted deferral of browser only) |

Do not use “done” for code-complete without evidence paths. Do not claim “orbit works” from WAVE silence or defaults alone.

---

## Non-goals recap

- Camera bookmark memory across 2D↔3D (nice later; not W4 entity pose).
- Walk mode / first-person.
- Auto-rotate showcase mode.
- Fixing select/delete (P03) or save labels (P06) in this file’s commit slices.
- Fabric full stage.
- Rewriting legacy J4 e2e as the W4 proof.

---

## Handover one-liner

**W4 = document pose continuity + OrbitControls ON by default with explicit workspace wiring + `data-orbit-enabled`; prove with Vitest under `results/planner/world-standard-wave/04-orbit-continuity/`, then Playwright left-drag + radio toggle; superpowers; no worktrees; commit as you go.**

---

## Expert revision note — 2026-07-09

**Role:** Planning expert (trust-data / open3d W4).  
**Inputs:** Live path verify of `ThreeViewerInner.tsx`, `ThreeLazyViewer.tsx` (`Lazy3DViewer`), `OOPlannerWorkspace.tsx`, `documentViewContinuity.test.ts`, `threeViewerInner.test.tsx`, `threeLazy.test.tsx`, TopBar radiogroup, guest/open3d routes, WAVE.md; suggestions file `./P04-suggestions.md`.  
**Actions:** Plan-only revise in place. No product code. No TBD left in task body.

### Top 5 applied

1. **Three-layer baseline (S6)** — Code defaults ON; workspace explicit prop **gap**; proof **absent** under `04-orbit-continuity/`. WAVE “no orbit” marked stale vs layer 1, still valid as proof failure.
2. **Explicit workspace `enableControls={true}` (S1/S9)** — W4.3 and CP-04 require prop/helper, not silent default alone; optional `getOpen3dViewerControlProps()`.
3. **`data-orbit-enabled` on inner container (S2)** — Playwright truth after OrbitControls construction; listed in DOM hooks + acceptance.
4. **Continuity double-rebuild + 04- evidence re-home (S3/S8)** — Task 01 mandates consecutive `buildOpen3dSceneNodes` equality; historical `document-view-continuity/` insufficient alone.
5. **Open3d Playwright selectors; ban J4 copy-paste (S5)** — `role="radio"` 2D|3D; div `planner-3d-canvas`; left-drag orbit; no button/split/middle-only J4 grammar.

### Also applied (supporting)

- Rotation convention locked (radians; mesh `-rotation.y` intentional).  
- Lazy file name clarity (`ThreeLazyViewer` / `Lazy3DViewer` only).  
- Orbit unit file discipline — primary `orbitControlsDefault.test.ts`; no third parallel orbit file by default.  
- Remount rule: unmount 3D on 2D is expected; document sole pose authority.  
- Skills / no-worktree / commit-as-you-go / no push without owner restated.

**Status after revision:** **PASS** — W0 unlocked; unit + browser closed under `04-orbit-continuity/`.
