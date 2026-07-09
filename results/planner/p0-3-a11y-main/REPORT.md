# P0.3 part A — Nested `main` landmarks fixed

| Field | Value |
|--------|--------|
| **Status** | **DONE** |
| **Date** | 2026-07-09 |
| **Scope** | Planner open3d shell + admin layout |
| **Issue** | A1 from `results/planner/a11y-open3d/REPORT.md` / `ayushdocs/06-A11Y-OPEN3D.md` |
| **Commit** | None (no commit per standing rules) |

## Goal

Exactly **one** landmark `main` per page layout. Demote inner wrappers to `div` (no extra roles/tokens redesign).

## Before (3 nested mains on `/planner/open3d`)

| Layer | File | Element |
|-------|------|---------|
| Layout shell | `site/features/planner/components/PlannerLayoutShell.tsx` | `<main id="main-content">` |
| Route host | `site/features/planner/open3d/ui/Open3dNativeHost.tsx` | `<div role="main" aria-label="Planner workspace">` |
| Workspace canvas | `site/features/planner/open3d/editor/WorkspaceShell.tsx` | `<main className={styles.canvas}>` |

Also present (proof variant only; live open3d uses `variant="embedded"` which was already a `div`):

| Layer | File | Element |
|-------|------|---------|
| Feasibility proof shell | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | `<main className="feasibility-shell">` |

Admin risk (legacy shell + layout both exposing main):

| Layer | File | Element |
|-------|------|---------|
| Admin route layout | `site/app/admin/layout.tsx` | `<main id="main-content">` |
| AdminLayoutShell content | `site/features/planner/admin/AdminLayoutShell.tsx` | already `<div className="shell-admin-main">` (OK) |
| Legacy AdminShell | `site/features/admin/ui/AdminShell.tsx` | `<main className="shell-admin-main">` |

## After — single main per layout

### Planner (`/planner/*` including open3d)

| Layer | File | Element after |
|-------|------|---------------|
| **Only main** | `PlannerLayoutShell.tsx` | **`<main id="main-content">`** (kept — skip-link target) |
| Route host | `Open3dNativeHost.tsx` | `<div className="open3d-route-host">` — removed `role="main"` + label |
| Canvas column | `WorkspaceShell.tsx` | `<div className={styles.canvas} id=…-canvas>` |
| Proof shell | `FeasibilityCanvas.tsx` | `<div className="feasibility-shell" aria-label=…>` |

### Admin (`/admin/*`)

| Layer | File | Element after |
|-------|------|---------------|
| **Only main** | `site/app/admin/layout.tsx` | **`<main id="main-content">`** (kept) |
| Content frame | `AdminLayoutShell.tsx` | `<div className="shell-admin-main">` (unchanged) |
| Legacy shell | `AdminShell.tsx` | `<div className="shell-admin-main">` |

## Static verification (re-check 2026-07-09)

```
site/features/planner  →  only PlannerLayoutShell.tsx:<main id="main-content">
site/app/admin         →  only layout.tsx:<main id="main-content">
site/features/admin    →  no <main> / role="main"
site/app/planner       →  no <main> / role="main"
```

Evidence files:

- `grep-main-after.txt` — inventory after edits / re-verify
- `files-touched.txt` — changed paths

## Non-goals (out of scope for this ticket)

- No token / visual redesign
- No `any` introduced
- A2 (unlabeled field), A3 (viewport hydration), A4–A6 not addressed here
- No live browser re-capture required for nested-main structural claim (static DOM ownership is definitive for element tags)

## Done criteria

- [x] One `main` on planner layout path (`#main-content`)
- [x] Inner open3d host / canvas / feasibility proof no longer expose `main`
- [x] One `main` on admin layout path (`#main-content`)
- [x] AdminShell aligned with AdminLayoutShell (`div.shell-admin-main`)
- [x] Evidence under `results/planner/p0-3-a11y-main/`
