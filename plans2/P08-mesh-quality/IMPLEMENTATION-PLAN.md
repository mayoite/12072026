# P08 Mesh Quality (W7 / CP-08) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** Close **W7 / CP-08** by proving modular **cabinet-v0** is a buyer-readable multi-part mesh (**toe → carcass → door**), not an apology box — via normative **NOTES**, green unit + blast packs logged under evidence, **headless visual smoke PNGs** graded against NOTES, and machine-readable **run.json**. Do **not** re-implement mesh if live geometry already matches the bar; do **not** claim W7 from unit green alone.

**Architecture:** `ModularCabinetV0Options` (JSON / place stamp) → pure footprint (`generateCabinetV0Footprint`) + pure part plan (`buildModularCabinetV0PartPlans`) → runtime `THREE.Group` (`generateCabinetV0Mesh`) → optional G5 binary via `exportModularCabinetV0GlbBinary` under `catalog-assets/generated/*` only. Viewer place path: `createSceneObjectFromNode` when `geometryMode === "modular-cabinet-v0"`. **Live code (2026-07-10 re-proof) already implements toe + carcass + doors with locked constants and plan===mesh tests.** This plan is primarily **verify + NOTES + visual smoke + evidence pack**, with **Approach B full TDD geometry** only if formula drift is found.

**Tech Stack:** TypeScript, Three.js (runtime mesh), Vitest, open3d modular place + asset-engine mesh stages G1–G6, **software orthographic headless smoke** via existing `site/scripts/p08-cabinet-v0-visual-smoke.mjs` (sharp SVG→PNG; no designer GLB; no WebGL; no new paid deps), evidence under `results/planner/world-standard-wave/08-mesh-quality/`.

**Inputs consumed:**
- Repo read: 2026-07-10 — key paths in §1 Repo reality (`results/` root **absent** at plan time; mesh + units **present** with toe)
- Brainstormer: **`Idiots/P08-mesh-quality/REPORT.md` only** — **never** `Idiots2/`
- Phase plan: `Plans/phases/P08-mesh-quality/P08-mesh-quality.md` + `P08-suggestions.md` + `03-r3f-3d.md` + `Plans/phases/EXPERT-PASS.md`
- Design gate: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §W7
- Evidence map: `Plans/Research/RESULTS-MAP.md` → sole primary **`08-mesh-quality/`**
- Research ideas only: `Plans/Research/RESEARCH-MAP.md` + historical `D:\websites` patterns (no copy)

**Done when:**
1. Default slab children exact order **`toe` → `carcass` → `door-slab`** (pair: + `door-left` / `door-right`); matrix **none=2 / slab=3 / pair=4**.
2. Height integrity: Box3 Y span ≈ `heightMm * 0.001`; toe **replaces** carcass bottom (not additive overshoot).
3. plan === mesh (names, order, sizes metres, positions).
4. Outer 2D footprint W×D still dimension-true (default 600×580 path unchanged).
5. Primary + blast vitest packs green with logs under evidence.
6. **`NOTES.md`** exists with numbers, fail modes, residual honesty, BOQ>photoreal metric.
7. Headless visual smoke: `01-cabinet-v0-three-quarter.png` + `02-cabinet-v0-side.png` + `visual-smoke.md` checklist **yes** for readable toe/door/carcass.
8. **`run.json`** filled; CP-08 table fully path-proven under `results/planner/world-standard-wave/08-mesh-quality/`.
9. No designer static GLB; no `site/public/**` product mesh dump; no photoreal claim; residual listed.

**Evidence folder (trustdata-style):** `results/planner/world-standard-wave/08-mesh-quality/` (create on execute; **missing at plan time** → re-prove; never claim W7 from historical memory alone).

**Approach locked (Idiots §11):** **Approach A — Evidence-first closeout** on live mesh. Fall back to **Approach B — Strict TDD re-walk** only if formula drift found. **Approach C — Photoreal / designer GLB** = hard reject.

---

## 1. Repo reality (Phase 1 — live disk facts)

### 1.1 What exists and matches the W7 mesh bar

| Path | Live fact (re-proof 2026-07-10 planner pass) |
|------|-----------------------------------------------|
| `site/features/planner/open3d/catalog/modularCabinetV0.ts` | Exports `TOE_HEIGHT_MM=100`, `TOE_INSET_MM=50`, `DOOR_THICKNESS_MM=18`. `generateCabinetV0Mesh` builds **toe → carcass → door(s)**; darker toe materials (`TOE_MATERIAL_COLOR`); `countCabinetV0Parts` = 2/3/4; group name `modular-cabinet-v0`; userData snapshot of options. |
| `site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts` | **Imports** shared constants (no duplicate magic). `buildModularCabinetV0PartPlans` mirrors mesh layout. `binaryExportStatus: "plan-only"`. Generated path under `catalog-assets/generated/`. |
| `site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts` | Asserts names/order, matrix, toe inset geometry, carcass on toe, door above toe, **Box3 height integrity**, oak≠white, footprint path. |
| `site/tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts` | plan-only status; matrix 2/3/4; **plan parts match mesh 1:1**; policy-safe path; designer static rejected. |
| `site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts` | Slab length via `countCabinetV0Parts` / 3; pair names include **`toe`** and length 4. |
| `site/tests/unit/features/planner/asset-engine/meshStages.test.ts` | Pair `runtimeMeshChildren` / `partCount` **=== 4**. |
| `site/tests/unit/features/planner/open3d/modularPlaceMesh.test.ts` | Uses `countCabinetV0Parts` (stays aligned if helper correct). |
| `site/tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts` | Outer modular footprint from options; BOQ envelope path. |
| `site/features/planner/open3d/3d/createSceneObjectFromNode.ts` | Procedural path: `generateCabinetV0Mesh`; floor-origin group (`position.y = 0`). |
| `site/features/planner/asset-engine/mesh/exportModularGlbBinary.ts` | G5 uses runtime mesh + plan; `assertNoDesignerStaticGlb`. |
| `site/features/planner/lib/glbAssetPolicy.ts` | `GENERATED_GLB_PATH_MARKER = "catalog-assets/generated/"`. |
| `site/scripts/p08-cabinet-v0-visual-smoke.mjs` | **Present** — SVG orthographic/isometric projection of **plan formulas** → sharp PNG; writes `01-…` / `02-…` + `visual-smoke-meta.json`. |
| `site/features/planner/asset-engine/stages.ts` | Mesh stages registry; mesh-g3 note still generic (optional honesty bump). |

### 1.2 What is missing (gate fails without these)

| Gap | Severity |
|-----|----------|
| Entire `results/` tree **absent** on this checkout | **CP-08 red** — units in source tree ≠ W7 pass |
| No `results/planner/world-standard-wave/08-mesh-quality/NOTES.md` | Gate requires bar doc |
| No headless smoke PNGs / `visual-smoke.md` under evidence | Gate requires visual |
| No `vitest-raw.log` / `vitest-nonreg-raw.log` / `run.json` under evidence | Closeout incomplete |
| Phase honesty baseline in `P08-mesh-quality.md` / `03-r3f-3d.md` still says “no toe / 1/2/3” | **Stale docs** — do not re-implement from them; optionally note residual in closeout |

### 1.3 Contradictions: plan docs vs code (repo wins)

| Source claim | Code truth | Plan rule |
|--------------|------------|-----------|
| Phase honesty 2026-07-09: carcass+door only, counts 1/2/3, private dup `DOOR_THICKNESS_MM` | toe present, counts 2/3/4, constants exported + imported | **Repo wins** |
| `P08-suggestions.md` “will go red on toe” | tests already green on toe | Historical; verify not rewrite |
| `03-r3f-3d.md` path truth “no toe” | stale | Ignore for mesh presence; keep “imperative Three / no photoreal” |
| Idiots REPORT §3 | matches live re-proof | Use for bar / failures / Approach A |
| Research O&O mesh score ~1–2 | historical snapshot; code now L2 multi-part | Do not treat research score as “still apology box” without re-reading mesh |

### 1.4 HEAD / tree honesty

At plan write time:

- Evidence tree under `results/planner/` **absent**.
- Mesh + unit + blast files **present** with W7 geometry.
- Capture `git rev-parse --short HEAD` and dirty status in Task 00 into evidence `HEAD.txt` / `run.json`.
- Do not invent a green historical SHA for CP-08.

### 1.5 Normative live formulas (copy of product code contract)

Constants (exported from `modularCabinetV0.ts`):

```typescript
export const TOE_HEIGHT_MM = 100;
export const TOE_INSET_MM = 50;
export const DOOR_THICKNESS_MM = 18;
// internal
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
| `door-right` | same size as left | `{x:+(leafW/2)+0.005, y:carcassY, z:d/2+doorT/2}` |

Footprint default 600×580:

```text
M -300 -290 L 300 -290 L 300 290 L -300 290 Z
```

Materials:

| Part | oak | white |
|------|-----|-------|
| carcass / door | `#c4a574` | `#f3f4f6` |
| toe (darker) | `#a88858` | `#d1d5db` |

