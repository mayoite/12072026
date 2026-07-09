# Test Writer 1/2 — TopBar label-in-name a11y

**Date:** 2026-07-09  
**Agent:** TEST WRITER 1 of 2  
**Scope:** Focus / Prefs accessible names contain visible words (WCAG 2.5.3)  
**Production:** `site/features/planner/open3d/editor/TopBar.tsx`  
**Test file:** `site/tests/unit/features/planner/open3d/TopBar.a11y.test.tsx`

## Gap analysis

| Case | Before | Action |
|------|--------|--------|
| Focus aria-label contains "Focus" when not maximized | No dedicated a11y unit test | **Added** |
| Prefs aria-label contains "Prefs" | No dedicated a11y unit test | **Added** |
| Restore pair when maximized | Extra regression (same control) | **Added** |

Existing TopBar coverage: guest gate (`persistence/topBarGuest.test.tsx`), shell callbacks (`workspaceShell.test.tsx`). No prior label-in-name assertions.

## Tests (3)

1. **`aria-label includes "Focus" when canvas is not maximized`**  
   - Renders with `isCanvasMaximized={false}` + `onToggleCanvasMaximized`  
   - Button found by role name `/Focus/i`  
   - Asserts `aria-label` contains `"Focus"` and visible text is `Focus`

2. **`Prefs button aria-label includes visible word "Prefs"`**  
   - Asserts `aria-label` contains `"Prefs"` and visible text is `Prefs`

3. **`aria-label includes "Restore" when canvas is maximized`**  
   - Pair of Focus control; asserts Restore name + visible text; Focus absent

## Vitest result

```
File: tests/unit/features/planner/open3d/TopBar.a11y.test.tsx
Tests: 3 passed (3)
Test Files: 1 passed
```

Evidence log: `results/planner/elon-standard/test-writer-1/vitest.log`

## Notes

- Did **not** change production code — regression lock on existing Focus/Prefs aria-labels.
- No `any`, no skips, no hollow asserts (reads real DOM aria-label + textContent).
