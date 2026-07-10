# P08 Mesh Quality — CODE REVIEW REPORT

| Field | Value |
|-------|--------|
| **Phase** | P08 Mesh Quality (W7 / CP-08) |
| **Date** | 2026-07-10 |
| **Checkout** | `D:\OandO07072026` main · SHA `7cad93d` · no worktree |
| **Reviewer mode** | Repo-first vs plan · **no implement · no plan edits** |
| **Plan reviewed** | `plans1/P08-mesh-quality/IMPLEMENTATION-PLAN.md` |
| **Brainstormer** | `archive/Idiots2/P08-mesh-quality/REPORT.md` (live path; plan still cites `Idiots2/…`) |
| **Phase card** | `Plans/phases/P08-mesh-quality/P08-mesh-quality.md` (honesty baseline **stale**) |

---

## Verdict

**CONDITIONAL — geometry bar largely landed; W7/CP-08 FAIL until evidence pack + smoke land (and blast honesty cleaned).**

- **Mesh product code:** Approach A is correct. Live `modularCabinetV0` already implements locked **toe → carcass → door(s)**, shared constants, height integrity, plan===mesh.
- **Units (primary):** **19/19 PASS** (`modularCabinetV0` + GlbExport).
- **Units (blast place/scene):** **24/24 PASS** (`createSceneObjectFromNode` + `modularPlaceMesh`).
- **Units (meshStages):** **1 FAIL** — G5 `validation.nodeCount` forced to `0` under happy-dom (`typeof window !== "undefined"` stub). Pair `runtimeMeshChildren`/`partCount` **=== 4** still green via `runModularMeshStages`.
- **Evidence / NOTES / PNGs / run.json:** **MISSING** — entire repo-root `results/` tree absent → **CP-08 red by definition**.
- **Smoke path:** planned `cabinetV0MeshSmokeRender` + CLI **not in repo**.

Do **not** claim W7 pass. Do **not** re-implement toe (Task 03 should skip unless formulas drift). Finish **NOTES + smoke + evidence + blast truth**.

---

## Executive summary

W7 asks for a **manufacturer-readable** cabinet-v0 mesh (toe / carcass / door), a written **NOTES** bar, and **visual smoke** under `results/planner/world-standard-wave/08-mesh-quality/`. Competitive north star is **IKEA-class product depth / BOQ honesty**, not Homestyler photoreal.

**Repo truth (2026-07-10):** Procedural mesh and G4 part plans already match the locked formulas (100 / 50 / 18 mm; matrix 2/3/4; Box3 Y span = SKU height; door bottom ≥ toe top). Viewer place path builds the same group via `createSceneObjectFromNode`. G5 binary export exists and produces bytes; validation **in unit env is a stub**.

**Plan truth:** `plans1` P08 plan correctly selects **Approach A (evidence finish)**, correctly rejects virgin rewrite and designer GLB, and correctly marks evidence missing. Phase execute card (`Plans/phases/…/P08-mesh-quality.md`) still claims “no toe / counts 1/2/3” — **stale vs code**; plan already says repo wins.

**Gate truth:** Without NOTES + graded PNGs + run.json under the sole primary folder `08-mesh-quality/`, CP-08 is **paper-red**. Units alone are not W7.

---

## Repo truth table

