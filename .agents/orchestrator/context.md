# Context

## Known Facts
- OOPlanner application layout has an Inventory panel (Left) and a Layers/Validation panel (Bottom).
- The canvas needs to stretch edge-to-edge underneath these panels.
- React Aria Components (RAC) should be used to make these panels floating overlay drawers via `<ModalOverlay>` and `<Modal>`.
- Responsive layout breakpoints are targeted at `< 48rem` (mobile/tablet).
- Logo `OneAndOnlyLogo` needs to be restored to `TopBar.tsx`.
- Target files for layout: `OOPlannerWorkspace.tsx`, `WorkspaceLeftPanel.tsx`, `BottomSheet.tsx`, `TopBar.tsx`, and CSS files.

## Synthesized Explorer Findings
1. **TopBar and Brand**:
   - `site/src/features/planner/editor/TopBar.tsx` contains the brand container.
   - `OneAndOnlyLogo` is available in `site/src/components/ui/Logo.tsx`.
   - On viewports < 48rem, Grid, Snap, and Handoff buttons are hidden. We can add them to the "Prefs" menu with a `.mobileOnly` class to keep them accessible.
2. **Left Panel & Drawer**:
   - `WorkspaceLeftPanel.tsx` is passed as `leftPanel` to `WorkspaceShell.tsx`.
   - `PanelContainer.tsx` wraps it inside `<aside id="panel-left">` absolute positioning.
   - We will replace it with a RAC `<ModalOverlay>` / `<Modal>` / `<Dialog>` sliding from left.
3. **Bottom Panel & Drawer**:
   - Bottom panel is configured in `OOPlannerWorkspace.tsx` and wraps Layers and Validation.
   - We will wrap it with a RAC `<ModalOverlay>` / `<Modal>` / `<Dialog>` sliding from bottom.
4. **Canvas Layout**:
   - `.workspace` grid currently positions panels side-by-side.
   - We will update the CSS grid so `.canvas` spans `grid-column: 1 / -1; grid-row: 1 / -1;` to stretch 100% full-screen edge-to-edge under overlays.

## Constraints
- Use React Aria Components for overlay/drawers. No new UI libraries (like Radix).
- Focus trap and accessibility (ESC to close, backdrop click dismiss) must work natively.
- Canvas must be centered and fully visible underneath.
- Keep layout rules from AGENTS.md.
- Build/tests must pass.
