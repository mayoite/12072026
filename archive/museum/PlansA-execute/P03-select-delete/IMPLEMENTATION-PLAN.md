# P03 — Select / Delete / Undo (W3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** Buyer on `/planner/open3d` or guest planner can **select furniture on 2D Feasibility**, press **Delete or Backspace** to remove it, and **Ctrl/Cmd+Z** to restore the **same entity id + pose** — proven by **unit pack + browser pack** under `results/planner/world-standard-wave/03-select-delete/` (unit alone = FAIL).

**Architecture:** Approach **A** — FeasibilityCanvas is the interactive 2D surface; document model is active-floor `furniture[]` with UUIDs; selection is **transient** `CanvasSelection` on `useWorkspaceCanvas` (never in history). Select tool pointer → `pickFurnitureAtPoint` → `setSelection({ type: "furniture", ids })`. Delete/Backspace → `useWorkspaceKeyboard` → workspace `deleteSelection` → pure `applySelectionDelete` → **one** `updateProject` when membership changes → clear selection. Undo → `history.undo` / `executePlannerCommand({ type: "history.undo" })` restores full prior project graph. Fabric furniture flag **OFF** for all W3 proof.

**Tech Stack:** Next.js `site/` · FeasibilityCanvas (Canvas 2D) · Vitest · Playwright (`open3d-w3-select-delete.spec.ts`) · open3d history (`createOpen3dHistory` / `updateOpen3dProject` / `undoOpen3dAction` via command layer) · no `any` · main checkout only `.` · no worktrees.

**Inputs consumed:**
- Repo read: **2026-07-10** — `results/planner/` **absent** on disk (evidence not depositable); product code + unit/e2e tests largely present under `site/features/planner/open3d/` and `site/tests/`. Re-read HEAD at execute with `git rev-parse HEAD`.
- Brainstormer: **`Idiots2/P03-select-delete/REPORT.md` only** (never `Idiots/`).
- Phase plan: `Plans/phases/P03-select-delete/` (execute card, appendix, suggestions, 01/02/04 experts).
- Maps: `Plans/Research/RESULTS-MAP.md` · RESEARCH-MAP P03 row · structure advice (one CP, no split).

**Done when:**
1. CP-03.1–03.11 table green with **live artifacts** under `results/planner/world-standard-wave/03-select-delete/` (not appendix prose).
2. Unit pack exit 0 (pick + pure delete + keyboard preventDefault + canvas select + undo same id/pose + locked identity).
3. Browser: Select → furniture → Delete → furniture count drops → Ctrl+Z restores count (and id when observable); PNGs + raw log.
4. Fabric flag OFF documented in NOTES; no dual selection store; no competitor chrome.
5. No false claim that P07 journey or unit-only = W3.

**Evidence folder (canonical):** `results/planner/world-standard-wave/03-select-delete/`  
Create on execute; **re-prove if missing** (current checkout: missing).

**Plan write path (only):** `plans1/P03-select-delete/IMPLEMENTATION-PLAN.md`

---

## 0. How to use this plan (execute posture)

### 0.1 Dual-truth at plan time (binding)

| Layer | Status 2026-07-10 |
|-------|-------------------|
| Product code select/delete/keyboard/history | **Mostly landed** — see §1 Repo reality |
| Unit tests (pick, pure delete, Del/Bksp preventDefault) | **Present** — gaps listed |
| Canvas select furniture unit | **Missing** as dedicated case |
| Browser spec | **Present** `site/tests/e2e/open3d-w3-select-delete.spec.ts` |
| Evidence tree `results/planner/…/03-select-delete/` | **ABSENT** — appendix “CP-03 PASS” is **stale for gate claims** |
| Gate language | **Do not** tick MASTER/INDEX W3 until artifacts re-deposited |

### 0.2 Execute modes

| Mode | When | What to do |
|------|------|------------|
| **A — Close gaps + re-prove** (default) | Code matches §1 “present” | Do **not** rewrite working pure helpers. Add missing tests (TDD), harden browser if flaky, deposit full evidence pack. |
| **B — Repair regression** | Any unit/browser red | Fix minimal production code; keep Approach A; no Fabric thrash. |
| **C — Full greenfield rebuild** | Code missing (unlikely) | Follow Tasks 01–06 as classic TDD as written. |

**Default for this plan: Mode A**, with Mode B steps when RED.

### 0.3 Skills at execute

| Skill | When |
|-------|------|
| `/using-superpowers` | Always |
| TDD | Tasks 01–06 (and gap tests) |
| verification-before-completion | Tasks 07–09 |
| chrome-devtools or Playwright | Task 08 |
| systematic-debugging | On red |

### 0.4 Non-negotiables

1. Unit-green alone = **CP-03 FAIL**.
2. Journey folder (`02-browser-open3d-journey/`) must **not** substitute for W3.
3. Fabric `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` must be **≠ `"1"`** for W3 proof.
4. Furniture rotation stays **degrees** in document.
5. Multi-id delete = **one** history step.
6. Undo restores **same id + pose**, not new UUID.
7. No worktrees; work only in `.`.
8. No `any` in handwritten code.
9. Evidence only under repo-root `results/` — never `site/results/`.
10. Research/`D:\websites` = **ideas only** — no competitor UI/assets/copy.

---

## 1. Repo reality

### 1.1 Primary production paths (live)

| Path | Role | Live status (2026-07-10) |
|------|------|--------------------------|
| `site/features/planner/open3d/lib/geometry/canvasPicking.ts` | `pickFurnitureAtPoint` — reverse scan, inverse-rotation AABB, default 600mm, padding | **Present** ~L145–164 |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Select tool: furniture → openings → wall → room; selection ring paint | **Present** ~L736–778, paint ~L589–614 |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | `deleteSelection` via pure helper; Esc cancel clears selection | **Present** ~L325–333, ~L730–757 |
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | Delete/Backspace + `preventDefault`; Esc → cancel; Ctrl+Z undo | **Present** ~L71–86, ~L101–104 |
| `site/features/planner/open3d/editor/workspaceEntityHelpers.ts` | `applySelectionDelete`, `deleteEntityFromProject` | **Present** pure API returns `Open3dProject` only (not appendix `{project,selection}` tuple) |
| `site/features/planner/open3d/editor/useWorkspaceCanvas.ts` | `CanvasSelection`, history via `executePlannerCommand`, selection transient | **Present** |
| `site/features/planner/open3d/store/history.ts` | `createOpen3dHistory`, `updateOpen3dProject` (ref identity), undo/redo | **Present** |
| `site/features/planner/open3d/lib/commands/plannerCommand.ts` | Sole write authority for document.update / undo | **Present** |
| `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` | Flag `=== "1"` only | **Present** default OFF |
| `site/features/planner/open3d/store/selection.ts` | Optional typed selection helper — **not** runtime authority | Present; **do not** dual-store migrate in P03 |
| `site/features/planner/open3d/lib/geometry/snapping.ts` | `projectToScreen` / `screenToProject` / `CanvasTransform` | **Present** |

### 1.2 Live algorithms (source of truth — repo wins over appendix prose)

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

**Do not “fix” the signature to match appendix unless a deliberate dual-return is added and all callers updated.** Prefer live contract.

#### 1.2.3 Workspace `deleteSelection`

```typescript
// OOPlannerWorkspace.tsx — live
const deleteSelection = useCallback(() => {
  const { selection } = workspaceCanvas;
  if (selection.type === "none" || selection.ids.length === 0) return;
  workspaceCanvas.updateProject((project) =>
    applySelectionDelete(project, selection),
  );
  workspaceCanvas.setSelection({ type: "none", ids: [] });
}, [workspaceCanvas]);
```

`updateProject` → `document.update` → `updateOpen3dProject`: **same project ref = history no-op** (no past push).

#### 1.2.4 Keyboard Delete/Backspace

```typescript
// useWorkspaceKeyboard.ts — live
if ((event.key === "Delete" || event.key === "Backspace") && !mod) {
  event.preventDefault();
  handlers.deleteSelection?.();
  return;
}
```

Editable targets early-return **before** this block. Esc calls `handlers.cancel()` with preventDefault.

#### 1.2.5 Esc cancel (workspace)

```typescript
// OOPlannerWorkspace — both paletteHandlers.cancel and keyboard cancel:
setPendingCatalogItemId(null);
canvasRef.current?.cancel();
workspaceCanvas.setSelection({ type: "none", ids: [] });
```

### 1.3 Tests inventory

