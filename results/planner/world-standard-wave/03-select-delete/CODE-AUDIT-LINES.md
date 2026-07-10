# CODE-AUDIT-LINES — open3d W3 select → delete → undo

**Seat:** Code audit (product lines only)  
**Scope:** Actual open3d product source under `site/features/planner/open3d/`  
**Date:** 2026-07-10  
**Rule:** Line-level product audit. Not plan ratings, not coverage %, not evidence JSON theater.

---

## 1. `site/features/planner/open3d/editor/workspaceEntityHelpers.ts`

### What the code actually does

| Symbol | Lines | Behavior |
|--------|-------|----------|
| `COLLECTION_BY_SELECTION` | 17–23 | Maps selection type → floor collection (`wall`→`walls`, `door`→`doors`, `window`→`windows`, `furniture`→`furniture`, `room`→`rooms`). |
| `deleteEntityFromProject` | 81–106 | Single-id delete on active floor; **locked** target returns same project; wall delete also filters doors/windows whose `wallId` matches. |
| `applySelectionDelete` | 112–164 | Multi-id delete in **one** project revision. Empty/`none` → same ref. Unknown type → same ref. Filters locked out of removal. If no membership change → **same project reference**. Wall removals cascade doors/windows via `removedWallSet`. |

Key contract (same-ref no-op):

```112:140:site/features/planner/open3d/editor/workspaceEntityHelpers.ts
export function applySelectionDelete(
  project: Open3dProject,
  selection: CanvasSelection,
): Open3dProject {
  if (selection.type === "none" || selection.ids.length === 0) {
    return project;
  }
  // ...
  if (nextItems.length === items.length) {
    return project;
  }
```

Wall cascade (multi):

```142:159:site/features/planner/open3d/editor/workspaceEntityHelpers.ts
  // Walls removed: also drop doors/windows on those walls (same as pureActions.removeWall).
  const removedWallIds =
    collection === "walls"
      ? items
          .filter((item) => idSet.has(item.id) && !item.locked)
          .map((item) => item.id)
      : [];
  // ... doors/windows filtered by removedWallSet
```

### Bugs / risks (real)

1. **Room delete is shallow** (151–153): removing a `room` only drops the room entity; walls/doors/windows stay. Correct for “zone label” model, wrong if buyer expects “delete room = erase shell.”
2. **Locked-only selection**: returns same `project` (139–140) — correct for history — but caller still clears selection (see workspace). Buyer thinks Delete did something when nothing was deleted.
3. **No orphan cleanup for furniture/room** beyond wall→opening cascade. Fine for furniture.

### any / skip / dead code

- No `any`. Uses structural casts (`as Array<{ id: string; locked?: boolean }>`, collection casts) — not `any`.
- No dead code in delete path. `deleteEntityFromProject` still used by Properties panel single delete (workspace 317–325).

### Honest “works?” (select→delete→undo)

**YES for furniture / wall / door / window / room entity rows** when wired through `updateOpen3dProject` same-ref gate. One history step for multi-id. Locked members stay.

---

## 2. `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`

### What the code actually does

| Concern | Lines | Behavior |
|---------|-------|----------|
| **Default tool** | 185, 202 | `useState<PlannerTool>("wall")`; `armedToolRef` starts `"wall"`. Not select. |
| `deleteSelection` | 327–335 | If selection empty/`none` return; else `updateProject(applySelectionDelete)`; **always** `setSelection({ type: "none", ids: [] })`. |
| Esc / cancel (keyboard) | 775–779 | Clears pending catalog, `canvasRef.cancel()`, clears selection. |
| Esc / cancel (palette) | 752–756 | Same clear path. |
| Properties deselect | 897–898 | Clears selection only. |
| Keyboard wiring | 768–793 | Passes `deleteSelection`, undo/redo, cancel, temporary pan restore from `armedToolRef`. |
| Post-place select | 442–449, 481+, 585+ | After place, often arms `"select"` and selects placed id(s). |
| Fabric default | 234–243 | `isOpen3dFabricFurnitureEnabled()`; when on, hides furniture paint on FeasibilityCanvas. |

```185:185:site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
  const [activeTool, setActiveTool] = useState<PlannerTool>("wall");
```

```327:335:site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
  const deleteSelection = useCallback(() => {
    const { selection } = workspaceCanvas;
    if (selection.type === "none" || selection.ids.length === 0) return;
    workspaceCanvas.updateProject((project) =>
      applySelectionDelete(project, selection),
    );
    workspaceCanvas.setSelection({ type: "none", ids: [] });
  }, [workspaceCanvas]);
```

