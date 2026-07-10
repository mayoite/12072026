# P08 Mesh Quality (W7) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** Close **W7 / CP-08** by proving modular **cabinet-v0** is a readable multi-part mesh (**toe / carcass / door**), not an apology box — via normative **NOTES**, green unit + blast packs under evidence logs, **headless visual smoke PNGs** graded against NOTES, and machine-readable **run.json**. Do **not** re-implement mesh if live geometry already matches the bar.

**Architecture:** `ModularCabinetV0Options` → pure footprint (`generateCabinetV0Footprint`) + pure part plan (`buildModularCabinetV0PartPlans`) → runtime `THREE.Group` (`generateCabinetV0Mesh`) → optional G5 binary via `exportModularCabinetV0GlbBinary` under `catalog-assets/generated/*` only. Viewer place path uses `createSceneObjectFromNode` when `geometryMode === "modular-cabinet-v0"`. **Live code (2026-07-10 re-proof) already implements toe + carcass + doors with locked constants and plan===mesh tests.** This plan is primarily **verify + evidence + visual smoke**, not greenfield geometry.

**Tech Stack:** TypeScript, Three.js (runtime mesh), Vitest, existing open3d modular place + asset-engine mesh stages, **software orthographic headless smoke** (no WebGL / no designer GLB / no new paid deps), evidence under `results/planner/world-standard-wave/08-mesh-quality/`.

**Inputs consumed:**
- Repo read: 2026-07-10 — key paths in § Repo reality (workspace dirty-tree possible; re-capture HEAD at execute Task 00)
- Brainstormer: `Idiots2/P08-mesh-quality/REPORT.md` only (**never** `Idiots/`)
- Phase plan: `Plans/phases/P08-mesh-quality/P08-mesh-quality.md` + suggestions + `03-r3f-3d.md`
- Design gate: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §W7
- Evidence map: `Plans/Research/RESULTS-MAP.md` → sole primary `08-mesh-quality/`

**Done when:**
1. Cabinet-v0 default slab exposes exact child names/order **`toe` → `carcass` → `door-slab`** (pair adds `door-left`/`door-right`); matrix **none=2 / slab=3 / pair=4**.
2. Height integrity: Box3 Y span ≈ `heightMm * 0.001`; toe replaces carcass bottom (not additive).
3. plan === mesh (names, order, sizes m, positions).
4. Outer 2D footprint W×D still dimension-true (default 600×580 path unchanged).
5. Primary + blast vitest packs green with logs under evidence.
6. **NOTES.md** exists with numbers, fail modes, residual honesty.
7. Headless visual smoke: `01-cabinet-v0-three-quarter.png` + `02-cabinet-v0-side.png` + `visual-smoke.md` checklist **yes** for readable toe/door/carcass.
8. `run.json` filled; CP-08 table fully path-proven under `results/planner/world-standard-wave/08-mesh-quality/`.
9. No designer static GLB; no `site/public/**` product mesh dump; no photoreal claim.

**Evidence folder:** `results/planner/world-standard-wave/08-mesh-quality/` (create on execute; **missing at plan time** → re-prove; never claim W7 from historical memory alone).

**Approach locked (brainstormer §7):** **Approach A — Evidence finish on live mesh.** Reject B (virgin rewrite) unless units fail formulas. Reject C (designer GLB pretty PNG).

---

## 1. Repo reality (Phase 1 — live disk facts)

### 1.1 What exists and matches the W7 bar

| Path | Live fact (re-proof 2026-07-10) |
|------|--------------------------------|
| `site/features/planner/open3d/catalog/modularCabinetV0.ts` | Exports `TOE_HEIGHT_MM=100`, `TOE_INSET_MM=50`, `DOOR_THICKNESS_MM=18`. `generateCabinetV0Mesh` builds **toe → carcass → door(s)**; darker toe materials; `countCabinetV0Parts` = 2/3/4; group name `modular-cabinet-v0`. |
| `site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts` | **Imports** shared constants (no duplicate magic). `buildModularCabinetV0PartPlans` mirrors mesh layout. `binaryExportStatus: "plan-only"`. Generated path under `catalog-assets/generated/`. |
| `site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts` | Asserts names, matrix, toe inset geometry, carcass on toe, door above toe, **Box3 height integrity**, oak≠white. |
| `site/tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts` | plan-only status; matrix 2/3/4; **plan parts match mesh 1:1**; policy-safe path. |
| `site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts` | Slab length via `countCabinetV0Parts`; pair names include **`toe`**. |
| `site/tests/unit/features/planner/asset-engine/meshStages.test.ts` | Pair `runtimeMeshChildren` / `partCount` **=== 4**. |
| `site/tests/unit/features/planner/open3d/modularPlaceMesh.test.ts` | Uses `countCabinetV0Parts` (stays aligned if helper correct). |
| `site/tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts` | Outer modular footprint from options; BOQ envelope path. |
| `site/features/planner/open3d/3d/createSceneObjectFromNode.ts` | Procedural path: `generateCabinetV0Mesh`; floor-origin group (`position.y = 0`). |
| `site/features/planner/asset-engine/mesh/exportModularGlbBinary.ts` | G5 uses runtime mesh + plan; `assertNoDesignerStaticGlb`. |
| `site/features/planner/lib/glbAssetPolicy.ts` | `GENERATED_GLB_PATH_MARKER = "catalog-assets/generated/"`. |

### 1.2 What is missing (gate fails without these)

| Gap | Severity |
|-----|----------|
| `results/planner/world-standard-wave/08-mesh-quality/` **not present** | **CP-08 red** — units in tree ≠ W7 pass |
| No `NOTES.md` bar doc | Gate text requires NOTES |
| No headless smoke PNGs / `visual-smoke.md` | Gate requires visual |
| No `vitest-raw.log` / `vitest-nonreg-raw.log` / `run.json` under evidence | Closeout incomplete |
| No dedicated headless mesh-smoke script in repo | Must add (Task 04) |
| Phase honesty baseline in `P08-mesh-quality.md` still says “no toe” | **Stale docs** — do not re-implement from them; optionally note residual in closeout |

### 1.3 Contradictions: plan docs vs code

| Source claim | Code truth | Plan rule |
|--------------|------------|-----------|
| Phase honesty 2026-07-09: carcass+door only, counts 1/2/3 | toe present, counts 2/3/4 | **Repo wins** |
| `P08-suggestions.md` S1–S5 as “will go red on toe” | tests already green on toe | Treat as historical; verify not rewrite |
| `03-r3f-3d.md` “no toe” path truth | stale | Ignore for mesh; keep “imperative Three / no photoreal” |
| Idiots2 REPORT | matches live re-proof | Use for bar / failures / Approach A |

### 1.4 HEAD / tree honesty

At plan write time: evidence tree under `results/planner/` **absent**. Capture `git rev-parse --short HEAD` and dirty status in Task 00 into evidence `HEAD.txt` / `run.json`. Do not invent a green historical SHA.

### 1.5 Normative live formulas (copy of product code contract)

Constants:

```typescript
export const TOE_HEIGHT_MM = 100;
export const TOE_INSET_MM = 50;
export const DOOR_THICKNESS_MM = 18;
const MM = 0.001;
```

Derived:

```text
w = widthMm * MM
d = depthMm * MM
h = heightMm * MM
toeH = TOE_HEIGHT_MM * MM
inset = TOE_INSET_MM * MM
carcassH = h - toeH
doorT = DOOR_THICKNESS_MM * MM
carcassY = toeH + carcassH / 2
```

| Part | sizeM | positionM |
|------|-------|-----------|
| `toe` | `{x:w, y:toeH, z:d-inset}` | `{x:0, y:toeH/2, z:-inset/2}` |
| `carcass` | `{x:w, y:carcassH, z:d}` | `{x:0, y:carcassY, z:0}` |
| `door-slab` | `{x:w*0.96, y:carcassH*0.92, z:doorT}` | `{x:0, y:carcassY, z:d/2+doorT/2}` |
| `door-left` | `{x:w*0.47, y:carcassH*0.92, z:doorT}` | `{x:-(leafW/2)-0.005, y:carcassY, z:d/2+doorT/2}` |
| `door-right` | same size as left | `{x:+(leafW/2)+0.005, y:carcassY, z:...}` |

