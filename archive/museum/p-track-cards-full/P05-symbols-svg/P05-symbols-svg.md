# P05 — W2 Symbol Quality + SVG Path Honesty

## Phase status (complete)

| Item | Status | Evidence |
|------|--------|----------|
| W2 symbols / CP-05 | **PASS** 2026-07-09 | `results/planner/world-standard-wave/05-symbols-svg/` |
| Unit | 17/17 green | `CP-05-vitest-raw.log`; `elon-reproof/vitest-reproof-raw.log` |
| Hard stop | all required rows green | `elon-reproof/SUMMARY.md` + `elon-reproof/run.json` |
| Honesty | Block2D canvas · SVG publish | `04-svg-honesty/NOTES.md` |
| Visual | prim-JSON (not empty box) | `05-visual/cabinet-v0-prims.json` |
| Pack | `CP-05.json` status=pass | `SUMMARY.md` |

Task checkboxes below are historical execute steps — evidence supersedes; do not re-open symbol thrash.

## Structure rewrite 2026-07-09

**Hybrid thin:** Execute card here. Full TypeScript test/impl skeletons → **[P05-appendix.md](../../../archive/Plans/phases/P05-symbols-svg/P05-appendix.md)**. Evidence folder unchanged: `05-symbols-svg/`. One CP — do not split SVG honesty into a second gate.

### Expert pass P0 (2026-07-09)

- **Block2D = plan-symbol authority** on Feasibility (`furnitureBlock2DFromItem` → `renderBlock2DCentered`). Never claim `/svg-catalog/*.svg` or `compileSvgForPublish` as Feasibility draw path.
- **`furnitureBlockUsesCenteredPath` must be always `false`** (live: `true` for modular-cabinet-v0 while prims are top-left — dead lie).
- **Prove W2 symbol work with Fabric flag OFF**; flag-ON Rect overlay is not W2. Keep `canvas-fabric-stage/` (destination after W — do not delete).
- Raise modular cabinet-v0 prims (stop empty-box bar); unknown-SKU non-empty fallback; no competitor SVG.
- Authority: [EXPERT-PASS.md](../EXPERT-PASS.md) · [02-canvas-2d.md](../../../archive/Plans/phases/P05-symbols-svg/02-canvas-2d.md).

> **For agentic workers:** REQUIRED: `/using-superpowers` (TDD, verification, chrome-devtools as fit).  
> **Checkout:** `D:\OandO07072026` only · no worktrees · commit as you go · push only on ask.  
> **W0 UNLOCKED** — execute per phase + evidence. Do not re-ask owner unlock.  
> **Commits:** `trustdata(P05): <slice>` or `fix(open3d): <slice>`.

**Prev:** [P04-orbit-continuity.md](../P04-orbit-continuity/P04-orbit-continuity.md) · **Next:** [P06-save-honesty.md](../P06-save-honesty/P06-save-honesty.md)  
**Kill-order role:** Parallel **fill #7** after CP-02 ([program index](../../BOARD.md#week-1-kill-order-after-implementation-unlock)).

**Goal:** Make open3d plan-view furniture symbols **readable** for **cabinet-v0** (stop empty-box marks) and write an honest SVG story: **Block2D = canvas authority now; admin/CLI SVG = publish authority later** — not competitor assets.

**Architecture:** FeasibilityCanvas draws via `furnitureBlock2DFromItem` → `renderBlock2DCentered` (top-left prims; canvas centers). Raise modular cabinet-v0 Block2D prims (carcass, door cues, handles, front/back). Fix dead lie `furnitureBlockUsesCenteredPath` (must be `false`). Document SVG pipeline without claiming canvas loads `/svg-catalog/*.svg` today.

**Tech:** TypeScript · Vitest · Canvas 2D · Block2D · modular cabinet-v0 · asset-engine SVG · optional Playwright visual · evidence under `05-symbols-svg/`.

**Gate / CP:** **W2 symbol quality half** / **CP-05**. Place journey = **P07**. Mesh beauty = **P08**.

