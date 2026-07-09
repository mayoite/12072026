# P08 — Mesh quality bar (W7)

> **For agentic workers:** REQUIRED SUB-SKILL: `/using-superpowers`. Load **TDD**, **verification-before-completion**, and **systematic-debugging** before editing mesh code. **W0 UNLOCKED** — execute; do not re-ask owner unlock. Use checkboxes. **No worktrees.** Commit as you go; push/mirror per AGENTS.md.

### Expert pass P0 (2026-07-09)

- **Default slab children exact order:** `toe` → `carcass` → `door-slab` (pair: +`door-left`/`door-right`). Live cabinet-v0 is still carcass+door (no `toe`) — gap.
- **Height integrity:** Box3 span ≈ `heightMm`; toe **replaces** bottom of carcass (never additive overshoot). Doors track **carcassH**, not full `h`.
- **plan === mesh:** GlbExport **imports** `TOE_*` / `DOOR_THICKNESS_MM` from `modularCabinetV0` — delete duplicate constants. Blast tests (`createSceneObjectFromNode`, meshStages pair 3→4) in same landable slice.
- Stay **imperative Three** / procedural cabinet-v0 — no designer static GLB, no photoreal race, no R3F rewrite for pretty PNG. Evidence: `08-mesh-quality/` only.
- Authority: [EXPERT-PASS.md](../reviews/EXPERT-PASS.md) · `03-r3f-3d.md`.

**Goal:** Raise modular **cabinet-v0** so a facilities buyer can read **toe / door / carcass** in 3D (and matching 2D footprint truth) — not a single apology box. Freeze the quality bar in NOTES, prove it with unit footprint/parts + visual smoke, land evidence under CP-08.

**Architecture:** Options JSON (`ModularCabinetV0Options`) → pure footprint + part plan → runtime `THREE.Group` via `generateCabinetV0Mesh` → optional G4/G5 generated GLB under `catalog-assets/generated/*` only. Viewer procedural path (`createSceneObjectFromNode`) and export path (`buildModularCabinetV0PartPlans` / `exportModularGlbBinary`) must stay **part-list identical**. No designer static GLB.

**Tech stack:** TypeScript, Three.js (runtime mesh), Vitest (unit), existing open3d modular place + asset-engine mesh stages, **default visual smoke = headless Three render of `generateCabinetV0Mesh`** (browser place optional if P07 green), evidence under `results/planner/world-standard-wave/08-mesh-quality/`.

**Gate:** **W7** — Mesh quality **bar doc** + visual: modular not “apology boxes” for cabinet-v0 (**toe / door / carcass readable**).

**Checkpoint:** **CP-08** (see end of this file + `../checkpoints/CHECKPOINTS.md`).