Footprint default 600×580:

```text
M -300 -290 L 300 -290 L 300 290 L -300 290 Z
```

Materials:

| Part | oak | white |
|------|-----|-------|
| carcass/door | `#c4a574` | `#f3f4f6` |
| toe (darker) | `#a88858` | `#d1d5db` |

### 1.6 Part-count matrix (normative)

| doorStyle | parts | names order |
|-----------|------:|-------------|
| `none` | 2 | toe, carcass |
| `slab` | 3 | toe, carcass, door-slab |
| `pair` | 4 | toe, carcass, door-left, door-right |

---

## 2. Brainstormer synthesis (Phase 2 — `Idiots2/P08-mesh-quality/REPORT.md`)

### 2.1 Bar / product intent

- W7 = **bar doc + visual**: modular not apology boxes; **toe/door/carcass readable**.
- Commercial north star: **manufacturer depth** (IKEA-class **idea**) + **BOQ mm truth**, not Homestyler photoreal.
- Research score mesh ~1–2 → fix with **procedural multi-part**, not engine thrash.
- Success hierarchy: `BOQ/quote > readable parts > pretty noise`.

### 2.2 Approach choice

| Approach | Choice |
|----------|--------|
| **A Evidence finish on live mesh** | **SELECTED** |
| B Full virgin red→green rewrite | Reject unless formula drift |
| C Designer GLB pretty PNG | **Hard reject** (policy + ethics) |

### 2.3 Failure modes / false-green traps (must block in plan)

| Trap | Block how |
|------|-----------|
| Units green, no PNG/NOTES | CP-08 checklist requires artifacts |
| Trust phase “no toe” → re-implement thrash | Task 00 re-proof; Task 03 skip if green |
| Toe additive height | Box3 span assert |
| Full-height door covering kick | door bottom ≥ toeH unit |
| plan ≠ mesh | 1:1 GlbExport tests |
| Designer GLB for smoke | smoke script only uses part plans / procedural |
| Photoreal as W7 | residual section forbids claim |
| Alias plinth/toe-kick | exact `toe` only |
| Evidence under wrong folder (`07-*`, `09-mesh`, `site/results`) | canonical `08-mesh-quality/` only |
| R3F rewrite mid-gate | out of scope |
| Expand all SKUs | cabinet-v0 only |

### 2.4 Raised bar (beyond paper PASS)

- Human can distinguish **base band / body / door face** in three-quarter PNG without labels.
- Side PNG shows **toe depth shorter** than carcass (inset).
- Residual honesty written (no handles, simple materials).

### 2.5 Open questions

None product-ambiguous — W7 locked. Execute only.

---

## 3. Ethics / non-copy

- Competitive research (`D:\websites`, IKEA/Homestyler/etc.) = **JTBD / patterns only**.
- **No** competitor code, CSS, GLB, logos, brand chrome, product names, or screenshots as assets.
- Evidence PNGs = **our** procedural cabinet-v0 only.
- Prefer **zero new deps**. Software orthographic smoke uses pure TS + `fs` (no headless-gl purchase).
- No Firecrawl routine.
- No write of product mesh under `site/public/**` for this phase.

---

## 4. File map

### 4.1 Create

| Path | Why |
|------|-----|
| `results/planner/world-standard-wave/08-mesh-quality/` | Evidence home |
| `…/NOTES.md` | W7 bar doc |
| `…/HEAD.txt` | SHA honesty |
| `…/vitest-baseline-raw.log` | optional pre-check |
| `…/vitest-raw.log` | primary unit log |
| `…/vitest-nonreg-raw.log` | blast pack log |
| `…/01-cabinet-v0-three-quarter.png` | visual smoke |
| `…/02-cabinet-v0-side.png` | visual smoke |
| `…/visual-smoke.md` | graded checklist |
| `…/run.json` | machine CP-08 summary |
| `site/scripts/render-cabinet-v0-mesh-smoke.mts` | headless smoke CLI |
| `site/features/planner/open3d/catalog/cabinetV0MeshSmokeRender.ts` | pure software orthographic render (testable) |
| `site/tests/unit/features/planner/open3d/cabinetV0MeshSmokeRender.test.ts` | TDD for smoke renderer |

### 4.2 Modify (conditional)

| Path | When |
|------|------|
| `modularCabinetV0.ts` | Only if Task 02 verification fails formulas |
| `modularCabinetV0GlbExport.ts` | Same |
| Blast unit files | Only if counts/names drift |
| `asset-engine/stages.ts` mesh-g3 note | Optional honesty: “toe+carcass+door (W7)” if note still implies single box |

### 4.3 Read-only / regression run

| Path | Role |
|------|------|
| `createSceneObjectFromNode.ts` | consume mesh; floor origin |
| `exportModularGlbBinary.ts` | G5 |
| `glbAssetPolicy.ts` | policy |
| `resolveFurniture2DFootprint` path tests | outer envelope |

### 4.4 Do not touch

- Non–cabinet-v0 SKUs, workstation mesh (except incidental blast)
- R3F / ThreeViewerInner orbit (P04)
- Playwright journey (P07 optional only)
- Designer GLB / public catalog models
- `Idiots/` reports

---

## 5. Architecture & data flow

```text
ModularCabinetV0Options
        │
        ├─ generateCabinetV0Footprint ──► 2D path (outer W×D mm)
        │
        ├─ generateCabinetV0Mesh ───────► THREE.Group children [toe,carcass,door*]
        │         ▲
        │         │ createSceneObjectFromNode (viewer place)
        │
        └─ buildModularCabinetV0PartPlans ─► pure metres parts
                  │
                  ├─ buildModularCabinetV0GlbPlan (G4 metadata)
                  ├─ exportModularCabinetV0GlbBinary (G5 bytes)
                  └─ cabinetV0MeshSmokeRender (headless PNG — uses same part plans)

Policy: relativePath must pass assertNoDesignerStaticGlb
Evidence: results/planner/world-standard-wave/08-mesh-quality/*
```

**Invariant:** any change to mesh layout must update part plans in the same commit (plan===mesh).

---

## 6. Task list

### Task 00: Evidence shell + live re-proof (do not trust stale phase honesty)

**Files:**
- Create: `results/planner/world-standard-wave/08-mesh-quality/`
- Create: `results/planner/world-standard-wave/08-mesh-quality/HEAD.txt`
- Read: `modularCabinetV0.ts`, `modularCabinetV0GlbExport.ts`, both primary unit files

- [ ] **Step 1: Confirm checkout**

Run:

```powershell
cd .
git rev-parse --show-toplevel
git rev-parse --short HEAD
git status -sb
```

Expected: toplevel is `.` (or Windows equivalent). **No worktree.** Record short SHA.

- [ ] **Step 2: Create evidence directory**

```powershell
New-Item -ItemType Directory -Force -Path results\planner\world-standard-wave\08-mesh-quality | Out-Null
git rev-parse --short HEAD | Set-Content -Encoding utf8 results\planner\world-standard-wave\08-mesh-quality\HEAD.txt
```

Expected: directory exists; `HEAD.txt` has short sha.

- [ ] **Step 3: Re-proof mesh has toe (grep honesty)**

Run:

```powershell
Select-String -Path site\features\planner\open3d\catalog\modularCabinetV0.ts -Pattern 'TOE_HEIGHT_MM|name = "toe"|countCabinetV0Parts'
Select-String -Path site\features\planner\open3d\catalog\modularCabinetV0GlbExport.ts -Pattern 'TOE_HEIGHT_MM|name: "toe"'
```

Expected: matches proving exported constants + toe child + GlbExport import/use of toe. If **no toe**, skip to Task 02/03 full TDD implement path (Approach B fallback). If toe present, continue Approach A.

- [ ] **Step 4: Baseline unit pack (expect green if live bar holds)**

```powershell
cd site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath results\planner\world-standard-wave\08-mesh-quality\vitest-baseline-raw.log
```