### 1.6 Part-count matrix (normative)

| doorStyle | parts | names order |
|-----------|------:|-------------|
| `none` | 2 | `toe`, `carcass` |
| `slab` | 3 | `toe`, `carcass`, `door-slab` |
| `pair` | 4 | `toe`, `carcass`, `door-left`, `door-right` |

**Locked name:** child `name === "toe"` exactly — never `toe-kick`, never `plinth`, never dual aliases mid-phase.

### 1.7 Worked example (default slab white 600×580×720)

| Qty | Value |
|-----|------:|
| w | 0.600 m |
| d | 0.580 m |
| h | 0.720 m |
| toeH | 0.100 m |
| inset | 0.050 m |
| carcassH | 0.620 m |
| doorT | 0.018 m |
| carcassY | 0.410 m |
| toe size | 0.600 × 0.100 × 0.530 |
| toe pos | (0, 0.050, −0.025) |
| carcass size | 0.600 × 0.620 × 0.580 |
| door-slab size | 0.576 × 0.5704 × 0.018 |
| door z | 0.299 m |
| Box3 Y span | 0.720 m |

### 1.8 Live mesh source (reference — do not thrash if matches)

Canonical runtime builder (abbreviated structure that must remain true):

```typescript
// site/features/planner/open3d/catalog/modularCabinetV0.ts — structure
export function generateCabinetV0Mesh(options: ModularCabinetV0Options): THREE.Group {
  // group.name = "modular-cabinet-v0"
  // add toe (BoxGeometry(w, toeH, d-inset) @ (0, toeH/2, -inset/2))
  // add carcass (BoxGeometry(w, carcassH, d) @ (0, carcassY, 0))
  // if slab: door-slab height carcassH*0.92 @ carcassY, z = d/2+doorT/2
  // if pair: door-left + door-right same height rule
  // return group
}

export function countCabinetV0Parts(options: ModularCabinetV0Options): number {
  if (options.doorStyle === "none") return 2;
  if (options.doorStyle === "slab") return 3;
  return 4;
}
```

Canonical pure plan (must mirror mesh):

```typescript
// site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts — structure
export function buildModularCabinetV0PartPlans(
  options: ModularCabinetV0Options,
): ModularCabinetV0PartPlan[] {
  // same numbers as generateCabinetV0Mesh; pure; no THREE
}
```

### 1.9 Scene factory consume (read-only unless origin contract breaks)

```typescript
// createSceneObjectFromNode — modular branch
if (node.kind === "furniture" && node.geometryMode === "modular-cabinet-v0") {
  const options = node.modularOptions ?? defaultCabinetV0Options({ ...dims });
  const meshGroup = generateCabinetV0Mesh(options);
  meshGroup.position.set(mmToMeters(node.xMm), 0, mmToMeters(node.yMm));
  // floor origin; carcass already positioned with toe
}
```

### 1.10 Quality spectrum (Idiots §9 — know where to stop)

| Level | Description | W7 status |
|-------|-------------|-----------|
| L0 | Single apology box | **FAIL** |
| L1 | Carcass + door full height | **FAIL** |
| **L2** | **Toe + carcass + door(s), height integrity, plan===mesh** | **W7 PASS bar** |
| L3 | Side panels / shelves / top thickness | Post-W residual |
| L4 | Handles / hinges | Residual |
| L5 | PBR / HDR | Non-goal |
| L6 | Designer hero GLB as primary | Policy-hostile |

**P08 raises L0/L1 → L2.** Live code is already **L2**. Plan closes **proof**, not L3–L6 fashion.

---

## 2. Brainstormer synthesis (Phase 2 — `Idiots/P08-mesh-quality/REPORT.md`)

### 2.1 Executive verdict (from Idiots §0)

| Claim | Verdict |
|-------|---------|
| Phase plan path-true | YES |
| Photoreal is W7 | **NO** |
| Success metric | BOQ/quote + readable modular silhouette > pretty PNG |
| Live code vs plan “no toe” honesty | **Code ahead** — toe landed |
| CP-08 green today | **NO** — `results/` absent |
| What remains | Evidence pack + NOTES + graded smoke + residual honesty |

**One sentence (Idiots head):**  
P08 is not “invent mesh architecture” — it is **freeze the bar in NOTES, prove silhouette with visual smoke, keep plan===mesh, never overshoot height, never photoreal-fake, land proof only under `08-mesh-quality/`.**

### 2.2 Buyer journeys / acceptance

| Journey | Acceptance |
|---------|------------|
| Facilities buyer views default slab cabinet in 3D three-quarter | Can point to **toe band**, **body**, **door face** without reading child name labels |
| Same buyer side view | Sees toe **shallower in Z** (inset) and door proud of front |
| Quote / BOQ path | Outer footprint W×D still mm-true; height span = SKU height |
| Engineer place modular | `geometryMode modular-cabinet-v0` → procedural group with matrix 2/3/4 |

### 2.3 Competitive JTBD (ideas only — no copy)

| Pattern source | Steal as idea | Never ship |
|----------------|---------------|------------|
| IKEA manufacturer depth | Configurator of real modules; item list / quote path | Brand names, meshes, chrome, imagery |
| Homestyler / Foyr mesh beauty | Later storytelling only | Photoreal race for W7; vendor GLB dumps |
| Planner5D | Multi-part enough to recognize class | Their assets / UI |
| OEM systems (category peers) | Shape → size grid → generate 2D+3D | Free GLB dump per size×client |

### 2.4 Failure modes / false-green traps (Idiots §8 + §16)

| Trap | Block how in this plan |
|------|------------------------|
| Units green, no PNG/NOTES | CP-08 checklist requires artifacts |
| Trust phase “no toe” → re-implement thrash | Task 00 re-proof; Task 03 verify-only if green |
| Toe additive height | Box3 span assert in units |
| Full-height door covering kick | door bottom ≥ toeH unit |
| plan ≠ mesh | 1:1 GlbExport tests |
| Designer GLB for smoke | `p08-cabinet-v0-visual-smoke.mjs` uses plan formulas only |
| Photoreal as W7 | NOTES residual forbids claim |
| Alias plinth/toe-kick | exact `toe` only |
| Wrong evidence folder | sole `08-mesh-quality/` |
| R3F rewrite mid-gate | out of scope |
| Workstation smoke as cabinet proof | wrong product surface |
| Research score “mesh 1” after code L2 | re-verify code |
| Labels hide unreadability | grade smoke as if labels hidden |

### 2.5 Raised bar (beyond paper process PASS)

- Human can distinguish **base band / body / door face** in three-quarter PNG without depending on wireframe labels.
- Side PNG shows **toe depth shorter** than carcass (inset).
- Residual honesty written (no handles, simple materials, not photoreal).
- Metric tattoo: **`BOQ/quote path > photoreal; readable parts beat pretty noise.`**

### 2.6 Approaches A/B/C (Idiots §11) — choice locked

| Approach | When | Choice |
|----------|------|--------|
| **A Evidence-first closeout** | Live mesh already L2 | **SELECTED default** |
| **B Strict TDD re-walk** | Formula drift / missing toe | Fallback only |
| **C Photoreal / designer GLB** | Never | **REJECT** |

### 2.7 Open questions

None product-ambiguous — W7 locked by design + phase. Execute only. Owner decisions already frozen:

- Name = `toe`
- Constants 100 / 50 / 18
- Headless smoke default (P07 not required)
- Evidence sole `08-mesh-quality/`

### 2.8 Path index from Idiots (cross-checked Phase 1)

All primary paths in Idiots Appendix B/C exist on disk. Evidence paths do **not**. Smoke script **does** exist (plan does not invent a second renderer).

### 2.9 Conflict rule applied

| Domain | Winner |
|--------|--------|
| What code does | **Repo** |
| Intent / bar / failure modes / residual | **Idiots report** when repo silent on process |
| Stale phase honesty “no toe” | **Repo** (code) + **Idiots** (update mental model) |

---

## 3. Ethics / non-copy

- Competitive research (`D:\websites`, IKEA / Homestyler / Planner5D / Foyr) = **JTBD / patterns only**.
- **Forbidden in product or evidence:** competitor JS, CSS, GLB, icons, logos, brand names, marketing copy, pixel-clone chrome, scraped furniture meshes, screenshots of competitors as O&O proof.
- Evidence PNGs = **our** procedural / plan-formula cabinet-v0 only (smoke script or live mesh).
- Prefer **zero new deps**. Smoke uses existing `sharp` already in site toolchain.
- **Firecrawl: dead** for routine work.
- No write of product mesh under `site/public/**` for this phase (generated relative paths only `catalog-assets/generated/*` if G5 runs).
- MIT/open packages only if any dep truly required — default: none new for P08.

---

## 4. File map

### 4.1 Create (evidence — required for CP-08)

