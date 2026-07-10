# P05 — Symbols / SVG Honesty (W2 symbol half · CP-05) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** Re-prove (and only then extend) open3d plan-view furniture symbols so **cabinet-v0 is manufacturer-readable** on FeasibilityCanvas via original **Block2D prims**, and permanently document that **Block2D = canvas authority today · admin/CLI SVG = publish only** — without competitor assets, Fabric flag-ON theater, or claiming portal `/svg-catalog` proves plan symbols.

**Architecture:** FeasibilityCanvas (flag OFF) draws placed furniture with `furnitureBlock2DFromItem` → top-left prims → `renderBlock2DCentered`. Modular cabinet-v0 is multi-prim (carcass, inner, front/back, doorStyle cues). Inventory thumbnails may use the same Block2D → `blockToSvg` (DOM only). Publish path is `compileSvgForPublish` → `public/svg-catalog/{slug}.svg` and is **not** the Feasibility draw path. Fabric furniture layer (default OFF) is destination spike — plain Rects are **not** W2.

**Tech Stack:** TypeScript · Vitest · Canvas 2D · Block2D (`blocks2d` prim vocabulary) · modular-cabinet-v0 · asset-engine SVG pipeline (`svgo` / pipelineCore) · optional Playwright · evidence under repo-root `results/planner/world-standard-wave/05-symbols-svg/`.

**Inputs consumed:**
- Repo read: 2026-07-10 — workspace `D:\OandO07072026` (tree dirty possible; `results/` **absent** at root → historical CP-05 PASS is **unproven in this checkout**)
- Brainstormer: `Idiots2/P05-symbols-svg/REPORT.md` only (never `Idiots/`)
- Phase plan: `Plans/phases/P05-symbols-svg/` (execute card + appendix + suggestions + 02-canvas-2d)
- Research index: `Plans/Research/RESULTS-MAP.md` · `Plans/Research/RESEARCH-MAP.md` · `Plans/INDEX.md`

**Done when:**
1. Vitest green for cabinet-v0 Block2D suite + `renderBlock2DToCanvas` suite (unfiltered logs under evidence root).
2. cabinet-v0 is **not** empty-box: ≥4 prims; front ≠ back; doorStyle `pair` ≠ `slab` ≠ `none`; light surface fill (not inverse-body blob).
3. `furnitureBlockUsesCenteredPath` always `false`.
4. Unknown SKU never yields empty prims.
5. Honesty NOTES + asset-engine README refuse false SVG-as-canvas claims.
6. Visual: prim-JSON and/or Playwright PNG prove multi-prim readability (not unit count alone).
7. CP-05.json + SUMMARY.md written with split `symbolQuality` vs `svgHonestySmoke`.
8. No competitor SVG/JS/GLB; no Fabric flag-ON used as W2 proof; no Feasibility load of `/svg-catalog/*.svg`.

**Evidence folder:** `results/planner/world-standard-wave/05-symbols-svg/`  
(create on execute; **re-prove if missing** — it is missing today)

**Canonical save path for this plan:** `plans1/P05-symbols-svg/IMPLEMENTATION-PLAN.md`

---

## 1. Repo reality (live 2026-07-10)

### 1.1 Product code already raised (do not thrash)

Live `site/features/planner/open3d/catalog/furnitureBlock2D.ts` is **already past** the historical 2-prim empty-box bar:

| Fact | Live truth |
|------|------------|
| `modularCabinetBlock` | Multi-prim: outer carcass + inner rect + front line + back line + doorStyle branches (pair stile + dual handles / slab single offset handle / none open-shelf dashes) |
| Fill contrast | Outer uses `BLOCK_STYLE.surface` (light) + `glyphDark` detail — **not** `BLOCK_STYLE.storage` inverse-body blob |
| Prim origin | Top-left `(0..L, 0..D)`; canvas centers via `renderBlock2DCentered` |
| `furnitureBlockUsesCenteredPath` | **Always returns `false`** with honest JSDoc |
| Unknown SKU path | `furnitureBlock2DFromItem` falls through bridge → generic → `boxBlock` (≥1 rect) |
| Feasibility wire | `FeasibilityCanvas.tsx` ~583–630: `layerVisibility.furniture` → `furnitureBlock2DFromItem` → `renderBlock2DCentered` with `createCanvasBlockColorResolver` |
| SVG honesty README | `site/features/planner/asset-engine/README.md` has **Canvas vs publish SVG (P05 honesty)** section |
| Publish path | `compileSvgForPublish` + admin `publishDescriptorWithPipeline`; public files under `site/public/svg-catalog/` (`chaise-lounge-001`, `sectional-sofa-001`, `side-table-001`, fallback) — **no cabinet-v0 SVG as plan authority** |

### 1.2 Tests already present (strong unit bar)

| File | Live cases (approx) |
|------|---------------------|
| `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts` | **13** cases: footprint, modularOptions prefer, ≥4 prims, outer carcass, light fill lock, bounds, front>back, pair stile vs slab, handle counts, doorStyle none shelves, centeredPath false, canvas fill+stroke, no external URL |
| `site/tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts` | stroke floor helper; rect paint; centered translate; demo-desk; modular basic; contrast; unknown SKU nonempty + canvas fill; equipment unknown; degenerate dims clamp |
| E2E (related, not CP-05 alone) | `site/tests/e2e/open3d-mesh-symbol-live-verify.spec.ts` places cabinet-v0 + zoom diversity probe — evidence path `results/planner/benchmark-quality/mesh-symbol/` (different folder; **not** substitute for `05-symbols-svg/`) |

### 1.3 Contradictions (plan claims vs code vs evidence)

| Source claim | Live repo | Verdict for this plan |
|--------------|-----------|------------------------|
| Phase card: CP-05 **PASS** 2026-07-09 | `results/` **missing** at repo root | **Unproven** — re-prove; do not paper-green |
| `02-canvas-2d.md` / appendix baseline: modular ≈ **2 prims** | Live modular is multi-prim ≥4 | **Stale expert prose** — code wins |
| Phase card: create cabinet-v0 test file | File **exists** and is richer than appendix skeleton | Prefer live tests; only add if gap |
| Phase card: fix centeredPath true→false | Already `false` | Verify + keep regression lock |
| Expert S2: slab must not share pair stile | Live slab has **no** mid stile; single offset handle | Satisfied in code + tests |
| Appendix Task 2 skeleton uses `BLOCK_STYLE.storage` fill | Live uses **surface** (contrast root-cause fix) | **Do not** re-apply storage fill — would re-blob |
| Historical “SVG catalog proves plan symbols” | Feasibility never loads `/svg-catalog` for furniture draw | Honesty still required in NOTES every CP |

### 1.4 Missing evidence (hard)

```
D:\OandO07072026\results   → does not exist
```

Per `AGENTS.md` + `RESULTS-MAP.md` + Idiots2 §10.1 / §16:  
**Any PASS claim without live artifacts under root `results/` is invalid for this checkout.**  
Execute must create `results/planner/world-standard-wave/05-symbols-svg/` and fill slices.

### 1.5 Authority graph (repo-verified)

```
Path B (AUTHORITY FOR W2 PLAN SYMBOLS TODAY)
  Open3dFurnitureItem
    → furnitureBlock2DFromItem(item)
         ├── geometryMode === "modular-cabinet-v0" → modularCabinetBlock
         ├── workstation config key → workstationBlock2DFromItem
         ├── resolveCatalogItemBlock2D (buddy bridge) → scale if needed
         ├── buildGenericBlock2D
         └── boxBlock fallback
    → FeasibilityCanvas: translate(center) · rotate · scale(transform.scale)
    → renderBlock2DCentered(ctx, block, { resolve: createCanvasBlockColorResolver })

Path A (inventory preview only — not W2 authority)
  CatalogItem → resolveCatalogItemBlock2D → blockToSvg → sanitize → DOM

Path C (publish only — not Feasibility draw)
  Descriptor → compileSvgForPublish → public/svg-catalog/{slug}.svg → /portal/svg-catalog

NOT authority
  generateCabinetV0Footprint  → centered SVG path string for mesh/helper
  FurnitureFabricLayer Rects → flag ON only; plain Rect ≠ Block2D
  Competitor CDN SVG / sprites
```

