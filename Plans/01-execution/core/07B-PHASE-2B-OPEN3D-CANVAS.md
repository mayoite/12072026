# Phase 2B: The Canvas Unification (Open3D)

**Goal:** Formally deprecate the legacy 2D-only Fabric sandbox. Consolidate all spatial planning (both 2D drafting and 3D visualization) under the single `/planner/open3d` unified workspace.

## 1. Route Deprecation
- [ ] Mark `/planner/fabric` route as deprecated.
- [ ] Remove all navigation links pointing to the fabric workspace.
- [ ] Update `INDEX.md` and routing documentation to reflect Open3D as the exclusive workspace.

## 2. Boot Sequence and State
- **Current State:** `/planner/open3d` uses `OOPlannerWorkspace.tsx` to handle state. It already contains both `FeasibilityCanvas` (2D) and `Lazy3DViewer` (3D).
- **Architecture Validation:**
  - Ensure the default boot state always loads the 2D `FeasibilityCanvas`.
  - Ensure the TopBar toggle smoothly switches between 2D and 3D.
  - Verify that `workspaceCanvas.project` state (walls, rooms, furniture coordinates) is perfectly shared and preserved when toggling views.

## 3. The 100dvh Shell Guarantee
- Ensure the Open3D wrapper strictly enforces `overflow: hidden` on the body.
- Verify that touch-dragging on tablets pans the 2D canvas, but does not pull to refresh or rubber-band the browser chrome.

## 4. Verification
- A user can load a fresh plan, draw a room in 2D, drop a piece of furniture, toggle to 3D, and immediately see the generated meshes in the exact correct spatial coordinates.
