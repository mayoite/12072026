# P04 suggestions — Orbit Continuity (W4)

**Date:** 2026-07-09  
**Scope:** Plan-only review of `phases/P04-orbit-continuity.md` against live repo paths.  
**No product code.** Superpowers / TDD / verification skills apply at execution unlock.  
**Method:** Read plan → verify `ThreeViewerInner` / `ThreeLazyViewer` (`Lazy3DViewer`) / continuity tests → concrete suggestions (no TBD).

---

## Path verification (repo facts 2026-07-09)

| Claim in plan | Live fact | Verdict |
|---------------|-----------|---------|
| Orbit host `site/features/planner/open3d/3d/ThreeViewerInner.tsx` | Exists. `enableControls = true` default. `new OrbitControls` when true; `enableDamping = true`, `dampingFactor = 0.08`, `maxPolarAngle = Math.PI / 2 - 0.05`, `minDistance = 1`, `maxDistance = 40`. Container `data-testid="three-viewer-container"`. | **Path OK** |
| Lazy wrapper `ThreeLazyViewer.tsx` → `Lazy3DViewer` | Exists. `enableControls = true` default; passes through to inner. Root `data-testid="planner-3d-canvas"` on **div**, not `<canvas>`. | **Path OK** — name is `Lazy3DViewer` / file `ThreeLazyViewer` (no separate `LazyViewer.tsx`) |
| Workspace wires project into 3D | `OOPlannerWorkspace.tsx` ~L756: `<Lazy3DViewer projectData={workspaceCanvas.project} />` — **omits** explicit `enableControls={true}` (relies on default only). | **Gap** |
| Continuity unit | `site/tests/unit/features/planner/open3d/documentViewContinuity.test.ts` — green path for ids + pose after `updateFurniture`; evidence historically `results/planner/document-view-continuity/`. | **Exists; incomplete vs Task 01 double-rebuild cases** |
| Orbit unit | No `orbitControlsDefault.test.ts`; `threeViewerInner.test.tsx` / `threeLazy.test.tsx` do **not** spy OrbitControls construct. | **Missing** |
| `data-orbit-enabled` | **Not present** on container. | **Missing** |
| Playwright W4 | No `open3d-w4-orbit-continuity.spec.ts` / journey W4 block. Legacy `planner-j4-3d-parity.spec.ts` targets guest with **button** “3D”, split chrome, **middle-button** drag, and `canvas[data-testid=…]` — wrong for open3d TopBar **radio** 2D\|3D. | **Do not reuse J4 selectors** |
| Routes | Guest `/planner/guest/` and `/planner/open3d` both open3d stack (`Open3dPlannerWorkspaceRoute` / `Open3dPlannerHost`). | **Either OK for e2e host** |
| TopBar mode | `TopBar.tsx`: `role="radiogroup"` + `role="radio"` labels **2D** / **3D**. | **Selector locked** |
| WAVE “no orbit” | `results/planner/world-standard-wave/WAVE.md` blocker #3. | **Stale vs code default**; still true as **product-proof** gap (no explicit prop, no attribute, no browser artifact under `04-orbit-continuity/`) |
| Evidence dir | `results/planner/world-standard-wave/04-orbit-continuity/` **does not exist** yet. | **Task 00** |
| Pose adapter | `buildOpen3dSceneNodes.ts`: furniture `xMm/yMm/rotation` (radians about vertical). `createSceneObjectFromNode`: world Y-up, plan Y→Z, `rotation.y = -node.rotation`. | **Document↔node equality is W4 unit bar**; mesh sign flip is intentional |

---

## Suggestions (apply into plan)

### S1 — Explicit orbit contract at workspace (not default-only)

Require `OOPlannerWorkspace` 3D branch:

```tsx
<Lazy3DViewer projectData={workspaceCanvas.project} enableControls={true} />
```

Optional thin helper `getOpen3dViewerControlProps(): { enableControls: true }` in `orbitDefaults.ts` **or** export `OPEN3D_ORBIT_DEFAULT_ENABLED = true` from `ThreeLazyViewer.tsx` — one export, used by workspace + unit. Default-only is insufficient for W4.3 (silent prop removal would still “work” until Playwright).

### S2 — `data-orbit-enabled` on inner container after OrbitControls

Set on `three-viewer-container` (or same node Playwright waits on): `"true"` after OrbitControls construction when `enableControls`; `"false"` when disabled. Playwright truth for W4.3/W4.4 — not a visible gizmo.

### S3 — Continuity tests: extend existing file first