### 1.6 Related types (live)

```typescript
// site/features/planner/open3d/model/types.ts
export type Open3dFurnitureGeometryMode =
  | "box"
  | "modular-cabinet-v0"
  | "workstation-v0";

export interface Open3dModularCabinetV0Options {
  widthMm: number;
  depthMm: number;
  heightMm: number;
  doorStyle: "none" | "slab" | "pair";
  material: "oak" | "white";
}
```

### 1.7 Fabric flag (must stay OFF for proof)

- `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE === "1"` only enables flag (`fabricFurnitureFlag.ts`).
- ON: OOPlannerWorkspace forces furniture layer off on Feasibility and mounts `FurnitureFabricLayer` (plain Rects).
- **W2 symbol proof = flag OFF.** Screenshots with flag ON are false-green for symbol quality.

### 1.8 Stroke floor (already shipped)

`resolveCanvasStrokeWidthMm` floors thin mm strokes under plan zoom (~0.1) so multi-prim detail stays visible. Covered in unit tests. Do not remove.

---

## 2. Brainstormer synthesis (`Idiots2/P05-symbols-svg/REPORT.md`)

### 2.1 Single most important fact

O&O has **three SVG/symbol worlds**. Confusing them is the root bug class of P05:

| World | Authority for plan symbols today? |
|-------|-----------------------------------|
| A. Inventory DOM SVG (`blockToSvg`) | **No** — preview |
| B. Live plan Canvas Block2D prims | **YES — W2 / CP-05** |
| C. Publish disk SVG (`compileSvgForPublish`) | **No for Feasibility** |

**W2 ≠ “load SVG onto FeasibilityCanvas.”**  
**W2 =** placed furniture (esp. cabinet-v0) is **readable as a product** via original Block2D.

### 2.2 Buyer / JTBD (acceptance language)

Dealer/designer must answer on plan:

1. What object? (cabinet vs desk vs chair-class)  
2. Which way is front?  
3. How big relative to room (true mm)?  
4. Does doorStyle change the mark?  
5. Does inventory tile identity match plan mark idea?

Semi-transparent empty rectangle = **W2 fail** even if place/select/save work.

### 2.3 Raised bar (stronger than process PASS)

| Bar item | Why stronger than “unit count ≥4” |
|----------|-----------------------------------|
| Light fill + dark detail | Opaque storage fill makes multi-prim unreadable (blob) |
| Front line deeper (+Y) than back | Orientation for wall docking |
| pair mid stile; slab **zero** mid stile | doorStyle must **actually** differ |
| pair dual handles; slab single offset | Geometry not theater |
| none = shelf dashes, zero handles | Third distinct language |
| Prim-JSON or PNG visual | Unit alone can green weak geometry |
| Honesty NOTES refuse 8 false claims | Prevents SVG/portal false marketing |
| Fabric flag OFF | Rect overlay is not Block2D proof |
| Evidence on disk | Markdown PASS without `results/` is paper |

### 2.4 Approaches — choice

| ID | Approach | Decision |
|----|----------|----------|
| **1** | Shared Block2D prim → Canvas (`renderBlock2DToCanvas`) | **CHOSEN** (live + ENGINE-DECISION) |
| 2 | Rasterize SVG string → `drawImage` | Defer; only if prims become unmanageable |
| 3 | Load published `/svg-catalog` into plan | **Future S7-class only** — new goal, not P05 |
| 4 | Fabric objects from prims | Post-W destination; flag-ON today is Rect regression |

### 2.5 Failure modes → plan controls

| Failure | Plan control |
|---------|--------------|
| Unit green, browser still boxes | Visual prim-JSON + optional Playwright; P07 owns place journey half |
| SVG smoke green claimed as W2 | Gate split in CP-05.json |
| Weak ≥4 garbage lines | Stile/handle/front-back/fill contrast tests |
| Competitor path paste | Ethics + string/URL assertions + review |
| CSS vars invisible on canvas | `createCanvasBlockColorResolver` + resolve mocks in unit |
| Inventory rich / canvas poor | Single Block2D truth discipline |
| Paper PASS | Mandatory evidence tree recreate |
| Flag-ON screenshots | Policy + NOTES forbid |
| Re-apply storage fill “from appendix” | Repo wins — surface fill locked by tests |
| Confuse `generateCabinetV0Footprint` with Block2D | Explicit out-of-scope; mesh helper only |

### 2.6 Open questions (do **not** expand P05)

1. When (if ever) published svg-catalog becomes place authority → **goal change**  
2. Every SKU authored Block2D vs family generators → post-W roadmap  
3. Print PDF min-stroke policy → later  
4. Wall-mounted symbol language → later  
5. Multi-select compound symbols → later  
6. BOQ PDF legend icons from Block2D → later  

### 2.7 Conflict rule applied

| Topic | Winner |
|-------|--------|
| What code does today | **Repo** |
| Prim count baseline “2” in old expert docs | **Repo** (already multi-prim) |
| Intent/bar/failure modes/honesty | **Idiots2** (when repo silent on bar) |
| Competitor copy | **Forbidden** (ethics packs + phase) |

---

## 3. Ethics / non-copy

**Allowed:** study industry **behavior** (catalog → place → readable plan mark); invent original O&O prim geometry; use packages already in tree; Phosphor for **UI chrome** only.

**Forbidden:** competitor minified JS, GLBs, textures, sprite sheets, pixel-cloned chrome, hand-pasted competitor path `d=` into modularCabinetBlock, authenticated editor inventory scrape.

**Phase line:** Original O&O prims only. MIT packages already in tree only. Unit test forbids external URL / `.glb` / `.svg` / `svg-catalog` in plan-symbol generation payload.

Research under `D:\websites` = **ideas only** — never paste into `site/`.

---

## 4. File map

### 4.1 Read-only (authority proof — touch only if broken)

| Path | Role |
|------|------|
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Path B wire (~583–630) |
| `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` | Flag OFF default |
| `site/features/planner/open3d/canvas-fabric-stage/FurnitureFabricLayer.tsx` | Rect overlay — not W2 |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Flag wire |
| `site/features/planner/open3d/catalog/modularCabinetV0.ts` | `generateCabinetV0Footprint` mesh helper (not canvas) |
| `site/features/planner/asset-engine/svg/compileSvgForPublish.ts` | Publish entry |
| `site/features/planner/admin/svg-editor/publishDescriptorWithPipeline.ts` | Admin publish wire |
| `site/public/svg-catalog/*.svg` | Published assets only |
| `site/lib/catalog/blocks2d.ts` | `BLOCK_STYLE`, `Prim`, `blockToSvg`, generics |

### 4.2 Modify only if tests fail or honesty gap found

| Path | Expected change |
|------|-----------------|
| `site/features/planner/open3d/catalog/furnitureBlock2D.ts` | **Prefer no thrash** — restore only if RED |
| `site/lib/catalog/renderBlock2DToCanvas.ts` | Prefer no thrash; stroke floor already present |
| `site/features/planner/asset-engine/README.md` | Verify honesty section present; append only if missing |

### 4.3 Tests (run always; extend only for residual gaps)

| Path | Role |
|------|------|
| `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts` | **W2 unit home** |
| `site/tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts` | Paint + unknown SKU + contrast |
| Optional new: `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.authority-honesty.test.ts` | Grep/static authority locks (only if not covered) |

### 4.4 Evidence (create)

```
results/planner/world-standard-wave/05-symbols-svg/
  00-baseline/
  01-unit-reprove/
  02-green/              # or alias NOTES if unit already green
  03-nonempty/
  04-svg-honesty/
  05-visual/
  06-cp-pack/
  CP-05-vitest-raw.log
  CP-05.json
  SUMMARY.md
  NOTES.md               # optional root pointer
```

