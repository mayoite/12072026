# UI Expert Plan (draft)

**Source:** Composer 2.5 subagent — [UI expert plan draft](f1e63d44-e6b1-4895-9c87-982327799d8e)  
**Status:** Draft for coordinator revision → `UI-PLAN-REVISED-2026-07-05.md`  
**Date:** 2026-07-05

---

## 1. Executive Summary

- **Root cause is architectural, not cosmetic:** three surfaces share one token file (`theme.css`) but consume it through divergent paths — site via `@utility typ-*` + scheme classes, planner via `planner-shell.css` + CSS modules, admin via `admin.css` shell *plus* raw Tailwind palette classes (`slate-*`, `blue-*`) in `ThemeEditor`. The UI feels static because layout adaptation is breakpoint-tier (`data-viewport`) without container queries, panel widths are mostly fixed rem constants, and autoadjustment primitives (`react-resizable-panels`, density mode) are only partially wired.
- **Pick one primary system:** **token-first authored CSS in `site/app/css/`** with Tailwind v4 as compile engine only. CSS modules remain the planner workspace layout layer but must reference semantic `--planner-*` / `--surface-*` tokens exclusively — never palette or Tailwind utilities inside open3d feature code.
- **Phase alignment:** UI-0 (token contract) gates 1A acceptance; UI-1 (open3d shell) is the visual half of 1A P1/P2; UI-2 (admin + Puck chrome) runs with 1B; UI-3 (fluid autoadjustment) completes after 1A shell is stable so panel IA does not churn twice.
- **Icons are already decided:** Phosphor on all planner routes; Lucide on admin CMS — enforce, don't reopen.
- **No Mantine.** `@ark-ui/react` is already pinned for admin headless primitives (dialogs, tabs, combobox) where native + CSS is insufficient; use it surgically, not as a second design system.

## 2–9. Full expert content

See subagent transcript for complete diagnosis, phased plan UI-0→UI-3, autoadjustment strategy, anti-patterns, first 5 tasks, success metrics, and what NOT to do.

**First 5 execution tasks (expert):**

| # | Task | Files |
|---|------|-------|
| 1 | Unify planner accent tokens; shim `--planner-primary` | `planner-tokens.css`, `planner-shell.css`, `side-panels.css`, `session-dialog.css` |
| 2 | open3d layout loads workspace bundle | `app/planner/open3d/layout.tsx`, `bundles/open3d-workspace.css` |
| 3 | Rewrite `ThemeEditor` off slate/blue | `ThemeEditor.tsx`, `themes/page.tsx` |
| 4 | Desktop docked resize via `react-resizable-panels` | `WorkspaceShell.tsx`, `workspace.module.css` |
| 5 | `lint-ui-contract.mjs` + `lint:ui` | `site/scripts/`, `package.json` |
