# Current execution plan — Trust-Data planner

**Written:** 2026-07-10  
**Purpose:** Execute the restored Trust-Data planner program against the current repository.  
**Scope:** The O&O planner. Not a new product roadmap. Not a generic architecture presentation.

## 1. Product outcome

O&O sells configurable office and workstation systems. The buyer outcome is narrow and concrete:

> A facilities buyer can open the O&O planner without a developer, create a small office layout, place real O&O-scale furniture, select and edit it, switch to 3D with orbit, save it, reload it the next day, and trust the plan enough to begin a quote.

This is not a photoreal renderer. It is not ERP. It is not a generic GLB catalog.

The six-month prototype is one real workstation family with a size grid, linear and L forms, modules, 2D/3D generation, repeated placement, persistence, and a path to BOQ.

## 2. What is true before work starts

1. `Plans/trustdata/` was restored exactly from Git revision `e1e115af`.
2. Its historical cards use `FeasibilityCanvas` as the interim 2D stage and Fabric as the future destination.
3. The current dirty tree contains a deleted live `canvas-feasibility/FeasibilityCanvas.tsx`, an archived feasibility folder, and a changed Open3D README that says Fabric is the live 2D stage.
4. Therefore no historical CP PASS is current proof.
5. Old evidence proves only an earlier working state. It cannot prove the present dirty state.
6. P05 has an old visual contradiction: primitive data can be multi-part while the browser cabinet is still an unreadable filled tile. Unit counts do not close W2.
7. P04 needs one-state unit and browser proof. Count restoration alone does not prove IDs, millimetres, or rotation.
8. P06 needs hard reload with the same IDs and truthful local/cloud wording. A furniture count is insufficient.
9. P07 must use the real draw and place controls. A configurator-only batch-place path is not enough.
10. The first action is reproof. It is not a rewrite of the engine.

## 3. Non-negotiable rules

- One active phase. Finish it before the next.
- Use `results/planner/world-standard-wave/<folder>/` for phase proof.
- Use a subfolder named `reproof-2026-07-10/` when preserving historical evidence in the same gate folder.
- Every run records `HEAD`, full `git status --short`, command, exit code, and raw output.
- Browser phases capture screenshots, console errors, and failed network requests.
- Unit green is not browser green.
- A screenshot is not persistence proof.
- A JSON field called `pass` is not a product verdict.
- Do not revive archived code just to satisfy an old plan path.
- Do not add Konva, a second interactive 2D engine, designer GLBs, competitor geometry, or cloud save while the listed phase does not require it.
- Do not stage unrelated dirty work.

## 4. Evidence contract

Every phase writes these common files before its verdict:

```text
HEAD.txt                 exact git commit
WORKTREE.txt             complete git status --short
RUN-META.json            commands, dates, route, environment flags
RAW-LOGS/                unfiltered command output
VERDICT.md               proved, disproved, open, next action
```

`VERDICT.md` has four allowed results only: `PASS`, `HALF`, `OPEN`, `FAIL`.

`PASS` means the phase's named buyer outcome is proved on the recorded state. It does not mean the planner is shipped.

## 5. Execution order

The restored historical order was P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10.

This current plan makes one evidence-driven correction: P05 visual symbol proof runs before P07's full browser journey. P07 cannot honestly demonstrate a buyer-ready placed cabinet if the cabinet is still an unreadable tile.

```text
P01 current truth
→ P02 engine decision reproof
→ P03 W3 select/delete/undo
→ P05 W2 symbol readability
→ P07 W1/W2 real draw-and-place journey
→ P06 W5/W6 save and honest status
→ P04 W4 2D/3D continuity and orbit
→ P08 W7 mesh bar
→ P09 W8 shortcut truth
→ P10 evidence and release handover
```

## Phase 01 — Current product truth reproof

**Source:** `phases/P01-product-truth/P01-product-truth.md`  
**Current runbook:** `phases/P01-product-truth/ADDENDUM-2026-07-10-CURRENT-REPROOF.md`  
**Evidence:** `00-product-truth/reproof-2026-07-10/`

### Goal

Establish the current planner host chain and remove false certainty before product work begins.

### Tasks

1. Save HEAD, worktree delta, Node, pnpm, lockfile state, and environment assumptions.
2. Trace `/planner/guest`, `/planner/canvas`, and `/planner/open3d` from route to mounted workspace.
3. Prove the active 2D stage. The only allowed verdicts are Fabric live, Feasibility live, split by route, or unproven.
4. Trace project creation, UUID creation, document serialization, persistence, reload, and visible save wording.
5. Trace `cabinet-v0` from catalog source to placement entity to 2D symbol to 3D mesh or GLB fallback.
6. Run the current host-wiring unit test without changing it to fit an old assumption.
7. Start a known development server. Browser-probe the three planner routes. Capture final URL, visible host, console, network, and screenshot.
8. Build a W1–W8 table with source proof, unit proof, browser proof, and missing proof for every row.
9. Write an authority table covering `AGENTS.md`, Trust-Data, `Plans/INDEX.md`, `plans1/START-HERE.md`, and evidence maps.
10. Write one P01 verdict and name one next phase.