| Path | Why |
|------|-----|
| `results/planner/world-standard-wave/08-mesh-quality/` | Evidence home (RESULTS-MAP sole primary `08-*`) |
| `…/HEAD.txt` | SHA honesty |
| `…/NOTES.md` | W7 bar doc |
| `…/vitest-baseline-raw.log` | Task 00 pre-check (optional but preferred) |
| `…/vitest-raw.log` | primary unit log |
| `…/vitest-nonreg-raw.log` | blast + primary pack log |
| `…/01-cabinet-v0-three-quarter.png` | visual smoke |
| `…/02-cabinet-v0-side.png` | visual smoke |
| `…/visual-smoke.md` | graded checklist |
| `…/visual-smoke-meta.json` | emitted by smoke script |
| `…/run.json` | machine CP-08 summary |

### 4.2 Modify (conditional — only on drift)

| Path | When |
|------|------|
| `site/features/planner/open3d/catalog/modularCabinetV0.ts` | Task 02/03 if formulas fail |
| `site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts` | Same; never reintroduce private constant dup |
| `site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts` | Only if assertions missing vs bar |
| `site/tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts` | Same |
| Blast unit files | Only if counts/names drift |
| `site/features/planner/asset-engine/stages.ts` mesh-g3 note | Optional honesty: “cabinet-v0 includes toe+carcass+door (W7 bar)” |
| `site/scripts/p08-cabinet-v0-visual-smoke.mjs` | Only if constants drift from mesh (script reimplements formulas — keep aligned) |

### 4.3 Read-only / regression run

| Path | Role |
|------|------|
| `createSceneObjectFromNode.ts` | consume mesh; floor origin |
| `exportModularGlbBinary.ts` | G5 |
| `runMeshStages.ts` | G1–G6 orchestrator |
| `glbAssetPolicy.ts` | policy |
| `resolveFurniture2DFootprint` tests | outer envelope |
| `modularPlaceMesh.test.ts` | place → mesh children |

### 4.4 Do not touch

- Non–cabinet-v0 SKUs / workstation mesh as CP-08 evidence
- R3F rewrite / ThreeViewerInner orbit (P04)
- Playwright journey (P07 optional only — not CP-08 dependency)
- Designer GLB / public catalog models
- `Idiots2/` reports (this wave uses **Idiots only**)
- `plans1/` (wave-1 plans — different input set; do not merge blindly)
- Firecrawl re-scrape

---

## 5. Architecture & data flow

```text
ModularCabinetV0Options
        │
        ├─ generateCabinetV0Footprint ──► 2D path (outer W×D mm) ──► BOQ envelope
        │
        ├─ generateCabinetV0Mesh ───────► THREE.Group children [toe,carcass,door*]
        │         ▲
        │         │ createSceneObjectFromNode (viewer place, geometryMode modular-cabinet-v0)
        │         │ exportModularGlbBinary (G5 clones runtime mesh)
        │
        └─ buildModularCabinetV0PartPlans ─► pure metres parts (G4)
                  │
                  ├─ buildModularCabinetV0GlbPlan (metadata + relativePath)
                  ├─ exportModularCabinetV0ToGeneratedAssetPath
                  └─ p08-cabinet-v0-visual-smoke.mjs (mirrors formulas → PNG)

Policy: relativePath must pass assertNoDesignerStaticGlb
         allow: empty | blob: | catalog-assets/generated/*
Evidence: results/planner/world-standard-wave/08-mesh-quality/*
```

**Invariant:** any change to mesh layout must update part plans **and** smoke script constants/formulas in the same landable slice (plan===mesh===smoke).

**Viewer family lock:** imperative Three (`ThreeViewerInner` + OrbitControls). No R3F `<Canvas>` rewrite for pretty PNG.

---

## 6. Task list

### Task 00: Evidence shell + live re-proof (do not trust stale phase honesty)

**Files:**
- Create: `results/planner/world-standard-wave/08-mesh-quality/`
- Create: `results/planner/world-standard-wave/08-mesh-quality/HEAD.txt`
- Read: `modularCabinetV0.ts`, `modularCabinetV0GlbExport.ts`, both primary unit files, `p08-cabinet-v0-visual-smoke.mjs`

- [ ] **Step 1: Confirm checkout (main tree only)**

Run:

```powershell
cd D:\OandO07072026
git rev-parse --show-toplevel
git rev-parse --short HEAD
git status -sb
```

Expected:
- toplevel is `D:/OandO07072026` (or Windows path equivalent)
- **No worktree** path
- Record short SHA for `HEAD.txt` / `run.json`

- [ ] **Step 2: Create evidence directory + HEAD.txt**

```powershell
New-Item -ItemType Directory -Force -Path D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality | Out-Null
git rev-parse --short HEAD | Set-Content -Encoding utf8 D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\HEAD.txt
```

Expected: directory exists; `HEAD.txt` contains short sha only.

- [ ] **Step 3: Re-proof mesh has toe (grep honesty vs stale plan baseline)**

```powershell
Select-String -Path D:\OandO07072026\site\features\planner\open3d\catalog\modularCabinetV0.ts -Pattern 'TOE_HEIGHT_MM|name = "toe"|countCabinetV0Parts'
Select-String -Path D:\OandO07072026\site\features\planner\open3d\catalog\modularCabinetV0GlbExport.ts -Pattern 'TOE_HEIGHT_MM|name: "toe"|from "./modularCabinetV0"'
Select-String -Path D:\OandO07072026\site\scripts\p08-cabinet-v0-visual-smoke.mjs -Pattern 'TOE_HEIGHT_MM|toe'
```

Expected: matches proving:
- exported constants + `toe.name = "toe"`
- GlbExport imports constants + plan name `"toe"`
- smoke script uses same constants

**Branch decision:**
- If toe present → continue **Approach A** (Tasks 01, 04–06; Task 02/03 verify-only).
- If **no toe** → **Approach B** (full Task 02 red → Task 03 green). Do not invent geometry without red tests.

- [ ] **Step 4: Baseline unit pack**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\vitest-baseline-raw.log
```

Expected (Approach A): **PASS** all tests in those files.  
If FAIL for missing toe / wrong counts: capture as baseline-red; proceed Task 02/03.  
If FAIL for unrelated import/env: systematic-debug before inventing geometry.

- [ ] **Step 5: Commit policy for Task 00**

Empty evidence dir alone need not commit. Prefer first landable commit with NOTES (Task 01) or full evidence pack (Task 06).

---

### Task 01: Write NOTES.md (W7 written truth — CP-08 bar doc)

**Files:**
- Create: `results/planner/world-standard-wave/08-mesh-quality/NOTES.md`

- [ ] **Step 1: Write full NOTES (no placeholders)**

Create the file with **exactly this substance** (update HEAD/date at execute if different; do not leave empty sections):

```markdown
# W7 / CP-08 — Mesh quality bar (cabinet-v0)

**Gate:** W7 — Mesh quality bar doc + visual: modular not “apology boxes” for cabinet-v0 (toe/door/carcass readable).  
**Checkpoint:** CP-08  
**SKU scope:** modular cabinet-v0 only  
**Evidence home:** `results/planner/world-standard-wave/08-mesh-quality/`  
**Product metric hierarchy:** BOQ/quote path > readable manufacturer parts > pretty noise / photoreal.

**Phrase:** BOQ/quote path > photoreal; readable parts beat pretty noise.

## Pass criteria (all required)

1. Named parts on default slab: exact strings `toe`, `carcass`, `door-slab` (pair → `door-left` + `door-right`).
2. Locked child order: `toe` → `carcass` → door part(s).
3. Readable silhouette (three-quarter): darker/receded base band, body mass, door face distinguishable without depending on wireframe labels.
4. Locked geometry constants (single source `modularCabinetV0.ts`):
   - `TOE_HEIGHT_MM = 100`
   - `TOE_INSET_MM = 50`
   - `DOOR_THICKNESS_MM = 18`
5. Locked formulas (MM = 0.001; w/d/h from options; carcassH = h − toeH; carcassY = toeH + carcassH/2):
   - **toe:** size `(w, toeH, d−inset)`, pos `(0, toeH/2, −inset/2)` (back-aligned recess)
   - **carcass:** size `(w, carcassH, d)`, pos `(0, carcassY, 0)`
   - **doors:** height ≈ `carcassH * 0.92` (not full h); y = carcassY; z = d/2 + doorT/2; slab width ≈ w*0.96; pair leaves ≈ w*0.47 with ±0.005 gap
6. Height integrity: Box3 maxY−minY ≈ heightMm×0.001; minY ≈ 0; toe replaces carcass bottom (not additive overshoot).
7. Door bottom ≥ toe top (door does not cover kick).
8. 2D footprint outer W×D dimension-true (default 600×580 → `M -300 -290 L 300 -290 L 300 290 L -300 290 Z`). Toe inset does not shrink BOQ envelope.
9. Part plan === mesh children (names, order, sizes m, positions). GlbExport imports constants — no second magic copy.
10. No designer static GLB; generated paths only `catalog-assets/generated/*`; no `site/public/**` product mesh dump for this phase.
11. Materials: toe slightly darker same family; oak ≠ white on carcass.

