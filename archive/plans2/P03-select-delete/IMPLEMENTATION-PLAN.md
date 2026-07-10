# P03 — Select / Delete / Undo (W3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** Buyer on `/planner/open3d` or guest planner can **select furniture on 2D Feasibility**, press **Delete or Backspace** to remove it, and **Ctrl/Cmd+Z** to restore the **same entity id + pose** — proven by **unit pack + browser pack** under `results/planner/world-standard-wave/03-select-delete/` (unit alone = FAIL).

**Architecture:** Approach **A** — FeasibilityCanvas is the interactive 2D surface; document truth is active-floor `furniture[]` with stable UUIDs; selection is **transient** `CanvasSelection` on `useWorkspaceCanvas` (never in history). Select tool pointer → `pickFurnitureAtPoint` → `setSelection({ type: "furniture", ids })`. Delete/Backspace → `useWorkspaceKeyboard` (`preventDefault`) → workspace `deleteSelection` → pure `applySelectionDelete` → **one** `updateProject` when membership changes → clear selection. Undo → `executePlannerCommand({ type: "history.undo" })` restores prior project graph (same ids + poses). Fabric furniture flag **OFF** for all W3 proof. Product bar is **furniture only** (multi-select, 3D pick, openings-as-gate, Fabric cutover = out of scope).

**Tech Stack:** Next.js `site/` · FeasibilityCanvas (Canvas 2D) · Vitest · Playwright (`open3d-w3-select-delete.spec.ts`) · open3d history via command layer · no `any` · main checkout only `D:\OandO07072026` · no worktrees.

**Inputs consumed:**
- Repo read: **2026-07-10** — `results/` **absent** on disk (entire tree missing; evidence not depositable); product code + unit/e2e tests largely present under `site/features/planner/open3d/` and `site/tests/`. Re-read HEAD at execute: `git rev-parse HEAD` from `D:\OandO07072026`.
- Brainstormer: **`Idiots/P03-select-delete/REPORT.md` only** (never Idiots2 for this wave).
- Phase plan: `Plans/phases/P03-select-delete/` (execute card, appendix, suggestions, 01/02/04 experts).
- Maps: `Plans/Research/RESULTS-MAP.md` · RESEARCH-MAP · structure advice (one CP, no P03b browser split).

**Done when:**
1. CP-03.1–03.11 table green with **live artifacts** under `results/planner/world-standard-wave/03-select-delete/` (not appendix prose, not “tests exist”).
2. Unit pack exit 0: pick + pure delete + keyboard preventDefault + canvas select + undo same id/pose + locked identity + multi-id single past.
3. Browser: arm Select → click furniture → Delete → furniture count drops → Ctrl+Z restores count; PNGs + raw log under canonical folder.
4. Fabric flag OFF documented in NOTES; no dual selection store; no competitor chrome.
5. No false claim that P07 journey or unit-only = W3.
6. Appendix “CP-03 PASS” is **not** trusted without re-deposited artifacts.

**Evidence folder (canonical):** `results/planner/world-standard-wave/03-select-delete/`  
Create on execute; **re-prove if missing** (current checkout: **missing**).

**Plan write path (only):** `plans2/P03-select-delete/IMPLEMENTATION-PLAN.md`

---

## 0. How to use this plan (execute posture)

### 0.1 Dual-truth at plan time (binding)

| Layer | Status 2026-07-10 (repo-first) |
|-------|--------------------------------|
| Product code select / delete / keyboard / history | **Mostly landed** — see §1 |
| Unit: `pickFurnitureAtPoint` | **Present** (hit/miss/top/rot/pad) — gaps: empty array, default 600mm |
| Unit: `applySelectionDelete` | **Present** (none/single/multi+undo/missing/wall cascade) — gap: locked-only same-ref; single-id pose restore explicit |
| Unit: keyboard Del/Bksp `preventDefault` + Esc | **Present** — gap: Ctrl+Backspace no-delete; optional omit-handler |
| Unit: Feasibility canvas **furniture select** pointer | **Missing** as dedicated case (`activeTool="select"` used only for place-path test) |
| Browser spec | **Present** `site/tests/e2e/open3d-w3-select-delete.spec.ts` |
| Evidence tree `results/planner/…/03-select-delete/` | **ABSENT** — appendix “CP-03 PASS” is **stale for gate claims** |
| Gate language | **Do not** tick MASTER/INDEX W3 until artifacts re-deposited |

### 0.2 Execute modes

| Mode | When | What to do |
|------|------|------------|
| **A — Close gaps + re-prove** (default **now**) | Code matches §1 “present” | Do **not** rewrite working pure helpers. Add missing tests (TDD), harden browser if flaky, deposit full evidence pack. |
| **B — Repair regression** | Any unit/browser red | Fix **minimal** production code; keep Approach A; no Fabric thrash; no degrees→radians. |
| **C — Full greenfield rebuild** | Code missing (unlikely) | Follow Tasks 01–06 as classic TDD as written. |

**Default for this plan: Mode A**, with Mode B steps when RED. Brainstormer names this **Approach Gamma** (re-proof given land) — same intent.

### 0.3 Skills at execute

| Skill | When |
|-------|------|
| `/using-superpowers` | Always |
| TDD | Tasks 01–06 (and every gap test) |
| verification-before-completion | Tasks 07–09 |
| chrome-devtools or Playwright | Task 08 |
| systematic-debugging | On red |

### 0.4 Non-negotiables

1. Unit-green alone = **CP-03 FAIL**.
2. Journey folder (`02-browser-open3d-journey/`) must **not** substitute for W3.
3. Fabric `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` must be **≠ `"1"`** for W3 proof.
4. Furniture rotation stays **degrees** in document (pick converts for hit math).
5. Multi-id delete = **one** history step.
6. Undo restores **same id + pose**, not new UUID.
7. No worktrees; work only in `D:\OandO07072026`.
8. No `any` in handwritten code.
9. Evidence only under repo-root `results/` — never `site/results/`.
10. Research / `D:\websites` = **ideas only** — no competitor UI/assets/copy.
11. Selection is transient — never pushed into history.
12. Do not expand CP-03 into move/rotate/marquee/3D pick (raised bar = later `modules/select-edit`).

### 0.5 Conflict rule (repo vs brainstormer)

| Topic | Winner |
|-------|--------|
| What code does / paths / signatures | **Repo** |
| Intent, bar, failure modes, false-green traps | **Brainstormer** when repo silent |
| Appendix return-pair API vs live `Open3dProject` only | **Live repo** — do not thrash signature to match draft appendix |

### 0.6 Git ops (AGENTS.md wins over stale execute-card “push only on ask”)

- Commit as you go on main checkout.
- Push `origin` when landable slice is green enough not to strand remote.
- Mirror `mayoite` ~45 min / after big land.
- Never force-push unless owner asks.

---

## 1. Repo reality

### 1.1 Primary production paths (live)

| Path | Role | Live status (2026-07-10) |
|------|------|--------------------------|
| `site/features/planner/open3d/lib/geometry/canvasPicking.ts` | `pickFurnitureAtPoint` — reverse scan, inverse-rotation AABB, default 600mm, padding | **Present** ~L145–164 |
| `site/features/planner/open3d/lib/geometry/snapping.ts` | `projectToScreen` / `screenToProject` / `CanvasTransform` | **Present** |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Select tool: furniture → openings → wall → room; selection ring paint | **Present** ~L736–778, paint ~L584–624; `INITIAL_TRANSFORM` origin (-4000,-2500) scale 0.1 |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | `deleteSelection` via pure helper; Esc cancel clears selection | **Present** ~L325–333, ~L730–757 |
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | Delete/Backspace + `preventDefault`; Esc → cancel; Ctrl+Z undo | **Present** ~L71–86, ~L101–104 |
| `site/features/planner/open3d/editor/workspaceEntityHelpers.ts` | `applySelectionDelete`, `deleteEntityFromProject` | **Present** — pure API returns `Open3dProject` only |
| `site/features/planner/open3d/editor/useWorkspaceCanvas.ts` | `CanvasSelection`, history via `executePlannerCommand`, selection transient | **Present** |
| `site/features/planner/open3d/store/history.ts` | `createOpen3dHistory`, `updateOpen3dProject` (ref identity), undo/redo | **Present** |
| `site/features/planner/open3d/lib/commands/plannerCommand.ts` | Sole write authority for document.update / undo | **Present** |
| `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` | Flag `=== "1"` only | **Present** default OFF |
| `site/features/planner/open3d/store/selection.ts` | Typed selection helper — **not** runtime authority for canvas | Present; **do not** dual-store migrate in P03 |
| `site/features/planner/open3d/editor/canvasTool.ts` | `CANVAS_TOOL_SHORTCUTS.select = "V"`; labels include Select | **Present** |
| `site/features/planner/open3d/editor/workspaceStatusLabels.ts` | `formatSelectionStatus` for chrome | **Present** |
| `site/features/planner/open3d/editor/PropertiesPanel.tsx` | Single-id delete via properties (allowed dual path) | Present; not keyboard proof |

### 1.2 Live algorithms (source of truth — repo wins)

#### 1.2.1 `pickFurnitureAtPoint`

