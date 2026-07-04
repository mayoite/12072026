# Conversion Execution Benchmark

Date: 2026-07-03  
Web-source access date: 2026-07-03  
Status: immutable advisory report. The primary agent decides what becomes binding.

## Scope and evidence reviewed

This benchmark governs conversion of the donor planner into the React/Next.js staging implementation, with special protection for UI, UX, and workflow. It addresses drawing workflows, pointer/cancel/snap feedback, command architecture, canonical site-theme integration, accessibility, and the required 95% coverage gate.

Local evidence reviewed:

- `DESIGN-BENCHMARK-PROTOCOL.md`
- current execution plans, especially Phase 01A, Phase 01B, Phase 05, and `QUALITY-GATES.md`
- `evidence/01a-baseline.md`
- `REFERENCE-EXECUTION-BENCHMARK-01B-2026-07-03.md`
- current staging UI: `app/page.tsx`, `app/styles.css`, `FeasibilityCanvas.tsx`, command registry, snapping logic, and feasibility tests

Products reviewed through direct official/help sources:

- Floorplanner and Planner 5D: floor-planning workflows
- AutoCAD Web and SketchUp for Web: CAD/spatial authoring
- Figma: professional creative-tool command and keyboard access
- SketchUp 3D Warehouse: large-catalog discovery

The report borrows principles only. It does not authorize copying wording, colors, icons, geometry, layout, or trade dress.

## Observed facts

### Floorplanner

- The current editor manual documents interactive snapping while drawing or dragging, temporary snap suppression, click/`Esc` deselection, space-assisted panning, wheel zoom, and a shortcut reference.
- The editor uses a large drawing canvas and exposes editing controls according to selection/context instead of presenting every property with equal permanence.

