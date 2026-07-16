# Original User Request

## 2026-07-16T17:05:53Z

Refine the Workspace layout of the OOPlanner application to use a premium, accessible, and robust floating drawer system using React Aria Components (RAC).

Working directory: e:\12072026\site
Integrity mode: development

## Requirements

### R1. RAC-Driven Overlay Drawers (Option 1)
Convert the Inventory (Left panel) and Layers/Validation (Bottom panel) into floating overlay Drawers using React Aria Components' `<ModalOverlay>` and `<Modal>`. 
- The Left Panel must slide in from the left over the canvas.
- The Bottom Panel must slide up from the bottom over the canvas.
- Ensure clicking outside or pressing ESC dismisses/collapsed the drawers, leveraging RAC's native accessibility and focus management.

### R2. Edge-to-Edge Canvas
The 2D/3D layout canvas must stretch 100% edge-to-edge under the floating drawers. Because the drawers overlay on top, the canvas remains full-screen and perfectly centered relative to the window, eliminating layout collisions.

### R3. Responsive Robustness
The layout must behave flawlessly across all breakpoints. On mobile/tablet viewports (< 48rem), the TopBar brand and actions must stack correctly, and the new top-level "Grid" and "Snap" buttons must hide or scale so the header box never shatters or overflows.

### R4. Technology Constraints
- Use React Aria Components (RAC) for the overlays/drawers. Do not introduce Radix or other new UI libraries.

### R5. Brand Identity (Logo)
- Restore the `OneAndOnlyLogo` (imported from `@/components/ui/Logo`) inside the brand area of the `TopBar.tsx`, matching the layout of the site headers.

## Acceptance Criteria

### Visual Appearance
- [ ] Left and Bottom panels slide in/out as drawers overlaying the full-screen canvas.
- [ ] Logo is restored and displayed next to the project title in `TopBar.tsx`.
- [ ] TopBar buttons (including Grid, Snap, Handoff) stack or hide properly on small viewports without overlapping or wrapping breakages.

### Functionality & Accessibility
- [ ] Focus trap and accessibility (ESC to close, clicking backdrop to dismiss) work natively via RAC `<Modal>` for both drawers.
- [ ] Canvas remains fully centered and visible underneath the overlay drawers.

## Follow-up — 2026-07-16T11:40:12Z

Please resume all work, restart the Project Orchestrator, and spawn the 3 additional agents as requested.
