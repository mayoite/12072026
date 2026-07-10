# CODE-REVIEW — workstation-v0 visual smoke

**Seat:** code quality reviewer (strict maintainability)  
**Phase:** `full-workflow-demo-2026-07-10`  
**Checkout:** `D:\OandO07072026`  
**Date:** 2026-07-10  
**Review scope:** primary `site/scripts/ws-v0-visual-smoke.mjs`; related product mesh `site/features/planner/open3d/catalog/workstationMeshV0.ts` (already landed); evidence under this folder  

**Bar:** Elon — raise, not lower; no paper PASS. Product code not modified in this seat.

---

## What was reviewed

| Artifact | Role |
|----------|------|
| `site/scripts/ws-v0-visual-smoke.mjs` (~408 lines) | Headless plan → SVG → sharp PNG smoke |
| `site/features/planner/open3d/catalog/workstationMeshV0.ts` | Source-of-truth mesh plan (legs/stretchers) |
| `site/features/planner/open3d/catalog/workstationSystemV0.ts` | Plan prims (pedestal layout) cross-check |
| `site/scripts/p08-cabinet-v0-visual-smoke.mjs` (~244 lines) | Accepted pattern predecessor |
| Evidence PNGs + `visual-smoke-meta.json` + `IMPLEMENT.md` / `ROOT-TRUTH.md` | Phase proof artifacts |

**Not in product edit scope:** mesh TS already on tip (`b762cf6` stretchers land; smoke land `e82dfa8`).

---

## Strengths

1. **Correct layer.** Smoke lives under `site/scripts/`, not catalog/Three product code. SVG/sharp stay out of `workstationMeshV0.ts`. Matches cabinet smoke placement.
2. **Real visual proof, not paper.** PNGs on disk show multi-part desk: worktop, four corner legs, front/back stretchers, pedestal. Labels name structure parts. Footer stamps locked constants and “must match workstationMeshV0.ts”.
3. **Guards that fail closed.** `main()` throws if `<4` legs, `<2` stretchers, or missing `desk` — smoke cannot silently write empty structure.
4. **Meta artifact.** `visual-smoke-meta.json` records options, part names, constants, and source path — verifier-friendly without re-running sharp.
5. **Formulas currently match product (verified this review).** Line-by-line compare of `legsForWorktopPrim` / `stretchersForWorktopPrim` / worktop+pedestal sizing+centering vs `workstationMeshV0.ts` helpers and `heightForRole` / `centerYForRole` for desk/pedestal: **no drift today**. Pedestal plan inset/size matches `workstationPlanPrims` linear path. Constants equal exported mesh constants (30 / 50 / 40 / 40 / 0.28).
6. **Readable structure, not spaghetti.** Clear blocks: locked constants → plan prims → legs → stretchers → `buildParts` → projection/render → `main`. Not a wrong abstraction layer; one file owns one job.
7. **Dual views.** Three-quarter + side improves structural readability (depth/leg height) beyond a single marketing angle.
8. **Scope honor.** No browser, no GLB, no photoreal, no Fabric — matches GOAL out-of-scope.

---

## Issues

### Critical (Must Fix)

**None.**

No security issues, no product corruption path, no silent write of “PASS” without structure, no wrong-layer product pollution. Smoke fails if core parts missing.

### Important (Should Fix — maintainability / honesty debt)

1. **Constants + formula duplication = drift risk (no automated parity)**  
   - **Where:** `ws-v0-visual-smoke.mjs` L32–45 (constants/colors), L60–77 (`planPrimsLinear`), L87–145 (legs/stretchers), L151–205 (`buildParts` desk/pedestal path).  
   - **What:** Full reimplementation of mesh plan geometry (not just 3 cabinet-style toe constants). Comments say “must match”; **nothing enforces** match against `WORKTOP_THICKNESS_MM` / `LEG_*` / `STRETCHER_*` exports or against `generateWorkstationV0MeshPlan` output.  
   - **Why it matters:** Unit suites prove product mesh. This smoke is the **visual** claim for the phase. If a future mesh raise changes inset/frac/section without updating the smoke, PNG + meta can still look “green” while lying about product. That is paper visual proof. Surface area is larger than `p08-cabinet-v0-visual-smoke.mjs` (which reimplements a thin toe/door formula set).  
   - **How to fix (pick one; prefer cheapest that cannot lie):**  
     - **A (best):** Smoke consumes product plan — e.g. `tsx`/`node --import tsx` call `generateWorkstationV0MeshPlan(createWorkstationConfigV0(...))` and render those parts only (render stays in script).  
     - **B:** Small vitest (or smoke pre-check) that asserts exported constants + part names/positions for default `1500×600×750 desk+pedestal` equal a golden fixture written from mesh plan.  
     - **C (minimum):** At smoke start, parse/assert numeric constants from `workstationMeshV0.ts` source text (fragile but better than comment-only).  
   - **Phase verdict on this issue:** **Does not block APPROVE for this demo land** — formulas match **today**, pattern matches accepted cabinet smoke, GOAL is “≥1 PNG under this folder” + review written. **Does block any claim** that the smoke is a long-term regression guard without A/B. Track as raise, not as “fine forever.”

