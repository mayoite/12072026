# Context - Generation 2

## Known Facts
- The OOPlanner application layout has an Inventory panel (Left) and a Layers/Validation panel (Bottom).
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

## Strategy for Generation 2 (Parallelized implementation and verification)
- **Worker 1**: TopBar & Brand & logo restoration.
- **Worker 2**: Bottom Panel (Layers/Validation) drawer overlay implementation.
- **Worker 4 (NEW)**: Left Panel (Inventory) drawer overlay implementation & edge-to-edge canvas CSS adjustments.
- **Worker 3**: Integration of changes and running initial build and tests.
- **Challenger 3 (NEW)**: Empirical accessibility verification (ESC to close, backdrop click dismiss, focus traps) on overlay drawers.
- **Challenger 4 (NEW)**: Empirical responsiveness verification (< 48rem layout checks, TopBar stacking/hiding).
