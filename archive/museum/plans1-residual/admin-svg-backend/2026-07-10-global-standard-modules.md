# Global-Standard Modules — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.  
> **Every subagent brief starts with:** `/using-superpowers` + fit skills (TDD, verification, chrome-devtools as the task needs).  
> **Checkout:** `D:\OandO07072026` only — **no worktrees**.  
> **Bar:** `Agents/Agents-ELON-STANDARD.md` — raise never lower.

**Goal:** Execute the module-wise global-standard revision so each product module has raised experts → synthesis → path-provable implement proof, starting with foundation landables (F2–F4) and owner-pain SVG production — without CP-folder theater.

**Architecture:** One module at a time under `results/planner/global-standard-revision/modules/<m>/`. Workflow is fixed: README complete-bar → BRAINSTORM → UI-EXPERT → SYNTHESIS (raised PASS + OPEN) → TASK-LIST → implement + evidence under `modules/<m>/evidence/` (or reuse historical `world-standard-wave/` paths only when explicitly pointing). Trustdata CPs under `world-standard-wave/` stay history; never invent `global-standard-revision/CP-XX/`. Dual language forever: **GATE PASS ≠ module product complete**.

**Tech Stack:** TypeScript · Next.js (site) · Vitest · Playwright · Canvas 2D (FeasibilityCanvas + Block2D) · Three/R3F (orbit 3D) · asset-engine SVG pipeline (`compileSvgForPublish`) · pnpm monorepo · evidence under repo-root `results/` only.

**Laws / authority (read before any task):**

| Doc | Role |
|-----|------|
| `Plans/trustdata/GLOBAL-STANDARD-REVISION.md` | Program law (module-wise) |
| `results/planner/global-standard-revision/README.md` | Module index + status |
| `Agents/Agents-ELON-STANDARD.md` | Bar, evidence, git backup |
| `ayushdocs/17-LICENSES-CLEARED.md` | Ethics / paid cleared |
| `ayushdocs/18-PRODUCT-CONTEXT.md` | Why product |
| `results/planner/world-standard-wave/TRUTH-LOCK.md` | Claim discipline |
| `results/planner/world-standard-wave/00-rebaseline/HONEST-STATUS.md` | Dual scoreboard seed |

**Hard rules (every task):**

1. **GATE PASS ≠ module complete.** Never close a module README to product-complete because an old W-gate or vitest pack was green.
2. **No competitor copy.** Research/ideas only; original O&O geometry/SVG/mesh. No paste from `D:\websites` scrapes into product.
3. **Evidence only under** `results/planner/global-standard-revision/modules/<m>/` (plus optional `evidence/` subfolder). Do not write module proof into `site/results/` or invent CP folders under revision tree.
4. **TDD when product code appears:** RED unit → GREEN unit → optional browser PNG → commit. No “tests later.”
5. **One module completely** (experts → synthesis → implement proof → README status) **then** the next. Default serial order below; change only for owner pain (still one at a time).
6. **Commit as you go** after each landable slice. Push origin when green enough; mayoite ~45 min / big land.

**Suggested serial order (product pain first):**

| # | Module | Why |
|---|--------|-----|
| 1 | foundation | Experts DONE; F2–F4 docs still OPEN |
| 2 | symbols-svg | Owner pain: ~4 SVGs on disk |
| 3 | admin-svg-pipeline | How files reach `public/svg-catalog/` |
| 4 | mesh-3d | Boxy residual |
| 5 | shell-chrome | Honesty + a11y chrome |
| 6 | select-edit · canvas-2d · catalog-place · view-3d-orbit · save-persist | Journey modules (one fully, then next) |
| 7 | export-boq | Quote path |
| 8 | evidence-handover | Pack only after modules honest |

---

## File map (program + per-module)

### Program / process (this plan touches)

| Path | Responsibility |
|------|----------------|
| `docs/superpowers/plans/2026-07-10-global-standard-modules.md` | This plan |
| `results/planner/global-standard-revision/README.md` | Module status table (update after each close) |
| `results/planner/global-standard-revision/PLAN-WRITER-NOTES.md` | Planner risks |
| `results/planner/global-standard-revision/modules/<m>/README.md` | What “global complete” means for `<m>` |
| `results/planner/global-standard-revision/modules/<m>/BRAINSTORM.md` | Product bar |
| `results/planner/global-standard-revision/modules/<m>/UI-EXPERT.md` | UI bar |
| `results/planner/global-standard-revision/modules/<m>/SYNTHESIS.md` | Raised PASS + OPEN residuals |
| `results/planner/global-standard-revision/modules/<m>/TASK-LIST.md` | Implement checklist post-synthesis |
| `results/planner/global-standard-revision/modules/<m>/evidence/` | Logs, PNGs, census for this module only |

