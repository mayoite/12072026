# P05 Symbols SVG — Code Review Report

**Date:** 2026-07-10  
**Reviewer:** review agent (repo-first, no implement, no plan edits)  
**Plan under review:** `D:\OandO07072026\plans1/P05-symbols-svg\IMPLEMENTATION-PLAN.md`  
**Brainstormer (optional):** `D:\OandO07072026\archive\Idiots2\P05-symbols-svg\REPORT.md`  
**Checkout:** `D:\OandO07072026` (main only; no worktrees)

---

## Verdict

**APPROVE PLAN — EXECUTE RE-PROVE ONLY (do not thrash product geometry)**

Product Block2D / canvas path is already raised and unit-green in this checkout. Historical phase-card **CP-05 PASS** is **invalid here** because repo-root `results/` is **absent**. The implementation plan correctly prioritizes evidence recreation, honesty NOTES, and fail-closed re-prove over rewrites.

---

## Executive summary

P05 has two distinct acceptance surfaces: **(1) symbol quality** (cabinet-v0 readable Block2D on FeasibilityCanvas) and **(2) SVG path honesty** (publish catalog ≠ plan authority). Live code already implements multi-prim modular cabinet symbols with doorStyle differentiation, light surface fill, always-false `furnitureBlockUsesCenteredPath`, Feasibility Path B wiring, asset-engine honesty README, and a strong dual unit suite (**22/22 PASS** when re-run 2026-07-10).  

What is **not** present: any live evidence under `results/planner/world-standard-wave/05-symbols-svg/`. Therefore any claim of CP-05 / W2 symbol half **PASS** for this checkout is paper-green until Tasks 00–01 / 04–05 / 07 of the plan land artifacts.  

The plan’s architecture graph (A inventory DOM / B canvas Block2D / C publish SVG), false-green catalog, surface-fill lock, Fabric-flag-OFF rule, and “fix only if RED” policy all match repo reality and Idiots2 thesis. Residual risks are path bookkeeping (`Idiots2` vs `archive/Idiots2`), stale phase-card prose (2 prims / centeredPath true / 17 tests / PASS), optional static authority test not yet added, and weak ethics string checks — none of which justify rewriting `modularCabinetBlock` blindly.

---

## Repo truth table

| Claim | Live truth (2026-07-10) | Source | Plan alignment |
|-------|-------------------------|--------|----------------|
| Canvas furniture draw path | `FeasibilityCanvas` → `furnitureBlock2DFromItem` → `renderBlock2DCentered` + `createCanvasBlockColorResolver` | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` ~583–630 | **Match** §1.1, §1.5 |
| Feasibility loads `/svg-catalog` for paint | **No** (no match in canvas-feasibility) | grep | **Match** |
| `modularCabinetBlock` | Multi-prim: outer + inner + front + back + doorStyle branches (pair stile+2 handles / slab 1 handle / none shelves) | `furnitureBlock2D.ts` 50–169 | **Match** |
| Outer fill | `BLOCK_STYLE.surface` = `var(--block-surface)` (not storage blob) | `furnitureBlock2D.ts` + `blocks2d.ts` | **Match** §5.4 |
| `furnitureBlockUsesCenteredPath` | **Always `false`** | `furnitureBlock2D.ts` 403–405 | **Match** |
| Unknown SKU nonempty | bridge → `buildGenericBlock2D` → `boxBlock` (≥1 rect) | `furnitureBlock2DFromItem` tail | **Match** |
| Stroke floor | `resolveCanvasStrokeWidthMm` present + unit | `renderBlock2DToCanvas.ts` | **Match** §1.8 |
| Fabric furniture flag | Default OFF; `=== "1"` only; ON forces Feasibility furniture layer off + mounts Fabric layer | `fabricFurnitureFlag.ts`, `OOPlannerWorkspace.tsx` ~232–241, ~950 | **Match** §1.7 |
| Publish SVG | `compileSvgForPublish` + smoke scripts; public files: chaise, sofa, side-table, fallback — **no cabinet-v0 as plan authority** | asset-engine + `site/public/svg-catalog/` | **Match** |
| Honesty README | `## Canvas vs publish SVG (P05 honesty)` present | `asset-engine/README.md` 70–80 | **Match** |
| cabinet-v0 unit file | **13** cases (contrast, stile, handles, none, centeredPath, ethics JSON) | `furnitureBlock2D.cabinet-v0.test.ts` | **Match** (plan ~13) |
| render unit file | **9** cases (stroke floor, paint, centered, modular, contrast, unknown×2, degenerate) | `renderBlock2DToCanvas.test.ts` | **Match** |
| Live unit re-run this review | **22/22 PASS** (~2.7s) | local vitest 2026-07-10 | Plan expected green |
| Optional authority-honesty unit | **Missing** | path absent | Plan Task 06 optional — OK |
| `results/` root | **MISSING** | filesystem | **Match** plan §1.4 hard gap |
| Phase card CP-05 PASS | Claims PASS + `results/.../05-symbols-svg/` | `Plans/phases/P05-symbols-svg/P05-symbols-svg.md` | Plan correctly calls **unproven** |
| Expert / suggestions baseline | Still describe ~2 prims + centeredPath true | `P05-suggestions.md`, phase Task 00 | **Stale** vs repo; plan says repo wins |
| Brainstormer path | Live under `archive/Idiots2/...` not repo-root `Idiots2/` | tree | Plan cites `Idiots2/` — path shorthand |
| Idiots2 three-worlds thesis | A DOM / B Block2D / C publish | `archive/Idiots2/P05-symbols-svg/REPORT.md` | Plan §2.1 faithful |
| `generateCabinetV0Footprint` | Mesh/helper path string; not Feasibility Block2D | modularCabinet / parametricBuilder | Plan correctly out-of-authority |

