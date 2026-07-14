# Planner UI benchmark

## Status

This is the interface benchmark for Planner work.

It is not an execution plan.

The benchmark was refreshed on 2026-07-13.

External sources were current on that date.

## Verdict

The current Planner is below the professional bar.

The desktop workspace is crowded.

The phone workspace is not acceptably composed.

The entry journey blocks the canvas twice.

The catalog is dense but weak at product comparison.

The save state is repeated in conflicting places.

The interface exposes many features.

It does not establish a clear task hierarchy.

## Scope and evidence

The local check used the live `/planner/guest` route.

It used fresh Chromium sessions.

It covered these viewports:

- Desktop: 1440 by 900 CSS pixels.
- Phone: 390 by 844 CSS pixels.

The checked journey was:

1. Open the guest route.
2. Complete project setup.
3. Choose the available starting point.
4. Enter the 2D workspace.

No console error occurred in that journey.

No request failure occurred in that journey.

The reviewed implementation includes:

- `site/features/planner/onboarding/ProjectSetupGate.tsx`
- `ProjectSetupStep (StartingPointStep removed)`
- `site/features/planner/editor/TopBar.tsx`
- `site/features/planner/editor/WorkspaceShell.tsx`
- `site/features/planner/catalog-api/CatalogPanel.tsx`

This is a dated baseline.

It does not prove later builds behave the same.

Admin and Site were not browser-scored in this pass.

## Current baseline

### Entry journey

The guest route first blocks on project metadata.

It then blocks on a second starting-point screen.

That second screen offers only `Start from Scratch`.

It offers no template.

It offers no import.

It offers no trace flow.

It offers no back or skip action.

The second gate adds no real choice.

This is needless friction before the core task.

### Desktop workspace

| Measure | Observed |
|---|---:|
| Viewport | 1440 by 900 |
| Header | 1440 by 56 |
| Canvas | 812 by 799 |
| Status bar | 1440 by 45 |
| Buttons | 63 |
| Buttons below 24 pixels on one axis | 18 |

Two undersized buttons were hidden panel toggles.

The other undersized controls were 18 by 18 favorite actions.

The canvas occupies about half of the viewport area.

The empty properties panel still consumes space.

The header gives similar weight to primary and secondary actions.

The library, tool rail, canvas, properties panel, and status bar all compete at once.

### Phone workspace

| Measure | Observed |
|---|---:|
| Viewport | 390 by 844 |
| Wrapped header | 390 by 289 |
| Canvas | 390 by 347 |
| Tool rail | 390 by 57 |
| Status area | 390 by 151 |
| Buttons | 22 |
| Buttons below 44 pixels on one axis | 12 |
| Buttons below 24 pixels on one axis | 0 |

The header consumes 34 percent of the viewport height.

The canvas receives 41 percent.

The status area consumes 18 percent.

The phone UI is a wrapped desktop toolbar.

It is not a deliberate mobile composition.

### State communication

The same screen can show:

- `UNSAVED CHANGES`
- `SAVING LOCALLY...`
- `Saving...`
- `Save draft`

These labels do not form one clear state machine.

The user should see one authoritative save state.

### Catalog

The catalog does provide search.

It does provide categories.

It does provide dimensions.

The tested view still has serious weaknesses:

- Product names truncate.
- Thumbnails are too similar.
- Variants occupy separate rows.
- Comparison attributes are weak.
- The `Place` action repeats on every dense row.
- Product truth is visually secondary to controls.

### Current score

`FAIL` means the checked journey misses this benchmark.

`PARTIAL` means useful behavior exists but the bar is not met.

| Area | Result | Reason |
|---|---|---|
| Fast entry | FAIL | Two blocking gates precede the canvas. |
| Starting choices | FAIL | Only scratch is available at the second gate. |
| Desktop canvas priority | FAIL | Default chrome consumes about half the viewport area. |
| Phone composition | FAIL | Desktop controls wrap into 289 pixels of header. |
| System status | FAIL | Save state is duplicated and contradictory. |
| Catalog finding | PARTIAL | Search and categories exist. Comparison remains weak. |
| Contextual properties | PARTIAL | The panel exists. It wastes space when empty. |
| 2D and 3D access | PARTIAL | Both modes are visible. Parity was not tested here. |
| Keyboard and dragging alternatives | OPEN | This pass did not verify full task completion. |
| BOQ and Oando handoff | OPEN | The tested state did not expose the full journey. |