| Test file | What it covers | Gap vs W3 bar |
|-----------|----------------|---------------|
| `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts` | hit, miss, top-most, rot90, padding | empty array; default 600 when width/depth omitted |
| `site/tests/unit/features/planner/open3d/applySelectionDelete.test.ts` | none same-ref; remove one; multi-id one past + undo ids; missing same-ref; wall cascade | **locked** same-ref; **pose** on undo; `updateOpen3dProject` path; empty ids |
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | Del/Bksp preventDefault + call; Esc cancel; undo/redo; editable Ctrl+K; disabled | Ctrl+Backspace must not delete; Del in `<input>` must not delete; omitted `deleteSelection` no throw |
| `site/tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx` | walls, room, dimension, place payload; select tool only for place | **No furniture select pointer → setSelection case** |
| `site/tests/e2e/open3d-w3-select-delete.spec.ts` | place seats → Select → click → Delete → Ctrl+Z + screenshots | Count-only (no id assert); evidence dir must exist; place uses systems configurator (OK for setup) |
| `site/tests/unit/config/playwrightOpen3dWorldSpecs.test.ts` | Manifest gates W3 → `open3d-w3-select-delete.spec.ts` | Contract only |

**Note:** Execute card names `deleteSelection.test.ts`; live suite is **`applySelectionDelete.test.ts`**. Prefer live filename; do not rename mid-phase without updating all evidence scripts.

### 1.4 Evidence / git honesty

| Check | Result |
|-------|--------|
| `results/` | **Does not exist** on this checkout |
| `results/planner/world-standard-wave/03-select-delete/` | **Missing** |
| Appendix “CP-03 PASS” | **Stale** as gate claim |
| HEAD | Re-capture at Task 00: `git rev-parse HEAD` → `HEAD.txt` |

### 1.5 Contradictions (plan text vs code)

| Claim | Code truth | Plan rule |
|-------|------------|-----------|
| Pre-land multi-history loop in `deleteSelection` | Fixed: one `updateProject` + pure helper | Do not reintroduce N-loop |
| Del/Bksp without preventDefault | Fixed with unit | Keep tests |
| Esc may not clear selection | Fixed in cancel handlers | Keep / add integration assert if brittle |
| Pure API returns selection | Live returns project only | **Repo wins** — document live API |
| CP-03 PASS | Evidence tree missing | **Re-prove** |

### 1.6 Out of P03 scope (do not thrash)

- Fabric full-stage cutover / flag-ON proof
- 3D pick/delete (P04)
- Full W1–W2 journey (P07)
- Multi-select marquee / groups / move-rotate handles
- Autosave / hard-reload honesty (P06) — adjacency only
- Shortcut chrome audit beyond Esc/Delete honesty (P09)
- Competitor chrome, Firecrawl re-scrape

---

## 2. Brainstormer synthesis (Idiots2 only)

Source: `Idiots2/P03-select-delete/REPORT.md` (websites-first wave 2).

### 2.1 Product job (one sentence)

> Select object → remove it → undo restores identity.

### 2.2 Industry grammar → O&O (ideas only)

| Pattern | Packs | O&O form | Gate |
|---------|-------|----------|------|
| Click select | Floorplanner, RS, P5D | `pickFurnitureAtPoint` → furniture selection | W3 |
| Selection highlight | All | Feasibility selection ring (O&O tokens) | W3 |
| Del/Backspace | Floorplanner manual; CAD-lite | keyboard + preventDefault | W3 |
| Esc deselect | Floorplanner | cancel clears selection | W3 grammar |
| Ctrl/Cmd+Z | Floorplanner; ease recovery | history undo same id+pose | W3 |
| Selection not in undo | UI benchmark | transient selection | W3 |
| Furniture hit priority | Floorplanner marquee idea | furniture → openings → wall → room | W3 |
| Lock skip | RS | locked no-op same ref | W3 |
| Single history multi-id | engineering | pure batch delete | W3 |
| Multi-select marquee | Floorplanner | **post-W3** | — |
| Move/rotate handles | P5D selected menu | **post-W3** | — |
| Trash button | RS | optional if keyboard works | W8 |

### 2.3 Approaches (locked)

| Lock | Value |
|------|-------|
| Approach | **A** Feasibility + document first |
| Fabric | Destination after W gates; flag OFF for W3 |
| Selection authority | `workspaceCanvas.selection` only |
| Product bar | **Furniture** select/delete/undo |
| Rotation | Degrees |

### 2.4 Raised bar (post-CP-03 — do not expand mid-spine)

CP-03 minimal ≠ select-edit complete ≠ CAD multi-select. Know residual: default tool wall discoverability (P09), no move handles, 3D select later (P04).

### 2.5 Failure modes to block in this plan

| Mode | Block with |
|------|------------|
| Unit-only W3 | Task 08 hard gate |
| Journey substitutes | Separate evidence folder |
| Fabric flag-ON proof | NOTES + env check |
| Multi-history delete | multi-id pure + `updateOpen3dProject` once |
| Missing preventDefault | keyboard unit defaultPrevented |
| Esc incomplete | cancel clears selection |
| New UUID on undo | assert same id + pose |
| Evidence missing | Task 00 + 09 re-deposit |
| Default tool wall | browser activates Select |
| Absolute furniture ≥1 | delta vs before place |

### 2.6 Buyer journeys that die without W3

Wrong SKU cannot be removed; clutter; demo trust kill; place without delete is half a product; BOQ lies if delete does not mutate document.

### 2.7 Open stances (resolved in report — not TBD)

- Unit only? **No**
- Journey substitutes? **No**
- Openings in CP-03 bar? **No**
- Multi-select UI? **No** (pure multi-id still required)
- Fabric for proof? **OFF**
- Esc clear selection? **Yes**
- Same id on undo? **Yes**
- Split CP for browser? **Reject**

---

## 3. Ethics / non-copy

| Allowed | Forbidden |
|---------|-----------|
| Industry grammar (Del, Esc, Ctrl+Z) | Competitor JS, meshes, icons, screenshots in product |
| Select + props as **capability** | Floorplanner mega-tabs trade dress (REJ-01) |
| Furniture-over-structure hit priority as **product rule** | P5D red FAB / icon rings / brand palette |
| Visible undo as ease recovery | Manual PDF prose as product copy |
| O&O Phosphor + tokens | “Looks like Floorplanner” acceptance |

**Attestation:** If a UI decision only makes sense because a competitor looks that way → reject.

---

## 4. File map

### 4.1 Modify only if regression or intentional gap fix

| File | Expected change (Mode A) |
|------|--------------------------|
| `…/lib/geometry/canvasPicking.ts` | None if suite green |
| `…/canvas-feasibility/FeasibilityCanvas.tsx` | None if select path green |
| `…/editor/OOPlannerWorkspace.tsx` | None if deleteSelection/Esc green |
| `…/editor/useWorkspaceKeyboard.ts` | Only if preventDefault/edge cases fail |
| `…/editor/workspaceEntityHelpers.ts` | Only if locked/multi-id/identity fail |

### 4.2 Tests (create or extend)

| File | Action |
|------|--------|
| `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts` | Extend: empty array, default 600mm |
| `site/tests/unit/features/planner/open3d/applySelectionDelete.test.ts` | Extend: locked, pose undo, updateOpen3dProject one past |
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | Extend: Ctrl+Bksp, editable Del, omitted handler |
| `site/tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx` | **Add** furniture select pointer case |
| `site/tests/unit/features/planner/open3d/workspaceDeleteSelection.wire.test.ts` | **Optional new** — wire `updateOpen3dProject` + multi-id one past (if pure history mock insufficient) |
| `site/tests/e2e/open3d-w3-select-delete.spec.ts` | Harden: `getFurnitureCount` helper, Select via `selectPlannerTool`, evidence paths |
| `site/tests/e2e/plannerCanvasHelpers.ts` | **Optional:** export `getFurnitureCount` |

### 4.3 Evidence (create always on execute)

```
results/planner/world-standard-wave/03-select-delete/
  HEAD.txt
  NOTES.md
  FILES-TOUCHED.md
  W3-ACCEPTANCE.md
  run.json
  00-baseline-vitest-raw.log
  00-baseline-run.json
  01-pick-furniture-vitest-raw.log
  02-delete-undo-vitest-raw.log
  03-workspace-delete-vitest-raw.log   # optional if wire suite exists
  04-keyboard-delete-vitest-raw.log
  05-canvas-select-vitest-raw.log
  vitest-w3-raw.log
  p0-unit-raw.log
  p0-unit-run.json
  browser-w3-raw.log
  01-placed.png | 02-selected.png | 03-deleted.png | 04-undone.png
  (or w3-01-select.png naming — pick one scheme in NOTES)
```

