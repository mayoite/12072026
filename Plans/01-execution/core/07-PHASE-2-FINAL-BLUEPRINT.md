# Phase 2: The Final Blueprint (3-Phase Execution)

This document formalizes the exact execution steps for our architectural pivot, based on the executive decisions made on 2026-07-08. We will execute this in three distinct, sequential phases to ensure stability.

---

## Phase 2A: The Planner UI Pivot (React Aria)
**Goal:** Rip out conflicting UI libraries and establish Adobe's React Aria as the gold standard for Planner accessibility and keyboard navigation.

1. **Install React Aria:** Add `react-aria-components` to the project.
2. **Purge Ark & Radix (Planner):** Remove `@ark-ui/react` and Radix dependencies from the `site/features/planner` module.
3. **Refactor Core Components:** 
   - Rewrite `CommandPalette.tsx` using Aria `<Modal>` and `<ListBox>`.
   - Rewrite `TopBar.tsx` using Aria `<Menu>` and `<Select>`.
   - Rewrite `PropertiesPanel.tsx` using Aria `<NumberField>` for strict millimeter inputs.
4. **Global Shell:** Ensure the marketing pages and global shell remain pure Vanilla React (`app-shell.css`).

---

## Phase 2B: The Canvas Unification (Open3D)
**Goal:** Officially deprecate the legacy 2D-only Fabric sandbox and unify all spatial planning under the `open3d` route.

1. **Deprecate Fabric:** Mark `/planner/fabric` for archival. Remove it from active navigation paths.
2. **Lock the 2D/3D Hybrid:** Ensure `/planner/open3d` boots natively into the 2D `FeasibilityCanvas` top-down view by default.
3. **Ensure State Continuity:** Verify that switching from 2D (`FeasibilityCanvas`) to 3D (`Lazy3DViewer`) perfectly maintains room dimensions, walls, and furniture positions without losing state.

---

## Phase 2C: The Asset Engine Pivot (Parametric + Dual Asset)
**Goal:** Complete the transition away from the dead backend SVG compiler by enabling client-side procedural generation and dual-asset uploads.

1. **Dual-Asset Hub (Puck UI):** Update `puckBlockRegistry.tsx` so the Admin panel natively supports uploading both `.glb` (3D) and `.svg` (2D) files for `fixed` product variants (like branded decor).
2. **The Parametric Engine:** Implement the client-side math to procedurally generate 2D SVGs and 3D meshes on the fly for `parametric` product variants (like custom casework), driven entirely by JSON bounds (W/D/H).

---

> **Note:** We will not proceed to Phase 2B until Phase 2A (React Aria) is fully built and tested to ensure the DOM layout (`100dvh`) remains rock solid.
