# Planner Benchmark: Inspiration And Gaps

Date reviewed: 2026-07-03

## Scope and method

This is a desk benchmark of current public product/help material, compared with `QUALITY-GATES.md` and phases `03a`, `05`, and `06`. It does not reproduce proprietary layouts or claim behavior that the cited public sources do not document.

**Observed facts** below are source-backed product behavior or explicit plan content. **Recommendations** are proposed OOFPLWeb decisions; they are not claims about competitors.

Products sampled:

- Floorplanner: large catalog, favorites, guided starting tools, 2D/3D rendering.
- Planner 5D: beginner workflow, templates, drag/drop catalog, 2D/3D transition and versions.
- RoomSketcher: measured drawing, catalog organization, one-click 2D-to-3D continuity, cloud projects and presentation.
- magicplan: field-to-plan workflow, project/file organization, explicit export lifecycle and broad interchange formats.
- SketchUp for Web: command/shortcut discoverability in a mature spatial editor.

## What the market makes clear

### 1. The editor should teach a short, visible workflow

**Observed facts**

- Planner 5D presents a simple sequence: create the plan, add openings/furniture, finish and export; it supports templates or blank starts and drag/drop placement. It also describes saving versions to compare alternatives. [Planner 5D 2D workflow](https://planner5d.com/use/2d-floor-plan), [Planner 5D room planner](https://planner5d.com/user/use/room-planner-tool)
- RoomSketcher similarly teaches project creation, measured wall drawing, snapping openings, then furnishing; it offers templates, tracing, AI conversion and scratch starts as distinct entry paths. [RoomSketcher drawing guide](https://www.roomsketcher.com/features/draw-floor-plans/), [RoomSketcher floor-plan entry paths](https://www.roomsketcher.com/Floor-plans/)
- Floorplanner documents a Room Wizard and one-click Magic Layout as accelerators, while keeping manual editing available. [Floorplanner enterprise features](https://floorplanner.com/enterprise)

**Plan comparison**

The plan has workflow test sequences and a help action, but no defined first-run experience, progressive teaching contract, template decision, sample project, or contextual empty states. ΓÇ£First screen is an actual editorΓÇ¥ prevents a placeholder, but does not ensure a novice knows the next action.

**Recommendation ΓÇö P0**

Define a first-run layer that never blocks expert use:

1. Start choices: blank, room template, import reference, RoomPlan, reopen draft.
2. A three-step contextual checklist: draw shell ΓåÆ add openings ΓåÆ place products.
3. Empty-canvas prompts anchored to real commands, dismissed permanently after use.
4. A replayable 60ΓÇô90 second guided tour and a sample project.
5. Instrument time-to-first-room, time-to-first-placement, abandonment step, undo after guidance, and tour dismissal.

Add UI, keyboard, persistence and reduced-motion tests for every onboarding state.

### 2. Preserve one model while changing views

**Observed facts**

- RoomSketcher says a plan is created once and converted to 3D with layout, measurements, furniture and materials carried over; edits update both representations. [RoomSketcher 2D/3D continuity](https://www.roomsketcher.com/features/2d-floor-plans/), [RoomSketcher product overview](https://www.roomsketcher.com/)
- Planner 5D describes switching from 2D to 3D in a few clicks to inspect spacing, flow and furniture, with camera control in 3D. [Planner 5D 2D floor planner](https://planner5d.com/use/2d-floor-plan)
- magicplan exposes 2D, 3D, 360 and elevation as explicit project views, with a separate floor selector. [magicplan cloud project navigation](https://help.magicplan.app/magicplan-cloud-mini-series-projects)

**Plan comparison**

Phase 06 correctly requires lazy 3D, and the quality gates test 2D ΓåÆ 3D ΓåÆ 2D without loss. The missing contract is what remains selected, what camera/view state is remembered, which edits are allowed in 3D, how loading/error states behave, and whether 2D and 3D may be compared.

**Recommendation ΓÇö P0**

Specify a `ViewState` contract separate from canonical document state:

- preserve floor, selection and visibility across view changes;
- remember independent 2D camera and 3D camera per floor;
- show explicit 3D loading progress, cancel, retry and missing-model fallbacks;
- define whether 3D is inspect-only or editable command by command;
- offer split comparison only after single-view performance is proven;
- never silently remove items from 3DΓÇömark fallback geometry and explain it.

Measure first 3D activation, warm revisit, frame responsiveness, memory recovery after exit and state equivalence after round-trip.

### 3. Catalog scale requires task-oriented retrieval, not only taxonomy

**Observed facts**

- Floorplanner advertises more than 260,000 models; its enterprise material describes room-type and furniture-type categories, reusable room styles and favorite items. [Floorplanner catalog](https://floorplanner.com/), [Floorplanner favorites and categories](https://floorplanner.com/enterprise)
- Planner 5D describes an 8,000+ catalog, drag/drop placement, swapping items, finishes and styles. [Planner 5D catalog workflow](https://planner5d.com/user/use/room-planner-tool)
- RoomSketcher describes browsing furniture by room type or search, drag/drop placement, branded products, and resize/rotate/duplicate operations. It also includes technical symbols such as electrical and evacuation items. [RoomSketcher furnishing workflow](https://www.roomsketcher.com/features/draw-floor-plans/), [RoomSketcher symbol library](https://www.roomsketcher.com/Floor-plans/)

**Plan comparison**

Phase 03a is strong on taxonomy, synonyms, filters, favorites, recent/frequent items, collections, density and virtualization. It does not define search ranking, zero-result recovery, comparable-item behavior, compatibility filters, product variants, recently used configuration, or the information hierarchy of a catalog card.

**Recommendation ΓÇö P0**

Add a catalog interaction specification:

- ranking order and deterministic tie-breaking;
- typo tolerance, synonym ownership, query highlighting and ΓÇ£did you meanΓÇ¥;
- zero-result recovery that relaxes filters visibly;
- card information tiers: symbol/image, name, key dimensions, availability/status, variant cue;
- quick filters for room/use, footprint, mount type and asset readiness;
- variant selection without duplicating indistinguishable search results;
- ΓÇ£replace selectedΓÇ¥ that preserves position/rotation when compatible;
- saved product + configuration, not product ID alone, in recents/favorites;
- compare at most a few products by dimensions and metadata, without turning the planner into a storefront.

Test ranking relevance fixtures in addition to response speed. A fast search with poor results is still a failed UX.

### 4. Docking needs a behavioral grammar and safe defaults

**Observed facts**

- The sampled floor-planner marketing/help sources consistently show focused canvas-plus-side-panel workflows, but do not publicly substantiate fully arbitrary desktop-style docking.
- SketchUp for Web makes shortcuts discoverable both in toolbar hover help and command search. [SketchUp for Web shortcuts](https://help.sketchup.com/en/sketchup-web-shortcuts)

**Plan comparison**

The plan thoroughly lists dock, undock, move, resize, collapse, restore, clamp, persistence and reset tests. It does not define allowed docking zones, snap thresholds, minimum canvas area, panel precedence, layout presets, focus order after movement, or how tablet/small screens differ. Unlimited movability could increase overlap and recovery cost.

**Recommendation ΓÇö P0**

Define a constrained layout grammar before implementation:

- desktop: left/right rails, one bottom inspector zone, optional floating utility panels;
- tablet: one active edge sheet plus compact command bar;
- small viewport: modal sheets, not miniature floating windows;
- minimum visible canvas and maximum panel footprint;
- visible dock preview, keyboard move/dock commands and announced position;
- focus returns to the invoker after close/collapse;
- named presets: Default, Catalog Focus, Drawing Focus, Review/Export;
- document-independent layout persistence with schema versioning and a safe-mode reset query/action.

Test task completion with the default layout first. Movability is customization, not a substitute for a good default hierarchy.

### 5. Commands need one discoverable system

**Observed facts**

- SketchUp exposes shortcut assignments through hover tooltips and Search, reducing memorization cost. [SketchUp shortcut discovery](https://help.sketchup.com/en/sketchup-web-shortcuts)

**Plan comparison**

Phase 05 mentions a command palette source component, keyboard shortcuts and help, while quality gates cover keyboard reachability. It does not explicitly require every command to share IDs, labels, shortcuts, enabled state and help text across menus, toolbars, context menus and command search.

**Recommendation ΓÇö P1**

Create a typed command registry used by every command surface. Each command should declare ID, localized label, icon, shortcut, scope, enabled/disabled reason, analytics name and action dispatch. Tooltips should show the shortcut; command search should expose disabled reasons; user-remappable shortcuts can wait, but collision tests cannot.

### 6. Export is a lifecycle, not a menu click

**Observed facts**

- magicplan lists PDF, JPG, PNG, SVG, CSV, DXF, OBJ and USDZ in its plan offering. [magicplan Sketch plan](https://help.magicplan.app/sketch-plan)
- Its export workflow exposes per-format settings, generation, preview and a project Files repository. Existing exports can be updated; versioning can retain old output rather than overwrite it. It explicitly warns that exported PDFs do not auto-update with later project edits. [magicplan export lifecycle](https://help.magicplan.app/export-your-projects)
- magicplanΓÇÖs 3D export documents format-specific content limits and creates separate files for multiple floors. [magicplan 3D export](https://help.magicplan.app/create-3d-export)
- RoomSketcher supports branded/letterhead output and cloud project history. [RoomSketcher 2D output](https://www.roomsketcher.com/features/2d-floor-plans/)

**Plan comparison**

Phase 06 and quality gates are strong on format correctness, scale, structure and unsupported DWG wording. They do not specify asynchronous generation UX, settings presets, stale-output status, cancellation/retry, multi-floor packaging, export history/versioning, or the distinction between share view and editable source.

**Recommendation ΓÇö P0**

Define an export job model with:

- format-specific settings and reusable presets;
- preflight warnings for missing assets, unsupported content and sheet scale;
- progress, cancel, retry and failure detail without blocking editing;
- preview before download where practical;
- provenance: document revision, units, floor scope, timestamp and generator version;
- explicit ΓÇ£out of dateΓÇ¥ status after document changes;
- predictable multi-floor naming/ZIP rules;
- export history retention policy and replacement/version choice;
- separate ΓÇ£share read-only viewΓÇ¥ from file export and source-document transfer.

Do not add more formats until the planned JSON/SVG/PNG/PDF/DXF set passes round-trip/scale gates.

### 7. Persistence should include recovery and user-visible save truth

**Observed facts**

- Floorplanner states that old projects remain accessible in an account. [Floorplanner persistence](https://floorplanner.com/)
- RoomSketcher describes a cloud archive and cross-device syncing; its app also supports offline work. [RoomSketcher cloud projects](https://www.roomsketcher.com/features/2d-floor-plans/), [RoomSketcher drawing guide](https://www.roomsketcher.com/features/draw-floor-plans/)
- Planner 5D describes saving versions for comparison. [Planner 5D room workflow](https://planner5d.com/user/use/room-planner-tool)

**Plan comparison**

The broader plan covers drafts, cloud persistence, claim flow, corruption and migrations. Phase 05 mentions save status, but the inspected documents do not define save-state vocabulary, conflict UX, recoverable checkpoints, version browsing, or what happens when a guest exceeds local storage.

**Recommendation ΓÇö P0**

Specify visible states: `Unsaved`, `Saving`, `Saved locally`, `Saved to cloud`, `Offline`, `Conflict`, `Save failed`. Add bounded local recovery checkpoints, restore preview, conflict-safe duplicate, storage-pressure handling and a lightweight named-version feature. Never show ΓÇ£SavedΓÇ¥ without naming the destination in guest/offline contexts.

### 8. Accessibility and performance require product budgets, not only coverage

**Observed facts**

- The public benchmark sources make strong ease-of-use claims but provide little verifiable detail on WCAG conformance or keyboard-complete canvas editing. This absence is not evidence of accessibility.
- OOFPLWebΓÇÖs quality gates already require keyboard reachability, semantic state, focus management, AA contrast, scans, manual keyboard flow, large-catalog datasets, lazy 3D and leak checks.

**Plan comparison**

Coverage is broad, but the documents defer actual performance targets and do not define an accessible non-canvas representation for plan structure.

**Recommendation ΓÇö P1**

Before implementation, record device/network tiers and budgets for:

- editor interactive time and default-route JavaScript;
- pointer-to-visual latency during pan/drag;
- catalog search/filter latency at p50/p95;
- first and warm 3D activation;
- memory ceiling/trend for stress fixtures;
- export start acknowledgement and progress freshness.

Add an accessible project tree/list for floors, rooms and placed items with select, rename, hide/lock, reorder where meaningful, and property editing. Canvas keyboard actions should announce object, coordinates/dimensions and result through restrained live regions.

## Visual hierarchy and symbol-system guidance

**Observed facts**

- RoomSketcher distinguishes drawing tools, the canvas and a contextual properties panel in its published interface examples, and carries furniture/measurements into presentation output. [RoomSketcher overview](https://www.roomsketcher.com/)
- The plan already separates symbol geometry from theme, requires deterministic viewBox/scale, fallbacks, sanitization and a fixture gallery.

**Recommendation ΓÇö P1**

Keep four visual layers consistent:

1. document geometry;
2. selection/edit affordances;
3. guides, snapping and measurements;
4. application chrome.

Only layer 1 and explicitly selected annotations export. Establish symbol families by semantic roleΓÇönot individual product stylingΓÇöand test them at minimum on-canvas size, selected, rotated, print monochrome and high contrast. Use product imagery in catalog cards, but a stable simplified footprint on the plan. Provide a legend for technical symbols in export.

## Prioritized plan additions

### P0 ΓÇö add before UI implementation

- First-run/empty-state/onboarding specification and metrics.
- Constrained responsive docking grammar and default layout presets.
- Shared 2D/3D `ViewState` and transition/error contract.
- Catalog ranking, zero-result, variants, replace-selected and card hierarchy.
- Export job/history/staleness/preflight contract.
- Explicit save-state, recovery, conflict and storage-pressure UX.

### P1 ΓÇö add before broad feature parity sign-off

- Typed command registry and shortcut-discovery contract.
- Accessible project tree plus canvas announcements.
- Concrete device tiers and performance budgets.
- Symbol semantic families, minimum-size review and export legend.
- Named versions/checkpoints for comparing alternatives.

### P2 ΓÇö validate after the core workflow is stable

- Split 2D/3D comparison.
- Advanced layout personalization or shortcut remapping.
- Product comparison and reusable room-style/kit workflows.
- Shareable read-only presentation links and comments.

## Avoid copying

Borrow the interaction principlesΓÇöguided starts, stable project state, task-oriented retrieval, visible save/export truth and low-friction view changesΓÇönot competitor colors, icon shapes, exact panel geometry, wording or screen composition. OOFPLWebΓÇÖs strongest differentiator can be a technically trustworthy planner: canonical dimensions, deterministic SVG, honest formats, recoverable persistence and explicit evidence for every claim.

