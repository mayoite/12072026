UI Expert Planner Overhaul Brief
Summary
A UI expert will create exactly four Markdown files under D:\oandO04072026\plann\:
START.md
PHASE-1.md
PHASE-2.md
HANDOVER.md
No application code, CSS, dependencies, lockfiles, existing plans, or configuration will be changed during documentation creation.
A. START.md
Required Content

Professional CAD direction using the One&Only primary brand theme.

Canvas-first desktop, tablet, and full mobile editing.

Open3D pilot first; guest/canvas promotion only after acceptance.

Fabric remains the 2D engine.

Three/r3f/drei remain the lazy 3D stack.

No document-schema change unless separately approved.

No competitor visual copying.
Global Benchmark Translation

Figma: contextual properties, collapsible UI, layers/assets separation, canvas-maximize mode.

AutoCAD Web: persistent command state, numeric entry, explicit commit/cancel, grid/snap/layer controls.

SketchUp Web: compact primary tools, expandable secondary tools, measurements, tool guidance.

Floorplanner: fast room/wall/opening construction and immediate object placement.

Planner 5D: catalogue-first onboarding and continuous 2D/3D editing.

Sketchfab: focused 3D navigation, inspection, annotations, selection, and camera presets.

Record adopted principles and rejected patterns.

Apply anti-copy rules to geometry, composition, palettes, wording, and icons.
CSS Contract

Static presentation belongs in CSS, never JSX.

Create planner semantic tokens mapped to canonical One&Only tokens.

Prohibit raw colors, arbitrary spacing, static inline dimensions, inline z-index, emoji icons, duplicate breakpoints, and magic transition values.

CSS Modules own component styles.

Planner bundles own shared shell and responsive behavior.

Runtime inline values are limited to canvas geometry, transforms, pointer coordinates, calculated dimensions, and dynamic assets.

Runtime exceptions use typed adapters.

Three.js colors resolve through a theme adapter.

Add automated hardcoding audits.
Package Ownership

zustand: workspace and transient state.

zundo: command-backed document mutations only.

react-resizable-panels: desktop/tablet panel layout.

vaul: mobile drawers.

@ark-ui/react: menus, popovers, disclosures, segmented controls, tooltips.

react-aria-components: searchable inventory collections and keyboard navigation.

@phosphor-icons/react: exclusive planner icon system.

framer-motion: shell and placement feedback only.

@tanstack/react-query: catalog requests, caching, cancellation, retries, and stale state.

fuse.js: client-side ranking of loaded catalog records.

sonner: transient operation outcomes.

zod: command, preference, import, and descriptor validation.

fabric: 2D drawing, selection, transforms, snapping, serialization.

three, r3f, drei: lazy 3D renderer and controls.

Keep Puck and SVG-generation packages upstream in admin/catalog tooling.

Exclude XYFlow, GSAP, Lucide, Swiper, and duplicate primitive packages unless separately justified.
Interfaces

PlannerCommand: ID, payload, source, execute, undo, validation, merge policy.

PlannerToolState: inactive, armed, drawing, transforming, committing, cancelled, failed.

PlannerPanelId: catalog, layers, properties, project, help.

PlannerPanelState: closed, docked, overlay, drawer, temporarily revealed.

PlannerWorkspacePreferencesV1: layout, density, units, grid, snap, last view, device tier.

PlannerPlacementPayload: catalog ID, dimensions, anchor, rotation, floor, input source.

PlannerSelection: none, single, multi, room, wall, opening.
B. PHASE-1.md
Outcome
A releasable Open3D desktop/tablet workspace with corrected routing, tokenized theme, command architecture, catalog, properties, and complete baseline 2D editing.
Checklist

Capture desktop/tablet/mobile baseline screenshots, DOM state, console state, and performance.

Inventory raw values, inline styles, packages, controls, responsive rules, and route chrome.

Correct /planner/open3d workspace classification.

Remove editor header/footer/chatbot/cookie obstruction.

Enforce 100dvh, safe areas, isolated panel scrolling, and no page overflow.

Implement semantic planner tokens and hardcoding audits.

Implement typed command dispatch before replacing mutation controls.