---

## Findings

### Blocking (B)

**B1 — No live CP-05 evidence tree (`results/` absent)**  
- **Fact:** `D:\OandO07072026\results` does not exist. Phase card and any historical NOTES claiming CP-05 PASS cannot be re-proved from this checkout.  
- **Impact:** Shipping or quoting “W2 symbol half green” without recreating `results/planner/world-standard-wave/05-symbols-svg/` is false-green (AGENTS layout + plan §1.4 / §8).  
- **Plan:** Correctly mandates Task 00 tree create + unit re-prove logs + CP pack.  
- **Action for execute:** Run plan Tasks 00, 01, 04, 05, 07 before any `status: pass`. Do **not** invent PASS from unit memory alone.

### High (H)

**H1 — Phase execute card still marks CP-05 PASS while artifacts are gone**  
- **Path:** `Plans/phases/P05-symbols-svg/P05-symbols-svg.md` (status table + “do not re-open”).  
- **Risk:** Agent skips re-prove and trusts markdown. Plan already overrides with “unproven / re-prove.”  
- **Mitigation already in plan:** Evidence-first hard stops; false-green catalog row “Markdown PASS without results/.”

**H2 — Stale expert baseline can cause destructive “restore” thrash**  
- **Paths:** `P05-suggestions.md` (modular ≈ 2 prims; centeredPath true); phase Task 00 “expect ~2 prims”; appendix storage-fill skeleton called out by plan.  
- **Live:** multi-prim + surface fill + centeredPath false + 13 strong tests.  
- **Plan mitigation strong:** §1.3 contradictions table; “do not re-apply storage fill”; Task 03 only if RED; Appendix A “prefer keep live tests.”  
- **Residual:** Operator who only reads phase card/appendix can still regress contrast.

**H3 — Full W2 is not closed by symbol units alone**  
- Browser place ≥2 journey remains **P07**; mesh beauty **P08**. Plan states this clearly (Done when + Task 08).  
- Do not market unit green as full W2 / open3d journey proof.

### Medium (M)

**M1 — Brainstormer path is archive-relative**  
- Plan/Inputs: `Idiots2/P05-symbols-svg/REPORT.md`.  
- Live: `archive/Idiots2/P05-symbols-svg/REPORT.md` (root `Idiots2` absent).  
- Content was read and matches plan synthesis; path only — fix in execute NOTES, not product.

