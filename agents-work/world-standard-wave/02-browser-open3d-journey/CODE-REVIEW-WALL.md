# CODE-REVIEW — P07 Fabric wall-draw path

**Seat:** code-review (receiving rigor)  
**Scope:** wall tool → pointer down/move/up → `onWallDrawn` → `addPlannerWall` → status bar / e2e  
**Verdict:** **REQUEST CHANGES**  
**Date:** 2026-07-12  
**Note:** Reviewed **current** wall path against e2e failure mode “walls stuck at 4” (guest seed perimeter). No large fixes applied.

---

## Checklist (short)

| # | Check | Result |
|---|--------|--------|
| 1 | Commit requires length ≥ 10mm? e2e drag long enough? | **Gate yes; e2e drag yes** — magic `10` (project mm). Default scale `0.1` ⇒ ~1 CSS px ≈ 10 mm; journey drag spans ~60% canvas width ⇒ thousands of mm. Length gate is **not** a plausible sole cause of stuck-at-4 for this helper. |
| 2 | `activeTool` wall vs select race? | **Real risk** — see Blockers / Nits. |
| 3 | Status bar wall count = `floor.walls.length`? | **Yes** — `summarizeFloorMetrics` → `WorkspaceShell` `.pw-status-bar`. |
| 4 | Seed room 4 walls — append not replace? | **Pure path appends** (`[...floor.walls, wall]`). Stuck-at-4 ⇒ commit never lands or document is overwritten after. |
| 5 | No second plan host / archive selectors? | **OK** — sole `PlannerCanvasStage` → `PlannerFabricStage`; journey asserts `planner-2d-canvas` count 0. |
| 6 | No `any` / no paper moon? | No `any` in stage. **Paper-moon risk:** guidance says two-click; runtime is press-drag-release; e2e retries hide flaky product. |

---

## Blockers (must fix)

### B1 — Fabric **instance remount** on every wall count change  
**File:** `site/features/planner/canvas/PlannerFabricStage.tsx`  
**Lines:** mount effect deps **~486**; also `emitStatus` deps **~206**

```text
}, [activeFloor?.walls.length, emitStatus, onStatusChange]);
```

- Mount effect constructs `new Canvas`, wires `mouse:down|move|up`, and **disposes** on cleanup.
- Coupling dispose/recreate to `walls.length` means **every successful wall add tears down Fabric**.
- Separate rebuild effect already repaints geometry from `activeFloor` (**~488–577**). Remount is redundant and races dispose with in-flight pointer handlers / status emits.
- **Fix direction:** mount once (host + empty deps or stable ids only). Never remount on geometry count. Keep scene rebuild on `activeFloor` / transform / tool.

### B2 — Async restore / bootstrap can **overwrite** a just-drawn wall  
**File:** `site/features/planner/editor/OOPlannerWorkspace.tsx`  
**Lines:** **~160–185**

```text
const restored = await restoreSnapshotRef.current();
if (restored) { replaceProjectRef.current(restored); return; }
// else pendingBootstrapLayout → createRectangularRoomProject (4 walls)
```

- Guest initial project is already `createRectangularRoomProject` (**~132–138**) → **4 walls**.
- Restore runs **after** first paint with only an unmount `cancelled` flag — **no generation / “user has edited” guard**.
- If IDB clear is racy (`clearPlannerStorage` fires `deleteDatabase` without awaiting) or a 4-wall snapshot still loads, a late `replaceProject` resets to 4 **after** `addPlannerWall` → status bar stuck at 4.
- Bootstrap path also force-seeds a rectangular room (4 walls) if `pendingBootstrapLayout` is set.
- **Fix direction:** await durable clear in e2e; generation token; skip replace if `history.past.length > 0` or `project.updatedAt` advanced by user; apply bootstrap only once before interaction.

### B3 — Wall commit is **silent** on short segment; session can **stick** on pointerId mismatch  
**File:** `site/features/planner/canvas/PlannerFabricStage.tsx`  
**Lines:** commit gate **~412–414** (and imperative commit **~244–246**); pointerUp **~403–423**