### 4.5 Out of scope paths (do not edit for P05)

- Mesh beauty / toe / door 3D → P08 (`modularCabinetV0` mesh only if accidental)  
- Browser place ≥2 journey → P07  
- Fabric full-stage cutover  
- SVGR / CDN SVG consume  
- Konva hybrid  
- Competitor scrapes  

---

## 5. Architecture & data flow

### 5.1 Place → paint (happy path)

```
User places cabinet-v0 (geometryMode modular-cabinet-v0 + modularOptions)
  → document furniture entity on activeFloor.furniture[]
  → FeasibilityCanvas paint loop (layerVisibility.furniture === true)
  → projectToScreen(item.position)
  → furnitureBlock2DFromItem(item)
       modularCabinetBlock:
         footprint from modularOptions (prefer) else item dims
         prims top-left mm
  → ctx.translate(center); rotate; scale(transform.scale)
  → optional item.color wash under symbol
  → renderBlock2DCentered(ctx, block, { resolve: colorResolve, skipShadow if tiny scale })
  → selection dashed rect if selected
```

### 5.2 Coordinate contract

| Layer | Convention |
|-------|------------|
| Prim authorship | Top-left of footprint, mm, `x∈[0,L]`, `y∈[0,D]` |
| Furniture `position` | Plan **center** in document mm |
| `renderBlock2DCentered` | `translate(-L/2, -D/2)` then top-left paint |
| Front of cabinet | Larger Y (`frontY = d - inset`) |
| Back | Smaller Y (`inset`) |
| Plan scale | Often ~0.05–0.15 → stroke floor required |

### 5.3 doorStyle geometry contract

| doorStyle | Required geometry |
|-----------|-------------------|
| `pair` | Mid vertical stile at `w*0.5` (x0≈x1≈mid); **two** small handle rects |
| `slab` | **Zero** mid vertical stile; **one** handle offset from mid-X |
| `none` | **Zero** mid stile; **zero** handles; ≥2 dashed horizontal shelf lines |

### 5.4 Contrast contract

| Element | Token family |
|---------|--------------|
| Outer carcass fill | `var(--block-surface)` / `BLOCK_STYLE.surface` |
| Outer stroke | `BLOCK_STYLE.surfaceStroke` |
| Detail lines / handles | `BLOCK_STYLE.glyphDark` |
| **Forbidden outer** | `block-storage`, `text-inverse-body` as solid carcass |

### 5.5 Publish path (honesty only)

```
Descriptor JSON
  → compileSvgForPublish (S1–S3, no I/O)
  → runSvgPipeline S4 write public/svg-catalog/{slug}.svg
  → portal /portal/svg-catalog
```

Smoke: `pnpm run scripts:smoke:svg:batch` from `site/` — **honesty evidence**, not automatic W2 symbol fail if skipped **and** NOTES do not claim smoke green.

---

## 6. Task list

> **Execution policy:** Repo code is largely green. Tasks **00–01** always run. Tasks **02–03** implement **only if RED**. Tasks **04–07** always produce honesty/visual/CP evidence. Prefer commit after each landable slice.  
> **Do not** rewrite modularCabinetBlock “from appendix storage fill” — that re-introduces the blob bug.

---

### Task 00: Baseline inventory + evidence tree

**Files:**
- Create: `results/planner/world-standard-wave/05-symbols-svg/00-baseline/NOTES.md`
- Create: `results/planner/world-standard-wave/05-symbols-svg/00-baseline/run.json`
- Create: `results/planner/world-standard-wave/05-symbols-svg/00-baseline/rg-raw.log`
- Modify: none (product)

- [ ] **Step 1: Confirm checkout**

```powershell
cd D:\OandO07072026
pwd
# Expect: D:\OandO07072026
# Never use worktrees
```

Expected: path is main checkout only.

- [ ] **Step 2: Create evidence tree**

```powershell
cd D:\OandO07072026
$base = "results\planner\world-standard-wave\05-symbols-svg"
@(
  "00-baseline","01-unit-reprove","02-green","03-nonempty",
  "04-svg-honesty","05-visual","06-cp-pack"
) | ForEach-Object { New-Item -ItemType Directory -Force -Path (Join-Path $base $_) | Out-Null }
```

Expected: directories exist under repo-root `results/` (not `site/results/`).

- [ ] **Step 3: Authority greps → raw log**

```powershell
cd D:\OandO07072026\site
rg -n "furnitureBlock2DFromItem|modularCabinetBlock|furnitureBlockUsesCenteredPath|compileSvgForPublish|renderBlock2DCentered|svg-catalog" `
  features/planner/open3d lib/catalog features/planner/asset-engine `
  2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\00-baseline\rg-raw.log
```

Expected (honesty checks on log content):

- `FeasibilityCanvas` imports/calls `furnitureBlock2DFromItem` + `renderBlock2DCentered`
- `furnitureBlockUsesCenteredPath` returns false in source
- `compileSvgForPublish` lives under asset-engine / admin publish — **not** Feasibility draw loop
- No Feasibility assignment loading `/svg-catalog` as furniture draw

- [ ] **Step 4: Write baseline NOTES.md**

Write exactly this content (fill ISO date + HEAD if available):

```markdown
# P05 baseline (re-prove checkout)

- Date: (ISO)
- Checkout: D:\OandO07072026
- results/ prior existence: MISSING at plan write; tree recreated
- Canvas draw path: FeasibilityCanvas → furnitureBlock2DFromItem → renderBlock2DCentered
- Live modularCabinetBlock: multi-prim (≥4) with doorStyle branches + light surface fill
- Historical expert “2 prims” prose: STALE vs live code
- furnitureBlockUsesCenteredPath: always false (top-left authorship)
- SVG catalog path: compileSvgForPublish → public/svg-catalog (not canvas authority)
- generateCabinetV0Footprint: centered path string helper — not Feasibility Block2D
- Fabric furniture flag: default OFF; W2 proof must keep OFF
- Ethics: no competitor SVG
- Baseline rg log: rg-raw.log
```

- [ ] **Step 5: Write 00-baseline/run.json**

```json
{
  "phase": "P05-symbols-svg",
  "slice": "00-baseline",
  "command": "rg authority inventory",
  "exitCode": 0,
  "timestamp": "(ISO)",
  "head": "(git rev-parse HEAD or dirty)",
  "notes": "results tree recreated; historical CP-05 unproven until unit re-prove"
}
```

- [ ] **Step 6: Commit baseline**

```bash
git add results/planner/world-standard-wave/05-symbols-svg/00-baseline
git commit -m "trustdata(P05): baseline NOTES for W2 symbols re-prove (results tree)"
```

---

### Task 01: Unit re-prove (expect PASS — fail-closed if not)

**Files:**
- Test (existing): `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts`
- Test (existing): `site/tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts`
- Create: `results/.../01-unit-reprove/vitest-raw.log`
- Create: `results/.../01-unit-reprove/run.json`

