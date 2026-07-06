# Area A — Production Source Wiring Gaps

## A1. Tool-visibility select (DONE — staged)

**File:** `site/features/planner/editor/PlannerWorkspace.tsx`

- [ ] Verify: `#planner-tool-visibility-mode` visible under `?plannerDevTools=1` in prod build; `setToolVisibilityMode` helper works

`PlannerStatusBar` is rendered without `onToolVisibilityModeChange`, so `showDevTools = isPlannerDevToolsEnabled() && undefined = false` and `#planner-tool-visibility-mode` never mounted — failure #14.
 Import `writePlannerToolVisibilityMode` + type `PlannerToolVisibilityMode`.
- Replace `useMemo(() => readPlannerToolVisibilityMode(), [])` with `useState` + handler `handleToolVisibilityModeChange` (writes storage + sets state).
- Pass `toolVisibilityMode` + `onToolVisibilityModeChange` to `PlannerStatusBarWithFabricGrid` (lines ~1335–1341).

## A2. SubTopBar dead props (remove)

**File:** `site/features/planner/editor/PlannerSubTopBar.tsx`

Props `leftCollapsed`, `rightCollapsed`, `onToggleLeftCollapsed`, `onToggleRightCollapsed`, `onResetLayout` are destructured as `_...` (unused). No UI renders collapse/reset.

**Action:**
- Note: `toggleLeftCollapsed` and `handleResetChromeLayout` became unused after passthrough removal → renamed to `_toggleLeftCollapsed` / `_handleResetChromeLayout` to satisfy the `^_` unused-var rule (kept for reversibility per locked decision)

**Note:** If you want collapse/reset buttons restored instead, switch this to wiring real buttons in SubTopBar. Current decision: remove (matches fabric-shell redesign).

## A3. Panel toggle button (leave off)

**File:** `site/features/planner/editor/PlannerLeftPanel.tsx`

"Close left panel" button only renders when `showPanelToggle && onTogglePanel` — never passed by `PlannerWorkspaceLayout`. Panels are driven by step defaults via `usePlannerPanels` (`getStepLeftOpenDefault` / `getStepRightOpenDefault`).

**Action:** no change. Test step-driven `data-open` instead of toggle buttons.

## Checks
