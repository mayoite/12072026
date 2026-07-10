# CODE-REVIEW-REPORT — P05 Symbols SVG (idiotplanners2)

| Field | Value |
|-------|--------|
| **Phase** | P05 Symbols SVG (W2 symbol half · CP-05) |
| **Date** | 2026-07-10 |
| **Reviewer** | Review agent (repo-first · plan-vs-live · no implement) |
| **Mode** | Read-only · **no product code** · **no plan edits** |
| **Plan** | `D:\OandO07072026\plans2/P05-symbols-svg\IMPLEMENTATION-PLAN.md` |
| **Brainstormer (plan input)** | `Idiots/P05-symbols-svg/REPORT.md` only (not Idiots2) |
| **Checkout** | `D:\OandO07072026` main only (`cb62c4e` tip; dirty tree elsewhere) |
| **Evidence root (required)** | `results/planner/world-standard-wave/05-symbols-svg/` |

---

## Verdict

**APPROVE WITH FIXES — residual-only execute (evidence / honesty / visual / CP pack)**

Live **product symbol stack is already raised and unit-green**. Do **not** thrash `modularCabinetBlock`, re-apply appendix `BLOCK_STYLE.storage` fill, or “restore” centeredPath.  

**CP-05 / W2 symbol PASS is BLOCKED** on this checkout: root `results/` is **missing** → every historical PASS is **paper until re-proved**. Execute Tasks **00–01** and **04–07** only (Task **02–03** skip-if-green). Place journey remains **P07**.

---

## Executive summary

P05 is two coupled honesty problems, not “pretty SVG icons”:

1. **Symbol quality:** cabinet-v0 plan mark must be multi-prim, front≠back, doorStyle-divergent, light surface fill.
2. **SVG story:** Block2D owns FeasibilityCanvas today; `compileSvgForPublish` → `public/svg-catalog` is publish-only; portal must never be claimed as plan-symbol proof.

**Repo reality 2026-07-10:** both product halves of (1) and the README half of (2) are already in tree. Plan §1 is accurate. Appendix “2-prim empty box” / storage-fill skeletons are **stale** vs live code.

| Surface | Live state |
|---------|------------|
| `modularCabinetBlock` | Multi-prim ≥4; pair stile+2 handles / slab 1 offset / none shelves; `BLOCK_STYLE.surface` outer |
| `furnitureBlockUsesCenteredPath` | Always `false` |
| Feasibility draw | `furnitureBlock2DFromItem` → `renderBlock2DCentered` · **no** `/svg-catalog` load |
| Fabric furniture flag | Default **OFF** |
| Unit suites (this review) | **22/22 PASS** (13 cabinet-v0 + 9 render/unknown/stroke) |
| `results/` | **MISSING** entire tree → phase **unproven** |

Plan quality is high: skip-if-green, surface-fill lock, doorStyle contract, false-green catalog, Path A/B/C authority graph, P07 split. Residual work is **evidence discipline**, not geometry rewrite.

---

## Repo truth table