### P01 cannot pass if

- the live 2D host is unknown;
- the route hosts disagree without a recorded split verdict;
- raw test output is absent;
- browser results are from an unknown or mixed server state; or
- an old result folder is used as current proof.

## Phase 02 — Engine decision reproof

**Source:** `phases/P02-engine-lock/P02-engine-lock.md`  
**Evidence:** `01-engine-lock/reproof-2026-07-10/`

### Goal

Freeze the actually live engine path. Stop engine thrash.

### Tasks

1. Take P01's 2D-stage verdict as input. Do not assume the historical Feasibility/Fabric split remains true.
2. Inventory package versions for Fabric, Three, R3F, Drei, Konva, GSAP, and Fancyapps.
3. Prove whether Konva is absent from production planner imports.
4. Prove whether Fabric is enabled by a flag, always mounted, route-specific, or archived.
5. Prove the 3D viewer host, orbit default, and workspace prop wiring.
6. Run focused Fabric mapper, host-wiring, and orbit tests. Keep raw output.
7. Write `ENGINE-LOCK-RECORD.md`: current 2D stage, destination, 3D stage, prohibited combinations, flags, and migration status.
8. Write `PACKAGE-PIN.md` with exact installed versions and license status.
9. Write `OWNER-SIGNOFF-STATUS.md`. It must say one of: signed, explicitly deferred, or missing. An agent cannot fabricate owner sign-off.
10. Write `ANTI-THRASH-AUDIT.md` listing every live interactive 2D surface and every remaining legacy surface.

### Decision rule

- If P01 proves Fabric is live, P02 records Fabric as current reality and the old Feasibility-first wording becomes historical.
- If P01 proves Feasibility is live, P02 keeps Approach A and blocks a Fabric cutover during W-gate work.
- If routes split, P02 defines one route as the W-gate target. It does not call both paths complete.

### P02 cannot pass if

- owner sign-off is required but missing and no explicit deferral exists;
- two interactive 2D engines are live on the target route;
- the package/license table is unknown; or
- the engine record contradicts P01.

## Phase 03 — W3 select, delete, and undo

**Source:** `phases/P03-select-delete/P03-select-delete.md`  
**Evidence:** `03-select-delete/reproof-2026-07-10/`

### Buyer outcome

A designer places furniture, selects that furniture, presses Delete or Backspace, and uses Ctrl/Cmd+Z to restore the same item with the same ID and pose.

### Tasks

1. Identify the current target 2D stage from P01/P02.
2. Define one selection type for furniture and preserve wall/opening selection boundaries.
3. Add a pure pick test for the current canvas coordinate system, rotation, hit padding, and topmost item behavior.
4. Add a pure delete test for selected furniture, locked furniture, no selection, and stale selection.
5. Add history tests proving undo restores the original entity ID, x/y, dimensions, and rotation.
6. Add keyboard tests for Delete, Backspace, Ctrl/Cmd+Z, editable fields, disabled state, and `preventDefault` only when planner action succeeds.
7. Wire the current workspace delete action. Do not create a parallel delete path.
8. Wire the current 2D stage selection path. Confirm selection remains furniture after a click.
9. Write a serial Playwright test: place real furniture → select it → Delete → undo.
10. Assert exact counts and identity. Capture placed, selected, deleted, and restored screenshots.
11. Fail the browser run on console errors that affect the planner.
12. Record why any opening/wall deletion behavior is deferred rather than pretending it is in W3.

### P03 hard gate

`PASS` requires focused units **and** one browser run on the same recorded state. Unit-only is `FAIL` for W3.

## Phase 05 — W2 visible symbol readability

**Source:** `phases/P05-symbols-svg/P05-symbols-svg.md`  
**Evidence:** `05-symbols-svg/reproof-2026-07-10/`

### Buyer outcome

At normal planning zoom, placed furniture looks like furniture. The cabinet is not an empty colored rectangle.

### Tasks

1. Capture the current `cabinet-v0` symbol at default and close working zoom before changing code.
2. Capture one published SVG catalog item in the same canvas.
3. Identify the actual plan-canvas authority for each item: Block2D, published SVG draw, fallback, or other.
4. Add or retain tests for `pair`, `slab`, and `none` cabinet variants. Assert their primitive geometry differs.
5. Dump primitive JSON for each variant. Treat it as supporting evidence only.
6. Inspect the browser images. Count visible doors, stile/center line, handles or equivalent, and interior separation.
7. If primitives collapse at normal zoom, change the symbol geometry or stroke strategy in the current active stage. Do not simply increase the test count.
8. Keep published SVG generation and plan-canvas rendering separate in the documentation and tests.
9. Test SVG load failure. It must fall back honestly without showing a false finished symbol.
10. Re-run the browser proof after every visual change.