Expected (Approach A): **PASS** all tests in those files.  
If FAIL for missing toe: capture as baseline-red; proceed Task 02/03 implement.  
If FAIL for unrelated reason: systematic-debug before inventing geometry.

- [ ] **Step 5: Commit shell only if NOTES not ready yet (optional)**

Prefer first landable commit with NOTES (Task 01). Empty dir alone need not commit.

---

### Task 01: Write NOTES.md (W7 written truth — CP-08 bar doc)

**Files:**
- Create: `results/planner/world-standard-wave/08-mesh-quality/NOTES.md`

- [ ] **Step 1: Write full NOTES (no placeholders)**

Create the file with **exactly this content** (fill HEAD/date at execute if different):

```markdown
# W7 / CP-08 — Mesh quality bar (cabinet-v0)

**Gate:** W7 — Mesh quality bar doc + visual: modular not “apology boxes” for cabinet-v0 (toe/door/carcass readable).  
**Checkpoint:** CP-08  
**SKU scope:** modular cabinet-v0 only  
**Evidence home:** `results/planner/world-standard-wave/08-mesh-quality/`  
**Product metric hierarchy:** BOQ/quote path > readable manufacturer parts > pretty noise / photoreal.

## Pass criteria (all required)

1. Named parts on default slab: exact strings `toe`, `carcass`, `door-slab` (pair → `door-left` + `door-right`).
2. Locked child order: `toe` → `carcass` → door part(s).
3. Readable silhouette (three-quarter): darker base band, body mass, door face distinguishable without wireframe labels.
4. Locked geometry:
   - `TOE_HEIGHT_MM = 100`
   - `TOE_INSET_MM = 50`
   - `DOOR_THICKNESS_MM = 18`
   - toe: size `(w, toeH, d-inset)`, pos `(0, toeH/2, -inset/2)`
   - carcass: size `(w, h-toeH, d)`, pos `(0, toeH+carcassH/2, 0)`
   - doors: height tracks `carcassH*0.92`; y on carcass center; z = d/2 + doorT/2
5. Height integrity: Box3 maxY−minY ≈ heightMm×0.001; minY ≈ 0; toe replaces carcass bottom (not additive overshoot).
6. Door bottom ≥ toe top (door does not cover kick).
7. 2D footprint outer W×D dimension-true (default 600×580 → `M -300 -290 L 300 -290 L 300 290 L -300 290 Z`).
8. Part plan === mesh children (names, order, sizes m, positions).
9. No designer static GLB; generated paths only `catalog-assets/generated/*`; no `site/public/**` product mesh dump for this phase.
10. Materials: toe slightly darker same family; oak ≠ white on carcass.

## Fail criteria (explicit)

- Single BoxGeometry furniture / apology box silhouette.
- Door floor-to-top covering toe band.
- Toe stacked on full-height carcass (height overshoot).
- plan missing `toe` while mesh has it (or reverse).
- Hand-made / designer static `.glb` used for “proof” PNG.
- Alias rename (`plinth`, `toe-kick`) mid-phase.
- Units green without NOTES + graded PNG.
- Photoreal claimed as W7 success.

## Part name table (exact)

| doorStyle | order |
|-----------|-------|
| none | toe, carcass |
| slab | toe, carcass, door-slab |
| pair | toe, carcass, door-left, door-right |

## Part-count matrix

| doorStyle | count |
|-----------|------:|
| none | 2 |
| slab | 3 |
| pair | 4 |

## Commands

### Unit primary

```powershell
cd site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  tests/unit/features/planner/open3d/cabinetV0MeshSmokeRender.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath results\planner\world-standard-wave\08-mesh-quality\vitest-raw.log
```

### Non-reg blast

```powershell
cd site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts `
  tests/unit/features/planner/open3d/modularPlaceMesh.test.ts `
  tests/unit/features/planner/asset-engine/meshStages.test.ts `
  tests/unit/features/planner/open3d/cabinetV0MeshSmokeRender.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath results\planner\world-standard-wave\08-mesh-quality\vitest-nonreg-raw.log
```

### Headless visual smoke (default)

```powershell
cd site
pnpm exec tsx scripts/render-cabinet-v0-mesh-smoke.mts
```

Writes:

- `results/planner/world-standard-wave/08-mesh-quality/01-cabinet-v0-three-quarter.png`
- `results/planner/world-standard-wave/08-mesh-quality/02-cabinet-v0-side.png`

Options used: default slab white 600×580×720.  
Source: pure orthographic raster of `buildModularCabinetV0PartPlans` (same layout as mesh) — **not** designer GLB.

## Artifacts expected in this folder

| File | Required |
|------|----------|
| NOTES.md | yes |
| vitest-raw.log | yes |
| vitest-nonreg-raw.log | preferred |
| run.json | yes |
| 01-cabinet-v0-three-quarter.png | yes |
| 02-cabinet-v0-side.png | yes |
| visual-smoke.md | yes |
| HEAD.txt | preferred |

## Honest residual (not photoreal)

- No handles / pulls / soft-close hardware.
- No side reveals / shadow gaps / wood grain textures.
- Simple MeshStandardMaterial flat colors only.
- Not a full kitchen system (base/wall/high, fillers, worktops).
- G8 async GLB load path not required green for CP-08.
- Success remains BOQ/quote readiness + readable parts — **not** Homestyler stills.

## Grade rule

Reviewer grades PNGs against this NOTES file without opening the phase plan.  
Missing screenshot = **red** even if units green.
```

- [ ] **Step 2: Confirm NOTES has concrete numbers**

Open the file; verify `100` / `50` / `18` / matrix 2/3/4 / exact `toe` appear. No TBD.

- [ ] **Step 3: Commit**

```powershell
cd .
git add results/planner/world-standard-wave/08-mesh-quality/NOTES.md results/planner/world-standard-wave/08-mesh-quality/HEAD.txt
git commit -m "docs(planner): W7 mesh quality bar NOTES for cabinet-v0 (P08)"
```

---

### Task 02: Verification pack (TDD posture) — assert live bar; red only if drift

**Intent:** Existing tests already encode the bar. This task **re-runs** them as the unit spine of CP-08 and **adds only missing smoke-renderer tests** in Task 04. If baseline was red for geometry, implement red tests here then green in Task 03.

**Files:**
- Test (existing): `site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts`
- Test (existing): `site/tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts`
- Test (existing): `site/tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts`
- Modify only if a required assertion is missing (see checklist below)

- [ ] **Step 1: Confirm primary tests contain every required assert class**

Open `modularCabinetV0.test.ts` and verify these exist (they do on live disk — do not delete):

1. footprint stable for 600×580  
2. constants 100/50/18  
3. names order toe/carcass/door-slab  
4. pair toe/carcass/door-left/door-right  
5. toe geometry inset  
6. carcass on toe  
7. doors above toe  
8. Box3 height integrity  
9. oak ≠ white  

Open GlbExport tests for:

1. plan-only status  
2. matrix 2/3/4  
3. plan===mesh 1:1  
4. policy-safe generated path  

- [ ] **Step 2: If any assert class missing, add it (full failing test first)**

Example **only if Box3 missing** (already present — do not duplicate):

```typescript
it("height integrity: Box3 Y span equals SKU height (no toe overshoot)", () => {
  const opts = defaultCabinetV0Options({
    widthMm: 600,
    depthMm: 580,
    heightMm: 720,
    doorStyle: "slab",
  });
  const group = generateCabinetV0Mesh(opts);
  const box = new THREE.Box3().setFromObject(group);
  const spanY = box.max.y - box.min.y;
  expect(spanY).toBeCloseTo(opts.heightMm * 0.001, 6);
  expect(box.min.y).toBeCloseTo(0, 6);
});
```

If you must add a new assertion against broken code: run → expect FAIL → fix in Task 03.

- [ ] **Step 3: Run primary pack → evidence log**

```powershell
cd site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath results\planner\world-standard-wave\08-mesh-quality\vitest-raw.log
```

Expected (Approach A): **PASS**.  
Expected (Approach B virgin): FAIL missing `toe` / wrong counts — then Task 03.

- [ ] **Step 4: Run blast pack early (detect hard-coded 1/2/3)**

```powershell
cd site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts `
  tests/unit/features/planner/open3d/modularPlaceMesh.test.ts `
  tests/unit/features/planner/asset-engine/meshStages.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath results\planner\world-standard-wave\08-mesh-quality\vitest-blast-preview.log
```

Expected live: **PASS** with pair children **4** and names including `toe`. If red, fix blast expectations or mesh in Task 03 same landable slice.

- [ ] **Step 5: Commit only if tests were added/changed**

```powershell
git add site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts site/tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts
git commit -m "test(planner): lock W7 cabinet-v0 toe/carcass/door unit bar (P08)"
```

Skip commit if no test file changes.

---

### Task 03: Mesh green (conditional) — implement only if verification red

**Skip entire task if Task 02 primary+blast green and formulas match §1.5.** Record skip in closeout: `Task 03 SKIPPED — live mesh already matches bar`.

**Files (when needed):**
- Modify: `site/features/planner/open3d/catalog/modularCabinetV0.ts`
- Modify: `site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts`
- Modify blast tests if hard-coded counts

- [ ] **Step 1: Export constants + darker toe mats + rebuild mesh**

Minimal implementation matching live target (full file body for recovery):

```typescript
/**
 * Smallest modular furniture slice: cabinet-v0 options → 2D path + 3D mesh group.
 * Must-do path: component choices without designer GLB.
 * W7 bar: readable toe → carcass → door(s); height integrity (toe not additive).
 */

