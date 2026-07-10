# CODE-REVIEW-TESTS-INDEPENDENT — P03 select / delete

**Seat:** Independent test + coverage code-review (1 agent)  
**Date:** 2026-07-10  
**Checkout:** `.` only — no worktrees  
**Bar:** NO PAPER MOON. No bias toward prior PASS seats. Read every `it(`/`test(` body. Re-measured coverage.

**Verdict key**

| Tag | Meaning |
|-----|---------|
| **REAL** | Asserts the claimed product behavior with values that can fail |
| **SOFT** | Real surface exercised, but assert is loose / mock-count / partial / direction-only |
| **THEATER** | Claim does not match assert (always-true, fire-and-forget, or coverage-touch) |
| **BROKEN** | Test cannot fail correctly or is wrong |

**Independent coverage re-run (this seat):**

```text
cd site
pnpm exec vitest run --coverage \
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts \
  tests/unit/features/planner/open3d/geometry/canvasPicking.quality.test.ts \
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts \
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx \
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx \
  tests/unit/features/planner/open3d/open3dHistory.w3.test.ts \
  --coverage.include=features/planner/open3d/editor/workspaceEntityHelpers.ts \
  --coverage.include=features/planner/open3d/editor/useWorkspaceKeyboard.ts \
  --coverage.include=features/planner/open3d/lib/geometry/canvasPicking.ts \
  --coverage.include=features/planner/open3d/store/history.ts \
  --coverage.include=features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx
```

**Result:** 6 files / **110 tests / exit 0**. Dump: `coverage/independent-rerun/`.

---

## 1. Per-test table

### 1.1 `applySelectionDelete.test.ts` (29)

| Test name | Verdict | One-line why |
|-----------|---------|--------------|
| returns same project reference when selection is none | **REAL** | `toBe(project)` reference equality on empty delete |
| returns same project reference when furniture selection has empty ids | **REAL** | same-ref + furniture membership preserved |
| removes one furniture id and keeps other entities | **REAL** | id list + walls length after single furniture delete |
| skips locked furniture and returns same project reference | **REAL** | locked stays + same ref + locked flag |
| deletes unlocked furniture while keeping locked peers in the same multi-id selection | **REAL** | free removed, locked kept |
| returns same project when active floor id is missing | **REAL** | orphaned activeFloorId no-ops |
| returns same project for unknown selection type (defensive branch) | **REAL** | cast type `measurement` → same ref (defensive; not product UX) |
| removes multi-id furniture in one project revision (single history step) | **SOFT** | multi-delete + undo restore **ids** real, but history object **hand-built** — does not prove `updateOpen3dProject` single push |
| updateOpen3dProject + delete + undo restores same furniture id and pose | **REAL** | pose snapshot equality through real history API |
| multi-id delete via updateOpen3dProject pushes exactly one past entry | **REAL** | `past.length === 1` + pose restore |
| updateOpen3dProject is a no-op when delete does not change membership | **REAL** | missing id → history same ref |
| updateOpen3dProject stamps updatedAt when updater leaves it unchanged | **REAL** | stamp path; history hygiene not select UX |
| updateOpen3dProject keeps updater-provided updatedAt when already changed | **REAL** | updater wins over stamp arg |
| returns same reference when ids do not match any furniture | **REAL** | missing id same-ref |
| deleting a wall cascades doors and windows on that wall (no orphans) | **REAL** | wall/door/window membership after wall delete |
| deletes door and window selection types without touching furniture | **REAL** | door then window removed; furniture id kept |
| deletes a room selection without cascading walls | **REAL** | room gone, wall remains |
| resolveSelectedEntity: returns null for none / empty / unknown | **REAL** | null branches |
| resolveSelectedEntity: returns null when the entity id is not on the floor | **REAL** | missing id |
| resolveSelectedEntity: resolves wall, furniture, door, window, and room by first selected id | **REAL** | collection+id per type; first-id preference |
| updateEntityInProject: returns same project when active floor is missing | **REAL** | orphan floor |
| updateEntityInProject: rejects updates to locked entities | **REAL** | rotation unchanged + same ref |
| updateEntityInProject: merges updates into the matching unlocked entity | **REAL** | target fields + peer untouched |
| updateEntityInProject: returns project with unchanged membership when id is missing | **REAL** | furniture content equal (notes new refs) |
| deleteEntityFromProject: returns same project when active floor is missing | **REAL** | orphan floor |
| deleteEntityFromProject: rejects delete of locked entities | **REAL** | locked stays |
| deleteEntityFromProject: removes a single furniture entity | **REAL** | id membership |
| deleteEntityFromProject: cascades doors and windows when deleting a wall | **REAL** | cascade membership |
| deleteEntityFromProject: no-ops membership when entity id is absent | **REAL** | keep list |

