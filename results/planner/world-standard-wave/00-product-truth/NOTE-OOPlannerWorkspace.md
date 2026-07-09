# NOTE — OOPlannerWorkspace (P01 deep read)

## 1. Composition tree
TopBar + CanvasToolRail + FeasibilityCanvas (2D) / Lazy3DViewer (3D) + Inventory/Properties panels + optional FurnitureFabricLayer when flag ON.

## 2. deleteSelection
Wired for furniture (and entity map); multi-id single history path for W3. Properties panel may single-id delete.

## 3. Keyboard wiring
`useWorkspaceKeyboard` — Del/Bksp delete, Esc cancel, tool shortcuts from `CANVAS_TOOL_SHORTCUTS`, undo/redo.

## 4. Persistence hooks
`useOpen3dWorkspaceAutosave` — IDB local flush; honest status labels.

## 5. Guest vs member
Guest mode prop; guest repo local; member cloud path not default honesty for W6.
