# Planner Global UI and SVG Master Plan

Status: Approved planning baseline  
**Revision:** [`REVISION-2026-07-05.md`](REVISION-2026-07-05.md) — SVG Option A, Phase 1A/1B split (locks conflicts with pre-2026-07-05 text)  
Execution model: Two phases (Phase 1 = 1A shell + 1B SVG path per revision)  
Pilot route: `/planner/open3d`  
Promotion routes: `/planner/guest`, then `/planner/canvas` (Phase 2 only)

**Architecture cross-refs:** [`docs/architecture/README.md`](../docs/architecture/README.md) · [`MODULE-LAYOUT.md`](../docs/architecture/MODULE-LAYOUT.md) · [`MODULE-UI-CONTRACT.md`](../docs/architecture/MODULE-UI-CONTRACT.md) · [`docs/Lockedfiles/INDEX.md`](../docs/Lockedfiles/INDEX.md)

## 1. Objective

Build a professional, canvas-first planner that matches the One&Only brand, supports full desktop and mobile editing, and lets administrators create safe configurable SVG product families from reusable parts.

The system must feel modular like Lego:

- Developers register safe capabilities.
- Administrators compose and configure approved parts.
- Customers edit only explicitly exposed parameters.
- Published artifacts are immutable, versioned, auditable, and reversible.

Fabric 7.4 remains the 2D engine. Three.js, React Three Fiber, and Drei remain the 3D stack. No package may duplicate or replace those responsibilities.

## 2. Non-Negotiable Rules

- Production planner code remains under `site/features/planner/`.
- Routes remain thin.
- Existing planner documents remain readable.
- Opening a document never silently migrates or overwrites it.
- No arbitrary JavaScript, CSS, React, remote markup, or executable SVG is accepted from administrators.
- Admin configuration covers every approved schema property, not unrestricted code.
- Static presentation belongs in CSS, not JSX.
- Raw colors, emoji controls, arbitrary spacing, static inline dimensions, inline z-index values, duplicated breakpoints, and magic transition values are prohibited.
- Runtime inline values are limited to canvas geometry, transforms, pointer coordinates, calculated dimensions, and dynamic asset data.
- All runtime style exceptions use typed adapters.
- Benchmark principles may be adopted; competitor visual identity, assets, wording, composition, and trade dress may not be copied.
- Failed validation blocks publication. The system never guesses around invalid geometry.

## 3. Global Benchmark Standard

### Figma

Adopt:

- Contextual properties.
- Clear assets/layers separation.
- Resizable and collapsible panels.
- Canvas-maximize mode.
- Temporary panel reveal after selection.

Reject:

- Copying its floating toolbar, visual styling, terminology, or exact layout.

### AutoCAD Web and Dynamic Blocks

Adopt:

- Persistent command state.
- Numeric input.
- Explicit commit and cancel.
- Grid, snap, layer visibility, and lock semantics.
- Separate parameters, actions, constraints, visibility states, and value sets.

Reject:

- Exposing full command-line complexity to ordinary customers.

### SketchUp Web

Adopt:

- Small primary toolset.
- Expandable secondary tools.
- Selected-tool guidance.
- Measurement input.
- Visible save state.

### Floorplanner and Planner 5D

Adopt:

- Rapid room, wall, and opening workflows.
- Catalogue-first placement.
- Beginner start paths.
- Metric and imperial support.
- Continuous 2D/3D identity.

### Sketchfab

Adopt:

- Focused 3D navigation.
- Selection and inspection.
- Camera presets.
- Progressive disclosure.
- Clear loading and recovery states.

## 4. Theme and CSS Contract

Create a planner semantic token layer mapped to the canonical One&Only theme:

- `--planner-surface-*`
- `--planner-text-*`
- `--planner-border-*`
- `--planner-control-*`
- `--planner-canvas-*`
- `--planner-selection-*`
- `--planner-focus-*`
- `--planner-motion-*`
- `--planner-z-*`
- `--planner-panel-*`
- `--planner-touch-*`

Requirements:

- CSS Modules own component presentation.
- Planner bundles own shared shell and responsive behavior.
- Z-index tiers, breakpoints, panel dimensions, touch targets, motion, focus rings, and safe-area offsets use named tokens.
- Three.js colors resolve through an engine-theme adapter.
- SVG styles use approved semantic tokens or compiled presentation attributes.
- A static audit rejects hardcoded planner presentation values.
- Reduced motion, forced colors, keyboard focus, print, selected, disabled, warning, and error states are mandatory.

## 5. Package Ownership

### Existing Runtime Packages

