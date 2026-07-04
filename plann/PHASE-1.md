# Phase 1 - Open3D Foundation and SVG Production Path

Status: Planned
Depends on: `START.md`
Promotion target: `/planner/open3d` only

## Outcome

A releasable Open3D desktop/tablet workspace with correct route containment, semantic CSS, professional CAD interaction, complete baseline 2D editing, and a secure end-to-end SVG block pipeline.

## 1. Baseline and Ownership

- [ ] Capture 1440x900, 1024x768, 768x1024, and 390x844 screenshots.
- [ ] Capture DOM identity, console output, failed requests, and framework overlays.
- [ ] Record current interaction and bundle performance.
- [ ] Inventory planner controls, packages, tokens, inline styles, raw values, breakpoints, and route chrome.
- [ ] Separate canonical document, view, workspace preference, engine, and transient state ownership.
- [ ] Record the exact starting revision and dirty-worktree state.

## 2. Route and Shell

- [x] Classify `/planner/open3d` as a workspace route.
- [x] Hide marketing header, footer, chatbot, and obstructive cookie presentation.
- [x] Use one `100dvh` workspace with safe-area support.
- [x] Prevent page-level horizontal and vertical scrolling.
- [x] Isolate scrolling inside panels; drawer isolation remains a Phase 2 concern.
- [ ] Preserve authentication, CSRF, service worker, and error boundaries.
- [ ] Verify direct navigation and refresh for guest and authenticated users.

## 3. Theme and CSS

- [x] Create planner semantic tokens mapped to One&Only tokens.
- [x] Define named panel, motion, z-index, touch, focus, and safe-area tokens.
- [ ] Move static presentation from JSX into CSS Modules.
- [ ] Remove emoji controls and use Phosphor icons.
- [ ] Remove raw visual values and duplicated responsive rules.
- [ ] Add compact and touch density modes.
- [ ] Add reduced-motion, forced-colors, print, focus, selected, disabled, warning, and error states.
- [ ] Add a static planner hardcoding audit.
- [ ] Add a Three theme adapter for semantic colors.

## 4. Command and State Foundation

- [ ] Define `PlannerCommand`.
- [x] Define `PlannerToolState`.
- [x] Define semantic panel contracts. Selection contract remains open.
- [ ] Route all document mutations through typed commands.
- [ ] Restrict zundo history to successful document commands.
- [ ] Exclude panels, search, loading, camera, and notifications from document undo.
- [x] Add preference schema versioning and corrupt-state recovery.
- [x] Preserve document data when preferences fail validation.

## 5. Professional Workspace

- [ ] Top bar contains project identity, save state, floor, units, 2D/3D, undo/redo, and one save action.
- [ ] Import, export, and preferences use structured menus.
- [ ] Separate catalogue and layers.
- [ ] Make properties contextual to selection.
- [ ] Add resizable and collapsible desktop panels.
- [ ] Persist valid panel ratios as workspace preferences.
- [ ] Add canvas-maximize and exact restore.
- [ ] Maintain at least 60% canvas width at 1440px.

## 6. Tool and Canvas Behavior

- [ ] Implement select, pan, room, wall, opening, dimension, and placement states.
- [ ] `Escape` cancels uncommitted work.
- [ ] `Enter` commits valid numeric or drawing input.
- [ ] `Space` temporarily pans without losing the armed tool.
- [ ] Display active tool, shortcut, modifiers, and measurement input.
- [ ] Add grid, origin, scale, zoom, fit, snap state, and drawing bounds.
- [ ] Add first-use actions: draw room, start from template, import floorplan.
- [ ] Explain invalid operations without discarding recoverable work.
- [ ] Verify deterministic room, wall, opening, selection, transform, delete, undo, redo, save, and reload.

## 7. Catalogue and Properties

