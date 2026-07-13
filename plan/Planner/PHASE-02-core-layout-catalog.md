# Planner Phase 2 — core layout, catalog, and continuity

## Outcome

The customer creates an accurate layout with public Oando inventory.

The same project survives 2D, 3D, save, reload, devices, and input methods.

The workspace meets `../../docs/architecture/06-UI-BENCHMARK.md`.

## Core layout

- Create and edit walls, doors, and windows.
- Select the correct object.
- Move, rotate, resize, duplicate, and delete.
- Keep millimetres as stored authority.
- Support metric and imperial display.
- Make grid, snap, measure, dimension, text, zoom, pan, and fit truthful.
- Remove silent no-op controls.
- Keep numeric properties keyboard-editable.
- Use one undo and redo authority for all document mutations.

## Planner catalog

- Consume the versioned Admin catalog contract.
- Expose only published customer-visible products.
- Meet `UI-CAT-01` through `UI-CAT-04`.
- Support search by name, SKU, family, material, and commercial attributes.
- Filter by family, dimensions, seats, material, and availability.
- Show recognizable imagery or 2D geometry, full name, SKU, exact dimensions, family, and availability.
- Group family variants for comparison.
- Keep critical identity visible without hover.
- Show availability honestly.
- Preserve product, family, version, option, and commercial identity.
- Use published SVG as the primary 2D symbol.
- Use `Block2D` only while loading or when SVG is unavailable.
- Keep missing assets from breaking the layout.
- Keep the placed 2D product recognizable from its catalog preview.
- Keep an isolated fixture for work before live integration.

## One project document

- Use one normalized document for 2D, 3D, save, reload, import, export, and BOQ.
- Preserve stable identifiers, position, rotation, dimensions, and options.
- Prevent view actions from mutating project data or document history.
- Keep guest and member storage labels truthful.
- Meet `UI-STATE-01` and `UI-STATE-02`.
- Show one authoritative save indicator.
- Show loading, offline, saving, saved, unsaved, failed, and retry states distinctly.
- Announce dynamic states without moving keyboard focus.
- Never show success after a failed save.
- Prevent guest claim from overwriting a non-empty member project.

## 2D and 3D continuity

- Build both views from the same product and room identities.
- Preserve object count, pose, rotation, and options across view changes.
- Keep model scale and origin bounded.
- Keep 2D footprint and 3D dimensions aligned.
- Provide clear loading, failure, fallback, and return states.
- Let missing 3D assets block only affected 3D proof.

## Interface quality

- Meet `UI-SHELL-01` through `UI-SHELL-04`.
- Meet `UI-EDIT-01` through `UI-EDIT-03`.
- Keep the desktop header on one row.
- Give the default desktop canvas at least 65 percent of the viewport area.
- Collapse empty properties instead of reserving permanent space.
- Dock, resize, and collapse panels without losing selection or work.
- Put secondary commands in menus.
- Keep one clear primary action for the current task.
- Open only properties relevant to the current selection.
- Accept exact numeric dimensions and positions.
- Label undo and redo with the affected action.
- Prevent clipping and unexpected page scrollbars.
- Keep primary actions reachable at supported widths.
- Meet `UI-MOB-01` through `UI-MOB-04` at 390 by 844.
- Replace the wrapped desktop header with deliberate phone chrome.
- Give the initial phone canvas at least 60 percent of viewport height.
- Keep initial phone chrome at or below 40 percent of viewport height.
- Use one compact top bar and one compact bottom tool bar.
- Open inventory and properties as mutually exclusive sheets.
- Use 44 by 44 pixel targets for frequent phone actions where practical.
- Support landscape intentionally.
- Meet `UI-A11Y-01` through `UI-A11Y-04`.
- Support keyboard completion without dragging.
- Give every drag action a keyboard and pointer alternative.
- Keep focus visible and unobscured.
- Meet WCAG 2.2 AA for the primary journey.
- Apply light and dark themes across primary surfaces.
- Remove unexplained console, request, hydration, and accessibility errors.

## Existing implementation stack

- Use `react-aria-components` for accessible controls, menus, focus, and selection.
- Use `react-resizable-panels` for desktop panel resizing.
- Use `vaul` for phone inventory and properties sheets.
- Keep Fabric as the sole interactive 2D engine.
- Keep Three, React Three Fiber, and Drei as the 3D stack.
- Use Zustand and Zundo for Planner state and undo authority.
- Use TanStack Query for remote loading and sync state.
- Use existing Fuse search only when ranked catalog search is required.
- Keep Phosphor as the icon language.
- Verify with Playwright and Axe.
- Add no UI dependency without a verified missing capability and license review.

## Parallel work

- Geometry and catalog integration can run together.
- Persistence and 2D/3D continuity can run together.
- Responsive UI, accessibility, and themes can run together.

## Limited blockers

- Missing live catalog blocks only live integration proof.
- The isolated fixture keeps core work moving.
- Missing 3D assets block only their own visual proof.
- Missing remote storage blocks only remote-save proof.

## Required proof

- Geometry, command, undo, and identity tests.
- Catalog fixture and live-contract tests.
- Save, reload, import, and export round-trip tests.
- 2D-to-3D continuity checks.
- Desktop 1440 by 900 workspace geometry measurements.
- Phone 390 by 844 workspace geometry measurements.
- Header, canvas, panel, status, overflow, and target-size measurements.
- Desktop, phone, landscape, keyboard, theme, and accessibility browser journeys.
- Drag-alternative and focus-not-obscured checks.
- Save-state announcement and failure-recovery checks.
- Planner catalog search, filter, grouping, availability, and retirement checks.
- Catalog-preview and placed-symbol recognition checks.

## Done when

- A customer creates and edits an accurate layout.
- Public inventory keeps its identity from discovery through placement.
- One project remains consistent across views and persistence.
- Every applicable `UI-CAT-*`, `UI-SHELL-*`, `UI-STATE-*`, `UI-EDIT-*`, `UI-MOB-*`, and `UI-A11Y-*` item passes a fresh browser check.