**File hygiene:** 0 skips · 0 `any` · named IDs · product behavior asserts dominate. **Quality: strong.**

---

### 1.2 `geometry/canvasPicking.test.ts` (33)

| Test name | Verdict | One-line why |
|-----------|---------|--------------|
| picks a mid-segment point and reports t ≈ 0.5 | **REAL** | wallId + t |
| misses when the point is outside tolerance | **REAL** | null both APIs |
| hits exactly at tolerance boundary and misses just beyond | **REAL** | boundary + just-over |
| selects the nearest of two walls within tolerance | **REAL** | nearer wall wins |
| reports t ≈ 0 and t ≈ 1 at wall endpoints | **REAL** | endpoint t |
| picks a diagonal wall and reports t ≈ 0.25 at quarter span | **REAL** | diagonal t |
| clamps t to [0,1] for projections beyond the segment | **REAL** | clamp 0/1 |
| returns null for empty walls | **REAL** | empty array |
| handles a degenerate zero-length wall (start === end) | **REAL** | hit at point / miss far |
| prefers the strictly closer wall when both are within tolerance | **REAL** | parallel nearest |
| pointInPolygon: true strictly inside | **REAL** | true |
| pointInPolygon: false outside | **REAL** | false ×2 |
| pointInPolygon: false for <3 vertices | **REAL** | empty/1/2 verts |
| pointInPolygon: non-convex L-shaped polygon | **REAL** | foot/stem/notch |
| getRoomPolygon: ordered wall starts ≥3 | **REAL** | exact points |
| getRoomPolygon: [] when fewer than 3 resolve | **REAL** | empty |
| getRoomPolygon: skips missing wall ids keeps order | **REAL** | partial resolve |
| pickFurniture: inside footprint | **REAL** | id hit |
| pickFurniture: outside footprint | **REAL** | null |
| pickFurniture: prefers top-most (last array) | **REAL** | last wins |
| pickFurniture: rotated 90° inverse-rotation footprint | **REAL** | hit/miss axes after rotation |
| pickFurniture: paddingMm expands hit | **REAL** | pad 0 vs 30 |
| pickFurniture: empty array | **REAL** | null |
| pickFurniture: defaults missing width/depth to 600mm | **REAL** | half-size boundary |
| pickOpening: door near position | **REAL** | type+id |
| pickOpening: nearest door vs window | **REAL** | window nearer |
| pickOpening: door closer than window | **REAL** | door nearer |
| pickOpening: skips missing wallId without throw | **REAL** | no throw + still picks valid |
| pickOpening: equal distance prefers first registered | **REAL** | door-before-window + array order |
| pickOpening: null when far | **REAL** | null |
| pickOpening: endpoints position 0 and 1 | **REAL** | start/end ids |
| pickOpening: diagonal wall interpolated position | **REAL** | hit + miss far |
| pickOpening: tolerance inclusive boundary | **REAL** | 50 hit / 50.1 miss |

**File hygiene:** 0 skips · 0 `any` · geometry asserts with fail modes. **Quality: excellent.** Coverage quality here is **assert-driven**, not line-touch.

---

### 1.3 `open3dWorkspaceKeyboard.test.tsx` (22)

