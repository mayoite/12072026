# PHASE-03 — Studio tool depth (inspector, history, drafts)

**Parallel:** yes · **Blocks on:** 01 · **Proof:** live browser

---

## In plain words
Once the studio can author good symbols (PHASE-01), it needs the everyday editing tools a
non-coder expects: select a shape and edit its exact numbers, undo/redo with clear labels, a
warning before you leave with unsaved work, and a way to reset back to the last published
version. Today the studio has a canvas but these safety-and-precision tools are thin.

## Why this matters
Authoring without an inspector or undo is stressful and error-prone — one wrong drag and you've
lost work. These tools are what make a non-coder trust the studio enough to actually use it.

## What exists today (grounded in code)
- `admin/svg-editor/scene/*` — the scene document + SVG.js adapter (named undo/redo already
  exists for some ops).
- `admin/svg-editor/AdminSvgEditorEditView.tsx` — the editor shell (canvas-first layout landed).

## What "good" looks like
Click a shape → a node inspector shows x/y/size/fill/stroke → type a new value → the canvas
updates → undo restores it with the right label. Leaving mid-edit warns you. "Reset to
published" restores the last published bytes.

## Steps
1. Add a node inspector: selected shape's x/y/size/radius/fill/stroke, editable, via
   `replaceNode` + history.
2. Ensure create/move/resize/delete are each named, reversible undo operations.
3. Add a dirty indicator + unsaved-exit guard + reset-to-published.

## Done when
Boxes in `plan/Admin/CHECKLIST.md` → PHASE-03.

## How to prove
Draw a shape, edit its width in the inspector, undo, confirm the label. Start an edit, try to
navigate away, confirm the guard. Reset to published, confirm the bytes restore. Live run is
the proof; Raw artifacts → `results/admin/phase-03/` (gitignored dump). Report → `agents-work/reports/admin-phase-03.md`.

## Guardrails
- Every edit is a named history op — no silent mutation.
- The descriptor form stays *metadata only*; geometry lives in the scene/inspector.

## Out of scope
Pen/path node editing, multi-select/group, minimap — defer until the core inspector is proven.