```typescript
// site/features/planner/open3d/lib/geometry/canvasPicking.ts
export function pickFurnitureAtPoint(
  point: Open3dPoint,
  furniture: readonly Open3dFurnitureItem[],
  paddingMm = 0,
): string | null {
  for (let index = furniture.length - 1; index >= 0; index -= 1) {
    const item = furniture[index];
    const halfW = Math.max(1, (item.width ?? 600) / 2) + paddingMm;
    const halfD = Math.max(1, (item.depth ?? 600) / 2) + paddingMm;
    const dx = point.x - item.position.x;
    const dy = point.y - item.position.y;
    const rad = (-(item.rotation || 0) * Math.PI) / 180; // degrees in document
    const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
    const localY = dx * Math.sin(rad) + dy * Math.cos(rad);
    if (Math.abs(localX) <= halfW && Math.abs(localY) <= halfD) {
      return item.id;
    }
  }
  return null;
}
```

**Feasibility select padding:** `Math.max(20, 40 / transform.scale)` mm.

**INITIAL_TRANSFORM (Feasibility):** `{ origin: { x: -4000, y: -2500 }, scale: 0.1 }`.

**Hit order on Select tool** (Feasibility ~L736–778):

1. `pickFurnitureAtPoint`
2. `pickOpeningAtPoint` (doors/windows)
3. `pickWallAtPoint`
4. Room via `pointInPolygon` / `getRoomPolygon`
5. Else `{ type: "none", ids: [] }`

#### 1.2.2 `applySelectionDelete` (live return type)

Appendix draft returned `{ project, selection }`. **Live code returns `Open3dProject` only**; workspace always clears selection after attempt.

```typescript
// site/features/planner/open3d/editor/workspaceEntityHelpers.ts (live contract)
export function applySelectionDelete(
  project: Open3dProject,
  selection: CanvasSelection,
): Open3dProject {
  // none/empty/missing collection → same project ref
  // one clone for all unlocked ids in selection
  // locked ids skipped; if nothing removed → same ref
  // wall delete cascades doors/windows on removed walls
}
```

**Do not “fix” the signature to match appendix** unless a deliberate dual-return is added and all callers updated. Prefer live contract.

#### 1.2.3 Workspace `deleteSelection`

```typescript
// OOPlannerWorkspace.tsx ~L325–333
const deleteSelection = useCallback(() => {
  const { selection } = workspaceCanvas;
  if (selection.type === "none" || selection.ids.length === 0) return;
  workspaceCanvas.updateProject((project) =>
    applySelectionDelete(project, selection),
  );
  workspaceCanvas.setSelection({ type: "none", ids: [] });
}, [workspaceCanvas]);
```

**Anti-pattern (forbidden):**

```typescript
// NEVER — multi-history undo footgun
for (const id of selection.ids) {
  updateProject((p) => deleteEntityFromProject(p, collection, id));
}
```

#### 1.2.4 Keyboard Delete / Backspace / Esc / Undo

```typescript
// useWorkspaceKeyboard.ts
if (isEditableTarget(event.target)) return; // first — Esc/Delete skipped while typing

if (event.key === "Escape") {
  event.preventDefault();
  handlers.cancel();
  return;
}

if ((event.key === "Delete" || event.key === "Backspace") && !mod) {
  event.preventDefault();
  handlers.deleteSelection?.();
  return;
}

if (mod && key === "z" && !event.shiftKey) {
  event.preventDefault();
  handlers.undo();
  return;
}
```

**Esc cancel wire (workspace + palette):**

```typescript
cancel: () => {
  setPendingCatalogItemId(null);
  canvasRef.current?.cancel();
  workspaceCanvas.setSelection({ type: "none", ids: [] });
},
```

**Honest residual (document in NOTES):** Esc clears selection only when focus is **not** in editable field (early return).

#### 1.2.5 History identity

```typescript
// store/history.ts — updateOpen3dProject
const updated = updater(history.present);
if (updated === history.present) return history; // no past push
// stamp updatedAt if unchanged, then push past
```

Command layer:

```typescript
// plannerCommand.ts
if (command.type === "document.update") {
  const next = updateOpen3dProject(history, command.updater, command.now);
  return { status: next === history ? "noop" : "applied", history: next };
}
if (command.type === "history.undo") {
  const next = undoOpen3dAction(history);
  return { status: next === history ? "noop" : "applied", history: next };
}
```

**W3 undo requirement:** After delete of furniture `furn-1` at pose P, undo restores **id `furn-1` and pose P**, not a new UUID. Selection after undo may remain **none** (re-select-on-undo is polish, not gate).

#### 1.2.6 Selection ring visual

Feasibility paints dashed stroke around selected furniture using `selectedFurnitureIds` (~L611–622). Browser may assert absence of “No Selection” heading + furniture count metrics — not pixel-perfect ring goldens.

### 1.3 Tests that exist

| File | Covers |
|------|--------|
| `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts` | `pickFurnitureAtPoint`: hit, miss, top-most, rotation 90°, padding |
| `site/tests/unit/features/planner/open3d/applySelectionDelete.test.ts` | none same-ref; single remove; multi-id one past + undo; missing id; wall cascade |
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | Del/Bksp preventDefault; Esc cancel; undo/redo; editable skip; tool shortcuts |
| `site/tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx` | room/dimension/place paths — **no dedicated furniture select setSelection case** |
| `site/tests/unit/features/planner/open3d/modelOperations.test.ts` | non-regression pack member |
| `site/tests/e2e/open3d-w3-select-delete.spec.ts` | guest place batch → Select → Delete → Ctrl+Z; PNGs 01–04 |

### 1.4 Gaps / contradictions

| Claim (docs / appendix) | Live reality | Plan action |
|-------------------------|--------------|-------------|
| “CP-03 PASS” (appendix post-land) | `results/` tree **missing** | Re-prove; do not claim green from prose |
| Pure API returns `{project, selection}` | Returns `Open3dProject` only | Keep live; workspace clears selection |
| `deleteSelection.test.ts` plan name | Live file is `applySelectionDelete.test.ts` | Use live name in commands/NOTES |
| Task 05 canvas select unit complete | No furniture select pointer case | **Add** unit (Task 05) |
| pick empty + default 600mm | Not in suite (appendix Task 01) | **Add** if RED or missing |
| locked-only same-ref pure test | Missing | **Add** (Task 02) |
| single-id pose restore after undo | Multi-id id restore present; pose fields weak | **Add** explicit id+position+rotation+catalogId |
| Ctrl+Backspace must not delete | Not unit-asserted | **Add** keyboard case |
| e2e asserts same entity id | Only furniture **count** delta | Unit carries CP-03.5; optional e2e harden |
| e2e uses `placeSeatsFromConfigurator(4)` | Systems dependency; weak −1 of 4 | Document; fallback inventory if systems red |
| Expert 04 “getFurnitureCount missing” | Partial — local `furnitureCount` in W3 spec; helpers have object counts | Prefer helper long-term; not CP-03 rewrite |
| Execute card “push only on ask” | AGENTS.md allows agent push | Follow AGENTS.md |

### 1.5 What not to touch (P03)

| Out of scope | Why |
|--------------|-----|
| Fabric full-stage cutover / flag ON as proof | Wrong engine for W3 |
| Three orbit / 2D↔3D continuity | P04 |
| Autosave honesty / cloud save labels | P06 |
| Full draw/place journey pack | P07 (`02-browser-open3d-journey/`) |
| Chrome audit / full shortcut map | P09 |
| Mesh quality | P08 |
| Multi-select marquee / groups | Raised bar later |
| Convert furniture rotation to radians | False-reverse killer |
| Dual-store migrate to `store/selection.ts` | Authority is `workspaceCanvas.selection` |
| Delete `canvas-fabric-stage/` | Destination code; keep |
| Competitor chrome/icons/copy | Ethics |

### 1.6 Evidence absence honesty

At plan time:

```
D:\OandO07072026\results\   → does not exist
```

Therefore:

- Any historical “PASS” is **non-claimable**.
- Task 00 recreates tree.
- Task 07–09 re-deposit unit + browser artifacts.
- SESSION-RECAP / INDEX / MASTER must not say W3 green until `run.json` status PASS on disk.

---

## 2. Brainstormer synthesis (`Idiots/P03-select-delete/REPORT.md`)

### 2.1 Product bar (floor)

| Must | Not must for CP-03 |
|------|---------------------|
| Select furniture on 2D with Select tool | Multi-select marquee |
| Delete **or** Backspace removes selected furniture | Move/rotate handles as gate |
| Undo (Ctrl/Cmd+Z) restores **same id + pose** | Redo as hard gate |
| Unit pack green | Full W1–W2 journey (P07) |
| **Minimal browser** under `03-select-delete/` | 3D pick/delete |
| Fabric flag OFF preferred + documented | Fabric full-stage cutover |
| Esc clears **selection** (non-editable focus) | Full W8 chrome audit |
| Furniture-only product bar | Door/window first-class as CP blocker |

**One-liner (brainstormer):**

> Buyer on 2D switches to **Select**, clicks a furniture footprint, presses **Delete or Backspace**, sees it gone, presses **Ctrl/Cmd+Z**, gets the **same entity id and pose** back — unit + browser under `03-select-delete/`, Fabric furniture flag OFF.

### 2.2 Why W3 exists (buyer truth)

Place without delete creates **irreversible entropy**. W3 is error-recovery infrastructure, not polish. Demo script mid-loop: place → select → delete → undo shows professionalism. Competitive table stakes (Floorplanner/P5D/RoomSketcher-class grammar) — differentiation is O&O SKUs/BOQ later, not delete itself.