## Fail criteria (explicit)

- Single BoxGeometry furniture / apology box silhouette.
- Door floor-to-top covering toe band.
- Toe stacked on full-height carcass (height overshoot past SKU).
- plan missing `toe` while mesh has it (or reverse).
- Hand-made / designer static `.glb` used for “proof” PNG.
- Alias rename (`plinth`, `toe-kick`, `kick`, `base` as child name) mid-phase.
- Units green without NOTES + graded PNG.
- Photoreal claimed as W7 success.
- Workstation-v0 smoke used as cabinet-v0 evidence.
- Wrong evidence folder (`07-mesh-quality/`, `09-mesh-*`, `site/results/`, historical `modular-*` as CP-08 home).

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
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\vitest-raw.log
```

### Unit non-reg (primary + blast)

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

### Visual smoke (default headless — frozen)

```powershell
cd D:\OandO07072026\site
node scripts/p08-cabinet-v0-visual-smoke.mjs --out D:/OandO07072026/results/planner/world-standard-wave/08-mesh-quality
```

Options frozen: 600×580×720 mm, doorStyle slab, material white.  
Renderer: plan-formula SVG projection via sharp (no designer GLB, no browser). Labels on PNG are QA aids — grade readability as if labels hidden.

## Artifacts expected in this folder

| Artifact | Required |
|----------|----------|
| NOTES.md | Yes |
| HEAD.txt | Yes |
| vitest-raw.log | Yes |
| vitest-nonreg-raw.log | Preferred / yes for closeout |
| 01-cabinet-v0-three-quarter.png | Yes |
| 02-cabinet-v0-side.png | Yes |
| visual-smoke.md | Yes |
| visual-smoke-meta.json | Support (script) |
| run.json | Yes |

## Honest residual (still boxy — PASS honesty)

- No handles or pulls.
- No side reveals / shadow gaps between doors and carcass sides.
- No countertop / worktop part.
- No distinct plinth material system (only darker same family).
- Doors are flat slabs, not shaker/profile.
- Pair centre gap is geometric (±0.005 m), not hardware.
- Lighting is viewer default / smoke flat fill — not studio setup.
- Not photoreal. Not world-standard cabinetry CAD.

## Quality level claim

**L2 only** (toe + carcass + door, height integrity, plan===mesh).  
Do not claim L3–L6 or “world-standard product complete” from this pack.
```

- [ ] **Step 2: Verify NOTES has no empty placeholders**

Scan for `TBD`, `TODO`, `fill in`, empty `##` sections. Fix before commit.

- [ ] **Step 3: Commit NOTES slice**

```bash
git add results/planner/world-standard-wave/08-mesh-quality/NOTES.md results/planner/world-standard-wave/08-mesh-quality/HEAD.txt
git commit -m "docs(planner): W7 mesh quality bar NOTES for cabinet-v0 (P08)"
```

**Done when:** `NOTES.md` exists on disk with concrete numbers and names; a reviewer can grade a screenshot against NOTES without opening this plan file.

---

### Task 02: Unit contract — red path only if drift (TDD)

**Files:**
- Modify (only if Approach B): `site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts`
- Modify (only if Approach B): `site/tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts`
- Read: blast files (expect green if mesh already correct)

**Approach A path (default when baseline green):**

- [ ] **Step 1: Confirm primary suite already encodes the red-tests intent**

The following assertions must exist (they do as of 2026-07-10). If any missing, write them and expect FAIL until Task 03:

1. Default slab child names `["toe","carcass","door-slab"]` exact order  
2. `countCabinetV0Parts` matrix 2/3/4  
3. Toe geometry: height ≈ 0.1 m; z ≈ −inset/2; depth ≈ (depthMm−50)*0.001  
4. Carcass height ≈ (heightMm−100)*0.001; y = toeH + carcassH/2  
5. Door height ≈ carcassH*0.92; door bottom ≥ toe top  
6. Box3 spanY ≈ heightMm*0.001; minY ≈ 0  
7. Footprint `M -300 -290 L 300 -290 L 300 290 L -300 290 Z` for 600×580  
8. plan parts === mesh 1:1  
9. Policy path under `catalog-assets/generated/`  

- [ ] **Step 2: Re-run primary pack; treat green as contract lock (not skip)**

Same command as Task 00 Step 4 → also write as `vitest-raw.log` if not yet:

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\vitest-raw.log
```

Expected (Approach A): **PASS**.  
Document in evidence honesty: “Task 02 red skipped — contract already green; log is green proof.”

**Approach B path (only if baseline failed for geometry):**

- [ ] **Step B1: Write failing tests first** (full source below — add to modularCabinetV0.test.ts if missing)

```typescript
import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  DOOR_THICKNESS_MM,
  TOE_HEIGHT_MM,
  TOE_INSET_MM,
  countCabinetV0Parts,
  defaultCabinetV0Options,
  generateCabinetV0Footprint,
  generateCabinetV0Mesh,
} from "@/features/planner/open3d/catalog/modularCabinetV0";

const MM = 0.001;

function meshByName(group: THREE.Group, name: string): THREE.Mesh {
  const child = group.children.find((c) => c.name === name);
  expect(child).toBeInstanceOf(THREE.Mesh);
  return child as THREE.Mesh;
}

function boxParams(mesh: THREE.Mesh): {
  width: number;
  height: number;
  depth: number;
} {
  const geom = mesh.geometry as THREE.BoxGeometry;
  return geom.parameters;
}

describe("modular cabinet-v0 W7 bar (Approach B red)", () => {
  it("default slab child names are toe → carcass → door-slab", () => {
    const opts = defaultCabinetV0Options({ doorStyle: "slab" });
    const group = generateCabinetV0Mesh(opts);
    expect(group.children.map((c) => c.name)).toEqual([
      "toe",
      "carcass",
      "door-slab",
    ]);
    expect(countCabinetV0Parts(opts)).toBe(3);
  });

  it("part-count matrix is none=2 slab=3 pair=4", () => {
    expect(countCabinetV0Parts(defaultCabinetV0Options({ doorStyle: "none" }))).toBe(2);
    expect(countCabinetV0Parts(defaultCabinetV0Options({ doorStyle: "slab" }))).toBe(3);
    expect(countCabinetV0Parts(defaultCabinetV0Options({ doorStyle: "pair" }))).toBe(4);
  });

  it("toe uses locked height/inset back-aligned", () => {
    const opts = defaultCabinetV0Options({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "none",
    });
    const toe = meshByName(generateCabinetV0Mesh(opts), "toe");
    const p = boxParams(toe);
    const toeH = TOE_HEIGHT_MM * MM;
    const inset = TOE_INSET_MM * MM;
    expect(p.height).toBeCloseTo(toeH);
    expect(p.depth).toBeCloseTo(0.58 - inset);
    expect(toe.position.y).toBeCloseTo(toeH / 2);
    expect(toe.position.z).toBeCloseTo(-inset / 2);
  });

  it("carcass sits on toe without double-counting height", () => {
    const opts = defaultCabinetV0Options({
      heightMm: 900,
      doorStyle: "none",
    });
    const group = generateCabinetV0Mesh(opts);
    const toeH = TOE_HEIGHT_MM * MM;
    const carcassH = (900 - TOE_HEIGHT_MM) * MM;
    const carcass = meshByName(group, "carcass");
    expect(boxParams(carcass).height).toBeCloseTo(carcassH);
    expect(carcass.position.y).toBeCloseTo(toeH + carcassH / 2);
  });

  it("doors track carcassH and sit above toe", () => {
    const opts = defaultCabinetV0Options({ doorStyle: "slab", heightMm: 720 });
    const group = generateCabinetV0Mesh(opts);
    const toeH = TOE_HEIGHT_MM * MM;
    const carcassH = (720 - TOE_HEIGHT_MM) * MM;
    const door = meshByName(group, "door-slab");
    const h = boxParams(door).height;
    expect(h).toBeCloseTo(carcassH * 0.92);
    const doorBottom = door.position.y - h / 2;
    expect(doorBottom).toBeGreaterThanOrEqual(toeH - 1e-9);
  });

  it("height integrity Box3 span equals SKU height", () => {
    const opts = defaultCabinetV0Options({ doorStyle: "slab", heightMm: 720 });
    const group = generateCabinetV0Mesh(opts);
    const box = new THREE.Box3().setFromObject(group);
    expect(box.max.y - box.min.y).toBeCloseTo(0.72, 6);
    expect(box.min.y).toBeCloseTo(0, 6);
  });

  it("footprint outer envelope unchanged for 600x580", () => {
    expect(
      generateCabinetV0Footprint(
        defaultCabinetV0Options({ widthMm: 600, depthMm: 580 }),
      ),
    ).toBe("M -300 -290 L 300 -290 L 300 290 L -300 290 Z");
  });
});
```

- [ ] **Step B2: Write plan===mesh failing test** (if missing) in modularCabinetV0GlbExport.test.ts

```typescript
import { describe, expect, it } from "vitest";
import {
  DOOR_THICKNESS_MM,
  TOE_HEIGHT_MM,
  TOE_INSET_MM,
  defaultCabinetV0Options,
  generateCabinetV0Mesh,
} from "@/features/planner/open3d/catalog/modularCabinetV0";
import { buildModularCabinetV0PartPlans } from "@/features/planner/open3d/catalog/modularCabinetV0GlbExport";