2. **Scene suite not re-proven in IMPLEMENT evidence (process, not smoke bug)**  
   - **Where:** `IMPLEMENT.md` / GOAL item 3 vs vitest log (mesh + legs + stretchers only = 21 tests).  
   - **What:** GOAL calls for mesh/legs/stretchers/**scene**. ROOT-TRUTH noted scene suite exists (`createSceneObjectFromNode.test.ts`) but scout re-ran 21 only; implementer mirrored that.  
   - **Why it matters:** Not a defect in the `.mjs`, but phase “unit green” claim is incomplete if scene is in the done-when list.  
   - **Fix:** Verifier/head re-run scene suite once and attach log, or amend GOAL if scene is out of scope for this demo. **Not a REQUEST_CHANGES on the smoke script.**

### Minor (Nice to Have)

1. **Dead identity ternary for labels**  
   - **File:** `ws-v0-visual-smoke.mjs` ~L309–312  
   - **What:** `label = leg/stretcher ? part.name : part.name` — no effect.  
   - **Fix:** Use `part.name` directly (keep font-size branch).

2. **File size ~408 lines vs cabinet ~244**  
   - Justified by legs/stretchers plan duplication + dual-view render, not by tangled control flow.  
   - If parity path A lands, file shrinks (drop duplicated plan helpers). No need to split for split’s sake.

3. **Linear desk+pedestal only**  
   - Intentional default matching unit suites. Smoke does not cover l-shape/return/panel/overhead. Fine for this phase; do not oversell coverage.

4. **Painter’s algorithm / sort quality**  
   - Side view sorts parts by `positionM.x` while projecting Z/Y; fine for demo, imperfect occlusion. Not a correctness bug for proof of part presence.

5. **Stroke/fill helpers slightly redundant** with colors already on parts — harmless.

---

## Required checks (task)

### Constants drift risk vs `workstationMeshV0` (duplicate formulas?)

| Check | Result |
|-------|--------|
| Duplicate formulas? | **YES** — intentional (cabinet pattern), larger surface than cabinet |
| Constants equal exports today? | **YES** — 30 / 50 / 40 / 40 / 0.28 |
| Legs/stretchers math equal private helpers today? | **YES** — line-by-line match |
| Pedestal plan equal `workstationPlanPrims` linear? | **YES** |
| Automated drift prevention? | **NO** — comment + human diligence only → **Important debt** |

Helpers `legsForWorktopPrim` / `stretchersForWorktopPrim` remain **module-private** in mesh TS (ROOT-TRUTH). Smoke cannot import them without exporting or going through `generateWorkstationV0MeshPlan` — reinforces why parity path A/B is the raise.

### File size / spaghetti / wrong layer

| Check | Result |
|-------|--------|
| File size | ~408 LOC — acceptable for self-contained headless smoke with geometry + SVG |
| Spaghetti? | **No** — linear sections, single responsibility, no deep nesting mess |
| Wrong layer? | **No** — scripts smoke; product mesh untouched by this file |
| God-object smell? | Mild (plan + render + I/O in one file) — acceptable for smoke; do not pull SVG into catalog |

---

## Recommendations (non-blocking)

1. Next mesh raise: implement **parity path A or B** before treating this smoke as regression evidence.  
2. Drop dead label ternary when next-touch.  
3. Phase close: re-run scene unit suite if GOAL still lists it.  
4. Do **not** export legs/stretchers helpers solely for smoke unless product needs them — prefer public plan API consumption.

---

## Assessment

**Approval: APPROVE**

**Reasoning:**  
Primary new code is a correct-layer headless visual smoke that produces real multi-part PNGs with legs + stretchers, fail-closed structure guards, and **currently matching** mesh formulas. No Critical defects. File is large but structured, not spaghetti, not product-layer pollution. The Important issue (duplicate formulas without automated parity) is real maintainability debt and would be **REQUEST_CHANGES** if the smoke claimed to be a permanent mesh regression oracle without a guard — it does not; it meets the phase demo goal (cabinet-pattern visual proof). Elon bar: **APPROVE the land**, **do not paper-PASS the drift risk** — call it out, fix on next touch / before long-term reliance.

**Ready for:** verifier seat + phase evidence close (with optional scene suite re-run).  
**Not ready for:** “smoke guarantees mesh plan forever” messaging without parity A/B.

---

## Verdict summary

| Field | Value |
|-------|--------|
| **Approval** | **APPROVE** |
| **Critical** | none |
| **Important** | formula/constants drift risk (no automated parity); scene suite evidence gap (process) |
| **Minor** | dead label ternary; size vs cabinet; linear-only; sort polish |
| **Path** | `results/planner/full-workflow-demo-2026-07-10/CODE-REVIEW.md` |