### 4.4 Do not touch

- `site/features/planner/_archive/fabric/**` as live path
- Three/R3F orbit (P04)
- Persistence/autosave (P06) except incidental
- WAVE.md rewrite before evidence

---

## 5. Architecture & data flow

### 5.1 End-to-end W3 flow

```
[Buyer] Select tool (V / rail)
    → FeasibilityCanvas pointerdown (activeTool === "select")
    → screenToProject(client, transform)
    → pickFurnitureAtPoint(raw, furniture, padding)
    → setSelection({ type: "furniture", ids: [id] })  // transient
    → paint selection ring via selectedFurnitureIds

[Buyer] Delete | Backspace (not mod, not editable)
    → useWorkspaceKeyboard preventDefault + deleteSelection()
    → applySelectionDelete(project, selection)  // pure
    → updateProject(updater) once  // document.update → history past push iff ref changes
    → setSelection({ type: "none", ids: [] })

[Buyer] Ctrl/Cmd+Z
    → useWorkspaceKeyboard → undo()
    → executePlannerCommand history.undo
    → furniture[] restored with same ids and poses
```

### 5.2 Document vs transient

| State | In history? | Authority |
|-------|-------------|-----------|
| `Open3dProject` (floors, furniture, walls, …) | Yes | `history.present` |
| `CanvasSelection` | **No** | `useState` in useWorkspaceCanvas |
| Active tool | No | OOPlannerWorkspace / Feasibility |
| Pending catalog place | No | OOPlannerWorkspace |

### 5.3 History identity rule (hard)

`updateOpen3dProject`:

```typescript
const updated = updater(history.present);
if (updated === history.present) return history; // NO past push
// else push present to past, set stamped present, clear future
```

Therefore pure delete **must** return identical `project` reference when membership unchanged (locked-only / missing / empty selection).

### 5.4 Hit order (product)

1. Furniture (`pickFurnitureAtPoint`)
2. Openings (`pickOpeningAtPoint`) — side path; not CP-03 product bar
3. Wall (`pickWallAtPoint`)
4. Room (`pointInPolygon` / room polygon)
5. None

### 5.5 Fabric dual-surface ban

```
NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE === "1"
  → FurnitureFabricLayer mounts
  → Feasibility furniture draw may be suppressed
  → Dual hit ownership risk
W3 PROOF: env must not be "1"
```

### 5.6 Properties panel path (allowed dual)

Single-id `handleDeleteEntity` → `deleteEntityFromProject` + clear selection. OK for P03. Keyboard multi-id uses `applySelectionDelete`. Do not force panel multi-batch in P03.

---

## 6. Task list (TDD — bite-sized)

Every impl task: failing test first when changing behavior. Evidence after green. Commit after landable slice.

---

### Task 00 — Setup / baseline / evidence dir

**Files:**
- Create: `results/planner/world-standard-wave/03-select-delete/` (and parents)
- Create: `HEAD.txt`, `NOTES.md`, `00-baseline-run.json`

- [ ] **Step 0.1: Read authorities**

Read in order:
1. This plan
2. `Plans/phases/P03-select-delete/P03-select-delete.md`
3. `Plans/phases/P03-select-delete/P03-appendix.md`
4. `Idiots2/P03-select-delete/REPORT.md` §§0, 12–15, 20–23
5. Live files in §1.1

- [ ] **Step 0.2: Capture HEAD**

```powershell
Set-Location .
git rev-parse HEAD | Out-File -Encoding utf8 results\planner\world-standard-wave\03-select-delete\HEAD.txt
git status --short | Out-File -Encoding utf8 results\planner\world-standard-wave\03-select-delete\00-git-status.txt
```

Expected: `HEAD.txt` one SHA line; status may be dirty — record honestly.

- [ ] **Step 0.3: Create NOTES skeleton**

Write `results/planner/world-standard-wave/03-select-delete/NOTES.md`:

```markdown
# P03 / W3 evidence NOTES

- Date: <ISO date>
- Checkout: .
- Worktrees: false
- Approach: A
- Fabric furniture flag: OFF (NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE unset or not "1")
- Mode: A close-gaps + re-prove | B repair | C greenfield
- HEAD: <paste>
- Baseline unit exitCode: <fill after 0.4>
- CP-03 status: OPEN until browser green
```

- [ ] **Step 0.4: Baseline vitest (record exit code — do not suppress)**

```powershell
Set-Location site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts `
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\03-select-delete\00-baseline-vitest-raw.log
echo "EXIT:$LASTEXITCODE" | Tee-Object -FilePath ..\results\planner\world-standard-wave\03-select-delete\00-baseline-exit.txt -Append
```

Expected: Prefer exit 0. If red, Mode B — fix before claiming progress. **Never filter failures out of the log.**

- [ ] **Step 0.5: Write `00-baseline-run.json`**

```json
{
  "phase": "P03",
  "gate": "W3",
  "checkpoint": "CP-03",
  "step": "00-baseline",
  "approach": "A",
  "checkout": "D:\\OandO07072026",
  "worktrees": false,
  "evidenceRoot": "results/planner/world-standard-wave/03-select-delete",
  "HEAD": "<from HEAD.txt>",
  "unit": { "exitCode": 0, "log": "00-baseline-vitest-raw.log" },
  "status": "BASELINE",
  "startedAt": "<ISO>",
  "endedAt": "<ISO>"
}
```

- [ ] **Step 0.6: Commit baseline docs only if repo allows evidence commits**

```bash
git add results/planner/world-standard-wave/03-select-delete
git commit -m "docs(planner): P03 baseline evidence dir for W3 select/delete"
```

If `results/` is gitignored, still write files for local/gate proof and note ignore status in NOTES.

---

### Task 01 — Unit: `pickFurnitureAtPoint` completeness

**Files:**
- Modify: `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts`
- Modify only if fail: `site/features/planner/open3d/lib/geometry/canvasPicking.ts`
- Evidence: `01-pick-furniture-vitest-raw.log`

- [ ] **Step 1.1: Write failing tests for remaining appendix cases**

Append inside existing `describe("pickFurnitureAtPoint", …)` (keep existing helper `furniture(...)`):

```typescript
  it("returns null for empty furniture array", () => {
    expect(pickFurnitureAtPoint({ x: 0, y: 0 }, [])).toBeNull();
  });

  it("defaults missing width/depth to 600mm footprint", () => {
    const item: Open3dFurnitureItem = {
      id: "def600",
      catalogId: "cabinet-v0",
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      // width/depth omitted → half = 300
    };
    expect(pickFurnitureAtPoint({ x: 0, y: 0 }, [item])).toBe("def600");
    expect(pickFurnitureAtPoint({ x: 290, y: 0 }, [item])).toBe("def600");
    expect(pickFurnitureAtPoint({ x: 310, y: 0 }, [item])).toBeNull();
  });