**Evidence root:** `results/planner/world-standard-wave/05-symbols-svg/`  
Minimum: `run.json` + unfiltered `*-raw.log` per automated slice; `NOTES.md`; visual PNG or prim-JSON.

**Ethics:** Original O&O prims only. No competitor SVG/JS/GLB. MIT packages already in tree only.

**Depends:** P01 + P02. Does not require P03 for unit symbol work.

**Out of scope:** P08 mesh · Fabric cutover · SVGR · CDN SVG · Feasibility loading public SVG as draw path · confusing `generateCabinetV0Footprint` (mesh helper) with Block2D canvas authority.

---

## File map

| Path | Responsibility |
|------|----------------|
| `site/features/planner/open3d/catalog/furnitureBlock2D.ts` | **Primary:** richer `modularCabinetBlock`; `furnitureBlockUsesCenteredPath` → `false` |
| `site/lib/catalog/renderBlock2DToCanvas.ts` | Paint prim kinds if missing |
| `site/lib/catalog/blocks2d.ts` | Styles only if needed |
| `site/features/planner/open3d/catalog/modularCabinetV0.ts` | Optional shared dims |
| `site/features/planner/open3d/model/types.ts` | Read `Open3dModularCabinetV0Options` |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Wire already correct; touch only if needed |
| `site/features/planner/asset-engine/README.md` | Canvas vs publish honesty |
| `site/public/svg-catalog/*.svg` | CLI/admin only — never hand-paste competitor SVG |
| `site/tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts` | Unknown-SKU non-empty fallback |
| `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts` | **Create** TDD home |
| `results/planner/world-standard-wave/05-symbols-svg/` | Evidence |

**Authority (must stay honest):**

```
Plan canvas → furnitureBlock2DFromItem → Block2D prims (top-left) → renderBlock2DCentered
  (AUTHORITY FOR W2 PLAN SYMBOLS TODAY)

Admin/CLI → compileSvgForPublish → public/svg-catalog/{slug}.svg
  (PUBLISH AUTHORITY — NOT Feasibility draw path today)

generateCabinetV0Footprint = mesh helper path string — NOT canvas Block2D.
```

---

## Tasks

### Task 00 — Baseline

- [ ] **00.1** Main checkout only (`D:\OandO07072026`).
- [ ] **00.2** Inventory greps (expect modularCabinet ~2 prims today; centeredPath wrong true):

```powershell
cd D:\OandO07072026\site
rg -n "furnitureBlock2DFromItem|modularCabinetBlock|furnitureBlockUsesCenteredPath|compileSvgForPublish" features/planner/open3d lib/catalog features/planner/asset-engine
```

