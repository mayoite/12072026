# P08 — Mesh quality bar (W7)

> **For agentic workers:** REQUIRED SUB-SKILL: `/using-superpowers`. Load **TDD**, **verification-before-completion**, and **systematic-debugging** before editing mesh code. Do not implement until owner unlocks execution (plan-only until unlock). Use checkboxes. **No worktrees.** Commit as you go after each landable slice; push only on owner ask.

**Goal:** Raise modular **cabinet-v0** so a facilities buyer can read **toe / door / carcass** in 3D (and matching 2D footprint truth) — not a single apology box. Freeze the quality bar in NOTES, prove it with unit footprint/parts + visual smoke, land evidence under CP-08.

**Architecture:** Options JSON (`ModularCabinetV0Options`) → pure footprint + part plan → runtime `THREE.Group` via `generateCabinetV0Mesh` → optional G4/G5 generated GLB under `catalog-assets/generated/*` only. Viewer procedural path (`createSceneObjectFromNode`) and export path (`buildModularCabinetV0PartPlans` / `exportModularGlbBinary`) must stay **part-list identical**. No designer static GLB.

**Tech stack:** TypeScript, Three.js (runtime mesh), Vitest (unit), existing open3d modular place + asset-engine mesh stages, Playwright or headless Three render for visual smoke, evidence under `results/planner/world-standard-wave/08-mesh-quality/`.

**Gate:** **W7** — Mesh quality **bar doc** + visual: modular not “apology boxes” for cabinet-v0 (**toe / door / carcass readable**).

**Checkpoint:** **CP-08** (see end of this file + `../checkpoints/CHECKPOINTS.md` when that index is filled).

**Depends on (read-only context):** P01 product truth (what place/mesh path actually is); mesh stages in `site/features/planner/asset-engine/stages.ts` (G1–G6). Does **not** require P07 browser journey green to land unit + NOTES; browser place of cabinet-v0 improves visual smoke fidelity.

**Out of scope for P08:** Photoreal materials, full part library (L/U kitchens, hardware SKUs), Fabric cutover, cloud catalog, designer-authored GLB reintroduction, non–cabinet-v0 SKUs.

---

## Honesty baseline (repo fact today)

| Fact | Path / proof |
|------|----------------|
| Cabinet-v0 mesh = **carcass box + optional door panel(s)** | `site/features/planner/open3d/catalog/modularCabinetV0.ts` — `generateCabinetV0Mesh` |
| **No toe / plinth / kick** part | Same file — child names only `carcass`, `door-slab` / `door-left` / `door-right` |
| Part plan mirrors mesh (G4) | `modularCabinetV0GlbExport.ts` → `buildModularCabinetV0PartPlans` |
| Unit suite asserts child names / footprint box, not quality bar | `site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts` |
| Policy: generated only | `glbAssetPolicy` + export relative path `catalog-assets/generated/…` |
| Place stamps modular options → procedural group | `createSceneObjectFromNode.ts` when `geometryMode === "modular-cabinet-v0"` |

**Failure mode this phase kills:** “Modular works” while the eye still sees a featureless box (or door glued on a full-height box with no readable base).

---

## Quality bar (normative — write into NOTES as Task 1)

Cabinet-v0 is **PASS** for W7 only if all of the following hold:

1. **Named parts present** on default slab options: at least `toe` (or `toe-kick` / `plinth` — pick one name and keep it everywhere), `carcass`, and `door-slab` (or pair leaves).  
2. **Readable silhouette in 3D:** from a three-quarter front view, a human can distinguish base/toe band, body mass, and door face without reading wireframe labels.  
3. **Geometry rules (locked numbers for v0):**  
   - Toe height default **100 mm** (configurable constant `TOE_HEIGHT_MM`, not magic litter).  
   - Toe depth inset default **50 mm** from front face (recessed kick; still full width).  
   - Carcass sits **on top of toe** (carcass height = `heightMm - toeHeightMm`; total group height still `heightMm` to floor).  
   - Door(s) cover carcass face only (not toe); door height tracks carcass, not full enclosure including toe.  
4. **2D footprint** still matches outer plan W×D (centered path); may optionally mark front edge / door swing later — **outer rectangle must remain dimension-true** for BOQ path.  
5. **Part plan === mesh children** (same names, counts, sizes in metres, positions).  
6. **No designer static GLB** on any pass path; generated URLs only if G5 runs.  
7. **Materials:** toe may use a slightly darker value of the same material family so the band reads; oak vs white still distinct on carcass/door.

