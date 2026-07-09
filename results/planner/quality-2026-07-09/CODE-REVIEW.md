# Code Review — `pickOpeningAtPoint` rewrite (canvas picking)

**Date:** 2026-07-09  
**Reviewer:** code-review subagent (quality only — no product edits)  
**Scope:**
- `site/features/planner/open3d/lib/geometry/canvasPicking.ts` (`pickOpeningAtPoint` + `OpeningPickResult`)
- `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts` (`pickOpeningAtPoint` suite; neighboring pick helpers for consistency only)
- Call-site wiring read for context: `FeasibilityCanvas.tsx` select path (furniture → opening → wall → room)

**Method:** Source read + unit tests + prior slice notes (`results/planner/opening-select/`, world-standard PARTIALS). No production edits.

**Evidence already on disk:**
- Unit: `results/planner/opening-select/vitest-raw.log` / `results/planner/quality-2026-07-09/canvas-picking/vitest-main.log` — `canvasPicking` green (incl. 3 `pickOpeningAtPoint` cases)
- Typecheck (product tree): `results/planner/quality-2026-07-09/typecheck-raw.log` — clean; note main `site/tsconfig.json` **excludes** `tests/`

---

## Strengths

1. **Intentional pure geometry API**  
   - `pickOpeningAtPoint` is a pure function over mm points + domain entities + tolerance. No canvas/DOM/store coupling. Matches the rest of `canvasPicking.ts` (`pickWall*`, `pickFurnitureAtPoint`, `pointInPolygon`).

2. **Type-safe rewrite shape (no `any`)**  
   - Local `Candidate` type + separate `bestPick` / `bestDistance` scalars (lines 97–136) avoid a nested mutator object that previously collapsed under TS control-flow into `never` on the pick field (documented at L96–97).  
   - `readonly Open3dDoor[]` / `Open3dWindow[]` / `Open3dWall[]` inputs.  
   - Public `OpeningPickResult` is a narrow discriminated-ish pair (`type` + `id`) — enough for `setSelection` without leaking geometry internals.

3. **Correct nearest-within-tolerance semantics**  
   - Builds wall map once, projects opening `position ∈ [0,1]` to wall centerline, Euclidean distance in mm, rejects `distance > toleranceMm`, keeps strictly closer candidate.  
   - Doors and windows compete in one candidate pool (explicit comment L122) — correct product rule for “what’s under the cursor,” not “doors always beat windows.”

4. **Aligned with how openings are actually drawn today**  
   - FeasibilityCanvas draws doors as fixed screen-radius arcs and windows as small screen rects **at the same center lerp** (`door.position` / `window.position` on wall), not full opening width along the wall (draw ~553–581).  
   - Center-point proximity pick matches that glyph model. Not an accidental mismatch with a wide door stroke.

5. **Defensive orphan handling**  
   - Missing parent wall → `continue` (L124–125). Orphans do not throw or invent geometry. Compatible with wall-cascade work (separate slice).

6. **Real call-site order**  
   - Select path: furniture → opening → wall → room (`FeasibilityCanvas.tsx` ~739–775). Tolerance for openings is at least wall-scale (`Math.max(pickToleranceMm, 120 / transform.scale)`), so markers remain hittable under zoom. Product gap “openings not pickable” is closed in pure + wire evidence.

7. **Tests assert behavior, not mocks**  
   - Three cases: hit door near mid-wall position; nearest wins when door @0.25 vs window @0.75; miss when far. Uses real numbers on a 4000 mm wall — purpose over hollow coverage.

---

## Critical (Must Fix)

**None.**

No clear production-breaking bug, security issue, or silent data corruption in the rewrite. No product edit required from this review.

---

## Important (Should Fix)

### I1 — Opening-pick edge cases under-tested vs wall suite

**Where:** `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts` ~233–279  

**What:** `pickWallAtPoint` / `pickWallWithPosition` have ~10 cases (empty, boundary, nearest of two, endpoints, diagonal, degenerate zero-length). `pickOpeningAtPoint` has only 3. Missing real behaviors that the implementation already encodes:

| Gap | Why it matters |
|-----|----------------|
| Missing parent wall (orphan `wallId`) | Silent skip — should return `null`, not throw or pick ghost |
| Empty doors **and** windows | Baseline null path |
| Tolerance boundary (`distance === toleranceMm` included; just over excluded) | Contract of `>` vs `<=` must not drift |
| Two openings equidistant (or same position) | Strict `<` → first candidate wins (doors listed before windows) — document/lock or explicit rule |
| `position` 0 / 1 (wall endpoints) | Placement allows [0,1]; pick must hit endpoints |
| Diagonal wall | Projection math is the same as walls; one case locks it |

