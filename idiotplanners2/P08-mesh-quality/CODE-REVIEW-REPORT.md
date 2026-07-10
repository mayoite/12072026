# P08 Mesh Quality (idiotplanners2) — Code Review Report

**Date:** 2026-07-10  
**Reviewer:** review agent (repo-first; no product code; no plan edits)  
**Plan under review:** `D:\OandO07072026\idiotplanners2\P08-mesh-quality\IMPLEMENTATION-PLAN.md`  
**Brainstormer (read):** `D:\OandO07072026\archive\Idiots\P08-mesh-quality\REPORT.md`  
**Checkout:** `D:\OandO07072026` (main only; no worktrees)  
**HEAD:** `cb62c4e` (`main...origin/main`; working tree dirty with planner/archive noise — not used as CP-08 proof)

---

## Verdict

**FAIL CP-08 / W7 closeout — evidence tree absent (`results/` missing = unproven).**

**APPROVE PLAN — Approach A (evidence-first closeout).** Live cabinet-v0 mesh is already **L2** (toe → carcass → door(s), shared constants, plan mirrors mesh, unit contracts present). Do **not** re-implement geometry. Execute Tasks 00–01 + 04–06 (NOTES, vitest logs, headless smoke PNGs + graded checklist, `run.json`). Fall to Approach B only if unit re-run goes red on formula drift.

---

## Executive summary

P08 / W7 is **not** “invent modular mesh.” Product code already implements the locked bar:

- `modularCabinetV0.ts`: `TOE_HEIGHT_MM=100`, `TOE_INSET_MM=50`, `DOOR_THICKNESS_MM=18`; children **`toe` → `carcass` → door(s)**; matrix **2 / 3 / 4**; carcassH = h − toeH (toe replaces bottom, not additive).
- `modularCabinetV0GlbExport.ts`: imports those constants (no private magic dup); `buildModularCabinetV0PartPlans` mirrors mesh; `binaryExportStatus: "plan-only"`.
- Unit + blast suites assert names/order, geometry, Box3 height integrity, plan===mesh (slab), place/scene children, meshStages pair count 4.
- Headless smoke script `site/scripts/p08-cabinet-v0-visual-smoke.mjs` exists and reimplements the same formulas → PNG (no designer GLB, no WebGL).

What is **completely missing** on this checkout:

| Required artifact | Present? |
|-------------------|----------|
| `results/` (any) | **NO** |
| `results/planner/world-standard-wave/08-mesh-quality/` | **NO** |
| `NOTES.md`, `HEAD.txt`, `run.json` | **NO** |
| `vitest-raw.log` / `vitest-nonreg-raw.log` | **NO** |
| `01-…png` / `02-…png` / `visual-smoke.md` | **NO** |

Per plan Done-when and AGENTS evidence law: **units in the source tree ≠ W7 pass.** Claiming CP-08 green from code inspection alone is false-green. This review did **not** re-run vitest into evidence (review-only, no product/evidence write beyond this report); therefore unit green is **source-asserted, not pack-proven**.

Plan quality: path-true, Approach A locked correctly, false-green catalog strong, residual honesty (L2 only, BOQ > photoreal) correct. Stale phase honesty (“no toe / 1/2/3”) remains a thrash hazard if agents trust docs over repo.

---

## Repo truth table