const MM = 0.001;

describe("plan === mesh (Approach B red)", () => {
  it("parts match mesh children 1:1", () => {
    const opts = defaultCabinetV0Options({
      doorStyle: "slab",
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
    });
    const planParts = buildModularCabinetV0PartPlans(opts);
    const group = generateCabinetV0Mesh(opts);
    expect(planParts.map((p) => p.name)).toEqual(
      group.children.map((c) => c.name),
    );
    for (let i = 0; i < planParts.length; i++) {
      const plan = planParts[i]!;
      const mesh = group.children[i] as import("three").Mesh;
      const geom = mesh.geometry as import("three").BoxGeometry;
      expect(plan.sizeM.x).toBeCloseTo(geom.parameters.width);
      expect(plan.sizeM.y).toBeCloseTo(geom.parameters.height);
      expect(plan.sizeM.z).toBeCloseTo(geom.parameters.depth);
      expect(plan.positionM.x).toBeCloseTo(mesh.position.x);
      expect(plan.positionM.y).toBeCloseTo(mesh.position.y);
      expect(plan.positionM.z).toBeCloseTo(mesh.position.z);
    }
    expect(planParts[0]!.name).toBe("toe");
    expect(planParts[0]!.sizeM.y).toBeCloseTo(TOE_HEIGHT_MM * MM);
    expect(planParts[0]!.positionM.z).toBeCloseTo(-(TOE_INSET_MM * MM) / 2);
    expect(planParts[2]!.sizeM.z).toBeCloseTo(DOOR_THICKNESS_MM * MM);
  });
});
```

- [ ] **Step B3: Run tests — expect FAIL for missing toe / wrong counts**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\vitest-red-raw.log
```

Expected: FAIL with missing `"toe"` or wrong partCount (not import typos).

**Done when:** Contract is locked (green proof or honest red log). Never skip assertions because “we know the mesh works.”

---

### Task 03: Green mesh — implement only if drift; else verify + blast

**Files:**
- Modify (Approach B only): `modularCabinetV0.ts`, `modularCabinetV0GlbExport.ts`
- Modify (if blast hard-codes stale counts):  
  - `createSceneObjectFromNode.test.ts`  
  - `meshStages.test.ts`  
  - `modularPlaceMesh.test.ts` (only if hard-coded)
- Optional: `stages.ts` honesty note

#### Approach A (default) — verify only

- [ ] **Step 1: Diff formulas against §1.5**

Open both mesh + GlbExport; confirm:
- constants exported / imported  
- toe first child  
- carcassH = h − toeH  
- doors use carcassH * 0.92  
- count matrix 2/3/4  

If all match → **do not edit product mesh code**.

- [ ] **Step 2: Run blast pack**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts `
  tests/unit/features/planner/open3d/modularPlaceMesh.test.ts `
  tests/unit/features/planner/asset-engine/meshStages.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\vitest-blast-raw.log
```

Expected: **PASS**. pair partCount/runtimeMeshChildren === 4; slab children include `toe`.

- [ ] **Step 3: Optional stages honesty bump**

If `mesh-g3-runtime-mesh` note still implies single-box modular only, update note string only:

```typescript
// stages.ts — mesh-g3 note (example honesty text)
note:
  "cabinet-v0 generateCabinetV0Mesh includes toe+carcass+door (W7 bar). " +
  "Non-modular furniture with W/D/H uses ParametricBuilder.generate3DMesh (entitySource parametric-box).",
```

Do not claim mesh-g3 `"implemented"` if non-modular residual still partial — honesty over vanity.

- [ ] **Step 4: Commit only if stages note changed**

```bash
git add site/features/planner/asset-engine/stages.ts
git commit -m "docs(planner): honesty note mesh-g3 cabinet-v0 toe+carcass+door (W7)"
```

If no code change: no commit required for Task 03.

#### Approach B — implement formulas (only if red)

- [ ] **Step B1: Minimal modularCabinetV0.ts implementation**

Full target implementation (must match §1.5):

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

- [ ] **Step B2: Mirror GlbExport part plans**

```typescript
// modularCabinetV0GlbExport.ts — critical imports and part builder
import {
  DOOR_THICKNESS_MM,
  TOE_HEIGHT_MM,
  TOE_INSET_MM,
  type ModularCabinetV0Options,
  countCabinetV0Parts,
  defaultCabinetV0Options,
  generateCabinetV0Footprint,
} from "./modularCabinetV0";

const MM = 0.001;

export function buildModularCabinetV0PartPlans(
  options: ModularCabinetV0Options,
): ModularCabinetV0PartPlan[] {
  const w = options.widthMm * MM;
  const d = options.depthMm * MM;
  const h = options.heightMm * MM;
  const toeH = TOE_HEIGHT_MM * MM;
  const inset = TOE_INSET_MM * MM;
  const carcassH = h - toeH;
  const doorT = DOOR_THICKNESS_MM * MM;
  const carcassY = toeH + carcassH / 2;

  const parts: ModularCabinetV0PartPlan[] = [
    {
      name: "toe",
      sizeM: { x: w, y: toeH, z: d - inset },
      positionM: { x: 0, y: toeH / 2, z: -inset / 2 },
    },
    {
      name: "carcass",
      sizeM: { x: w, y: carcassH, z: d },
      positionM: { x: 0, y: carcassY, z: 0 },
    },
  ];

  if (options.doorStyle === "slab") {
    parts.push({
      name: "door-slab",
      sizeM: { x: w * 0.96, y: carcassH * 0.92, z: doorT },
      positionM: { x: 0, y: carcassY, z: d / 2 + doorT / 2 },
    });
  } else if (options.doorStyle === "pair") {
    const leafW = w * 0.47;
    const leafH = carcassH * 0.92;
    const z = d / 2 + doorT / 2;
    parts.push(
      {
        name: "door-left",
        sizeM: { x: leafW, y: leafH, z: doorT },
        positionM: { x: -leafW / 2 - 0.005, y: carcassY, z },
      },
      {
        name: "door-right",
        sizeM: { x: leafW, y: leafH, z: doorT },
        positionM: { x: leafW / 2 + 0.005, y: carcassY, z },
      },
    );
  }

  return parts;
}
```

**Delete** any local `const DOOR_THICKNESS_MM = 18` in GlbExport if reintroduced.

- [ ] **Step B3: Update blast hard-codes**

In `createSceneObjectFromNode.test.ts` expect:

```typescript
expect(object.children).toHaveLength(3); // slab
// names include toe, carcass, door-slab

expect(object.children).toHaveLength(4); // pair
expect(object.children.map((c) => c.name)).toEqual([
  "toe",
  "carcass",
  "door-left",
  "door-right",
]);
```

In `meshStages.test.ts`:

```typescript
expect(result.runtimeMeshChildren).toBe(4);
expect(result.partCount).toBe(4);
```

- [ ] **Step B4: Align smoke script constants if they drifted**

`site/scripts/p08-cabinet-v0-visual-smoke.mjs` must keep:

```javascript
const TOE_HEIGHT_MM = 100;
const TOE_INSET_MM = 50;
const DOOR_THICKNESS_MM = 18;
```

and the same `buildParts()` formulas as GlbExport.

- [ ] **Step B5: Run primary + blast — expect PASS**

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
  Tee-Object -FilePath D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\vitest-raw.log
```

Expected: all PASS.

- [ ] **Step B6: Commit geometry slice**

```bash
git add site/features/planner/open3d/catalog/modularCabinetV0.ts `
  site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts `
  site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  site/tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts `
  site/tests/unit/features/planner/asset-engine/meshStages.test.ts `
  site/scripts/p08-cabinet-v0-visual-smoke.mjs
git commit -m "fix(planner): cabinet-v0 toe+carcass+door mesh quality (W7/P08)"
```

**Done when:** Units green (primary + blast); mesh multi-part with readable base; footprint outer path unchanged; GLB plan includes `toe`; height span ≈ SKU height.

---

### Task 04: Visual smoke (default headless — not unit-only theatre)

**Files / artifacts:**
- Run: `site/scripts/p08-cabinet-v0-visual-smoke.mjs`
- Create under evidence: `01-cabinet-v0-three-quarter.png`, `02-cabinet-v0-side.png`, `visual-smoke-meta.json`
- Create: `visual-smoke.md`