import * as THREE from "three";

export type CabinetDoorStyle = "none" | "slab" | "pair";
export type CabinetMaterialId = "oak" | "white";

export interface ModularCabinetV0Options {
  widthMm: number;
  depthMm: number;
  heightMm: number;
  doorStyle: CabinetDoorStyle;
  material: CabinetMaterialId;
}

const MATERIAL_COLOR: Record<CabinetMaterialId, string> = {
  oak: "#c4a574",
  white: "#f3f4f6",
};

const TOE_MATERIAL_COLOR: Record<CabinetMaterialId, string> = {
  oak: "#a88858",
  white: "#d1d5db",
};

export const TOE_HEIGHT_MM = 100;
export const TOE_INSET_MM = 50;
export const DOOR_THICKNESS_MM = 18;

const MM = 0.001;

export function defaultCabinetV0Options(
  partial?: Partial<ModularCabinetV0Options>,
): ModularCabinetV0Options {
  return {
    widthMm: partial?.widthMm ?? 600,
    depthMm: partial?.depthMm ?? 580,
    heightMm: partial?.heightMm ?? 720,
    doorStyle: partial?.doorStyle ?? "slab",
    material: partial?.material ?? "white",
  };
}

export function generateCabinetV0Footprint(
  options: ModularCabinetV0Options,
): string {
  const halfW = options.widthMm / 2;
  const halfD = options.depthMm / 2;
  return `M -${halfW} -${halfD} L ${halfW} -${halfD} L ${halfW} ${halfD} L -${halfW} ${halfD} Z`;
}

export function generateCabinetV0Mesh(
  options: ModularCabinetV0Options,
): THREE.Group {
  const group = new THREE.Group();
  group.name = "modular-cabinet-v0";
  group.userData = {
    modular: "cabinet-v0",
    options: { ...options },
  };

  const color = MATERIAL_COLOR[options.material];
  const toeColor = TOE_MATERIAL_COLOR[options.material];
  const carcassMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.75,
    metalness: 0.05,
  });
  const toeMat = new THREE.MeshStandardMaterial({
    color: toeColor,
    roughness: 0.85,
    metalness: 0.04,
  });
  const doorMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.65,
    metalness: 0.08,
  });

  const w = options.widthMm * MM;
  const d = options.depthMm * MM;
  const h = options.heightMm * MM;
  const toeH = TOE_HEIGHT_MM * MM;
  const inset = TOE_INSET_MM * MM;
  const carcassH = h - toeH;
  const doorT = DOOR_THICKNESS_MM * MM;
  const carcassY = toeH + carcassH / 2;

  const toe = new THREE.Mesh(
    new THREE.BoxGeometry(w, toeH, d - inset),
    toeMat,
  );
  toe.name = "toe";
  toe.position.set(0, toeH / 2, -inset / 2);
  group.add(toe);

  const carcass = new THREE.Mesh(
    new THREE.BoxGeometry(w, carcassH, d),
    carcassMat,
  );
  carcass.name = "carcass";
  carcass.position.set(0, carcassY, 0);
  group.add(carcass);

  if (options.doorStyle === "slab") {
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.96, carcassH * 0.92, doorT),
      doorMat,
    );
    door.name = "door-slab";
    door.position.set(0, carcassY, d / 2 + doorT / 2);
    group.add(door);
  } else if (options.doorStyle === "pair") {
    const leafW = w * 0.47;
    const leafH = carcassH * 0.92;
    const z = d / 2 + doorT / 2;
    const left = new THREE.Mesh(
      new THREE.BoxGeometry(leafW, leafH, doorT),
      doorMat,
    );
    left.name = "door-left";
    left.position.set(-leafW / 2 - 0.005, carcassY, z);
    const right = new THREE.Mesh(
      new THREE.BoxGeometry(leafW, leafH, doorT),
      doorMat,
    );
    right.name = "door-right";
    right.position.set(leafW / 2 + 0.005, carcassY, z);
    group.add(left, right);
  }

  return group;
}

export function countCabinetV0Parts(options: ModularCabinetV0Options): number {
  if (options.doorStyle === "none") return 2;
  if (options.doorStyle === "slab") return 3;
  return 4;
}
```

- [ ] **Step 2: Mirror part plans in GlbExport (import constants — no duplicate)**

`buildModularCabinetV0PartPlans` must match §1.5 tables exactly (live file already correct). Ensure:

```typescript
import {
  DOOR_THICKNESS_MM,
  TOE_HEIGHT_MM,
  TOE_INSET_MM,
  type ModularCabinetV0Options,
  countCabinetV0Parts,
  defaultCabinetV0Options,
  generateCabinetV0Footprint,
} from "./modularCabinetV0";
```

No local `const DOOR_THICKNESS_MM = 18`.

- [ ] **Step 3: Update blast tests if still on 1/2/3**

`createSceneObjectFromNode.test.ts` pair:

```typescript
expect(object.children).toHaveLength(4);
expect(object.children.map((c) => c.name)).toEqual([
  "toe",
  "carcass",
  "door-left",
  "door-right",
]);
```

`meshStages.test.ts` pair:

```typescript
expect(result.runtimeMeshChildren).toBe(4);
expect(result.partCount).toBe(4);
```

- [ ] **Step 4: Run tests — expect PASS**

Same commands as Task 02 Step 3–4. Expected: PASS.

- [ ] **Step 5: Commit mesh slice**

```powershell
git add site/features/planner/open3d/catalog/modularCabinetV0.ts site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts site/tests/unit/features/planner/asset-engine/meshStages.test.ts
git commit -m "fix(planner): cabinet-v0 toe+carcass+door mesh quality (W7/P08)"
```

---

### Task 04: Headless visual smoke (software orthographic — default path)

**Why software:** Vitest/Node has no reliable WebGL. Smoke must be **deterministic**, **dep-free**, and use the **same part plan** as mesh (plan===mesh proof). This is **not** a designer GLB screenshot.

**Files:**
- Create: `site/features/planner/open3d/catalog/cabinetV0MeshSmokeRender.ts`
- Create: `site/tests/unit/features/planner/open3d/cabinetV0MeshSmokeRender.test.ts`
- Create: `site/scripts/render-cabinet-v0-mesh-smoke.mts`
- Create: evidence PNGs + `visual-smoke.md`

- [ ] **Step 1: Write the failing unit tests for the smoke renderer**

Create `site/tests/unit/features/planner/open3d/cabinetV0MeshSmokeRender.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { defaultCabinetV0Options } from "@/features/planner/open3d/catalog/modularCabinetV0";
import { buildModularCabinetV0PartPlans } from "@/features/planner/open3d/catalog/modularCabinetV0GlbExport";
import {
  renderCabinetV0OrthographicRgba,
  samplePixel,
} from "@/features/planner/open3d/catalog/cabinetV0MeshSmokeRender";