**FAIL examples (explicit):** single `BoxGeometry` furniture; door covering floor-to-top including kick; carcass full `heightMm` with toe added as extra height (overshoots SKU height); part plan missing `toe` while mesh has it; shipping a hand-made `.glb` from `public/` static product dumps.

---

## Primary files (touch list)

| Role | Path |
|------|------|
| Runtime mesh + footprint + options | `site/features/planner/open3d/catalog/modularCabinetV0.ts` |
| Pure part plan / G4 path slug | `site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts` |
| Scene factory (consume only; change only if origin/height contract breaks) | `site/features/planner/open3d/3d/createSceneObjectFromNode.ts` |
| G5 binary export (uses `generateCabinetV0Mesh` — re-run tests; edit only if validation assumes old part count) | `site/features/planner/asset-engine/mesh/exportModularGlbBinary.ts` |
| Stages honesty note (optional one-line status bump) | `site/features/planner/asset-engine/stages.ts` |
| Unit — mesh / parts / footprint | `site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts` |
| Unit — GLB plan parts | `site/tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts` |
| Unit — 2D footprint resolver | `site/tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts` |
| Evidence root | `results/planner/world-standard-wave/08-mesh-quality/` |

Do **not** add a designer static GLB under `site/public/` product trees. Do **not** invent a second mesh builder outside modularCabinetV0 + export mirror.

---

## Task 00 — Setup / evidence shell

**Files:**
- Create: `results/planner/world-standard-wave/08-mesh-quality/` (empty until artifacts land)
- Read: this phase file; `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §W7; current `modularCabinetV0.ts`

- [ ] **Step 1:** Confirm checkout is `D:\OandO07072026` main tree (no worktree).  
- [ ] **Step 2:** Create evidence directory if missing.  
- [ ] **Step 3:** Record pre-change unit baseline command (run after Task 02 red expected):

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/modularCabinetV0.test.ts tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts --reporter=verbose 2>&1 | Tee-Object -FilePath D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\vitest-baseline-raw.log
```

- [ ] **Step 4:** Commit is **not** required for empty dir alone; first commit after Task 01 NOTES or Task 03 green mesh — whichever lands first as a complete slice.

---

## Task 01 — Bar doc `NOTES.md` (W7 written truth)

**Files:**
- Create: `results/planner/world-standard-wave/08-mesh-quality/NOTES.md`

- [ ] **Step 1:** Write NOTES with these sections (no empty placeholders):  
  1. **Gate** — W7 / CP-08 wording.  
  2. **Pass criteria** — copy the normative list from “Quality bar” above (toe / door / carcass, numbers, plan===mesh, no designer GLB).  
  3. **Fail criteria** — apology box, height overshoot, policy breach.  
  4. **Part name table** — exact child `name` strings agents and tests must use.  
  5. **Commands** — unit + visual smoke commands used in this phase.  
  6. **Artifacts** — filenames expected in this folder (`vitest-raw.log`, `run.json`, screenshots).  
  7. **Honest residual** — what still looks boxy (e.g. no handles, no side reveals) so nobody claims photoreal.

- [ ] **Step 2:** NOTES must state: success metric remains **BOQ/quote path > photoreal**; readable parts beat pretty noise.

- [ ] **Step 3:** Landable commit message shape: `docs(planner): W7 mesh quality bar NOTES for cabinet-v0 (P08)`.

**Done when:** `NOTES.md` exists on disk with concrete numbers and names; a reviewer can grade a screenshot against NOTES without opening this plan file.

---

## Task 02 — Unit red: footprint + multi-part contract (TDD)

**Files:**
- Modify: `site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts`
- Modify: `site/tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts`
- Read: `resolveFurniture2DFootprint.test.ts` (extend only if footprint API gains toe-related outer bounds)

**Red tests (write first, expect fail against current mesh):**

- [ ] **Step 1:** Default slab options → mesh child **names** include `toe`, `carcass`, `door-slab` (order: toe, carcass, then door(s) — document and assert).  
- [ ] **Step 2:** `countCabinetV0Parts` returns **3** for slab (was 2), **4** for pair, **2** for none (toe + carcass).  
- [ ] **Step 3:** Toe mesh: height ≈ `100 * 0.001` m; Y position places bottom on floor (`position.y ≈ toeH/2`).  
- [ ] **Step 4:** Carcass height ≈ `(heightMm - 100) * 0.001`; carcass bottom sits on toe top (no double-count height).  
- [ ] **Step 5:** Door(s) bottom ≥ toe top (door does not cover toe).  
- [ ] **Step 6:** Footprint string still outer W×D centered for default 600×580 →  
  `M -300 -290 L 300 -290 L 300 290 L -300 290 Z` (unchanged outer envelope).  