- [ ] **Step 1: Run both suites unfiltered**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\01-unit-reprove\vitest-raw.log
echo "EXIT=$LASTEXITCODE"
```

Expected if code matches plan-time read:

- Exit code **0**
- cabinet-v0 describe: all **13** tests PASS
- renderBlock2DToCanvas file: stroke + render + furnitureBlock2DFromItem cases PASS
- Log unfiltered (no pipe to `Select-Object -First` that hides failures)

- [ ] **Step 2: Write run.json with real exitCode**

```json
{
  "phase": "P05-symbols-svg",
  "slice": "01-unit-reprove",
  "command": "pnpm exec vitest run furnitureBlock2D.cabinet-v0.test.ts renderBlock2DToCanvas.test.ts --reporter=verbose",
  "exitCode": 0,
  "timestamp": "(ISO)",
  "expected": "PASS all unit symbol cases",
  "ifNonZero": "STOP — go Task 02/03 fix path; do not write CP-05 pass"
}
```

- [ ] **Step 3: Branch on result**

| Result | Next |
|--------|------|
| exit 0 | Copy log pointer to `02-green/`; continue Task 04 |
| exit ≠ 0 | **Stop** green path; execute Task 02 (RED analysis) → Task 03 (minimal fix) |

- [ ] **Step 4: Commit evidence only if exit 0**

```bash
git add results/planner/world-standard-wave/05-symbols-svg/01-unit-reprove
git commit -m "trustdata(P05): unit re-prove logs for cabinet-v0 Block2D + render"
```

---

### Task 02: RED analysis (only if Task 01 failed)

**Files:**
- Create: `results/.../01-unit-reprove/FAILURE-NOTES.md`
- Read: failing assertion messages in vitest-raw.log

- [ ] **Step 1: Classify failure**

| Class | Symptom | Owner fix |
|-------|---------|-----------|
| A Contrast | outer fill is storage / inverse-body | restore surface fill |
| B Empty-box | prims.length < 4 | restore multi-prim modularCabinetBlock |
| C doorStyle | pair/slab same stile | restore pair-only mid stile |
| D centeredPath | helper true | return false |
| E Bounds | runaway coords | clamp prims to footprint |
| F Unknown SKU | empty prims | restore boxBlock fallback |
| G Stroke floor | resolveCanvasStrokeWidthMm wrong | restore floor math |
| H Import/path | module not found | fix imports only |

- [ ] **Step 2: Write FAILURE-NOTES.md**

Include failing test names, expected vs actual, class letter, and **do not** mark CP-05 pass.

- [ ] **Step 3: Commit failure notes**

```bash
git add results/planner/world-standard-wave/05-symbols-svg/01-unit-reprove/FAILURE-NOTES.md
git commit -m "trustdata(P05): unit re-prove RED notes (no paper green)"
```

---

### Task 03: GREEN restore (only if Task 01/02 RED) — TDD + full code of record

**Files:**
- Modify: `site/features/planner/open3d/catalog/furnitureBlock2D.ts` (if symbol geometry wrong)
- Modify: `site/lib/catalog/renderBlock2DToCanvas.ts` (if paint/stroke wrong)
- Test: existing suites above

> If Task 01 was already green, **skip Task 03 entirely**. Do not “improve” storage fill.

#### 3A — If cabinet-v0 geometry / centeredPath / contrast is wrong

- [ ] **Step 1: Confirm failing tests still RED**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts --reporter=verbose
```

Expected: FAIL with specific assertion (capture message).

- [ ] **Step 2: Minimal implementation — modularCabinetBlock of record**

Replace / restore `modularCabinetBlock` + `furnitureBlockUsesCenteredPath` in  
`site/features/planner/open3d/catalog/furnitureBlock2D.ts` to this **live-aligned** form (surface fill, not storage):

```typescript
/**
 * Readable plan-view cabinet-v0 symbol (W2 / P05 / MASTER-CHART mesh_symbol).
 * Top-left mm origin (0..L, 0..D): carcass, inner, front/back, doorStyle cues.
 * Canvas centers via renderBlock2DCentered — prims are never authored centered.
 *
 * Contrast rule (benchmark): light fill + dark stroke so multi-prim detail reads
 * at plan zoom. Opaque inverse-body carcass + same-family stroke = solid blob.
 */
function modularCabinetBlock(item: Open3dFurnitureItem): Block2D {
  const opts = item.modularOptions;
  const w = opts?.widthMm ?? item.width ?? DEFAULT_MM;
  const d = opts?.depthMm ?? item.depth ?? DEFAULT_MM;
  const h = opts?.heightMm ?? item.height ?? 900;
  const doorStyle = opts?.doorStyle ?? "slab";
  const inset = Math.min(16, Math.max(6, Math.min(w, d) * 0.04));
  const frontY = d - inset; // plan: +Y depth; front at larger Y
  // Light carcass + dark outline (not storage inverse-body fill).
  const fill = BLOCK_STYLE.surface;
  const stroke = BLOCK_STYLE.surfaceStroke;
  const detailStroke = BLOCK_STYLE.glyphDark;
  const strokeW = BLOCK_STYLE.surfaceStrokeWidth;

  const prims: Prim[] = [
    {
      kind: "rect",
      x: 0,
      y: 0,
      w,
      h: d,
      fill,
      stroke,
      strokeWidth: strokeW,
      radius: 4,
    },
    {
      kind: "rect",
      x: inset,
      y: inset,
      w: Math.max(1, w - inset * 2),
      h: Math.max(1, d - inset * 2),
      fill: "none",
      stroke: detailStroke,
      strokeWidth: 1.25,
      radius: 2,
    },
    {
      kind: "line",
      points: [inset, frontY, w - inset, frontY],
      stroke: detailStroke,
      strokeWidth: 2.5,
    },
    {
      kind: "line",
      points: [inset, inset, w - inset, inset],
      stroke: detailStroke,
      strokeWidth: 1.5,
    },
  ];

  if (doorStyle === "pair") {
    prims.push({
      kind: "line",
      points: [w * 0.5, inset, w * 0.5, frontY],
      stroke: detailStroke,
      strokeWidth: 1.5,
      dash: [6, 4],
    });
    const handleW = Math.min(28, w * 0.06);
    const handleH = Math.min(10, d * 0.06);
    const handleY = frontY - handleH - 4;
    prims.push({
      kind: "rect",
      x: w * 0.25 - handleW / 2,
      y: handleY,
      w: handleW,
      h: handleH,
      fill: detailStroke,
      radius: 2,
    });
    prims.push({
      kind: "rect",
      x: w * 0.75 - handleW / 2,
      y: handleY,
      w: handleW,
      h: handleH,
      fill: detailStroke,
      radius: 2,
    });
  } else if (doorStyle === "slab") {
    const handleW = Math.min(36, w * 0.08);
    const handleH = Math.min(12, d * 0.07);
    prims.push({
      kind: "rect",
      x: w - inset - handleW - 8,
      y: frontY - handleH - 4,
      w: handleW,
      h: handleH,
      fill: detailStroke,
      radius: 2,
    });
  } else {
    // doorStyle "none" — open shelves cue
    prims.push({
      kind: "line",
      points: [inset, d * 0.33, w - inset, d * 0.33],
      stroke: detailStroke,
      strokeWidth: 1.25,
      dash: [8, 4],
    });
    prims.push({
      kind: "line",
      points: [inset, d * 0.66, w - inset, d * 0.66],
      stroke: detailStroke,
      strokeWidth: 1.25,
      dash: [8, 4],
    });
  }

  return {
    footprint: { L: w, D: d, H: h },
    prims,
    label: item.catalogId || "cabinet-v0",
  };
}

/**
 * Historical name. All furnitureBlock2D prims are authored top-left (0..L, 0..D).
 * Canvas centers via renderBlock2DCentered — never via centered prim authorship.
 * Always false (was a dead lie when modular returned true with top-left prims).
 */
export function furnitureBlockUsesCenteredPath(_item: Open3dFurnitureItem): boolean {
  return false;
}
```

**Rules while editing:**

- Keep modular branch first in `furnitureBlock2DFromItem` when `geometryMode === "modular-cabinet-v0"`.
- Do not call `generateCabinetV0Footprint` for canvas prims.
- Do not fetch `/svg-catalog`.
- Do not import competitor assets.

- [ ] **Step 3: Re-run cabinet-v0 suite — expect PASS**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\02-green\vitest-cabinet-raw.log
```

Expected: all tests PASS; exit 0.

- [ ] **Step 4: Commit product fix**

```bash
git add site/features/planner/open3d/catalog/furnitureBlock2D.ts results/planner/world-standard-wave/05-symbols-svg/02-green
git commit -m "fix(open3d): restore readable cabinet-v0 Block2D plan symbol for W2 (P05)"
```

#### 3B — If unknown SKU / render path is wrong

- [ ] **Step 1: Ensure box fallback at end of `furnitureBlock2DFromItem`**

The of-record tail (already live) must remain:

```typescript
  const generic = buildGenericBlock2D("rect", widthMm, depthMm);
  if (generic?.prims.length) {
    return { ...generic, label, footprint: { L: widthMm, D: depthMm, H: heightMm } };
  }

  return boxBlock(widthMm, depthMm, heightMm, label);