- `fabric`: 2D drawing, selection, transforms, snapping, placement, and serialization.
- `three`, `@react-three/fiber`, `@react-three/drei`: lazy 3D rendering, camera controls, helpers, and environment.
- `zustand`: workspace, view, and transient state.
- `zundo`: command-backed document mutations only.
- `react-resizable-panels`: desktop and tablet panel layout.
- `vaul`: mobile drawers.
- `@ark-ui/react`: menus, popovers, disclosures, segmented controls, and tooltips.
- `react-aria-components`: catalogue combobox, listbox, and keyboard collection behavior.
- `@phosphor-icons/react`: exclusive planner icon system.
- `framer-motion`: shell transitions and placement feedback, never canvas-object animation.
- `@tanstack/react-query`: server catalogue requests, caching, cancellation, retry, and stale state.
- `fuse.js`: client ranking of already-loaded catalogue records.
- `sonner`: transient operation outcomes.
- `zod`: command, preference, descriptor, import, and publishing validation.

### SVG and Admin Packages

Authority: **`PACKAGES.md` Option A** + [`REVISION-2026-07-05.md`](REVISION-2026-07-05.md). SVG.js is not part of Phase 1.

- `@puckeditor/core`: registered block composition, fields, nested slots, permissions, preview, and migrations (admin + portal only).
- `@flatten-js/core`: geometry validation, containment, intersections, and offsets (server pipeline).
- `polygon-clipping`: approved polygon boolean operations (server pipeline).
- `dompurify`: parsed SVG sanitization before optimization (server).
- `svgo`: locked server-only optimization.
- `@resvg/resvg-js`: canonical server SVG-to-PNG rendering.
- `sharp`: server thumbnail derivatives and metadata inspection.

**Deferred (not Phase 1):** `@svgdotjs/svg.js` and selection/resize plugins — visual DOM authoring only if a proven gap remains after Puck + schema fields; must not enter planner chunks. **On disk today:** `@svgdotjs/*` may still appear in `site/package.json` until import-graph cleanup removes them (per revision).

Admin compiler, sanitizer, resvg, and Sharp must never enter planner production chunks. Server pipeline code lives under `features/planner/open3d/catalog/svg/` and `features/planner/admin/svg-editor/` — see [`MODULE-LAYOUT.md`](../docs/architecture/MODULE-LAYOUT.md) § Data & descriptors.

### Explicitly Excluded

- No Paper.js, Konva, PixiJS, Two.js, or second general canvas engine.
- No GrapesJS, Craft.js, Builder.io SDK, or second page builder.
- No arbitrary expression engine.
- No generic schema-form package unless a proven gap remains after Puck custom fields.
- No browser-side Sharp, resvg, or SVGO in planner routes.

## 6. Core Data Contracts

### `BlockDefinition`

Developer-controlled capabilities:

- Stable type ID and schema version.
- Allowed children.
- Editable fields and defaults.
- Constraints and permissions.
- Renderer and preview.
- Migration and deprecation policy.

### `BlockInstance`

Administrator-configured values:

- Definition type and version.
- Parameter values.
- Child instances.
- Style-token selections.
- Variant and visibility state.

### `CompositionDocument`

Ordered Lego-like structure:

- Root composition.
- Explicit parent/child compatibility.
- Maximum depth and child limits.
- Draft revision and optimistic concurrency ID.

### `PublishedRevision`

Immutable production snapshot:

- Definition and schema versions.
- Compiler version.
- Artifact checksums.
- Validation report.
- Actor, timestamp, source revision, and reason.
- Atomic active-revision pointer.

### Planner Interfaces

- `PlannerCommand`: ID, payload, source, execute, undo, validation, merge policy.
- `PlannerToolState`: inactive, armed, drawing, transforming, committing, cancelled, failed.
- `PlannerPanelId`: catalogue, layers, properties, project, help.
- `PlannerPanelState`: closed, docked, overlay, drawer, temporarily revealed.
- `PlannerWorkspacePreferencesV1`: panel ratios, density, units, grid, snap, last view, and device tier.
- `PlannerPlacementPayload`: catalogue ID, block version, dimensions, anchor, rotation, floor, and interaction source.
- `PlannerSelection`: none, single, multi, room, wall, or opening.

## 7. Configurable SVG Block Model

Each `SvgBlockDefinition` supports:

- Identity, lifecycle, ownership, SKU, category, and tags.
- Parts: group, path, rectangle, circle, ellipse, line, polyline, polygon, arc, text, approved image reference, reusable symbol, and nested slot.
- Parameters: number, length, angle, tokenized color, enum, boolean, text, asset reference, and material reference.
- Constraints: minimum, maximum, step, aspect ratio, alignment, containment, dependency, visibility, and compatibility.
- Actions: move, resize, rotate, flip, stretch, array, variant replacement, visibility toggle, and snap.
- Variants and approved value sets.
- Semantic fill, stroke, opacity, line weight, pattern, and print treatment.
- Insertion points, wall/floor anchors, clearance zones, collision bounds, and orientation rules.
- ViewBox, physical dimensions, planner bounds, thumbnail framing, accessibility metadata, and checksums.