**Authority:** Owner message > `Plans/trustdata/` > `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §W7 > Plan A core.

**Ethics:** Competitive research is ideas only. No competitor code, CSS, GLB, logos, or brands in product or tests. MIT/open packages only if any dep is needed (prefer zero new deps).

**Depends on (read-only context):** P01 product truth (what place/mesh path actually is); mesh stages in `site/features/planner/asset-engine/stages.ts` (G1–G6). Does **not** require P07 browser journey green to land unit + NOTES + headless visual smoke; browser place of cabinet-v0 is an optional fidelity upgrade only.

**Out of scope for P08:** Photoreal materials, full part library (L/U kitchens, hardware SKUs), Fabric cutover, cloud catalog, designer-authored GLB reintroduction, non–cabinet-v0 SKUs, any write under `site/public/**` product trees.

---

## Expert revision note — 2026-07-09

Planning pass (no product code). Live-verified `modularCabinetV0*` paths and blast-radius tests. Applied from [reviews/P08-suggestions.md](../reviews/P08-suggestions.md):

1. **Lock part name** to exact child `name: "toe"` (no plinth/toe-kick aliases).  
2. **Blast-radius** tests listed (createSceneObjectFromNode, meshStages hard-coded 3→4, modularPlaceMesh).  
3. **Geometry formulas** frozen (toe inset z, carcass on toe, door on carcass only).  
4. **Visual smoke default** = headless mesh PNG (P07 not required).  
5. **Height integrity** unit: total Y span ≈ `heightMm` (no additive overshoot).

---

## Skills (mandatory when executing)

| Skill | When |
|-------|------|
| `/using-superpowers` | Always (main + every subagent) |
| `test-driven-development` | Tasks 02–03 (red before green mesh) |
| `verification-before-completion` | Before claiming CP-08 green |
| `systematic-debugging` | Only if green fails for geometry/policy reasons |
| `executing-plans` / `subagent-driven-development` | After owner unlock |

---

## Honesty baseline (repo fact — verified 2026-07-09)

| Fact | Path / proof |
|------|----------------|
| Cabinet-v0 mesh = **carcass box + optional door panel(s)** only | `site/features/planner/open3d/catalog/modularCabinetV0.ts` — `generateCabinetV0Mesh` |
| **No toe / plinth / kick** part | Same file — child names only `carcass`, `door-slab` / `door-left` / `door-right` |
| Counts today: none=1, slab=2, pair=3 | `countCabinetV0Parts` + unit tests |
| Part plan mirrors mesh (G4) | `modularCabinetV0GlbExport.ts` → `buildModularCabinetV0PartPlans` |
| Duplicate door thickness constant | `DOOR_THICKNESS_MM = 18` private in both mesh + GlbExport — **converge** on export from mesh module |
| Unit suite asserts child names / footprint box, not quality bar | `modularCabinetV0.test.ts` |
| Scene factory hard-codes slab=2 / pair=3 names without toe | `createSceneObjectFromNode.test.ts` |
| Mesh stages hard-code pair partCount **3** | `meshStages.test.ts` |
| Policy: generated only | `glbAssetPolicy` + export relative path `catalog-assets/generated/…` |
| Place stamps modular options → procedural group | `createSceneObjectFromNode.ts` when `geometryMode === "modular-cabinet-v0"` |
| Evidence dir for W7 | `results/planner/world-standard-wave/08-mesh-quality/` (create at Task 00; do not use historical `modular-*` as CP-08 home) |

**Failure mode this phase kills:** “Modular works” while the eye still sees a featureless box (or door glued on a full-height box with no readable base).

---

## Quality bar (normative — write into NOTES as Task 1)

Cabinet-v0 is **PASS** for W7 only if all of the following hold:

1. **Named parts present** on default slab options: **`toe`**, **`carcass`**, and **`door-slab`** (pair → `door-left` + `door-right`).  
   - **Locked name:** child `name` string is exactly **`toe`** (not `toe-kick`, not `plinth`). Same string in mesh, part plan, NOTES, tests.  
   - **Locked child order:** `toe`, `carcass`, then door part(s).  
2. **Readable silhouette in 3D:** from a three-quarter front view, a human can distinguish base/toe band, body mass, and door face without reading wireframe labels.  
3. **Geometry rules (locked numbers + formulas for v0):**  
   - Constants (export from `modularCabinetV0.ts`; GlbExport **imports** — no second magic copy):  
     - `TOE_HEIGHT_MM = 100`  
     - `TOE_INSET_MM = 50`  
     - `DOOR_THICKNESS_MM = 18` (export existing private const)  
   - Let `w = widthMm * MM`, `d = depthMm * MM`, `h = heightMm * MM`, `toeH = TOE_HEIGHT_MM * MM`, `inset = TOE_INSET_MM * MM`, `carcassH = h - toeH`, `doorT = DOOR_THICKNESS_MM * MM`, `MM = 0.001`.  
   - **`toe`:** `sizeM = { x: w, y: toeH, z: d - inset }`, `positionM = { x: 0, y: toeH/2, z: -inset/2 }` (back-aligned so front is recessed).  
   - **`carcass`:** `sizeM = { x: w, y: carcassH, z: d }`, `positionM = { x: 0, y: toeH + carcassH/2, z: 0 }`.  
   - **Doors:** height ≈ `carcassH * 0.92` (not full `h`); `y` centered on carcass (`toeH + carcassH/2`); `z = d/2 + doorT/2`; slab width ≈ `w * 0.96`; pair leaves ≈ `w * 0.47` with existing ±0.005 gap.  
   - **Height integrity:** total group Y span (maxY − minY) ≈ `h` — toe is **not** stacked on full-height carcass (no overshoot past SKU height).  
4. **2D footprint** still matches outer plan W×D (centered path); may optionally mark front edge / door swing later — **outer rectangle must remain dimension-true** for BOQ path.  
5. **Part plan === mesh children** (same names, order, counts, sizes in metres, positions).  
6. **No designer static GLB** on any pass path; generated URLs only if G5 runs (`catalog-assets/generated/*` only). Do not add files under `site/public/**` for this phase.  
7. **Materials:** toe may use a slightly darker value of the same material family so the band reads; oak vs white still distinct on carcass/door.

**Part-count matrix after change:**

| `doorStyle` | Parts | Names (order) |
|-------------|-------|----------------|
| `none` | **2** | `toe`, `carcass` |
| `slab` | **3** | `toe`, `carcass`, `door-slab` |
| `pair` | **4** | `toe`, `carcass`, `door-left`, `door-right` |

**FAIL examples (explicit):** single `BoxGeometry` furniture; door covering floor-to-top including kick; carcass full `heightMm` with toe added as extra height (overshoots SKU height); part plan missing `toe` while mesh has it; shipping a hand-made `.glb` from `public/` static product dumps; renaming toe to a second alias mid-phase.

---

## Primary files (touch list)

| Role | Path | Verified 2026-07-09 |
|------|------|---------------------|
| Runtime mesh + footprint + options | `site/features/planner/open3d/catalog/modularCabinetV0.ts` | OK — no toe today |
| Pure part plan / G4 path slug | `site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts` | OK — mirrors mesh; dup constant |
| Scene factory (consume only; change only if origin/height contract breaks) | `site/features/planner/open3d/3d/createSceneObjectFromNode.ts` | OK — uses generateCabinetV0Mesh |
| G5 binary export (uses `generateCabinetV0Mesh` — re-run tests; edit only if validation assumes old part count) | `site/features/planner/asset-engine/mesh/exportModularGlbBinary.ts` | OK |
| Policy helper (read / regression) | `site/features/planner/lib/glbAssetPolicy.ts` | OK |
| Stages honesty note (optional one-line status bump) | `site/features/planner/asset-engine/stages.ts` | OK |
| Unit — mesh / parts / footprint | `site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts` | OK — TDD primary |
| Unit — GLB plan parts | `site/tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts` | OK — TDD primary |
| Unit — 2D footprint resolver | `site/tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts` | OK — outer envelope |
| **Blast** — scene factory child counts/names | `site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts` | OK — hard-codes 2/3 |
| **Blast** — place → mesh children | `site/tests/unit/features/planner/open3d/modularPlaceMesh.test.ts` | OK — uses count helper |
| **Blast** — G1–G6 pair partCount 3→4 | `site/tests/unit/features/planner/asset-engine/meshStages.test.ts` | OK — hard-codes 3 |
| Evidence root | `results/planner/world-standard-wave/08-mesh-quality/` | Create Task 00 |

Do **not** add a designer static GLB under `site/public/` product trees. Do **not** invent a second mesh builder outside modularCabinetV0 + export mirror.

---

## Task 00 — Setup / evidence shell

**Files:**
- Create: `results/planner/world-standard-wave/08-mesh-quality/` (empty until artifacts land)
- Read: this phase file; `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §W7; current `modularCabinetV0.ts` + `modularCabinetV0GlbExport.ts`

- [ ] **Step 1:** Confirm checkout is `D:\OandO07072026` main tree (no worktree).  
- [ ] **Step 2:** Create evidence directory if missing.  
- [ ] **Step 3:** Record pre-change unit baseline (expect green today; red after Task 02):

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
  2. **Pass criteria** — copy the normative list from “Quality bar” above (exact name `toe`, formulas, plan===mesh, no designer GLB).  
  3. **Fail criteria** — apology box, height overshoot, policy breach, wrong part name alias.  
  4. **Part name table** — exact child `name` strings and order (toe / carcass / door-*).  
  5. **Part-count matrix** — none=2, slab=3, pair=4.  
  6. **Commands** — unit + **default headless** visual smoke command used in this phase.  
  7. **Artifacts** — filenames expected in this folder (`vitest-raw.log`, `run.json`, PNGs, `visual-smoke.md`).  
  8. **Honest residual** — what still looks boxy (e.g. no handles, no side reveals) so nobody claims photoreal.

- [ ] **Step 2:** NOTES must state: success metric remains **BOQ/quote path > photoreal**; readable parts beat pretty noise.

- [ ] **Step 3:** Landable commit message shape: `docs(planner): W7 mesh quality bar NOTES for cabinet-v0 (P08)`.

**Done when:** `NOTES.md` exists on disk with concrete numbers and names; a reviewer can grade a screenshot against NOTES without opening this plan file.

---

## Task 02 — Unit red: footprint + multi-part contract (TDD)

**Files:**
- Modify: `site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts`
- Modify: `site/tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts`
- Read: `resolveFurniture2DFootprint.test.ts` (extend only if footprint API gains toe-related outer bounds — outer envelope must stay unchanged)
- Read (do not green yet): blast files listed below — expect them red after Task 03 if left stale; update in Task 03

**Red tests (write first, expect fail against current mesh):**

- [ ] **Step 1:** Default slab options → mesh child **names** equal `["toe", "carcass", "door-slab"]` (exact order).  
- [ ] **Step 2:** `countCabinetV0Parts` returns **3** for slab (was 2), **4** for pair, **2** for none (toe + carcass).  
- [ ] **Step 3:** Toe mesh: height ≈ `100 * 0.001` m; `position.y ≈ toeH/2`; `position.z ≈ -inset/2`; depth ≈ `(depthMm - 50) * 0.001`.  
- [ ] **Step 4:** Carcass height ≈ `(heightMm - 100) * 0.001`; carcass bottom sits on toe top (no double-count height).  
- [ ] **Step 5:** Door(s) bottom ≥ toe top (door does not cover toe); door height tracks carcass, not full enclosure.  
- [ ] **Step 6:** **Height integrity:** with `THREE.Box3().setFromObject(group)`, `max.y - min.y` ≈ `heightMm * 0.001` (tolerance e.g. 1e-6 or 1 mm).  
- [ ] **Step 7:** Footprint string still outer W×D centered for default 600×580 →  
  `M -300 -290 L 300 -290 L 300 290 L -300 290 Z` (unchanged outer envelope).  
- [ ] **Step 8:** `buildModularCabinetV0PartPlans` / plan `parts[].name` match mesh children 1:1 (order + sizes + positions); `partCount` matches.  
- [ ] **Step 9:** `assertNoDesignerStaticGlb` still passes on `relativePath` (regression).  
- [ ] **Step 10:** Run vitest; capture **red** log as `vitest-red-raw.log` under evidence dir (optional but preferred for honesty).

**Done when:** New assertions exist and fail for the right reason (missing `toe` / wrong part counts), not because of import typos.

---

## Task 03 — Green: implement readable modular cabinet-v0 mesh

**Files:**
- Modify: `site/features/planner/open3d/catalog/modularCabinetV0.ts`
- Modify: `site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts` (mirror sizes/positions; keep pure, no THREE; **import** toe/door constants from modularCabinetV0)
- Modify (blast — same landable slice or immediate next commit):  
  - `site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts` (slab 3 children; pair 4; names include `toe`)  
  - `site/tests/unit/features/planner/asset-engine/meshStages.test.ts` (pair partCount / runtimeMeshChildren **4**)  
  - `site/tests/unit/features/planner/open3d/modularPlaceMesh.test.ts` if any hard-coded counts/names remain  
- Touch if needed: `createSceneObjectFromNode.ts` (only if floor-origin comment/contract needs update — group origin stays floor)

**Implementation steps:**

- [ ] **Step 1:** Export constants: `TOE_HEIGHT_MM = 100`, `TOE_INSET_MM = 50`, `DOOR_THICKNESS_MM = 18` from `modularCabinetV0.ts`. GlbExport imports them — **delete** local duplicate door thickness.  
- [ ] **Step 2:** Rebuild `generateCabinetV0Mesh` using the **Quality bar formulas** (toe / carcass / doors). Child order: toe → carcass → door(s).  
- [ ] **Step 3:** Update `countCabinetV0Parts` to include toe always (matrix 2/3/4).  
- [ ] **Step 4:** Update `buildModularCabinetV0PartPlans` to identical layout in metres (same names, order, sizes, positions).  
- [ ] **Step 5:** Keep `group.name = "modular-cabinet-v0"`; `userData.options` snapshot; materials oak/white; optional darker toe color (same hex family).  
- [ ] **Step 6:** Update blast unit tests so hard-coded 1/2/3 matrices become 2/3/4 and name lists include `toe`.  
- [ ] **Step 7:** Run core unit pack + blast pack → all green; write `vitest-raw.log` + `run.json` (see schema below).  
- [ ] **Step 8:** Commit slice: `fix(planner): cabinet-v0 toe+carcass+door mesh quality (W7/P08)`.

**Done when:** Unit tests green (primary + blast); mesh is multi-part with readable base; footprint outer path unchanged; GLB plan parts include `toe`; height span ≈ SKU height.

---

## Task 04 — Visual smoke (default: headless; not unit-only theatre)

**Files / artifacts:**
- Create under evidence: `visual-smoke.md` (short procedure + pass/fail against NOTES)  
- Create: at least one PNG, preferred names:  
  - `01-cabinet-v0-three-quarter.png` (toe/door/carcass readable)  
  - `02-cabinet-v0-side.png` (toe inset / depth readable)  
- **Default path:** headless Three render of `generateCabinetV0Mesh(defaultCabinetV0Options())` to canvas/PNG (small Vitest/Node helper under tests or scripts — **no** designer GLB load).  
- **Optional upgrade:** reuse open3d page / Playwright place if P07 journey already green — still document in `visual-smoke.md`.

- [ ] **Step 1:** Choose smoke path (**default headless**) and document it in `visual-smoke.md` (exact command, viewport, options used: default slab white 600×580×720).  
- [ ] **Step 2:** Capture three-quarter front + side.  
- [ ] **Step 3:** In `visual-smoke.md`, checklist each NOTES pass criterion with **yes/no** and one sentence evidence (“toe band darker strip under door”).  
- [ ] **Step 4:** If browser path: also note console clean (no GLB 404 thrash from designer paths).  
- [ ] **Step 5:** Fail closed: if screenshot still looks like one box, **do not** mark CP-08 green — return to Task 03 geometry.  
- [ ] **Step 6:** Confirm PNGs are **not** captures of a hand-placed static product GLB from `public/`.

**Done when:** PNGs + `visual-smoke.md` exist; NOTES criteria ticked with visual reference; no static designer GLB used to fake the shot.

---

## Task 05 — Non-regression mesh pipeline + policy

**Files:**
- Run (do not expand product scope):

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts `
  tests/unit/features/planner/open3d/modularPlaceMesh.test.ts `
  tests/unit/features/planner/asset-engine/meshStages.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\vitest-nonreg-raw.log
```

- Optional house pack: `pnpm p0:unit` if that script exists and is affordable; still keep scoped log above as CP-08 primary.

- [ ] **Step 1:** Run non-regression suite; write `vitest-nonreg-raw.log`.  
- [ ] **Step 2:** Confirm generated relative path still under `catalog-assets/generated/` and policy helper rejects designer static patterns (existing tests).  
- [ ] **Step 3:** Optional honesty bump in `asset-engine/stages.ts` mesh-g3 note: “cabinet-v0 includes toe+carcass+door (W7 bar)” — only if status text would otherwise lie.  
- [ ] **Step 4:** Update `run.json` summary fields (minimum schema):

```json
{
  "phase": "P08",
  "gate": "W7",
  "checkpoint": "CP-08",
  "date": "YYYY-MM-DD",
  "head": "<short sha>",
  "w7": "pass|fail",
  "partNamesDefaultSlab": ["toe", "carcass", "door-slab"],
  "partCountMatrix": { "none": 2, "slab": 3, "pair": 4 },
  "vitestPassed": true,
  "visualSmoke": "pass|fail",
  "policyNoDesignerGlb": true,
  "residualHonest": "no handles; simple materials; not photoreal"
}
```

**Done when:** Export/place/mesh-stages unit path still green; policy unbroken; run.json machine-readable.

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
| **Bar doc** | NOTES defines toe/door/carcass, locked name `toe`, numbers, fail modes | `…/08-mesh-quality/NOTES.md` |
| **Unit footprint** | Outer W×D path stable; tests assert it | `vitest-raw.log` + modularCabinetV0 footprint tests |
| **Unit parts** | Default slab: toe + carcass + door; matrix 2/3/4; plan===mesh; height span | same + GlbExport tests |
| **Blast units** | createSceneObjectFromNode + meshStages (+ place) green | `vitest-nonreg-raw.log` or vitest-raw |
| **Visual smoke** | Human-readable parts on PNG; checklist yes; **default headless OK** | PNGs + `visual-smoke.md` |
| **No designer GLB** | No new static product GLB; generated policy intact; no `site/public/**` mesh dump | code review + policy tests |
| **Height integrity** | Total height = options.heightMm; toe not additive overshoot | unit geometry / Box3 asserts |
| **Honest residual** | NOTES lists what is still not photoreal | NOTES residual section |

**CP-08 green only if every required row has a path.** Missing screenshot = red even if units green.

---

## Commands (copy-paste)

```powershell
# Evidence dir
New-Item -ItemType Directory -Force -Path D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality | Out-Null

# Core unit pack (P08 primary)
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\vitest-raw.log
```

Visual smoke command is **chosen in Task 04** (default headless) and frozen into `NOTES.md` + `visual-smoke.md`. Browser open3d place is optional if already proven by P07.

---

## Agent split (optional parallel, max 2 for this phase)

| Agent | Owns | Must not |
|-------|------|----------|
| A — TDD mesh | Tasks 02–03, unit evidence + blast test updates | Browser chrome / unrelated SKUs / public GLB |
| B — Visual + NOTES polish | Tasks 01, 04, 06 packaging | Rewrite mesh without re-running A’s units |

Both: superpowers; trust data; no competitor GLB/code; no worktrees; **W0 unlocked** — product work allowed (do not re-ask unlock).

---

## Explicit non-goals (do not “helpfully” expand)

- Dumping or wiring designer static GLBs from `public/` catalogs  
- Writing any mesh asset under `site/public/**`  
- Rebuilding entire parametric library beyond cabinet-v0  
- Photoreal PBR asset packs  
- Claiming W1–W6/W8 from this phase  
- Skipping NOTES because “tests pass”  
- Depending on P07 browser green to close CP-08  

---

## Definition of done (phase)

P08 is done when:

1. `Plans/trustdata/phases/P08-mesh-quality.md` (this file) was followed with checkboxes during execution.  
2. Cabinet-v0 mesh exposes **`toe` + `carcass` + door** (readable), exact names and order.  
3. Unit footprint + parts + height integrity green under evidence (primary + blast).  
4. Visual smoke PNGs graded against NOTES (headless default OK).  
5. **CP-08** table fully evidenced under `results/planner/world-standard-wave/08-mesh-quality/`.  
6. No designer static GLB introduced.

**Next phase after CP-08:** P09 shortcuts/chrome (**W8**), unless owner reorders. Evidence for P09 is `09-shortcuts-chrome/` (not `08-*` — mesh alone owns `08-mesh-quality/`; do not mix artifacts).