### 2.3 Approaches chosen

| Approach | Verdict |
|----------|---------|
| Alpha — Tasks 00–09 classic TDD order | Use for greenfield or full re-proof discipline |
| Beta — browser-first without units | **Reject** |
| Gamma — re-proof + fill gaps (code landed) | **Default now** |

**Implementation order (Gamma):**

1. Fabric flag OFF confirmed  
2. Unit pack run (existing + new gaps)  
3. Fill missing unit cases (TDD)  
4. Browser e2e deposit under `03-select-delete/`  
5. `run.json` + NOTES honesty  
6. Only then tick CP-03  

### 2.4 Failure modes → plan mapping

| Failure | Plan block |
|---------|------------|
| Multi-history delete | pure multi-id unit + one `updateProject` |
| Backspace navigates away | keyboard preventDefault unit |
| Esc leaves selection | cancel clears selection (live) + keyboard Esc unit |
| Undo new UUID | pure history same-id/pose unit |
| Unit-only green | Task 08 browser hard gate |
| Journey substitutes W3 | folder lock + CP-03.11 |
| Fabric ON as proof | NOTES + env assert |
| Degrees→radians thrash | non-negotiable #4 |
| Click without Select tool | e2e arms Select; unit forces `activeTool="select"` |
| Appendix PASS without results/ | re-deposit mandatory |

### 2.5 Competitive patterns (ideas only — ethics fence)

| Industry pattern | O&O W3 translation |
|------------------|-------------------|
| Select → properties | `CanvasSelection` → PropertiesPanel |
| Del/Backspace delete | keyboard → `deleteSelection` |
| Esc deselect / exit mode | cancel clears selection + drawing |
| Undo Ctrl/Cmd+Z | open3d history |
| Furniture priority over structure | hit order furniture first |
| Trash UI | optional W8; keyboard required W3 |
| Visible recovery | history must work |

**Refuse:** competitor icons, color, marketing copy, mega-tabs, pixel-match, IKEA brand/SKU names.

### 2.6 Raised bar (explicitly NOT this plan’s done criteria)

Move drag, rotate keys, duplicate, multi-select marquee, trash button, re-select after undo, 3D select, toast “locked” — later `modules/select-edit/`. Do not expand mid-P03.

### 2.7 E2E critique (brainstormer, adopted)

**Strengths:** serial, timeout, furniture deltas, Select explicit, screenshots, evidence path.

**Weaknesses to handle:**

1. No same-entity-id after undo — **unit** carries bar.  
2. Click 0.5,0.5 may miss furniture — flaky risk.  
3. Batch place 4 + Delete once → weak `toBeLessThan` — acceptable smoke; harden if flaky.  
4. No Fabric flag env assert.  
5. Systems configurator dependency — inventory place fallback.  
6. No browser Backspace/Esc — unit covers.  
7. Status bar regex brittle — document residual.

---

## 3. Ethics / non-copy

- Inspiration only from `D:\websites` research reports (Floorplanner select/delete grammar, RoomSketcher select→trash, P5D loop).
- **No** competitor UI, assets, icons, manuals-as-copy, trade dress.
- O&O chrome: Phosphor, CSS modules, O&O catalog SKUs.
- Firecrawl is **dead** for routine — do not re-scrape for this phase.
- Research patterns ≠ product proof.

---

## 4. File map

### 4.1 Expect create (evidence + possible new tests)

| Path | Action |
|------|--------|
| `results/planner/world-standard-wave/03-select-delete/` | **Create** full evidence tree |
| `results/.../03-select-delete/HEAD.txt` | Create |
| `results/.../03-select-delete/NOTES.md` | Create / update |
| `results/.../03-select-delete/run.json` | Create at sign-off |
| `results/.../03-select-delete/FILES-TOUCHED.md` | Create |
| `results/.../03-select-delete/W3-ACCEPTANCE.md` | Create |
| `results/.../03-select-delete/*-raw.log` | Create per task |
| `results/.../03-select-delete/0{1-4}-*.png` or `w3-*.png` | Browser |

### 4.2 Expect modify (only if gaps / RED)

| Path | When |
|------|------|
| `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts` | Add empty + default 600mm if missing |
| `site/tests/unit/features/planner/open3d/applySelectionDelete.test.ts` | Add locked + single-id pose undo |
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | Add Ctrl+Backspace; omit-handler |
| `site/tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx` | Add furniture select pointer cases |
| `site/tests/e2e/open3d-w3-select-delete.spec.ts` | Harden if flaky (clear storage, stronger asserts) |
| Production files in §1.1 | **Only** Mode B when tests prove red |

### 4.3 Do not create

| Path | Why |
|------|-----|
| Second dual `applySelectionDelete` module | Already in `workspaceEntityHelpers.ts` |
| `site/results/**` | Layout hard-fail |
| Idiots2 plan copies | This wave writes only `plans2/` |
| New Fabric selection store | Forbidden dual store |

### 4.4 Boundaries

```
pickFurnitureAtPoint (pure geometry)
        ↑
FeasibilityCanvas select branch (pointer → setSelection)
        ↑
useWorkspaceCanvas.selection (transient)
        ↓
deleteSelection → applySelectionDelete (pure doc)
        ↓
updateProject → executePlannerCommand → updateOpen3dProject (history)
        ↓
undo → undoOpen3dAction (restore present from past)
```

Keyboard is a thin adapter: never mutates document itself.

---

## 5. Architecture & data flow

### 5.1 Select path

```
User clicks Select tool (or presses V)
  → activeTool = "select"
User pointerdown on canvas
  → screenToProject(canvasPoint, transform)
  → pickFurnitureAtPoint(raw, furniture, padding)
  → if hit: setSelection({ type: "furniture", ids: [id] })
  → else openings → wall → room → none
  → paint selection ring for selectedFurnitureIds
```

### 5.2 Delete path

```
User presses Delete or Backspace (not mod, not editable)
  → preventDefault()
  → deleteSelection()
       → if selection empty: return
       → updateProject(p => applySelectionDelete(p, selection))  // once
       → setSelection(none)
  → history.past gains previous present IFF project ref changed
```

### 5.3 Undo path

```
User presses Ctrl/Cmd+Z
  → preventDefault()
  → runUndo → workspaceCanvas.undo → history.undo command
  → present = previous project snapshot (same furniture ids/poses)
  → selection remains none (acceptable)
```

### 5.4 Document vs transient

| State | Location | In undo stack? |
|-------|----------|----------------|
| furniture[] | project floors | Yes |
| walls/doors/windows/rooms | project floors | Yes |
| selection | useState in useWorkspaceCanvas | **No** |
| active tool | workspace local state | No |
| canvas transform | Feasibility local state | No |

### 5.5 Fabric flag matrix

| Flag | Furniture paint | Select authority for W3 |
|------|-----------------|-------------------------|
| OFF (default) | Feasibility Block2D | Feasibility pickFurniture |
| ON (`=== "1"`) | FurnitureFabricLayer | **Not W3 proof** |

---

## 6. Task list (TDD — checkboxes)

Every implementation task: failing test first when changing product code. For Mode A gap fills: write failing test → GREEN if code already correct → still commit + evidence.

---

### Task 00: Setup / baseline / evidence tree

**Files:**
- Create: `results/planner/world-standard-wave/03-select-delete/*` (scaffold)
- No product code in this task

- [ ] **Step 1: Confirm checkout + HEAD**

```powershell
Set-Location D:\OandO07072026
git rev-parse HEAD
git status --short
```

Expected: prints SHA; worktrees not used; working tree noted if dirty.

- [ ] **Step 2: Confirm Fabric flag OFF for proof env**

```powershell
# In shell used for browser later — must NOT be "1"
echo $env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE
```

Expected: empty / not `1`. If set to `1`, clear for W3 proof:

```powershell
Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -ErrorAction SilentlyContinue
```

- [ ] **Step 3: Create evidence directory**

```powershell
New-Item -ItemType Directory -Force -Path `
  "D:\OandO07072026\results\planner\world-standard-wave\03-select-delete" | Out-Null
```

- [ ] **Step 4: Write HEAD.txt + NOTES.md scaffold**

Write `results/planner/world-standard-wave/03-select-delete/HEAD.txt` with the SHA from Step 1.

Write `NOTES.md`:

```markdown
# P03 / W3 NOTES

- Date: <ISO date>
- Approach: A (Feasibility + document model)
- Execute mode: A/Gamma (close gaps + re-prove)
- Fabric furniture flag: OFF (NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE ≠ 1)
- Worktrees: false
- Checkout: D:\OandO07072026
- Prior appendix PASS: NOT trusted (results/ was missing at plan time)
- Product bar: furniture select/delete/undo only
```

- [ ] **Step 5: Baseline unit pack (record exit code honestly)**

```powershell
Set-Location D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts `
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx `
  tests/unit/features/planner/open3d/modelOperations.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath "..\results\planner\world-standard-wave\03-select-delete\00-baseline-vitest-raw.log"
