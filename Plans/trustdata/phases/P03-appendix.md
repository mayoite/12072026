# P03 Appendix — skeletons & detail

## Structure rewrite 2026-07-09

Companion to **[P03-select-delete.md](./P03-select-delete.md)** (execute card). Holds pure-API design, test case lists, run.json shape, inventory detail, expert archive. **Not a second CP.** CP-03 still fails without browser under `03-select-delete/`.

---

## Pure design: `applySelectionDelete`

```ts
// workspaceEntityHelpers.ts (or editor/applySelectionDelete.ts if file grows)
export function applySelectionDelete(
  project: Open3dProject,
  selection: CanvasSelection,
): { project: Open3dProject; selection: CanvasSelection }
```

**Rules:**

1. `selection.type === "none"` or empty ids → **same project reference** + empty selection.
2. Map types: `wall→walls`, `door→doors`, `window→windows`, `furniture→furniture`, `room→rooms`.
3. Remove **all** listed ids from active floor in **one** project clone (single history entry when wired through one `updateProject`).
4. Skip locked entities (same as `deleteEntityFromProject`); if all locked/missing, project may be unchanged.
5. **History identity (hard):** if no entity membership changed, return **identical** `project` reference (`updateOpen3dProject` only pushes past when `updated !== history.present`).
6. Always return `selection: { type: "none", ids: [] }` after attempt path.
7. **No `any`.**

**Workspace wire:**

1. Read `workspaceCanvas.selection`.
2. `const next = applySelectionDelete(project, selection)`.
3. If `next.project !== project`, `updateProject(() => next.project)` **once**.
4. `setSelection(next.selection)`.

Properties panel single-id `deleteEntityFromProject` OK for P03. Undo relies on existing history — do not push selection into history.

---

## Task 01 pick cases

1. Hit center of axis-aligned item → returns id.  
2. Miss outside footprint (beyond padding) → `null`.  
3. Padding expands hit box.  
4. **Top-most wins:** two overlapping; last array entry.  
5. **Rotation 90°:** point in rotated footprint hits.  
6. Empty furniture array → `null`.  
7. Default width/depth fallback 600mm when omitted.

Fixtures: minimal `Open3dFurnitureItem` (id, catalogId, position, rotation, scale, width, depth).

---

## Task 02 pure / history cases

1. One furniture `furn-1`; selection furniture; after delete floor empty; selection empty.  
2. Missing id → **same project reference**.  
3. Locked → not removed; same ref if nothing else removed.  
4. `createOpen3dHistory` → update via pure delete → undo restores id + position + rotation + catalogId.  
5. Optional wall selection type (shared map).  
6. Multi-id two furniture → one past → one undo restores both.

---

## Task 04 keyboard cases

1. `Delete` → `deleteSelection` once.  
2. `Backspace` → once.  
3. Both **`preventDefault`** (cancelable event).  
4. Ctrl+Backspace does **not** delete (`!mod`).  
5. Editable `<input>` does not delete.  
6. Omitted handler does not throw.

---

## Task 05 coords

1. Task 01 owns hit math.  
2. Seed furniture at known project mm.  
3. `projectToScreen(furniture.position, INITIAL_TRANSFORM)` with Feasibility default `origin: { x: -4000, y: -2500 }, scale: 0.1` — **do not call `fitToView`** unless reading live transform.  
4. Mock canvas `getBoundingClientRect` (0,0) 800×600 → client ≈ screen from `projectToScreen`.  
5. Prefer one real pointer case with `activeTool="select"`.

---

## run.json shape

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
  "browser": { "exitCode": 0, "tool": "playwright|chrome-devtools", "log": "browser-w3-raw.log" },
  "startedAt": "<ISO>",
  "endedAt": "<ISO>",
  "status": "PASS|FAIL"
}
```

---

## Honest inventory summary

**Present (verify at execute):** `pickFurnitureAtPoint`; Feasibility select order furniture→wall→room; selection ring; `CanvasSelection`; `deleteEntityFromProject`; workspace `deleteSelection` (multi-id may N history); keyboard Del/Bksp without preventDefault coverage; history undo; default tool often `wall`.

**Missing for W3:** pickFurniture unit tests; Del/Bksp preventDefault tests; pure delete+undo integration; canvas select furniture unit; Esc clear selection; browser under `03-select-delete/`.

**Paths:** keyboard at `editor/useWorkspaceKeyboard.ts` (no `editor/hooks/` folder).

---

## Suggested commits

1. `docs(planner): P03 baseline evidence dir for W3 select/delete`  
2. `test(open3d): cover pickFurnitureAtPoint for W3 select`  
3. `fix(open3d): correct furniture pick hit-test for select tool` *(if needed)*  
4. `feat(open3d): pure applySelectionDelete with undo-safe history`  
5. `fix(open3d): single-history deleteSelection for furniture W3`  
6. `fix(open3d): Delete/Backspace preventDefault and unit coverage`  
7. `test(open3d): FeasibilityCanvas furniture select sets selection`  
8. `fix(open3d): Esc clears planner selection (W3 grammar)`  
9. `test(open3d): W3 select/delete unit evidence pack`  
10. `test(open3d): W3 select/delete browser + evidence pack CP-03`

---

## Expert revision archive (2026-07-09)

**Top 5 applied:** (1) CP-03 browser hard gate — unit alone insufficient; (2) canonical `run.json` + HEAD; (3) Task 05 coordinate strategy; (4) history no-op identity; (5) furniture-only product bar. Also: preventDefault gap, Esc clear, single-history multi-id, Fabric flag-off preferred, properties single-id OK. Full suggestions: [P03-suggestions.md](../reviews/P03-suggestions.md).
