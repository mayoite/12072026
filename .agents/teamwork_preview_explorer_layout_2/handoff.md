# Handoff Report — Codebase Explorer - Bottom Drawer

## 1. Observation
We observed the following files and lines defining the layout and current rendering behavior of the Bottom Panel:

- **Bottom Panel Rendering and Layout Structure**:
  - In `site/features/planner/editor/OOPlannerWorkspace.tsx` (lines 1293–1333):
    ```tsx
    bottomPanel={
      activeFloor ? (
        <div className={workspaceStyles.bottomPanelWrapper}>
          <div className={workspaceStyles.bottomTabBar}>
            <button
              type="button"
              className={workspaceStyles.bottomTab}
              data-active={!showValidation}
              onClick={() => setShowValidation(false)}
            >
              Layers
            </button>
            ...
          </div>
          <div className={workspaceStyles.bottomTabContent}>
            {showValidation ? (
              <ValidationPanel ... />
            ) : (
              <LayersPanel ... />
            )}
          </div>
        </div>
      ) : null
    }
    ```
    This defines the tab buttons and contents for Layers and Validation panels.
  - In `site/features/planner/editor/WorkspaceShell.tsx` (lines 400–422):
    ```tsx
    {bottomPanel && (
      <PanelContainer
        id="bottom"
        title={panelTitles.bottom}
        state={panels.bottom.state}
        width={0}
        height={panels.bottom.height}
        x={panels.bottom.x}
        y={panels.bottom.y}
        zIndex={panels.bottom.zIndex}
        isOpen={resolvePanelOpen("bottom")}
        onUndock={() => undock("bottom")}
        onDock={() => dock("bottom")}
        onClose={() => handlePanelCollapse("bottom")}
        onMinimize={() => handlePanelCollapse("bottom")}
        onMove={(x, y) => move("bottom", x, y)}
        onResize={(w, h) => resize("bottom", w, h)}
        onFocus={() => setFocusedPanel("bottom")}
        onBlur={() => setFocusedPanel(null)}
      >
        {bottomPanel}
      </PanelContainer>
    )}
    ```
    This renders the panel container inside the workspace layout.
  - In `site/features/planner/editor/PanelContainer.tsx` (lines 241–246):
    The panel wrapper maps CSS classes and absolute positioning style parameters based on state.
  - In `site/features/planner/editor/workspace.module.css` (lines 624–636):
    ```css
    .panelBottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 200px;
      border-top: 1px solid var(--ws-panel-border);
      transform: translateY(100%);
    }

    .panelBottom[data-state="docked"] {
      transform: translateY(0);
    }
    ```
    Currently toggles position absolute rendering using `translateY(100%)` to hide and `translateY(0)` to show.

- **React Aria Components (RAC) Overlay Usage**:
  - In `site/features/planner/editor/HandoffDialog.tsx` (lines 32–34) and `site/features/planner/editor/CommandPalette.tsx` (lines 99–106):
    Components are imported and wrapped inside `<ModalOverlay>`, `<Modal>`, and `<Dialog>`. 
    `<ModalOverlay>` uses `isDismissable` to collapse on backdrop click, and keyboard focus/ESC handling is managed natively by RAC.
  - In `site/features/planner/ui/BottomSheet.tsx` (lines 15–112):
    A custom `BottomSheet` component exists using raw browser `addEventListener` to capture `Escape` key events, click overlays, and manual focus-trap loops.

---

## 2. Logic Chain
To convert the Bottom Panel into a floating RAC drawer that slides up over the canvas while maintaining edge-to-edge canvas coordination and accessibility, we reason as follows:

1. **Native Focus & Dismissal (Accessibility)**:
   By wrapping the bottom panel in RAC's `<ModalOverlay>` / `<Modal>` / `<Dialog>`, focus trapping and keyboard-based dismissals (Escape key) are handled out-of-the-box. Setting `isDismissable={true}` on the `<ModalOverlay>` automatically binds backdrop clicks to invoke the close callback (`onOpenChange(false)`), replacing manual custom window/document listeners.
2. **Animation using RAC Lifecycles**:
   RAC applies `data-entering` and `data-exiting` attributes to the overlays and modals when transitioning. This allows CSS-driven animations (e.g., standard fade-in for overlay backdrop and slide-up/slide-down for the drawer dialog) to animate smoothly without requiring JS timeouts or React transition libraries.
3. **Canvas Isolation (Edge-to-Edge Layout)**:
   Since RAC portal-renders overlay components (`ModalOverlay` is rendered outside the workspace flow, directly under the document `<body>`), the bottom drawer overlay no longer occupies workspace layout rows or cells. This ensures the canvas layout (`.canvas` inside `.workspace`) spans the full vertical and horizontal screen dimensions and remains completely unconstrained and un-squished when the bottom panel toggles.

---

## 3. Caveats
- Replacing the bottom panel with a React Aria Component modal drawer bypasses the docking system state (`useDockingSystem()`) for this specific panel. The panel will no longer support manual resizing, dragging to undock, or custom floating coordinate updates. This is aligned with the layout refinement goal of transitioning to floating RAC drawers.
- The backdrop style can be configured as fully transparent or semi-transparent based on whether canvas interactions should be visible or temporarily dimmed.

---

## 4. Conclusion
We propose introducing a React Aria Components-based floating drawer for the Bottom Panel:

### Component Structure (e.g., inside `WorkspaceShell.tsx` or a new `BottomDrawer.tsx` file)
```tsx
import { ModalOverlay, Modal, Dialog } from "react-aria-components";
import styles from "./bottom-drawer.module.css";

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomDrawer({ isOpen, onClose, children }: BottomDrawerProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open) onClose(); }}
      isDismissable
      className={styles.drawerOverlay}
    >
      <Modal className={styles.drawerPanel}>
        <Dialog className={styles.drawerDialog} aria-label="Layers and Validation">
          {children}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
```

### Propose CSS/Tailwind Styles and Animations
```css
/* Drawer overlay backdrop */
.drawerOverlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.drawerOverlay[data-entering] {
  animation: fadeIn 200ms ease-out;
}
.drawerOverlay[data-exiting] {
  animation: fadeOut 200ms ease-in forwards;
}

/* Slide up drawer panel */
.drawerPanel {
  width: 100%;
  max-width: 600px;
  background: var(--planner-surface-panel, #ffffff);
  border-top: 1px solid var(--planner-border-default, #e5e7eb);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  max-height: 50vh;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  outline: none;
}

.drawerPanel[data-entering] {
  animation: slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1);
}
.drawerPanel[data-exiting] {
  animation: slideDown 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.drawerDialog {
  outline: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes slideDown {
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
}
```

---

## 5. Verification Method
- **Keyboard accessibility verification**:
  - Focus a control, open the bottom panel. Check that keyboard focus moves into the panel.
  - Press `ESC` or click outside the panel dialog (on `drawerOverlay`). The panel must trigger `onClose`.
  - Focus must return to the trigger element that opened the panel.
- **Canvas aspect check**:
  - Verify that the canvas stage size does not trigger reflows or resizing when toggling the bottom panel.
  - Verify visually in a browser inspect window that the canvas element (`.canvas`) covers the height behind the bottom drawer.