### foundation landables (F2–F4)

| Path | Responsibility |
|------|----------------|
| `results/planner/world-standard-wave/00-start/BUYER-CONTRACT.md` | W0.F2 buyer one-pager |
| `results/planner/world-standard-wave/00-start/AUTHORITY-MAP.md` | W0.F3 Block2D vs svg-catalog vs Fabric vs modular 3D |
| `results/planner/world-standard-wave/00-start/ASSET-CENSUS.md` | W0.F4 command + counts |
| `results/planner/global-standard-revision/modules/foundation/README.md` | Status flip after F2–F4 |
| `results/planner/global-standard-revision/modules/foundation/evidence/` | Census command transcript |
| `Plans/trustdata/00-START.md` | Optional one-line pointer to foundation SYNTHESIS + F1–F7 |
| `results/planner/world-standard-wave/00-rebaseline/HONEST-STATUS.md` | Keep dual language (W0.F1) |

### symbols-svg + admin-svg-pipeline (product code likely)

| Path | Responsibility |
|------|----------------|
| `site/public/svg-catalog/*.svg` | **Published** SVG files on disk (publish authority) |
| `site/features/planner/asset-engine/svg/compileSvgForPublish.ts` | Publish compile |
| `site/features/planner/asset-engine/svg/runSvgCompileStages.ts` | Pipeline stages |
| `site/scripts/generate-svg.mjs` | CLI fixtures → svg-catalog |
| `site/features/planner/open3d/catalog/furnitureBlock2D.ts` | **Plan canvas** Block2D authority (not svg-catalog load) |
| `site/lib/catalog/renderBlock2DToCanvas.ts` | Prim paint |
| `site/app/api/admin/svg-editor/route.ts` | Admin publish API |
| `site/features/planner/admin/svg-editor/` | Admin editor + persist |
| `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts` | Block2D TDD home |
| `site/tests/e2e/admin-svg-publish-p01.spec.ts` | Admin publish E2E |

### mesh-3d

| Path | Responsibility |
|------|----------------|
| `site/features/planner/open3d/catalog/modularCabinetV0.ts` | Cabinet modular dims |
| `site/features/planner/asset-engine/mesh/*` | GLB generate / stamp |
| `site/features/planner/open3d/catalog/workstationSystemV0.ts` | Workstation family |
| Historical evidence (reference only): `results/planner/world-standard-wave/08-mesh-quality/` | Prior W7 bar |

### shell-chrome / select-edit / canvas-2d / catalog-place / view-3d-orbit / save-persist / export-boq

| Path | Responsibility |
|------|----------------|
| `site/features/planner/open3d/editor/WorkspaceShell.tsx` | Shell chrome |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | 2D walls/draw/select |
| `site/features/planner/open3d/editor/InventoryPanel.tsx` | Catalog place UI |
| `site/features/planner/open3d/catalog/placementAction.ts` | Place actions |
| `site/features/planner/open3d/ui/Open3dNativeHost.tsx` | 2D↔3D host |
| Historical W-gate packs: `world-standard-wave/03-select-delete/` … `09-shortcuts-chrome/` | History only — re-prove under module evidence when claiming product complete |

---

## Per-module ritual (copy for every module after foundation docs)

Use this exact sequence. Do not skip seats to “save time.”

```
1. Pick ONE module (only)
2. Ensure modules/<m>/README.md states “global complete means” for THIS module
3. Brainstormer → modules/<m>/BRAINSTORM.md
4. UI expert     → modules/<m>/UI-EXPERT.md
5. Head          → modules/<m>/SYNTHESIS.md  (raised complete bar + OPEN list)
6. Head          → modules/<m>/TASK-LIST.md  (implement only after synthesis)
7. Implement + prove under modules/<m>/evidence/
8. Close modules/<m>/README.md status; update global-standard-revision/README.md table
9. Commit; then next module
```

**Expert brief template (subagent):**

```
/using-superpowers
Skills: brainstorming | (UI expert: verification + chrome-devtools if live UI)
Seat: brainstormer | ui-expert | synthesis-head
Checkout: D:\OandO07072026 only
Bar: Agents/Agents-ELON-STANDARD.md
Law: Plans/trustdata/GLOBAL-STANDARD-REVISION.md
Module: <name>
Write: results/planner/global-standard-revision/modules/<name>/<ARTIFACT>.md
No product code unless this brief is implement seat after SYNTHESIS.
Ethics: no competitor copy. GATE PASS ≠ product complete.
```

---

## Task 0: Program preflight (once)