| Claim (W7 / plan) | Live path | Status |
|-------------------|-----------|--------|
| Named parts slab: `toe` → `carcass` → `door-slab` | `site/features/planner/open3d/catalog/modularCabinetV0.ts` `generateCabinetV0Mesh` | **YES** |
| Matrix none=2 / slab=3 / pair=4 | `countCabinetV0Parts` + tests | **YES** |
| Constants `TOE_HEIGHT_MM=100`, `TOE_INSET_MM=50`, `DOOR_THICKNESS_MM=18` exported | same + unit asserts | **YES** |
| Toe inset geometry back-aligned | mesh + GlbExport part plans | **YES** |
| Carcass sits on toe; not full-height + additive | `carcassH = h - toeH` | **YES** |
| Doors track carcassH; door bottom ≥ toe top | unit “doors track carcass…” | **YES** |
| Box3 Y span ≈ heightMm; minY ≈ 0 | unit height integrity | **YES** (primary pack live-run PASS) |
| plan === mesh 1:1 | `modularCabinetV0GlbExport.test.ts` | **YES** |
| GlbExport imports shared constants (no dup magic) | `modularCabinetV0GlbExport.ts` imports | **YES** |
| Footprint outer 600×580 path | `generateCabinetV0Footprint` | **YES** |
| Scene factory procedural floor origin | `createSceneObjectFromNode.ts` | **YES** |
| Blast pair children include `toe`, length 4 | createSceneObjectFromNode test | **YES** |
| meshStages pair partCount 4 | `runModularMeshStages` assert | **YES** |
| meshStages G5 nodeCount > 0 | `exportModularCabinetV0GlbBinary` + test | **NO** under happy-dom (window stub) |
| Designer static GLB banned for generated path | `glbAssetPolicy` + export plan | **YES** |
| Headless smoke module + CLI | planned only | **MISSING** |
| Evidence `results/planner/world-standard-wave/08-mesh-quality/` | repo root | **MISSING** (`results/` absent) |
| NOTES.md / PNGs / visual-smoke.md / run.json | evidence home | **MISSING** |
| Catalog copy mentions toe | `demoCatalogItems.ts` description | **STALE** (“carcass + doors” only) |
| stages mesh-g3 note “toe+carcass+door” | `asset-engine/stages.ts` | **STALE** (still generic partial box note) |
| Phase honesty baseline “no toe” | `Plans/phases/P08-mesh-quality/P08-mesh-quality.md` | **STALE** (docs only) |
| Idiots2 report at plan path | plan cites `Idiots2/…` | **MISPATH** → actual `archive/Idiots2/…` |

### Live proof commands (this review)

```text
Primary: modularCabinetV0 + GlbExport → 2 files, 19 tests PASS (~1.5s)
Blast place: createSceneObjectFromNode + modularPlaceMesh → 2 files, 24 tests PASS
Blast meshStages: 1 FAIL (nodeCount>0) | runModularMeshStages pair=4 PASS
```

---

## Findings

### Blocking (B) — gate cannot green without these

| ID | Finding | Evidence |
|----|---------|----------|
| **B1** | **Entire evidence tree missing** — no `results/`, no `08-mesh-quality/`, no NOTES/PNG/run.json | `Test-Path results` → MISSING; RESULTS-MAP sole primary `08-mesh-quality/` |
| **B2** | **Headless visual smoke not implemented** — no `cabinetV0MeshSmokeRender.ts`, no CLI, no graded PNGs | Planned create paths all False on disk |
| **B3** | **CP-08 cannot pass on units alone** — design gate + plan false-green catalog require NOTES + visual | Design W7 + plan §8 |

### High (H)

| ID | Finding | Evidence |
|----|---------|----------|
| **H1** | **G5 validation stubbed when `window` exists** — happy-dom → `valid: true`, `nodeCount: 0` without parsing GLB; meshStages unit asserts `nodeCount > 0` → **FAIL** | `exportModularGlbBinary.ts` L105–117; vitest `environment: 'happy-dom'`; live fail at meshStages.test.ts:47 |
| **H2** | **Planned smoke door colors invent differentiation not present in runtime mesh** — mesh uses **same** carcass/door hex; smoke plan paints door slightly different for multi-color / readability theater | `modularCabinetV0.ts` carcassMat/doorMat same `color`; plan smoke `partColor` door branch ≠ carcass |
| **H3** | **Phase execute card honesty baseline still says “no toe / 1·2·3”** — risk of executor thrash if they ignore idiot plan Task 00 re-proof | `P08-mesh-quality.md` §Honesty baseline |
| **H4** | **No unit assert that toe material is darker than carcass** — NOTES/bar requires darker toe band; only oak≠white carcass color tested | `modularCabinetV0.test.ts` materials tests |

### Medium (M)