### P05 hard gate

`PASS` requires both:

1. a human-readable cabinet at working zoom in the browser; and
2. the declared SVG publish/canvas behavior actually occurring on the current route.

A green primitive dump, canvas diversity score, thumbnail, or SVG CLI run alone is not PASS.

## Phase 07 — W1/W2 real draw-and-place journey

**Source:** `phases/P07-draw-place-journey/P07-draw-place-journey.md`  
**Evidence:** `02-browser-open3d-journey/reproof-2026-07-10/`

### Buyer outcome

A user draws a small room, adds an opening to a wall that exists, then places at least two real catalog items including `cabinet-v0` using the product's normal placement controls.

### Tasks

1. Begin from an empty project. Record wall, opening, and furniture counts.
2. Select the current wall tool. Draw a measurable wall and assert wall-count delta.
3. Select the current door/opening tool. Place the opening on the created wall and assert opening delta plus parent-wall relationship.
4. Open the real inventory or catalog. Do not seed document state and do not use a hidden test-only factory.
5. Use the actual place CTA for `cabinet-v0`. Record the displayed catalog identity and created entity identity.
6. Use the actual place CTA for a second distinct SKU. Record both identities.
7. Assert furniture count delta is exactly two or the intended user action count.
8. Capture seven screenshots: empty, walls, opening, catalog selection, cabinet placed, second SKU placed, final plan.
9. Save `playwright-run.json` only after all assertions pass.
10. Reject blank screenshots, selection-only screenshots, configurator-only batch placement, and hard-coded `cabinet-v0` success flags.

### P07 hard gate

The journey is not PASS while P03 or P05 is red. The browser proof must show real controls and real state deltas.

## Phase 06 — W5/W6 save, reload, and honest status

**Source:** `phases/P06-save-honesty/P06-save-honesty.md`  
**Evidence:** `06-save-honesty/reproof-2026-07-10/`

### Buyer outcome

The plan saves locally, reloads with the same walls and furniture IDs, and never tells the user that local persistence is cloud sync.

### Tasks

1. Trace the current autosave hook, project reference, write queue, flush function, repository, and UI status source.
2. Add pure tests for latest-envelope flush. A stale closure must not save an older project state.
3. Add tests for project switch, leave/unload path, failed write, and local success state.
4. Define one status contract. Example allowed wording: `Saved locally on this device`.
5. Remove or correct any bare `Saved`, `Synced`, `Cloud`, or member-save label that the current code cannot prove.
6. Create a browser project with walls and two furniture entities. Record IDs and pose.
7. Wait for the actual save completion signal or call the exact explicit flush mechanism.
8. Hard-reload the browser. Do not reuse in-memory page state.
9. Compare IDs, wall geometry, furniture configuration, x/y, and rotation after reload.
10. Capture before save, saved status, reload, and restored-state screenshots.
11. If the current persistence scope is local-only, list cloud as deferred. Do not add cloud autosave in this phase.

### P06 hard gate

`PASS` requires hard reload identity proof and truthful status copy. Same entity count is not sufficient.

## Phase 04 — W4 2D/3D continuity and orbit

**Source:** `phases/P04-orbit-continuity/P04-orbit-continuity.md`  
**Evidence:** `04-orbit-continuity/reproof-2026-07-10/`

### Buyer outcome

The same office plan appears in 2D and 3D. Orbit is usable by default. Switching views does not alter the document.

### Tasks

1. Add a unit contract for document furniture IDs, x/y millimetres, dimensions, and stored rotation.
2. Add a unit contract for document-to-scene conversion. Document rotation units must be explicitly stated. If the adapter converts degrees to radians, test it.
3. Add a unit contract for the workspace passing orbit-enabled props to the active 3D viewer.
4. Assert the viewer creates controls when enabled and exposes a testable `data-orbit-enabled="true"` state.
5. In browser, create or load the P03/P07 plan. Capture its 2D entity state.
6. Switch to 3D. Assert the active viewer is visible and orbit-enabled.
7. Perform a small left-drag orbit action. Confirm the viewer remains usable.
8. Switch back to 2D. Compare IDs, position, dimensions, and rotation with the source document where observable.
9. Capture console output. Relevant console errors fail the run.
10. Save a one-state run record. Unit and browser results from different HEADs are `OPEN`, not PASS.

### P04 hard gate