- Length `< 10` (mm): no `onWallDrawn`, no message, no status — preview cleared only when pointerId matches.
- If `wallSession.pointerId === (nativeEvent.pointerId ?? 1)` **fails**, code falls through **without** clearing `wallDrawRef` / preview → subsequent wall gestures can no-op until cancel.
- Fabric 7 defaults `enablePointerEvents: false` (mouse events); `pointerId` is usually `undefined` → `?? 1`, so OK in the common path, but the gate is still a footgun with no cleanup.
- **Fix direction:** named `MIN_WALL_LENGTH_MM = 10` pure helper; on any up that ends a session, always clear session + preview; optional status “wall too short”.

### B4 — No TDD seam proving **pointer path → document wall +1**  
- Pure `addPlannerWall` is covered (domain / feasibility tests).
- **No** unit/integration test that: tool=`wall` → down/move/up with Δ≥10mm → `activeFloor.walls.length` increments from seeded 4 → 5.
- Journey retry (`open3d-world-standard-journey.spec.ts` **~200–215**) treats product flake as acceptable — that is paper moon if green without a deterministic host test.
- **Fix direction:** small pure `shouldCommitWall(start,end,minMm)` + component/integration test on handle path; keep e2e as browser gate only.

---

## Findings by checklist item

### 1) Length ≥ 10mm & e2e drag

| Location | Behavior |
|----------|----------|
| `PlannerFabricStage.tsx:244`, `:412` | `Math.hypot(...) >= 10` before `onWallDrawn` |
| `useWorkspaceCanvas.ts` dead `useCanvasDrawing` `:242` | `length > 10` (strict `>`; dead path — inconsistency nit) |
| `plannerCanvasHelpers.ts:221–231` | `drawWallByTwoClicks` = `selectPlannerTool("Wall")` + `dragOnCanvas` (16 steps) |
| Journey | `{0.2,0.35}→{0.8,0.35}` then retry `{0.15,0.2}→{0.85,0.2}` |

**Conclusion:** Gate exists; helper drag is long enough. Do **not** blame e2e span first. Prefer B1/B2/tool-arming when stuck at 4.

### 2) activeTool wall vs select

| Location | Issue |
|----------|--------|
| `OOPlannerWorkspace.tsx:201` | Default tool `"wall"` — good for empty draw |
| `OOPlannerWorkspace.tsx:345–352` | After wall: force `"select"` + `armedToolRef` |
| `PlannerFabricStage.tsx:162–164` | `activeToolRef` synced in `useEffect` — **one frame lag** after rail click |
| `PlannerFabricStage.tsx:254` | Imperative `setTool: () => {}` **no-op** — rail/keyboard only via React state |
| `PlannerFabricStage.tsx:308–311` | **`pendingPlaceRef` wins over wall tool** — placement eats wall downs |
| `canvasTool.ts:78` | Guidance: “Click start and end points” |
| Stage pointer path | **Press–drag–release**, not two independent clicks |

Two discrete clicks (down/up at A, down/up at B) each create near-zero length segments and **silently fail** the ≥10mm gate → walls stay at 4. E2E avoids this via drag; product copy lies.

### 3) Status bar wall count source

| Location | Source |
|----------|--------|
| `workspacePlanMetrics.ts:39` | `walls = floor.walls.length` |
| `OOPlannerWorkspace.tsx:939,1046` | `planMetrics={summarizeFloorMetrics(activeFloor)}` |
| `WorkspaceShell.tsx:425–429` | `.pw-status-bar` → `{planMetrics.walls} walls` |
| e2e `getWallCount` | `.pw-status-bar > span` `/^\d+ walls$/` |

**Not** driven by `canvasStatus.wallCount` (that field is for stage snapshot only, `PlannerFabricStage.tsx:200,381`). **Status bar source is correct.** Stuck-at-4 means document walls never left 4 (or were reset).

### 4) Seed 4 walls — append

| Location | Behavior |
|----------|----------|
| `project.ts:64–91` | `createRectangularRoomProject` → 4 perimeter walls |
| `OOPlannerWorkspace.tsx:132–138` | Guest `initialProject` = that seed |
| `walls.ts:34–36` | `walls: [...floor.walls, wall]` — **append** |
| `handleWallDrawn` `:345–349` | `updateProject(p => addPlannerWall(...))` |

Pure action is correct. Do not “fix” append by rewriting `addPlannerWall` without evidence of replace.

### 5) Host purity