| Claim | Live truth (2026-07-10) | Evidence path / check | Plan alignment |
|-------|-------------------------|----------------------|----------------|
| Mesh toe present | **Yes** — `toe.name = "toe"` first child | `site/features/planner/open3d/catalog/modularCabinetV0.ts` L32–34, L102–108 | Match §1.1 / §1.5 |
| Constants exported 100/50/18 | **Yes** | same file L32–34 | Match |
| Part matrix none/slab/pair | **2 / 3 / 4** via `countCabinetV0Parts` | L149–153 | Match §1.6 |
| GlbExport imports constants | **Yes** from `./modularCabinetV0` | `modularCabinetV0GlbExport.ts` L15–22 | Match |
| plan parts mirror mesh formulas | **Yes** (source identity) | `buildModularCabinetV0PartPlans` L91–141 | Match |
| plan===mesh unit | **Yes** for default **slab** only | `modularCabinetV0GlbExport.test.ts` L94–131 | Match intent; pair 1:1 not looped |
| Height integrity unit | **Yes** Box3 spanY ≈ heightMm×0.001, minY≈0 | `modularCabinetV0.test.ts` L173–185 | Match |
| Door above toe unit | **Yes** doorBottom ≥ toeH | same L155–171 | Match |
| Footprint 600×580 | **Yes** exact path string | same L31–35 | Match |
| Place / scene consume | floor origin `position.y = 0`; `generateCabinetV0Mesh` | `createSceneObjectFromNode.ts` L97–125 | Match §1.9 |
| createScene pair names include `toe` | **Yes** length 4 | `createSceneObjectFromNode.test.ts` L122–136 | Match |
| meshStages pair | runtimeMeshChildren/partCount **=== 4** | `meshStages.test.ts` | Match |
| modularPlaceMesh uses count helper | **Yes** | `modularPlaceMesh.test.ts` | Match |
| Footprint resolve test | modular + modularOptions path | `resolveFurniture2DFootprint.test.ts` | Match |
| GLB policy marker | `catalog-assets/generated/` | `glbAssetPolicy.ts` | Match |
| Visual smoke script | **Present** formula SVG→sharp PNG | `site/scripts/p08-cabinet-v0-visual-smoke.mjs` | Match §1.1 |
| Smoke constants aligned | 100/50/18 + same size/pos | script L31–71 | Match formulas; **local copy** (drift risk) |
| stages mesh-g3 note | still generic parametric-box note; status **partial** | `stages.ts` L138–145 | Plan optional honesty bump not done |
| Evidence `08-mesh-quality/` | **ABSENT** entire `results/` | filesystem | Match plan gap §1.2 — **gate red** |
| NOTES / PNGs / run.json | **ABSENT** | — | Done-when 6–8 **FAIL** |
| Vitest logged under evidence | **ABSENT** | — | Done-when 5 **FAIL** |
| Designer static GLB as proof | Not used in smoke/export path | plan-only + assertNoDesignerStaticGlb | Policy OK in source |
| Photoreal claim | None in product path | — | Correct non-goal |
| Stale phase honesty “no toe” | Still possible in live phase MDs | plan §1.3 | Plan correctly: **repo wins** |
| HEAD honesty for pack | `cb62c4e` | `git rev-parse --short HEAD` | Task 00 must write `HEAD.txt` on execute |

---

## Findings

### Blocking (B)

**B1 — Entire `results/` tree missing → CP-08 / W7 unproven**  
- **Fact:** `D:\OandO07072026\results` does not exist. Sole primary evidence home `results/planner/world-standard-wave/08-mesh-quality/` is empty/absent.  
- **Missing required artifacts:** `NOTES.md`, `HEAD.txt`, `vitest-raw.log`, `vitest-nonreg-raw.log`, `01-cabinet-v0-three-quarter.png`, `02-cabinet-v0-side.png`, `visual-smoke.md`, `visual-smoke-meta.json`, `run.json`.  
- **Impact:** No honest W7 pass, no CP-08 table path-proof, no graded silhouette. Unit files in `site/tests` are **not** substitutes.  
- **Action:** Execute plan Task 00 (shell + HEAD + baseline log) → 01 NOTES → 04/05 vitest packs → 05 smoke + grade → 06 `run.json`. Do not ship status PASS without that folder.

### High (H)

**H1 — Source L2 is not evidence L2 (false-green if claimed green)**  
- Mesh + tests look correct on disk. Without `vitest-*.log` under evidence, green is memory/inspection only.  
- Plan explicitly forbids “units green alone = W7.”  
- **Action:** Tee primary + non-reg packs into evidence; record exit code in `run.json`.

**H2 — Visual smoke never executed on this checkout**  
- Script exists and defaults `--out` to the correct evidence path, but no PNGs / `visual-smoke.md` exist.  
- Buyer-readable toe/door/carcass is a **graded** gate (three-quarter + side), not “script present.”  
- Labels on PNG are QA aids; NOTES require grading **as if labels hidden** — needs human `visual-smoke.md` checklist.