- [ ] **Step 1: Run frozen smoke command**

```powershell
cd D:\OandO07072026\site
node scripts/p08-cabinet-v0-visual-smoke.mjs --out D:/OandO07072026/results/planner/world-standard-wave/08-mesh-quality
```

Expected console (shape):

```text
wrote D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\01-cabinet-v0-three-quarter.png
wrote D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\02-cabinet-v0-side.png
parts toe → carcass → door-slab
```

If script throws `unexpected part order`, formulas drifted — return Task 03.

- [ ] **Step 2: Confirm PNGs on disk**

```powershell
Get-ChildItem D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\*.png |
  Select-Object Name, Length
```

Expected: both PNGs present, Length > 0 (typically multi-KB).

- [ ] **Step 3: Write visual-smoke.md (grade against NOTES)**

Create `results/planner/world-standard-wave/08-mesh-quality/visual-smoke.md`:

```markdown
# Visual smoke — cabinet-v0 (W7 / CP-08)

**Date:** YYYY-MM-DD  
**HEAD:** (from HEAD.txt)  
**Command:** `cd site && node scripts/p08-cabinet-v0-visual-smoke.mjs --out D:/OandO07072026/results/planner/world-standard-wave/08-mesh-quality`  
**Options:** 600×580×720 mm · doorStyle=slab · material=white  
**Renderer:** plan-formula SVG orthographic/isometric via sharp — **no designer GLB**, no browser.  
**Note:** PNG may include part name labels for QA; grade silhouette **as if labels hidden**.

## Checklist (NOTES pass criteria)

| # | Criterion | yes/no | Evidence (one sentence) |
|---|-----------|--------|-------------------------|
| 1 | Named parts toe, carcass, door-slab present | yes/no | meta partNames / PNG labels |
| 2 | Readable silhouette without depending on labels | yes/no | three-quarter: darker base band, body mass, front door plane |
| 3 | Height integrity plausible (toe not stacked overshoot) | yes/no | toe under carcass; total height band matches SKU proportions |
| 4 | Door does not cover toe | yes/no | door sits on carcass band only |
| 5 | No designer static GLB used | yes/no | script source = plan formulas only |
| 6 | Materials/parts distinct enough (toe darker / door face) | yes/no | fill hierarchy toe darker gray, carcass mid, door lighter |
| 7 | Residual honesty accepted | yes/no | no handles; flat slabs; not photoreal |

## Views

| File | Must see | Result |
|------|----------|--------|
| 01-cabinet-v0-three-quarter.png | toe band + carcass + door | pass/fail |
| 02-cabinet-v0-side.png | toe shallower Z (inset); door proud | pass/fail |

## Fail closed

If either view still reads as **one continuous box**, mark **visualSmoke=fail** and return to geometry — do **not** mark CP-08 green.

## Optional upgrade (not required)

Browser place of modular cabinet-v0 on open3d when P07 green — still not a substitute for these PNGs if missing.
```

Fill every yes/no honestly after opening both PNGs.

- [ ] **Step 4: Fail closed rule**

If checklist has any critical **no** on 2, 3, 4, or 5 → stop; fix mesh (Task 03 B) or smoke formulas; re-run. Do not invent photoreal materials to “make PNG pretty.”

- [ ] **Step 5: Commit smoke artifacts when checklist pass**

```bash
git add results/planner/world-standard-wave/08-mesh-quality/01-cabinet-v0-three-quarter.png `
  results/planner/world-standard-wave/08-mesh-quality/02-cabinet-v0-side.png `
  results/planner/world-standard-wave/08-mesh-quality/visual-smoke.md `
  results/planner/world-standard-wave/08-mesh-quality/visual-smoke-meta.json
git commit -m "test(planner): W7 cabinet-v0 headless visual smoke PNGs (P08)"
```

**Done when:** PNGs + `visual-smoke.md` exist; NOTES criteria ticked with visual reference; no static designer GLB used.

---

### Task 05: Non-regression mesh pipeline + policy + run.json

**Files:**
- Update: evidence logs + `run.json`
- Optional: stages honesty (if not done in Task 03)

- [ ] **Step 1: Run full non-reg pack**

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

Expected: all tests PASS; log ends without failed suites.

- [ ] **Step 2: Confirm policy still rejects designer static**

Quick greppable regression (must already be covered by unit tests):

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts -t "does not use designer" --reporter=verbose
```

Expected: PASS.

- [ ] **Step 3: Write run.json**

Create `results/planner/world-standard-wave/08-mesh-quality/run.json`:

```json
{
  "phase": "P08",
  "gate": "W7",
  "checkpoint": "CP-08",
  "date": "YYYY-MM-DD",
  "head": "<short sha from HEAD.txt>",
  "w7": "pass",
  "partNamesDefaultSlab": ["toe", "carcass", "door-slab"],
  "partCountMatrix": { "none": 2, "slab": 3, "pair": 4 },
  "vitestPassed": true,
  "visualSmoke": "pass",
  "policyNoDesignerGlb": true,
  "residualHonest": "no handles; simple materials; not photoreal; L2 only",
  "approach": "A-evidence-first",
  "smokeCommand": "node scripts/p08-cabinet-v0-visual-smoke.mjs --out results/planner/world-standard-wave/08-mesh-quality",
  "evidenceFolder": "results/planner/world-standard-wave/08-mesh-quality/",
  "notes": "Live mesh was L2 at execute; CP-08 closed via NOTES+units+smoke. Photoreal non-goal."
}
```

Rules:
- Set `"w7": "fail"` if any CP-08 row missing.
- Set `"visualSmoke": "fail"` if Task 04 checklist failed.
- Never set pass fields true without paths existing.

- [ ] **Step 4: Optional house pack**

If affordable:

```powershell
cd D:\OandO07072026\site
pnpm p0:g8
```

Not required to claim CP-08 if scoped non-reg green; document if skipped.

- [ ] **Step 5: Commit run.json + nonreg log**

```bash
git add results/planner/world-standard-wave/08-mesh-quality/run.json `
  results/planner/world-standard-wave/08-mesh-quality/vitest-nonreg-raw.log `
  results/planner/world-standard-wave/08-mesh-quality/vitest-raw.log
git commit -m "test(planner): W7 mesh quality vitest evidence + run.json (P08/CP-08)"
```

**Done when:** Export/place/mesh-stages unit path green; policy unbroken; run.json machine-readable and honest.

---

### Task 06: CP-08 closeout

- [ ] **Step 1: Evidence folder checklist**

| Artifact | Required | Present? |
|----------|----------|----------|
| `NOTES.md` | Yes | |
| `HEAD.txt` | Yes | |
| `vitest-raw.log` | Yes | |
| `vitest-nonreg-raw.log` | Preferred/Yes | |
| `01-cabinet-v0-three-quarter.png` | Yes | |
| `02-cabinet-v0-side.png` | Yes | |
| `visual-smoke.md` | Yes | |
| `run.json` | Yes | |
| `visual-smoke-meta.json` | Support | |

All required must be present on disk under:

`D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\`

- [ ] **Step 2: Self-grade CP-08 table**

| Check | Pass condition | Evidence path | Result |
|-------|----------------|---------------|--------|
| Bar doc | NOTES defines toe/door/carcass, locked name, numbers, fail modes | `…/NOTES.md` | pass/fail |
| Unit footprint | Outer W×D path stable | vitest log + footprint tests | pass/fail |
| Unit parts | Default slab toe+carcass+door; matrix 2/3/4; plan===mesh; height span | vitest log + GlbExport tests | pass/fail |
| Blast units | createSceneObjectFromNode + meshStages (+ place) green | nonreg log | pass/fail |
| Visual smoke | Human-readable parts on PNG; checklist yes; headless OK | PNGs + visual-smoke.md | pass/fail |
| No designer GLB | No new static product GLB; policy intact | code review + policy tests | pass/fail |
| Height integrity | Total height = options.heightMm | Box3 unit | pass/fail |
| Honest residual | NOTES lists non-photoreal residuals | NOTES residual section | pass/fail |

**CP-08 green only if every required row has a path and pass.**  
**Missing screenshot = red even if units green.**

- [ ] **Step 3: Closeout commit if any doc-only deltas remain**

```bash
git add results/planner/world-standard-wave/08-mesh-quality/
git commit -m "test(planner): W7 mesh quality evidence pack closeout (P08/CP-08)"
```

- [ ] **Step 4: Report to owner (honest)**

Report shape:

```text
P08/W7 CP-08: pass|fail
Evidence: results/planner/world-standard-wave/08-mesh-quality/
Mesh: L2 toe→carcass→door (already in tree | fixed this session)
Visual: headless plan smoke PNGs graded
Residual: no handles; simple materials; not photoreal
Did NOT claim: world-standard product complete; W1–W6/W8
Next: P09 shortcuts/chrome (W8) → evidence 09-shortcuts-chrome/ only
```

- [ ] **Step 5: Push/mirror per AGENTS (agent call)**

When landable and green enough: push `main` to origin; mayoite mirror if ~45m / big land. Never force-push.

**Done when:** CP-08 table fully evidenced; residual stated; no overclaim.

---

### Task 07 (optional): Layout check — evidence root legal

- [ ] **Step 1: Run layout guard if available**

```powershell
cd D:\OandO07072026
pnpm run check:layout
```

Expected: no failure for writing under root `results/` (correct). Fail if someone put evidence under `site/results/`.

If script missing or unrelated fails, do not block CP-08 mesh content — but **never** move artifacts into `site/results/`.

---

## 7. Test matrix

| Layer | Path | Assert | Command | Expected |
|-------|------|--------|---------|----------|
| Unit primary | `modularCabinetV0.test.ts` | names, matrix, toe geom, carcass on toe, door above toe, Box3, materials, footprint | vitest run (Task 00/02) | PASS |
| Unit primary | `modularCabinetV0GlbExport.test.ts` | plan===mesh, path policy, matrix 2/3/4 | same | PASS |
| Unit primary | `resolveFurniture2DFootprint.test.ts` | outer envelope modular | same | PASS |
| Blast | `createSceneObjectFromNode.test.ts` | slab 3 + toe; pair 4 | nonreg | PASS |
| Blast | `modularPlaceMesh.test.ts` | children length = count helper | nonreg | PASS |
| Blast | `meshStages.test.ts` | pair partCount/runtimeMeshChildren 4; G5 bytes | nonreg | PASS |
| Visual | `p08-cabinet-v0-visual-smoke.mjs` | PNGs + part order throw | node script | wrote 2 PNGs |
| Human grade | `visual-smoke.md` | NOTES checklist | open PNGs | all critical yes |
| Policy | GlbExport / glbAssetPolicy | no designer static | unit | PASS |
| Layout | `check:layout` | root results only | pnpm | PASS / non-block if unrelated |

---

## 8. False-green catalog

| ID | Trap | Why false | Plan block |
|----|------|-----------|------------|
| FG1 | Units green without PNG | CP-08 requires visual | Task 04 + closeout table |
| FG2 | Units green without NOTES | Gate is bar doc + visual | Task 01 |
| FG3 | “Mesh OK” from historical modular-* folder | RESULTS-MAP forbids as CP-08 home | sole `08-mesh-quality/` |
| FG4 | Photoreal PNG of unrelated product | ethics + wrong surface | smoke script only |
| FG5 | Designer static GLB pretty shot | policy fail | policy tests + smoke path |
| FG6 | Full-height door after toe | unreadable kick | door bottom ≥ toe unit |
| FG7 | Toe additive height | BOQ height lie | Box3 span unit |
| FG8 | plan without toe, mesh with toe | export lies | plan===mesh unit |
| FG9 | Alias rename plinth | contract break | locked name `toe` |
| FG10 | Workstation smoke as W7 | wrong SKU | cabinet-v0 only |
| FG11 | R3F rewrite for pretty | thrash / wrong path | out of scope |
| FG12 | Trust stale plan “no toe” thrash | re-break green mesh | Task 00 re-proof |
| FG13 | Labels-only readability | buyer doesn't read names | grade as labels hidden |
| FG14 | Research mesh score 1 after L2 code | outdated mental model | repo re-proof |
| FG15 | Claim W1–W8 from P08 | wrong gates | residual + report step |
| FG16 | Evidence under `site/results/` | layout law | root `results/` only |
| FG17 | Dual `08-shortcuts-chrome/` as mesh | folder lock | mesh sole `08-mesh-quality/` |

---

## 9. Stop-if-fail / CP-08 criteria

### 9.1 Hard stops

Stop and do not claim green if:

1. Any required evidence artifact missing.  
2. Visual smoke still one continuous box.  
3. Box3 height integrity fails.  
4. plan !== mesh.  
5. Designer static GLB introduced or used as proof.  
6. Footprint outer envelope regresses.  
7. Part name is not exactly `toe` for kick band.  

### 9.2 Soft stops (owner / process)

- P07 browser journey red does **not** stop CP-08.  
- mesh-g8 partial does **not** stop CP-08.  
- Photoreal residual is **expected**, not a fail.

### 9.3 CP-08 gate table (copy for run.json alignment)

See Task 06 Step 2. Green only with path per row.

---

## 10. Commit sequence

| Order | When | Message shape |
|------:|------|---------------|
| 1 | After Task 01 NOTES | `docs(planner): W7 mesh quality bar NOTES for cabinet-v0 (P08)` |
| 2 | After Task 03 B geometry (if needed) | `fix(planner): cabinet-v0 toe+carcass+door mesh quality (W7/P08)` |
| 3 | After Task 03 stages note only | `docs(planner): honesty note mesh-g3 cabinet-v0 toe+carcass+door (W7)` |
| 4 | After Task 04 smoke | `test(planner): W7 cabinet-v0 headless visual smoke PNGs (P08)` |
| 5 | After Task 05 logs/run.json | `test(planner): W7 mesh quality vitest evidence + run.json (P08/CP-08)` |
| 6 | After Task 06 closeout deltas | `test(planner): W7 mesh quality evidence pack closeout (P08/CP-08)` |

Approach A typical path: commits 1, 4, 5, 6 (no feat commit).  
Approach B: include commit 2 (and blast tests) before smoke.

Commit as you go. No worktrees. Push/mirror per AGENTS when landable.

---

## 11. Risks & owner decisions

### 11.1 Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Agent re-implements mesh from stale plan honesty | High | Task 00 grep; Approach A default |
| Smoke script formulas drift from mesh | Medium | Keep constants aligned; plan===mesh units are source of truth; smoke reimplements for Node purity |
| PNG labels create false confidence | Medium | Grade as labels hidden |
| Agent adds PBR to “fix” boxy residual | Medium | Non-goal + residual section |
| Evidence written under wrong folder | Medium | RESULTS-MAP lock; Task 07 |
| Scarce agent slots thrash mesh while spine red | Process | Evidence pack is cheap; don't starve W3 journey if parallel |
| Sharp missing in env | Low | already used in site; install from root pnpm if needed |
| Claiming world product ship from L2 | High ego trap | Task 06 report residual |

### 11.2 Owner decisions (already frozen — do not re-ask)

| Decision | Value |
|----------|-------|
| Kick part name | `toe` |
| Constants | 100 / 50 / 18 |
| Visual default | headless (P07 optional) |
| Evidence folder | `08-mesh-quality/` only |
| Photoreal | non-goal |
| Designer static GLB | banned as primary path |
| Approach | A unless drift |

### 11.3 Out of scope (do not “helpfully” expand)

- Dumping/wiring designer static GLBs from `public/`  
- Writing mesh assets under `site/public/**` product trees for this phase  
- Full parametric library beyond cabinet-v0  
- Photoreal PBR packs / HDRI environments  
- Claiming W1–W6/W8 from this phase  
- Skipping NOTES because tests pass  
- Depending on P07 browser green to close CP-08  
- Firecrawl re-scrape  
- R3F rewrite of open3d viewer  

---

## 12. Self-review vs brainstormer + repo

### 12.1 Repo coverage

| Repo path from Phase 1 | In task? |
|------------------------|----------|
| modularCabinetV0.ts | Task 00/03 |
| modularCabinetV0GlbExport.ts | Task 00/03 |
| createSceneObjectFromNode.ts | Task 00 read; blast tests Task 03/05 |
| exportModularGlbBinary / meshStages | Task 05 |
| glbAssetPolicy | Task 05 |
| stages.ts | Task 03 optional |
| p08-cabinet-v0-visual-smoke.mjs | Task 04 |
| All primary + blast unit files | Tasks 00–05 |
| evidence `08-mesh-quality/` | Tasks 00–06 |

### 12.2 Brainstormer coverage (Idiots REPORT)

| Idiots major item | Plan location |
|-------------------|---------------|
| Code ahead of evidence | §1 + Approach A |
| NOTES contract | Task 01 full content |
| Formulas / height integrity | §1.5 + Task 02/03 |
| plan===mesh | Task 02/03 + matrix |
| Photoreal non-goal | §3, NOTES residual, FG4 |
| Competitive ideas only | §2.3 + §3 |
| Blast inventory | §7 + Task 05 |
| False-reverse table | §8 |
| CP-08 table | Task 06 |
| Smoke command | Task 04 (existing script) |
| run.json schema | Task 05 |
| Residual L2 honesty | NOTES + spectrum §1.10 |
| Anti-alias dictionary | Appendix G |
| Agent split max 2 | Appendix H |

No major Idiots bar/failure mode left as “see report” without inlining.

### 12.3 Placeholder scan

No TBD / TODO / “similar to Task N” / empty code steps intentionally left. Approach B includes full implementation source. Approach A documents green proof path without fake red theater.

### 12.4 Type consistency

| Symbol | Definition site |
|--------|-----------------|
| `ModularCabinetV0Options` | modularCabinetV0.ts |
| `CabinetDoorStyle` | modularCabinetV0.ts |
| `ModularCabinetV0PartPlan` | modularCabinetV0GlbExport.ts |
| `TOE_HEIGHT_MM` / `TOE_INSET_MM` / `DOOR_THICKNESS_MM` | modularCabinetV0.ts export |
| `countCabinetV0Parts` | modularCabinetV0.ts |

### 12.5 Length honesty

This plan is long because: (1) repo already L2 but gate incomplete, (2) both Approach A and B must be executable without invention, (3) NOTES/smoke/run.json must be copy-paste complete, (4) false-green catalog is load-bearing for W7. Not padded with unrelated SKUs.

---

## 13. Appendices

### Appendix A — Type / signature catalog

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

export const TOE_HEIGHT_MM: 100;
export const TOE_INSET_MM: 50;
export const DOOR_THICKNESS_MM: 18;

export function defaultCabinetV0Options(
  partial?: Partial<ModularCabinetV0Options>,
): ModularCabinetV0Options;

export function generateCabinetV0Footprint(
  options: ModularCabinetV0Options,
): string;

export function generateCabinetV0Mesh(
  options: ModularCabinetV0Options,
): THREE.Group;

export function countCabinetV0Parts(
  options: ModularCabinetV0Options,
): number; // 2 | 3 | 4

export interface ModularCabinetV0PartPlan {
  name: string;
  sizeM: { x: number; y: number; z: number };
  positionM: { x: number; y: number; z: number };
}

export function buildModularCabinetV0PartPlans(
  options: ModularCabinetV0Options,
): ModularCabinetV0PartPlan[];

export function buildModularCabinetV0GlbPlan(
  optionsInput?: Partial<ModularCabinetV0Options>,
): ModularCabinetV0GlbPlan;

export function modularCabinetV0GeneratedRelativePath(
  options: ModularCabinetV0Options,
): string; // catalog-assets/generated/modular-cabinet-v0-…glb
```

### Appendix B — Anti-alias dictionary (child names)

| Forbidden | Required |
|-----------|----------|
| plinth | `toe` |
| toe-kick | `toe` |
| kick | `toe` |
| base (as kick) | `toe` |
| body / cabinet | `carcass` |
| front / panel | `door-slab` or pair names |
| door (ambiguous alone) | `door-slab` / `door-left` / `door-right` |

### Appendix C — Research translation table (ideas → O&O)

| Research idea | O&O action in P08 |
|---------------|-------------------|
| Manufacturer SKU depth (IKEA-class) | cabinet-v0 options → real mm envelope + modular parts |
| BOQ/quote > photoreal | NOTES metric hierarchy; residual honesty |
| Mesh is content/LOD not engine switch | keep procedural modularCabinetV0; no thrash |
| Multi-part recognition | toe/carcass/door silhouette |
| Fixed-size honesty | outer footprint path stable |
| Homestyler mesh score | refuse as W7 driver |
| Systems manufacturer path | generate-first, not free GLB dump |

### Appendix D — Evidence folder contract

Canonical only:

`D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\`

**Forbidden for this gate:** `07-mesh-quality/`, `09-mesh-*`, historical `modular-*` as CP-08 home, `site/results/`, `site/test-results/`, P09 `08-shortcuts-chrome/` confusion (W8 is `09-shortcuts-chrome/`).

### Appendix E — Related phase boundaries

| Phase | Boundary |
|-------|----------|
| P01 | what place/mesh path is |
| P02 | Three family; BOQ>photoreal |
| P04 | orbit/viewability of mesh |
| P05 | 2D Block2D symbols (not 3D toe) |
| P07 | browser place optional fidelity |
| P09 | chrome; never store mesh evidence under shortcuts folders |
| P10 | index W7 path sole `08-mesh-quality/` |

### Appendix F — Agent split (optional, max 2)

| Agent | Owns | Must not |
|-------|------|----------|
| A — TDD / verify mesh | Tasks 00, 02–03, 05 units | browser chrome; other SKUs; public GLB |
| B — NOTES + visual | Tasks 01, 04, 06 packaging | rewrite mesh without re-running A units |

Both: `/using-superpowers`; TDD when geometry changes; verification-before-completion; no worktrees; no competitor assets.

### Appendix G — Skills at execute time

| Skill | When |
|-------|------|
| `/using-superpowers` | Always |
| `test-driven-development` | Approach B geometry; any failing unit |
| `verification-before-completion` | Before claiming CP-08 green |
| `systematic-debugging` | Only if green fails for geometry/policy reasons |
| `executing-plans` / `subagent-driven-development` | Execution mode after this plan |

### Appendix H — Primary file absolute paths (touch list)

```text
D:\OandO07072026\site\features\planner\open3d\catalog\modularCabinetV0.ts
D:\OandO07072026\site\features\planner\open3d\catalog\modularCabinetV0GlbExport.ts
D:\OandO07072026\site\features\planner\open3d\3d\createSceneObjectFromNode.ts
D:\OandO07072026\site\features\planner\asset-engine\mesh\exportModularGlbBinary.ts
D:\OandO07072026\site\features\planner\asset-engine\mesh\runMeshStages.ts
D:\OandO07072026\site\features\planner\asset-engine\stages.ts
D:\OandO07072026\site\features\planner\lib\glbAssetPolicy.ts
D:\OandO07072026\site\scripts\p08-cabinet-v0-visual-smoke.mjs
D:\OandO07072026\site\tests\unit\features\planner\open3d\modularCabinetV0.test.ts
D:\OandO07072026\site\tests\unit\features\planner\open3d\modularCabinetV0GlbExport.test.ts
D:\OandO07072026\site\tests\unit\features\planner\open3d\resolveFurniture2DFootprint.test.ts
D:\OandO07072026\site\tests\unit\features\planner\open3d\createSceneObjectFromNode.test.ts
D:\OandO07072026\site\tests\unit\features\planner\open3d\modularPlaceMesh.test.ts
D:\OandO07072026\site\tests\unit\features\planner\asset-engine\meshStages.test.ts
D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\
```

### Appendix I — Phase plan sources (authority)

```text
D:\OandO07072026\Plans\phases\P08-mesh-quality\P08-mesh-quality.md
D:\OandO07072026\Plans\phases\P08-mesh-quality\P08-suggestions.md
D:\OandO07072026\Plans\phases\P08-mesh-quality\03-r3f-3d.md
D:\OandO07072026\Plans\phases\EXPERT-PASS.md
D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md
D:\OandO07072026\Plans\Research\RESULTS-MAP.md
D:\OandO07072026\Idiots\P08-mesh-quality\REPORT.md
```

Note: phase execute card still cites historical path `Plans/trustdata/…` in DoD prose — live tree is `Plans/phases/P08-mesh-quality/`. Follow **live** tree.

### Appendix J — Head-agent one-pager

```text
P08/W7 = cabinet-v0 readable toe→carcass→door; height integrity; plan===mesh;
constants TOE 100 / INSET 50 / DOOR 18 from modularCabinetV0 only;
photoreal non-goal; BOQ>pretty; evidence only 08-mesh-quality/;
live mesh already L2 — close NOTES+smoke+run.json (Approach A);
blast tests 2/3/4; no designer GLB; residual: no handles/not photoreal;
fallback Approach B only on formula drift.
```

### Appendix K — Definition of done (phase)

P08 is done when:

1. This implementation plan (or phase execute card) was followed with checkboxes during execution.  
2. Cabinet-v0 mesh exposes **`toe` + `carcass` + door** (readable), exact names and order.  
3. Unit footprint + parts + height integrity green under evidence (primary + blast).  
4. Visual smoke PNGs graded against NOTES (headless default OK).  
5. **CP-08** table fully evidenced under `results/planner/world-standard-wave/08-mesh-quality/`.  
6. No designer static GLB introduced.  
7. Residual honesty written; no world-product overclaim.

**Next phase after CP-08:** P09 shortcuts/chrome (**W8**), unless owner reorders. Evidence for P09 is `09-shortcuts-chrome/` (not `08-*` — mesh alone owns `08-mesh-quality/`).

### Appendix L — What this planner deliberately did not do

- No product code edits in this deliverable.  
- No evidence PNG generation during planning.  
- No Idiots2 consumption (owner locked Idiots only).  
- No claim that CP-08 is green today.  
- No expansion into workstation library or photoreal materials.  
- No inventing a second smoke renderer when `p08-cabinet-v0-visual-smoke.mjs` already exists.

---

## Execution handoff

**Plan complete and saved to `plans2/P08-mesh-quality/IMPLEMENTATION-PLAN.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

**Which approach?**

---

*End of idiotplanners2 P08 implementation plan. Input: live repo first + Idiots/P08-mesh-quality/REPORT.md only. No length cap applied.*