| Location | Behavior |
|----------|----------|
| `project/canvas-stage/index.ts` | Re-exports `PlannerFabricStage` as sole stage |
| Journey `enterWorldStandardPlanner` | Asserts `planner-2d-canvas` count **0** |
| Helpers | `PLANNER_FABRIC_STAGE` = `[data-testid="planner-fabric-stage"]` |

No archive dual-host in this path.

### 6) `any` / paper moon

- No `any` in `PlannerFabricStage.tsx` wall path (casts to `PointerEvent` only).
- Paper moon: click-click guidance + e2e retry without failing hard on first draw; status/`pass` without live Δ walls.

---

## Nits

1. **Magic `10`** duplicated (stage commit ×2, dead `useCanvasDrawing`) — extract `MIN_WALL_LENGTH_MM` next to units.
2. **`handlePointerMove` wallCount** uses effect-closure `activeFloor` (`:381`) instead of `activeFloorRef` — stale snapshot during long draws (status only).
3. **Post-wall auto-select** (`handleWallDrawn` `:350–351`) — fine UX; ensure multi-segment e2e always re-arms Wall (helper does).
4. **`fitToView` / `setTool` no-ops** on stage handle (`:252–254`) — misleads callers; wall path mostly ignores.
5. **Dead `useCanvasDrawing`** still documents “live open3d uses PlannerCanvasStage” — keep dead or delete; don’t let tests target it as SoT.
6. **Guidance vs gesture** (`canvasTool.ts:78`) — update to “Press, drag, release (≥10 mm)” or implement true two-click.
7. Journey name `drawWallByTwoClicks` while implementation is drag — rename to `drawWallByDrag` to stop future “two tap” regressions.

---

## Path map (happy path)

```text
CanvasToolRail Wall
  → OOPlannerWorkspace.setTool("wall") → activeTool / activeToolRef
PlannerFabricStage mouse:down (runtimeToolFor === "wall")
  → wallDrawRef + preview Line
mouse:move → preview + previewLengthMm
mouse:up && length >= 10
  → onWallDrawn(start, end)
  → handleWallDrawn → updateProject(addPlannerWall)  // append
  → setActiveTool("select")
summarizeFloorMetrics(activeFloor).walls → ".pw-status-bar" "N walls"
e2e getWallCount / expect > wallsBefore
```

---

## Verdict

### **REQUEST CHANGES**

Do not treat the wall path as land-ready while:

1. Fabric **remounts on `walls.length`** (B1),  
2. Mount **restore/bootstrap can clobber** geometry (B2),  
3. Failed commits are **silent** and pointerId mismatch can **stick** a session (B3),  
4. There is **no deterministic host/unit proof** that seeded 4 → 5 (B4).

**Not blockers for this review:** status bar source; pure `addPlannerWall` append; sole Fabric host; e2e drag distance vs 10 mm.

**Suggested fix order (minimal):**  
(1) Drop `walls.length` from canvas mount deps → mount once.  
(2) Guard restore/bootstrap against post-edit replace.  
(3) Always clear wall session on up; named min-length helper + status.  
(4) One TDD test: seed 4 walls → drag commit → length 5.  
(5) Align copy/helper names with drag gesture.

---

## Evidence / paths reviewed

| Path | Role |
|------|------|
| `E:\12072026\site\features\planner\canvas\PlannerFabricStage.tsx` | wall pointer path, length gate, mount deps |
| `E:\12072026\site\features\planner\editor\OOPlannerWorkspace.tsx` | `handleWallDrawn`, guest seed, restore |
| `E:\12072026\site\features\planner\project\model\actions\walls.ts` | `addPlannerWall` append |
| `E:\12072026\site\features\planner\editor\workspacePlanMetrics.ts` | status bar wall count |
| `E:\12072026\site\features\planner\editor\WorkspaceShell.tsx` | `.pw-status-bar` |
| `E:\12072026\site\features\planner\editor\canvasTool.ts` | guidance / runtime tools |
| `E:\12072026\site\tests\e2e\plannerCanvasHelpers.ts` | `drawWallByTwoClicks` / `getWallCount` |
| `E:\12072026\site\tests\e2e\open3d-world-standard-journey.spec.ts` | W1 wall Δ assert + retry |
| `E:\12072026\site\features\planner\project\model\project.ts` | rectangular seed (4 walls) |

**Browser re-prove this review:** not run (review seat only). Live FAIL mode assumed from stated “walls stuck at 4”; only screenshot present under this dump dir: `01-route-ready.png`.
