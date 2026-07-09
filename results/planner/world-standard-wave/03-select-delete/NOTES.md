# W3 select/delete — unit land (2026-07-09)

## Code
- applySelectionDelete: one history step for multi-id
- deleteSelection uses applySelectionDelete
- Delete/Backspace preventDefault
- Esc cancel clears selection (keyboard + command palette cancel)

## Unit evidence
pnpm exec vitest run applySelectionDelete + canvasPicking pickFurniture + open3dWorkspaceKeyboard
Result: 30/30 passed (see unit-vitest.log)

## Browser
Not yet — CP-03 still needs select->delete->undo under 03-select-delete/ (next slice)

## Fabric
Proof path remains flag OFF / document selection