| ID | Finding | Evidence |
|----|---------|----------|
| **M1** | Demo catalog description omits toe — UX/docs honesty lag | `demoCatalogItems.ts` “carcass + doors” |
| **M2** | `stages.ts` mesh-g3 note still generic; optional plan honesty bump not done | stages L139–146 |
| **M3** | Plan input path `Idiots2/P08-mesh-quality/REPORT.md` wrong; report lives under `archive/Idiots2/` | list_dir |
| **M4** | Smoke lower-band luma sample at fixed fractions (`0.78` / `0.45`) is **brittle** if camera/pad changes | plan Task 04 test body |
| **M5** | Door protrudes in +Z beyond outer footprint depth (`d/2 + doorT/2`) — residual BOQ envelope honesty (2D footprint ignores door thickness) | geometry formulas; residual OK if written |
| **M6** | `modularOptions` wins over node W/D/H when both present — possible plan/mesh/BOQ drift if stamps diverge | `createSceneObjectFromNode` L101–108; footprint resolver prefers modularOptions |
| **M7** | Full paste of entire mesh module in plan Task 03 is recovery-only bloat; good that skip is first-class, still tempts blind rewrite | IMPLEMENTATION-PLAN Task 03 |

### Low (L)

| ID | Finding | Evidence |
|----|---------|----------|
| **L1** | Toe roughness higher than carcass — good; not tested | mesh materials |
| **L2** | G8 async GLB load explicitly out of CP-08 — correct residual | residual sections |
| **L3** | Workstation / non-cabinet-v0 meshes correctly out of scope | plan § out of scope |
| **L4** | Fabric stage is destination/overlay flag only — not W7 mesh path | `canvas-fabric-stage/*`; redirects to open3d |

---

## Already exists (do not rebuild)

| Asset | Path | Notes |
|-------|------|-------|
| Runtime multi-part mesh | `site/features/planner/open3d/catalog/modularCabinetV0.ts` | Full W7 geometry + darker toe mats |
| G4 part plans + path slug | `…/modularCabinetV0GlbExport.ts` | Imports TOE_*/DOOR_*; plan-only status |
| G5 binary export | `site/features/planner/asset-engine/mesh/exportModularGlbBinary.ts` | Uses `generateCabinetV0Mesh` + GLTFExporter |
| Stage runner G1–G6 | `…/mesh/runMeshStages.ts` | Reports runtimeMeshChildren + partCount |
| Policy | `site/features/planner/lib/glbAssetPolicy.ts` | `catalog-assets/generated/` |
| Viewer consume | `…/3d/createSceneObjectFromNode.ts` | procedural modular-cabinet-v0 |
| Place / stamp paths | asset-engine mesh place* + browser place | cabinet-v0 narrow wire |
| Primary units | `modularCabinetV0.test.ts`, `modularCabinetV0GlbExport.test.ts` | Bar-encoded |
| Blast units | createSceneObjectFromNode, modularPlaceMesh, meshStages (partial) | Pair 4 green on place/stages runner |
| Footprint resolver | `resolveFurniture2DFootprint` + tests | Outer envelope |
| Brainstormer synthesis | `archive/Idiots2/P08-mesh-quality/REPORT.md` | Matches live mesh honesty; Approach A |
| Idiot execute plan | `plans1/P08-mesh-quality/IMPLEMENTATION-PLAN.md` | Strong evidence-first design |

---

## Residual (honest open debt after mesh code)

1. **CP-08 evidence pack** — NOTES, vitest logs under evidence, run.json, HEAD.txt.  
2. **Headless smoke** — implement software orthographic **without lying on door color** (prefer geometry-based door readability: silhouette / edge / depth, or document that door==carcass color).  
3. **G5 validation honesty in unit env** — either run node environment for meshStages export test, or assert bytes + plan without fake `valid:true`/`nodeCount:0` hybrid.  
4. **Docs lag** — phase honesty baseline, demo catalog description, optional stages note.  
5. **No handles / reveals / photoreal** — already accepted residual; keep in NOTES.  
6. **G8 load** — not required for W7; keep residual.  
7. **Door depth beyond footprint** — residual BOQ note.  
8. **Toe darker color unit** — small missing assert.

---

## False-green traps