Only fields marked `customerEditable` reach the planner. Admin-only values never enter customer parameter payloads.

## 8. Canonical Pipeline

```text
Puck admin composition (fields + preview)
  -> Zod validation and normalization
  -> constraint and geometry validation
  -> deterministic server SVG compilation (Option A)
  -> parsed allowlist and DOMPurify sanitization
  -> locked SVGO optimization
  -> structural and visual comparison
  -> resvg canonical PNG render
  -> Sharp thumbnail derivatives
  -> disk descriptor persist + R2 artifact metadata
  -> (Phase 08) immutable Supabase revision pointer
  -> Fabric planner adapter and Three asset adapter
```

### Boundary Rules

- Admin browser: Puck, field controls, preview, and local validation only — no server compiler in client bundles.
- Server: authoritative validation, compiler, sanitization, SVGO, resvg, Sharp, checksums, persistence, and publication.
- Planner browser: compiled SVG plus minimal validated customer parameter schema (`plannerSvgAdapter` projection).
- Phase 1B: disk `block-descriptors/` + R2 thumbs; Supabase revision table follows Phase 08 migration (`PLAN-FAIL-0409`).
- Dual compile (`generate-svg.mjs` exec + `svgCompiler.server.ts` in-process) **must unify in 1B** — single module authority; script becomes thin CLI.
- Storage does not replace sanitization.
- Node-only packages never pass through client-reachable modules.
- Runtime objects from Puck, Fabric, or Three are never persisted.
- Identical input produces byte-identical canonical SVG.

## 9. Publishing and Governance

Workflow:

```text
Draft -> Validate -> Preview -> Approve -> Publish
```

- Preview uses the exact candidate revision and production renderer.
- Server validation runs again at publication.
- Publishing creates an immutable revision and atomically updates the active pointer.
- Rollback changes only the active pointer.
- Undo/redo is separate from revision rollback.
- Optimistic concurrency prevents silent overwrites.
- Role permissions cover create, edit, reorder, duplicate, delete, token editing, SVG editing, approve, publish, archive, and rollback.
- Every publish and rollback records actor, timestamp, source, target, validation result, and reason.
- Unknown and deprecated blocks render as recoverable placeholders.
- Existing plans remain pinned to their referenced published block version until explicitly migrated.

## 10. Security Limits

- Permit only approved SVG elements and attributes.
- Reject scripts, event handlers, `foreignObject`, external stylesheets, external fonts, unsafe URLs, executable data, entities, and unbounded filters.
- Rewrite IDs with a block-version namespace.
- Resolve assets through approved server-side asset IDs.
- Restrict SVG CSS to generated attributes and approved custom properties.
- Cap descriptor depth, child count, part count, path commands, SVG bytes, raster dimensions, output pixels, and render time.
- Keep Sharp input and memory safety limits enabled.
- Treat SVGO as optimization, never sanitization.
- Preserve viewBox, semantic IDs, accessibility metadata, and reusable groups.
- Require structural and visual comparison before publication.

## 11. Global Acceptance Budgets

- 100% of published blocks validate against their registered schema.
- 100% of published revisions are immutable and rollback-capable.
- 100% of imported SVGs pass sanitization and structural validation.
- Zero executable SVG content or unrestricted admin code.
- Preview and published output match structurally and visually.
- Identical descriptors produce byte-identical canonical SVG.
- Publishing conflicts never overwrite newer revisions.
- Unknown block versions remain recoverable.
- Initial 2D loading excludes Puck, admin compiler, resvg, Sharp, SVGO, and 3D code.
- Desktop canvas remains at least 60% of workspace width at 1440px with both panels open.
- First usable 2D canvas is at most 2.5 seconds on agreed baseline hardware.
- Baseline 3D scene becomes interactive within 4 seconds after activation.
- Tool feedback is at most 100ms.
- Panel response is at most 150ms.
- Drag feedback targets 60fps and must not remain below 45fps.
- No unexplained console error, warning, failed request, keyboard trap, clipped primary control, or page-level scroll.

## 12. Execution

Read [`REVISION-2026-07-05.md`](REVISION-2026-07-05.md) first. Execute **Phase 1A** then **Phase 1B** in [`PHASE-1.md`](PHASE-1.md), pass each track's gates, then execute [`PHASE-2.md`](PHASE-2.md).

Place new open3d code per [`MODULE-LAYOUT.md`](../docs/architecture/MODULE-LAYOUT.md). New UI modules per [`MODULE-UI-CONTRACT.md`](../docs/architecture/MODULE-UI-CONTRACT.md). Domain snapshots: [`docs/Lockedfiles/INDEX.md`](../docs/Lockedfiles/INDEX.md).

Update [`HANDOVER.md`](HANDOVER.md) after every completed checklist group. Do not mark work verified without evidence from one unchanged revision under `results/<module>/<phase>/<cmd>/`.