Source: [Floorplanner editor manual](https://cdn.floorplanner.com/static/brochures/FloorplannerManualEN.pdf).

### Planner 5D

- Its web partition-wall workflow is a continuous point-input operation: repeated corners form a room, returning to the first corner closes it, and double-click can finish a partition wall.
- Its official web documentation separates workflows by platform. Public evidence does not establish one identical desktop, tablet, and mobile authoring layout.
- Grouping on web begins with a modifier-assisted box selection, then exposes a contextual group action near the selection.

Sources: [partition-wall workflow](https://support.planner5d.com/en/articles/5876887-using-a-partition-wall-function-web), [grouping workflow](https://support.planner5d.com/en/articles/7210732-power-of-grouping-in-planner-5d-a-step-by-step-guide), [web project-workflow index](https://support.planner5d.com/en/collections/3294344-working-on-a-project).

### AutoCAD Web

- Object snaps are named precision modes, including endpoint, midpoint, center, intersection, perpendicular, tangent, nearest, and parallel; they apply while a command is requesting a point.
- AutoCAD Web presents command discovery and execution through visible tools, typed commands, command prompts/options, and status controls.
- Snap, object-snap tracking, ortho, and polar tracking are explicit states rather than invisible pointer behavior.

Sources: [AutoCAD Web object snaps](https://help.autodesk.com/cloudhelp/ENU/AutoCAD-Web-Help/files/Drafting-and-Creating/AutoCAD_Web_Help_Drafting_and_Creating_Osnap_html.html), [command line](https://help.autodesk.com/view/ACADWEB/PLK/?guid=AutoCAD_Web_Help_Drafting_and_Creating_Command_Line_html), [status bar](https://help.autodesk.com/cloudhelp/ENU/AutoCAD-Web-Help/files/Drafting-and-Creating/AutoCAD_Web_Help_Drafting_and_Creating_Status_bar_html.html).

### SketchUp for Web

- A compact main toolbar holds common tools and an expanded toolset holds additional tools.
- Search can find and activate tools or commands by name or concept. Results are keyboard navigable, and some view commands execute without cancelling the current drawing tool.
- Shortcuts appear in toolbar hover help and search; users can customize and reset them.
- Browser-reserved shortcuts constrain web-app shortcut design.

Sources: [main toolbar](https://help.sketchup.com/en/sketchup-web/sketchup-web-main-toolbar), [tool and command search](https://help.sketchup.com/en/sketchup-web/search-tools-and-commands), [shortcuts](https://help.sketchup.com/en/sketchup-web-shortcuts), [web-specific features](https://help.sketchup.com/it/sketchup-web/web-features).

### Figma

- Figma exposes tools through shortcuts, an actions menu, and a keyboard-focusable toolbar.
- Official keyboard guidance supports canvas panning, object placement, toolbar traversal, and a categorized shortcut panel.
- Figma supports multiple keyboard layouts because fixed US-QWERTY assumptions do not transfer reliably across locales.

Sources: [keyboard operation](https://help.figma.com/hc/en-us/articles/360040328653-Use-Figma-products-with-a-keyboard), [keyboard layouts](https://help.figma.com/hc/en-us/articles/5665442977431-Select-keyboard-layout).

### SketchUp 3D Warehouse

- Search supports text and reference-image input.
- Results are scoped by content type and support type-specific filters, sorting, and filter reset.
- Model-oriented filters include category, file size, polygon count, certified content, texture readiness, author, and date.

Source: [3D Warehouse search and filters](https://help.sketchup.com/en/3d-warehouse/searching-and-downloading-models).

### Web-platform, accessibility, theme, and coverage standards

- Pointer Events unify mouse, pen, and touch input. Pointer capture can retain targeting during a gesture; `lostpointercapture` is a defined lifecycle event that must be handled correctly.
- WCAG 2.2 SC 2.1.1 requires keyboard operation except genuinely path-dependent input. Its guidance explicitly says straight lines, regular shapes, resizing, and endpoint-based dragging are not exempt.
- WCAG 2.2 SC 2.4.7 requires a visible keyboard-focus indicator.
- Next.js supports global CSS and CSS Modules, and warns that global stylesheet ordering depends on import order. Theme ownership therefore needs one intentional import boundary.
- Vitest coverage only includes imported files by default unless `coverage.include` is set. It supports statements, branches, functions, and lines thresholds, including per-file enforcement.

Sources: [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), [`lostpointercapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event), [WCAG keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), [WCAG focus visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), [Next.js CSS](https://nextjs.org/docs/app/getting-started/css), [Vitest coverage configuration](https://vitest.dev/config/coverage.html).

## Current staging facts

- The staging page is a useful feasibility shell, not a conversion-quality UI.
- It hardcodes an independent dark/slate theme in `app/styles.css`; it does not consume canonical `site/app/css/` tokens.
- Canvas size and transform are initialized during render effects but no `ResizeObserver` is present, so viewport changes are not yet proven.
- Pointer capture is set on pointer down. `pointercancel`, window blur, context menu, and `Esc` call the same cancel function.
- The current `lostpointercapture` handler only calls `cancel()` when no start point exists; this does not protect an active command from stuck state.
- The command registry stores metadata only. The button, keyboard handling, and execution/cancellation behavior are not yet dispatched through one command implementation.
- The visible `W` shortcut is not implemented.
- Pointer down commits every subsequent segment; pointer-up is not part of the transaction. Pen/touch gesture intent, multi-pointer behavior, and click-versus-pan arbitration are not established.
- Snap priority is endpoint, then grid/angle. Endpoint selection uses source-array order rather than nearest candidate and exposes only snap kind, not target identity or guide.
- The preview uses a dashed line and one red endpoint marker, but no visible raw/constrained distinction, length, angle, snap target, invalid-state feedback, or persistent snap-mode state.
- The small-screen notice claims a pan/zoom review tier, but pan and zoom are not implemented.
- The canvas has an accessible region label, controls have visible focus styling, and diagnostics use a polite live region. The canvas workflow itself has no keyboard-equivalent geometry path or accessible project structure.
- A source lint suppression exists for the image element, conflicting with the no-ignore-directives conversion rule.
- The current test file covers pure geometry/persistence examples only. It does not test the UI, pointer lifecycle, command wiring, resize/DPR mapping, cancellation/history invariants, accessibility, or theme integration.
- Because Vitest defaults to imported files, the existing small test set cannot prove 95% coverage of the entire converted scope without an explicit production-source include pattern and complete report.

## Recommendations

### 1. Freeze workflow contracts before visual conversion

Define each drawing tool as a typed state machine with explicit `idle`, `armed`, `previewing`, `committing`, `cancelled`, and `error` outcomes. Specify for every state:

- pointer, keyboard, and visible-control entry;
- active prompt and cursor;
- snap/constraint behavior;
- commit boundary and undo transaction;
- `Esc`, explicit Cancel, right-click, `pointercancel`, lost capture, blur, route change, and unmount outcome;
- selection and focus after commit or cancel.

Do not convert donor components screen by screen. Convert complete user tasks through the shared action/history model.

### 2. Use one typed command authority

Every command should have a stable ID, localized label, category, shortcut candidates, availability state and reason, execution function, cancellation policy, undo semantics, analytics-safe event name, and help reference.

Toolbar, menu, context controls, keyboard shortcuts, command search, and tests must invoke that same command. Detect browser/OS/locale shortcut conflicts and expose the effective shortcut. Never display an unimplemented shortcut.

### 3. Make drawing state continuously legible

Keep committed geometry, active preview, snap candidate, measurement, selection, warning, and invalid-placement feedback visually distinct through site tokens and redundant shape/text cues, not color alone.

Show the active tool, next expected action, selected snap type/target, live length/angle in the document display unit, and a discoverable cancel route. Choose the nearest eligible snap with deterministic tie-breaking and screen-space tolerance. Temporary snap suppression must not alter the persisted preference.

### 4. Correct pointer lifecycle before expanding tools

Use one Pointer Events pipeline for mouse, pen, and touch. Track pointer ID and pointer type, handle capture success/loss, ignore or deliberately interpret additional pointers, and guarantee that cancel paths create no document mutation or history entry.

Add resize- and DPR-safe coordinate mapping, pan/zoom separation from geometry, coalesced-event handling only after correctness, and tests for blur/unmount during an active command. Do not claim touch authoring until gesture arbitration is verified on a real browser.

### 5. Integrate the site theme through one boundary

The staging app may use a thin adapter, but its semantic planner tokens must resolve from canonical `site/app/css/` values. Do not preserve the current hardcoded staging palette or create a parallel theme.

Use semantic tokens for canvas, chrome, raised panel, border, text, muted text, focus, selection, preview, snap, warning, and error states. Document the import boundary and verify CSS order. Component CSS may define layout and interaction states; brand primitives remain site-owned.

### 6. Treat accessibility as a workflow requirement

Provide keyboard-equivalent straight-wall creation and endpoint movement through numeric/step controls or an accessible project tree. Include semantic buttons, roving or conventional toolbar focus, visible focus, status announcements that do not flood assistive technology, and focus restoration after popovers/palettes.

Canvas content needs a synchronized non-canvas project structure for selection, naming, locking, visibility, and properties. Test zoom, forced colors, reduced motion, keyboard-only operation, and common screen-reader paths. Pointer precision is not a reason to omit keyboard access to endpoint-defined geometry.

### 7. Protect canvas hierarchy and responsive capability

Desktop should open as a usable editor with the canvas dominant and contextual properties secondary. Tablet should use adapted, bounded surfaces and explicit gesture modes. Small viewports should declare limited capability honestly rather than hiding controls while leaving unsupported editing active.

Docking and movement belong to the later layout grammar; do not let conversion agents invent independent floating panels. Defaults, presets, bounds, collision handling, keyboard movement, and reset must be designed and tested together.

### 8. Enforce coverage against the real converted scope

Configure coverage with an explicit include pattern covering all handwritten converted production `.ts`/`.tsx` files, not only files imported by tests. Enforce at least 95% statements, branches, functions, and lines globally and per file. Generated/vendor/build/result trees may be excluded only under the governing handbook.

Required layers:

- unit/property tests for geometry, snapping, units, parsing, commands, reducers, and migrations;
- component tests for command availability, focus, status, cancellation, and theme-token use;
- real-browser interaction tests for mouse/pen/touch pointer lifecycle, capture loss, resize, DPR, pan/zoom, keyboard operation, and responsive tiers;
- visual regression checks for committed/preview/snap/error/focus/forced-color states;
- workflow tests proving undo/redo, cancel-without-history, persistence round-trip, and no protected API call in guest mode.

No ignored line, ignore directive, skipped test, filtered reporter, or omitted console/evidence stream may be used to reach the threshold. Coverage is necessary but does not replace workflow assertions.

## Conversion acceptance gates

The conversion should not proceed to broad visual implementation until all are true:

1. One complete wall workflow is specified and tested as a typed state machine.
2. All cancel/lost-input paths converge and leave no partial mutation.
3. Pointer, toolbar, shortcut, and command search use one typed command implementation.
4. Snap candidate choice is nearest, deterministic, visible, and tested across zoom/DPR.
5. Keyboard-equivalent endpoint-defined geometry editing and a non-canvas project structure exist.
6. Staging styling resolves from `site/app/css/`; no standalone visual theme remains.
7. Desktop/tablet/small capability statements match implemented behavior.
8. Coverage includes the full handwritten converted scope and independently passes 95% for statements, branches, functions, and lines, globally and per file.
9. Browser evidence covers pointer capture loss, cancellation, resize, DPR, focus, and responsive behavior.
10. Donor UI composition and competitor trade dress are absent; accepted inspirations are recorded as principles with reasons.

## Accepted and rejected inspiration

Recommended for primary-agent acceptance:

- AutoCAD's principle of explicit command and precision state.
- SketchUp's redundant tool discovery and resettable shortcuts.
- Floorplanner's visible snapping and canvas-first hierarchy.
- Planner 5D's task-oriented continuous wall workflow and contextual actions.
- Figma's keyboard-focusable tool access and locale-aware shortcuts.
- 3D Warehouse's scoped search/filter/reset principles for the later inventory phase.

Explicitly reject:

- copying any competitor's exact panel arrangement, marker design, wording, iconography, or colors;
- carrying the donor's crowded header, fixed-sidebar assumptions, or visually repetitive catalog into React;
- treating the current staging shell as the visual baseline;
- hiding unsupported mobile controls while implying authoring parity;
- adding more drawing tools before command, cancellation, snapping, accessibility, theme, and evidence foundations are correct.