- [ ] **Step 7:** `buildModularCabinetV0PartPlans` / plan `parts[].name` match mesh children 1:1; `partCount` matches.  
- [ ] **Step 8:** `assertNoDesignerStaticGlb` still passes on `relativePath` (regression).  
- [ ] **Step 9:** Run vitest; capture **red** log as `vitest-red-raw.log` under evidence dir (optional but preferred for honesty).

**Done when:** New assertions exist and fail for the right reason (missing `toe` / wrong part counts), not because of import typos.

---

## Task 03 — Green: implement readable modular cabinet-v0 mesh

**Files:**
- Modify: `site/features/planner/open3d/catalog/modularCabinetV0.ts`
- Modify: `site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts` (mirror sizes/positions; keep pure, no THREE)
- Touch if needed: `createSceneObjectFromNode.ts` (only if floor-origin comment/contract needs update)
- Touch if needed: export/count helpers and any hard-coded part counts in tests beyond Task 02

**Implementation steps:**

- [ ] **Step 1:** Add exported constants: `TOE_HEIGHT_MM = 100`, `TOE_INSET_MM = 50`, `DOOR_THICKNESS_MM` already present — keep single source; export or share with GLB plan file (duplicate constant already exists in export — **converge** to import from modularCabinetV0 to avoid drift).  
- [ ] **Step 2:** Rebuild `generateCabinetV0Mesh`:  
  - `toe` box: width = full W, depth = D − inset (anchor to **back** so front is recessed), height = toeH, y = toeH/2.  
  - `carcass` box: width W, depth D, height H − toeH, y = toeH + carcassH/2.  
  - doors: height ≈ carcassH × 0.92 (or full carcass face minus small reveal); z on front of carcass; y centered on carcass (not full H).  
- [ ] **Step 3:** Update `countCabinetV0Parts` to include toe always.  
- [ ] **Step 4:** Update `buildModularCabinetV0PartPlans` to identical layout in metres.  
- [ ] **Step 5:** Keep `group.name = "modular-cabinet-v0"`; `userData.options` snapshot; materials oak/white; optional darker toe color (same hex family).  
- [ ] **Step 6:** Run unit suite (Task 00 command) → all green; write `vitest-raw.log` + `run.json` (pass counts, date, HEAD short hash).  
- [ ] **Step 7:** Commit slice: `fix(planner): cabinet-v0 toe+carcass+door mesh quality (W7/P08)`.

**Done when:** Unit tests green; mesh is multi-part with readable base; footprint outer path unchanged; GLB plan parts include `toe`.

---

## Task 04 — Visual smoke (not unit-only theatre)

**Files / artifacts:**
- Create under evidence: `visual-smoke.md` (short procedure + pass/fail against NOTES)  
- Create: at least one PNG, preferred names:  
  - `01-cabinet-v0-three-quarter.png` (toe/door/carcass readable)  
  - `02-cabinet-v0-side.png` (toe inset / depth readable)  
- Optional script: small Node/Vitest or Playwright helper that places/renders modular mesh — **prefer reusing open3d page if P07 journey exists; else headless Three render of `generateCabinetV0Mesh` to canvas/PNG**

- [ ] **Step 1:** Choose one smoke path and document it in `visual-smoke.md` (exact command, viewport, options used: default slab white 600×580×720).  
- [ ] **Step 2:** Capture three-quarter front + side.  
- [ ] **Step 3:** In `visual-smoke.md`, checklist each NOTES pass criterion with **yes/no** and one sentence evidence (“toe band darker strip under door”).  
- [ ] **Step 4:** If browser path: also note console clean (no GLB 404 thrash from designer paths).  
- [ ] **Step 5:** Fail closed: if screenshot still looks like one box, **do not** mark CP-08 green — return to Task 03 geometry.

**Done when:** PNGs + `visual-smoke.md` exist; NOTES criteria ticked with visual reference; no static designer GLB used to fake the shot.

---

## Task 05 — Non-regression mesh pipeline + policy

**Files:**
- Run (do not expand scope): G5-related unit tests that consume modular export  
  - Prefer: `tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts`  
  - Plus any `exportModularGlbBinary` / place modular tests already in tree (`pnpm p0:unit` if that script exists and is the house non-regression; else scoped vitest list in NOTES)

