# Execute 3/5 — Keyboard delete wire

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` (main only; no worktrees)  
**HEAD:** `bf212a9a7d0fa8e7867b5f6a803b06ee5a5c43df`  
**Seat:** Execute 3/5 — keyboard delete wire  
**Mode:** verify-first; product wire only if RED  

---

## Verdict: **OK** (no product fix)

| Check | Result | Source |
|-------|--------|--------|
| Del / Bksp call `deleteSelection` | **PASS** | `useWorkspaceKeyboard.ts` L83–86 |
| `preventDefault` on Del / Bksp | **PASS** | same; unit asserts `defaultPrevented === true` |
| `!mod` (no Ctrl/Cmd+Del/Bksp delete) | **PASS** | `&& !mod`; unit: Ctrl/Cmd+Backspace does not call handler, no preventDefault |
| No delete in inputs / editables | **PASS** | early `isEditableTarget` return (INPUT/TEXTAREA/SELECT/contentEditable); unit Delete-in-input |
| Optional handler safe | **PASS** | `handlers.deleteSelection?.()`; unit omit path does not throw |
| Wired from `OOPlannerWorkspace` only | **PASS** | `deleteSelection` callback → pure `applySelectionDelete` → clear selection; passed into `useWorkspaceKeyboard({ deleteSelection, ... })` ~L768–774 |
| Unit pack green | **PASS** | 19/19 (open3dWorkspaceKeyboard + toolShortcutTruth) |

**Product code change this seat:** **none** (already green — Mode A re-prove).

---

## Production truth (repo)

### Hook — `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`

```typescript
// editable guard first — typing never deletes furniture
if (isEditableTarget(event.target)) return;

const mod = event.ctrlKey || event.metaKey;
// ...
if ((event.key === "Delete" || event.key === "Backspace") && !mod) {
  event.preventDefault();
  handlers.deleteSelection?.();
  return;
}
```

`isEditableTarget`: `INPUT` | `TEXTAREA` | `SELECT` | `isContentEditable`.

### Wire — `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`

```typescript
const deleteSelection = useCallback(() => {
  const { selection } = workspaceCanvas;
  if (selection.type === "none" || selection.ids.length === 0) return;
  workspaceCanvas.updateProject((project) =>
    applySelectionDelete(project, selection),
  );
  workspaceCanvas.setSelection({ type: "none", ids: [] });
}, [workspaceCanvas]);

useWorkspaceKeyboard({
  // ...
  deleteSelection,
  // ...
});
```

Single wire site for workspace keyboard. No second delete listener found for this path.

---

## Unit evidence (this seat)

```text
cd D:\OandO07072026\site
pnpm exec vitest run \
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx \
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts \
  --reporter=verbose
```

| File | Result |
|------|--------|
| `open3dWorkspaceKeyboard.test.tsx` | **11 passed** including Del/Bksp preventDefault, !mod, input guard, optional omit |
| `toolShortcutTruth.test.ts` | **8 passed** (adjacent keyboard authority; not delete-specific) |
| **Total** | **19 passed / 0 failed** · exit **0** · ~1.24s |

Raw log: `unit-open3dWorkspaceKeyboard.log` (this folder; refreshed this seat).

### Delete-specific cases proven

| Case | Test name |
|------|-----------|
| Delete + Backspace → handler + preventDefault | `calls deleteSelection on Delete and Backspace and preventDefaults` |
| Ctrl/Cmd+Backspace → no delete, no preventDefault | `does not call deleteSelection on Ctrl+Backspace or Cmd+Backspace` |
| Delete while focus in `<input>` → no delete | `does not call deleteSelection when Delete is pressed in an input` |
| Handler omitted → no throw | `does not throw when deleteSelection handler is omitted` |

---

## Honesty / residual

| Item | Note |
|------|------|
| Unit ≠ browser W3 | This seat is **keyboard wire unit truth** only. Browser place→select→Delete→undo lives under W3 / other exec seats. |
| Ctrl+Delete | Covered by `!mod` on both keys; unit explicitly covers mod+Backspace. Mod+Delete same branch. |
| Fabric | Not exercised here; W3 gate requires flag OFF. |

---

## Status for head

- **OK** — Del/Bksp preventDefault, `!mod`, no-delete-in-inputs, workspace wire present.
- **No fix** required this seat.
- Next exec seats continue P03 pack; do not claim full CP-03 from this note alone.