**M2 — Test count drift on phase card**  
- Phase card: “17/17 green.”  
- Live re-run: **13 + 9 = 22** tests across the two CP files. Plan’s “~13 cabinet-v0” is accurate; phase card number is stale.

**M3 — Ethics / no-external assertion is shallow**  
- `furnitureBlock2DFromItem.toString()` + `JSON.stringify(block)` forbid http / `.glb` / `.svg` / `svg-catalog` in generated payload.  
- Does not prove imports never pull assets; does not scan Feasibility source for catalog URLs (optional Task 06 static test would).  
- Acceptable for phase bar; not a security fence.

**M4 — Optional authority static test not present**  
- Plan Task 06 file `furnitureBlock2D.authority-honesty.test.ts` is optional and absent.  
- Recommend add if CI wants permanent Feasibility ≠ `/svg-catalog` lock; not required for CP if NOTES + unit green.

**M5 — cm/mm bridge risk outside cabinet-v0 path**  
- `open3dLikeBuddyCatalogItem` divides mm by 10 for buddy CatalogItem (documented cm→mm convention). Plan §11 lists as med residual / post-P05 audit.  
- Cabinet modular path does **not** go through that divide — protected by modular branch-first.

**M6 — Publish dual-path historical complexity**  
- Locked `docs/Lockedfiles/svg-pipeline/current.md` still describes dual compile/schema era; live asset-engine has clearer `compileSvgForPublish` authority.  
- P05 plan only needs honesty (publish ≠ canvas); full pipeline unification is out of scope — correct.

### Low (L)

**L1 — Plan length / full code of record**  
- Long restore dump is intentional fail-safe. Risk: paste-without-RED. Plan repeatedly says skip Task 03 if green — follow that.