```

Ensure imports include `Open3dFurnitureItem` if not already.

- [ ] **Step 1.2: Run pick suite — expect PASS if production already correct (or FAIL if bug)**

```powershell
Set-Location site
pnpm exec vitest run tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts --reporter=verbose
```

Expected:
- New cases **PASS** with current `?? 600` implementation (Mode A).
- If FAIL → Mode B minimal fix in `canvasPicking.ts` only.

- [ ] **Step 1.3: Re-run full pick describe including historical cases**

Confirm still green: hit, miss, top-most, rot90, padding.

- [ ] **Step 1.4: Evidence + commit**

```powershell
pnpm exec vitest run tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\03-select-delete\01-pick-furniture-vitest-raw.log
```

```bash
git add site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts
git commit -m "test(open3d): cover pickFurnitureAtPoint empty and default 600mm for W3"
```

If production fix needed:

```bash
git add site/features/planner/open3d/lib/geometry/canvasPicking.ts site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts
git commit -m "fix(open3d): correct furniture pick hit-test for select tool"
```

---

### Task 02 — Pure: `applySelectionDelete` + history (identity, locked, pose)

**Files:**
- Modify: `site/tests/unit/features/planner/open3d/applySelectionDelete.test.ts`
- Modify only if fail: `site/features/planner/open3d/editor/workspaceEntityHelpers.ts`
- Evidence: `02-delete-undo-vitest-raw.log`

- [ ] **Step 2.1: RED/extend — locked furniture same reference**

```typescript
  it("skips locked furniture and returns same project reference when all selected are locked", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("locked-1"),
    }));
    const floor = project.floors[0]!;
    project = {
      ...project,
      floors: [
        {
          ...floor,
          furniture: floor.furniture.map((f) =>
            f.id === "locked-1" ? { ...f, locked: true } : f,
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
```

- [ ] **Step 2.2: RED/extend — undo restores id + pose via updateOpen3dProject**

```typescript
import {
  createOpen3dHistory,
  undoOpen3dAction,
  updateOpen3dProject,
} from "@/features/planner/open3d/store/history";

  it("updateOpen3dProject + pure delete + undo restores same id and pose", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 1234, y: 567 }, {
      idFactory: ids("furn-pose"),
    }));
    // stamp explicit rotation on document
    project = {
      ...project,
      floors: project.floors.map((f) =>
        f.id === project.activeFloorId
          ? {
              ...f,
              furniture: f.furniture.map((item) =>
                item.id === "furn-pose"
                  ? { ...item, rotation: 45, width: 800, depth: 400 }
                  : item,
              ),
            }
          : f,
      ),
    };

    let history = createOpen3dHistory(project);
    history = updateOpen3dProject(history, (present) =>
      applySelectionDelete(present, {
        type: "furniture",
        ids: ["furn-pose"],
      }),
      "2026-07-10T00:00:00.000Z",
    );

    expect(activeFurniture(history.present)).toHaveLength(0);
    expect(history.past).toHaveLength(1);

    history = undoOpen3dAction(history);
    const restored = activeFurniture(history.present).find((f) => f.id === "furn-pose");
    expect(restored).toBeDefined();
    expect(restored!.id).toBe("furn-pose");
    expect(restored!.position).toEqual({ x: 1234, y: 567 });
    expect(restored!.rotation).toBe(45);
    expect(restored!.catalogId).toBe("cabinet-v0");
    expect(restored!.width).toBe(800);
    expect(restored!.depth).toBe(400);
  });
```

- [ ] **Step 2.3: RED/extend — multi-id one past via updateOpen3dProject (not hand-rolled history)**

```typescript
  it("multi-id furniture delete through updateOpen3dProject is a single past entry", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 100, y: 100 }, {
      idFactory: ids("a"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 200, y: 100 }, {
      idFactory: ids("b"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 300, y: 100 }, {
      idFactory: ids("c"),
    }));

    let history = createOpen3dHistory(project);
    history = updateOpen3dProject(history, (present) =>
      applySelectionDelete(present, {
        type: "furniture",
        ids: ["a", "b"],
      }),
    );

    expect(history.past).toHaveLength(1);
    expect(activeFurniture(history.present).map((f) => f.id)).toEqual(["c"]);

    history = undoOpen3dAction(history);
    expect(activeFurniture(history.present).map((f) => f.id).sort()).toEqual([
      "a",
      "b",
      "c",
    ]);
  });
```

- [ ] **Step 2.4: RED/extend — empty ids same ref**

```typescript
  it("returns same project reference for furniture type with empty ids", () => {
    const project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    const next = applySelectionDelete(project, { type: "furniture", ids: [] });
    expect(next).toBe(project);
  });
```

- [ ] **Step 2.5: Run suite**

```powershell
Set-Location site
pnpm exec vitest run tests/unit/features/planner/open3d/applySelectionDelete.test.ts --reporter=verbose
```

Expected: PASS with live pure helper. If locked path wrong → Mode B fix filter logic only.

**Production reference implementation (only if missing/broken):**

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
      ? items
          .filter((item) => idSet.has(item.id) && !item.locked)
          .map((item) => item.id)
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

- [ ] **Step 2.6: Evidence + commit**

```powershell
pnpm exec vitest run tests/unit/features/planner/open3d/applySelectionDelete.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\03-select-delete\02-delete-undo-vitest-raw.log
```

```bash
git add site/tests/unit/features/planner/open3d/applySelectionDelete.test.ts
git commit -m "test(open3d): harden applySelectionDelete locked identity and pose undo for W3"
```

---

### Task 03 — Wire workspace `deleteSelection` (single history)

**Files:**
- Verify: `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` (`deleteSelection`)
- Optional create: `site/tests/unit/features/planner/open3d/workspaceDeleteSelection.wire.test.ts`
- Evidence: `03-workspace-delete-vitest-raw.log`

Live wire already:

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

- [ ] **Step 3.1: Pure wire algorithm test (no full React workspace mount)**

Create `workspaceDeleteSelection.wire.test.ts`:

```typescript
import { describe, expect, it } from "vitest";

import { applySelectionDelete } from "@/features/planner/open3d/editor/workspaceEntityHelpers";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import { addFurniture } from "@/features/planner/open3d/model/operations/pureActions";
import type { Open3dProject } from "@/features/planner/open3d/model/types";
import type { CanvasSelection } from "@/features/planner/open3d/editor/useWorkspaceCanvas";
import {
  createOpen3dHistory,
  updateOpen3dProject,
  undoOpen3dAction,
} from "@/features/planner/open3d/store/history";

/**
 * Mirrors OOPlannerWorkspace.deleteSelection without React:
 * one updateProject + clear selection when selection non-empty.
 */
function wireDeleteSelection(
  project: Open3dProject,
  selection: CanvasSelection,
): {
  project: Open3dProject;
  selection: CanvasSelection;
  historyPastLength: number;
  history: ReturnType<typeof createOpen3dHistory>;
} {
  if (selection.type === "none" || selection.ids.length === 0) {
    const history = createOpen3dHistory(project);
    return {
      project,
      selection,
      historyPastLength: history.past.length,
      history,
    };
  }
  let history = createOpen3dHistory(project);
  history = updateOpen3dProject(history, (present) =>
    applySelectionDelete(present, selection),
  );
  return {
    project: history.present,
    selection: { type: "none", ids: [] },
    historyPastLength: history.past.length,
    history,
  };
}

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

describe("workspace deleteSelection wire (W3)", () => {
  it("clears selection without history push when selection is none", () => {
    const project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    const result = wireDeleteSelection(project, { type: "none", ids: [] });
    expect(result.project).toBe(project);
    expect(result.historyPastLength).toBe(0);
  });

  it("one multi-id delete → one past → one undo restores both", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("a"),
    }));
    ({ project } = addFurniture(project, "cabinet-v0", { x: 10, y: 0 }, {
      idFactory: ids("b"),
    }));

    const result = wireDeleteSelection(project, {
      type: "furniture",
      ids: ["a", "b"],
    });
    expect(result.historyPastLength).toBe(1);
    expect(result.selection).toEqual({ type: "none", ids: [] });
    const floor = result.project.floors[0]!;
    expect(floor.furniture).toHaveLength(0);

    const undone = undoOpen3dAction(result.history);
    expect(undone.present.floors[0]!.furniture.map((f) => f.id).sort()).toEqual([
      "a",
      "b",
    ]);
  });

  it("locked-only selection does not push history", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-1", "project-1"),
    });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: ids("locked-1"),
    }));
    project = {
      ...project,
      floors: [
        {
          ...project.floors[0]!,
          furniture: [{ ...project.floors[0]!.furniture[0]!, locked: true }],
        },
      ],
    };
    const result = wireDeleteSelection(project, {
      type: "furniture",
      ids: ["locked-1"],
    });
    expect(result.historyPastLength).toBe(0);
    expect(result.project).toBe(project);
    // workspace still clears selection after attempt
    expect(result.selection).toEqual({ type: "none", ids: [] });
  });
});
```

- [ ] **Step 3.2: Run wire suite**

```powershell
Set-Location site
pnpm exec vitest run tests/unit/features/planner/open3d/workspaceDeleteSelection.wire.test.ts --reporter=verbose
```

Expected: PASS.

- [ ] **Step 3.3: Code review gate on OOPlannerWorkspace**

Confirm live `deleteSelection` has **no** `for (const id of selection.ids) updateProject(...)` loop. If loop reintroduced → rewrite to pure helper path as in §1.2.3.

- [ ] **Step 3.4: Evidence + commit**

```powershell
pnpm exec vitest run tests/unit/features/planner/open3d/workspaceDeleteSelection.wire.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\03-select-delete\03-workspace-delete-vitest-raw.log
```

```bash
git add site/tests/unit/features/planner/open3d/workspaceDeleteSelection.wire.test.ts
git commit -m "test(open3d): wire-level single-history deleteSelection for W3"
```

---

### Task 04 — Keyboard Delete / Backspace + preventDefault edges

**Files:**
- Modify: `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx`
- Modify only if fail: `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`
- Evidence: `04-keyboard-delete-vitest-raw.log`

Existing coverage (keep):

```typescript
  it("calls deleteSelection on Delete and Backspace and preventDefaults", () => {
    // asserts defaultPrevented true + call counts 1 then 2
  });