| Test name | Verdict | One-line why |
|-----------|---------|--------------|
| opens the command palette on Ctrl+K and Cmd+K | **REAL** | openPalette ×2 |
| undoes on Ctrl/Cmd+Z and redoes on Shift+Ctrl/Cmd+Z and Ctrl/Cmd+Y | **REAL** | undo/redo call counts per chord |
| ignores shortcuts when typing in an editable field | **REAL** | input target blocks palette |
| does not bind when disabled | **REAL** | enabled:false no call |
| calls deleteSelection on Delete and Backspace and preventDefaults | **REAL** | call count + `defaultPrevented` |
| does not call deleteSelection on Ctrl+Backspace or Cmd+Backspace | **REAL** | mod-guard + not prevented |
| does not call deleteSelection when Delete is pressed in an input | **REAL** | editable guard |
| does not throw when deleteSelection handler is omitted | **SOFT** | only `not.toThrow` — no product side-effect |
| calls cancel on Escape and preventDefaults | **REAL** | cancel + preventDefault |
| arms tools from CANVAS_TOOL_SHORTCUTS on live keydown | **REAL** | map matrix → setTool(id) |
| Opening tool shortcut O arms setTool(opening) | **REAL** | case + map |
| toggles view on Tab without modifiers and preventDefaults | **REAL** | Tab ok; shift/ctrl/alt blocked |
| commits on Enter and preventDefaults; omits commit without throw | **SOFT** | Enter path REAL; omit half is not.toThrow |
| begins temporary pan on Space and ends on Space keyup | **REAL** | begin/end + preventDefault |
| does not begin temporary pan when Space has modifiers or is a repeat | **REAL** | guards |
| does not end temporary pan on non-Space keyup or when pan was never started | **REAL** | keyup guard |
| does not throw when temporary pan handlers are omitted | **SOFT** | only not.toThrow |
| ignores shortcuts in textarea, select, and contentEditable | **REAL** | three editable kinds |
| toolFromShortcutKey returns null for unmapped / resolves mapped | **REAL** | pure helper |
| does not arm tools for unmapped letter keys | **REAL** | setTool never |
| does not arm tools when Alt or Ctrl is held with a map letter | **REAL** | mod block |
| allows non-HTMLElement targets (window) to reach deleteSelection | **REAL** | window EventTarget path |

**File hygiene:** 0 skips · 0 `any` · mock handlers appropriate for hook unit. **Gap:** never asserts `deleteSelection` → `applySelectionDelete` / `OOPlannerWorkspace` wiring (product lines ~328–334).

---

### 1.4 `open3dFeasibilityCanvas.test.tsx` (13)

| Test name | Verdict | One-line why |
|-----------|---------|--------------|
| renders the command workflow and catalog proof | **SOFT** | smoke: toolbar + catalog text + fillRect called — not select/delete |
| runs toolbar and keyboard commands | **SOFT** | fires many keys/clicks; only asserts focus + `Outcome: cancelled` — zoom/undo/tool not checked |
| draws, previews, cancels, and undoes a wall | **REAL** | Walls: 1 → Undo → Walls: 0 |
| commits wall geometry through workspace canvas history | **REAL** | walls length + canUndo + undo |
| supports dimension tool (two-point measurement) and room/wall alias + enter commit (task6) | **THEATER** | `measurements.length >= 0` is **always true** — name claims commit, assert cannot fail |
| creates a real room instead of falling back to wall-only drawing | **REAL** | rooms=1, walls=4, area>0 |
| supports click and drag placement … onPlace (task7…) | **SOFT** | only `onPlace.toHaveBeenCalled()` — no payload coords/catalog validation |
| select tool pointer on furniture sets furniture selection | **REAL** | selection `{type:furniture, ids:[FURNITURE_ID]}` via project→screen pick |
| select tool empty click clears selection to none | **REAL** | set then clear to none |
| select tool pointer on wall midpoint sets wall selection by id | **REAL** | wall id selection |
| select tool pointer near door position prefers door over wall | **REAL** | door id over wall |
| select tool pointer near window position prefers window over wall | **REAL** | window id |
| select tool pointer inside room polygon sets room selection by id | **REAL** | room id |

**W3-relevant:** 6 select tests are **REAL**. Pre-existing smoke/placement/dimension tests dilute the file; dimension is **THEATER**.  
**Gap:** no Delete/Backspace → furniture removed through FeasibilityCanvas / workspaceCanvas in this suite.

---

### 1.5 `e2e/open3d-w3-select-delete.spec.ts` (1)

| Test name | Verdict | One-line why |
|-----------|---------|--------------|
| place furniture, select, Delete removes, Ctrl+Z restores | **SOFT** | Real guest path + placeSeats + Select tool + Delete + Ctrl+Z. Asserts: furniture count **direction only** (`< afterPlace`, `> afterDelete`); selection only **not** “No Selection” (no furniture type/id); click at canvas **0.5,0.5** may hit non-furniture; does **not** require exact restore to `afterPlace` |