```

Expected: mostly PASS (code landed). Record exit code in `00-baseline-run.json`:

```json
{
  "phase": "P03",
  "step": "00-baseline",
  "exitCode": 0,
  "note": "baseline before gap fills"
}
```

If exit ≠ 0: switch to **Mode B** for failing suite first — do not invent green.

- [ ] **Step 6: Commit evidence scaffold only (optional if results gitignored)**

If `results/` is tracked:

```bash
git add results/planner/world-standard-wave/03-select-delete/HEAD.txt results/planner/world-standard-wave/03-select-delete/NOTES.md
git commit -m "docs(planner): P03 W3 baseline evidence dir for select/delete re-proof"
```

If results are gitignored: still deposit on disk for gate; mention in NOTES.

---

### Task 01: Unit — `pickFurnitureAtPoint` completeness

**Files:**
- Test: `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts`
- Implement (Mode B only): `site/features/planner/open3d/lib/geometry/canvasPicking.ts`

**Existing cases (must remain green):** hit center, miss outside, top-most, rotation 90°, padding.

- [ ] **Step 1: Write failing tests for empty array + default 600mm**

Append to `describe("pickFurnitureAtPoint", …)`:

```typescript
  it("returns null for empty furniture array", () => {
    expect(pickFurnitureAtPoint({ x: 0, y: 0 }, [])).toBeNull();
  });

  it("uses default 600mm width/depth when omitted", () => {
    const incomplete: Open3dFurnitureItem = {
      id: "def600",
      catalogId: "cabinet-v0",
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      // width/depth omitted → half = 300
    };
    // Inside default half-extent
    expect(pickFurnitureAtPoint({ x: 250, y: 0 }, [incomplete])).toBe("def600");
    // Outside default half-extent
    expect(pickFurnitureAtPoint({ x: 350, y: 0 }, [incomplete])).toBeNull();
  });
```

- [ ] **Step 2: Run pick suite — expect FAIL only if production broken**

```powershell
Set-Location D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts --reporter=verbose
```

Expected Mode A: **PASS** immediately (code already implements `?? 600` and empty loop → null).  
If FAIL: Mode B — fix only `pickFurnitureAtPoint` (keep degrees).

- [ ] **Step 3: Minimal implementation (Mode B only)**

If red on default 600mm, ensure:

```typescript
const halfW = Math.max(1, (item.width ?? 600) / 2) + paddingMm;
const halfD = Math.max(1, (item.depth ?? 600) / 2) + paddingMm;
```

Do **not** change rotation units.

- [ ] **Step 4: Re-run — expect PASS**

```powershell
pnpm exec vitest run tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath "..\results\planner\world-standard-wave\03-select-delete\01-pick-furniture-vitest-raw.log"
```

Expected: all `pickFurnitureAtPoint` cases PASS.

- [ ] **Step 5: Commit**

```bash
git add site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts
# + production only if Mode B fixed
git commit -m "test(open3d): complete pickFurnitureAtPoint cases for W3 select"
```

---

### Task 02: Pure — `applySelectionDelete` + undo same id/pose + locked

**Files:**
- Test: `site/tests/unit/features/planner/open3d/applySelectionDelete.test.ts`
- Implement (Mode B only): `site/features/planner/open3d/editor/workspaceEntityHelpers.ts`
- History: `site/features/planner/open3d/store/history.ts` (use, do not rewrite unless broken)

- [ ] **Step 1: Write failing tests — locked + single-id pose undo**

Append:

```typescript
import { updateOpen3dProject } from "@/features/planner/open3d/store/history";

  it("skips locked furniture and returns same ref when only locked selected", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 100, y: 200 }, {
      idFactory: ids("locked-1"),
    }));
    const floor = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor,
          furniture: floor.furniture.map((f) =>
            f.id === "locked-1" ? { ...f, locked: true, rotation: 45 } : f,
          ),
        },
      ],
    };
    const next = applySelectionDelete(project, {
      type: "furniture",
      ids: ["locked-1"],
    });
    expect(next).toBe(project);
    expect(activeFurniture(next).map((f) => f.id)).toEqual(["locked-1"]);
  });

  it("undo after single furniture delete restores same id position rotation catalogId", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 777, y: 888 }, {
      idFactory: ids("furn-pose"),
    }));
    // stamp rotation/size on document (degrees)
    const floor0 = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor0,
          furniture: floor0.furniture.map((f) =>
            f.id === "furn-pose"
              ? { ...f, rotation: 30, width: 800, depth: 400 }
              : f,
          ),
        },
      ],
    };

    let history = createOpen3dHistory(project);
    history = updateOpen3dProject(history, (p) =>
      applySelectionDelete(p, { type: "furniture", ids: ["furn-pose"] }),
    );
    expect(activeFurniture(history.present)).toEqual([]);
    expect(history.past).toHaveLength(1);

    history = undoOpen3dAction(history);
    const restored = activeFurniture(history.present).find((f) => f.id === "furn-pose");
    expect(restored).toBeDefined();
    expect(restored!.id).toBe("furn-pose");
    expect(restored!.catalogId).toBe("cabinet-v0");
    expect(restored!.position).toEqual({ x: 777, y: 888 });
    expect(restored!.rotation).toBe(30);
    expect(restored!.width).toBe(800);
    expect(restored!.depth).toBe(400);
  });

  it("mixed locked+free multi-id removes only free and one undo restores free only once", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 1, y: 1 }, {
      idFactory: ids("free-a"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 2, y: 2 }, {
      idFactory: ids("lock-b"),
    }));
    const floor = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor,
          furniture: floor.furniture.map((f) =>
            f.id === "lock-b" ? { ...f, locked: true } : f,
          ),
        },
      ],
    };

    let history = createOpen3dHistory(project);
    history = updateOpen3dProject(history, (p) =>
      applySelectionDelete(p, {
        type: "furniture",
        ids: ["free-a", "lock-b"],
      }),
    );
    expect(history.past).toHaveLength(1);
    expect(activeFurniture(history.present).map((f) => f.id)).toEqual(["lock-b"]);

    history = undoOpen3dAction(history);
    expect(activeFurniture(history.present).map((f) => f.id).sort()).toEqual([
      "free-a",
      "lock-b",
    ]);
  });
```

- [ ] **Step 2: Run pure delete suite**

```powershell
Set-Location D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/applySelectionDelete.test.ts --reporter=verbose
```

Expected Mode A: PASS (locked skip already in pure helper; history identity via `updateOpen3dProject`).  
If FAIL: Mode B — fix `applySelectionDelete` only; keep single-clone multi-id; keep wall cascade.

- [ ] **Step 3: Mode B fix sketch (only if red)**

Ensure filter:

```typescript
const nextItems = items.filter((item) => {
  if (!idSet.has(item.id)) return true;
  if (item.locked) return true;
  return false;
});
if (nextItems.length === items.length) {
  return project; // same reference — no history pollution
}
```

- [ ] **Step 4: Evidence log PASS**

```powershell
pnpm exec vitest run tests/unit/features/planner/open3d/applySelectionDelete.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath "..\results\planner\world-standard-wave\03-select-delete\02-delete-undo-vitest-raw.log"
```

Expected: PASS; multi-id one past; same id/pose after undo.

- [ ] **Step 5: Commit**

```bash
git add site/tests/unit/features/planner/open3d/applySelectionDelete.test.ts
git commit -m "test(open3d): lock identity and pose restore for applySelectionDelete W3"
```

---

### Task 03: Wire — workspace `deleteSelection` single history (verify)

**Files:**
- Production (Mode B only): `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`
- Test: prefer pure + history already proves multi-id; optional integration via `updateOpen3dProject` call count pattern already in Task 02.

Live wire (must match):

```typescript
const deleteSelection = useCallback(() => {
  const { selection } = workspaceCanvas;
  if (selection.type === "none" || selection.ids.length === 0) return;
  workspaceCanvas.updateProject((project) =>
    applySelectionDelete(project, selection),
  );
  workspaceCanvas.setSelection({ type: "none", ids: [] });
}, [workspaceCanvas]);
```

- [ ] **Step 1: Grep for multi-update anti-pattern**

```powershell
Set-Location D:\OandO07072026
rg -n "deleteEntityFromProject|for \(const id of" site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
```

Expected: `handleDeleteEntity` may call `deleteEntityFromProject` once (properties path OK); `deleteSelection` uses `applySelectionDelete` once — **no** loop over ids with `updateProject`.

- [ ] **Step 2: If loop found — rewrite to pure helper (Mode B)**

Replace multi-call with the live snippet above. Clear selection after.

- [ ] **Step 3: Prove multi-id still one past via existing unit**

```powershell
Set-Location D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/applySelectionDelete.test.ts -t "multi-id" --reporter=verbose 2>&1 |
  Tee-Object -FilePath "..\results\planner\world-standard-wave\03-select-delete\03-workspace-delete-vitest-raw.log"
```

Expected: PASS; one past entry restores both.

- [ ] **Step 4: Commit only if production changed**

```bash
git add site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
git commit -m "fix(open3d): single-history deleteSelection for furniture W3"
```

If already correct: note “no production change” in NOTES; still keep log.

---

### Task 04: Keyboard — Delete / Backspace / preventDefault / guards

**Files:**
- Test: `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx`
- Implement (Mode B only): `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`

**Existing (must stay):** Del/Bksp preventDefault + call deleteSelection; Esc → cancel; editable skip for Ctrl+K; undo/redo.

- [ ] **Step 1: Write failing tests for Ctrl+Backspace and omit-handler**

```typescript
  it("does not call deleteSelection on Ctrl+Backspace or Cmd+Backspace", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    press({ key: "Backspace", ctrlKey: true });
    press({ key: "Backspace", metaKey: true });
    press({ key: "Delete", ctrlKey: true });

    expect(handlers.deleteSelection).not.toHaveBeenCalled();
  });

  it("does not throw when deleteSelection handler is omitted", () => {
    const handlers = makeHandlers({ deleteSelection: undefined });
    renderHook(() => useWorkspaceKeyboard(handlers));
    expect(() => press({ key: "Delete" })).not.toThrow();
  });

  it("does not delete when focus is in textarea", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));
    const area = document.createElement("textarea");
    document.body.appendChild(area);
    act(() => {
      area.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "Delete", cancelable: true }),
      );
    });
    expect(handlers.deleteSelection).not.toHaveBeenCalled();
    area.remove();
  });