- [ ] **00.3** Baseline vitest → `05-symbols-svg/00-baseline/vitest-raw.log` + `run.json` + NOTES (template in [appendix](../../../archive/Plans/phases/P05-symbols-svg/P05-appendix.md#baseline-notes-template)).
- [ ] **00.4** Commit baseline if unlocked: `trustdata(P05): baseline notes for W2 symbols/SVG honesty`.

### Task 1 — RED unit: cabinet-v0 not empty box

- [ ] **1.1** Create `furnitureBlock2D.cabinet-v0.test.ts` from **[full skeleton in appendix](../../../archive/Plans/phases/P05-symbols-svg/P05-appendix.md#task-1-full-test-skeleton)**.
- [ ] **1.2** Cases: footprint dims; ≥4 prims carcass+front+door cue; prims inside footprint; pair mid stile / slab none; `furnitureBlockUsesCenteredPath` false; canvas fill+stroke; no external SVG/GLB URLs.
- [ ] **1.3** Run RED → `01-red/vitest-raw.log` + run.json (expect non-zero).
- [ ] **1.4** Commit red tests.

### Task 2 — GREEN: readable `modularCabinetBlock`

- [ ] **2.1** Implement from **[appendix impl skeleton](../../../archive/Plans/phases/P05-symbols-svg/P05-appendix.md#task-2-modularcabinetblock-skeleton)** — top-left prims; slab ≠ pair (mid stile only on pair); no competitor paths; no `/svg-catalog` load; no mesh redesign.
- [ ] **2.2** Fix `furnitureBlockUsesCenteredPath` → always `false` + honest JSDoc.
- [ ] **2.3** GREEN pack: cabinet-v0 test + renderBlock2DToCanvas → `02-green/`.
- [ ] **2.4** Commit: `fix(open3d): readable cabinet-v0 Block2D plan symbol for W2 (P05)`.

### Task 3 — Unknown SKU non-empty guard

- [ ] **3.1** Add unknown-SKU box fallback case only (do not re-test demo-desk) — [snippet](../../../archive/Plans/phases/P05-symbols-svg/P05-appendix.md#task-3-unknown-sku).
- [ ] **3.2** Run → `03-nonempty/`; fix only if RED.
- [ ] **3.3** Commit guard.

### Task 4 — SVG honesty (publish ≠ canvas)

**Gate split:** SVG smoke = honesty evidence, **not** automatic W2 symbol fail. Do not claim smoke green without exit 0.

- [ ] **4.1** `pnpm run scripts:smoke:svg:batch` → `04-svg-honesty/svg-batch-raw.log`.
- [ ] **4.2** Write honesty NOTES ([template](../../../archive/Plans/phases/P05-symbols-svg/P05-appendix.md#svg-honesty-notes)).
- [ ] **4.3** Append Canvas vs publish section to asset-engine README ([text](../../../archive/Plans/phases/P05-symbols-svg/P05-appendix.md#readme-canvas-vs-publish)).
- [ ] **4.4** Commit honesty slice.

### Task 5 — Visual evidence

- [ ] **5.1** Prefer Playwright place PNG of cabinet-v0 if place works; else prim JSON dump ([appendix](../../../archive/Plans/phases/P05-symbols-svg/P05-appendix.md#visual-prim-dump)).
- [ ] **5.2** Readable when: outer carcass; front ≠ back; doorStyle geometry differs; not undetailed fill; no competitor art.
- [ ] **5.3** Commit under `05-visual/`.

### Task 6 — CP-05 pack

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\05-symbols-svg\CP-05-vitest-raw.log
```

- [ ] **6.1** Write `CP-05.json` + `SUMMARY.md` ([shapes](../../../archive/Plans/phases/P05-symbols-svg/P05-appendix.md#cp-05-json-shape)).
- [ ] **6.2** `status: pass` only if: unit green · visual criteria · honesty NOTES · centeredPath false. Smoke may skip without failing symbol half if NOTES do not claim smoke green.
- [ ] **6.3** Final commit: `trustdata(P05): CP-05 W2 symbol quality + SVG honesty pack`.

---

## CP-05 hard stop

| Check | Pass condition |
|-------|----------------|
| Unit | cabinet-v0 test green + log + run.json |
| Non-empty | Modular + box fallback have prims |
| Door style | pair mid stile; slab none |
| CenteredPath | helper false for modular |
| Honesty | NOTES: Block2D canvas; SVG publish |
| SVG smoke | Optional for symbol half; required if claiming smoke |
| Ethics | No competitor SVG |
| Visual | PNG or prim JSON + NOTES |
| Scope | No mesh redesign, Fabric cutover, SVGR |

If required row fails: stop; log `Failures.md`; do not mark W2 symbol half green.

---

## Commands cheat sheet

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts --reporter=verbose
pnpm run scripts:smoke:svg:batch
pnpm dev   # /planner/open3d → place cabinet-v0 → inspect 2D
```

---

## Expert note summary (2026-07-09)

From [P05-suggestions](../../../archive/Plans/phases/P05-symbols-svg/P05-suggestions.md): centeredPath honesty; doorStyle geometry differs; run.json + commit shape; Task 3 de-dupe; SVG smoke ≠ automatic W2 fail. Full skeletons in appendix.

**Handoff:** Subagent-driven Tasks 00→6 after unlock. No product code until unlock.
