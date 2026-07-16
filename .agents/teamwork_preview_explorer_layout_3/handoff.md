# Handoff Report: Left Drawer & Canvas Layout Analysis

This report outlines observations, logic, proposed layouts, and styling changes to convert the Left Panel (Inventory) and Bottom Panel (Layers) into accessible React Aria Components (RAC) floating drawers while ensuring the 2D/3D layout canvas stretches 100% edge-to-edge under them.

---

## 1. Observation

### Current Left Panel & Overlay Drawer Architecture
- **Rendering Entrypoint**: In `site/features/planner/editor/OOPlannerWorkspace.tsx` (lines 1262-1273), the `<WorkspaceLeftPanel>` component is rendered and passed as a prop to `<WorkspaceShell>`:
  ```tsx
  leftPanel={
    <WorkspaceLeftPanel
      catalogItems={catalog.items}
      isLoading={catalog.isLoading && catalog.items.length === 0}
      catalogStatus={catalog.status}
      onItemPlace={handleInventoryPlace}
      onWorkstationConfigPlace={handleWorkstationConfigPlace}
      onWorkstationConfigBatchPlace={handleWorkstationConfigBatchPlace}
      workspaceBridge={workspaceAiBridge}
      displayUnit={displayUnit}
    />
  }
  ```
- **Shell Layout Integration**: In `site/features/planner/editor/WorkspaceShell.tsx` (lines 341-366), `leftPanel` is rendered inside `<PanelContainer id="left">`:
  ```tsx
  {leftPanel && (
    <PanelContainer
      id="left"
      title={panelTitles.left}
      contentOnly
      state={panels.left.state}
      width={panels.left.width}
      height={panels.left.height}
      x={panels.left.x}
      y={panels.left.y}
      zIndex={panels.left.zIndex}
      isOpen={resolvePanelOpen("left")}
      onUndock={() => undock("left")}
      onDock={() => dock("left")}
      onClose={() => handlePanelCollapse("left")}
      onMinimize={() => handlePanelCollapse("left")}
      onMove={(x, y) => move("left", x, y)}
      onResize={(w, h) => resize("left", w, h)}
      onFocus={() => setFocusedPanel("left")}
      onBlur={() => setFocusedPanel(null)}
    >
      {leftPanel}
    </PanelContainer>
  )}
  ```
- **Markup Structure**: Inside `site/features/planner/editor/PanelContainer.tsx` (lines 231-247), the component outputs an HTML `<aside>` element:
  ```tsx
  <aside
    ref={panelRef}
    id={`panel-${id}`}
    role="region"
    aria-label={`${title} panel`}
    tabIndex={-1}
    className={`${styles.panel} ${id === "left" ? styles.panelLeft : ""} ...`}
    data-state={state}
    data-open={isOpen ? "true" : "false"}
    style={panelStyle}
  >
  ```
- **CSS Grid Constraining the Canvas**: In `site/features/planner/editor/workspace.module.css` (lines 412-422), `.workspace` uses grid rows and columns to place side panels and canvas side-by-side:
  ```css
  .workspace {
    grid-area: workspace;
    position: relative;
    display: grid;
    min-height: 0;
    height: 100%;
    overflow: hidden;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas: "left canvas right";
  }
  ```
  And `.canvas` is layouted inside the central cell:
  ```css
  .canvas {
    grid-area: canvas;
    position: relative;
    min-width: 0;
    min-height: 0;
    max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  ```
- **Mobile Responsive Drawer Hack**: For small viewports, custom backdrop buttons and absolute translateX shifts are used rather than modal components (lines 332-339 in `WorkspaceShell.tsx` and 1248-1296 in `workspace.module.css`).

### React Aria Components Support
- `site/package.json` contains `"react-aria-components": "1.19.0"` under dependencies.
- RAC is already successfully used for dialog overlays in `site/features/planner/editor/CommandPalette.tsx` (using `<ModalOverlay>`, `<Modal>`, and `<Dialog>`).

---

## 2. Logic Chain

1. **Accessibility**: Since React Aria Components provides focus locking, keyboard navigation, and native overlay tracking, wrapping the Left Panel (Inventory) and Bottom Panel (Layers) in RAC overlays `<ModalOverlay>`, `<Modal>`, and `<Dialog>` ensures keyboard accessibility (WCAG compliance) and lets the ESC key and backdrop clicks dismiss the panel natively without manual state listeners.
2. **Slide-In Animation**: By specifying custom CSS classes and hooking into RAC's automatic entering/exiting lifecycle state attributes (`data-entering`, `data-exiting`), we can easily control CSS transitions to slide the drawer horizontally (Left Panel) or vertically (Bottom Panel).
3. **Edge-to-Edge Canvas**: By transitioning panels to portaled floating drawers (which render at the end of the `<body>` outside the layout flow), we can free the `.workspace` grid.
4. **Canvas Stretches Full screen**: Changing the CSS for the `.canvas` container inside `.workspace` to span all rows and columns (`grid-column: 1 / -1; grid-row: 1 / -1;`) allows it to fill the screen full-bleed underneath the drawers. The child element (`.root` inside `plannerFabricStage.module.css:20`) automatically occupies 100% bounds using `position: absolute; inset: 0`, centering the canvas contents.