```

- [ ] **Step 2: Run keyboard suite**

```powershell
Set-Location D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx --reporter=verbose
```

Expected Mode A: PASS (`!mod` guard + optional chain already live).  
If FAIL: Mode B — ensure Delete/Backspace branch is:

```typescript
if ((event.key === "Delete" || event.key === "Backspace") && !mod) {
  event.preventDefault();
  handlers.deleteSelection?.();
  return;
}
```

- [ ] **Step 3: Evidence log**

```powershell
pnpm exec vitest run tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath "..\results\planner\world-standard-wave\03-select-delete\04-keyboard-delete-vitest-raw.log"
```

Expected: PASS including `defaultPrevented === true` for Delete and Backspace.

- [ ] **Step 4: Commit**

```bash
git add site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx
git commit -m "test(open3d): Delete/Backspace guards and preventDefault for W3"
```

---

### Task 05: Canvas — Feasibility select furniture sets selection

**Files:**
- Test: `site/tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx`
- Production (Mode B only): `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`
- Helpers: `projectToScreen` / `INITIAL_TRANSFORM` constants

**Coord strategy (binding):**

1. Seed furniture at known **project mm**.  
2. `projectToScreen(furniture.position, INITIAL_TRANSFORM)` with origin `(-4000,-2500)`, scale `0.1`.  
3. Mock `getBoundingClientRect` → `{ x:0, y:0, width:800, height:600, … }`.  
4. **Do not call `fitToView`**.  
5. Require `activeTool="select"` + `workspaceCanvas` prop.

- [ ] **Step 1: Read existing Feasibility test harness**

Open `open3dFeasibilityCanvas.test.tsx` and reuse its `useWorkspaceCanvas` / render patterns. Note: current `"select"` usage is for place path — do not break it.

- [ ] **Step 2: Write failing furniture select cases**

```typescript
import { projectToScreen } from "@/features/planner/open3d/lib/geometry/snapping";
import { addFurniture } from "@/features/planner/open3d/model/operations/pureActions";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import { FeasibilityCanvas } from "@/features/planner/open3d/canvas-feasibility/FeasibilityCanvas";
import { useWorkspaceCanvas } from "@/features/planner/open3d/editor/useWorkspaceCanvas";
import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const INITIAL_TRANSFORM = {
  origin: { x: -4000, y: -2500 },
  scale: 0.1,
} as const;

function mockCanvasRect(el: HTMLElement) {
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 800,
    bottom: 600,
    width: 800,
    height: 600,
    toJSON: () => ({}),
  });
}

describe("FeasibilityCanvas select furniture (W3)", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("select tool pointer on furniture sets furniture selection", () => {
    let project = createOpen3dProject({
      idFactory: (() => {
        let i = 0;
        const seq = ["floor-1", "project-1", "furn-1"];
        return () => seq[i++] ?? `id-${i}`;
      })(),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: () => "furn-1",
    }));
    // ensure footprint for pick
    const floor = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor,
          furniture: floor.furniture.map((f) =>
            f.id === "furn-1" ? { ...f, width: 600, depth: 600 } : f,
          ),
        },
      ],
    };

    const { result } = renderHook(() =>
      useWorkspaceCanvas({ initialProject: project }),
    );

    render(
      <FeasibilityCanvas
        variant="embedded"
        activeTool="select"
        workspaceCanvas={result.current}
      />,
    );

    const canvas = screen.getByLabelText("Floor plan drawing surface");
    mockCanvasRect(canvas);

    const screenPt = projectToScreen({ x: 0, y: 0 }, INITIAL_TRANSFORM);
    // client = rect.left + screen (rect at 0,0)
    fireEvent.pointerDown(canvas, {
      pointerId: 1,
      button: 0,
      clientX: screenPt.x,
      clientY: screenPt.y,
    });

    expect(result.current.selection).toEqual({
      type: "furniture",
      ids: ["furn-1"],
    });
  });

  it("select tool empty click clears to none when no hit", () => {
    const project = createOpen3dProject({
      idFactory: (() => {
        let i = 0;
        const seq = ["floor-1", "project-1"];
        return () => seq[i++] ?? `id-${i}`;
      })(),
    });
    const { result } = renderHook(() =>
      useWorkspaceCanvas({ initialProject: project }),
    );

    // pre-seed a selection to prove clear
    act(() => {
      result.current.setSelection({ type: "furniture", ids: ["ghost"] });
    });

    render(
      <FeasibilityCanvas
        variant="embedded"
        activeTool="select"
        workspaceCanvas={result.current}
      />,
    );
    const canvas = screen.getByLabelText("Floor plan drawing surface");
    mockCanvasRect(canvas);

    // far from origin furniture (none placed) — project point with no hits
    const far = projectToScreen({ x: 50000, y: 50000 }, INITIAL_TRANSFORM);
    fireEvent.pointerDown(canvas, {
      pointerId: 2,
      button: 0,
      clientX: far.x,
      clientY: far.y,
    });

    expect(result.current.selection.type).toBe("none");
    expect(result.current.selection.ids).toEqual([]);
  });

  it("wall tool does not set furniture selection on furniture click", () => {
    let project = createOpen3dProject({
      idFactory: (() => {
        let i = 0;
        const seq = ["floor-1", "project-1", "furn-1"];
        return () => seq[i++] ?? `id-${i}`;
      })(),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: () => "furn-1",
    }));
    const floor = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor,
          furniture: floor.furniture.map((f) =>
            f.id === "furn-1" ? { ...f, width: 600, depth: 600 } : f,
          ),
        },
      ],
    };

    const { result } = renderHook(() =>
      useWorkspaceCanvas({ initialProject: project }),
    );

    render(
      <FeasibilityCanvas
        variant="embedded"
        activeTool="wall"
        workspaceCanvas={result.current}
      />,
    );
    const canvas = screen.getByLabelText("Floor plan drawing surface");
    mockCanvasRect(canvas);
    const screenPt = projectToScreen({ x: 0, y: 0 }, INITIAL_TRANSFORM);
    fireEvent.pointerDown(canvas, {
      pointerId: 3,
      button: 0,
      clientX: screenPt.x,
      clientY: screenPt.y,
    });

    expect(result.current.selection.type).not.toBe("furniture");
  });
});
```

**Adapt imports/labels** to match live component props if names differ (`workspaceCanvas`, `activeTool`, aria-label). If harness differs, keep the three assertions: select-hit → furniture; empty → none; wall tool ≠ furniture selection.

- [ ] **Step 3: Run — expect FAIL if canvas select not wired; PASS if wired**

```powershell
Set-Location D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx --reporter=verbose
```

If RED on select path: Mode B — ensure select branch exists:

```typescript
if (event.button === 0 && activeTool === "select" && workspaceCanvas) {
  const raw = screenToProject(canvasPoint(event), transform);
  const furnitureId = pickFurnitureAtPoint(
    raw,
    activeFloor.furniture,
    Math.max(20, 40 / transform.scale),
  );
  if (furnitureId) {
    workspaceCanvas.setSelection({ type: "furniture", ids: [furnitureId] });
    // ...
    return;
  }
  // openings → wall → room → none
}
```

- [ ] **Step 4: Evidence log PASS**

```powershell
pnpm exec vitest run tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath "..\results\planner\world-standard-wave\03-select-delete\05-canvas-select-vitest-raw.log"
```

- [ ] **Step 5: Commit**

```bash
git add site/tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx
# + FeasibilityCanvas.tsx only if Mode B
git commit -m "test(open3d): FeasibilityCanvas furniture select sets selection for W3"
```

---

### Task 06: Esc clears selection (verify + residual honesty)

**Files:**
- Production (verify): `OOPlannerWorkspace.tsx` cancel handlers
- Test: keyboard already asserts Esc → cancel; optional workspace-level test if cancel wiring drifts

- [ ] **Step 1: Confirm both cancel paths clear selection**

Grep:

```powershell
rg -n "setSelection\(\{ type: \"none\"" site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
```

Expected: keyboard `cancel` and `paletteHandlers.cancel` both clear selection.

- [ ] **Step 2: If missing — Mode B fix**

```typescript
cancel: () => {
  setPendingCatalogItemId(null);
  canvasRef.current?.cancel();
  workspaceCanvas.setSelection({ type: "none", ids: [] });
},
```

- [ ] **Step 3: Document residual in NOTES**

Append to NOTES:

```markdown
## Esc residual
Esc clears selection only when focus is not in INPUT/TEXTAREA/SELECT/contentEditable
(isEditableTarget early-return in useWorkspaceKeyboard). Full "Esc always deselects" is P09-ish.
Esc never deletes furniture.
```

- [ ] **Step 4: Commit if production changed**

```bash
git commit -m "fix(open3d): Esc clears planner selection (W3 grammar)"
```

---

### Task 07: Unit evidence pack + p0:unit non-regression

- [ ] **Step 1: Full W3 unit pack**

```powershell
Set-Location D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts `
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx `
  tests/unit/features/planner/open3d/modelOperations.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath "..\results\planner\world-standard-wave\03-select-delete\vitest-w3-raw.log"