- [ ] React Query owns remote catalogue lifecycle.
- [ ] Fuse owns local ranking after server filtering.
- [ ] React Aria owns accessible search and collection behavior.
- [ ] Click and drag placement produce one validated `PlannerPlacementPayload`.
- [ ] Add loading, skeleton, empty, stale, offline, error, and retry states.
- [ ] Group properties into transform, dimensions, placement, appearance, metadata, and actions.
- [ ] Support unit-aware numeric input, commit, cancel, reset, and validation.
- [ ] Multi-selection exposes only valid shared operations.
- [ ] Locked items reject mutations through every command surface.

## 8. SVG Block Foundation

- [ ] Add approved SVG.js packages to admin dependencies after license and version review.
- [ ] Add DOMPurify as a direct dependency.
- [ ] Define `SvgBlockDefinitionV1`.
- [ ] Define part, parameter, action, constraint, variant, style, mounting, and lifecycle schemas.
- [ ] Define `BlockDefinition`, `BlockInstance`, `CompositionDocument`, and `PublishedRevision`.
- [ ] Create a Zod metadata registry.
- [ ] Generate Puck field definitions from approved Zod metadata.
- [ ] Keep Puck and SVG.js admin-only.
- [ ] Establish explicit browser, server, and planner package boundaries.

## 9. Deterministic SVG Pipeline

- [ ] Build deterministic descriptor normalization.
- [ ] Build geometry and constraint validation.
- [ ] Build deterministic SVG compilation.
- [ ] Add parsed element and attribute allowlists.
- [ ] Sanitize with DOMPurify before SVGO.
- [ ] Lock the SVGO plugin configuration.
- [ ] Preserve viewBox, semantic IDs, accessibility metadata, and reusable groups.
- [ ] Generate canonical PNG with resvg.
- [ ] Generate thumbnail derivatives with Sharp.
- [ ] Generate checksums and typed diagnostics.
- [ ] Store descriptors, validation reports, revisions, and artifact references in Supabase.
- [ ] Prove Node-only packages are absent from client bundles.

## 10. Reference Blocks

Prove the full path with:

- [ ] One fixed block.
- [ ] One configurable door or window.
- [ ] One parametric cabinet or furniture family.
- [ ] Admin draft and preview.
- [ ] Validation failure and recovery.
- [ ] Publication and immutable revision.
- [ ] Planner 2D placement.
- [ ] Thumbnail output.
- [ ] Existing-version reload.

## 11. Phase 1 Acceptance

- [ ] Complete: draw room -> add opening -> place item -> edit dimensions -> undo/redo -> save -> reload.
- [ ] Complete keyboard equivalent through layers, commands, and numeric controls.
- [ ] Existing documents remain compatible.
- [ ] All static presentation passes the hardcoding audit.
- [ ] No unexpected console errors, warnings, failed requests, or missing assets.
- [ ] Identical SVG descriptors produce byte-identical canonical SVG.
- [ ] Malicious SVG fixtures fail before persistence or rendering.
- [ ] Preview, SVG, PNG, and planner output match within documented tolerances.
- [ ] Published revisions are immutable and rollback-capable.
- [ ] SVG authoring and native rendering packages are absent from planner chunks.
- [ ] Evidence is captured under `results/<module>/<phase>/<cmd>/`.
- [ ] Warnings, retries, skips, and expected diagnostics are classified.

## 12. Required Gates

- [ ] Planner style audit.
- [ ] Lint.
- [ ] Typecheck.
- [ ] Targeted planner unit and integration tests.
- [ ] SVG security fixtures.
- [ ] Determinism and checksum tests.
- [ ] Planner catalogue E2E.
- [ ] Accessibility tests.
- [ ] Route chrome/navigation E2E.
- [ ] Production build.
- [ ] Browser validation at all baseline viewports.

## 13. Rollback

- Preserve the previous Open3D route behind a route-level rollback boundary.
- Do not promote shared changes to guest or canvas before Phase 1 acceptance.
- Roll back for document incompatibility, geometry regression, placement failure, non-deterministic undo, unsafe SVG acceptance, or route containment failure.
- Preserve all failure evidence.