```775:779:site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
    cancel: () => {
      setPendingCatalogItemId(null);
      canvasRef.current?.cancel();
      workspaceCanvas.setSelection({ type: "none", ids: [] });
    },
```

### Bugs / risks (real)

1. **Default tool is wall (185)** — buyer lands in draw-wall, not select. W3 select path requires tool rail click or **V**. Product friction, not a broken delete once select is active.
2. **Selection cleared even on no-op delete (334)** — locked-only or missing ids: history unchanged, selection wiped.
3. **Undo does not restore selection (350–353)** — `runUndo` undoes document + canvas cancel; selection stays whatever it was (usually empty after delete). CAD-typical; buyer may think undo failed until they re-look at canvas.
4. **Fabric ON path (971–1002)**: overlay interactive when `activeTool === "select"`, but fabric layer does **not** call `setSelection`. Clicks on furniture can be eaten by Fabric without updating workspace selection → **Del may no-op**. Mitigated by flag default OFF (`=== "1"` only).

### any / skip / dead code

- No `any` in the delete/selection wiring reviewed.
- Duplicate cancel handlers (palette + keyboard) — intentional parallel, not dead.

### Honest “works?”

**YES on production default (fabric off):** Del/Bksp → `deleteSelection` → `applySelectionDelete` → history; Ctrl/Cmd+Z → undo.  
**Requires select tool (or post-place auto-select)** first for click-to-select.

---

## 3. `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`

### What the code actually does

| Lines | Behavior |
|-------|----------|
| 14–23 | `isEditableTarget`: INPUT / TEXTAREA / SELECT / contentEditable → **all shortcuts skipped**. |
| 46–50 | Early return if editable; `key = event.key.toLowerCase()`; `mod = ctrl \|\| meta`. |
| 52–57 | Space (no mod, no repeat): preventDefault, temporary pan begin. |
| 71–75 | Escape → `cancel()`. |
| 83–87 | **Delete or Backspace, no mod** → preventDefault → `deleteSelection?.()`. |
| 89–105 | mod+shift+Z / mod+Y redo; mod+Z undo. |
| 107–114 | Unmod letter tools from `CANVAS_TOOL_SHORTCUTS` (select = **V**). |
| 117–122 | Space up ends temporary pan. |
| 124–129 | Window-level keydown/keyup listeners. |

```83:87:site/features/planner/open3d/editor/useWorkspaceKeyboard.ts
      if ((event.key === "Delete" || event.key === "Backspace") && !mod) {
        event.preventDefault();
        handlers.deleteSelection?.();
        return;
      }
```

### Bugs / risks (real)

1. **Optional `deleteSelection?`** — if a caller omits it, Del is swallowed (preventDefault) with no action. Workspace **does** pass it (774). Safe on product path.
2. **Backspace always preventDefault** when not in editable — correct for CAD; wrong if focus is on a non-INPUT focusable that still expects Bksp (rare).
3. **`handlers` object in effect deps (130)** — rebinds listeners when parent recreates object each render. Functional OK; noisy re-subscribe.

### any / skip / dead code

- No `any`. No skips. `toolFromShortcutKey` export is live utility.

### Honest “works?”

**YES** for Del/Bksp → deleteSelection, Esc → cancel, mod+Z undo, when `enabled` (default true) and not typing in a field.

---

## 4. `site/features/planner/open3d/lib/geometry/canvasPicking.ts` — `pickFurnitureAtPoint`

### What the code actually does

```145:164:site/features/planner/open3d/lib/geometry/canvasPicking.ts
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
    const rad = (-(item.rotation || 0) * Math.PI) / 180;
    const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
    const localY = dx * Math.sin(rad) + dy * Math.cos(rad);
    if (Math.abs(localX) <= halfW && Math.abs(localY) <= halfD) {
      return item.id;
    }
  }
  return null;
}
```

- Walks **top-most first** (last array index).
- OBB via inverse rotation into local AABB.
- Defaults missing width/depth to **600 mm**.
- Optional padding expands hit box.

### Bugs / risks (real)

1. Defaults 600×600 can over-hit items with missing dims (data issue).
2. No Z/layer; pure 2D footprint — correct for plan view.
3. Rotation convention matches paint (`rotate(+deg)` in canvas vs inverse here) — consistent.

### any / skip / dead code

- None.

### Honest “works?”

**YES** for rotated/overlapping furniture pick on plan. Wired by FeasibilityCanvas select path with padding `Math.max(20, 40 / transform.scale)`.

---

## 5. `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`

### What the code actually does

**Selection sets for paint (198–215):**