```

Expected: **exit 0**. Zero suppression. If red: stop — Mode B; do not run browser claim.

- [ ] **Step 2: p0:unit**

```powershell
Set-Location D:\OandO07072026\site
pnpm run p0:unit 2>&1 |
  Tee-Object -FilePath "..\results\planner\world-standard-wave\03-select-delete\p0-unit-raw.log"
```

Expected: exit 0. Write sibling:

```json
{
  "phase": "P03",
  "gate": "W3",
  "command": "pnpm run p0:unit",
  "exitCode": 0,
  "log": "p0-unit-raw.log"
}
```

as `p0-unit-run.json`.

- [ ] **Step 3: Honest intermediate state**

CP-03 still **open** until Task 08 browser green. Do not tick MASTER/INDEX.

- [ ] **Step 4: Commit unit evidence note**

```bash
git add site/tests/unit/features/planner/open3d/
git commit -m "test(open3d): W3 select/delete unit evidence pack"
```

---

### Task 08: Minimal browser (CP-03 hard gate)

**Files:**
- Spec: `site/tests/e2e/open3d-w3-select-delete.spec.ts`
- Helpers: `site/tests/e2e/guestProjectSetup.ts`, `site/tests/e2e/plannerCanvasHelpers.ts`
- Evidence PNGs under `results/planner/world-standard-wave/03-select-delete/`

**Narrow scope only:** place ≥1 furniture → Select → click → Delete → Ctrl+Z.  
**Not:** full wall journey, orbit, save, symbols quality.

#### 8.A Preflight

- [ ] **Step 1: Ensure evidence parent exists**

```powershell
New-Item -ItemType Directory -Force -Path `
  "D:\OandO07072026\results\planner\world-standard-wave\03-select-delete" | Out-Null
```

Spec writes PNGs to `../results/planner/world-standard-wave/03-select-delete` relative to `site/` cwd.

- [ ] **Step 2: Start app (pick one path; record in NOTES)**

**Option A — existing dev server:**

```powershell
# already running next on :3000
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
```

**Option B — Playwright webServer** (config default when base URL unset): build+start — slower; record in NOTES.

- [ ] **Step 3: Confirm Fabric OFF in browser env**

Same shell: `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` not `1`.

#### 8.B Run existing spec

- [ ] **Step 4: Run Playwright W3 spec**

```powershell
Set-Location D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm exec playwright test -c config/build/playwright.config.ts `
  tests/e2e/open3d-w3-select-delete.spec.ts `
  --reporter=list 2>&1 |
  Tee-Object -FilePath "..\results\planner\world-standard-wave\03-select-delete\browser-w3-raw.log"
```

Expected: exit 0; PNGs present:

| File | Meaning |
|------|---------|
| `01-placed.png` | furniture placed |
| `02-selected.png` | selection UI (not “No Selection”) |
| `03-deleted.png` | count decreased |
| `04-undone.png` | count increased after Ctrl+Z |

#### 8.C If browser red — systematic fixes (do not weaken asserts)

| Symptom | Fix class |
|---------|-----------|
| Select never arms | Use `selectPlannerTool(page, "Select")` helper; wait `aria-pressed` |
| Always “No Selection” | Click miss — use place path that leaves furniture under click; or adjust rel coords after screenshot debug |
| Count does not drop | Keyboard not wired / selection empty / locked — unit first |
| Undo no increase | history empty / wrong key — ensure Delete actually mutated project |
| Systems configurator fail | Fallback place path (inventory Place + canvas click); document in NOTES |
| Residual furniture false base | Call `clearPlannerStorage` / guest clean in setup |

- [ ] **Step 5: Optional harden (if flaky; still minimal)**

Preferred harden patches (full code if applying):

```typescript
// open3d-w3-select-delete.spec.ts — optional strengthen
import { clearPlannerStorage, enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  clickOnCanvas,
  placeSeatsFromConfigurator,
  selectPlannerTool,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

test("place furniture, select, Delete removes, Ctrl+Z restores", async ({ page }) => {
  await clearPlannerStorage(page);
  await enterGuestPlannerWorkspace(page, { projectName: "W3 select-delete" });
  await waitForPlannerCanvas(page);

  const furnitureBefore = await furnitureCount(page);
  await placeSeatsFromConfigurator(page, 4);

  await expect
    .poll(async () => furnitureCount(page), { timeout: 25_000 })
    .toBe(furnitureBefore + 4);

  const afterPlace = await furnitureCount(page);
  await page.screenshot({ path: path.join(EVIDENCE, "01-placed.png") });

  await selectPlannerTool(page, "Select");
  await clickOnCanvas(page, 0.5, 0.5);

  await expect(
    page.getByRole("heading", { name: /No Selection/i }),
  ).toHaveCount(0, { timeout: 10_000 });
  await page.screenshot({ path: path.join(EVIDENCE, "02-selected.png") });

  await page.keyboard.press("Delete");
  await expect
    .poll(async () => furnitureCount(page), { timeout: 15_000 })
    .toBe(afterPlace - 1); // stronger than toBeLessThan if single selection guaranteed
  await page.screenshot({ path: path.join(EVIDENCE, "03-deleted.png") });

  const afterDelete = await furnitureCount(page);
  await page.keyboard.press("Control+z");
  await expect
    .poll(async () => furnitureCount(page), { timeout: 15_000 })
    .toBe(afterDelete + 1);
  await page.screenshot({ path: path.join(EVIDENCE, "04-undone.png") });
});
```

**Do not** change assert to always-pass. If `afterPlace - 1` is too strict for batch selection uncertainty, keep `toBeLessThan` but document residual.

#### 8.D chrome-devtools alternative

If Playwright infra red, prove with chrome-devtools MCP (same journey, same PNGs, same folder). Log `browser.tool: "chrome-devtools"` in `run.json`. Do **not** invent a third evidence root.

- [ ] **Step 6: Fail path honesty**

Browser fail + unit green = **CP-03 FAIL**. Keep red artifacts + `status: "FAIL"` + blockers in NOTES. No silent skip.

- [ ] **Step 7: Commit browser pack**

```bash
git add site/tests/e2e/open3d-w3-select-delete.spec.ts
# + results if tracked
git commit -m "test(open3d): W3 select/delete browser evidence pack CP-03"
```

---

### Task 09: CP-03 sign-off

- [ ] **Step 1: Write canonical `run.json`**

Path: `results/planner/world-standard-wave/03-select-delete/run.json`

```json
{
  "phase": "P03",
  "gate": "W3",
  "checkpoint": "CP-03",
  "approach": "A",
  "checkout": "D:\\OandO07072026",
  "worktrees": false,
  "evidenceRoot": "results/planner/world-standard-wave/03-select-delete",
  "HEAD": "<paste from HEAD.txt>",
  "fabricFurnitureFlag": "OFF",
  "unit": { "exitCode": 0, "log": "vitest-w3-raw.log" },
  "p0unit": { "exitCode": 0, "log": "p0-unit-raw.log" },
  "browser": {
    "exitCode": 0,
    "tool": "playwright",
    "log": "browser-w3-raw.log",
    "screenshots": [
      "01-placed.png",
      "02-selected.png",
      "03-deleted.png",
      "04-undone.png"
    ]
  },
  "startedAt": "<ISO>",
  "endedAt": "<ISO>",
  "status": "PASS"
}
```

If browser failed: `"status": "FAIL"` and list blockers.

- [ ] **Step 2: Write `W3-ACCEPTANCE.md`**

Map each CP-03.1–03.11 row to artifact path. Explicitly state:

- Furniture-only bar  
- No multi-select claim  
- No journey substitute  
- Fabric OFF  
- Unit alone was not used as green  

- [ ] **Step 3: Write `FILES-TOUCHED.md`**

List every path changed this execute (tests + product if Mode B).

- [ ] **Step 4: Finalize NOTES.md**

Include residuals: e2e count-only id (unit carries pose), Esc-in-input, systems place dependency, status regex.

- [ ] **Step 5: Layout check**

```powershell
Set-Location D:\OandO07072026
pnpm run check:layout
```

Expected: pass — no `site/results/`.

- [ ] **Step 6: Commit sign-off**

```bash
git add results/planner/world-standard-wave/03-select-delete/
git commit -m "test(open3d): CP-03 W3 select/delete evidence sign-off"
```

- [ ] **Step 7: Tick program checklists only if CP-03.6–03.9 green**

Do not mark INDEX/MASTER W3 complete without browser + unit artifacts.

---

## 7. Test matrix

### 7.1 Unit matrix

