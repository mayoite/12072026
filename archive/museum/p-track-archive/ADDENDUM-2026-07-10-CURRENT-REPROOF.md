# Addendum 2026-07-10 — P01 current-state reproof

## Why this addendum exists

The restored P01 card is detailed. It is also historical.

It says the live 2D surface is `FeasibilityCanvas`. The current dirty tree contains a deleted `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`, an archived feasibility directory, and a changed Open3D README that calls Fabric the sole live 2D stage. Those cannot both be true.

This addendum does **not** change product code. It re-establishes facts before P02 or any W-gate work is trusted.

## Single outcome

Produce a current, reproducible statement of what `/planner/guest`, `/planner/canvas`, and `/planner/open3d` actually load; which document, 2D, 3D, catalog, and persistence paths they use; and which old plan claims are invalid on the recorded working state.

## Evidence location

All output for this addendum goes below:

```text
results/planner/world-standard-wave/00-product-truth/reproof-2026-07-10/
```

Do not overwrite earlier P01 evidence. Do not create another results root.

## Fixed boundaries

- Read, test, and document only. No product behavior edit.
- Do not stage or modify pre-existing dirty files.
- Do not restore deleted planner code merely to make an old plan path true.
- Do not call any result a CP-01 or product PASS until the final checklist is complete.
- No Firecrawl. No competitor research. No worktree.

## Task 00 — record the exact state

1. Run `git rev-parse HEAD` and save it as `HEAD.txt`.
2. Run `git status --short` and save the complete output as `WORKTREE.txt`.
3. Run `git diff --name-status` and save it as `TRACKED-DELTA.txt`.
4. Record Node, pnpm, and package-lock state in `ENVIRONMENT.txt`.
5. Write `RUN-META.json` with date, checkout path, HEAD, dirty=true/false, and the exact commands used.

**Stop:** If the working tree changes during this reproof, record the new state and restart from Task 00. Do not blend two states.

## Task 01 — prove the route host chains

For each route, trace imports from the route file to the mounted workspace. Record only paths that exist now.

| Route | Required trace |
|---|---|
| `/planner/guest` | route → route wrapper if present → planner host → native host → workspace → 2D stage + 3D viewer |
| `/planner/canvas` | same trace, including any redirect or distinct wrapper |
| `/planner/open3d` | route → planner host → native host → workspace → 2D stage + 3D viewer |

Write `ROUTE-HOST-CHAIN.md`. For every edge include source file, exported symbol, and whether it is server, client, dynamic, or direct.

**Required checks:**

```powershell
rg -n "Open3dPlannerHost|Open3dNativeHost|OOPlannerWorkspace|Open3dFabricStage|FeasibilityCanvas|ThreeLazyViewer" site/app site/features/planner
rg -n "planner/guest|planner/canvas|planner/open3d" site/app site/config
```

## Task 02 — settle the live 2D-stage fact

1. Confirm whether `Open3dFabricStage` is mounted by the current workspace.
2. Confirm whether any production import reaches `canvas-feasibility/FeasibilityCanvas`.
3. Confirm whether the old feasibility path is absent, archived, or still reachable through an alias.
4. Confirm all feature flags controlling 2D-stage selection and their exact accepted values.
5. Write `TWO_D_STAGE_DECISION.md` with one verdict only:
   - `Fabric live`;
   - `FeasibilityCanvas live`;
   - `split by route`; or
   - `unproven`.

The verdict must cite source lines and one browser result. If routes disagree, the verdict is `split by route`, not a forced single-engine claim.

## Task 03 — prove the document and persistence path

1. Trace project creation, entity ID creation, in-memory store, serialization, local persistence, and reload restore.
2. Record every path that can assign an entity ID. Identify any path not routed through `newEntityId()`.
3. Record whether persistence is IndexedDB, localStorage, server, or a mixture.
4. Record the exact UI wording used for local, saved, syncing, cloud, or error state.
5. Write `DOCUMENT-PERSISTENCE-MAP.md` and `SAVE-LANGUAGE-MATRIX.md`.

**Required source areas:**

```text
site/features/planner/open3d/model/
site/features/planner/open3d/document/
site/features/planner/open3d/persistence/
site/features/planner/open3d/editor/
site/features/planner/lib/newEntityId.ts
```

