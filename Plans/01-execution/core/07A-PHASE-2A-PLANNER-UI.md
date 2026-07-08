# Phase 2A: The Planner UI Pivot (React Aria)

**Goal:** Establish Adobe's React Aria as the accessible, keyboard-first foundation for the Open3D Planner. Rip out the conflicting Radix and Ark UI libraries from the `site/features/planner` module.

## 1. Dependency Resolution
- [x] Install `react-aria-components`.
- [ ] Audit `package.json` to ensure Radix and Ark are removed once no longer used.

## 2. Component Refactoring (site/features/planner/open3d/editor)
The following components must be completely rebuilt using Aria primitives (`<Dialog>`, `<ListBox>`, `<Menu>`, `<NumberField>`).

### A. CommandPalette.tsx
- **Current State:** Manually wires `ArrowUp`/`ArrowDown` and list state.
- **New Architecture:**
  - Wrap in Aria `<ModalOverlay>` and `<Modal>`.
  - Use `<Dialog>` to trap focus.
  - Render a text input bound to the query state.
  - Use Aria `<ListBox>` for the results. 
  - *Note:* We will not use `<ComboBox>` because the palette is an inline modal, not a popover attached to a trigger.

### B. TopBar.tsx
- **Current State:** Manually wires dropdown menus for Export, Import, Unit selection, and active Floor.
- **New Architecture:**
  - Use Aria `<MenuTrigger>`, `<Button>`, `<Popover>`, and `<Menu>` to handle the dropdowns.
  - Ensure escape key and click-outside naturally close the menus.

### C. PropertiesPanel.tsx
- **Current State:** Basic HTML inputs for millimeter dimensions (W/D/H).
- **New Architecture:**
  - Implement Aria `<NumberField>` to gain native mouse-wheel incrementing, arrow-key stepping, and strict validation.
  - Wire the inputs to the `onUpdateEntity` callback.

## 3. Verification
- `npm run lint:ui` passes with zero Radix/Ark imports in the Planner.
- Keyboard navigation (Tab, Arrow keys, Enter) works seamlessly across the refactored components.
- The 100dvh layout remains perfectly intact without vertical scrollbars.
