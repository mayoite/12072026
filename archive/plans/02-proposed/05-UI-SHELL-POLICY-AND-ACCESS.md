# 05 — UI Shell Policy and Access

Status: After command layer trust is restored.
Owner: __________
Exit date: __________
Depends on: 04

## Goal

Finish the missing Open3D shell rules instead of leaving the shell half-converted.

## Tasks

1. Replace remaining emoji or unicode icons in planner chrome and inventory taxonomy with Phosphor icons.
2. Add `open3dIconPolicy.test.ts`.
3. Build the bottom command/status surface.
4. Add command palette support for:
   - switch tool,
   - undo/redo,
   - save,
   - toggle 2D/3D.
5. Enforce the catalog search result cap of 24.
6. Validate keyboard access and focus return for shell controls.
7. Add evidence for desktop and mobile shell behavior.

## Exit criteria

- Planner shell is visually and behaviorally consistent.
- Keyboard and mobile shell basics pass.
- Icon policy is enforced by test, not preference.
