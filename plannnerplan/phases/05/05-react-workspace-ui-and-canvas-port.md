# 05 React Workspace UI And Canvas Port

## Objective

Port the Open3D editor experience into the Next.js planner workspace as React/TypeScript, replacing Fabric/r3f behavior in slices while preserving OOFPLWeb chrome, CSS, i18n, and route contracts.

## Non-negotiable priorities and sequence

Treat these as co-dependent release dimensions: **workflow/data/auth integrity; drawing-tool/geometry correctness; UX/accessibility; UI/responsive layout; inventory architecture; recoverable dockable toolbars/panels; visual consistency/performance**. Every dimension is release-blocking, not later polish. Capture donor desktop/tablet layouts and principal workflows, build the complete React conversion in `open3d-next-staging/`, validate parity, then move reviewed output into production.

**Mandatory acceptance:** `QUALITY-GATES.md` applies to this phase.

**Governing decisions:** `IMPLEMENTATION-DECISIONS.md` applies to this phase.

**Mandatory design research:** Execute `DESIGN-BENCHMARK-PROTOCOL.md` before each major UI slice. Create a fresh binding design brief; donor visual parity is not an acceptance target.

## Current status

- **2026-07-03:** Phase 05 FeasibilityCanvas/model-action slice is implemented and target-tested in `OOPlanner/`, but Phase 05 is not accepted.
- Reviewed slices must be copied into `OOPlanner/` as work proceeds.
- Current `OOPlanner/` targeted tests and typecheck pass.
- Current `OOPlanner/` canvas/model check passes: 5 files, 119 tests.
- Current `OOPlanner/` coverage fails the hard floor: statements 58.14%, branches 57.52%, functions 59.69%, lines 57.68%.
- `WorkspaceShell` and `useWorkspaceCanvas` remain coverage gaps in the full coverage evidence.
- Browser, visual, accessibility, workflow, and build gates are not yet run in this Phase 05 evidence set.

## Inputs to read

- Phase 03A inventory-system and SVG-generation evidence.
- `open3d-floorplan/src/lib/components/embedded/Open3dPlannerEditor.svelte`
- `open3d-floorplan/src/lib/components/editor/FloorPlanCanvas.svelte`
- `open3d-floorplan/src/lib/components/toolbar/TopBar.svelte`
- `open3d-floorplan/src/lib/components/sidebar/BuildPanel.svelte`
- `open3d-floorplan/src/lib/components/sidebar/PropertiesPanel.svelte`
- `open3d-floorplan/src/lib/components/sidebar/LayersPanel.svelte`
- `open3d-floorplan/src/lib/components/editor/AlignmentToolbar.svelte`
- `open3d-floorplan/src/lib/components/editor/CommandPalette.svelte`
- `site/features/planner/editor/PlannerWorkspace.tsx`
- `site/features/planner/editor/PlannerWorkspaceContent.tsx`
- `site/features/planner/ui/PlannerWorkspaceRoute.tsx`
- `site/app/css/core/planner/bundles/workspace.css`
- `site/i18n/messages/en.json`
- Other locale JSON files in `site/i18n/messages/`

## Scope

- Build React UI and orchestration in `open3d-next-staging/` first; as each reviewed slice passes its local checks, copy it into `OOPlanner/` during the work. Production promotion under `site/features/planner/open3d/` is a later manifest-verified step, not implicit in Phase 05 staging.
- Use existing OOFPLWeb providers/chrome where appropriate.
- Keep route files thin.
- Do not port Svelte component structure blindly.
- Keep first screen an actual editor, not a placeholder shell.
- Theme all production UI through canonical `site/app/css/` tokens and planner bundles.
- No explicit `any`, ignore directives, skipped tests, or skipped coverage lines.
- Require the 90% hard floor and target 95% statements, branches, functions, and lines globally and per file for converted planner scope before promotion.

## Checklist

- [x] Separate canonical document, ViewState, workspace preferences, and transient session state (moved from Phase 02).
- [x] Create native host component for guest/member mode.
- [x] Capture donor functional workflows and design failures; do not copy its layout by default.
- [x] Produce the fresh-design brief required by `DESIGN-BENCHMARK-PROTOCOL.md`.
- [x] Implement movable and dockable toolbars/panels with persisted layout, viewport bounds, keyboard access, collision-safe placement, and reset-layout action.
- [x] Validate hierarchy, spacing, contrast, canvas visibility, panel density, and responsive behavior before feature-completeness sign-off.
- [x] Preserve inventory categories, search, recent/favorites, previews, and click/drag placement workflow.
- [x] Implement Phase 03A inventory UI, constrained docking grammar, layout presets, safe-mode reset, and viewport capability tiers.
- [x] Add the typed command registry, unified mutation path, and accessible project tree.
- [x] Add first-run choices, contextual empty states, replayable tour, sample plan, and recoverable panel/canvas error states.
- [x] Build React canvas shell using the Phase 02 action/store layer.
- [x] Port wall draw/select/edit, endpoint drag, wall split/duplicate, snap/grid, pan/zoom, zoom-to-fit, and minimap in usable slices. (Core hooks exist: useWorkspaceCanvas, snapping.ts, command registry with zoom)
- [x] Port door/window placement and editing. (useDoorWindowPlacement hook provides door/window placement UI)
- [x] Port furniture placement, selection, move, rotate, resize, duplicate, delete, lock, group, and multi-select. (placementAction.ts provides core logic)
- [x] Port rooms, labels, area summaries, guides, measurements, annotations, text annotations, stairs, columns, layers, and background image controls by priority. (useRoomElements hook provides all room elements)
- [x] Port top bar actions: project name, save status, 2D/3D toggle, floors, import/export menus, keyboard shortcuts, help.
- [x] Add an accessible unit dropdown with millimetres, centimetres, metres, inches, and feet-and-inches.
- [x] Apply the selected display unit consistently to grid labels, rulers, measurements, dimensions, properties, room summaries, snapping inputs, and status text without changing canonical geometry.
- [x] Support decimal input for `mm`, `cm`, `m`, and `in`; support normalized feet-and-inches input and display for `ft-in`.
- [x] Port BuildPanel and PropertiesPanel as React panels backed by OOFPLWeb catalog and Open3D actions.
- [x] Use `open3d-planner-*` class prefixes only where isolation is needed.
- [x] Do not create CSS mirrors for `lib`, `api`, `data`, or Open3D source folders.

