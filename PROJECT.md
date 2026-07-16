# Project: OOPlanner Workspace Layout Refinement

## Architecture
- The OOPlanner application workspace displays a 2D/3D layout canvas with control/information panels.
- Layout management is handled in `OOPlannerWorkspace.tsx` and `WorkspaceShell.tsx`.
- The panels include:
  - Left Panel: Inventory selection (defined in `WorkspaceLeftPanel.tsx`).
  - Bottom Panel: Layers and validation information (defined in `BottomSheet.tsx` or similar).
  - Top Bar: Brand, project title, actions, and status indicators (defined in `TopBar.tsx`).
- React Aria Components (RAC) is used for overlay controls to guarantee focus management, keyboard accessibility, and screen reader support.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Refine Workspace Layout | Convert Inventory (Left) and Layers (Bottom) panels into floating RAC drawers; ensure edge-to-edge canvas; restore brand logo in TopBar; verify mobile responsive styling. | none | PLANNED |

## Code Layout
- Main Workspace: `site/src/features/planner/editor/OOPlannerWorkspace.tsx`
- Left Panel: `site/src/features/planner/editor/WorkspaceLeftPanel.tsx`
- Bottom Panel: `site/src/features/planner/ui/BottomSheet.tsx`
- Top Bar: `site/src/features/planner/editor/TopBar.tsx`
- CSS / Styles: `site/src/app/css/...` or Tailwind CSS config
- Logo Component: `site/src/components/ui/Logo.tsx`

## Interface Contracts
### Workspace ↔ Panels
- The panels toggle open/closed state.
- Modal overlay backdrop click and escape key must trigger collapse/dismiss natively.