describe("cabinetV0MeshSmokeRender — readable multi-part silhouette", () => {
  const opts = defaultCabinetV0Options({
    widthMm: 600,
    depthMm: 580,
    heightMm: 720,
    doorStyle: "slab",
    material: "white",
  });

  it("three-quarter view yields non-empty pixels and multiple distinct colors", () => {
    const { width, height, rgba } = renderCabinetV0OrthographicRgba(opts, {
      view: "three-quarter",
      width: 320,
      height: 240,
    });
    expect(width).toBe(320);
    expect(height).toBe(240);
    expect(rgba.length).toBe(320 * 240 * 4);

    const colors = new Set<string>();
    for (let i = 0; i < rgba.length; i += 4) {
      const a = rgba[i + 3]!;
      if (a === 0) continue;
      colors.add(`${rgba[i]},${rgba[i + 1]},${rgba[i + 2]}`);
    }
    // background + at least toe (darker) + body/door family
    expect(colors.size).toBeGreaterThanOrEqual(2);
  });

  it("lower band is darker than mid carcass band (toe reads)", () => {
    const { width, height, rgba } = renderCabinetV0OrthographicRgba(opts, {
      view: "three-quarter",
      width: 320,
      height: 240,
    });
    // Sample center-x, lower third vs mid height (image y increases downward)
    const midX = Math.floor(width / 2);
    const lower = samplePixel(rgba, width, midX, Math.floor(height * 0.78));
    const mid = samplePixel(rgba, width, midX, Math.floor(height * 0.45));
    expect(lower.a).toBeGreaterThan(0);
    expect(mid.a).toBeGreaterThan(0);
    const lowerLuma = 0.299 * lower.r + 0.587 * lower.g + 0.114 * lower.b;
    const midLuma = 0.299 * mid.r + 0.587 * mid.g + 0.114 * mid.b;
    expect(lowerLuma).toBeLessThan(midLuma);
  });

  it("side view uses same part plan as buildModularCabinetV0PartPlans", () => {
    const parts = buildModularCabinetV0PartPlans(opts);
    expect(parts.map((p) => p.name)).toEqual(["toe", "carcass", "door-slab"]);
    const { rgba, width, height } = renderCabinetV0OrthographicRgba(opts, {
      view: "side",
      width: 320,
      height: 240,
    });
    expect(rgba.length).toBe(width * height * 4);
    let opaque = 0;
    for (let i = 3; i < rgba.length; i += 4) if (rgba[i]! > 0) opaque++;
    expect(opaque).toBeGreaterThan(100);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL (module missing)**

```powershell
cd site
pnpm exec vitest run tests/unit/features/planner/open3d/cabinetV0MeshSmokeRender.test.ts --reporter=verbose
```

Expected: FAIL — cannot resolve `cabinetV0MeshSmokeRender` or missing exports.

- [ ] **Step 3: Implement smoke renderer (authoritative full file — paste as entire module)**

Create `site/features/planner/open3d/catalog/cabinetV0MeshSmokeRender.ts`:

```typescript
/**
 * Headless W7 visual smoke: software orthographic raster of cabinet-v0 parts.
 * Same layout as generateCabinetV0Mesh via buildModularCabinetV0PartPlans.
 * No WebGL. No designer GLB.
 */

import { deflateSync } from "node:zlib";
import {
  defaultCabinetV0Options,
  type ModularCabinetV0Options,
  type CabinetMaterialId,
} from "./modularCabinetV0";
import {
  buildModularCabinetV0PartPlans,
  type ModularCabinetV0PartPlan,
} from "./modularCabinetV0GlbExport";

export type SmokeView = "three-quarter" | "side";

export interface SmokeRenderOptions {
  view: SmokeView;
  width: number;
  height: number;
  background?: readonly [number, number, number];
}

export interface SmokeRgbaResult {
  width: number;
  height: number;
  rgba: Uint8ClampedArray;
}

type Vec3 = { x: number; y: number; z: number };

const CARCASS_RGB: Record<CabinetMaterialId, readonly [number, number, number]> = {
  oak: [0xc4, 0xa5, 0x74],
  white: [0xf3, 0xf4, 0xf6],
};

const TOE_RGB: Record<CabinetMaterialId, readonly [number, number, number]> = {
  oak: [0xa8, 0x88, 0x58],
  white: [0xd1, 0xd5, 0xdb],
};

function partColor(
  name: string,
  material: CabinetMaterialId,
): readonly [number, number, number] {
  if (name === "toe") return TOE_RGB[material];
  if (name.startsWith("door")) {
    return material === "oak" ? [0xb8, 0x9a, 0x68] : [0xe5, 0xe7, 0xeb];
  }
  return CARCASS_RGB[material];
}

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cameraBasis(view: SmokeView): {
  right: Vec3;
  up: Vec3;
  forward: Vec3;
} {
  if (view === "side") {
    return {
      right: { x: 0, y: 0, z: -1 },
      up: { x: 0, y: 1, z: 0 },
      forward: { x: -1, y: 0, z: 0 },
    };
  }
  const forward = normalize({ x: -0.65, y: -0.35, z: -0.65 });
  const worldUp = { x: 0, y: 1, z: 0 };
  const right = normalize(cross(worldUp, forward));
  const up = normalize(cross(forward, right));
  return { right, up, forward };
}

function project(
  p: Vec3,
  basis: { right: Vec3; up: Vec3; forward: Vec3 },
): { u: number; v: number; depth: number } {
  return {
    u: dot(p, basis.right),
    v: dot(p, basis.up),
    depth: -dot(p, basis.forward),
  };
}

function boxCorners(part: ModularCabinetV0PartPlan): Vec3[] {
  const hx = part.sizeM.x / 2;
  const hy = part.sizeM.y / 2;
  const hz = part.sizeM.z / 2;
  const { x: cx, y: cy, z: cz } = part.positionM;
  const out: Vec3[] = [];
  for (const sx of [-1, 1] as const) {
    for (const sy of [-1, 1] as const) {
      for (const sz of [-1, 1] as const) {
        out.push({ x: cx + sx * hx, y: cy + sy * hy, z: cz + sz * hz });
      }
    }
  }
  return out;
}

function boxFaces(part: ModularCabinetV0PartPlan): Vec3[][] {
  const hx = part.sizeM.x / 2;
  const hy = part.sizeM.y / 2;
  const hz = part.sizeM.z / 2;
  const { x: cx, y: cy, z: cz } = part.positionM;
  const c = (x: number, y: number, z: number): Vec3 => ({
    x: cx + x,
    y: cy + y,
    z: cz + z,
  });
  return [
    [c(-hx, -hy, hz), c(hx, -hy, hz), c(hx, hy, hz), c(-hx, hy, hz)],
    [c(hx, -hy, -hz), c(-hx, -hy, -hz), c(-hx, hy, -hz), c(hx, hy, -hz)],
    [c(hx, -hy, hz), c(hx, -hy, -hz), c(hx, hy, -hz), c(hx, hy, hz)],
    [c(-hx, -hy, -hz), c(-hx, -hy, hz), c(-hx, hy, hz), c(-hx, hy, -hz)],
    [c(-hx, hy, hz), c(hx, hy, hz), c(hx, hy, -hz), c(-hx, hy, -hz)],
    [c(-hx, -hy, -hz), c(hx, -hy, -hz), c(hx, -hy, hz), c(-hx, -hy, hz)],
  ];
}

function faceDepth(
  face: Vec3[],
  basis: { right: Vec3; up: Vec3; forward: Vec3 },
): number {
  let s = 0;
  for (const p of face) s += project(p, basis).depth;
  return s / face.length;
}

function fillTriangle(
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
  zbuf: Float64Array,
  a: { u: number; v: number; depth: number },
  b: { u: number; v: number; depth: number },
  c: { u: number; v: number; depth: number },
  color: readonly [number, number, number],
  worldToPixel: (u: number, v: number) => { x: number; y: number },
): void {
  const pa = worldToPixel(a.u, a.v);
  const pb = worldToPixel(b.u, b.v);
  const pc = worldToPixel(c.u, c.v);
  const minX = Math.max(0, Math.floor(Math.min(pa.x, pb.x, pc.x)));
  const maxX = Math.min(width - 1, Math.ceil(Math.max(pa.x, pb.x, pc.x)));
  const minY = Math.max(0, Math.floor(Math.min(pa.y, pb.y, pc.y)));
  const maxY = Math.min(height - 1, Math.ceil(Math.max(pa.y, pb.y, pc.y)));
  const area = (
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
  ) => (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y);
  const areaABC = area(pa, pb, pc);
  if (Math.abs(areaABC) < 1e-8) return;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const p = { x: x + 0.5, y: y + 0.5 };
      const w0 = area(pb, pc, p) / areaABC;
      const w1 = area(pc, pa, p) / areaABC;
      const w2 = area(pa, pb, p) / areaABC;
      if (w0 < 0 || w1 < 0 || w2 < 0) continue;
      const depth = w0 * a.depth + w1 * b.depth + w2 * c.depth;
      const zi = y * width + x;
      if (depth >= zbuf[zi]!) continue;
      zbuf[zi] = depth;
      const i = zi * 4;
      rgba[i] = color[0];
      rgba[i + 1] = color[1];
      rgba[i + 2] = color[2];
      rgba[i + 3] = 255;
    }
  }
}

export function renderCabinetV0OrthographicRgba(
  optionsInput: ModularCabinetV0Options | Partial<ModularCabinetV0Options>,
  smoke: SmokeRenderOptions,
): SmokeRgbaResult {
  const options = defaultCabinetV0Options(optionsInput);
  const parts = buildModularCabinetV0PartPlans(options);
  const { width, height } = smoke;
  const bg = smoke.background ?? ([0x1e, 0x29, 0x3b] as const);
  const rgba = new Uint8ClampedArray(width * height * 4);
  const zbuf = new Float64Array(width * height);
  zbuf.fill(Number.POSITIVE_INFINITY);
  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    rgba[o] = bg[0];
    rgba[o + 1] = bg[1];
    rgba[o + 2] = bg[2];
    rgba[o + 3] = 255;
  }
  const basis = cameraBasis(smoke.view);
  let minU = Infinity;
  let maxU = -Infinity;
  let minV = Infinity;
  let maxV = -Infinity;
  for (const part of parts) {
    for (const corner of boxCorners(part)) {
      const p = project(corner, basis);
      minU = Math.min(minU, p.u);
      maxU = Math.max(maxU, p.u);
      minV = Math.min(minV, p.v);
      maxV = Math.max(maxV, p.v);
    }
  }
  const pad = 0.08;
  const spanU = Math.max(1e-6, maxU - minU);
  const spanV = Math.max(1e-6, maxV - minV);
  minU -= spanU * pad;
  maxU += spanU * pad;
  minV -= spanV * pad;
  maxV += spanV * pad;
  const worldToPixel = (u: number, v: number) => ({
    x: ((u - minU) / (maxU - minU)) * (width - 1),
    y: (1 - (v - minV) / (maxV - minV)) * (height - 1),
  });
  type FaceJob = {
    face: Vec3[];
    color: readonly [number, number, number];
    depth: number;
  };
  const jobs: FaceJob[] = [];
  for (const part of parts) {
    const color = partColor(part.name, options.material);
    for (const face of boxFaces(part)) {
      jobs.push({ face, color, depth: faceDepth(face, basis) });
    }
  }
  jobs.sort((a, b) => b.depth - a.depth);
  for (const job of jobs) {
    const proj = job.face.map((pt) => project(pt, basis));
    fillTriangle(
      rgba,
      width,
      height,
      zbuf,
      proj[0]!,
      proj[1]!,
      proj[2]!,
      job.color,
      worldToPixel,
    );
    fillTriangle(
      rgba,
      width,
      height,
      zbuf,
      proj[0]!,
      proj[2]!,
      proj[3]!,
      job.color,
      worldToPixel,
    );
  }
  return { width, height, rgba };
}

export function samplePixel(
  rgba: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
): { r: number; g: number; b: number; a: number } {
  const i = (y * width + x) * 4;
  return {
    r: rgba[i]!,
    g: rgba[i + 1]!,
    b: rgba[i + 2]!,
    a: rgba[i + 3]!,
  };
}

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]!;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
  const typeBytes = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.concat([typeBytes, Buffer.from(data)]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcBuf), 0);
  return Buffer.concat([len, typeBytes, Buffer.from(data), crc]);
}

/** Encode RGBA into PNG bytes (filter 0 per row + zlib). */
export function encodePngRgba(
  width: number,
  height: number,
  rgba: Uint8ClampedArray,
): Uint8Array {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * stride, stride).copy(
      raw,
      rowStart + 1,
    );
  }
  const compressed = deflateSync(raw);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", new Uint8Array(0)),
  ]);
}
```

- [ ] **Step 4: Run unit tests — expect PASS**

```powershell
cd site
pnpm exec vitest run tests/unit/features/planner/open3d/cabinetV0MeshSmokeRender.test.ts --reporter=verbose
```

Expected: PASS (all tests in file). If lower-luma assert flakes on sample coords, adjust sample positions to known toe band after a one-time dump — do not weaken to always-true.

- [ ] **Step 5: Create CLI script**

Create `site/scripts/render-cabinet-v0-mesh-smoke.mts`:

```typescript
/**
 * W7 headless smoke: write cabinet-v0 orthographic PNGs into evidence folder.
 * Usage: pnpm exec tsx scripts/render-cabinet-v0-mesh-smoke.mts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  encodePngRgba,
  renderCabinetV0OrthographicRgba,
} from "../features/planner/open3d/catalog/cabinetV0MeshSmokeRender";
import { defaultCabinetV0Options } from "../features/planner/open3d/catalog/modularCabinetV0";

const evidenceDir = resolve(
  process.cwd(),
  "..",
  "results",
  "planner",
  "world-standard-wave",
  "08-mesh-quality",
);

mkdirSync(evidenceDir, { recursive: true });

const opts = defaultCabinetV0Options({
  widthMm: 600,
  depthMm: 580,
  heightMm: 720,
  doorStyle: "slab",
  material: "white",
});

const views = [
  { view: "three-quarter" as const, file: "01-cabinet-v0-three-quarter.png" },
  { view: "side" as const, file: "02-cabinet-v0-side.png" },
];

for (const v of views) {
  const { width, height, rgba } = renderCabinetV0OrthographicRgba(opts, {
    view: v.view,
    width: 640,
    height: 480,
  });
  const png = encodePngRgba(width, height, rgba);
  const out = resolve(evidenceDir, v.file);
  writeFileSync(out, png);
  console.log("wrote", out, png.byteLength, "bytes");
}
```

- [ ] **Step 6: Run CLI — produce PNGs**

```powershell
cd site
pnpm exec tsx scripts/render-cabinet-v0-mesh-smoke.mts
```

Expected stdout like:

```text
wrote results\planner\world-standard-wave\08-mesh-quality\01-cabinet-v0-three-quarter.png <n> bytes
wrote results\planner\world-standard-wave\08-mesh-quality\02-cabinet-v0-side.png <n> bytes
```

Both files exist and size > 1KB.

- [ ] **Step 7: Write visual-smoke.md (human grade)**

Create `results/planner/world-standard-wave/08-mesh-quality/visual-smoke.md`:

```markdown
# Visual smoke — cabinet-v0 (W7)

**Date:** YYYY-MM-DD  
**HEAD:** (from HEAD.txt)  
**Command:** `cd site && pnpm exec tsx scripts/render-cabinet-v0-mesh-smoke.mts`  
**Options:** default slab white 600×580×720  
**Source:** software orthographic of `buildModularCabinetV0PartPlans` (plan===mesh layout) — **not** designer GLB  

## Checklist vs NOTES

| Criterion | yes/no | Evidence sentence |
|-----------|--------|-------------------|
| Named multi-part (toe+carcass+door) | yes/no | Renderer uses part plan names; unit tests assert plan names |
| Darker base band (toe) visible | yes/no | Lower band darker than mid body in three-quarter PNG |
| Body mass (carcass) readable | yes/no | Mid height mass present |
| Door face distinct | yes/no | Front leaf color/offset from carcass in three-quarter |
| Side: toe inset / shorter depth | yes/no | Side PNG shows recessed base vs carcass depth |
| Not single apology box | yes/no | ≥2 distinct fill colors in raster |
| Not designer static GLB | yes | CLI imports only modularCabinetV0 + part plans |
| Height not obviously overshot | yes | Units Box3; silhouette height consistent |

**Overall visualSmoke:** pass | fail  

**Fail closed rule:** if three-quarter still reads as one box → fail, return to geometry (Task 03).
```

Fill yes/no after opening both PNGs (use image viewer). **Fail closed** if single-box look.

- [ ] **Step 8: Commit smoke stack**

```powershell
cd .
git add `
  site/features/planner/open3d/catalog/cabinetV0MeshSmokeRender.ts `
  site/tests/unit/features/planner/open3d/cabinetV0MeshSmokeRender.test.ts `
  site/scripts/render-cabinet-v0-mesh-smoke.mts `
  results/planner/world-standard-wave/08-mesh-quality/01-cabinet-v0-three-quarter.png `
  results/planner/world-standard-wave/08-mesh-quality/02-cabinet-v0-side.png `
  results/planner/world-standard-wave/08-mesh-quality/visual-smoke.md
git commit -m "test(planner): W7 headless cabinet-v0 mesh visual smoke (P08)"
```

---

### Task 05: Non-regression pack + run.json + optional stages honesty

**Files:**
- Evidence: `vitest-nonreg-raw.log`, `run.json`
- Optional modify: `site/features/planner/asset-engine/stages.ts` (mesh-g3 note only)

- [ ] **Step 1: Run full non-reg pack**

```powershell
cd site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts `
  tests/unit/features/planner/open3d/modularPlaceMesh.test.ts `
  tests/unit/features/planner/asset-engine/meshStages.test.ts `
  tests/unit/features/planner/open3d/cabinetV0MeshSmokeRender.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath results\planner\world-standard-wave\08-mesh-quality\vitest-nonreg-raw.log
```

Expected: **all PASS**. meshStages pair partCount 4; createSceneObject pair names include toe.

- [ ] **Step 2: Optional house pack**

```powershell
cd site
pnpm run p0:g8
```

Expected: PASS (includes modularCabinetV0GlbExport + meshStages). If red unrelated to P08, log residual — do not expand scope unless P08 caused it.

- [ ] **Step 3: Optional stages.ts honesty bump**

If mesh-g3 note still implies single box furniture only, set note to include:

```typescript
note:
  "cabinet-v0 runtime mesh is multi-part toe+carcass+door (W7 bar). " +
  "Non-modular furniture with W/D/H uses ParametricBuilder.generate3DMesh (entitySource parametric-box).",
```

- [ ] **Step 4: Write run.json**

Create `results/planner/world-standard-wave/08-mesh-quality/run.json` (fill real date/sha/visual result):

```json
{
  "phase": "P08",
  "gate": "W7",
  "checkpoint": "CP-08",
  "date": "YYYY-MM-DD",
  "head": "<short sha>",
  "w7": "pass",
  "approach": "A-evidence-finish-on-live-mesh",
  "partNamesDefaultSlab": ["toe", "carcass", "door-slab"],
  "partCountMatrix": { "none": 2, "slab": 3, "pair": 4 },
  "constants": {
    "TOE_HEIGHT_MM": 100,
    "TOE_INSET_MM": 50,
    "DOOR_THICKNESS_MM": 18
  },
  "vitestPassed": true,
  "visualSmoke": "pass",
  "policyNoDesignerGlb": true,
  "task03MeshRewrite": false,
  "residualHonest": "no handles; simple materials; not photoreal; G8 not required",
  "artifacts": [
    "NOTES.md",
    "vitest-raw.log",
    "vitest-nonreg-raw.log",
    "01-cabinet-v0-three-quarter.png",
    "02-cabinet-v0-side.png",
    "visual-smoke.md",
    "run.json",
    "HEAD.txt"
  ],
  "commands": {
    "unit": "pnpm exec vitest run tests/unit/features/planner/open3d/modularCabinetV0.test.ts tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts tests/unit/features/planner/open3d/cabinetV0MeshSmokeRender.test.ts",
    "smoke": "pnpm exec tsx scripts/render-cabinet-v0-mesh-smoke.mts"
  }
}
```

If visual failed: `"w7": "fail"`, `"visualSmoke": "fail"` — **do not** claim pass.

- [ ] **Step 5: Commit evidence + optional stages**

```powershell
cd .
git add results/planner/world-standard-wave/08-mesh-quality/
git add site/features/planner/asset-engine/stages.ts
git commit -m "test(planner): W7 mesh quality nonreg + run.json (P08/CP-08)"
```

---

### Task 06: CP-08 closeout self-grade

- [ ] **Step 1: Evidence checklist on disk**

| Artifact | Required | Present? |
|----------|----------|----------|
| NOTES.md | Yes | |
| vitest-raw.log | Yes | |
| run.json | Yes | |
| 01-cabinet-v0-three-quarter.png | Yes | |
| 02-cabinet-v0-side.png | Yes | |
| visual-smoke.md | Yes | |
| vitest-nonreg-raw.log | Preferred | |

- [ ] **Step 2: Grade CP-08 table**

| Check | Pass condition | Evidence path | Pass? |
|-------|----------------|---------------|-------|
| Bar doc | NOTES defines toe/door/carcass, locked name, numbers, fail modes | `…/08-mesh-quality/NOTES.md` | |
| Unit footprint | Outer W×D stable | vitest-raw + modularCabinetV0 footprint | |
| Unit parts | slab toe+carcass+door; 2/3/4; plan===mesh; height span | vitest-raw + GlbExport | |
| Blast units | createSceneObjectFromNode + meshStages (+ place) green | nonreg log | |
| Visual smoke | Readable parts; checklist yes; headless OK | PNGs + visual-smoke.md | |
| No designer GLB | No new static product GLB; policy intact | code review + policy tests | |
| Height integrity | total height = options.heightMm | Box3 unit | |
| Honest residual | NOTES lists non-photoreal | NOTES residual | |

**CP-08 green only if every required row has a path and is true.**

- [ ] **Step 3: Report honesty**

Report to owner:

- Approach A used; Task 03 skipped or not  
- Paths under `results/planner/world-standard-wave/08-mesh-quality/`  
- Residual: no handles; simple materials  
- **Do not** claim W1–W6/W8 or world-standard product complete — only W7 cabinet-v0 bar  

- [ ] **Step 4: Final commit if any doc deltas**

```powershell
git add results/planner/world-standard-wave/08-mesh-quality/
git commit -m "test(planner): W7 mesh quality evidence pack (P08/CP-08)"
```

- [ ] **Step 5: Push when green enough (agent call per AGENTS)**

```powershell
git push origin main
```

Mirror mayoite if ~45m work / big land.

---

## 7. Test matrix

| Layer | Command | Expected |
|-------|---------|----------|
| Primary unit | vitest modularCabinetV0 + GlbExport + footprint | PASS; slab names toe/carcass/door-slab; Box3 span 0.72 |
| Smoke unit | vitest cabinetV0MeshSmokeRender | PASS; multi-color; toe darker band |
| Blast | createSceneObjectFromNode + modularPlaceMesh + meshStages | PASS; pair children 4 |
| G5 optional | meshStages export binary | PASS; generated path; bytes > 100 |
| Headless CLI | `tsx scripts/render-cabinet-v0-mesh-smoke.mts` | 2 PNGs written |
| Policy | existing glbAssetPolicy / export path asserts | reject designer static |
| Browser (optional) | open3d place cabinet-v0 | **Not required** for CP-08 |

---

## 8. False-green catalog

| Trap | Why false | Plan block |
|------|-----------|------------|
| Units green without PNG | Gate requires visual | Task 04 + CP-08 table |
| PNG of designer GLB | Policy + ethics fail | Smoke uses part plans only |
| Trust plan “no toe” → rewrite thrash | Code already has toe | Task 00 re-proof; Task 03 conditional |
| Paper NOTES without numbers | Ungradeable | Task 01 full template |
| Toe additive height | BOQ height lie | Box3 assert |
| Full-height door | Kick unreadable | door bottom ≥ toeH |
| plan≠mesh | Export drift | 1:1 tests |
| Wrong evidence folder | Contaminates P09 | RESULTS-MAP sole `08-mesh-quality/` |
| Photoreal claim | Wrong product | residual + ethics |
| Alias plinth | flaky agents | exact `toe` |
| R3F rewrite | thrash | out of scope |
| Expand all SKUs | miss kill order | cabinet-v0 only |

---

## 9. Stop-if-fail / CP criteria

**Stop and do not mark W7 pass if:**

1. Any primary unit red after fix attempts  
2. Blast pair still asserts 3 children  
3. NOTES missing or placeholder  
4. Either PNG missing  
5. visual-smoke checklist has **no** for readable parts  
6. Designer GLB introduced  
7. Height integrity fails  
8. Footprint outer path changed for default SKU  

**CP-08 green only when table in Task 06 is fully path-proven.**

---

## 10. Commit sequence (typical Approach A)

1. `docs(planner): W7 mesh quality bar NOTES for cabinet-v0 (P08)`  
2. `test(planner): W7 headless cabinet-v0 mesh visual smoke (P08)`  
3. `test(planner): W7 mesh quality nonreg + run.json (P08/CP-08)`  
4. Optional: `fix(planner): stages honesty cabinet-v0 W7 multi-part note`  
5. Only if Task 03 needed: `fix(planner): cabinet-v0 toe+carcass+door mesh quality (W7/P08)` **before** smoke commit  

---

## 11. Risks & owner decisions

| Risk | Mitigation |
|------|------------|
| Smoke luma sample flaky | Fix sample coords; do not delete assert |
| PNG encoder platform issues | Use node:zlib deflateSync (available) |
| Phase docs still say no toe | Ignore for code; residual note for doc hygiene (optional P10) |
| Agents re-implement mesh | Task 00/03 skip path explicit |
| Photoreal temptation | NOTES residual + Approach C reject |
| Scope creep to workstation | Explicit non-goal |
| P07 browser dependency | Headless default; browser optional only |

**Owner decisions:** none open — W7 locked.

---

## 12. Self-review vs brainstormer + repo

| Requirement | Covered |
|-------------|---------|
| Repo-first live toe code | §1 |
| Idiots2 Approach A | §2 + Task 00–06 |
| NOTES + visual + units | Tasks 01, 02, 04, 05 |
| plan===mesh / constants shared | §1.5, Task 03, existing tests |
| Height integrity | units + NOTES |
| No designer GLB | ethics + smoke source |
| Evidence folder canonical | all tasks |
| False-green catalog | §8 |
| Blast tests | Task 02/05 |
| Residual honesty | NOTES + run.json |
| No length-cap thin plan | full tasks + full smoke code |
| Placeholder scan | full NOTES + full renderer code |

**Conflict rule applied:** Repo wins on “toe already present.” Brainstormer wins on “evidence still required.”

---

## 13. Appendices

### A. Absolute path index

**Product**

- `site\features\planner\open3d\catalog\modularCabinetV0.ts`
- `site\features\planner\open3d\catalog\modularCabinetV0GlbExport.ts`
- `site\features\planner\open3d\catalog\cabinetV0MeshSmokeRender.ts` (create)
- `site\features\planner\open3d\3d\createSceneObjectFromNode.ts`
- `site\features\planner\asset-engine\mesh\exportModularGlbBinary.ts`
- `site\features\planner\lib\glbAssetPolicy.ts`
- `site\scripts\render-cabinet-v0-mesh-smoke.mts` (create)

**Tests**

- `site\tests\unit\features\planner\open3d\modularCabinetV0.test.ts`
- `site\tests\unit\features\planner\open3d\modularCabinetV0GlbExport.test.ts`
- `site\tests\unit\features\planner\open3d\resolveFurniture2DFootprint.test.ts`
- `site\tests\unit\features\planner\open3d\createSceneObjectFromNode.test.ts`
- `site\tests\unit\features\planner\open3d\modularPlaceMesh.test.ts`
- `site\tests\unit\features\planner\asset-engine\meshStages.test.ts`
- `site\tests\unit\features\planner\open3d\cabinetV0MeshSmokeRender.test.ts` (create)

**Phase / design**

- `Plans\phases\P08-mesh-quality\P08-mesh-quality.md`
- `Plans\phases\P08-mesh-quality\P08-suggestions.md`
- `Plans\phases\P08-mesh-quality\03-r3f-3d.md`
- `docs\superpowers\specs\2026-07-09-world-standard-planner-design.md`
- `Idiots2\P08-mesh-quality\REPORT.md`

**Evidence**

- `results\planner\world-standard-wave\08-mesh-quality\`

### B. Research translation (ideas only)

| Pattern | O&O action |
|---------|------------|
| IKEA manufacturer depth | Named modular parts on real-mm SKU |
| BOQ > photoreal | Height integrity + footprint truth |
| Homestyler mesh 5 | **Do not** race materials |
| Fixed branded sizes | Outer footprint locked |
| OEM portfolio language | Facilities buyer readable 3D, not lifestyle GLB |

### C. Type / signature catalog

```typescript
export type CabinetDoorStyle = "none" | "slab" | "pair";
export type CabinetMaterialId = "oak" | "white";
export interface ModularCabinetV0Options {
  widthMm: number;
  depthMm: number;
  heightMm: number;
  doorStyle: CabinetDoorStyle;
  material: CabinetMaterialId;
}
export const TOE_HEIGHT_MM: number;
export const TOE_INSET_MM: number;
export const DOOR_THICKNESS_MM: number;
export function defaultCabinetV0Options(partial?: Partial<ModularCabinetV0Options>): ModularCabinetV0Options;
export function generateCabinetV0Footprint(options: ModularCabinetV0Options): string;
export function generateCabinetV0Mesh(options: ModularCabinetV0Options): THREE.Group;
export function countCabinetV0Parts(options: ModularCabinetV0Options): number;
export function buildModularCabinetV0PartPlans(options: ModularCabinetV0Options): ModularCabinetV0PartPlan[];
export function buildModularCabinetV0GlbPlan(optionsInput?: Partial<ModularCabinetV0Options>): ModularCabinetV0GlbPlan;
export function renderCabinetV0OrthographicRgba(...): SmokeRgbaResult;
export function encodePngRgba(width: number, height: number, rgba: Uint8ClampedArray): Uint8Array;
```

### D. Agent split (max 2)

| Agent | Owns | Must not |
|-------|------|----------|
| A — verify mesh + units | Tasks 00, 02, 03, 05 units | Photoreal, other SKUs |
| B — NOTES + smoke + closeout | Tasks 01, 04, 06 | Rewrite mesh without re-running A |

Both: `/using-superpowers`, TDD for new smoke code, verification-before-completion, no worktrees.

### E. Explicit non-goals

- Photoreal / PBR packs  
- Full kitchen library  
- Designer static GLB reintroduction  
- Writes under `site/public/**` product trees for mesh  
- R3F open3d rewrite  
- Claiming W1–W6/W8 from P08  
- Depending on P07 browser green  
- Firecrawl  

### F. Next phase

After CP-08: **P09 shortcuts/chrome (W8)** → evidence `09-shortcuts-chrome/`. Do not mix into `08-mesh-quality/`.

---

*End of IMPLEMENTATION-PLAN for P08 / W7. Plan only — no product execution in this write.*