- `selectedWallIds` when `selection.type === "wall"`
- `selectedRoomIds` when `type === "room"`
- `selectedFurnitureIds` when `type === "furniture"`
- **No** door/window selected-id sets

**Selection paint:**

| Entity | Lines | Visual |
|--------|-------|--------|
| Room | 531 | fill alpha 0.32 selected vs 0.18 |
| Wall | 550–553 | primary stroke, width 7 vs 5 |
| Door | 560–574 | always accent arc — **no selected state** |
| Window | 577–588 | always primary rect — **no selected state** |
| Furniture | 601, 640–652 | primary dashed `strokeRect` “ring” (+12 mm pad) |

Furniture selection ring:

```640:652:site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx
          if (isSelected) {
            context.strokeStyle =
              tokens.getPropertyValue("--color-primary").trim() || "#2563eb";
            context.lineWidth = Math.max(2 / transform.scale, 1.5);
            context.setLineDash([8, 4]);
            context.strokeRect(
              -block.footprint.L / 2 - 12,
              -block.footprint.D / 2 - 12,
              block.footprint.L + 24,
              block.footprint.D + 24,
            );
            context.setLineDash([]);
          }
```

**Select tool pointer path (766–808):**

```766:808:site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx
    if (event.button === 0 && activeTool === "select" && workspaceCanvas) {
      const raw = screenToProject(canvasPoint(event), transform);
      const pickToleranceMm = Math.max(80, 180 / transform.scale);
      // Furniture → openings → walls → rooms (product select bar).
      const furnitureId = pickFurnitureAtPoint(
        raw,
        activeFloor.furniture,
        Math.max(20, 40 / transform.scale),
      );
      if (furnitureId) {
        workspaceCanvas.setSelection({ type: "furniture", ids: [furnitureId] });
        // ...
      }
      const opening = pickOpeningAtPoint(...);
      // door | window selection
      const wallId = pickWallAtPoint(...);
      const room = activeFloor.rooms.find(... pointInPolygon ...);
      workspaceCanvas.setSelection(
        wallId ? { type: "wall", ids: [wallId] }
          : room ? { type: "room", ids: [room.id] }
          : { type: "none", ids: [] },
      );
```

Priority: **furniture → openings → walls → rooms → clear**. Empty click clears. Single-id only (no shift multi).

`toolToCommandId` (89–107): `"select"` maps to `null` (not wall command) — correct.

`delegateKeyboard` (444): when true (workspace always passes it), canvas-local keyboard exits early; Space still tracked for pan (443). Delete owned by workspace keyboard.

### Bugs / risks (real)

1. **Door/window selectable but no selection paint** — buyer gets status/properties only; ring path is furniture-only. Real W3 UX hole for openings.
2. **Wall beats room** when both under cursor — intentional priority; room pick only if no wall in tolerance.
3. **No multi-select** despite wall tool guidance text claiming “Shift+click multi” in `canvasTool.ts` (outside this file) — select path never reads `shiftKey`.
4. When fabric flag ON, host sets `furniture: false` on this canvas — ring paint for furniture never runs; overlay may not set document selection (see §2).

### any / skip / dead code

- No `any`. Opening paint has no selection branch (gap, not dead code).

### Honest “works?”

**YES for furniture select + ring + delete chain** when `activeTool === "select"` and fabric off.  
**Partial for doors/windows** (select works, visual weak).  
**Walls/rooms** select + visual OK; delete works at helper level.

---

## 6. `site/features/planner/open3d/store/history.ts` — `updateOpen3dProject`

### What the code actually does

```82:99:site/features/planner/open3d/store/history.ts
export function updateOpen3dProject(
  history: Open3dHistoryState,
  updater: (project: Open3dProject) => Open3dProject,
  now?: string,
): Open3dHistoryState {
  const updated = updater(history.present);
  if (updated === history.present) return history;
  const stamped =
    updated.updatedAt === history.present.updatedAt
      ? { ...updated, updatedAt: now ?? new Date().toISOString() }
      : updated;
  return {
    past: [...history.past, history.present],
    present: stamped,
    future: [],
    dragStart: null,
  };
}
```

- **Same-ref no-op (88):** empty/locked delete does not push history.
- Mutation pushes `present` onto `past`, clears `future`.
- Stamps `updatedAt` if updater left clock unchanged.
- Wired via `document.update` command (`plannerCommand.ts` 61–63) → `useWorkspaceCanvas.updateProject` (139–144).

`undoOpen3dAction` / `redoOpen3dAction` (50–69): stack pop/push; no selection restore (selection is outside history — correct per `useWorkspaceCanvas` 87–90).

### Bugs / risks (real)