**Live log present:** `browser-w3-playwright-live.log` — 1 passed (~2s). Pass ≠ hard proof of furniture select/delete/undo identity.

**Hygiene:** 0 skips · 0 `any`. Count helper falls back to body text and can return `-1` (then only gated by `>= 0` once).

---

## 2. Coverage table (claimed vs measured)

**Independent re-run matches deposited `coverage-summary.json` / `COVERAGE-90.md` exactly.**

| File | Claimed stmts/lines | Measured (this seat) | ≥90% stmts & lines? | Quality note |
|------|--------------------:|---------------------:|:-------------------:|--------------|
| `workspaceEntityHelpers.ts` | 98.75 / 98.48 | **98.75 / 98.48** | **YES** | From **REAL** delete/resolve/update asserts; residual L35 dead `!collection` after typed gate |
| `useWorkspaceKeyboard.ts` | 100 / 100 | **100 / 100** | **YES** | From **REAL** key + preventDefault asserts; optional omit paths **SOFT** but thin |
| `canvasPicking.ts` | 100 / 100 | **100 / 100** | **YES** | Assert-driven geometry — **not** line-touch theater |
| `history.ts` | 100 / 100 | **100 / 100** | **YES** | delete suite + `open3dHistory.w3.test.ts` (not in review read list; needed for pack 100%) |
| `FeasibilityCanvas.tsx` | 74.63 / 76.86 | **74.63 / 76.86** | **NO (residual)** | Select path **REAL** pushes coverage; residual mass ~L1087–1131 command search + diagnostics + asset fallback — **honest residual**, not hidden fail |

**Overall pack:** stmts 82.5 · branch 79.32 · funcs 77.61 · lines **83.82** (FeasibilityCanvas pulls total under 90).

### FeasibilityCanvas residual — honest?

**YES, honest residual.** Uncovered cluster matches proof-variant shell (`command-search` input/results, diagnostics strip branches, proof Image `onError` / fallback). Not a silently failed select path. Select product path (furniture → openings → walls → rooms) is unit-proven with real selection ids. Full-file 90% correctly **not** claimed with paint/search theater.

### Coverage vs assert quality

| Hard file | Coverage source quality |
|-----------|-------------------------|
| helpers | **High** — membership / lock / cascade / pose |
| keyboard | **High** for bindings; **zero** integration to project mutation |
| picking | **High** |
| history | **High** (with w3 history suite in pack) |
| FeasibilityCanvas | **Mixed** — select REAL; dimension THEATER still executes lines; many paint branches touched by wall/smoke without product assert |

---

## 3. Cross-check: 5 SOFT/THEATER → weakly tested product lines

| # | Weak test | Product lines still weakly tested |
|---|-----------|-----------------------------------|
| 1 | **THEATER** dimension `measurements.length >= 0` | `FeasibilityCanvas.tsx` dimension two-point commit (~L810+) — measurement **added** to floor not asserted |
| 2 | **SOFT** placement `onPlace` called only | Placement payload validation / final-up place path in FeasibilityCanvas pending-catalog flow |
| 3 | **SOFT** toolbar/keyboard firestorm | Zoom / undo key handlers inside FeasibilityCanvas proof shell — side effects unchecked |
| 4 | **SOFT** e2e select = not “No Selection” | `OOPlannerWorkspace.tsx` `deleteSelection` (~328–334) + furniture-specific select in **native** chrome; browser never asserts furniture selection type/id |
| 5 | **SOFT** keyboard omit `not.toThrow` + no wiring suite | Hook → `deleteSelection` callback → `applySelectionDelete` → `updateProject` + clear selection **integration** untested as a chain |

**Bonus gap (not theater, still missing):** FeasibilityCanvas select tests never press Delete and assert furniture count/id gone — pure delete is unit-only; canvas select is unit-only; e2e is loose glue.

---

## 4. Overall scores