## External benchmark

### Professional canvas tools

[Figma](https://help.figma.com/hc/en-us/articles/30925881896727-FD4B-Navigate-Figma-Design-files) defines four stable regions.

They are the toolbar, left panel, right panel, and canvas.

[Figma UI3](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3) makes panels resizable and collapsible.

It can minimize the interface to prioritize the canvas.

It reopens contextual properties when selection requires them.

[SketchUp](https://help.sketchup.com/en/sketchup/user-interface) separates basic tools from deeper menus and trays.

It supports templates, explicit units, and customizable work areas.

The lesson is not to copy their styling.

The lesson is to protect the work surface.

### Planning products

[Planner 5D](https://planner5d.com/screens/use/floor-plan-software) presents template, scratch, structure, furnishing, and 3D preview as a coherent path.

[RoomSketcher](https://www.roomsketcher.com/floor-plans/) supports scratch, templates, tracing, conversion, capture, measurements, 2D, 3D, branded output, and sharing.

[Floorplanner](https://floorplanner.com/) combines an accessible editor with a large furniture library and 2D or 3D output.

[Planner 5D Business](https://planner5d.com/business) connects real catalog data to quote-ready product lists.

These products set a workflow expectation.

Entry, drawing, furnishing, visualization, and output must feel connected.

### Commercial-interiors products

[CET Commercial Interiors](https://www.configura.com/products/cet/commercial-interiors) is the strongest commercial benchmark.

It joins real manufacturer products, graphical configuration, 2D, 3D, specifications, product lists, presentations, and ordering.

[pCon.planner](https://en.blog.pcon-solutions.com/2026/05/11/smarter-planning-workflows-with-pcon-planner-8-14/) keeps B2B product information and configuration inside the planning workflow.

Oando does not need their total feature depth now.

Oando does need their continuity of product truth.

### Catalog usability

[Baymard's product-list research](https://baymard.com/research/ecommerce-product-lists) treats filtering, comparison information, thumbnails, hit areas, and variation handling as one system.

The Planner catalog is not merely a tool drawer.

It is a product-selection interface.

### General usability

[Nielsen Norman Group's heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) require visible system status, user control, consistency, recognition, error prevention, and restrained information density.

[Apple's design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles) emphasize agency, hierarchy, clear feedback, simplicity, and adaptation.

The current Planner misses this bar in hierarchy and adaptation.

### Accessibility

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) is the conformance floor.

Relevant requirements include:

- Focus must remain visible and unobscured.
- Dragging must have a non-drag alternative.
- Pointer targets must meet size or spacing rules.
- Status messages must be programmatically exposed.
- Keyboard users must complete the core journey.

The WCAG AA target is not the ambition ceiling.

For phone controls, use a 44 by 44 pixel internal target where practical.

## Package decision

No new UI package is approved by this benchmark.

The installed stack already covers the required work:

| Need | Existing authority |
|---|---|
| Accessible controls, menus, focus, and selection | `react-aria-components` |
| Desktop panel resizing | `react-resizable-panels` |
| Phone sheets | `vaul` |
| Interactive 2D canvas | `fabric` |
| Interactive 3D canvas | `three`, `@react-three/fiber`, and `@react-three/drei` |
| Planner state | `zustand` |
| Undo and redo history | `zundo` |
| Remote loading and sync state | `@tanstack/react-query` |
| Catalog search when ranked search is needed | `fuse.js` |
| Icons | `@phosphor-icons/react` |
| Transient notifications | `sonner` |
| Browser and accessibility proof | `@playwright/test` and `@axe-core/playwright` |

Shared CSS remains under `site/app/css/` and Planner CSS modules.

Use semantic tokens.

Do not add a second canvas engine.

Do not add a component framework to hide layout problems.

Add a dependency only after a verified missing capability and license review.

## Required interaction model

### Entry

The customer should reach useful canvas content quickly.

Offer these starting modes together:

1. Use an office template.
2. Draw from scratch.
3. Import or trace a plan.

Project metadata should not block exploration.

Prefill it.

Allow later editing.

### Desktop shell

Use four clear regions:

1. Compact command bar.
2. Collapsible product library.
3. Dominant canvas.
4. Contextual properties.

Collapse empty properties by default.

Keep secondary commands in menus.

Keep the current task visible.

Use one save indicator.

### Phone shell

Do not wrap the desktop header.

Use one compact top bar.

Use one compact bottom tool bar.

Open inventory and properties as sheets.

Show one sheet at a time.

Keep the canvas visible behind the sheet.

Support landscape intentionally.

### Catalog

Every product result needs:

- Recognizable product imagery or 2D geometry.
- Full product name.
- SKU.
- Exact dimensions.
- Family and variant identity.
- Availability state.
- Configuration state.
- Clear placement action.

Group family variants.

Do not force scanning of near-duplicate rows.

Support filters for family, dimensions, seats, material, and availability.

The placed symbol must remain recognizable from its catalog preview.

### Selection and properties

Properties must follow selection.

They must not occupy permanent space without selection.

Critical geometry must allow direct numeric entry.

Changes need immediate canvas feedback.

Invalid configurations need a precise explanation.

### Commercial handoff

The interface must keep the commercial outcome visible.

Show product count and BOQ readiness.

Show missing configuration data.

Separate draft export from customer-ready BOQ.

Make `Send to Oando` an explicit final action.

Never present unapproved pricing as truth.

## Acceptance contract

These IDs are stable.

Future plan revisions must trace to them.

| ID | Requirement |
|---|---|
| UI-ENTRY-01 | Guest entry reaches a useful canvas after at most one blocking choice. |
| UI-ENTRY-02 | Entry offers template, scratch, and import or trace. |
| UI-ENTRY-03 | Optional metadata can be skipped and edited later. |
| UI-SHELL-01 | The desktop header remains one row at supported widths. |
| UI-SHELL-02 | Default desktop canvas uses at least 65 percent of viewport area. |
| UI-SHELL-03 | Empty properties do not reserve a permanent panel. |
| UI-SHELL-04 | Panels are collapsible without losing work or selection. |
| UI-STATE-01 | One authoritative save state is shown. |
| UI-STATE-02 | Loading, offline, saving, saved, unsaved, and error are distinct. |
| UI-CAT-01 | Results expose image or symbol, name, SKU, dimensions, family, and availability. |
| UI-CAT-02 | Family variants are grouped and comparable. |
| UI-CAT-03 | Search and filters support commercial product attributes. |
| UI-CAT-04 | Catalog preview and placed 2D representation remain recognizable as the same product. |
| UI-EDIT-01 | Selection opens only relevant properties. |
| UI-EDIT-02 | Dimensions and positions accept exact numeric input. |
| UI-EDIT-03 | Undo and redo communicate the affected action. |
| UI-MOB-01 | Phone chrome does not exceed 40 percent of initial viewport height. |
| UI-MOB-02 | The phone canvas receives at least 60 percent of initial viewport height. |
| UI-MOB-03 | Frequent phone actions use 44 by 44 pixel targets where practical. |
| UI-MOB-04 | Inventory and properties use mutually exclusive sheets. |
| UI-A11Y-01 | The primary journey meets WCAG 2.2 AA. |
| UI-A11Y-02 | Every drag action has a keyboard and pointer alternative. |
| UI-A11Y-03 | Focus remains visible and unobscured. |
| UI-A11Y-04 | Dynamic save, sync, search, and export states are announced. |
| UI-BOQ-01 | Product count and BOQ readiness are visible from the workspace. |
| UI-BOQ-02 | Customer-ready export is distinct from a draft export. |
| UI-BOQ-03 | Sending the BOQ to Oando is explicit and recoverable. |

## Verification standard

Do not close an acceptance ID from code review.

Use a fresh browser run.

Check desktop and phone viewports.

Check keyboard completion.

Check focus order.

Check status announcements.

Check loading, empty, offline, error, and recovery states.

Check the full path from entry to BOQ handoff.

Record exact commands and failures.

Never use competitor screenshots as proof of Oando quality.

Never copy competitor assets, code, or trade dress.
