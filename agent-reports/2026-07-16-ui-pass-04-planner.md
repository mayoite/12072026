# UI Pass 4 — Planner workspace shell

**Date:** 2026-07-16  
**Scope:** Guest/member shell only (TopBar, panels, inventory, status, mobile CSS).  
**No commit/push.** Browser UI-SHELL / UI-MOB / UI-A11Y remain **OPEN**.

## Code

- `TopBar.tsx` — single save pill authority (removed brand “Unsaved changes”); Save/Retry/Saving labels + aria; error never data-synced success
- `workspace.module.css` — distinct idle/unsaved/saving/saved/error pills; compact 2-row phone header; floating panel chrome; status scroll, no x-overflow
- `WorkspaceShell.tsx` — left title **Inventory**; quote language (not BOQ jargon); layout labels
- `InventoryPanel.tsx` — search labels/hint; SKU + category + availability; clearer empty/error states
- `PanelContainer.tsx` — Floating badge; dock/float titles

## Tests (green)

- `TopBar.saveStatus`, `TopBar.a11y`, `topBarGuest`, `workspaceShell`, editor `InventoryPanel` / `WorkspaceShell` / `PanelContainer` — **91/91**
- ESLint touched TSX clean; `check:layout` OK

## OPEN (browser required)

- UI-SHELL-01…04, UI-MOB-01…04, UI-A11Y-*, UI-CAT-*, UI-STATE browser proof  
- Unit-green ≠ production-ready shell at 1440/390