**L2 — Playwright visual optional**  
- Plan prefers prim-JSON; optional mesh-symbol e2e under different evidence folder is not CP substitute (plan Task 08 #6). Correct.

**L3 — Inventory Path A richness ≠ plan mark for all SKUs**  
- Many SKUs use bridge/generic/box; only cabinet-v0 is multi-prim manufacturer bar. Plan correctly scopes raised bar to cabinet-v0, not multi-SKU art thrash.

---

## Already exists (do not re-implement blindly)

| Asset | Location |
|-------|----------|
| Multi-prim `modularCabinetBlock` (surface fill, doorStyle matrix) | `site/features/planner/open3d/catalog/furnitureBlock2D.ts` |
| `furnitureBlockUsesCenteredPath` → false | same |
| Feasibility Path B wire | `FeasibilityCanvas.tsx` |
| Canvas paint + stroke floor + centered helper | `site/lib/catalog/renderBlock2DToCanvas.ts` |
| BLOCK_STYLE / `blockToSvg` inventory path | `site/lib/catalog/blocks2d.ts` |
| Catalog bridge | `site/features/planner/catalog/catalogBlockBridge.ts` |
| Publish compile API | `site/features/planner/asset-engine/svg/compileSvgForPublish.ts` |
| P05 honesty section | `site/features/planner/asset-engine/README.md` |
| Public published SVGs (non–cabinet-v0) | `site/public/svg-catalog/*.svg` |
| Fabric flag + layer (destination, default OFF) | `canvas-fabric-stage/`, `OOPlannerWorkspace.tsx` |
| cabinet-v0 unit suite (13) | `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts` |
| render + unknown-SKU suite (9) | `site/tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts` |
| SVG smoke scripts | `site/package.json` `scripts:smoke:svg` / `:batch` |
| Phase + appendix + expert canvas note | `Plans/phases/P05-symbols-svg/` |
| Idiots2 exhaustive report | `archive/Idiots2/P05-symbols-svg/REPORT.md` |

**This review re-ran:**  
`vitest run furnitureBlock2D.cabinet-v0.test.ts renderBlock2DToCanvas.test.ts` → **22 passed**.

---

## Residual (after green product + re-prove evidence)

1. Recreate and fill `results/planner/world-standard-wave/05-symbols-svg/` (baseline, unit logs, honesty, prim-JSON, CP-05.json, SUMMARY).  
2. Optionally land Task 06 static Feasibility authority test.  
3. Optional Playwright place PNG with Fabric flag OFF (not required if prim-JSON solid).  
4. SVG smoke batch: honesty only — do not fail symbol half if NOTES refuse “pipeline green.”  
5. Do not expand multi-SKU symbol art until place/select/save program needs it.  
6. Post-P05: non-modular SKU cm/mm bridge audit; published-SVG-as-place authority only as **new goal**.  
7. Phase-card / expert stale PASS and “2 prims” prose should be corrected after evidence lands (out of this review’s edit scope).

---

## False-green traps (confirmed live)

| Trap | Status in this checkout |
|------|-------------------------|
| Phase markdown CP-05 PASS without `results/` | **Active trap** — do not trust |
| Unit green alone as full W2 | Units green; place journey still P07 |
| SVG smoke / portal catalog as plan symbols | Publish path real; **not** Feasibility authority |
| Fabric flag-ON Rect screenshots as W2 | Flag default OFF; proof must stay OFF |
| Appendix storage fill “restore” | Would re-blob; tests would fail if re-applied |
| `generateCabinetV0Footprint` as plan symbol | Mesh helper only — not Block2D paint |
| mesh-symbol e2e folder as CP-05 substitute | Different evidence root; plan forbids alone |
| `site/results` dumps | Must use repo-root `results/` only |

---

## Score

| Dimension | Score | Notes |
|-----------|------:|-------|
| Plan accuracy vs live repo | **9.0 / 10** | Authority graph, contradictions, tests, flags all verified |
| Plan safety (anti-thrash / ethics / scope) | **9.0 / 10** | RED-only product edits; surface fill lock; Task 08 non-work |
| Product symbol readiness (code + unit) | **8.5 / 10** | Geometry + 22/22 units strong; browser visual not re-proved here |
| Evidence / CP honesty in checkout | **1.0 / 10** | `results/` missing → no valid PASS |
| Overall execute readiness of **this plan** | **8.5 / 10** | Ready as re-prove runbook; not as greenfield rewrite |

**Composite for “should we follow this plan?”:** **YES (re-prove path).**  
**Composite for “is CP-05 already done in this checkout?”:** **NO.**

---

## Kill-order (execute)

1. **Do not rewrite** `modularCabinetBlock` / tests unless unit re-prove is RED.  
2. Create **repo-root** `results/planner/world-standard-wave/05-symbols-svg/` tree (Task 00).  
3. Run both unit suites unfiltered → `01-unit-reprove/` (Task 01). Expect PASS.  
4. SVG honesty NOTES + optional smoke (Task 04); never claim smoke green without exit 0.  
5. Dump prim-JSON pair/slab/none → `05-visual/` (Task 05).  
6. CP-05 pack: vitest log + `CP-05.json` + `SUMMARY.md` with **split** `symbolQuality` vs `svgHonestySmoke` (Task 07).  
7. Optional: authority static unit (Task 06).  
8. Explicit non-work (Task 08): no svg-catalog→Feasibility, no Fabric-ON proof, no mesh thrash, no P07 claim.  
9. Only then treat phase-card PASS as restorable — after artifacts exist on disk.

---

## Bottom line

The **implementation plan is sound and repo-aligned**: it treats live multi-prim Block2D as already raised, forbids appendix storage-fill regression, splits symbol quality from SVG smoke, and refuses paper PASS without root `results/`.  

**Top 3:**

1. **`results/` is missing** — historical CP-05 PASS is unproven; execute must re-create evidence before any pass claim.  
2. **Product path is already unit-green (22/22)** — cabinet-v0 multi-prim, doorStyle matrix, surface fill, centeredPath false, Feasibility Path B, honesty README; **prefer no geometry thrash**.  
3. **Stale phase/expert prose** (2 prims, centeredPath true, 17 tests, PASS) remains a thrash hazard — plan’s “repo wins / RED only” policy is mandatory, not optional.

**Report path:** `D:\OandO07072026\plans1/P05-symbols-svg\CODE-REVIEW-REPORT.md`