```

- [ ] **Step 4.1: Extend — Ctrl+Backspace does not delete**

```typescript
  it("does not delete on Ctrl+Backspace or Cmd+Backspace", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    const bs = new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Backspace",
      ctrlKey: true,
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(bs);
    });
    expect(handlers.deleteSelection).not.toHaveBeenCalled();

    const bsMeta = new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Backspace",
      metaKey: true,
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(bsMeta);
    });
    expect(handlers.deleteSelection).not.toHaveBeenCalled();
  });
```

- [ ] **Step 4.2: Extend — Delete in editable field does not delete**

```typescript
  it("does not call deleteSelection when focus is in an input", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    const input = document.createElement("input");
    document.body.appendChild(input);
    act(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: "Delete",
          cancelable: true,
        }),
      );
    });
    expect(handlers.deleteSelection).not.toHaveBeenCalled();
    input.remove();
  });
```

- [ ] **Step 4.3: Extend — omitted deleteSelection does not throw**

```typescript
  it("does not throw when deleteSelection handler is omitted", () => {
    const handlers = makeHandlers({ deleteSelection: undefined });
    renderHook(() => useWorkspaceKeyboard(handlers));
    expect(() => {
      press({ key: "Delete" });
      press({ key: "Backspace" });
    }).not.toThrow();
  });
```

- [ ] **Step 4.4: Run keyboard suite**

```powershell
Set-Location site
pnpm exec vitest run tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx --reporter=verbose
```

Expected: PASS. Production already has `!mod` and `handlers.deleteSelection?.()`.

**If preventDefault missing (Mode B fix):**

```typescript
if ((event.key === "Delete" || event.key === "Backspace") && !mod) {
  event.preventDefault();
  handlers.deleteSelection?.();
  return;
}
```

- [ ] **Step 4.5: Evidence + commit**

```powershell
pnpm exec vitest run tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\03-select-delete\04-keyboard-delete-vitest-raw.log
```

```bash
git add site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx
git commit -m "test(open3d): keyboard delete edges preventDefault and editable skip for W3"
```

---

### Task 05 — Canvas select furniture (unit pointer)

**Files:**
- Modify: `site/tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx`
- Modify only if fail: `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`
- Evidence: `05-canvas-select-vitest-raw.log`

**Coord strategy (binding):**

1. Seed furniture at known **project mm**.
2. Convert with `projectToScreen(position, INITIAL_TRANSFORM)` where  
   `INITIAL_TRANSFORM = { origin: { x: -4000, y: -2500 }, scale: 0.1 }`.
3. Mock `getBoundingClientRect` → (0,0) 800×600 (already in suite).
4. **Do not** call `fitToView` in the test.
5. `activeTool="select"` + `workspaceCanvas` from `useWorkspaceCanvas({ initialProject })`.

- [ ] **Step 5.1: Write failing furniture select test**

```typescript
import { projectToScreen } from "@/features/planner/open3d/lib/geometry/snapping";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import { addFurniture } from "@/features/planner/open3d/model/operations/pureActions";

const FEASIBILITY_INITIAL_TRANSFORM = {
  origin: { x: -4000, y: -2500 },
  scale: 0.1,
} as const;

  it("select tool pointer on furniture sets furniture selection (W3)", () => {
    let project = createOpen3dProject({ name: "SelectFurniture" });
    // stable ids for assertion
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: () => "furn-select-1",
    }));
    // ensure footprint present
    project = {
      ...project,
      floors: project.floors.map((f) => ({
        ...f,
        furniture: f.furniture.map((item) =>
          item.id === "furn-select-1"
            ? { ...item, width: 600, depth: 600, rotation: 0 }
            : item,
        ),
      })),
    };

    const { result } = renderHook(() =>
      useWorkspaceCanvas({ initialProject: project }),
    );

    render(
      <FeasibilityCanvas
        variant="embedded"
        activeTool="select"
        delegateKeyboard
        workspaceCanvas={result.current}
      />,
    );

    const screen = projectToScreen(
      { x: 0, y: 0 },
      FEASIBILITY_INITIAL_TRANSFORM,
    );
    // screen = ((0 - (-4000)) * 0.1, (0 - (-2500)) * 0.1) = (400, 250)
    expect(screen.x).toBe(400);
    expect(screen.y).toBe(250);

    const canvas = screen.getByLabelText("Floor plan drawing surface");
    fireEvent.pointerDown(canvas, {
      pointerId: 91,
      button: 0,
      clientX: screen.x,
      clientY: screen.y,
    });
    fireEvent.pointerUp(canvas, {
      pointerId: 91,
      button: 0,
      clientX: screen.x,
      clientY: screen.y,
    });

    expect(result.current.selection).toEqual({
      type: "furniture",
      ids: ["furn-select-1"],
    });
  });

  it("select tool empty click clears selection to none", () => {
    let project = createOpen3dProject({ name: "SelectEmpty" });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: () => "furn-far",
    }));
    project = {
      ...project,
      floors: project.floors.map((f) => ({
        ...f,
        furniture: f.furniture.map((item) =>
          item.id === "furn-far"
            ? { ...item, width: 600, depth: 600 }
            : item,
        ),
      })),
    };

    const { result } = renderHook(() =>
      useWorkspaceCanvas({ initialProject: project }),
    );

    act(() => {
      result.current.setSelection({ type: "furniture", ids: ["furn-far"] });
    });

    render(
      <FeasibilityCanvas
        variant="embedded"
        activeTool="select"
        delegateKeyboard
        workspaceCanvas={result.current}
      />,
    );

    const canvas = screen.getByLabelText("Floor plan drawing surface");
    // Far from furniture in screen space
    fireEvent.pointerDown(canvas, {
      pointerId: 92,
      button: 0,
      clientX: 10,
      clientY: 10,
    });
    fireEvent.pointerUp(canvas, {
      pointerId: 92,
      button: 0,
      clientX: 10,
      clientY: 10,
    });

    expect(result.current.selection.type).toBe("none");
    expect(result.current.selection.ids).toEqual([]);
  });

  it("wall tool does not set furniture selection on furniture footprint", () => {
    let project = createOpen3dProject({ name: "WallTool" });
    ({ project } = addFurniture(project, "cabinet-v0", { x: 0, y: 0 }, {
      idFactory: () => "furn-walltool",
    }));
    project = {
      ...project,
      floors: project.floors.map((f) => ({
        ...f,
        furniture: f.furniture.map((item) =>
          item.id === "furn-walltool"
            ? { ...item, width: 600, depth: 600 }
            : item,
        ),
      })),
    };

    const { result } = renderHook(() =>
      useWorkspaceCanvas({ initialProject: project }),
    );

    render(
      <FeasibilityCanvas
        variant="embedded"
        activeTool="wall"
        delegateKeyboard
        workspaceCanvas={result.current}
      />,
    );

    const screenPt = projectToScreen(
      { x: 0, y: 0 },
      FEASIBILITY_INITIAL_TRANSFORM,
    );
    const canvas = screen.getByLabelText("Floor plan drawing surface");
    fireEvent.pointerDown(canvas, {
      pointerId: 93,
      button: 0,
      clientX: screenPt.x,
      clientY: screenPt.y,
    });
    fireEvent.pointerUp(canvas, {
      pointerId: 93,
      button: 0,
      clientX: screenPt.x,
      clientY: screenPt.y,
    });

    expect(result.current.selection.type).not.toBe("furniture");
  });
```

**Note:** If `addFurniture` idFactory is not honored exactly as written, adjust to match pureActions `uid(options?.idFactory)` contract (already used in applySelectionDelete tests).

- [ ] **Step 5.2: Run — expect FAIL if select path broken, PASS if live path works**

```powershell
Set-Location site
pnpm exec vitest run tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx --reporter=verbose
```

If RED due to coords: recompute with live `INITIAL_TRANSFORM`; ensure furniture not hidden by layer flags; ensure `workspaceCanvas` prop wiring.

**Mode B select pointer skeleton (only if missing):**

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
    setDrawingOutcome("none");
    releasePointer();
    return;
  }
  // openings → wall → room → none (existing order)
}
```

