# Reference Execution Benchmark Phase 05 — React Workspace UI And Canvas Port — 2026-07-03

Status: advisory only. Immutable after creation under `DESIGN-BENCHMARK-PROTOCOL.md`. Becomes binding only when incorporated into a numbered phase file, `IMPLEMENTATION-DECISIONS.md`, or `QUALITY-GATES.md`.

Access date for all URLs: 2026-07-03.

## Products Reviewed

- RoomSketcher: mode-driven floor-planning workspace
- Planner 5D: consumer floor-planning editor
- SketchUp for Web: toolbar, panels, status bar, measurements
- Figma: workspace grammar, command palette, minimize UI, accessibility
- IKEA Kreativ: contextual actions near selection

## Benchmark Takeaways

- The workspace needs a clear grammar: top document bar, left activity/tool surface, dominant canvas, right contextual properties, and bottom status/measurement support.
- Canvas must remain primary; chrome must compress, collapse, or move without damaging the editing workflow.
- Tool discovery should be redundant: toolbar, palette/search, visible shortcut hints, contextual actions.
- Measurements, snap state, active tool guidance, and cancel path must stay visible during drawing.
- Unit switching belongs in the workspace, not buried in settings.
- Inventory and properties should be contextual, scalable, and reversible, not permanently bloated.
- Dockable and movable toolbars must be bounded and rule-driven, not ad hoc floating windows.
- Responsive behavior must adapt by tier, not shrink the desktop layout unchanged.

## Binding Changes For Phase 05

1. Use a fresh workspace grammar:
   top bar for document scope and global controls;
   left rail/panel for activities and inventory/layers;
   right panel for contextual properties;
   dominant canvas in the center;
   bottom status/measurement area.

2. Add a unified command surface:
   searchable palette on `Cmd/Ctrl+K`, visible shortcuts, and the same command IDs used by toolbar and keyboard.

3. Keep a compact primary toolbar and a secondary expandable tool surface.
   Secondary tools must not become hidden-only tools; recently used tools should remain reachable.

4. Keep snap state, active tool hint, and measurement entry visible while drawing.

5. Put the unit selector in the top bar as a direct dropdown.

6. Add a minimize-UI mode that collapses nonessential chrome and restores it predictably.

7. Use contextual inline actions near selection for high-frequency object actions, but keep a full property surface on the right.

8. Make panels and toolbars dockable/movable only within a bounded layout grammar:
   defined docking zones, defaults, reset behavior, keyboard movement rules, and collision rules.

9. Keep degraded assets visible in inventory with clear fallback indicators.

10. Provide spatial keyboard access for canvas selection and editing; do not rely on Tab cycling across many items.

11. Preserve a strong first-run path:
    sample/template entry, clear primary tasks, and immediate orientation.

12. Keep the visual system fresh.
    Use benchmarked principles, not donor layout carryover or competitor trade dress.

## Responsive Rules

- Desktop: full authoring workspace.
- Tablet: adapted panels and commands, still usable for bounded authoring.
- Small screens: truthful limited mode if full authoring is not supported.

Do not compress desktop chrome unchanged onto tablet or phone.

## Rejected Patterns

- Do not hide missing assets by removing them from catalog results.
- Do not make the command palette the only route to important tools.
- Do not hide units in settings/preferences only.
- Do not make the expanded toolset the only route to secondary tools.
- Do not make snap state invisible.
- Do not let floating panels grow without a governed docking system.
- Do not copy donor layout, competitor colors, icons, wording, or panel geometry.

## Accepted Inspirations

- Figma-style workspace separation of concerns
- Figma-style command palette and minimize-UI behavior
- SketchUp-style collapsible panel tray and measurements box
- SketchUp-style recent-tool persistence
- RoomSketcher-style simple mode switching
- IKEA-style contextual selection actions

Use these as principles only, not as visual templates.
