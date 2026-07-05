# Phase 01B UI, UX, and Workflow Execution Benchmark

Date: 2026-07-03  
Web-source access date: 2026-07-03  
Status: immutable advisory benchmark; not a binding plan

## Scope

This fresh benchmark covers the next Phase 01B slice. It protects drawing workflow, accessibility, inventory arrangement, constrained toolbar/panel movement, responsive behavior, and command discoverability. It compares current first-party documentation for:

- Floorplanner
- Planner 5D
- AutoCAD / AutoCAD Web
- SketchUp for Web and iPad
- Figma

SketchUp 3D Warehouse is included as an additional large-catalog reference. Competitor trade dress, exact layouts, wording, icons, and visual geometry are explicitly out of scope.

## Sourced facts

### Floorplanner

- Its current editor manual documents interactive snapping during drawing and dragging, temporary snap suppression, `Esc`/canvas deselection, panning, wheel zoom, and a shortcut reference.
- Its furniture library supports text search, category and subcategory refinement, brand and color filters, favorites, drag-and-drop placement, related items, and an enlarged search surface.
- Selection moves object editing into a sidebar rather than keeping all object properties permanently visible.

Source: [Floorplanner editor manual](https://cdn.floorplanner.com/static/brochures/FloorplannerManualEN.pdf).

### Planner 5D

- The January 2026 web catalog guidance places the catalog at the left and supports search plus click or drag placement.
- The iOS catalog is reached from the bottom and supports tap placement, demonstrating a platform-specific arrangement rather than a desktop layout compressed unchanged.
- The web partition-wall workflow uses repeated point input, first-point closure for rooms, and double-click completion for a partition.
- Planner 5D publishes separate workflow documentation for web, iOS, Android, Windows, and macOS.

Sources: [web catalog](https://support.planner5d.com/en/articles/5876855-catalogue-menu-web), [iOS catalog](https://support.planner5d.com/en/articles/5897736-catalogue-menu-ios), [web partition-wall workflow](https://support.planner5d.com/en/articles/5876887-using-a-partition-wall-function-web), [web workflow collection](https://support.planner5d.com/en/collections/19637049-web-platform).

### AutoCAD and AutoCAD Web

- AutoCAD Web exposes named object-snap modes while a command requests a point. The command line suggests commands, presents in-progress options, and supports keyboard and pointer selection.
- AutoCAD desktop supports docked or floating toolbars, movable/resizable floating toolbars, edge docking, and saved workspace arrangements.
- Dockable palettes can be resized, docked, floated, anchored, or auto-hidden. UI position and size can be locked; a visible status control communicates lock state and Ctrl temporarily overrides it.
- Workspaces preserve which palettes and toolbars are visible, their location, dock state, size, and toolbar rows.
- Tool palettes organize content in tabs and groups; tools may be reordered, sorted, separated, and moved between palettes.

Sources: [AutoCAD Web object snaps](https://help.autodesk.com/cloudhelp/ENU/AutoCAD-Web-Help/files/Drafting-and-Creating/AutoCAD_Web_Help_Drafting_and_Creating_Osnap_html.html), [AutoCAD Web command line](https://help.autodesk.com/view/ACADWEB/PLK/?guid=AutoCAD_Web_Help_Drafting_and_Creating_Command_Line_html), [2026 toolbars](https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-42E68723-BEBB-4572-B3B1-3C43E252FCF1.htm), [UI locking](https://help.autodesk.com/view/ACD/2026/ENU/?caas=caas%2Fdocumentation%2FACDLT%2F2014%2FENU%2Ffiles%2FGUID-19C5EEB0-D2DD-4726-89A7-3D346B513715-htm.html), [workspace UI state](https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-LT-Customization/files/GUID-D550C560-FDC0-4A68-A56C-52C98C3DD0A6.htm), [tool palettes](https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-6B20D7DF-447A-4A8D-8FF1-8339CF54FFBD.htm).

### SketchUp

- SketchUp for Web divides tools between a compact main toolbar and an expanded toolset.
- Search finds and activates tools or commands by name or concept, supports arrow-key navigation and Enter, and can execute some view commands without cancelling the active drawing tool.
- Shortcuts are exposed in hover help and search, can be customized, and can be reset.
- SketchUp for iPad keeps common tools in a main toolbar, exposes optional modes, retains recently used expanded tools, and allows toolbar customization.
- Platform adaptation is explicit: 3D Warehouse is in a right-side panel on web and at the top of the main toolbar on iPad. iPad panels remain grouped on the right.
- The Outliner supplies a non-canvas hierarchy with naming, visibility, selection/zoom, deletion, and instance operations.
- SketchUp LayOut toolbar customization supports adding, removing, rearranging, moving between toolbars, and Reset/Reset All.

Sources: [web main toolbar](https://help.sketchup.com/en/sketchup-web/sketchup-web-main-toolbar), [tool and command search](https://help.sketchup.com/en/sketchup-web/search-tools-and-commands), [web shortcuts](https://help.sketchup.com/en/sketchup-web-shortcuts), [iPad main toolbar](https://help.sketchup.com/en/sketchup-ipad/ipad-main-toolbar), [3D Warehouse placement by platform](https://help.sketchup.com/en/3d-warehouse/accessing-3d-warehouse), [iPad panels](https://help.sketchup.com/en/sketchup-ipad/ipad-panels), [Outliner](https://help.sketchup.com/es/sketchup-ipad/outliner-panel), [LayOut toolbar customization](https://help.sketchup.com/en/layout/customizing-toolbars-and-menus).

### Figma

- Figma exposes tools through shortcuts, an actions menu, and a keyboard-focusable toolbar.
- Its current keyboard guidance supports canvas panning, toolbar traversal, object placement, shortcut discovery, and a categorized shortcut panel.
- It supports multiple keyboard layouts and warns about system/application layout mismatch.
- Figma acknowledges that some multi-point operations are not keyboard-operable; this is a documented limitation, not evidence that a new spatial editor should omit keyboard alternatives.

Sources: [Figma keyboard operation](https://help.figma.com/hc/en-us/articles/360040328653-Use-Figma-products-with-a-keyboard), [keyboard layouts](https://help.figma.com/hc/en-us/articles/5665442977431-Select-keyboard-layout).

### SketchUp 3D Warehouse

- Search supports text and reference-image input.
- Results are separated into models, catalogs, collections, and materials.
- Type-specific filters include category, file size, polygon count, certified content, texture readiness, author, and date; sorting and filter reset are available.

Source: [3D Warehouse search](https://help.sketchup.com/en/3d-warehouse/searching-and-downloading-models).

### Accessibility standard

- WCAG 2.2 SC 2.1.1 requires keyboard operation except genuinely path-dependent input. Its guidance explicitly states that straight lines, regular shapes, resizing, and endpoint-based dragging are not exempt.
- WCAG 2.2 SC 2.4.7 requires a visible keyboard-focus indicator.

Sources: [WCAG keyboard understanding](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), [WCAG focus-visible understanding](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html).

## Cross-product interpretation

These are interpretations of the sourced facts, not product claims:

1. Mature drawing tools make command state, next input, precision mode, and cancellation visible.
2. Discoverability is redundant: toolbar, search/actions, shortcuts, contextual controls, and help lead to the same command.
3. Large inventories need scoped search, category depth, filters, favorites/recents, placement affordances, and reset—not a long flat list.
4. Movable UI is safe only when paired with constraints, saved workspaces/presets, visible lock state, and recovery.
5. Desktop and tablet should share concepts and document state, not identical panel geometry.
6. A non-canvas hierarchy is both a productivity surface and an accessibility requirement for object-based editors.

## Recommendations for the next Phase 01B slice

### Accessible drawing workflow

- Convert one complete wall task before adding more tools: activate, choose start, preview, snap/constrain, enter or adjust dimensions, commit, continue, cancel, and undo.
- Expose active command, next expected input, length, angle, unit, snap type, and snap target without relying on color alone.
- Provide keyboard-equivalent endpoint-defined geometry through coordinate/dimension entry and a synchronized project tree. Keep pointer and keyboard mutations on the same typed action path.
- Make `Esc`, visible Cancel, pointer cancellation, capture loss, blur, and unmount converge on one tested outcome: no partial geometry and no history entry.

### Discoverability and command architecture

- Register each command once with stable ID, localized label, category, enabled state/reason, effective shortcut, execution, cancel, and undo semantics.
- Use that registry for toolbar, shortcut, contextual menu, searchable command surface, help, and tests.
- Keep the default toolbar small and task-ranked. Put lower-frequency commands in grouped expansion/search, while showing recent tools without silently displacing core tools.
- Never display a shortcut that is not implemented. Detect browser, OS, and keyboard-layout conflicts.

### Inventory arrangement

- Use a persistent inventory entry point with search first, then stable categories/subcategories.
- Add explicit scopes for catalog items, project items, materials, and uploads; do not mix unlike results in one undifferentiated stream.
- Preserve recents, favorites, variants, related/replacement items, and filter reset. Show asset dimensions, readiness/availability, and safe fallback before placement where relevant.
- Support click/tap placement and drag placement through the same command. Keyboard users need a deterministic “place at viewport center/selected room” path followed by numeric positioning.
- Virtualize only after semantic list/grid behavior, result counts, focus persistence, and selection restoration are defined.

### Dockable and movable toolbars/panels

- Do not implement unrestricted floating windows in this slice. First define bounded dock zones, minimum canvas size, legal sizes, collision rules, z-order, focus behavior, and viewport containment.
- Supply excellent default desktop/tablet layouts, named presets, reset layout, and a safe-mode recovery action before persistence.
- Persist versioned logical placement, not raw screen coordinates. Clamp or remap layouts after viewport, zoom, density, or token changes.
- Expose move, dock, resize, lock/unlock, close/open, and reset through keyboard-accessible controls—not drag alone.
- Show a visible lock state and allow a documented temporary override. Never let customization hide the only route to Cancel, Undo, Help, or Reset Layout.

### Responsive behavior

- Desktop: full authoring, bounded docking, command search, tree, inventory, and properties with a declared minimum canvas.
- Tablet: touch-sized compact command surface, one primary panel at a time, deliberate draw/pan/zoom modes, and no desktop floating-window assumption.
- Small viewport: honest view/review or constrained editing unless full workflows are directly proven. Do not merely hide controls while leaving inaccessible commands active.
- Record CSS viewport, DPR, orientation, input type, and capability for every responsive test.

### Visual and theme discipline

- Consume canonical `site/app/css/` semantic tokens for all chrome, canvas feedback, focus, selection, preview, snap, warning, and error states.
- Borrow interaction principles only. Do not copy AutoCAD palette geometry, SketchUp toolbar composition, Floorplanner sidebar layout, Planner 5D catalog placement, or Figma styling.

## Slice acceptance gates

The next slice should fail unless:

1. One wall workflow is complete across pointer, keyboard, cancel, undo, and history.
2. Active command, next action, measurement, constraint, and snap target are continuously legible.
3. Toolbar, shortcut, context action, and search invoke one command implementation.
4. A keyboard-operable project tree and numeric geometry path exist.
5. Inventory architecture has scopes, search, taxonomy, reset, and accessible placement contracts before bulk data is mounted.
6. Docking has bounded zones, presets, locking, keyboard operation, minimum-canvas protection, and reset before persistence.
7. Desktop/tablet/small tiers expose only proven capabilities.
8. Focus order, visible focus, live-region behavior, 200%/400% zoom, forced colors, reduced motion, mouse, pen, and touch are verified in a real browser.
9. Theme values resolve from `site/app/css/`; no staging-only visual system is introduced.
10. Accepted and rejected inspirations are recorded, and no competitor or donor composition is reproduced.

## Explicit rejections

- Reject donor visual parity.
- Reject a flat inventory wall of thumbnails.
- Reject free-floating panels without bounds and reset.
- Reject pointer-only drawing, docking, resizing, or placement.
- Reject responsive behavior defined only by hiding controls.
- Reject independent toolbar handlers that bypass the typed command/action/history path.
- Reject customization that reduces recoverability or obscures the active workflow.