1. Reference equality only — deep-equal same content with new object **would** push a history step. Callers that always spread can bloat history. `applySelectionDelete` correctly returns same ref on no-op.
2. Unbounded `past` growth — product scale risk, not W3 select-delete break.

### any / skip / dead code

- None.

### Honest “works?”

**YES.** Delete → new project ref → history step; locked/empty delete → no step; undo restores prior project including deleted furniture.

---

## 7. `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts`

### What the code actually does

```14:18:site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts
export function isOpen3dFabricFurnitureEnabled(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): boolean {
  return env[OPEN3D_FABRIC_FURNITURE_ENV] === "1";
}
```

- Env key: `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE`.
- **Exactly `"1"`** — not truthy, not `"true"`, not `"yes"`.
- Default OFF → production UI uses FeasibilityCanvas furniture paint + pick.

### Bugs / risks (real)

1. When forced ON without selection bridge to `workspaceCanvas.setSelection`, **W3 delete-by-keyboard after fabric click is incomplete** (see §2 / §5). Not default path.
2. Exact `"1"` is correct hardening.

### any / skip / dead code

- None.

### Honest “works?”

**N/A as primary W3 path** (flag off). Flag itself is correct. Fabric interactive path is **not** a complete select→delete substitute.

---

## Product usable for W3?

### **YES** (with known friction)

Reasons from lines:

1. Select tool pointer path sets furniture selection (`FeasibilityCanvas.tsx:766–776`).
2. Furniture ring paints (`FeasibilityCanvas.tsx:640–652`).
3. Del/Bksp → `deleteSelection` (`useWorkspaceKeyboard.ts:83–87` + `OOPlannerWorkspace.tsx:327–335`).
4. `applySelectionDelete` mutates floor in one revision; same-ref no-op when nothing removed (`workspaceEntityHelpers.ts:112–140`).
5. `updateOpen3dProject` records only real mutations (`history.ts:87–88`); undo restores prior project (`history.ts:50–58`).
6. Fabric dual-path off by exact `"1"` (`fabricFurnitureFlag.ts:17`).

**Not automatic on first paint:** default tool is **wall** (`OOPlannerWorkspace.tsx:185`). Buyer must arm select (V / rail) unless they just placed (auto-select).

---

## Top 5 line-level findings

| # | Path:line | Finding |
|---|-----------|---------|
| 1 | `OOPlannerWorkspace.tsx:185` | Default tool is `"wall"`, not `"select"` — W3 click-select requires explicit tool switch. |
| 2 | `FeasibilityCanvas.tsx:766–808` | Real select stack: furniture → opening → wall → room → clear; single-id only; wired to `setSelection`. |
| 3 | `workspaceEntityHelpers.ts:112–140` + `history.ts:87–88` | Delete is one history step; same-ref no-op prevents ghost undo entries for empty/locked deletes. |
| 4 | `FeasibilityCanvas.tsx:560–588` vs `640–652` | Furniture has selection ring; doors/windows paint has **no** selected state despite being pickable (`788–790`). |
| 5 | `OOPlannerWorkspace.tsx:334` + fabric `971–1002` | Selection always cleared after Del even if no-op; fabric ON can steal furniture clicks without setting workspace selection (flag default off at `fabricFurnitureFlag.ts:17`). |

---

## Verdict

### **SHIP-READY** (core buyer path)

Not theater: select, paint (furniture/wall/room), delete, history, undo are real product lines with correct same-ref history coupling.

**Not “perfect product”:** default wall tool, opening selection without ring, locked delete still deselects, fabric-on selection gap. Those are **NEEDS-FIX** polish items if W3 claims “zero-friction select-delete on cold open” or “fabric furniture stage.”

**For stated W3 bar (select → delete → undo works in product code):** **SHIP-READY**.

---

## Path map (absolute)

| File |
|------|
| `D:\OandO07072026\site\features\planner\open3d\editor\workspaceEntityHelpers.ts` |
| `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx` |
| `D:\OandO07072026\site\features\planner\open3d\editor\useWorkspaceKeyboard.ts` |
| `D:\OandO07072026\site\features\planner\open3d\lib\geometry\canvasPicking.ts` |
| `D:\OandO07072026\site\features\planner\open3d\canvas-feasibility\FeasibilityCanvas.tsx` |
| `D:\OandO07072026\site\features\planner\open3d\store\history.ts` |
| `D:\OandO07072026\site\features\planner\open3d\canvas-fabric-stage\fabricFurnitureFlag.ts` |

**Report:** `D:\OandO07072026\results\planner\world-standard-wave\03-select-delete\CODE-AUDIT-LINES.md`

**Product edits:** none (no one-line critical bug requiring fix; report only).