**Files:**
- Read: `Plans/trustdata/GLOBAL-STANDARD-REVISION.md`
- Read: `results/planner/global-standard-revision/README.md`
- Read: `results/planner/global-standard-revision/modules/foundation/SYNTHESIS.md`
- Read: `results/planner/world-standard-wave/00-rebaseline/HONEST-STATUS.md`

- [ ] **Step 0.1: Confirm checkout and layout**

```powershell
cd D:\OandO07072026
git rev-parse --show-toplevel
git branch --show-current
pnpm run check:layout
```

Expected: toplevel = `D:/OandO07072026` (or equivalent), branch `main`, layout exit 0. No worktree path.

- [ ] **Step 0.2: Confirm dual-language seed exists (W0.F1)**

```powershell
Test-Path "results/planner/world-standard-wave/00-rebaseline/HONEST-STATUS.md"
Test-Path "results/planner/world-standard-wave/TRUTH-LOCK.md"
```

Expected: both `True`. If missing, stop — foundation cannot claim dual language.

- [ ] **Step 0.3: Record program start note**

Create `results/planner/global-standard-revision/modules/foundation/evidence/PREFLIGHT.md` with: date, HEAD short SHA, layout exit, dual-language paths checked.

```powershell
git rev-parse --short HEAD
```

- [ ] **Step 0.4: Commit preflight only if new file landed**

```powershell
git add results/planner/global-standard-revision/modules/foundation/evidence/PREFLIGHT.md
git commit -m "docs(global-standard): foundation preflight for module-wise program"
```

---

## Task 1: foundation — land W0.F2 BUYER-CONTRACT

**Files:**
- Create: `results/planner/world-standard-wave/00-start/BUYER-CONTRACT.md`
- Copy/link note: `results/planner/global-standard-revision/modules/foundation/evidence/BUYER-CONTRACT-PATH.md`
- Read first: `modules/foundation/BRAINSTORM.md` §1.1, `ayushdocs/18-PRODUCT-CONTEXT.md`

- [ ] **Step 1.1: Write BUYER-CONTRACT.md (path-provable one-pager)**

Must include these sections with concrete O&O wording (not empty headers):

1. **Who** — facilities / workplace buyer; non-developer  
2. **First session** — open `/planner/open3d` or guest → structure → place O&O SKUs → read plan  
3. **2D language** — Block2D on FeasibilityCanvas interim; SVG publish authority separate (see AUTHORITY-MAP)  
4. **3D language** — modular mesh readable parts (toe/carcass/door class), not photoreal  
5. **Edit loop** — select · move · delete · undo without leaving canvas  
6. **Return tomorrow** — local persist honesty; cloud not claimed  
7. **Money path** — dimensions + config feed quote/BOQ later (path > priced multi-tenant ship)  
8. **Explicit non-goals** — photoreal arms race, full Fabric before journey green, multiplayer/AR, competitor assets  

- [ ] **Step 1.2: Pointer file under module evidence**

Write `modules/foundation/evidence/BUYER-CONTRACT-PATH.md`:

```markdown
# W0.F2 proof
- Artifact: `results/planner/world-standard-wave/00-start/BUYER-CONTRACT.md`
- Date: <ISO date>
- HEAD: <short sha>
```

- [ ] **Step 1.3: Commit**

```powershell
git add results/planner/world-standard-wave/00-start/BUYER-CONTRACT.md `
  results/planner/global-standard-revision/modules/foundation/evidence/BUYER-CONTRACT-PATH.md