**H3 — Stale “no toe / counts 1/2/3” docs can thrash L2 mesh**  
- Plan §1.3 and Idiots REPORT document code-ahead vs phase honesty baseline.  
- Operator who re-implements from stale honesty will destroy green geometry.  
- Plan mitigation (Approach A verify-only; Approach B only on red) is correct — **execute must obey it**.

**H4 — CP-08 closeout checklist incomplete by construction**  
- Done-when items 5–8 all require evidence artifacts. Score of product code does not move checkpoint green.

### Medium (M)

**M1 — plan===mesh 1:1 size/position loop is slab-only**  
- `modularCabinetV0GlbExport.test.ts` full 1:1 compare uses `doorStyle: "slab"`.  
- Pair gets name list + partCount=4 via plan, and createScene asserts names, but not metre size/pos parity for pair leaves.  
- Live source formulas match by construction; residual test gap if pair branch drifts alone.

**M2 — Smoke script reimplements constants/formulas (third copy)**  
- Plan invariant: mesh === plan === smoke. Smoke hardcodes 100/50/18 and part math instead of importing TS.  
- Acceptable for headless zero-bundle, but drift risk if mesh changes without script touch.  
- Units lock plan===mesh; smoke alignment is manual/discipline (+ optional future import of emitted JSON).

**M3 — Toe darker material not unit-asserted**  
- Code sets `TOE_MATERIAL_COLOR` darker than carcass; tests assert oak≠white on **carcass** only.  
- Buyer silhouette relies on darker toe; unit bar could miss a regression to same color.  
- Visual smoke uses distinct greys (`#9ca3af` toe vs `#e5e7eb` carcass) — not product white/oak hexes (OK for silhouette, not material proof).

**M4 — mesh-g3 stage note still omits toe+carcass+door honesty**  
- `stages.ts` mesh-g3 `note` is parametric-box residual; status remains `partial` (honest for non-modular).  
- Plan Task 03 optional string bump not done — low product risk, honesty polish only.

**M5 — This review did not re-run vitest**  
- Review scope: no product code; report only.  
- Baseline “green on 2026-07-10 plan pass” is **not re-proven** in this session. Execute must re-run.

### Low (L)

**L1 — Smoke PNGs include part-name labels**  
- Plan/NOTES: grade readability without depending on labels. Process discipline, not code defect.

**L2 — No clamp if `heightMm < TOE_HEIGHT_MM`**  
- Out of W7 default SKU path; residual edge case only.

**L3 — Binary GLB still plan-only / G5 elsewhere**  
- Correct for W7 (not photoreal GLB proof). Do not treat missing binary bytes as P08 fail.

**L4 — idiotplanners2 tree is untracked (`?? idiotplanners2/`)**  
- Plan/report deliverables not yet on origin; process hygiene for head, not mesh correctness.

---

## Already exists (do not thrash)

| Asset | Path |
|-------|------|
| Runtime mesh L2 | `site/features/planner/open3d/catalog/modularCabinetV0.ts` |
| Pure part plan + plan-only GLB meta | `…/modularCabinetV0GlbExport.ts` |
| Primary units | `site/tests/unit/features/planner/open3d/modularCabinetV0.test.ts` |
| Plan===mesh + policy units | `…/modularCabinetV0GlbExport.test.ts` |
| Scene factory + floor origin | `…/3d/createSceneObjectFromNode.ts` |
| Blast: scene / place / meshStages / footprint | matching unit files under `site/tests/unit/features/planner/` |
| Headless smoke script | `site/scripts/p08-cabinet-v0-visual-smoke.mjs` |
| GLB policy | `site/features/planner/lib/glbAssetPolicy.ts` |
| Implementation plan (Approach A) | `idiotplanners2/P08-mesh-quality/IMPLEMENTATION-PLAN.md` |
| Idiots bar / failures | `archive/Idiots/P08-mesh-quality/REPORT.md` |

---

## Residual (honest L2 — PASS honesty when evidence lands)

