# Code Review — Workstation Mesh Legs (Systems v0)

**Slice:** mesh-legs-green  
**Scope (read-only):**  
- `site/features/planner/open3d/catalog/workstationMeshV0.ts`  
- `site/tests/unit/features/planner/open3d/workstationMeshV0.test.ts`  
- `site/tests/unit/features/planner/open3d/workstationMeshV0.legs.test.ts`  

**Checklist:** no unused vars · no `any` · unique leg names · height integrity · L-shape more legs · multiparts preserved · TDD coverage · type safety  

**Evidence:** `results/planner/world-standard-wave/07-systems-v0/mesh-legs-green/vitest-green.log` — 15/15 tests pass (8 mesh + 7 legs).

---

## Strengths

1. **Clean pure-plan design** — Legs are pure `WorkstationV0MeshPartPlan` entries from `legsForWorktopPrim` before Three materialization. Same path as desk/return/pedestal/panel/overhead; mesh builder stays a dumb mm→m box loop.

2. **Height integrity is exact** — `legH = max(1, heightMm - WORKTOP_THICKNESS_MM)`, center at `legH/2` → floor at Y≈0 and top at worktop bottom. Matches desk `centerYForRole` (`heightMm - sizeY/2`). Covered by height, floor, and clearance tests.

3. **Stable unique naming** — `leg-{desk|return}-{0..3}` keeps module names (`desk`, `return`, …) free and guarantees unique `mesh.name` for L-shape multiparts. Mesh uniqueness asserted in legs suite.

4. **L-shape correctly doubles worktop runs** — Both `desk` and `return` prims get four posts; L-shape leg count > linear; name filters cover both runs.

5. **Existing multiparts preserved** — Baseline suite filters modules via `!name.startsWith("leg")`, updates counts (e.g. linear desk+pedestal+panel → 7 = 3 modules + 4 legs; full L+all modules ≥13 = 5 + 8). Non-leg roles/names still exactly the five modules.

6. **TDD shape is real** — Dedicated legs file asserts geometry (section band, height, floor/worktop contact), uniqueness, L-shape count, and multipart non-regression — not hollow snapshots. Main suite adapted without dropping prior behavior.

7. **Type safety / lint checklist** — No `any` in production or these tests. No unused imports/locals. Public exports (`LEG_SECTION_MM`, `LEG_INSET_MM`) keep magic numbers out of callers. `runKey: "desk" | "return"` keeps leg role assignment tight.

8. **Inset clamping** — `LEG_INSET_MM` clamped by prim quarter-size so tiny returns do not push posts outside the slab.

---

## Critical (Must Fix)

None.

---

## Important (Should Fix)

None that block merge for this slice.

**Note (not a fix requirement):** Legs reuse `role: "desk" | "return"` with identity in `name` (documented in `legsForWorktopPrim`). Any future consumer that counts **modules by `role` alone** will over-count. Current tests encode name-based identity; if a selector/UI appears, filter `!name.startsWith("leg")` or introduce an explicit leg role. No current production consumer of per-part role counts was found beyond mesh `userData.role` stamping.

---

## Minor (Nice to Have)

1. **Stale RED header in green tests**  
   - File: `workstationMeshV0.legs.test.ts:1–5`  
   - Still says “RED” / “Do not implement production legs until these fail… then GREEN.”  
   - Confuses later readers about slice status. Flip comment to GREEN / regression guard.

2. **Unnecessary cast**  
   - File: `workstationMeshV0.ts:132` — `prim.role as WorkstationModuleKindV0`  
   - Plan prim role is already `"desk" | "return" | "pedestal" | "panel"`, a subset of `WorkstationModuleKindV0`. Assignable without assertion.

3. **L-junction can double posts**  
   - Desk and return each place four corners independently; the inner L corner can put two posts close together. Acceptable for modular v0 boxes; optional later shared-corner dedupe.

4. **Soft L-shape leg counts**  
   - Legs test requires `>= 4` linear, `lLegs > linear`, and `>= 2` name-tagged per run — not exact `8` / `leg-desk-0..3` + `leg-return-0..3`. Production naming is exact; tightening asserts would lock the contract harder.

5. **Section band vs exported constant**  
   - Tests use 40–60mm band rather than importing `LEG_SECTION_MM` (50). Fine for “small post” intent; optional assert equality to the export for one less drift path.

6. **`startsWith("leg")` filter**  
   - Matches any future name starting with `leg` (e.g. hypothetical `legacy-*`). Current scheme is fine; `startsWith("leg-")` would be slightly stricter (main suite already uses `leg-desk-` in one place).

---

## Verdict

**Approve**

All checklist items pass:

| Check | Result |
|-------|--------|
| No unused vars | Pass |
| No `any` | Pass |
| Unique leg names | Pass (`leg-{run}-{i}`; mesh uniqueness tested) |
| Height integrity | Pass (floor → worktop bottom; tests + math) |
| L-shape more legs | Pass (desk + return posts) |
| Existing multiparts preserved | Pass (module filter + role/name equality) |
| TDD coverage | Pass (15 tests green; geometry + regression) |
| Type safety | Pass (narrow unions; no `any`) |

**Ready to merge:** Yes. No Critical or Important blockers. Minor items are polish only.

**Reviewer:** code-review subagent (quality only — no implementation).  
**Date:** 2026-07-09