```

With `boxBlock` always emitting ≥1 rect at `(0,0,w,d)`.

- [ ] **Step 2: Ensure stroke floor helper**

```typescript
export function resolveCanvasStrokeWidthMm(
  strokeWidthMm: number,
  contextScale: number,
  minScreenPx = 1.25,
): number {
  const s = Math.abs(contextScale) || 1;
  const mm = Number.isFinite(strokeWidthMm) && strokeWidthMm > 0 ? strokeWidthMm : 1;
  return Math.max(mm, minScreenPx / s);
}
```

- [ ] **Step 3: Ensure centered helper**

```typescript
export function renderBlock2DCentered(
  ctx: CanvasRenderingContext2D,
  block: Block2D,
  options: RenderBlock2DToCanvasOptions = {},
): void {
  ctx.save();
  ctx.translate(-block.footprint.L / 2, -block.footprint.D / 2);
  renderBlock2DToCanvas(ctx, block, options);
  ctx.restore();
}
```

- [ ] **Step 4: Re-run render suite**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\03-nonempty\vitest-raw.log
```

Expected: PASS including unknown SKU nonempty + fill.

- [ ] **Step 5: Commit**

```bash
git add site/lib/catalog/renderBlock2DToCanvas.ts site/features/planner/open3d/catalog/furnitureBlock2D.ts results/planner/world-standard-wave/05-symbols-svg/03-nonempty
git commit -m "fix(open3d): non-empty unknown SKU Block2D + canvas paint guard (P05)"
```

#### 3C — If unit tests themselves are missing (should not happen)

Recreate full cabinet-v0 test file from live of-record content in § Appendix A (full source). Do **not** use weaker appendix skeleton without contrast/handle cases.

---

### Task 04: SVG honesty (publish ≠ canvas)

**Files:**
- Create: `results/.../04-svg-honesty/NOTES.md`
- Create: `results/.../04-svg-honesty/svg-batch-raw.log` (if smoke run)
- Create: `results/.../04-svg-honesty/run.json`
- Modify only if missing: `site/features/planner/asset-engine/README.md` honesty section

- [ ] **Step 1: Verify README honesty section exists**

Read `site/features/planner/asset-engine/README.md` for heading `## Canvas vs publish SVG (P05 honesty)`.

If **missing**, append:

```markdown
## Canvas vs publish SVG (P05 honesty)

| Surface | Authority today | Entry |
|---------|-----------------|-------|
| open3d plan furniture symbols | **Block2D prims** (top-left; canvas centers) | `furnitureBlock2DFromItem` → `renderBlock2DToCanvas` / `renderBlock2DCentered` |
| Admin/CLI published SVG files | **pipelineCore+normalize** | `compileSvgForPublish` → `public/svg-catalog/{slug}.svg` |
| Portal preview | Published SVG URL | `/portal/svg-catalog` |

W2 acceptance is **Block2D readable**, not “SVG loaded onto FeasibilityCanvas.”
Do not mark S7 implemented until inventory place consumes published SVG with evidence.
`furnitureBlockUsesCenteredPath` is always `false` (prims top-left; canvas centers).
```

If **present**, do not rewrite for style thrash.

- [ ] **Step 2: Run SVG smoke batch (honesty optional for symbol half)**

```powershell
cd D:\OandO07072026\site
pnpm run scripts:smoke:svg:batch 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\04-svg-honesty\svg-batch-raw.log
echo "EXIT=$LASTEXITCODE"
```

| Exit | Honesty claim allowed |
|------|------------------------|
| 0 | NOTES may say smoke green |
| ≠0 | NOTES must say smoke failed/blocked; **do not** claim pipeline works; symbol half may still pass |

- [ ] **Step 3: Write honesty NOTES.md**

```markdown
# SVG path honesty (P05)

## What is true
1. Publish compile authority = compileSvgForPublish → pipelineCore+normalize
2. Admin publish wire = publishDescriptorWithPipeline → public/svg-catalog/{slug}.svg
3. CLI fixtures: pnpm run scripts:smoke:svg / scripts:smoke:svg:batch
4. V1 svgCompiler.server.ts = v1-reference-only (if still marked)
5. Open3d plan canvas does not draw from /svg-catalog/*.svg today (Block2D)
6. generateCabinetV0Footprint is mesh/helper — not canvas Block2D
7. Fabric flag-ON Rects are not W2 symbol proof
8. Inventory blockToSvg is DOM preview — not Feasibility authority

## What is not true
1. “SVG is the FeasibilityCanvas authority.”
2. “cabinet-v0 plan mark is published SVG.”
3. “Portal svg-catalog proves planner place symbols.”
4. “furnitureBlockUsesCenteredPath means modular prims are centered.” (always false)
5. “Unit green on Block2D = browser place journey done.” (P07)
6. “Readable 2D = good 3D mesh.” (P08)
7. “SVG smoke green = W2 symbol quality.”
8. “We use competitor SVG sprites / catalog.”

## Smoke result this run
- scripts:smoke:svg:batch exit: (code or skipped)
- Claim pipeline works: (yes only if exit 0)
```

- [ ] **Step 4: run.json**

```json
{
  "phase": "P05-symbols-svg",
  "slice": "04-svg-honesty",
  "command": "pnpm run scripts:smoke:svg:batch",
  "exitCode": "(real)",
  "symbolQualityDependsOnSmoke": false,
  "timestamp": "(ISO)"
}
```

- [ ] **Step 5: Commit**

```bash
git add results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty site/features/planner/asset-engine/README.md
git commit -m "trustdata(P05): SVG honesty NOTES (Block2D canvas ≠ publish catalog)"
```

---

### Task 05: Visual evidence (prim-JSON required; Playwright optional)

**Files:**
- Create: `results/.../05-visual/cabinet-v0-prims-pair.json`
- Create: `results/.../05-visual/cabinet-v0-prims-slab.json`
- Create: `results/.../05-visual/cabinet-v0-prims-none.json`
- Create: `results/.../05-visual/NOTES.md`
- Optional: Playwright PNG under same folder (or pointer to mesh-symbol e2e — prefer own dump for CP-05)

- [ ] **Step 1: Write a one-shot dump script (Node via vitest or tsx)**

Create temporary runner (or use `pnpm exec tsx` with inline file under evidence only — **not** product tree):

`results/planner/world-standard-wave/05-symbols-svg/05-visual/dump-prims.mjs` is awkward for TS imports. Prefer:

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts --reporter=verbose
```

Then produce JSON via a **small Node script** that imports through the package path, **or** write JSON manually from a dedicated dump test once:

Add **only if** no dump exists — optional test file is heavier; preferred approach:

```powershell
cd D:\OandO07072026\site
pnpm exec tsx -e "
import { writeFileSync, mkdirSync } from 'node:fs';
import { furnitureBlock2DFromItem } from './features/planner/open3d/catalog/furnitureBlock2D.ts';

const base = {
  id: 'vis',
  catalogId: 'cabinet-v0',
  position: { x: 0, y: 0 },
  rotation: 0,
  scale: { x: 1, y: 1, z: 1 },
  width: 800, depth: 400, height: 900,
  geometryMode: 'modular-cabinet-v0',
};
function item(doorStyle) {
  return {
    ...base,
    modularOptions: {
      widthMm: 800, depthMm: 400, heightMm: 900,
      doorStyle, material: 'white',
    },
  };
}
const out = '../results/planner/world-standard-wave/05-symbols-svg/05-visual';
mkdirSync(out, { recursive: true });
for (const style of ['pair','slab','none']) {
  const block = furnitureBlock2DFromItem(item(style));
  writeFileSync(
    out + '/cabinet-v0-prims-' + style + '.json',
    JSON.stringify(block, null, 2),
  );
  if (block.prims.length < 4) throw new Error(style + ' prims < 4');
}
console.log('dumped pair/slab/none prim JSON');
"
```

Expected: three JSON files; each `prims.length >= 4`; pair has mid stile line; slab does not.

- [ ] **Step 2: Write 05-visual/NOTES.md**

```markdown
# Visual criteria (P05)