| Area | File | Cases | Required CP-03 |
|------|------|-------|----------------|
| pick hit/miss/pad/top/rot | `geometry/canvasPicking.test.ts` | existing | Yes |
| pick empty + default 600 | same | Task 01 add | Yes |
| pure delete single | `applySelectionDelete.test.ts` | existing | Yes |
| pure multi-id one history | same | existing | Yes |
| pure no-op none/missing | same | existing | Yes |
| pure locked + pose undo | same | Task 02 add | Yes |
| wall cascade | same | existing | Regression gold |
| keyboard Del/Bksp preventDefault | `open3dWorkspaceKeyboard.test.tsx` | existing | Yes |
| keyboard Ctrl+Bksp / omit / textarea | same | Task 04 add | Yes |
| keyboard Esc → cancel | same | existing | Yes |
| Feasibility select furniture | `open3dFeasibilityCanvas.test.tsx` | Task 05 add | Yes |
| Feasibility empty → none | same | Task 05 | Yes |
| wall tool ≠ furniture select | same | Task 05 | Yes |
| modelOperations pack | `modelOperations.test.ts` | suite | Pack |
| p0:unit | monorepo script | non-regression | CP-03.7 |

### 7.2 Browser matrix

| Case | Required | Notes |
|------|----------|-------|
| place ≥1 furniture | Yes | seed |
| arm Select | Yes | button / V |
| click furniture → selection UI | Yes | not “No Selection” |
| Delete → count down | Yes | keyboard path |
| Ctrl+Z → count up | Yes | Windows CI Control+z |
| Screenshots 3–4 | Yes | under `03-select-delete/` |
| Backspace path | Unit yes; browser optional | |
| Esc deselect | Unit yes; browser optional | |
| Same id after undo | **Unit hard**; browser soft | |
| Fabric ON as sole proof | **Forbidden** | |
| Journey folder substitute | **Forbidden** | |

### 7.3 Commands cheat sheet

```powershell
# Unit W3 pack
Set-Location D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts `
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx `
  tests/unit/features/planner/open3d/modelOperations.test.ts `
  --reporter=verbose

# p0 non-regression
pnpm run p0:unit

# Browser
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm exec playwright test -c config/build/playwright.config.ts `
  tests/e2e/open3d-w3-select-delete.spec.ts --reporter=list
```

### 7.4 Expected outputs (honest)

| Command | Expected |
|---------|----------|
| vitest W3 pack | exit 0; all listed suites pass; raw log unfiltered |
| p0:unit | exit 0 |
| playwright W3 | exit 0; 4 PNGs; furniture count deltas asserted |
| unit green + browser red | **CP-03 FAIL** |
| browser green + unit red | **CP-03 FAIL** |

---

## 8. False-green catalog

| Trap | Why it lies | Hard assert / block |
|------|-------------|---------------------|
| Unit-only W3 | Handlers exist | Browser artifacts under `03-select-delete/` |
| Journey claims W3 | Draw/place ≠ select/delete/undo | Separate CP-03 browser pack |
| Appendix “PASS” without results/ | Docs rot | Re-run; deposit run.json |
| Fabric select e2e | Wrong engine | Flag OFF + Feasibility |
| `firstFurnitureCenter` / `__plannerFabricView` | Fabric-stage hooks | Ban for W3 |
| Click without Select tool | Default tool often wall | Explicit Select arm |
| Absolute furniture ≥1 residual IDB | Prior project | clear storage + **deltas** |
| Undo count up with new UUID | Fake restore | Unit same id+pose |
| Screenshot non-blank only | No delete proof | Metric delta after Delete |
| Parallel workers race PNGs | Invalid evidence | `mode: "serial"` |
| Properties panel delete only | Keyboard unproven | Keyboard in browser |
| preventDefault untested | Browser-back risk | Unit `defaultPrevented` |
| Multi-history still green single-id | Multi-id undo broken | Multi-id unit mandatory |
| Esc only cancels draw | Selection stuck | Esc + setSelection none |
| Filter/skip logs | Handbook fail | Zero suppression |
| `toBeLessThan` without place | Weak | place first; prefer −1 when safe |
| Enable Fabric “to make tests pass” | False engine | NOTES + env |
| Degrees→radians “cleanup” | Breaks pick/mesh | Forbidden mid-W3 |
| Claim multi-select shipped | Scope lie | CP-03.11 NOTES |
| site/results dump | Layout violation | `check:layout` |

---

## 9. Stop-if-fail / CP-03 criteria

### 9.1 Checkpoint table

| # | Criterion | Proof |
|---|-----------|--------|
| CP-03.1 | pickFurniture hit/miss/top-most/rotation (+ empty/default 600) | `01-pick-furniture-vitest-raw.log` |
| CP-03.2 | Select tool sets furniture selection (unit) | `05-canvas-select-vitest-raw.log` |
| CP-03.3 | Delete removes selected furniture | `02` / `03` logs |
| CP-03.4 | Delete+Backspace + preventDefault | `04-keyboard-delete-vitest-raw.log` |
| CP-03.5 | Undo same id + pose | `02-delete-undo-vitest-raw.log` |
| CP-03.6 | Unit pack under evidence folder exit 0 | `vitest-w3-raw.log` |
| CP-03.7 | `p0:unit` non-regression | `p0-unit-raw.log` + `p0-unit-run.json` |
| CP-03.8 | **Browser** select→delete→undo | `browser-w3-raw.log` + PNGs |
| CP-03.9 | `run.json` PASS + honest NOTES | `run.json` |
| CP-03.10 | Commits on main checkout | NOTES / git log |
| CP-03.11 | No false full journey / multi-select claim | NOTES |

### 9.2 Stop conditions

1. Unit pack exit ≠ 0 → stop; fix before browser claim.  
2. Browser exit ≠ 0 → CP-03 FAIL even if unit green.  
3. Fabric ON required for green → FAIL; fix Feasibility path.  
4. Evidence only in journey folder → FAIL.  
5. Results under `site/results/` → FAIL layout.  
6. Owner goal change to move/rotate module → stop; re-plan (not silent expand).

---

## 10. Commit sequence

Suggested progressive commits (Mode A may skip production commits):

1. `docs(planner): P03 baseline evidence dir for W3 select/delete`  
2. `test(open3d): complete pickFurnitureAtPoint cases for W3 select`  
3. `fix(open3d): correct furniture pick hit-test for select tool` *(Mode B only)*  
4. `test(open3d): lock identity and pose restore for applySelectionDelete W3`  
5. `feat(open3d): pure applySelectionDelete with undo-safe history` *(Mode B only if missing)*  
6. `fix(open3d): single-history deleteSelection for furniture W3` *(Mode B only)*  
7. `test(open3d): Delete/Backspace guards and preventDefault for W3`  
8. `test(open3d): FeasibilityCanvas furniture select sets selection for W3`  
9. `fix(open3d): Esc clears planner selection (W3 grammar)` *(Mode B only)*  
10. `test(open3d): W3 select/delete unit evidence pack`  
11. `test(open3d): W3 select/delete browser evidence pack CP-03`  
12. `test(open3d): CP-03 W3 select/delete evidence sign-off`  

Re-proof-only squash allowed if honest:

```text
test(open3d): re-deposit W3 unit+browser evidence CP-03
```

---

## 11. Risks & owner decisions

### 11.1 Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Evidence tree wiped again | High | Re-prove before any green language |
| E2E click miss on 0.5,0.5 | Medium | Harden coords / selectPlannerTool / screenshots on fail |
| Systems configurator red blocks place | Medium | Inventory place fallback; NOTES |
| Status bar regex brittle | Low | Prefer testid later; not CP-03 rewrite |
| Esc-in-input residual | Low | Document; P09 if product wants always-deselect |
| Agent reimplements pure helper from appendix tuple API | Medium | This plan: live signature wins |
| Parallel agent thrash on keyboard/helpers | High | One writer; serialize |
| Confusing CP-03 with later `modules/select-edit` complete | Medium | Explicit residual list |
| Degrees conversion thrash with P04 | High | Degrees lock non-negotiable |

### 11.2 Owner decisions (resolved stances — not TBD)

| Question | Stance |
|----------|--------|
| Multi-select as CP-03? | **No** — furniture single-select product bar |
| Openings first-class gate? | **No** — still pickable; not CP screenshots center |
| Pure return tuple vs project only? | **Keep live project-only** |
| Properties delete dual path? | **Allowed** |
| Re-select after undo? | **Not required** for CP-03 |
| Fabric ON proof? | **Forbidden** as sole W3 proof |
| Browser tool? | Playwright preferred; chrome-devtools OK |
| Approach B greenfield Fabric-first? | **Rejected** |
| Push policy | **AGENTS.md** (agent push when right) |

### 11.3 Open residual (honest, not blocking)

1. E2E does not assert same entity id after undo (unit does).  
2. Esc while typing in properties does not clear selection.  
3. No visible trash button required (keyboard sufficient).  
4. Default tool wall → buyer must discover Select/V.  
5. Later module re-proof under `modules/select-edit/` if global-standard modules program runs.

---

## 12. Self-review vs brainstormer + repo

### 12.1 Repo coverage checklist

| Touched / verified path | In task? |
|-------------------------|----------|
| `canvasPicking.ts` pickFurniture | Task 01 |
| `workspaceEntityHelpers.ts` applySelectionDelete | Task 02–03 |
| `OOPlannerWorkspace.tsx` deleteSelection / Esc | Task 03, 06 |
| `useWorkspaceKeyboard.ts` | Task 04 |
| `FeasibilityCanvas.tsx` select branch | Task 05 |
| `useWorkspaceCanvas.ts` / history / plannerCommand | verified architecture; Mode B only if red |
| `fabricFurnitureFlag.ts` | Task 00 / 08 NOTES |
| Unit tests listed | Tasks 01–07 |
| `open3d-w3-select-delete.spec.ts` | Task 08 |
| Evidence `03-select-delete/` | Tasks 00, 07–09 |