**Why it matters:** Quality slice goal is “real pick-test quality.” Core happy paths are covered; edge contracts that differ from wall picking can regress silently.  

**Fix guidance (tests only):** Add 3–5 focused cases; no need to mirror every wall test. Prefer one orphan + one boundary + one equal-distance/first-wins over a large matrix.

### I2 — Residual product risk when opening *glyphs* grow beyond center markers (not a current bug)

**Where:** `canvasPicking.ts` L127–130 (uses `position` only; ignores `width` / wall thickness)  

**What:** Hit test is a disk of radius `toleranceMm` around the opening center. Door/window `width` is unused. That is **correct for current 2D glyphs** (icon at center). It will become wrong if/when canvas draws full-width openings along the wall (gap in wall stroke, door swing arc, etc.) without updating pick to a segment-or-OBB hit.

**Why it matters:** Future draw fidelity without pick update would recreate the original “can’t select opening” frustration at the *edges* of a wide door.  

**Fix guidance:** Track as residual with openings browser e2e (`PARTIALS.md` already flags unit-only openings select). When full-width draw lands, pick should use wall-direction half-width + lateral thickness (or shared `openingCenterOnWall` helper used by both draw and pick). **Do not change pick now** without draw change — would desync intentional center-glyph UX.

### I3 — Browser proof still unit-only (process residual, not code defect)

**Where:** product path via `FeasibilityCanvas`; evidence in `results/planner/world-standard-wave/PARTIALS.md` § Openings select  

**What:** Pure + unit green; no Playwright place → Select door → properties/delete proof.  

**Why it matters:** Wiring can break without touching `canvasPicking.ts`. Already logged as residual; do not treat as a failure of this pure rewrite.  

**Fix guidance:** Separate thin browser slice (already suggested in PARTIALS). Out of scope for pure-geometry quality review.

---

## Minor (Nice to Have)

1. **Incomplete fixtures in opening tests**  
   - Wall at L234–240 is typed `Open3dWall` but omits `color` (other describes use `WALL_DEFAULTS` with `color`). Door/window literals omit `type` / `swingDirection` / `flipSide` / `sillHeight`.  
   - Main product `tsc` excludes `tests/` (`site/tsconfig.json` exclude), so this does not fail the quality typecheck log; `site/tests/tsconfig.json` would surface it if run.  
   - Prefer a small `door()` / `window()` / shared wall helper for future-proof fixtures.

2. **Duplicated center lerp**  
   - Same `start + (end-start)*position` in pick (L127–129) and draw (`FeasibilityCanvas` ~560–561, 576–577).  
   - Optional private/shared `openingPointOnWall(wall, position)` would DRY and reduce draw/pick drift risk (pairs with I2 later).

3. **Implementation archaeology comment**  
   - L96–97 explains a past TS `never` failure. Useful for one land; can shrink to “flat bestPick/bestDistance for narrowing” once the rewrite is stable.

4. **Per-call allocations**  
   - New `Map` + `candidates` array every pick. Fine at planner scale (tens of openings). No change needed unless profiling says otherwise.

5. **Tie-break undocumented in public JSDoc**  
   - JSDoc says “Prefer nearest within tolerance” (L85–87) but not first-wins on exact ties. One line in JSDoc or a test (I1) is enough.

6. **Furniture suite still thinner than walls** (adjacent, not opening rewrite)  
   - No rotation/padding cases in this file. Out of slice unless quality wave expands pick-test hygiene broadly.

---

## Recommendations

1. **Land as-is for pure geometry** — rewrite is clean, typed, and matches current draw model.  
2. **Thicken `pickOpeningAtPoint` tests** (I1) as the quality-slice follow-up; 3–5 real cases beat coverage theater.  
3. **Keep width-aware pick on the backlog** tied to full-width opening rendering (I2).  
4. **Browser e2e** remains the product residual for openings select (I3), not a blocker for this pure module.  
5. Optionally extract `openingPointOnWall` when next touching draw + pick together.

---

## Verdict

| Dimension | Assessment |
|-----------|------------|
| Correctness (center proximity, nearest, miss) | Pass |
| Type safety / no `any` | Pass |
| Alignment with current 2D glyphs | Pass |
| Test depth for openings | Partial (happy path solid; edges thin) |
| Production readiness of pure helper | Yes |
| Product edit required from review | No |

**Ready to merge:** **Yes**

**Reasoning:** The `pickOpeningAtPoint` rewrite is a clear, pure, type-safe nearest-within-tolerance picker that matches how doors/windows are drawn and how select is wired. No Critical defects. Important items are test-edge thickening and known residuals (full-width hit when glyphs grow; browser proof) — none block the pure module as shipped.

**Reviewer:** code-review subagent · quality only · 2026-07-09  
**Output path:** `results/planner/quality-2026-07-09/CODE-REVIEW.md`
