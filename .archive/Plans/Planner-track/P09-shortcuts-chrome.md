# P09 — Toolbar, shortcuts, and themes

**Status:** REPROVE · **CP:** CP-09

## Outcome

The live toolbar is complete, truthful, accessible, responsive, and theme-safe.

## Toolbar gates

- One `canvasTool.ts` map drives shortcut, label, rail, palette, and Fabric handler.
- React Aria Components owns tool focus and selection. Phosphor owns icons.
- Select, pan, wall, opening, place, door, window, and zoom-to-fit work.
- Deferred tools say they are deferred. They never fake geometry.
- Mobile keeps tools reachable without covering the main action or canvas.

## Theme gates

- A visible live control switches light and dark modes.
- Preference survives reload. First paint does not flash the wrong theme.
- Toolbar, panels, Fabric, Three, tooltips, forms, and native controls all change.
- Theme changes never mutate document colors, IDs, pose, or saved geometry.
- Contrast, focus, selected, disabled, hover, and error states pass in both themes.

## PASS gates

- Units prove map authority, persistence, token resolution, and accessibility.
- Browser proves every live tool in both themes at desktop and 375×812.
- Screenshots show toolbar and 2D/3D theme parity.
- No console, hydration, request, or accessibility errors.

**Current truth:** Toolbar exists. Theme code exists. The live Planner does not mount `PlannerThemeToggle`.

**Evidence:** `results/planner/world-standard-wave/09-toolbar-themes/`

**Next:** P10.