From plan NOTES substance / Idiots residual — still expected **after** CP-08 green:

- No handles / pulls / hinges  
- No side reveals / shadow gaps  
- No countertop part  
- Flat door slabs (not shaker)  
- Pair gap geometric ±0.005 m only  
- Materials simple MeshStandard; toe darker same family only  
- Not photoreal; not L3–L6 cabinetry CAD  
- Non-modular furniture may remain single-box (mesh-g3 partial)  
- Metric tattoo: **BOQ/quote path > photoreal; readable parts beat pretty noise**

---

## False-green traps (active on this checkout)

| Trap | Status now |
|------|------------|
| Units green, no PNG/NOTES | **ACTIVE** — no evidence folder |
| Claim W7 from mesh source read alone | **ACTIVE** if anyone marks PASS without pack |
| Trust phase “no toe” → rewrite | **LATENT** — code has toe; docs may still lie |
| Designer GLB for smoke | **Blocked by design** (script uses plan formulas) |
| Photoreal as W7 | **Rejected** by plan/NOTES intent |
| Wrong evidence folder / `site/results/` | N/A until create — plan locks sole `08-mesh-quality/` |
| Labels hide unreadability | **Risk on execute** — grade as if labels off |
| Research “mesh score 1–2” after L2 code | Ignore historical score; re-prove code + pack |
| Workstation smoke as cabinet proof | Out of scope; do not use |

---

## Score

| Dimension | Score | Notes |
|-----------|------:|-------|
| Product geometry vs L2 bar (source) | **9 / 10** | Toe/carcass/door, height integrity, shared constants; minor gaps (pair 1:1 test, toe color unit) |
| Unit contract coverage (source) | **8.5 / 10** | Strong primary + blast; pair plan===mesh loop thin |
| Evidence / CP-08 pack | **0 / 10** | `results/` absent |
| Visual smoke proven + graded | **0 / 10** | Script only |
| Plan readiness (Approach A) | **9 / 10** | Execute-ready; path-true |
| **Overall W7 / CP-08 this checkout** | **2 / 10** | Code ahead; **gate red** without pack |

---

## Kill-order (execute next — no geometry thrash)

1. **Task 00** — Create `results/planner/world-standard-wave/08-mesh-quality/`; write `HEAD.txt` (`cb62c4e` or live short SHA); grep re-proof toe; baseline vitest → `vitest-baseline-raw.log` / promote to `vitest-raw.log`.  
2. **Branch** — If baseline **green** → stay Approach A (no mesh edits). If **red on toe/counts/formulas** → Approach B only.  
3. **Task 01** — Land full `NOTES.md` (substance in plan; no TBD).  
4. **Task 02/03** — Verify-only if green; blast → `vitest-nonreg-raw.log` (or combined nonreg command from NOTES). Optional stages honesty string.  
5. **Task 05** — `node scripts/p08-cabinet-v0-visual-smoke.mjs --out …/08-mesh-quality`; write graded `visual-smoke.md` (toe/body/door yes; side inset yes; labels discounted).  
6. **Task 06** — Fill `run.json`; CP-08 path table all real files.  
7. **Only then** claim CP-08 / W7 for this checkout. Commit evidence slices per plan policy.

---

## Bottom line

**Product mesh is already the W7 L2 bar. The checkpoint is not.**  
`results/` missing = **unproven**. Verdict: **FAIL closeout / APPROVE evidence-first execute**. Top work is proof pack, not geometry rewrite.

---

## Top 3

1. **Create and fill `results/planner/world-standard-wave/08-mesh-quality/`** (NOTES, vitest logs, smoke PNGs + `visual-smoke.md`, `run.json`, `HEAD.txt`) — without this CP-08 stays red.  
2. **Re-run primary + blast vitest into evidence** — source looks green; pack must prove it; only then stay Approach A.  
3. **Do not re-implement mesh from stale “no toe” docs** — live code has toe/2–3–4; thrash is the main geometry risk.

---

**Report path:** `D:\OandO07072026\idiotplanners2\P08-mesh-quality\CODE-REVIEW-REPORT.md`
