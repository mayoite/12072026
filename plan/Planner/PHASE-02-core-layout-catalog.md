# Planner Phase 2 — core layout, catalog, and continuity

## Outcome

The customer creates an accurate layout with public Oando inventory.

The same project survives 2D, 3D, save, reload, devices, and input methods.

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
- Support category, search, filters, and product details.
- Show availability honestly.
- Preserve product, family, version, option, and commercial identity.
- Use published SVG as the primary 2D symbol.
- Use `Block2D` only while loading or when SVG is unavailable.
- Keep missing assets from breaking the layout.
- Keep an isolated fixture for work before live integration.

## One project document

- Use one normalized document for 2D, 3D, save, reload, import, export, and BOQ.
- Preserve stable identifiers, position, rotation, dimensions, and options.
- Prevent view actions from mutating project data or document history.
- Keep guest and member storage labels truthful.
- Show saving, saved, failed, offline, and retry states distinctly.
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

- Keep the canvas as the dominant workspace.
- Dock and collapse panels without hiding essential work.
- Prevent clipping and unexpected page scrollbars.
- Keep primary actions reachable at supported widths.
- Support keyboard completion without dragging.
- Meet WCAG 2.2 AA for the primary journey.
- Apply light and dark themes across primary surfaces.
- Remove unexplained console, request, hydration, and accessibility errors.

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
- Desktop, mobile, keyboard, theme, and accessibility browser journeys.
- Planner catalog search, availability, and retirement checks.

## Done when

- A customer creates and edits an accurate layout.
- Public inventory keeps its identity from discovery through placement.
- One project remains consistent across views and persistence.
- Primary desktop, mobile, and keyboard journeys pass.