---

## 3. Caveats

- This investigation is strictly read-only and does not implement the changes.
- Assumes the Left and Bottom panels are completely converted to overlays. If docked functionality is toggled on desktop, conditional rendering/grid style changes must be wired.

---

## 4. Conclusion

We propose the following implementation blueprints:

### Proposed React Aria Drawer Structure
Replace the `<aside>` markup in `PanelContainer.tsx` or wrap the panels inside `WorkspaceShell.tsx`:

```tsx
import { ModalOverlay, Modal, Dialog } from "react-aria-components";

// Left Drawer Panel Structure
<ModalOverlay
  isOpen={isLeftOpen}
  onOpenChange={(open) => {
    if (!open) onLeftClose();
  }}
  isDismissable
  className={styles.leftDrawerOverlay}
>
  <Modal className={styles.leftDrawerModal}>
    <Dialog aria-label="Inventory Library" className={styles.leftDrawerDialog}>
      {leftPanel}
    </Dialog>
  </Modal>
</ModalOverlay>

// Bottom Drawer Panel Structure
<ModalOverlay
  isOpen={isBottomOpen}
  onOpenChange={(open) => {
    if (!open) onBottomClose();
  }}
  isDismissable
  className={styles.bottomDrawerOverlay}
>
  <Modal className={styles.bottomDrawerModal}>
    <Dialog aria-label="Layers and Validation" className={styles.bottomDrawerDialog}>
      {bottomPanel}
    </Dialog>
  </Modal>
</ModalOverlay>
```

### Proposed Drawer CSS & Transitions
Add the following layout and slide transition rules to the stylesheet (e.g. `workspace.module.css`):

```css
/* Left Slide-in Drawer Styles */
.leftDrawerOverlay {
  position: fixed;
  inset-block-start: var(--ws-header-h); /* Under header bar */
  inset-block-end: var(--ws-status-h);   /* Above status footer */
  inset-inline-start: 0;
  inset-inline-end: 0;
  z-index: var(--ws-z-floating);
  background-color: var(--overlay-inverse-35, rgba(0, 0, 0, 0.35));
  display: flex;
  transition: opacity 0.25s ease-out;
}
.leftDrawerOverlay[data-entering],
.leftDrawerOverlay[data-exiting] {
  opacity: 0;
}

.leftDrawerModal {
  width: var(--ws-panel-width, 320px);
  max-width: 90vw;
  background: var(--ws-panel-bg);
  box-shadow: var(--ws-shadow-float);
  height: 100%;
  outline: none;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.leftDrawerModal[data-entering],
.leftDrawerModal[data-exiting] {
  transform: translateX(-100%);
}

.leftDrawerDialog {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  outline: none;
}

/* Bottom Slide-up Drawer Styles */
.bottomDrawerOverlay {
  position: fixed;
  inset: 0;
  z-index: var(--ws-z-floating);
  background-color: var(--overlay-inverse-35, rgba(0, 0, 0, 0.35));
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: opacity 0.25s ease-out;
}
.bottomDrawerOverlay[data-entering],
.bottomDrawerOverlay[data-exiting] {
  opacity: 0;
}

.bottomDrawerModal {
  width: 100%;
  height: 240px;
  max-height: 50vh;
  background: var(--ws-panel-bg);
  box-shadow: var(--ws-shadow-float);
  border-top: 1px solid var(--ws-panel-border);
  outline: none;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.bottomDrawerModal[data-entering],
.bottomDrawerModal[data-exiting] {
  transform: translateY(100%);
}

.bottomDrawerDialog {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  outline: none;
}
```

### Proposed Full-Screen Canvas Styles
Force `.canvas` to stretch edge-to-edge underneath overlays inside `.workspace`:

```css
.workspace {
  grid-area: workspace;
  position: relative;
  display: grid;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  /* Columns for docked Right Panel only; left and bottom panels are floating overlays */
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-rows: minmax(0, 1fr);
  grid-template-areas: "canvas right";
}

.canvas {
  grid-column: 1 / -1; /* Spans full grid width */
  grid-row: 1 / -1;    /* Spans full grid height */
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;          /* Lower stack than drawers */
}
```

---

## 5. Verification Method

To verify these layout integration proposals:
1. Run layout lint:
   ```bash
   pnpm run check:layout
   ```
2. Build validation:
   ```bash
   pnpm run typecheck
   ```
3. Run the feature unit test suite to verify no regressions:
   ```bash
   pnpm test site/tests/unit/features/planner/editor/WorkspaceLeftPanel.test.tsx
   ```