| Claim / surface | Live path | Live state 2026-07-10 | Plan accuracy |
|-----------------|-----------|------------------------|---------------|
| Hero modular Block2D | `site/features/planner/open3d/catalog/furnitureBlock2D.ts` | `modularCabinetBlock`: outer+inner+front+back + doorStyle branches; surface fill | Correct (“already past empty-box”) |
| Resolution order | same · `furnitureBlock2DFromItem` | modular → workstation → catalog bridge → generic → `boxBlock` | Correct |
| centeredPath | `furnitureBlockUsesCenteredPath` | **always `false`** + honest JSDoc | Correct (verify-only) |
| Unknown SKU | box / generic fallback | ≥1 rect; unit locks nonempty | Correct |
| Canvas paint + stroke floor | `site/lib/catalog/renderBlock2DToCanvas.ts` | `resolveCanvasStrokeWidthMm` max(mm, minScreenPx/scale); `renderBlock2DCentered` translate −L/2,−D/2 | Correct |
| Feasibility Path B | `FeasibilityCanvas.tsx` ~583–630 | layer furniture → Block2D → translate/rotate/scale → centered render; selection dash | Correct |
| Feasibility loads svg-catalog? | FeasibilityCanvas | **No** matches for `svg-catalog` / `compileSvgForPublish` | Correct |
| Mesh footprint helper | `modularCabinetV0.ts` `generateCabinetV0Footprint` | Centered path string `M -halfW -halfD … Z`; used mesh/parametric — **not** Block2D canvas | Correct |
| Publish Path C | `compileSvgForPublish` + admin publish | Public: `chaise-lounge-001`, `sectional-sofa-001`, `side-table-001`, `missing-geom-fallback-001` only | Correct (no cabinet-v0 plan SVG authority) |
| Honesty README | `site/features/planner/asset-engine/README.md` | Section **Canvas vs publish SVG (P05 honesty)** present | Correct (Task 04 skip rewrite) |
| Fabric flag | `fabricFurnitureFlag.ts` + `OOPlannerWorkspace` | Env `=== "1"` only; ON forces Feasibility furniture **off** | Correct (W2 proof = OFF) |
| cabinet-v0 unit suite | `furnitureBlock2D.cabinet-v0.test.ts` | **13** cases (footprint, contrast, stile, handles, none, centeredPath, no URL) | Correct |
| render / unknown suite | `renderBlock2DToCanvas.test.ts` | Stroke floor + paint + modular contrast + unknown nonempty + degen clamp | Correct |
| Vitest re-proof (this review) | both files above | **22 passed / 0 failed** · exit 0 · ~2.8s | Plan expect PASS — **met in process, not on disk under results/** |
| Evidence `05-symbols-svg/` | `results/planner/world-standard-wave/05-symbols-svg/` | **Absent** (`results/` does not exist) | Correct hard gap |
| Historical CP-05 PASS | phase / Idiots process notes | **Unproven** without artifacts | Correct fail-closed |
| Expert “≈2 prims” baseline | phase appendix / old prose | Live multi-prim ≥4 (pair 7 / slab 5 / none 6) | Plan correct: code wins |
| Competitor assets in plan path | modular payload / tests | Unit forbids `.glb`/`.svg`/`svg-catalog` in block JSON; no CDN in modular | Correct |
| Place ≥2 journey | P07 | Out of P05 scope; `browserPlaceJourney: deferred-to-P07` | Correct |
| Plan task checkboxes | IMPLEMENTATION-PLAN Tasks 00–07 | All still `- [ ]` (evidence not landable yet) | Expected for pre-execute review |

### doorStyle geometry (live = plan contract)

| doorStyle | Live prim language | Prim count (800×400 default) |
|-----------|--------------------|------------------------------|
| **pair** | Mid vertical stile @ w/2 + **2** handle rects | 7 |
| **slab** | **0** mid stile + **1** offset handle | 5 |
| **none** | **0** stile/handles + **≥2** dashed horizontal shelves | 6 |

Outer fill token: `var(--block-surface)` — **not** `block-storage` / inverse-body.

### Vitest re-proof (this review — not CP evidence)

```
pnpm exec vitest run \
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts \
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts --reporter=verbose
→ Test Files 2 passed · Tests 22 passed · exit 0
```

**Honesty:** this run is **review-local**. Without tee into `results/.../01-unit-reprove/`, it does **not** satisfy CP-05 Done item 1 for the program.

---

## Findings

### Blocking (B)

| ID | Finding | Why blocking |
|----|---------|--------------|
| **B1** | Root `results/` missing; no `05-symbols-svg/` tree | AGENTS + plan: PASS without root artifacts is invalid. Historical CP-05 is paper. |
| **B2** | No `CP-05.json` / `SUMMARY.md` with split `symbolQuality` vs `svgHonestySmoke` | Done criteria §8; cannot close phase or claim W2 symbol half. |
| **B3** | No honesty NOTES under evidence (`04-svg-honesty/NOTES.md`) | README honesty in product is **not** substitute for CP NOTES refusing the eight false claims. |

### High (H)

| ID | Finding | Impact |
|----|---------|--------|
| **H1** | No visual prim-JSON (pair/slab/none) under `05-visual/` | Unit count alone insufficient per raised bar / Done §7; buyer never runs vitest. |
| **H2** | SVG smoke batch not re-run into evidence (optional for symbol half, required for honest smoke claims) | Without log, NOTES must not claim pipeline green. |
| **H3** | Fabric flag-ON screenshots risk if someone “proves” symbols via Rect overlay | Policy already in plan; must stay OFF in CP NOTES. |
| **H4** | Full product W2 needs **P05 + P07** | Symbol green alone ≠ unaided place journey; do not market W2 complete from P05 only. |

### Medium (M)

| ID | Finding | Impact |
|----|---------|--------|
| **M1** | Review-time vitest green is not yet written under `01-unit-reprove/` | Executor must still run Task 01 unfiltered tee — do not cite this report as CP log. |
| **M2** | `furnitureBlock2DFromItem.toString()` URL guard is weak against bundling/minify | Ethics still needs review discipline + prim-JSON inspect; keep test, don’t overclaim. |
| **M3** | Phase appendix / expert skeleton still show storage fill / 2-prim baseline | Stale docs can re-blob if executor pastes appendix over live code — plan forbids; residual doc drift outside this file. |
| **M4** | `furnitureBlockUsesCenteredPath` historical name remains | Debt only (plan open Q7); always-false is correct behavior. |

### Low (L)

| ID | Finding | Impact |
|----|---------|--------|
| **L1** | Public svg-catalog has no cabinet-v0 fixture | Correct for honesty (publish ≠ plan); do not invent catalog SVG as “symbol fix.” |
| **L2** | Workstation suite adjacent, not CP-05 hero | Plan optional; fine to leave. |
| **L3** | Related e2e `open3d-mesh-symbol-live-verify` under other evidence paths | Must not substitute for `05-symbols-svg/`. |

---

## Already exists (do not thrash)

| Artifact | Status |
|----------|--------|
| `modularCabinetBlock` multi-prim + doorStyle + surface fill | **SHIPPED** |
| `furnitureBlockUsesCenteredPath` → false | **SHIPPED** |
| Unknown SKU nonempty / box fallback | **SHIPPED** |
| `resolveCanvasStrokeWidthMm` stroke floor | **SHIPPED** |
| Feasibility Path B wire | **SHIPPED** |
| Asset-engine README P05 honesty section | **SHIPPED** |
| cabinet-v0 unit suite (13) | **SHIPPED** · green this review |
| renderBlock2DToCanvas suite (unknown + contrast) | **SHIPPED** · green this review |
| Fabric flag default OFF | **SHIPPED** |
| `generateCabinetV0Footprint` as mesh helper only | **SHIPPED** (correct separation) |
| Publish fixtures under `site/public/svg-catalog/` | **SHIPPED** (Path C only) |
| Implementation plan (idiotplanners2) | **Present** · tasks unchecked |

---

## Residual (executor only — no product rewrite expected)

| Task (plan) | Required residual | Skip if |
|-------------|-------------------|---------|
| **00** | Create `results/planner/world-standard-wave/05-symbols-svg/{00–06}/` + baseline NOTES + rg-raw | Never skip |
| **01** | Unfiltered vitest tee → `01-unit-reprove/` + run.json | Never skip |
| **02–03** | RED analysis / restore modular or paint | **Skip if Task 01 exit 0** (expected) |
| **04** | Honesty NOTES + optional smoke log; README already OK | Never skip NOTES |
| **05** | Dump pair/slab/none prim JSON + visual NOTES | Never skip prim-JSON |
| **06–07** | CP-05.json + SUMMARY (`symbolQuality` / `svgHonestySmoke` split; `browserPlaceJourney: deferred-to-P07`) | Never skip |

**Forbidden residual mistakes:**

- Re-apply `BLOCK_STYLE.storage` outer fill from appendix.
- Wire Feasibility to `/svg-catalog/*.svg`.
- Claim Fabric flag-ON Rects as W2 symbols.
- Treat SVG smoke green as symbol quality.
- Treat non-blank PNG as readable cabinet without doorStyle geometry.
- Paste competitor path `d=` into modular prims.

---

## False-green evaluation

| Trap | Live risk | Mitigation (plan + this review) |
|------|-----------|----------------------------------|
| Historical CP-05 PASS without `results/` | **ACTIVE** — tree missing | Fail-closed; recreate evidence |
| Unit green = phase done | **ACTIVE** if executor stops after Task 01 | Require visual + honesty + CP pack |
| SVG smoke / portal catalog = plan symbols | Medium if marketing notes loose | NOTES eight false claims + README |
| Fabric flag-ON screenshots | Medium | Flag OFF policy; workspace forces Feasibility furniture off when ON |
| Prim count ≥4 garbage lines | Low — tests lock stile/handles/front-back/fill | Keep suite; dump prim-JSON |
| Storage fill “restore from appendix” | High if wrong executor | Plan + tests forbid; review kill-order |
| Non-blank canvas PNG as symbol quality | Medium via P07 bleed | P05 owns geometry; P07 anti-false-green |
| mesh footprint / GLB as 2D symbol proof | Low if confused with `generateCabinetV0Footprint` | Authority graph Path B only |
| Review-local vitest in this report as CP log | Medium | Explicit: not under `results/` → not CP |
| E2E mesh-symbol folder as CP-05 | Medium | Wrong path; not substitute |

**Rule for this checkout:** `results/` missing = **unproven**. No PASS column.

---

## Score

| Dimension | Score (0–10) | Notes |
|-----------|--------------|-------|
| Plan vs live code honesty | 9.5 | §1 matches tree; skip-if-green correct |
| Symbol geometry (cabinet-v0) | 9 | Raised bar met in code + unit |
| SVG/canvas authority honesty (product docs) | 8.5 | README good; evidence NOTES missing |
| Unit lock quality | 9 | 13+9 cases; contrast + doorStyle + URL |
| Visual / buyer proof on disk | 1 | No prim-JSON / PNG under results |
| CP evidence discipline | 0 | Entire `results/` absent |
| False-green defense in plan | 9 | Strong catalog + P07 split |
| Execute residual clarity | 9 | Tasks 00/01/04–07 clear |
| Risk of product thrash | 8 | Plan warns; appendix still toxic if ignored |
| **Overall readiness to close CP-05** | **3** | Code ready; phase not closable |
| **Overall readiness to execute residual** | **9** | Green path clear |

---

## Kill-order (executor — not this review)

1. **Task 00** — recreate `results/planner/world-standard-wave/05-symbols-svg/` + baseline NOTES + authority rg log.  
2. **Task 01** — unfiltered vitest both suites → `01-unit-reprove/` (expect exit 0).  
3. **Skip 02–03** if green — **do not** edit `furnitureBlock2D.ts` “for completeness.”  
4. **Task 04** — write honesty NOTES (eight true / eight false); smoke optional; README leave if present.  
5. **Task 05** — dump `cabinet-v0-prims-{pair,slab,none}.json` + visual NOTES (buyer Q&A).  
6. **Task 06–07** — `CP-05.json` + `SUMMARY.md`:  
   - `symbolQuality`: from unit + visual  
   - `svgHonestySmoke`: separate  
   - `browserPlaceJourney: deferred-to-P07`  
7. Only then mark CP-05 landable. **P07** owns unaided place half for full W2 product story.

---

## Bottom line

- **Product code for W2 plan symbols is already at the raised bar** (multi-prim cabinet-v0, doorStyle geometry, light fill, centeredPath false, Feasibility Block2D path, honesty README).  
- **Phase is not done:** `results/` is missing → **unproven**.  
- **Verdict: APPROVE WITH FIXES** — residual = evidence + honesty NOTES + prim visual + CP pack only.  
- **Do not thrash green geometry.** Do not claim CP-05 / W2 symbol PASS until artifacts exist under `results/planner/world-standard-wave/05-symbols-svg/`.

---

## Top 3 (return summary)

1. **`results/` missing → CP-05 unproven** (blocking paper-PASS).  
2. **Unit + code already green (22/22)** — skip Task 02–03 product restore.  
3. **Residual: baseline + unit logs + honesty NOTES + prim-JSON + CP-05 pack** only.

---

**Report path:** `D:\OandO07072026\plans2/P05-symbols-svg\CODE-REVIEW-REPORT.md`  
**Verdict repeated:** **APPROVE WITH FIXES — residual-only execute; CP-05 PASS blocked until `results/…/05-symbols-svg/` exists.**