| Metric | Score | Notes |
|--------|------:|-------|
| **Unit quality** (not plan score) | **7.5 / 10** | Pure delete + pick + keyboard hook + canvas select are strong REAL. Dragged down by 1 THEATER + several SOFT smokes in FeasibilityCanvas pack and missing integration chain |
| **Browser e2e quality** | **5.5 / 10** | Live path exists and passed; selection/delete/undo asserts are **direction-only**, not identity-level product proof |
| **W3 product claim allowed** | **NO** | Hard pure layers **yes** for domain claim; **full W3 “select furniture → Delete → undo restores” product claim is not allowed** under independent bar until e2e tightens (furniture selection type/id, exact count restore) and/or one integration test wires keyboard→deleteSelection→project |

### Counts (this seat)

| Class | Count (across 5 listed suites) |
|-------|-------------------------------:|
| **REAL** | 90 |
| **SOFT** | 10 |
| **THEATER** | **1** |
| **BROKEN** | 0 |
| **Total `it`/`test`** | 98 unit listed + 1 e2e = **99** (pack also has quality + history files = 110) |

*(canvasPicking 33 + apply 29 + keyboard 22 + feasibility 13 + e2e 1 = 98; THEATER only in feasibility dimension test.)*

---

## 5. Top 10 worst tests (worst first)

1. **THEATER** — `open3dFeasibilityCanvas`: *supports dimension tool…* — always-true `>= 0`
2. **SOFT** — e2e *place furniture, select, Delete removes, Ctrl+Z restores* — W3 claim hinge with loose asserts
3. **SOFT** — *supports click and drag placement…* — onPlace called only
4. **SOFT** — *runs toolbar and keyboard commands* — fire-and-forget keys
5. **SOFT** — *does not throw when deleteSelection handler is omitted* — no product assert
6. **SOFT** — *does not throw when temporary pan handlers are omitted* — same
7. **SOFT** — *removes multi-id furniture in one project revision* — hand-built history (sibling test is REAL)
8. **SOFT** — *renders the command workflow and catalog proof* — smoke/fillRect for W3
9. **SOFT** — *commits on Enter… omits commit without throw* — half is throw-only
10. **SOFT** — *returns same project for unknown selection type* — defensive cast, fine but not product path

---

## 6. What to delete or rewrite (concrete)

| Action | Target | How |
|--------|--------|-----|
| **Rewrite or delete** | Dimension test in `open3dFeasibilityCanvas.test.tsx` | Assert `measurements.length` **increased by 1** (or exact payload length/points). Do not keep `>= 0` |
| **Rewrite** | Placement test | Assert `onPlace` called with expected screen/world coords and/or catalog label fields |
| **Rewrite** | e2e `open3d-w3-select-delete.spec.ts` | After select: assert properties show **furniture** (or selection aria/text with furniture); after Delete: `furnitureCount === afterPlace - N` (N known); after undo: `=== afterPlace` |
| **Add** | Integration unit (small) | `useWorkspaceKeyboard` + real `deleteSelection` that calls `applySelectionDelete` on a project with selection furniture — prove chain once |
| **Optional delete** | Hand-built multi-id history test | Redundant with REAL `updateOpen3dProject` multi-id test; keep only the real history API version |
| **Keep** | All REAL select pointer tests, pick geometry, applySelectionDelete lock/cascade/pose | Do not gut |
| **Do not** | Paint FeasibilityCanvas to 90% with command-search theater | Residual is honest — leave or cover with real command UX tests only |

---

## 7. Honesty vs prior seats / COVERAGE-90.md

| Prior claim | Independent finding |
|-------------|---------------------|
| Coverage % numbers | **Confirmed** re-run match |
| 0 skips / 0 any in residual suites | **Confirmed** on five listed files |
| “Coverage theater NONE” | **False** — dimension `>= 0` is theater; placement/smoke are soft |
| “Proper product behavior asserts PASS” | **Partial** — true for helpers/pick/keyboard-delete/select-id; false as blanket for whole pack |
| Feasibility residual honest | **Confirmed** |
| W3 browser green ⇒ product closed | **Not allowed** — SOFT e2e only |

---

## 8. Return summary (for head agent)

| Field | Value |
|-------|------:|
| **W3 product claim allowed** | **NO** |
| **Unit quality** | **7.5 / 10** |
| **E2E quality** | **5.5 / 10** |
| **THEATER tests** | **1** |
| **SOFT tests (listed suites)** | **10** |
| **Coverage re-run** | Matches claimed; hard 4/5 ≥90; FeasibilityCanvas residual honest |

**Commit message target:** `trustdata(P03): independent test+coverage code-review no bias`