Restrict undo history to successful document commands.

Add validated, recoverable workspace preferences.

Redesign the top bar around project, floor, units, view, history, save state, and one save action.

Place import/export/preferences in structured menus.

Separate catalog and layers.

Make properties selection-contextual.

Add resizable, collapsible, restorable panels and canvas-maximize mode.

Implement select, pan, room, wall, opening, dimension, and placement tool states.

Escape cancels; Enter commits; Space temporarily pans.

Add active-tool guidance, numeric input, grid, snap, scale, zoom, fit, bounds, and first-use actions.

React Query owns catalog lifecycle.

Fuse owns local ranking.

React Aria owns accessible search/listbox behavior.

Click and drag placement use the same command.

Properties support units, validation, commit, cancel, reset, and multi-selection.
Acceptance

Draw room → add opening → place item → edit dimensions → undo/redo → save → reload.

Complete equivalent keyboard workflow through layers and numeric controls.

Existing documents remain compatible.

Static presentation passes token and hardcoding audits.

Canvas remains at least 60% wide at 1440px with both panels open.

Tool feedback ≤100ms; panel response ≤150ms.

No unexplained console errors, warnings, failed requests, clipping, or scroll traps.

Evidence captured under the required results/<module>/<phase>/<cmd>/ structure.

Pass lint, typecheck, planner tests, planner E2E, accessibility, route-chrome tests, and production build.

Preserve the previous Open3D route behind a rollback boundary until acceptance.
C. PHASE-2.md
Outcome
Full mobile editing, production-ready 3D continuity, advanced layers/catalog workflows, accessibility completion, performance hardening, and controlled shared-route promotion.
Checklist

Mobile opens canvas-first.

Use one Vaul drawer at a time for catalog, layers, or properties.

Add a compact bottom command bar.

Support room drawing, placement, selection, properties, floor switching, save, undo/redo, and 2D/3D on mobile.

Define gesture precedence for canvas pan, pinch zoom, object drag, resize, drawer swipe, and browser gestures.

Handle virtual keyboard, orientation, landscape layout, safe areas, focus trap, and focus restoration.

Enforce 44×44 minimum touch targets.

Lazy-load all 3D code after explicit activation.

Preserve floor, selection, units, object identity, and camera intent across modes.

Add orbit, pan, zoom, fit, standard views, reset, and selected-object focus.

Handle loading, missing assets, unsupported materials, WebGL loss, and reduced-quality fallback.

Synchronize layers, canvas, properties, and 3D selection through stable IDs.

Add layer hierarchy, rename, reorder, visibility, locking, and current-floor behavior.

Prevent locked-object mutation through every command surface.

Add recent items, favorites, filters, readiness, stale, offline, empty, and retry catalog states.

Add live announcements for tool, command, save, selection, and validation changes.

Provide an accessible object/layer alternative to pointer-only canvas interaction.

Test reduced motion, forced colors, 200% zoom, keyboard, and screen-reader property editing.

Cancel stale catalog requests and prevent duplicate placement commands.

Pause or reduce 3D rendering while hidden.

Verify no duplicate state, icon, animation, or primitive libraries enter planner bundles.

Promote accepted shared components to /planner/guest.

Promote to /planner/canvas only after authenticated save/reload and compatibility gates.

Retain explicit Fabric rollback routes through stabilization.
Acceptance

Pass at 1440×900, 1024×768, 768×1024, 390×844, and mobile landscape.

First usable 2D canvas ≤2.5 seconds on agreed baseline hardware.

3D code absent from initial 2D loading.

Baseline 3D scene interactive ≤4 seconds.

Target 60fps; no sustained interaction below 45fps.

Axe reports no serious or critical violations.

Manual keyboard and screen-reader workflows pass.

Open3D, guest, and canvas preserve route permissions and document behavior.

Full evidence comes from one unchanged revision.

Roll back for document corruption, save mismatch, engine identity drift, unusable mobile editing, accessibility regression, or budget failure.
D. HANDOVER.md
Keep this operational and short:
# Planner Overhaul Handover

Status:
Revision:
Active phase:
Active route:
Rollback path:

## Completed