Browser count preservation proves only count preservation. Pose/identity proof remains unit-level unless the browser test reads the document data directly.

## Phase 08 — W7 mesh readability

**Source:** `phases/P08-mesh-quality/P08-mesh-quality.md`  
**Evidence:** `08-mesh-quality/reproof-2026-07-10/`

### Buyer outcome

The reference cabinet reads as a manufactured object at a useful angle: toe, carcass, and door are visible. It does not need photoreal materials.

### Tasks

1. Freeze the target geometry: default cabinet dimensions and door style.
2. Specify named mesh parts and formulas for toe, carcass, door, and any handle/stile that the visual bar requires.
3. Add tests for part existence, part order, dimensions, total height, and footprint consistency.
4. Verify generated mesh/GLB policy remains system-generated only. Do not introduce designer static GLBs.
5. Produce a repeatable three-quarter and side visual smoke. Record camera, viewport, material, and fixture options.
6. Grade the images against a written checklist. Each criterion receives yes/no and a screenshot reference.
7. If it still reads as one box, return to geometry. Do not edit the status file first.
8. Re-run placement and scene regressions after geometry changes.

### P08 hard gate

The mesh is PASS only when code, tests, and images agree on visible toe, carcass, and door. It is not a photoreal-quality claim.

## Phase 09 — W8 shortcut and chrome truth

**Source:** `phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md`  
**Evidence:** `09-shortcuts-chrome/reproof-2026-07-10/`

### Buyer outcome

The visible planner tool labels match the keys and handlers that actually run.

### Tasks

1. Find the single source map for tool ID, display label, keyboard shortcut, command, aria shortcut, and rail placement.
2. Remove or document every second map, inline override, or stale label.
3. Lock `D` to Door and `M` to Dimension unless P01 proves the current product intentionally differs.
4. Add map-driven unit tests that fail when label, key, handler, or `aria-keyshortcuts` diverge.
5. Add keyboard integration tests for each mapped tool, editable-field guard, and palette/rail path.
6. Verify the 2D stage consumes the same command map. A rail label without a handler is FAIL.
7. Audit hide-tools and responsive chrome only where it hides a required W-gate tool.
8. Capture browser proof for visible rail labels and keyboard activation where the current target route supports it.
9. Record any delegated keyboard ownership between workspace and canvas.

### P09 hard gate

A static label table is not enough. The same map must drive the handler and accessible shortcut value.

## Phase 10 — Evidence, release truth, and handover

**Source:** `phases/P10-evidence-handover/P10-evidence-handover.md`  
**Evidence:** `10-handover/reproof-2026-07-10/`

### Goal

Create an honest release or non-release decision. This phase does not add product features.

### Tasks

1. Enumerate P01–P09 expected evidence folders and required files from the restored `RESULTS-MAP.md`.
2. Probe every required folder on the recorded HEAD. Mark missing, stale, mixed-state, or valid.
3. Write `W-GATES.md` with W1–W8 result, exact proof links, and residuals.
4. Write `MASTER-SYNC.md` from the actual phase results. Do not tick historical boxes automatically.
5. Write `HEAD.txt`, `WORKTREE.txt`, `FAILURES-SNIP.md`, and `BACKUP-LOG.md`.
6. Use Mode A if proof is incomplete: a FAIL-honest handover that names the next red gate.
7. Use Mode B only if every required current proof is present and readable.
8. Run the agreed layout, type, lint, unit, and browser commands. Preserve all output.
9. Push the committed phase work to origin when safe. Attempt the mayoite mirror. Log a failure instead of inventing backup success.
10. Write `SHIP-HONESTY.md`: what a buyer can do, what is local-only, what remains boxy, what is not commercial, and what must not be promised.

### P10 hard gate

An old E: folder, old screenshots, empty directories, unit-only packs, or a completed checklist cannot create a release PASS.

## 6. Raised module rule

The historical W-gate spine proves basic product behavior. It does not prove global-standard module completion.

After a gate is current and honest, run the matching raised module under `results/planner/global-standard-revision/modules/`:

| Gate phase | Raised module |
|---|---|
| P01/P02 | foundation |
| P03 | select-edit |
| P05 | symbols-svg |
| P07 | canvas-2d and catalog-place |
| P06 | save-persist |
| P04 | view-3d-orbit |
| P08 | mesh-3d |
| P09 | shell-chrome |
| Admin SVG work | admin-svg-pipeline |
| Quote path | export-boq |

Each raised module needs a brainstorm, UI review, synthesis, implementation proof, and an honest open list. An old W PASS is never enough.

## 7. First execution action

Execute P01's current-state reproof addendum. Do not start P02, P03, or a generic rewrite before it produces a single-state verdict.

**Goal unchanged:** build a buyer-usable O&O manufacturer planner with one real system and a truthful path to quote.