| Trap | Live risk | Severity |
|------|-----------|----------|
| Units green ⇒ W7 green | **Active** — units strong, evidence zero | **Critical** |
| Phase “no toe” ⇒ re-implement | Mitigated if executor follows idiot plan Task 00; phase card still poison | High |
| meshStages “PASS” without reading fail | **1 FAIL** on nodeCount; pair=4 can still pass | High |
| Browser/window stub `valid: true` | **Active** false-green for validation when nodeCount not asserted | High |
| Smoke door recolor ≠ mesh | **Planned** false-green for “door face color” | High if executed as written |
| Designer GLB pretty PNG | Plan hard-rejects; keep blocked | Blocked by plan |
| Historical modular-* folders as CP-08 | `results/` missing entirely; RESULTS-MAP forbids | N/A now |
| Photoreal claim | Plan residual forbids | Process |
| Alias plinth/toe-kick | Code locked to `toe` | OK |
| Wrong evidence folder `07-*` / `09-mesh` | Plan forbids; folder not created yet | Process |

---

## Score

| Axis | Score (0–10) | Note |
|------|-------------:|------|
| Geometry match to W7 bar | **9** | Toe/carcass/door + formulas + Box3; toe-darker unit missing |
| plan === mesh | **9** | Explicit 1:1 tests green |
| Viewer / place path | **8** | Procedural path solid; modularOptions vs node dims residual |
| G4/G5 export path | **6** | Bytes + plan OK; validation stubbed in happy-dom; one blast fail |
| Unit bar coverage | **8** | Strong geometry; weak material-band assert |
| Evidence / visual gate | **0** | No `results/`, no NOTES/PNG |
| Plan quality (idiot plan) | **8** | Correct Approach A; excellent false-green catalog; smoke color lie + path citation issues |
| Phase card honesty | **3** | Stale “no toe” baseline |
| **CP-08 readiness** | **3** | Mesh ready; gate not closable |

**Overall review score: 6.5 / 10** (product mesh healthy; program gate incomplete).

---

## Kill-order (executor only — this review does not implement)

1. **Task 00** — create `results/planner/world-standard-wave/08-mesh-quality/`; HEAD.txt; re-proof toe via grep (already present).  
2. **Task 01** — land **NOTES.md** with numbers/matrix/fail modes/residual (use plan template).  
3. **Task 02** — re-run primary + blast; capture vitest logs under evidence; **do not** delete green geometry tests.  
4. **Task 03** — **SKIP** unless formulas fail; record skip in closeout.  
5. **Fix H1 before trusting meshStages green** — node env or honest validation asserts (same landable slice as blast log).  
6. **Task 04** — implement smoke **from part plans**; **align door color with mesh** (or grade silhouette without fake door hex); write PNGs + `visual-smoke.md`.  
7. **Task 05–06** — nonreg log + `run.json` + CP-08 table path-prove only under `08-mesh-quality/`.  
8. **Docs residual (optional same phase)** — demo description + stages note + mark phase honesty stale; **do not** edit plan files as part of “green.”

**Hard rejects:** virgin mesh rewrite; designer GLB; R3F rewrite; photoreal; expanding beyond cabinet-v0; claiming W7 from units alone.

---

## Bottom line

**The hard geometry work for W7 is already in the tree and unit-proven.** The idiot plan’s Approach A is the right call. What remains is **gate honesty**: written NOTES, deterministic visual smoke that does not invent a prettier door than runtime, evidence under the sole `08-mesh-quality/` folder, and an honest G5 validation story under happy-dom.

**Verdict again: CONDITIONAL mesh OK · CP-08 FAIL · execute evidence, not toe thrash.**

---

## Top 3 (return summary)

1. **CP-08 red:** no `results/…/08-mesh-quality/` (NOTES / PNGs / run.json missing).  
2. **Mesh already W7-shaped:** toe→carcass→door, formulas, plan===mesh, primary 19/19 PASS — **skip Task 03 rewrite**.  
3. **Honesty debt:** G5 `window` validation stub (meshStages 1 FAIL) + planned smoke door recolor ≠ live materials.

---

## Report paths

| Artifact | Absolute path |
|----------|----------------|
| **This report** | `D:\OandO07072026\plans1/P08-mesh-quality\CODE-REVIEW-REPORT.md` |
| Plan | `D:\OandO07072026\plans1/P08-mesh-quality\IMPLEMENTATION-PLAN.md` |
| Brainstormer | `D:\OandO07072026\archive\Idiots2\P08-mesh-quality\REPORT.md` |
| Mesh source | `D:\OandO07072026\site\features\planner\open3d\catalog\modularCabinetV0.ts` |