- [ ] **Step 5.3: Evidence + commit**

```powershell
pnpm exec vitest run tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\03-select-delete\05-canvas-select-vitest-raw.log
```

```bash
git add site/tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx
git commit -m "test(open3d): FeasibilityCanvas furniture select sets selection for W3"
```

---

### Task 06 — Esc clears selection (W3 grammar)

**Files:**
- Verify: `OOPlannerWorkspace.tsx` cancel handlers
- Test: keyboard already asserts `cancel` on Escape; add workspace-level selection clear test if needed
- Evidence: fold into `04-keyboard` or `06-esc-vitest-raw.log`

- [ ] **Step 6.1: Unit — cancel handler contract (pure)**

Add to keyboard suite **or** a small workspace cancel pure test:

```typescript
  it("Escape invokes cancel (workspace must clear selection in cancel impl)", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));
    press({ key: "Escape" });
    expect(handlers.cancel).toHaveBeenCalledTimes(1);
  });
```

Already present — keep green.

- [ ] **Step 6.2: Code audit — both cancel sites clear selection**

Locations in `OOPlannerWorkspace.tsx`:
1. `paletteHandlers.cancel`
2. `useWorkspaceKeyboard({ cancel: … })`

Both must include:

```typescript
workspaceCanvas.setSelection({ type: "none", ids: [] });
```

If missing → add (Mode B) and commit:

```bash
git commit -m "fix(open3d): Esc clears planner selection (W3 grammar)"
```

- [ ] **Step 6.3: Optional integration — renderHook workspace + keyboard cancel mock**

If engineer wants explicit selection assert without full OOPlannerWorkspace mount:

```typescript
it("simulates workspace cancel clearing selection", () => {
  const { result } = renderHook(() => useWorkspaceCanvas({ projectName: "Esc" }));
  act(() => {
    result.current.setSelection({ type: "furniture", ids: ["x"] });
  });
  // cancel body
  act(() => {
    result.current.setSelection({ type: "none", ids: [] });
  });
  expect(result.current.selection).toEqual({ type: "none", ids: [] });
});
```

This is weak alone — combine with code audit Step 6.2. Browser Esc is optional stretch (not CP-03 blocker if Del path proven).

---

### Task 07 — Unit evidence pack + p0:unit

**Files:** evidence only under `03-select-delete/`

- [ ] **Step 7.1: Full W3 unit pack (unfiltered)**

```powershell
Set-Location site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts `
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts `
  tests/unit/features/planner/open3d/workspaceDeleteSelection.wire.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\03-select-delete\vitest-w3-raw.log
```

Expected: exitCode **0**. Any fail → stop; CP-03 open.

- [ ] **Step 7.2: p0:unit non-regression**

```powershell
Set-Location site
pnpm run p0:unit 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\03-select-delete\p0-unit-raw.log
```

Write sibling:

```json
{
  "command": "pnpm run p0:unit",
  "exitCode": 0,
  "log": "p0-unit-raw.log"
}
```

as `p0-unit-run.json`.

- [ ] **Step 7.3: Honesty checkpoint**

Update NOTES:

```markdown
- Unit pack: PASS (vitest-w3-raw.log)
- p0:unit: PASS|FAIL
- CP-03 still OPEN until Task 08 browser green
```

**Do not** write `run.json` status PASS yet. **Do not** tick MASTER W3.

- [ ] **Step 7.4: Commit unit evidence**

```bash
git add results/planner/world-standard-wave/03-select-delete
git commit -m "test(open3d): W3 select/delete unit evidence pack"
```

---

### Task 08 — Minimal browser (CP-03 hard gate)

**Files:**
- Prefer existing: `site/tests/e2e/open3d-w3-select-delete.spec.ts`
- Optional harden: `site/tests/e2e/plannerCanvasHelpers.ts` (`getFurnitureCount`)
- Evidence: `browser-w3-raw.log` + PNGs under `03-select-delete/`

#### 8.0 Browser requirements (hard)

| Rule | Detail |
|------|--------|
| Folder | **Only** `results/planner/world-standard-wave/03-select-delete/` |
| Scope | place/seed → Select → Delete → Ctrl+Z |
| Engine | Feasibility; Fabric flag OFF |
| Tool | Playwright **or** chrome-devtools scripted |
| Serial | `test.describe.configure({ mode: "serial", timeout: 120_000 })` |
| Deltas | furniture after place > before; after delete < after place; after undo > after delete |
| Screenshots | select / deleted / undone (and optional placed) |
| Fail | unit green + browser red = **CP-03 FAIL** |

#### 8.1 Optional helper DRY

If consolidating duplicated `furnitureCount`:

```typescript
// plannerCanvasHelpers.ts
export async function getFurnitureCount(page: Page): Promise<number> {
  const text = await page
    .locator(".pw-status-bar, [class*='status']")
    .filter({ hasText: /\d+\s+furniture/i })
    .first()
    .textContent()
    .catch(() => null);
  const body = text ?? (await page.locator("body").innerText());
  const match = body.match(/(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : -1;
}
```

Use from W3 spec. Not required if local helper stays stable.

#### 8.2 Canonical browser spec (full source — land or keep)

Current live file is close; **harden** Select tool and evidence names:

```typescript
/**
 * W3 browser proof — select furniture → Delete → undo (open3d native chrome).
 * Evidence: results/planner/world-standard-wave/03-select-delete/
 */
import { expect, test } from "@playwright/test";
import path from "node:path";

import { enterGuestPlannerWorkspace } from "./guestProjectSetup";
import {
  clickOnCanvas,
  placeSeatsFromConfigurator,
  selectPlannerTool,
  waitForPlannerCanvas,
} from "./plannerCanvasHelpers";

test.describe.configure({ mode: "serial", timeout: 120_000 });

const EVIDENCE = path.join(
  process.cwd(),
  "..",
  "results",
  "planner",
  "world-standard-wave",
  "03-select-delete",
);

async function furnitureCount(page: import("@playwright/test").Page): Promise<number> {
  const text = await page
    .locator(".pw-status-bar, [class*='status']")
    .filter({ hasText: /\d+\s+furniture/i })
    .first()
    .textContent()
    .catch(() => null);
  const body = text ?? (await page.locator("body").innerText());
  const match = body.match(/(\d+)\s+furniture/i);
  return match ? Number.parseInt(match[1], 10) : -1;
}

test.describe("W3 select / delete / undo (browser)", () => {
  test("place furniture, select, Delete removes, Ctrl+Z restores", async ({ page }) => {
    // Prefer clean guest; Fabric flag must not be "1" in env for this process.
    await enterGuestPlannerWorkspace(page, { projectName: "W3 select-delete" });
    await waitForPlannerCanvas(page);

    const furnitureBefore = await furnitureCount(page);
    expect(furnitureBefore).toBeGreaterThanOrEqual(0);

    // Proven place path (systems v0 batch) — setup only; not a journey claim.
    await placeSeatsFromConfigurator(page, 4);

    await expect
      .poll(async () => furnitureCount(page), { timeout: 25_000 })
      .toBe(furnitureBefore + 4);

    const afterPlace = await furnitureCount(page);
    await page.screenshot({ path: path.join(EVIDENCE, "01-placed.png") });

    // CRITICAL: default tool is often wall — force Select
    await selectPlannerTool(page, "Select");
    // batch places near origin; center-ish plan
    await clickOnCanvas(page, 0.5, 0.5);

    // Properties: not empty selection
    await expect(
      page.getByRole("heading", { name: /No Selection/i }),
    ).toHaveCount(0, { timeout: 10_000 });
    await page.screenshot({ path: path.join(EVIDENCE, "02-selected.png") });

    await page.keyboard.press("Delete");
    await expect
      .poll(async () => furnitureCount(page), { timeout: 15_000 })
      .toBeLessThan(afterPlace);
    await page.screenshot({ path: path.join(EVIDENCE, "03-deleted.png") });

    const afterDelete = await furnitureCount(page);
    await page.keyboard.press("Control+z");
    await expect
      .poll(async () => furnitureCount(page), { timeout: 15_000 })
      .toBeGreaterThan(afterDelete);
    await page.screenshot({ path: path.join(EVIDENCE, "04-undone.png") });
  });
});
```

**False-green bans:**
- Do not use `__plannerFabricView` / `firstFurnitureCenter` Fabric helpers as W3 proof.
- Do not pass on absolute furniture ≥1 without place delta.
- Do not claim full journey.

- [ ] **Step 8.3: Ensure evidence directory exists before Playwright**