Readable when:
1. Outer carcass present (full footprint rect)
2. Front edge Y > back edge Y
3. doorStyle geometry differs across pair/slab/none JSON
4. Light surface fill on outer (not block-storage blob)
5. No competitor art / no svg-catalog URL in JSON

Artifacts:
- cabinet-v0-prims-pair.json
- cabinet-v0-prims-slab.json
- cabinet-v0-prims-none.json
- (optional) Playwright place PNG — flag OFF

Browser place journey remains P07 for full W2 place half.
```

- [ ] **Step 3 (optional strong visual): Playwright place PNG with flag OFF**

```powershell
cd D:\OandO07072026\site
# Ensure NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE is NOT 1
$env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE = $null
pnpm exec playwright test tests/e2e/open3d-mesh-symbol-live-verify.spec.ts --reporter=line 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\05-visual\playwright-raw.log
```

If green, **copy** key PNGs into `05-visual/` (do not leave only under `benchmark-quality/` without pointer NOTES).  
If red/flaky: **do not** fail symbol half if prim-JSON criteria hold; document in NOTES.

- [ ] **Step 4: Commit**

```bash
git add results/planner/world-standard-wave/05-symbols-svg/05-visual
git commit -m "trustdata(P05): cabinet-v0 prim-JSON visual evidence for W2 symbols"
```

---

### Task 06: Residual raised-bar locks (only if gaps vs Idiots2)

Run only when Task 01 green **and** a gap is proven (missing assertion). Prefer **add test first**.

#### Gap check matrix

| Raised bar | Covered live? | Action if missing |
|------------|---------------|-------------------|
| surface fill not storage | yes (cabinet-v0 + render tests) | none |
| front > back | yes | none |
| pair stile / slab none | yes | none |
| pair 2 handles / slab 1 offset | yes | none |
| doorStyle none shelves | yes | none |
| centeredPath false | yes | none |
| unknown SKU nonempty | yes | none |
| stroke floor at scale 0.1 | yes | none |
| Feasibility never imports svg-catalog for paint | **grep only** | optional static test |
| Fabric Rect ≠ W2 documented | honesty NOTES | already Task 04 |

- [ ] **Step 1: Optional authority static unit** (create only if owner wants CI lock)

**Create:** `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.authority-honesty.test.ts`

```typescript
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  furnitureBlock2DFromItem,
  furnitureBlockUsesCenteredPath,
} from "@/features/planner/open3d/catalog/furnitureBlock2D";
import type { Open3dFurnitureItem } from "@/features/planner/open3d/model/types";

function cabinetItem(): Open3dFurnitureItem {
  return {
    id: "cab-auth",
    catalogId: "cabinet-v0",
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    width: 800,
    depth: 400,
    height: 900,
    geometryMode: "modular-cabinet-v0",
    modularOptions: {
      widthMm: 800,
      depthMm: 400,
      heightMm: 900,
      doorStyle: "slab",
      material: "white",
    },
  };
}

describe("P05 authority honesty locks", () => {
  it("centeredPath helper is always false for modular cabinet", () => {
    expect(furnitureBlockUsesCenteredPath(cabinetItem())).toBe(false);
  });

  it("plan symbol JSON never references publish catalog paths", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    expect(JSON.stringify(block)).not.toMatch(/svg-catalog|\.glb|\.svg/i);
  });

  it("FeasibilityCanvas source draws Block2D, not public svg-catalog files", () => {
    const p = resolve(
      process.cwd(),
      "features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx",
    );
    const src = readFileSync(p, "utf8");
    expect(src).toMatch(/furnitureBlock2DFromItem/);
    expect(src).toMatch(/renderBlock2DCentered/);
    expect(src).not.toMatch(/\/svg-catalog\//);
  });
});
```

- [ ] **Step 2: RED then GREEN**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.authority-honesty.test.ts --reporter=verbose
```

Expected: PASS if Feasibility still Path B.

- [ ] **Step 3: Commit**

```bash
git add site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.authority-honesty.test.ts
git commit -m "test(open3d): P05 authority honesty locks (Block2D ≠ svg-catalog)"
```

**Skip Task 06 entirely** if time-boxed and § Gap check is all “yes / honesty NOTES.”

---

### Task 07: CP-05 pack

**Files:**
- Create: `results/.../CP-05-vitest-raw.log`
- Create: `results/.../CP-05.json`
- Create: `results/.../SUMMARY.md`
- Create: `results/.../06-cp-pack/run.json`

- [ ] **Step 1: Final vitest both core files**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\CP-05-vitest-raw.log
echo "EXIT=$LASTEXITCODE"
```

Expected: exit **0**. If not, **do not** write status pass.

- [ ] **Step 2: Write CP-05.json**

```json
{
  "checkpoint": "CP-05",
  "phase": "P05-symbols-svg",
  "gate": "W2-symbol-quality",
  "status": "pass",
  "claims": {
    "cabinetV0Block2DReadable": true,
    "notEmptyBox": true,
    "doorStyleGeometryDiffers": true,
    "lightFillNotInverseBlob": true,
    "frontDistinctFromBack": true,
    "canvasAuthorityIsBlock2D": true,
    "furnitureBlockUsesCenteredPathIsFalse": true,
    "svgCatalogIsPublishNotCanvas": true,
    "svgHonestySmoke": "pass-or-fail-or-skipped-with-notes",
    "noCompetitorSvg": true,
    "fabricFlagOffForProof": true,
    "browserPlaceJourney": "deferred-to-P07",
    "meshBeauty": "deferred-to-P08"
  },
  "evidence": [
    "results/planner/world-standard-wave/05-symbols-svg/01-unit-reprove/vitest-raw.log",
    "results/planner/world-standard-wave/05-symbols-svg/CP-05-vitest-raw.log",
    "results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty/NOTES.md",
    "results/planner/world-standard-wave/05-symbols-svg/05-visual/"
  ],
  "timestamp": "(ISO)",
  "head": "(sha or dirty)"
}
```

Set `"status": "fail"` if any hard-stop row fails.  
Set `svgHonestySmoke` to real outcome string.

- [ ] **Step 3: Write SUMMARY.md**

```markdown
# CP-05 SUMMARY — P05 symbols / SVG honesty

## Status
- symbolQuality: PASS|FAIL
- svgHonestySmoke: PASS|FAIL|SKIPPED-WITH-NOTES
- overall status field: must not say pass if symbolQuality fail

## Done (symbol half)
- cabinet-v0 ≥4 prims, carcass + front + door cues
- pair ≠ slab ≠ none geometry
- light surface fill (not storage blob)
- centeredPath false
- unknown SKU non-empty
- honesty NOTES: Block2D canvas; SVG publish
- ethics: no competitor SVG
- evidence under results/planner/world-standard-wave/05-symbols-svg/

## Not done (explicit)
- P07 browser place ≥2 journey
- P08 mesh toe/door beauty
- Fabric full-stage cutover
- Loading /svg-catalog into Feasibility as draw path (future S7)
- Multi-SKU symbol art expansion thrash