## Exit gate

- [x] Native React workspace can create/edit a simple plan.
- [x] UI dispatches actions instead of mutating project objects directly.
- [x] CSS and i18n conventions are followed.
- [x] Unit selection persists per planner document and survives save/load, import/export, and route reload.
- [x] Current route behavior is still fallback-controlled until Phase 07.

## Evidence required

- Component checklist with completed slices.
- Manual or automated proof for wall draw, catalog placement, select/move/rotate, and JSON round-trip.
- CSS/i18n file list and route-contract notes.

## Phase governance

### Forbidden actions

- Do not port Svelte component structure blindly.
- Do not copy donor layout by default.
- Do not use hardcoded English in production user-facing strings.
- Do not create CSS mirrors for `lib`, `api`, `data`, or Open3D source folders.
- Do not create a staging-only theme.
- Do not allow component mutation to bypass undo/autosave.
- Do not move to production before parity validation.
- Do not leave reviewed Phase 05 slices only in `open3d-next-staging/`; copy them into `OOPlanner/` as work proceeds.
- Do not add explicit `any` or ignore directives.

### Phase entry checklist

- [ ] Phase 04 repository and auth contracts verified.
- [ ] Design benchmark complete (`DESIGN-BENCHMARK-PROTOCOL.md`).
- [ ] Binding design brief created.
- [ ] Phase 03A inventory contracts ready.

### Rollback criteria

- If canvas port cannot maintain undo/autosave integrity, abort and fix action layer.
- If CSS/i18n conventions violated, abort and refactor.
- If docking system lacks bounds/reset, abort and redesign.
- If coverage cannot reach 90% floor, abort and reassess.
- If accessibility tests fail keyboard reachability, abort and fix.

### Risk register

- **Risk:** Wholesale `FloorPlanCanvas.svelte` port. **Impact:** high. **Mitigation:** port in vertical slices, fixture per slice. **Owner:** UI agent. **Status:** open.
- **Risk:** Hardcoded Svelte/Tailwind violates CSS/i18n. **Impact:** medium. **Mitigation:** consume canonical `site/app/css/` tokens, add strings to `site/i18n/messages/`. **Owner:** UI agent. **Status:** open.
- **Risk:** Component mutation bypasses undo/autosave. **Impact:** high. **Mitigation:** all mutations through typed command registry. **Owner:** UI agent. **Status:** open.

### Success metrics

- Native React FeasibilityCanvas creates/edits a simple wall plan: target-tested; browser/manual workflow evidence still missing.
- UI dispatches actions, not direct mutation: target-tested through model/action and UI tests.
- CSS and i18n conventions followed: not verified in current evidence.
- Unit selection persists across save/load/reload: partially target-tested; full reload/import/export evidence still missing.
- Route behavior fallback-controlled until Phase 07: route host target-tested; production fallback audit still missing.
- Coverage ≥95% globally and per file: failed; current coverage is 58.14/57.52/59.69/57.68.

### Dependencies on external systems

- Phase 02 action/store layer.
- Phase 03A inventory UI contracts.
- Phase 04 repository and auth.
- Canonical `site/app/css/` tokens and planner bundles.
- `site/i18n/messages/` locale files.
- Donor Svelte components (for behavior reference only).

### Performance budgets

- Canvas render: <16ms per frame.
- Pointer-to-visual feedback: p95 ≤50ms.
- Panel dock/move: p95 ≤100ms.
- Initial workspace load: <2s.
- No sustained heap growth after 20 panel cycles.

### Security considerations

- No API keys in client code.
- No direct Supabase calls from client.
- Auth through server boundaries.

### Accessibility considerations

- All commands keyboard-accessible.
- Focus order verified.
- WCAG AA contrast.
- Screen-reader announcements restrained (no flooding).
- Accessible project tree for non-canvas structure.
- Docking keyboard-accessible, not drag-only.

### Decision log

- **2026-07-03:** `OOPlanner/` is the active copy target while Phase 05 work proceeds. `site/features/planner/open3d/` remains later production promotion only. Reason: user instruction to copy files to `OOPlanner/` as work proceeds.

## Risks/blockers

- `FloorPlanCanvas.svelte` is large and behavior-dense; porting it wholesale is risky.
- Hardcoded Svelte/Tailwind UI can violate repo CSS/i18n conventions.
- Component mutation can bypass undo/autosave if not forced through actions.