```powershell
New-Item -ItemType Directory -Force -Path results\planner\world-standard-wave\03-select-delete | Out-Null
```

- [ ] **Step 8.4: Run Playwright W3 only**

Preferred package entry if available:

```powershell
Set-Location site
# Ensure FABRIC flag not set
Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -ErrorAction SilentlyContinue

pnpm exec playwright test -c config/build/playwright.config.ts `
  tests/e2e/open3d-w3-select-delete.spec.ts `
  --reporter=list 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\03-select-delete\browser-w3-raw.log
```

Alternate via world pack (heavier):

```powershell
pnpm run test:e2e:open3d-world
# still copy/extract W3 artifacts into 03-select-delete/ — do not leave only gate-e2e root
```

Expected:
- exitCode 0
- PNGs present: `01-placed.png`, `02-selected.png`, `03-deleted.png`, `04-undone.png`
- Log unfiltered

If red: systematic-debugging — wrong tool, hit miss, place failed, status bar parse, storage pollution. Fix and re-run. **Keep red artifacts.**

- [ ] **Step 8.5: chrome-devtools alternate (if Playwright blocked)**

Script the same buyer path via MCP chrome-devtools:
1. Navigate guest planner with `plannerDevTools=1`
2. Place 4 seats
3. Click Select on Drawing tools
4. Click canvas center
5. Press Delete
6. Press Ctrl+Z
7. Screenshot each state into evidence folder
8. Write `browser-w3-raw.log` with steps + timestamps + tool=chrome-devtools

Same pass/fail bar.

- [ ] **Step 8.6: Commit browser pack**

```bash
git add site/tests/e2e/open3d-w3-select-delete.spec.ts results/planner/world-standard-wave/03-select-delete
git commit -m "test(open3d): W3 select/delete browser + evidence pack CP-03"
```

---

### Task 09 — CP-03 sign-off

- [ ] **Step 9.1: Canonical `run.json`**

```json
{
  "phase": "P03",
  "gate": "W3",
  "checkpoint": "CP-03",
  "approach": "A",
  "checkout": "D:\\OandO07072026",
  "worktrees": false,
  "evidenceRoot": "results/planner/world-standard-wave/03-select-delete",
  "HEAD": "<from HEAD.txt>",
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
  "fabricFurnitureFlag": "OFF",
  "startedAt": "<ISO>",
  "endedAt": "<ISO>",
  "status": "PASS"
}
```

`status` may be `"FAIL"` with honest `blockersOpen` array — never paper PASS.

- [ ] **Step 9.2: `W3-ACCEPTANCE.md`**

```markdown
# W3 / CP-03 Acceptance

| # | Criterion | Result | Proof |
|---|-----------|--------|-------|
| CP-03.1 | pickFurniture hit/miss/top-most/rotation (+ empty/default) | PASS/FAIL | 01-*.log |
| CP-03.2 | Select tool sets furniture selection (unit) | PASS/FAIL | 05-*.log |
| CP-03.3 | Delete removes selected furniture | PASS/FAIL | 02/03 logs |
| CP-03.4 | Delete+Backspace + preventDefault | PASS/FAIL | 04-*.log |
| CP-03.5 | Undo same id + pose | PASS/FAIL | 02-delete-undo log |
| CP-03.6 | Unit pack exit 0 | PASS/FAIL | vitest-w3-raw.log |
| CP-03.7 | p0:unit non-regression | PASS/FAIL | p0-unit-run.json |
| CP-03.8 | Browser select→delete→undo | PASS/FAIL | browser-w3-raw.log + PNGs |
| CP-03.9 | run.json PASS + honest NOTES | PASS/FAIL | run.json |
| CP-03.10 | Commits on main checkout | PASS/FAIL | git log |
| CP-03.11 | No false journey/multi-select claim | PASS/FAIL | NOTES |

Overall: PASS only if 03.6–03.9 green.
```

- [ ] **Step 9.3: `FILES-TOUCHED.md`**

List every production + test path actually changed this execute.

- [ ] **Step 9.4: Final NOTES honesty**

Must include:
- Fabric flag OFF
- Evidence re-proved on this HEAD (not appendix memory)
- Explicit non-claims: multi-select not done; 3D pick not done; journey not claimed
- Default tool note: Select was activated for proof

- [ ] **Step 9.5: Tick gates only when green**

Only if CP-03.6–03.9 PASS: update program INDEX/MASTER/CHECKPOINTS per owner process.  
If evidence missing or browser red: **leave red**.

- [ ] **Step 9.6: Final commit**

```bash
git add results/planner/world-standard-wave/03-select-delete
git commit -m "docs(planner): CP-03 W3 select/delete evidence sign-off"
```

---

## 7. Test matrix

| Concern | Unit file(s) | Browser | Command | Expected |
|---------|--------------|---------|---------|----------|
| Hit math | `canvasPicking.test.ts` | secondary | vitest path | PASS cases |
| Pure delete same ref | `applySelectionDelete.test.ts` | — | vitest | `toBe(project)` |
| Locked skip | same | — | vitest | same ref |
| Multi-id one past | same + wire test | optional | vitest | past.length===1 |
| Pose undo | applySelectionDelete + history | count restore | vitest / Playwright | id+pose / count |
| preventDefault | keyboard test | spot | vitest | defaultPrevented |
| Editable skip | keyboard test | — | vitest | no call |
| Canvas select | feasibility canvas test | **primary buyer** | vitest + Playwright | selection type furniture |
| Esc clear | keyboard cancel + code audit | optional | vitest + review | selection none |
| Fabric OFF | NOTES | NOTES + env | manual | not `"1"` |
| Full place→select→delete→undo | optional setup | **primary** | Playwright W3 | exit 0 + PNGs |

### 7.1 Exact unit pack command (copy-paste)

```powershell
Set-Location site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts `
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts `
  tests/unit/features/planner/open3d/workspaceDeleteSelection.wire.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx `
  --reporter=verbose
```

### 7.2 Exact browser command (copy-paste)

```powershell
Set-Location site
Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -ErrorAction SilentlyContinue
pnpm exec playwright test -c config/build/playwright.config.ts `
  tests/e2e/open3d-w3-select-delete.spec.ts --reporter=list
```

Manifest contract: `site/config/build/playwright-open3d-world-specs.json` maps `gates.W3` → `open3d-w3-select-delete.spec.ts`.

---

## 8. False-green catalog

| Risk | Why it lies | Hard assert in this plan |
|------|-------------|--------------------------|
| Unit-only W3 | Handlers/vitest green | Task 08 + CP-03.8 |
| Journey claims W3 | Draw/place ≠ delete/undo | Separate folder; non-claim NOTES |
| Fabric select e2e | Wrong engine | Flag OFF; no Fabric helpers |
| Absolute furniture ≥1 | Residual project | place delta |
| Multi-history OK for one | Breaks multi-id | pure multi-id + wire |
| preventDefault missing | Backspace navigates | defaultPrevented unit |
| Esc only place cancel | Sticky selection | cancel clears selection |
| Undo new UUID | Identity break | pose+id unit |
| Filtered logs | Paper PASS | Tee full raw |
| Wrong evidence folder | Map break | only `03-select-delete/` |
| Missing `results/` | Claim without deposit | Task 00/09 re-prove |
| Default tool wall | Click draws wall | selectPlannerTool("Select") |
| Count-only undo | Wrong furniture restored | unit id+pose |
| Properties delete only | Keyboard path unproven | keyboard unit + browser Delete key |
| Appendix PASS memory | Stale | disk artifacts required |

---

## 9. Stop-if-fail / CP criteria

### 9.1 Checkpoint CP-03 table

| # | Criterion | Proof artifact |
|---|-----------|----------------|
| CP-03.1 | pickFurniture covered | `01-pick-furniture-vitest-raw.log` |
| CP-03.2 | Select tool furniture selection unit | `05-canvas-select-vitest-raw.log` |
| CP-03.3 | Delete removes furniture | `02` / `03` logs |
| CP-03.4 | Del+Bksp preventDefault | `04-keyboard-delete-vitest-raw.log` |
| CP-03.5 | Undo same id + pose | `02-delete-undo-vitest-raw.log` |
| CP-03.6 | Unit pack exit 0 | `vitest-w3-raw.log` |
| CP-03.7 | p0:unit | `p0-unit-run.json` |
| CP-03.8 | Browser select→delete→undo | `browser-w3-raw.log` + PNGs |
| CP-03.9 | run.json PASS + NOTES | `run.json` |
| CP-03.10 | Commits main checkout | NOTES / git log |
| CP-03.11 | No false journey/multi-select | NOTES |