git commit -m "docs(foundation): W0.F2 buyer contract one-pager"
```

---

## Task 2: foundation — land W0.F3 AUTHORITY-MAP

**Files:**
- Create: `results/planner/world-standard-wave/00-start/AUTHORITY-MAP.md`
- Create: `results/planner/global-standard-revision/modules/foundation/evidence/AUTHORITY-MAP-PATH.md`
- Read: `results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty/NOTES.md`

- [ ] **Step 2.1: Write AUTHORITY-MAP.md**

Must freeze this truth table (update only if code changes; prove with paths):

| Concern | Authority today | Path / entry | Not authority |
|---------|-----------------|--------------|---------------|
| Plan 2D furniture marks | Block2D prims on FeasibilityCanvas | `furnitureBlock2D.ts` → `renderBlock2DToCanvas.ts` → `FeasibilityCanvas.tsx` | `public/svg-catalog/*.svg` |
| SVG file publish | `compileSvgForPublish` + CLI/admin | `asset-engine/svg/compileSvgForPublish.ts`, `scripts/generate-svg.mjs`, admin svg-editor API | Feasibility draw path |
| Walls / room structure interim | FeasibilityCanvas tools | `canvas-feasibility/FeasibilityCanvas.tsx` | Fabric full stage (destination) |
| Fabric destination | Approach A later | `canvas-fabric-stage/` (exists; not W-journey authority now) | Claiming Fabric is live plan editor |
| Modular 3D | generator / stamp GLB | `asset-engine/mesh/*`, modular cabinet-v0 / workstation | Free GLB dump catalog |
| Portal preview | `/portal/svg-catalog` | portal routes | Proves open3d place symbols |

Include honesty rules verbatim:

- Never claim portal/admin SVG publish proves canvas symbols unless wired end-to-end.  
- Never claim GATE PASS = product complete.  
- `generateCabinetV0Footprint` = mesh helper, not canvas Block2D.

- [ ] **Step 2.2: Evidence pointer + commit**

```powershell
git add results/planner/world-standard-wave/00-start/AUTHORITY-MAP.md `
  results/planner/global-standard-revision/modules/foundation/evidence/AUTHORITY-MAP-PATH.md
git commit -m "docs(foundation): W0.F3 authority map Block2D vs SVG vs mesh"
```

---

## Task 3: foundation — land W0.F4 ASSET-CENSUS

**Files:**
- Create: `results/planner/world-standard-wave/00-start/ASSET-CENSUS.md`
- Create: `results/planner/global-standard-revision/modules/foundation/evidence/svg-census.txt`
- Create: `results/planner/global-standard-revision/modules/foundation/evidence/ASSET-CENSUS-PATH.md`

- [ ] **Step 3.1: Run SVG census (exact commands)**

```powershell
cd D:\OandO07072026
$svgDir = "site\public\svg-catalog"
$svgs = Get-ChildItem -Path $svgDir -Filter "*.svg" -File
$svgs.Count | Set-Content -Encoding utf8 "results\planner\global-standard-revision\modules\foundation\evidence\svg-count.txt"
$svgs | Select-Object -ExpandProperty Name | Set-Content -Encoding utf8 "results\planner\global-standard-revision\modules\foundation\evidence\svg-list.txt"
# combined transcript
@(
  "date=$(Get-Date -Format o)",
  "head=$(git rev-parse --short HEAD)",
  "path=$svgDir",
  "count=$($svgs.Count)"
) + ($svgs | ForEach-Object { "file=$($_.Name)" }) |
  Set-Content -Encoding utf8 "results\planner\global-standard-revision\modules\foundation\evidence\svg-census.txt"
Get-Content "results\planner\global-standard-revision\modules\foundation\evidence\svg-census.txt"
```

Expected today (2026-07-10 baseline; re-run always): **count=4**

```
chaise-lounge-001.svg
missing-geom-fallback-001.svg
sectional-sofa-001.svg
side-table-001.svg
```

- [ ] **Step 3.2: Write ASSET-CENSUS.md**

Must include:

1. SVG file count + list (from census file, not memory)  
2. Statement: **Block2D is canvas authority**, not these files  
3. Placeholder SVGs under `site/public/placeholder-*.svg` — not catalog publish set  
4. Block2D coverage note: cabinet-v0 raised under historical CP-05; other SKUs residual  
5. Mesh note: cabinet-v0 / workstation partial; box residual OPEN  
6. Debt table: “demo fixtures ≠ O&O systems library”

- [ ] **Step 3.3: Pointer + commit**

```powershell
git add results/planner/world-standard-wave/00-start/ASSET-CENSUS.md `
  results/planner/global-standard-revision/modules/foundation/evidence/
git commit -m "docs(foundation): W0.F4 asset census SVG count truth"
```

---

## Task 4: foundation — residuals, pointer, close product-foundation slice

**Files:**
- Create: `results/planner/global-standard-revision/modules/foundation/evidence/RESIDUALS.md`
- Modify: `results/planner/global-standard-revision/modules/foundation/README.md`
- Modify: `results/planner/global-standard-revision/README.md` (status row)
- Optional modify: `Plans/trustdata/00-START.md` — one short “raised foundation” pointer to SYNTHESIS + F2–F4 paths (no ceremony rewrite)

- [ ] **Step 4.1: Write RESIDUALS.md (W0.F5)**

Explicit OPEN after foundation product docs (copy and keep honest):

- Full buyer journey W1–W8 not product-finished  
- SVG library for O&O systems (not 4 demos)  
- Cloud save OPEN  
- Fabric full stage OPEN  
- Photoreal mesh not a goal; readable modular mesh still OPEN residuals  
- Priced multi-tenant BOQ OPEN  

- [ ] **Step 4.2: Update foundation README status**

Set:

- Experts: DONE  
- Product foundation criteria: **PASS for F2–F4 paths** if Tasks 1–3 landed  
- Still **not** whole-product complete  

- [ ] **Step 4.3: Update program README status table**

Foundation row: Experts DONE · Product foundation docs **landed** · Product ship still OPEN.

- [ ] **Step 4.4: Commit**

```powershell
git add results/planner/global-standard-revision/modules/foundation/ `
  results/planner/global-standard-revision/README.md `
  Plans/trustdata/00-START.md
git commit -m "docs(foundation): close F2-F4 product-foundation landables + residuals"
```

**Stop rule:** Do not start symbols-svg implement until foundation F2–F4 files exist on disk and census was re-run.

---

## Task 5: symbols-svg — dual experts + synthesis (no code yet)

**Files:**
- Create/overwrite: `modules/symbols-svg/README.md` (raise complete bar)  
- Create: `modules/symbols-svg/BRAINSTORM.md`  
- Create: `modules/symbols-svg/UI-EXPERT.md`  
- Create: `modules/symbols-svg/SYNTHESIS.md`  
- Create: `modules/symbols-svg/TASK-LIST.md` (after synthesis only)

- [ ] **Step 5.1: Baseline census into this module**

```powershell
cd D:\OandO07072026
$out = "results\planner\global-standard-revision\modules\symbols-svg\evidence"
New-Item -ItemType Directory -Force -Path $out | Out-Null
$svgs = Get-ChildItem site\public\svg-catalog -Filter *.svg -File
@(
  "date=$(Get-Date -Format o)",
  "head=$(git rev-parse --short HEAD)",
  "count=$($svgs.Count)"
) + ($svgs | ForEach-Object { $_.Name }) |
  Set-Content -Encoding utf8 "$out\baseline-svg-census.txt"
```

- [ ] **Step 5.2: Dispatch brainstormer**

Seat writes `BRAINSTORM.md` covering:

- Manufacturer plan-symbol bar (readable at print-ish zoom)  
- What “SVG complete” means: **files on disk** for target SKUs + literacy (Block2D and/or SVG per authority map)  
- Target first SKUs: O&O modular cabinet-v0 family, workstation-v0 footprint marks, 2–3 seating/table system placeholders only if original  
- Inventory debt: 4 fixtures today; none are full O&O systems library  
- Honesty: Block2D remains Feasibility authority until explicitly rewired  
- Non-goals: competitor SVG, claiming portal = canvas, Fabric cutover  

- [ ] **Step 5.3: Dispatch UI expert**

Seat writes `UI-EXPERT.md` covering:

- Symbol literacy at default zoom and close zoom  
- Empty/missing geom fallback must not look like “finished SKU”  
- Selection outline vs symbol body contrast  
- A11y: canvas is visual; labels/status must not claim SVG library installed if census is 4  

- [ ] **Step 5.4: Head synthesis**

Write `SYNTHESIS.md` with:

| ID | Raised criterion | Proof path |
|----|------------------|------------|
| S.SVG.1 | Census command + N files listed | `modules/symbols-svg/evidence/*-census*` |
| S.SVG.2 | Target SKU list agreed | in SYNTHESIS / TASK-LIST |
| S.SVG.3 | Original SVG files exist for targets (or explicit Block2D-only residual per SKU) | `site/public/svg-catalog/<slug>.svg` |
| S.SVG.4 | Publish path smoke green for new fixtures | `pnpm p0:svg` log under evidence |
| S.SVG.5 | Block2D literacy for plan canvas targets still path-provable | vitest + optional PNG |
| S.SVG.6 | Honesty NOTES: canvas authority unchanged unless rewired | evidence/NOTES.md |

OPEN residuals list required. **GATE PASS on old CP-05 ≠ this module complete.**

- [ ] **Step 5.5: Write TASK-LIST.md from synthesis only**

No implement before this file exists.

- [ ] **Step 5.6: Commit expert pack**

```powershell
git add results/planner/global-standard-revision/modules/symbols-svg/
git commit -m "docs(symbols-svg): dual experts + synthesis + task list"
```

---

## Task 6: symbols-svg — implement proof (TDD + files on disk)

**Files (typical; refine from TASK-LIST):**
- Modify/create fixtures under `site/scripts/generate-svg/_fixtures/` (or project fixture path used by `generate-svg.mjs`)  
- Output: `site/public/svg-catalog/<slug>.svg`  
- Optional Block2D: `site/features/planner/open3d/catalog/furnitureBlock2D.ts`  
- Tests: existing cabinet-v0 Block2D tests + new fixture/unit as synthesis requires  
- Evidence: `modules/symbols-svg/evidence/`

**TDD note (mandatory when TypeScript changes):**

1. Write failing vitest for the new behavior  
2. Run and capture RED log  
3. Minimal implementation  
4. GREEN log  
5. Then CLI SVG write / browser PNG  

- [ ] **Step 6.1: RED — if Block2D or compile API changes**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath "..\results\planner\global-standard-revision\modules\symbols-svg\evidence\vitest-red.log"
```

Expected for intentional RED: fail on new assertion. If only adding SVG files via CLI with no TS change, skip RED and document “TS unchanged” in NOTES.

- [ ] **Step 6.2: Produce original SVG fixtures (no competitor geometry)**

Implement via **pipeline only** (CLI or admin later module) — do not hand-paste foreign SVG:

```powershell
cd D:\OandO07072026
pnpm p0:svg 2>&1 | Tee-Object -FilePath "results\planner\global-standard-revision\modules\symbols-svg\evidence\p0-svg-raw.log"
```

Expected: exit 0; fixtures ok ≥ baseline; new slugs appear if fixtures added.

- [ ] **Step 6.3: Re-census (must increase or document why not)**

```powershell
$svgs = Get-ChildItem site\public\svg-catalog -Filter *.svg -File
@(
  "date=$(Get-Date -Format o)",
  "head=$(git rev-parse --short HEAD)",
  "count=$($svgs.Count)"
) + ($svgs | ForEach-Object { $_.Name }) |
  Set-Content -Encoding utf8 "results\planner\global-standard-revision\modules\symbols-svg\evidence\post-implement-svg-census.txt"
```

Module complete requires: **count and list match SYNTHESIS targets**, not “pipeline code exists.”

- [ ] **Step 6.4: GREEN vitest pack (if TS touched)**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath "..\results\planner\global-standard-revision\modules\symbols-svg\evidence\vitest-green.log"
```

Expected: exit 0.

- [ ] **Step 6.5: Honesty NOTES**

Write `modules/symbols-svg/evidence/NOTES.md`:

- Canvas authority still Block2D unless rewired this module  
- SVG files prove **publish inventory**, not automatically plan marks  
- Anti-copy attestation: original descriptors only  

- [ ] **Step 6.6: Close module README + program status; commit**

```powershell
git add site/public/svg-catalog/ site/scripts/ site/features/ site/tests/ `
  results/planner/global-standard-revision/modules/symbols-svg/ `
  results/planner/global-standard-revision/README.md
git commit -m "feat(symbols-svg): original catalog SVGs + proof (module raised bar)"
```

---

## Task 7: admin-svg-pipeline — experts → synthesis → proof

**Files:**
- `modules/admin-svg-pipeline/README.md`, `BRAINSTORM.md`, `UI-EXPERT.md`, `SYNTHESIS.md`, `TASK-LIST.md`, `evidence/`  
- Product: `site/app/api/admin/svg-editor/route.ts`, `site/features/planner/admin/svg-editor/*`, `site/features/planner/asset-engine/svg/*`  
- E2E: `site/tests/e2e/admin-svg-publish-p01.spec.ts`

- [ ] **Step 7.1: Dual experts + synthesis** (same ritual as Task 5; write under `admin-svg-pipeline/`)

Raised complete means:

- Admin or CLI publish writes `public/svg-catalog/{slug}.svg`  
- Descriptor normalize → compile stages path-provable  
- Failure modes honest (missing geom → fallback slug, not silent success)  
- Portal route may preview; does **not** alone prove open3d place  

- [ ] **Step 7.2: TDD / E2E proof**

Unit first if pipeline code changes; then:

```powershell
cd D:\OandO07072026
# server must be up for admin E2E if required by spec
pnpm p0:admin-svg 2>&1 | Tee-Object -FilePath "results\planner\global-standard-revision\modules\admin-svg-pipeline\evidence\p0-admin-svg-raw.log"
```

Also CLI:

```powershell
pnpm p0:svg 2>&1 | Tee-Object -FilePath "results\planner\global-standard-revision\modules\admin-svg-pipeline\evidence\p0-svg-raw.log"
```

- [ ] **Step 7.3: Post-publish census** into `modules/admin-svg-pipeline/evidence/post-publish-census.txt` (same command pattern as Task 3).

- [ ] **Step 7.4: NOTES + close README + commit**

```powershell
git add results/planner/global-standard-revision/modules/admin-svg-pipeline/ site/
git commit -m "feat(admin-svg-pipeline): publish path proven to svg-catalog"
```

---

## Task 8: mesh-3d — experts → synthesis → implement proof

**Files:**
- Module pack under `modules/mesh-3d/`  
- Product: `asset-engine/mesh/*`, modular cabinet / workstation catalog modules  
- Historical reference only: `world-standard-wave/08-mesh-quality/`

- [ ] **Step 8.1: Experts + SYNTHESIS**

Raised bar: readable multipart (toe / carcass / door or workstation legs/stretchers), not photoreal; residual “boxy” listed OPEN or fixed with proof.

- [ ] **Step 8.2: TDD**

```powershell
cd D:\OandO07072026\site
# adjust test paths from SYNTHESIS TASK-LIST — example pack:
pnpm exec vitest run tests/unit/features/planner --reporter=verbose 2>&1 |
  Select-String -Pattern "cabinet|workstation|mesh|modular" 
```

Prefer exact files named in TASK-LIST. Capture RED then GREEN under `modules/mesh-3d/evidence/`.

- [ ] **Step 8.3: Visual proof (browser)**

```powershell
cd D:\OandO07072026
pnpm run dev
# Playwright or chrome-devtools: place cabinet-v0 + workstation, 3D three-quarter + side
# Save PNGs ONLY under:
# results/planner/global-standard-revision/modules/mesh-3d/evidence/
```

- [ ] **Step 8.4: Close + commit** when SYNTHESIS criteria path-proven (not when old W7 folder exists).

---

## Task 9: shell-chrome — experts → synthesis → implement proof

**Files:**
- `modules/shell-chrome/` pack  
- Product: `WorkspaceShell.tsx`, tool/status chrome, shortcut handlers  
- History: `world-standard-wave/09-shortcuts-chrome/`

- [ ] **Step 9.1: Experts + SYNTHESIS**

Raised bar: mode/tool/selection status never lie; a11y landmarks/labels; keyboard shortcuts match UI.

- [ ] **Step 9.2: TDD unit for shortcut/tool truth; browser PNG optional but preferred.**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit --reporter=verbose 2>&1 |
  Tee-Object -FilePath "..\results\planner\global-standard-revision\modules\shell-chrome\evidence\vitest-raw.log"
```

Use TASK-LIST to narrow to the real test files (do not claim full monorepo green as module complete).

- [ ] **Step 9.3: Close + commit** only with honest OPEN residuals (e.g. fresh Lighthouse if still HALF).

---

## Task 10: Journey modules (serial — one complete each)

Execute **in this order** unless owner pain reorders. Each gets full ritual: README → BRAINSTORM → UI-EXPERT → SYNTHESIS → TASK-LIST → implement proof → close.

### 10A: select-edit

- Product: selection, delete, undo on FeasibilityCanvas  
- History ref: `world-standard-wave/03-select-delete/`  
- Proof: unit + Playwright PNGs under `modules/select-edit/evidence/`  
- **GATE old CP-03 PASS ≠ module complete** — re-prove or list residual  

### 10B: canvas-2d

- Product: walls/draw structure journey  
- Product path: `FeasibilityCanvas.tsx`  
- History ref: journey half of `02-browser-open3d-journey/`, draw notes in product-truth  
- Proof: wall drawn PNG + NOTES under `modules/canvas-2d/evidence/`  

### 10C: catalog-place

- Product: inventory place ≥2 SKUs including modular cabinet-v0 / systems  
- Paths: `InventoryPanel.tsx`, `placementAction.ts`, systems configurator  
- History: `07-systems-v0/`  
- Proof: place PNGs + unit under `modules/catalog-place/evidence/`  

### 10D: view-3d-orbit

- Product: 2D↔3D pose continuity; orbit ON in 3D  
- Paths: `Open3dNativeHost.tsx`, Three viewer layers  
- History: `04-orbit-continuity/`  
- Proof: 2D → 3D orbit → 2D restore PNGs under `modules/view-3d-orbit/evidence/`  

### 10E: save-persist

- Product: local save/reload honesty; labels must not claim cloud  
- History: `06-save-honesty/`  
- Proof: before-save / saved-local / hard-reload PNGs under `modules/save-persist/evidence/`  

**Per journey module commit pattern:**

```powershell
git add results/planner/global-standard-revision/modules/<m>/ site/
git commit -m "feat(<m>): raised global-standard proof for module"
```

**TDD:** any code change → RED/GREEN vitest logs in that module’s `evidence/` before browser claim.

---

## Task 11: export-boq

**Files:**
- `modules/export-boq/` full ritual  
- Product: export/BOQ/quote path code as discovered in SYNTHESIS (search before inventing)

```powershell
cd D:\OandO07072026\site
rg -n "BOQ|billOfQuantit|exportQuote|quote" --glob "*.{ts,tsx}" features/planner app
```

- [ ] **Step 11.1: Experts + SYNTHESIS** — money path honesty (demo vs priced product)  
- [ ] **Step 11.2: Implement only path-proven quote path improvements named in SYNTHESIS**  
- [ ] **Step 11.3: Evidence under `modules/export-boq/evidence/`** — never claim multi-tenant priced BOQ without product  
- [ ] **Step 11.4: Commit**

---

## Task 12: evidence-handover (last)

**Files:**
- `modules/evidence-handover/README.md`, experts optional if pack-only, `SYNTHESIS.md`, pack artifacts  
- Do **not** run this as a fake “everything complete” sticker  

- [ ] **Step 12.1: Build pack that admits module statuses**

Write:

- `modules/evidence-handover/MODULE-STATUS.md` — table copied from program README with honest OPEN  
- `modules/evidence-handover/BACKUP-LOG.md` — origin + mayoite push attempts  
- `modules/evidence-handover/HEAD.txt` — `git rev-parse HEAD`  
- `modules/evidence-handover/W-GATES-VS-MODULES.md` — map old W-gates → modules; **GATE PASS ≠ product**

- [ ] **Step 12.2: Dual scoreboard refresh**

Update `results/planner/world-standard-wave/00-rebaseline/HONEST-STATUS.md` date/HEAD and residuals after modules.

- [ ] **Step 12.3: Push policy (agent call)**

```powershell
git push origin main
# mayoite mirror when ~45m / big land
git push mayoite main
```

Log failures in BACKUP-LOG — do not claim backup if push failed.

- [ ] **Step 12.4: Final program README** — all modules status honest; commit handover.

```powershell
git add results/planner/global-standard-revision/ results/planner/world-standard-wave/00-rebaseline/HONEST-STATUS.md
git commit -m "docs(evidence-handover): module-wise pack admits residuals"
```

---

## Exact command cheat sheet

| Purpose | Command |
|---------|---------|
| Layout | `pnpm run check:layout` |
| Typecheck | `pnpm run typecheck` |
| SVG fixtures → catalog | `pnpm p0:svg` |
| Admin SVG E2E | `pnpm p0:admin-svg` |
| Open3d world e2e pack | `pnpm test:e2e:open3d-world` |
| Open3d gate | `pnpm gate:open3d` |
| Dev server | `pnpm run dev` → http://localhost:3000 |
| SVG census | PowerShell `Get-ChildItem site\public\svg-catalog -Filter *.svg` (see Task 3) |
| Block2D unit | `cd site; pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts` |

**Evidence redirect:** if any tool writes under `site/results` or `site/test-results`, move/fix config to repo-root `results/` and re-run `pnpm run check:layout`.

---

## Ethics (non-negotiable)

- Ideas/JTBD only from research; **no** competitor assets, brand paste, or geometry theft.  
- Licenses: `ayushdocs/17-LICENSES-CLEARED.md`. Secrets only in `.env.local`.  
- Original O&O descriptors → pipeline → `svg-catalog`.  

---

## Self-review (plan writer)

### 1. Spec coverage (`GLOBAL-STANDARD-REVISION.md`)

| Law requirement | Plan task |
|-----------------|-----------|
| Kill CP-folder theater; modules only | Header + Task 0; evidence paths under `modules/<m>/` |
| Per-module workflow serial | Per-module ritual + Tasks 5–12 |
| foundation first (experts done) | Tasks 1–4 land F2–F4 |
| symbols-svg pain second | Tasks 5–6 |
| admin-svg-pipeline third | Task 7 |
| mesh-3d then shell then journey | Tasks 8–10 |
| export-boq then evidence-handover | Tasks 11–12 |
| GATE PASS ≠ complete | Hard rules + every module close step |
| No competitor copy | Ethics + symbols/admin steps |
| Trustdata CP history only | File map + journey “history ref” wording |

### 2. Placeholder scan

- No TBD/TODO “fill later” steps.  
- Commands are concrete PowerShell/pnpm.  
- Where test file lists depend on future SYNTHESIS (mesh/journey), plan requires TASK-LIST to name exact paths before implement — not a free-form “write tests.”  

### 3. Type / path consistency

- Authority names match honesty NOTES: Block2D canvas vs `compileSvgForPublish` publish.  
- Evidence root consistently `results/planner/global-standard-revision/modules/<m>/`.  
- F2–F4 paths match foundation SYNTHESIS (`00-start/BUYER-CONTRACT.md`, `AUTHORITY-MAP.md`, `ASSET-CENSUS.md`).  
- Baseline SVG count **4** verified 2026-07-10 on disk.  

### 4. Intentional scope limits

- This plan **does not** re-implement full historical P05–P09 code if already green — it requires **module-raised re-proof** under new folders.  
- Journey modules share a ritual rather than 50 duplicated micro-steps; each still must produce SYNTHESIS + path-provable evidence before close.  
- No product code in plan-writer seat; implement seats follow TDD when code appears.  

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-10-global-standard-modules.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task (or per module seat: brainstormer → UI expert → synthesis → implement), head reviews between seats.  
2. **Inline Execution** — same session with executing-plans, checkpoint after each numbered task.

**Start now:** Task 0 → Tasks 1–4 (foundation F2–F4) → Task 5 (symbols-svg experts) before any SVG product thrash.
