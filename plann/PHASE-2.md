# Phase 2 - Composable Admin System, Mobile Editing, 3D, and Promotion

Status: Planned  
Depends on: **Phase 1A + 1B** accepted on one unchanged revision (per [`REVISION-2026-07-05.md`](REVISION-2026-07-05.md) Decision 4)  
Authority: [`START.md`](START.md) · [`PHASE-1.md`](PHASE-1.md) · [`docs/architecture/README.md`](../docs/architecture/README.md)

## Outcome

A globally competitive planner with full mobile editing, production-grade 3D continuity, advanced composable SVG families, immutable publication (including Supabase revisions per Phase 08), accessibility completion, performance hardening, and controlled promotion to shared routes.

**Promotion order (locked):** `/planner/open3d` (Phase 1) → `/planner/guest` → `/planner/canvas`. Guest and canvas remain unchanged until Phase 2 gates pass.

## 1. Lego-Like Admin Composition

- [ ] Add nested approved parts and reusable symbols.
- [ ] Enforce explicit parent/child compatibility.
- [ ] Add depth, child-count, part-count, path-count, byte, pixel, and render-time limits.
- [ ] Add drag-and-drop parts and nested Puck slots.
- [ ] Add geometry selection, resize, rotate, align, snap, and numeric editing.
- [ ] Add parameter ranges, steps, presets, labels, units, help, and customer-editability.
- [ ] Add action authoring for move, stretch, rotate, flip, array, replace, visibility, and snap.
- [ ] Add constraint authoring with conflict diagnostics.
- [ ] Add variants, value sets, and visibility states.
- [ ] Permit only restricted declarative formulas.
- [ ] Reject cycles, unresolved references, incompatible constraints, and unreachable variants.
- [ ] Add semantic style-token selection instead of arbitrary CSS.
- [ ] Add insertion points, anchors, clearance, collision, and orientation editing.
- [ ] Migrate dual descriptor models (`BlockDescriptor` + `SvgBlockDefinitionV1`) to single authority.

## 2. Admin Preview and Publishing

- [ ] Add light, dark, print, selected, and high-contrast previews.
- [ ] Add desktop and mobile planner simulation.
- [ ] Add thumbnail framing and exact generated-output preview.
- [ ] Use the production renderer for candidate previews.
- [ ] Add draft, review, published, deprecated, and archived states.
- [ ] Add role permissions for edit, approve, publish, rollback, archive, token editing, SVG editing, asset replacement, and migration.
- [ ] Add optimistic concurrency using revision IDs.
- [ ] Add immutable published revisions (Supabase — Phase 08 migration).
- [ ] Add atomic active-revision pointers.
- [ ] Add version comparison, clone, import, export, migration preview, and rollback.
- [ ] Preserve unknown and deprecated blocks as recoverable placeholders.
- [ ] Audit actor, timestamp, source, target, validation, and reason.
- [ ] Keep document undo separate from publication rollback.

## 3. Full Mobile Editing

- [ ] Open canvas-first.
- [ ] Use one Vaul drawer at a time.
- [ ] Add a compact bottom command bar.
- [ ] Expose current tool, undo/redo, catalogue, layers/properties, and 2D/3D.
- [ ] Restore focus after drawers and dialogs close.
- [ ] Respect safe areas and virtual-keyboard bounds.
- [ ] Define gesture precedence for pan, pinch, object drag, rotate, resize, drawer swipe, and browser navigation.
- [ ] Use a compact landscape layout rather than stretched portrait drawers.
- [ ] Provide every desktop core workflow through touch and numeric controls.
- [ ] Enforce 44x44 CSS-pixel touch targets.
- [ ] Verify room drawing, placement, selection, properties, floors, save, reload, undo/redo, and 2D/3D.

## 4. 3D Continuity

- [ ] Lazy-load the full 3D path after explicit activation.
- [ ] Keep 3D code absent from initial 2D loading.
- [ ] Preserve selection, floor, units, stable object identity, and camera intent across modes.
- [ ] Add orbit, pan, zoom, fit, standard views, reset, and selection focus.
- [ ] Synchronize scene tree, properties, 2D selection, and 3D selection.
- [ ] Add loading progress and asset fallback.
- [ ] Add unsupported-material handling.
- [ ] Add WebGL-loss recovery.
- [ ] Add reduced-quality mode.
- [ ] Pause or reduce rendering when hidden or backgrounded.

## 5. Layers, Catalogue, and Guidance