**Stop if red.** Do not mark INDEX/MASTER W3 without CP-03.6–03.9.

### 9.2 Kill order context

```
CP-00 → CP-01 → CP-02 → W3 (unit+browser, 03-select-delete/) → W1–W2 journey → W5–W6 …
```

Do not celebrate full journey without W3 artifacts.

---

## 10. Commit sequence

Suggested land order (skip empty commits if nothing changed):

1. `docs(planner): P03 baseline evidence dir for W3 select/delete`
2. `test(open3d): cover pickFurnitureAtPoint empty and default 600mm for W3`
3. `fix(open3d): correct furniture pick hit-test for select tool` *(only if needed)*
4. `test(open3d): harden applySelectionDelete locked identity and pose undo for W3`
5. `feat(open3d): pure applySelectionDelete with undo-safe history` *(only if missing)*
6. `test(open3d): wire-level single-history deleteSelection for W3`
7. `fix(open3d): single-history deleteSelection for furniture W3` *(only if loop reintroduced)*
8. `test(open3d): keyboard delete edges preventDefault and editable skip for W3`
9. `test(open3d): FeasibilityCanvas furniture select sets selection for W3`
10. `fix(open3d): Esc clears planner selection (W3 grammar)` *(only if needed)*
11. `test(open3d): W3 select/delete unit evidence pack`
12. `test(open3d): W3 select/delete browser + evidence pack CP-03`
13. `docs(planner): CP-03 W3 select/delete evidence sign-off`

---

## 11. Risks & owner decisions

| Risk | Severity | Mitigation |
|------|----------|------------|
| Evidence tree wiped again | High | Re-run Task 07–09; never claim from memory |
| Browser flaky place path | Medium | Keep `placeSeatsFromConfigurator`; serial mode |
| Select miss on canvas center | Medium | Adjust click coords; unit coords strategy |
| Default tool wall confuses demos | Medium | Force Select; P09 coach later |
| Dual selection store temptation | High | Refuse; CanvasSelection only |
| Fabric flag accidentally ON in CI | High | NOTES + env unset in Task 08 |
| Expanding into multi-select mid-W3 | Medium | YAGNI; pure multi-id only |
| Push without owner ask | Process | Commit local; push per AGENTS standing rules when green slice |

**Owner decisions already locked (do not re-ask):**
- Approach A
- Furniture-only product bar
- Browser hard gate
- Flag OFF for proof

**No open product TBD for CP-03.** Residual post-bar items are explicit non-goals.

---

## 12. Self-review vs brainstormer + repo

| Check | Result |
|-------|--------|
| Repo coverage: pick, delete pure, keyboard, workspace, canvas, history, fabric flag, e2e, manifest | Mapped in §§1,4,6 |
| Brainstormer bars: single history, preventDefault, Esc, Fabric OFF, browser hard gate, furniture bar, same id | Tasks 02–08 + false-green §8 |
| Evidence honesty | Task 00/09; appendix PASS treated stale |
| Live API vs appendix return shape | Documented; repo wins |
| Placeholder scan | No TBD steps; full code in tasks |
| Type consistency | `CanvasSelection`, `Open3dProject`, degrees rotation |
| Length honesty | Extensive by design (skill: no cap); Mode A default to avoid rewrite thrash |
| Idiots/ unused | Only Idiots2 REPORT |

---

## 13. Appendices

### A. Type / signature catalog (W3-relevant)

```typescript
// useWorkspaceCanvas.ts
export interface CanvasSelection {
  type: "wall" | "door" | "window" | "furniture" | "room" | "none";
  ids: string[];
}

// canvasPicking.ts
export function pickFurnitureAtPoint(
  point: Open3dPoint,
  furniture: readonly Open3dFurnitureItem[],
  paddingMm?: number,
): string | null;

// workspaceEntityHelpers.ts
export function applySelectionDelete(
  project: Open3dProject,
  selection: CanvasSelection,
): Open3dProject;

export function deleteEntityFromProject(
  project: Open3dProject,
  collection: Open3dEntityCollection,
  id: string,
): Open3dProject;

// history.ts
export function createOpen3dHistory(project: Open3dProject): Open3dHistoryState;
export function updateOpen3dProject(
  history: Open3dHistoryState,
  updater: (project: Open3dProject) => Open3dProject,
  now?: string,
): Open3dHistoryState;
export function undoOpen3dAction(history: Open3dHistoryState): Open3dHistoryState;

// useWorkspaceKeyboard.ts
export interface WorkspaceKeyboardHandlers {
  setTool: (tool: PlannerTool) => void;
  toggleView: () => void;
  openPalette: () => void;
  undo: () => void;
  redo: () => void;
  cancel: () => void;
  commit?: () => void;
  beginTemporaryPan?: () => void;
  endTemporaryPan?: () => void;
  deleteSelection?: () => void;
  enabled?: boolean;
}

// fabricFurnitureFlag.ts
export function isOpen3dFabricFurnitureEnabled(
  env?: NodeJS.ProcessEnv | Record<string, string | undefined>,
): boolean; // true only when env var === "1"

// Open3dFurnitureItem (types.ts) — rotation: number (degrees)
```

### B. Selector / tool table (browser)

| Action | Selector / API |
|--------|----------------|
| Guest entry | `enterGuestPlannerWorkspace` |
| Canvas ready | `waitForPlannerCanvas` → `[data-testid="planner-2d-canvas"] canvas` |
| Select tool | `selectPlannerTool(page, "Select")` or role button /Select/i |
| Place setup | `placeSeatsFromConfigurator(page, 4)` |
| Click plan | `clickOnCanvas(page, 0.5, 0.5)` |
| Delete | `page.keyboard.press("Delete")` |
| Undo | `page.keyboard.press("Control+z")` |
| Empty props | heading `/No Selection/i` count 0 when selected |
| Furniture metric | status text `/(\d+)\s+furniture/i` |

### C. Research → O&O translation (ideas only)

| Industry idea | O&O implementation |
|---------------|-------------------|
| Floorplanner Del/Bksp | `useWorkspaceKeyboard` |
| Floorplanner Esc deselect | cancel + clear selection |
| Floorplanner furniture priority | pick order furniture first |
| RS select→props→trash | selection drives PropertiesPanel; trash optional |
| P5D selected object delete | keyboard primary for CP-03 |
| Ease recovery undo | open3d history |
| SYNTHESIS select+transform | W3 select/delete now; transform post-W3 |

### D. Coord cheat sheet

```
INITIAL_TRANSFORM.origin = (-4000, -2500)
INITIAL_TRANSFORM.scale  = 0.1

projectToScreen(p):
  x = (p.x - origin.x) * scale
  y = (p.y - origin.y) * scale

Example: furniture at (0,0)
  screen = (400, 250)

Pick padding at scale 0.1:
  Math.max(20, 40/0.1) = Math.max(20, 400) = 400 mm
```

### E. Evidence layout (canonical)

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

### F. Manifest / package hooks

| Hook | Value |
|------|-------|
| Manifest | `site/config/build/playwright-open3d-world-specs.json` |
| Gate W3 | `open3d-w3-select-delete.spec.ts` |
| npm | `test:e2e:open3d-world`, `gate:open3d` |
| Runner | `site/scripts/run-open3d-world-e2e.mjs` |
| Contract test | `playwrightOpen3dWorldSpecs.test.ts` |

### G. Properties panel note

`handleDeleteEntity` remains single-id `deleteEntityFromProject` + clear selection. Keyboard uses `applySelectionDelete`. Both valid for P03.

### H. Handover one-liner

> W3 = Feasibility select + Del/Bksp (preventDefault) + single-history `applySelectionDelete` + undo same id/pose; unit pack **then** minimal browser under `03-select-delete/`; Fabric flag OFF; evidence re-proved on disk (not appendix memory).

### I. Next phase

After CP-03 green: P04 orbit continuity (selection continuity adjacent) or kill-order journey P07 without pretending journey replaces W3.

---

## 14. Execution handoff

**Plan complete and saved to `plans1/P03-select-delete/IMPLEMENTATION-PLAN.md`.**

**Two execution options:**

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

Execute **Mode A (close gaps + re-prove)** by default: do not rewrite green pure helpers; close missing unit cases (canvas select, locked/pose, keyboard edges); re-deposit unit + browser evidence; sign off only when `run.json` status is honest PASS.

**Which approach?**