### 12.2 Brainstormer coverage checklist

| REPORT theme | Plan section / task |
|--------------|---------------------|
| Furniture-only bar | Goal, §2.1, CP-03.11 |
| Unit + browser hard gate | Tasks 07–08, false-green |
| Single history multi-id | Task 02–03 |
| preventDefault | Task 04 |
| Esc clears selection | Task 06 |
| Fabric OFF | Task 00, 08 |
| Degrees lock | Non-negotiables |
| Evidence missing | Task 00, 09, dual-truth |
| Competitive ideas only | §3 Ethics |
| Approach Gamma re-proof | §0.2 Mode A |
| False-green matrix | §8 |
| E2E critique | Task 08.C |
| Raised bar not in CP-03 | §2.6 |
| P07 must not substitute | §9 stop conditions |

### 12.3 Placeholder scan

No TBD / “implement later” / “similar to Task N” without full content. Full test sources provided for gap cases. Live production snippets inlined where Mode B may touch them.

### 12.4 Type consistency

| Type | Canonical location |
|------|--------------------|
| `CanvasSelection` | `useWorkspaceCanvas.ts` |
| `Open3dProject` / furniture item | `open3d/model/types.ts` |
| `Open3dHistoryState` | `store/history.ts` |
| `PlannerTool` | `canvasTool.ts` |
| `WorkspaceKeyboardHandlers` | `useWorkspaceKeyboard.ts` |

`store/selection.ts` `PlannerSelection` is **not** wired as canvas authority — do not mix mid-P03.

### 12.5 Length honesty

Plan is long because: dual-truth (landed code vs missing evidence), full gap tests, full browser preflight, false-green catalog, and CP table. Thin “code already exists, just re-run” would **fail** this skill’s bar and would re-create appendix rot.

---

## 13. Appendices

### Appendix A — Full type / signature catalog used in this plan

```typescript
// CanvasSelection (runtime authority)
export interface CanvasSelection {
  type: "wall" | "door" | "window" | "furniture" | "room" | "none";
  ids: string[];
}

// Pure delete (live)
export function applySelectionDelete(
  project: Open3dProject,
  selection: CanvasSelection,
): Open3dProject;

// Pick
export function pickFurnitureAtPoint(
  point: Open3dPoint,
  furniture: readonly Open3dFurnitureItem[],
  paddingMm?: number,
): string | null;

// History
export function createOpen3dHistory(project: Open3dProject): Open3dHistoryState;
export function updateOpen3dProject(
  history: Open3dHistoryState,
  updater: (project: Open3dProject) => Open3dProject,
  now?: string,
): Open3dHistoryState;
export function undoOpen3dAction(history: Open3dHistoryState): Open3dHistoryState;

// Commands
export function executePlannerCommand(
  history: Open3dHistoryState,
  command: PlannerCommand,
): PlannerCommandResult;

// Keyboard handlers (partial)
export interface WorkspaceKeyboardHandlers {
  setTool: (tool: PlannerTool) => void;
  toggleView: () => void;
  openPalette: () => void;
  undo: () => void;
  redo: () => void;
  cancel: () => void;
  deleteSelection?: () => void;
  enabled?: boolean;
  // …
}

// Fabric flag
export function isOpen3dFabricFurnitureEnabled(
  env?: NodeJS.ProcessEnv | Record<string, string | undefined>,
): boolean; // true only when env value === "1"
```

### Appendix B — INITIAL_TRANSFORM math example

```
origin = (-4000, -2500), scale = 0.1
project (0, 0) → screen x = (0 - (-4000)) * 0.1 = 400
                 screen y = (0 - (-2500)) * 0.1 = 250
```

Unit pointer at furniture `(0,0)` with mocked rect `(0,0)` uses `clientX=400, clientY=250`.

### Appendix C — Evidence layout (canonical)

```
results/planner/world-standard-wave/03-select-delete/
  run.json
  HEAD.txt
  NOTES.md
  FILES-TOUCHED.md
  W3-ACCEPTANCE.md
  00-baseline-vitest-raw.log
  00-baseline-run.json
  01-pick-furniture-vitest-raw.log
  02-delete-undo-vitest-raw.log
  03-workspace-delete-vitest-raw.log
  04-keyboard-delete-vitest-raw.log
  05-canvas-select-vitest-raw.log
  vitest-w3-raw.log
  p0-unit-raw.log
  p0-unit-run.json
  browser-w3-raw.log
  01-placed.png
  02-selected.png
  03-deleted.png
  04-undone.png
```

### Appendix D — Research translation table (ideas → O&O)

| Research idea | O&O implementation | Not shipped |
|---------------|-------------------|-------------|
| Del/Backspace delete selection | `useWorkspaceKeyboard` | Competitor shortcut overlay chrome |
| Esc deselect | cancel → setSelection none | Full mode machine clone |
| Furniture priority in pick | Feasibility hit order | Floorplanner marquee multi-select |
| Undo restore | open3d history snapshots | Named history timeline UI |
| Select → properties | PropertiesPanel | RoomSketcher trash bin required |
| Structure then furnish loop | W1/W2 then W3 | P5D template marketplace |

### Appendix E — Selector / role table (browser)

| Intent | Locator strategy |
|--------|------------------|
| Select tool | `getByRole("button", { name: /Select/i })` or `selectPlannerTool(page, "Select")` |
| Drawing tools group | `getByRole("group", { name: "Drawing tools" })` |
| Canvas | `[data-testid="planner-2d-canvas"] canvas` / label “Floor plan drawing surface” |
| Empty properties | `getByRole("heading", { name: /No Selection/i })` count 0 when selected |
| Furniture count | body/status regex `/(\d+)\s+furniture/i` |

### Appendix F — Expert false-reverse list (tape to monitor)

1. Furniture rotation → radians  
2. Fabric full-stage / flag-ON for W3  
3. Port 3D thrash mid-gate  
4. Unit-only W3  
5. Multi-history delete  

### Appendix G — Kill order context

```
CP-00 → CP-01 → CP-02 → **CP-03 W3** → … → CP-07 journey → CP-06 save
```

Do not celebrate full planner story with W3 red. Journey may re-assert select/delete later but **must not substitute**.

### Appendix H — Properties panel dual path (allowed)

```typescript
// OOPlannerWorkspace — single-id properties delete (OK for P03)
const handleDeleteEntity = useCallback(
  (collection, id) => {
    workspaceCanvas.updateProject((project) =>
      deleteEntityFromProject(project, collection, id),
    );
    workspaceCanvas.setSelection({ type: "none", ids: [] });
  },
  [workspaceCanvas],
);
```

Keyboard path remains the CP-03 proof path.

### Appendix I — `applySelectionDelete` full live algorithm (reference)

```typescript
export function applySelectionDelete(
  project: Open3dProject,
  selection: CanvasSelection,
): Open3dProject {
  if (selection.type === "none" || selection.ids.length === 0) {
    return project;
  }
  const collection = COLLECTION_BY_SELECTION[selection.type];
  if (!collection) {
    return project;
  }
  const floorIndex = project.floors.findIndex((floor) => floor.id === project.activeFloorId);
  if (floorIndex === -1) {
    return project;
  }
  const floor = project.floors[floorIndex];
  const idSet = new Set(selection.ids);
  const items = floor[collection] as Array<{ id: string; locked?: boolean }>;
  const nextItems = items.filter((item) => {
    if (!idSet.has(item.id)) return true;
    if (item.locked) return true;
    return false;
  });
  if (nextItems.length === items.length) {
    return project;
  }
  const removedWallIds =
    collection === "walls"
      ? items.filter((item) => idSet.has(item.id) && !item.locked).map((item) => item.id)
      : [];
  const removedWallSet = new Set(removedWallIds);
  const updatedFloor: Open3dFloor = {
    ...floor,
    [collection]: nextItems as (typeof floor)[typeof collection],
    ...(removedWallSet.size > 0
      ? {
          doors: floor.doors.filter((d) => !removedWallSet.has(d.wallId)),
          windows: floor.windows.filter((w) => !removedWallSet.has(w.wallId)),
        }
      : {}),
  };
  const floors = [...project.floors];
  floors[floorIndex] = updatedFloor;
  return { ...project, floors };
}
```

### Appendix J — Buyer human script (manual smoke, optional)

1. Open `/planner/guest/?plannerDevTools=1`  
2. Place one furniture (inventory or systems)  
3. Press **V** or click **Select**  
4. Click furniture → properties not empty  
5. Press **Delete** → furniture gone  
6. Press **Ctrl+Z** → same piece back  
7. Select again → **Esc** → selection cleared, item remains  

If only unit mocks work, product is not buyer-green.

---

## 14. Execution handoff

**Plan complete and saved to `plans2/P03-select-delete/IMPLEMENTATION-PLAN.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

**Which approach?**

**Handover one-liner:** W3 = Feasibility select + Del/Bksp (`preventDefault`) + single-history `applySelectionDelete` + undo same id/pose; unit **then** minimal browser under `results/planner/world-standard-wave/03-select-delete/`; code mostly landed — **re-prove + fill unit gaps**; appendix PASS is stale while `results/` missing.