- [ ] Add layer hierarchy, rename, reorder, lock, visibility, and current-floor behavior.
- [ ] Prevent locked-object mutation through canvas, properties, keyboard, and commands.
- [ ] Add recent items, favorites, categories, filters, readiness, and retries.
- [ ] Add stale, offline, partial-asset, empty, and no-result recovery.
- [ ] Add task-based first-use guidance.
- [ ] Keep active-tool help concise and dismissible.
- [ ] Cancel stale requests.
- [ ] Prevent duplicate placement commands.
- [ ] Virtualize catalogue results only after profiling proves the need.

## 6. Accessibility

- [ ] Announce tool, command, selection, validation, save, and publication states.
- [ ] Provide a synchronized accessible object/layer representation of canvas content.
- [ ] Support non-pointer geometry editing through numeric controls.
- [ ] Define focus order: top bar → tools → canvas alternative → panels → status.
- [ ] Restore focus to invoking controls.
- [ ] Never use color as the only status indicator.
- [ ] Support reduced motion.
- [ ] Support forced colors.
- [ ] Support 200% zoom.
- [ ] Pass keyboard-only editing.
- [ ] Pass screen-reader property and admin editing.
- [ ] Support keyboard reordering in the admin composition system.

## 7. Security and Reliability

- [ ] Revalidate every composition server-side before publication.
- [ ] Reject executable SVG and unrestricted admin code.
- [ ] Namespace all SVG IDs by block version.
- [ ] Resolve assets through approved server IDs.
- [ ] Keep sanitization before optimization.
- [ ] Keep Sharp safety limits enabled.
- [ ] Run structural and pixel comparison after optimization.
- [ ] Preserve existing plans on their original block versions.
- [ ] Require explicit migrations to newer published versions.
- [ ] Recover corrupt preferences without changing documents.
- [ ] Confirm no duplicate canvas, builder, state, icon, or animation library enters planner bundles.

## 8. Promotion

Prerequisite: Phase 1A + 1B sign-off on one revision. Promote shell and command layer from `features/planner/open3d/` per [`MODULE-LAYOUT.md`](../docs/architecture/MODULE-LAYOUT.md).

- [ ] Accept Open3D Phase 1 (1A + 1B) on one unchanged revision.
- [ ] Promote the shared shell and command layer to `/planner/guest`.
- [ ] Verify guest restrictions and persistence boundaries.
- [ ] Verify onboarding and rollback.
- [ ] Promote to `/planner/canvas` only after authenticated save/reload and compatibility gates.
- [ ] Retain explicit Fabric fallback routes through stabilization.
- [ ] Compare screenshots, commands, saved documents, permissions, and bundle boundaries before each promotion.

## 9. Phase 2 Acceptance

- [ ] An administrator builds a configurable door, window, cabinet, and furniture family without code.
- [ ] Customers see only approved parameters.
- [ ] Customers cannot produce invalid geometry.
- [ ] Admin preview, planner 2D, thumbnail, print, and 3D identity match within documented tolerances.
- [ ] Publishing conflicts never overwrite newer revisions.
- [ ] Unknown block versions remain recoverable.
- [ ] Core workflows pass at 1440x900, 1024x768, 768x1024, 390x844, and mobile landscape.
- [ ] First usable 2D canvas is at most 2.5 seconds.
- [ ] Baseline 3D is interactive within 4 seconds after activation.
- [ ] Interaction targets 60fps and does not remain below 45fps.
- [ ] Axe reports no serious or critical violations.
- [ ] Manual keyboard and screen-reader workflows pass.
- [ ] Open3D, guest, and canvas preserve permissions and document compatibility.
- [ ] Full evidence is produced from one unchanged revision.
- [ ] No unexplained warning, retry, skip, timeout, browser error, or failed request remains.

## 10. Required Gates

- [ ] Full planner unit and integration suite.
- [ ] SVG security and malicious fixture suite.
- [ ] Constraint and invalid-combination suite.
- [ ] Migration and rollback suite.
- [ ] Admin permissions suite.
- [ ] Planner catalogue E2E.
- [ ] Mobile gesture and orientation E2E.
- [ ] 2D/3D identity E2E.
- [ ] Accessibility automation and manual review.
- [ ] Visual comparison.
- [ ] Bundle-boundary audit.
- [ ] Performance budgets.
- [ ] Production build.
- [ ] Promotion review.

## 11. Rollback

- Promotion remains route-scoped and reversible.
- Keep prior shared-shell exports and explicit Fabric fallback routes through stabilization.
- Roll back for document corruption, save/reload mismatch, engine identity drift, unsafe publication, unusable mobile editing, accessibility regression, or performance-budget failure.
- Rollback changes active revision pointers; it never rewrites history.
- Preserve all failed-run evidence.