## Task 04 — prove catalog, symbol, and mesh authority

For `cabinet-v0` and one published SVG catalog item, record:

1. The catalog source and descriptor source.
2. The placement action and created entity shape.
3. The 2D symbol source: Block2D, published SVG, fallback, or another path.
4. The 3D source: procedural mesh, generated GLB, fallback, or another path.
5. The missing-data behavior.

Write `CATALOG-TO-CANVAS-TO-THREE.md`.

Do not claim that published SVG is the plan-canvas authority unless the current canvas code consumes it after placement. Do not claim generated GLB is the default 3D path unless the current place action stamps and loads it on this state.

## Task 05 — re-run the smallest P01 code proof

Run the current host-wiring unit test from the repository root:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d/hostWiringP01.test.ts --reporter=verbose
```

Save complete stdout and stderr as `host-wiring-vitest-raw.log`.

If the named test no longer matches the current host model, do not edit it in this phase. Write `TEST-DRIFT.md` that states the exact mismatch and the replacement test needed in the owning later phase.

## Task 06 — browser route probe

Start the normal development server using the command in `START.md`. Do not rely on an already-running unknown server.

For each of the three routes:

1. Capture HTTP status and final URL.
2. Capture a screenshot after the workspace is usable.
3. Capture browser console errors and failed requests.
4. Record visible 2D stage and 3D control availability.
5. Do not place, edit, or save a plan in this phase unless needed to expose the host chain.

Save results as:

```text
guest-route.png
canvas-route.png
open3d-route.png
browser-console.txt
browser-network.txt
ROUTE-PROBE.md
```

Any hydration error, missing canvas, failed module import, or route redirect changes the result to `OPEN` or `FAIL`.

## Task 07 — reconcile the plan authorities

Read and compare these sources on disk:

```text
AGENTS.md
Agents/Agents-ELON-STANDARD.md
Plans/trustdata/INDEX.md
Plans/INDEX.md
plans1/START-HERE.md
Plans/DIFFERENCE-MATRIX.md
Plans/trustdata/RESULTS-MAP.md
```

Write `AUTHORITY-CONTRADICTIONS.md` with four columns:

| Claim | Source | Current path/fact | Verdict |
|---|---|---|---|

At minimum record these contradictions if still present:

1. `Plans/INDEX.md` says `Plans/trustdata` was removed, while the restored tree is now present.
2. `plans1/START-HERE.md` says it is the only residual executor, while Trust-Data names its own execution order.
3. Old phase cards use FeasibilityCanvas, while current planner code may use Fabric.
4. Old gate PASS labels conflict with a dirty current state.

Do not resolve any conflict by deleting a document in this phase.

## Task 08 — build the W1–W8 capability table

For each W gate, write a row with all five fields. Empty fields are forbidden.

| Gate | Current source path | Current browser proof | Current unit proof | Verdict and missing proof |
|---|---|---|---|---|

Rules:

- W3 cannot be PASS without unit and browser proof.
- W4 cannot be PASS without same-state pose proof, orbit proof, and clean console evidence.
- W5 cannot be PASS from entity counts. IDs must survive hard reload.
- W2 cannot be PASS from primitive JSON alone. The normal-zoom browser symbol must be readable.
- W6 cannot claim cloud if current persistence is local-only.

Write `W-GATE-CAPABILITY-2026-07-10.md`.

## Task 09 — final P01 verdict

Write `VERDICT.md`. It must contain exactly these sections:

1. Recorded state.
2. Facts proved now.
3. Facts disproved now.
4. Facts still unproved.
5. P01 verdict: `PASS`, `HALF`, `OPEN`, or `FAIL`.
6. The single next phase or residual.

P01 is **not PASS** if any route host chain is unresolved, the 2D stage is ambiguous, raw test output is missing, or the evidence comes from mixed working states.

## Handoff rule

Only after this addendum is complete may the plan decide whether P02 is still an engine-lock reproof, a Fabric migration completion phase, or an obsolete historical phase.

**Goal unchanged:** O&O still needs a buyer-usable manufacturer planner. This addendum only restores the truth required to reach it.