## Commands
See CP-05-vitest-raw.log and 04-svg-honesty/svg-batch-raw.log
```

- [ ] **Step 4: Hard-stop self-check table**

| Check | Pass condition | Evidence |
|-------|----------------|----------|
| Unit | cabinet-v0 + render suites green | CP-05-vitest-raw.log |
| Non-empty | modular + box fallback have prims | unit + 03 |
| Door style | pair mid stile; slab none | unit + 05-visual JSON |
| Contrast | surface fill not storage blob | unit |
| CenteredPath | helper false | unit |
| Honesty | NOTES + README refuse false claims | 04-svg-honesty |
| SVG smoke | optional; honest claim only | 04 log |
| Ethics | no competitor SVG | unit string + review |
| Visual | prim-JSON and/or PNG | 05-visual |
| Scope | no mesh redesign / Fabric cutover / SVGR | git diff review |
| Layout | artifacts under root `results/` only | path check |

If any **required** row fails: stop; append `Failures.md`; do not mark W2 symbol half green.

- [ ] **Step 5: Final commit**

```bash
git add results/planner/world-standard-wave/05-symbols-svg
git commit -m "trustdata(P05): CP-05 W2 symbol quality + SVG honesty pack (re-prove)"
```

- [ ] **Step 6: Push policy**

Per AGENTS: push `main` to origin when landable slice is green enough not to strand remote. Mirror mayoite on agent cadence (~45 min). Never force-push.

---

### Task 08: Explicit non-work (document, do not implement)

- [ ] **Step 1: Confirm out-of-scope remains out**

Do **not**:

1. Wire Feasibility to fetch `/svg-catalog/*.svg` for furniture paint.  
2. Enable Fabric furniture flag for demos/screenshots used as W2 proof.  
3. Redesign modular mesh toe/doors (P08).  
4. Expand desk/seat/storage multi-SKU art while place/select/save red.  
5. Copy competitor SVG path data.  
6. Treat E2E mesh-symbol folder alone as CP-05 without `05-symbols-svg/` pack.  
7. Delete `canvas-fabric-stage/` (destination slice).  
8. Re-open Konva hybrid.  
9. Split SVG honesty into a second CP.  
10. Mark full W2 browser place green from this phase alone.

Write one line in SUMMARY.md: `Task 08 non-work confirmed`.

---

## 7. Test matrix

| ID | Layer | Command | Expected |
|----|-------|---------|----------|
| U1 | Unit cabinet-v0 | `pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts --reporter=verbose` | All PASS (~13) |
| U2 | Unit render + unknown | `pnpm exec vitest run tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts --reporter=verbose` | All PASS |
| U3 | Optional authority | `…furnitureBlock2D.authority-honesty.test.ts` | All PASS |
| U4 | CP pack both | U1+U2 combined | exit 0; log unfiltered |
| S1 | SVG smoke batch | `pnpm run scripts:smoke:svg:batch` | exit 0 preferred; not auto-fail W2 |
| S2 | SVG smoke single | `pnpm run scripts:smoke:svg` | optional |
| E1 | Optional place visual | Playwright mesh-symbol or open3d place | flag OFF; multi-prim zoom |
| G1 | Authority rg | rg Block2D/SVG paths | Feasibility ≠ svg-catalog draw |
| L1 | Layout | `pnpm run check:layout` from repo root | no `site/results` evidence dump |

### Unit case detail (cabinet-v0)

| Case | Assert |
|------|--------|
| footprint modular dims | L=800 D=400 H=900 |
| modularOptions prefer | overrides item width/depth/height |
| ≥4 prims | rect≥1, line≥2 |
| outer carcass | rect at 0,0 covering L×D, fill not none |
| light fill | `var(--block-surface)`; not block-storage / inverse-body |
| bounds | all rect/line coords inside footprint ±1 |
| front > back | max horiz line Y > min; front > 0.7D |
| pair vs slab stile | mid vertical count ≥1 vs 0 |
| handles | pair 2 small filled rects; slab 1 offset from mid |
| none | 0 stile, 0 handles, ≥2 dashed horiz shelves |
| centeredPath | false |
| canvas paint | fill+stroke; beginPath ≥2 |
| no external | no http(s); no .glb/.svg/svg-catalog in JSON |

### Unit case detail (render / fallback)

| Case | Assert |
|------|--------|
| stroke floor | scale 0.1 → floored mm ≥ screen min |
| rect paint | save/fill/restore |
| centered | translate present |
| demo-desk | prims>0, footprint matches |
| modular basic | prims>0 |
| contrast | surface fill + multi-prim lines |
| unknown SKU | prims>0, rect, canvas fill |
| unknown equipment | rect footprint positive + centered fill |
| degenerate 0 dims | clamp L,D ≥1 still drawable |

---

## 8. False-green catalog

| Trap | Why false | Blocked by |
|------|-----------|------------|
| Markdown “CP-05 PASS” without `results/` | Paper green | Task 00–07 recreate evidence |
| prims.length ≥4 random lines | Weak geometry | stile/handle/front-back/fill tests |
| SVG smoke exit 0 alone | Publish ≠ plan symbols | gate split |
| Portal `/svg-catalog` screenshot as plan proof | Path C ≠ Path B | honesty NOTES |
| Fabric flag-ON Rect screenshot | Not Block2D | flag policy |
| Unit green = P07 place journey | Scope split | browserPlaceJourney deferred |
| Unit green = P08 mesh | Scope split | mesh deferred |
| Appendix storage fill “restored” | Re-blobs contrast | surface fill tests |
| `generateCabinetV0Footprint` used as symbol | Mesh helper path | architecture + review |
| Inventory rich thumb only | Canvas lagged historically | Feasibility Path B proof |
| Competitor path paste | Ethics fail | string tests + review |
| `site/results` dump | Layout violation | check:layout; root results only |
| Claiming centeredPath “works” as true | Dead lie | always false |
| Skipping visual because unit green | Count ≠ readable | prim-JSON required |
| Second CP for honesty | Process thrash | one CP-05 pack |

---

## 9. Stop-if-fail / CP criteria

### Hard stop (fail CP / do not ship green)

1. Cabinet-v0 unit suite red.  
2. Unknown SKU empty prims.  
3. doorStyle pair/slab geometry identical.  
4. Outer fill is storage/inverse blob (contrast regression).  
5. `furnitureBlockUsesCenteredPath` true.  
6. Honesty NOTES claim false SVG-as-canvas truths.  
7. Competitor assets introduced.  
8. Evidence only in `site/results` or missing entirely while status=pass.  
9. Product code loads `/svg-catalog` into Feasibility furniture paint.

### Soft stop (document; may still pass symbol half)

1. SVG smoke red (if NOTES honest).  
2. Playwright flaky (if prim-JSON solid).  
3. Optional authority test not added.

### CP-05 pass requires

- Hard stops all green  
- Unfiltered vitest log  
- Visual prim-JSON (or PNG)  
- Honesty NOTES  
- CP-05.json + SUMMARY.md  

---

## 10. Commit sequence

| Order | Message | Contents |
|-------|---------|----------|
| 1 | `trustdata(P05): baseline NOTES for W2 symbols re-prove (results tree)` | 00-baseline |
| 2 | `trustdata(P05): unit re-prove logs for cabinet-v0 Block2D + render` | 01-unit-reprove |
| 3 | (only if RED) `fix(open3d): restore readable cabinet-v0 Block2D…` | product + 02-green |
| 4 | (only if RED) `fix(open3d): non-empty unknown SKU…` | product + 03 |
| 5 | `trustdata(P05): SVG honesty NOTES…` | 04-svg-honesty ± README |
| 6 | `trustdata(P05): cabinet-v0 prim-JSON visual evidence…` | 05-visual |
| 7 | (optional) `test(open3d): P05 authority honesty locks…` | new unit |
| 8 | `trustdata(P05): CP-05 W2 symbol quality + SVG honesty pack (re-prove)` | CP pack |

No force-push. Push origin when green; mayoite on cadence.

---

## 11. Risks & owner decisions

| Risk | Severity | Mitigation | Owner decision needed? |
|------|----------|------------|------------------------|
| Historical PASS trusted without evidence | High | Re-prove always | No |
| Engineer applies appendix storage fill | High | This plan forbids; surface locked | No |
| Expand multi-SKU art early | Med | YAGNI until place/save green | No unless goal change |
| Make svg-catalog canvas authority | High | Goal change stop | **Yes** if desired |
| Fabric cutover mid-W | High | Engine lock Approach A | No |
| Playwright CI flaky | Med | prim-JSON primary visual | No |
| Smoke env broken | Low | Honesty skip path | No |
| cm/mm 10× desk symbols | Med | modular tests use mm; broader audit post-P05 | Later |

Open questions from Idiots2 §24 remain **non-blocking** for CP-05.

---

## 12. Self-review vs brainstormer + repo

### 12.1 Repo coverage

| Repo path | In plan tasks? |
|-----------|----------------|
| `furnitureBlock2D.ts` | Yes (Task 03 restore + of-record) |
| `renderBlock2DToCanvas.ts` | Yes |
| `FeasibilityCanvas.tsx` | Yes (authority read + optional static test) |
| `asset-engine/README.md` | Yes Task 04 |
| `compileSvgForPublish` / smoke scripts | Yes Task 04 |
| cabinet-v0 unit file | Yes Tasks 01/03/07 |
| render unit file | Yes Tasks 01/03/07 |
| Fabric flag / layer | Yes §1.7, false-green, Task 08 |
| `generateCabinetV0Footprint` | Yes as non-authority |
| `results/…/05-symbols-svg/` | Yes all evidence tasks |
| blocks2d BLOCK_STYLE | Yes contrast contract |

### 12.2 Brainstormer coverage

| Idiots2 bar / failure | Plan handling |
|-----------------------|---------------|
| Three worlds A/B/C | §1.5, §2.1, Task 04 |
| Readable criteria | §2.2–2.3, Task 05, test matrix |
| Approach 1 chosen | §2.4 |
| Approach 3 future only | Task 08 |
| Fabric flag OFF | §1.7, false-green |
| centeredPath false | Task 03/tests |
| doorStyle matrix | §5.3 + tests |
| Unknown SKU | Task 03B + U2 |
| Ethics fence | §3 |
| Evidence standards | Task 00/07 |
| Paper PASS risk | §1.4, false-green |
| P07/P08 defer | Done when + Task 08 |
| Contrast / blob | §5.4 + tests |
| Gate split smoke | Task 04/07 |

### 12.3 Placeholder scan

No TBD / “similar to Task N” / empty test steps. Full code of record included for restore path.

### 12.4 Length honesty

Plan is extensive because: (1) historical phase vs live code contradictions must be explicit; (2) missing `results/` forces full re-prove procedure; (3) false-green catalog is large in this domain; (4) skill forbids artificial length caps.

---

## 13. Appendices

### Appendix A — Full cabinet-v0 unit test of record (do not weaken)

Path: `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts`

This file already exists live with **13** cases including contrast, handles, doorStyle none, modularOptions preference. On execute:

1. Prefer **keep** live file.  
2. Only recreate if deleted — copy from git history `HEAD` of that path.  
3. Do **not** replace with thinner appendix skeleton from `P05-appendix.md` (weaker: no contrast, no handle counts, no none shelves).

### Appendix B — Type / signature catalog used

```typescript
// blocks2d
export interface Block2D {
  footprint: { L: number; D: number; H: number };
  prims: Prim[];
  label?: string;
}
// Prim: discriminated union kind: "rect" | "line" | "circle" | "arc" | "path" | …

export function furnitureBlock2DFromItem(
  item: Open3dFurnitureItem,
  catalogMeta?: { name?: string; category?: string },
): Block2D;

export function furnitureBlockUsesCenteredPath(item: Open3dFurnitureItem): boolean;

export function renderBlock2DToCanvas(
  ctx: CanvasRenderingContext2D,
  block: Block2D,
  options?: RenderBlock2DToCanvasOptions,
): void;

export function renderBlock2DCentered(
  ctx: CanvasRenderingContext2D,
  block: Block2D,
  options?: RenderBlock2DToCanvasOptions,
): void;

export function resolveCanvasStrokeWidthMm(
  strokeWidthMm: number,
  contextScale: number,
  minScreenPx?: number,
): number;

export function createCanvasBlockColorResolver(host: Element): BlockColorResolver;

// Publish
export function compileSvgForPublish(raw: unknown): Promise<CompileResult>;
```

### Appendix C — Research translation table (ideas → O&O)

| Industry pattern (ideas only) | O&O action | Phase |
|-------------------------------|------------|-------|
| Catalog tile previews item | Block2D → blockToSvg thumb | Inventory |
| Plan shows furniture-looking mark | Block2D paint Feasibility | **P05** |
| Orientation readable | Front line / handles | **P05** |
| Size matches product | modular mm footprint | **P05** |
| Drag/click place | placementAction | P07 |
| Fixed branded size | lock sellable mm | catalog policy |
| 2D↔3D same item | UUID continuity | P04 |
| SVG **export** of plan | later document export | post-W |
| Publish asset library | svg-catalog pipeline | honesty/admin |
| Pretty 3D mesh | modular mesh | P08 |
| UI sprites | Phosphor chrome | not furniture art |

### Appendix D — Commands cheat sheet

```powershell
cd D:\OandO07072026\site

# Unit symbol pack
pnpm exec vitest run `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts `
  --reporter=verbose

# SVG publish honesty
pnpm run scripts:smoke:svg:batch

# Dev inspect (flag OFF)
# $env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE must not be "1"
pnpm dev
# → /planner/open3d → place cabinet-v0 → 2D zoom inspect multi-prim

# Layout gate
cd D:\OandO07072026
pnpm run check:layout
```

### Appendix E — Evidence folder contract (RESULTS-MAP)

Canonical: `results/planner/world-standard-wave/05-symbols-svg/`

Minimum when green:

- `run.json` / vitest logs  
- PNG or prim-JSON  
- `NOTES.md` canvas vs publish honesty  
- CP-05 summary if phase requires (this plan requires CP-05.json + SUMMARY.md)

Forbidden as file-of-record: `site/results/`, `site/test-results/`, `archive/results/`.

### Appendix F — Feasibility paint snippet (authority reference)

From live `FeasibilityCanvas.tsx` (~583–610):

```typescript
if (layerVisibility.furniture) {
  const colorResolve = createCanvasBlockColorResolver(canvas);
  try {
    for (const item of activeFloor.furniture) {
      const center = projectToScreen(item.position, transform);
      const block = furnitureBlock2DFromItem(item);
      // ... translate(center) rotate scale ...
      renderBlock2DCentered(context, block, {
        resolve: colorResolve,
        skipShadow: transform.scale < 0.05,
      });
      // selection stroke...
    }
  } finally {
    (colorResolve as { dispose?: () => void }).dispose?.();
  }
}
```

### Appendix G — Glossary (operator)

| Term | Meaning |
|------|---------|
| Block2D | footprint + prims in mm |
| Path B | canvas plan symbol authority |
| Path C | publish SVG |
| Empty-box bar | 2-prim / blank rect failure |
| W2 symbol half | P05 CP-05 |
| W2 place half | P07 |
| CP-05 | checkpoint pack for P05 |
| Approach A | Feasibility interim for W gates |
| Publish ≠ canvas | honesty slogan |

### Appendix H — What “done” is not

- Not full W2 (needs P07 place ≥2 incl cabinet-v0 browser).  
- Not mesh quality.  
- Not Fabric destination.  
- Not SVG-as-engine.  
- Not multi-SKU symbol library expansion.  
- Not competitor parity screenshots.

---

## Execution handoff

**Plan complete and saved to `plans1/P05-symbols-svg/IMPLEMENTATION-PLAN.md`.**

**Two execution options:**

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

**Which approach?**

Execute order: Task 00 → 01 → (02–03 only if RED) → 04 → 05 → (06 optional) → 07 → 08.

**Default expectation at plan time:** Task 01 is already green on product code; primary work is **evidence re-prove + honesty/visual pack**, not symbol thrash.

---

*End of P05 IMPLEMENTATION-PLAN — planner 05/10 · writing-plans-repo-brainstorm · Idiots2 only · repo-first Block2D honesty.*
