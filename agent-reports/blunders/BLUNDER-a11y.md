# Blunder report — Accessibility

**Agent:** a11y-review (general-purpose)  
**Date:** 2026-07-18  
**Scope:** Planner guest + Admin freehand + parametric dock  
**Method:** Playwright + axe-core on localhost:3000  
**Not PASS proof.**

## Axe auto

| Route | Violations |
|-------|------------|
| `/planner/guest/` | 0 |
| `/admin/svg-editor/parametric/` | 1 color-contrast |
| `/admin/svg-editor/` | 1 color-contrast (many badge nodes) |

## Blunders (serious)

1. **Dockview tabs: all panels `aria-selected="true"`**  
   Planner + Admin. SR cannot know active tab.

2. **Admin badge contrast fails AA**  
   `.admin-badge--active` / `--warn` below 4.5:1 on ecru paper.

3. **Inventory favorites: identical `aria-label`**  
   Missing product name in each control.

4. **Parametric field errors not tied to inputs**  
   `role="alert"` without `aria-invalid` / `aria-describedby`.

5. **Inventory cards: nested buttons + fragile article pattern.**

6. **Dock float/resize pointer-only**  
   No keyboard reflow (separator/drag).

## Moderate blunders

- Status bar no `aria-live`; text runs together  
- Planner dock host unlabeled; Admin host label on generic div  
- Fake Dock ToggleButton always selected  
- Parametric preview SVG unlabeled (`role="img"` missing)  
- Duplicate publish status regions  

## Quick wins

1. Badge tokens contrast  
2. Favorite labels with product name  
3. Field aria-invalid + describedby  
4. Dock host `role="region"`  
5. Status live regions  
6. Preview img label  
7. Remove fake Dock toggle  

## Already good

- CanvasToolRail RAC groups, names, 44px, reduced motion  
- Inventory Place names, search, filters  
- TopBar naming, workflow bar `aria-current`  

## Parent priority

1. Badge contrast  
2. Favorite + field invalid wiring  
3. Dock tab aria-selected truth  
4. Status live + landmarks  