- [ ] **Step 1:** Run non-regression suite; append or write `vitest-nonreg-raw.log`.  
- [ ] **Step 2:** Confirm generated relative path still under `catalog-assets/generated/` and policy helper rejects designer static patterns (existing tests).  
- [ ] **Step 3:** Optional honesty bump in `asset-engine/stages.ts` mesh-g3 note: “cabinet-v0 includes toe+carcass+door (W7 bar)” — only if status text would otherwise lie.  
- [ ] **Step 4:** Update `run.json` summary fields: `w7`, `partNamesDefaultSlab`, `vitestPassed`, `visualSmoke`, `policyNoDesignerGlb`.

**Done when:** Export/place unit path still green; policy unbroken; run.json machine-readable.

---

## Task 06 — CP-08 closeout

- [ ] **Step 1:** Fill evidence folder checklist:

| Artifact | Required |
|----------|----------|
| `NOTES.md` | Yes |
| `vitest-raw.log` | Yes |
| `run.json` | Yes |
| `01-cabinet-v0-three-quarter.png` (or equivalent named in NOTES) | Yes |
| `02-cabinet-v0-side.png` | Yes |
| `visual-smoke.md` | Yes |
| `vitest-nonreg-raw.log` | Preferred |

- [ ] **Step 2:** Self-grade against **CP-08** table below; only check green if data supports it.  
- [ ] **Step 3:** Commit closeout if any doc-only deltas remain: `test(planner): W7 mesh quality evidence pack (P08/CP-08)`.  
- [ ] **Step 4:** Report to owner: paths, pass/fail, residual (handles, materials still simple). **Do not** claim world-standard product complete — only W7 mesh bar for cabinet-v0.

---

## CP-08 — Hard stop gate

| Check | Pass condition | Evidence |
|-------|----------------|----------|
| **Bar doc** | NOTES defines toe/door/carcass, numbers, fail modes | `…/08-mesh-quality/NOTES.md` |
| **Unit footprint** | Outer W×D path stable; tests assert it | `vitest-raw.log` + modularCabinetV0 footprint tests |
| **Unit parts** | Default slab: toe + carcass + door; pair/none counts correct; plan===mesh | same + GlbExport tests |
| **Visual smoke** | Human-readable parts on PNG; checklist yes | PNGs + `visual-smoke.md` |
| **No designer GLB** | No new static product GLB; generated policy intact | code review + policy tests |
| **Height integrity** | Total height = options.heightMm; toe not additive overshoot | unit geometry asserts |
| **Honest residual** | NOTES lists what is still not photoreal | NOTES residual section |

**CP-08 green only if every row has a path.** Missing screenshot = red even if units green.

---

## Commands (copy-paste)

```powershell
# Evidence dir
New-Item -ItemType Directory -Force -Path D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality | Out-Null

# Core unit pack (P08)
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\vitest-raw.log
```

Visual smoke command is **chosen in Task 04** and frozen into `NOTES.md` + `visual-smoke.md` (browser open3d place **or** headless mesh render — both valid if PNGs prove the bar).

---

## Agent split (optional parallel, max 2 for this phase)

| Agent | Owns | Must not |
|-------|------|----------|
| A — TDD mesh | Tasks 02–03, unit evidence | Browser chrome / unrelated SKUs |
| B — Visual + NOTES polish | Tasks 01, 04, 06 packaging | Rewrite mesh without re-running A’s units |

Both: superpowers; trust data; no competitor GLB/code; no worktrees.

---

## Explicit non-goals (do not “helpfully” expand)

- Dumping or wiring designer static GLBs from `public/` catalogs  
- Rebuilding entire parametric library beyond cabinet-v0  
- Photoreal PBR asset packs  
- Claiming W1–W6/W8 from this phase  
- Skipping NOTES because “tests pass”

---

## Definition of done (phase)

P08 is done when:

1. `Plans/trustdata/phases/P08-mesh-quality.md` (this file) was followed with checkboxes during execution.  
2. Cabinet-v0 mesh exposes **toe + carcass + door** (readable).  
3. Unit footprint + parts green under evidence.  
4. Visual smoke PNGs graded against NOTES.  
5. **CP-08** table fully evidenced under `results/planner/world-standard-wave/08-mesh-quality/`.  
6. No designer static GLB introduced.

**Next phase after CP-08:** P09 shortcuts/chrome (**W8**), unless owner reorders.