Keep primary path: extend `documentViewContinuity.test.ts` (or one sibling `viewModePoseContinuity.test.ts` if crowded). **Must add** double consecutive `buildOpen3dSceneNodes` deep-equal for furniture pose fields (simulates unmount/remount). Do not rely solely on historical `document-view-continuity/` evidence — re-run into `04-orbit-continuity/`.

### S4 — Orbit unit: one focused file + mock OrbitControls; fold into existing viewer tests if cheaper

Preferred new: `orbitControlsDefault.test.ts`.  
Also acceptable: extend `threeViewerInner.test.tsx` with OrbitControls module mock (construct spy) for omit-vs-false cases. **Drop** inventing a third parallel file `threeLazyViewerOrbit.test.tsx` unless lazy-prop RTL is required separately — avoid file sprawl; plan should list **one primary + optional secondary**.

### S5 — Playwright: open3d chrome only; forbid J4 copy-paste

Lock browser contract:

| Step | Selector / action |
|------|-------------------|
| Host | `/planner/guest/?plannerDevTools=1` **or** `/planner/open3d` (same stack) via existing guest setup when guest |
| Mode | `getByRole("radio", { name: "3D" })` / `"2D"` — **not** `getByRole("button", { name: "3D" })` |
| Mount | wait `[data-testid="planner-3d-canvas"]` then `[data-testid="three-viewer-container"][data-orbit-enabled="true"]` |
| Orbit drag | **left** button ~50px on viewer surface (Three OrbitControls default rotate) — not middle-only |
| Continuity | 3D → 2D → 3D; furniture id/pose still in document; console listener no app `error` |

Note: `planner-3d-canvas` is a **div** root; do not require `canvas[data-testid="planner-3d-canvas"]`.

### S6 — Honest baseline: code ON, proof OFF

Replace ambiguous “WAVE stale” with explicit three-layer truth:

1. **Code defaults** `enableControls = true` in Lazy + Inner.  
2. **Workspace** does not yet pass explicit true.  
3. **Proof** absent: no orbit unit, no `data-orbit-enabled`, no `04-orbit-continuity/` browser artifacts.

W4 Done requires layer 1+2+unit; browser-green needs layer 3 screenshots/console.

### S7 — Remount rule (no camera-as-pose)

View mode unmounts 3D when returning to 2D. **Entity pose lives only on `Open3dProject`**. Three scene is rebuild-only. Camera bookmark across toggle is **non-goal** (already in plan — keep). Do not reintroduce `Planner3DViewer` R3F memory into open3d for W4.

### S8 — Evidence commands + filenames locked

Under `results/planner/world-standard-wave/04-orbit-continuity/`:

| Artifact | Source |
|----------|--------|
| `NOTES.md` | HEAD, approach A, W4 wording, pass/fail table |
| `pose-continuity-vitest-raw.log` + `pose-continuity-run.json` | Task 01 |
| `orbit-default-vitest-raw.log` + `orbit-default-run.json` | Task 02 |
| `adapter-regression-vitest-raw.log` | Task 05 |
| Playwright set | Task 06 when run |

Use `scripts/run-evidence-cmd.ps1` from repo root when available.

### S9 — CP-04 wording: explicit prop + attribute

Checkpoint checkboxes must require:

- Workspace **explicit** `enableControls={true}` (or helper equivalent).  
- `data-orbit-enabled="true"` on 3D path.  
- Pose continuity units under **04-** folder.  
- Browser green **or** honest deferral NOTES (no false “works”).

### S10 — File map: delete thrash / keep read-only clear

Touch list stays minimal. **Do not** edit `Planner3DViewer.tsx` (legacy R3F). **Read-only expected:** `types.ts`, `buildOpen3dSceneNodes.ts` unless pose bug. TopBar only if testid needed (radios already labeled).

### S11 — Skills & process (header)

Keep REQUIRED `/using-superpowers` + TDD + verification-before-completion + chrome-devtools for browser. No worktrees. Commit slices locally; no push without owner. Plan-only until unlock.

### S12 — No TBD language

Every task already has concrete files/commands; suggestions close remaining soft spots (J4 mismatch, default-only gap, test file sprawl). Do not leave open research items in phase body.

---

## Priority order for plan revision

1. S1 + S6 + S9 (explicit orbit + honest baseline + CP-04)  
2. S2 (`data-orbit-enabled`)  
3. S3 (continuity extend + 04- evidence re-home)  
4. S5 (Playwright open3d selectors; ban J4)  
5. S4 (orbit unit file discipline)  
6. S7–S8, S10–S12 (remount, evidence names, file map, skills, no TBD)

---

## Out of scope for P04 (confirm)

Select/delete (P03), save honesty (P06), mesh (P08), Fabric cutover, walk mode, competitor UI, camera bookmarks.
