# UI execution — current (locked)

**Baseline:** 2026-07-05  
**Cross-links:** [`docs/architecture/README.md`](../../architecture/README.md) · [`MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) · [`MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) · [`ui/MODULE-UI-CONTRACT-Locked.md`](../ui/MODULE-UI-CONTRACT-Locked.md)

| Topic | On disk today | Paths / evidence |
|--------|---------------|------------------|
| UI phase | **UI-0 done** (tokens, ThemeEditor outlier, `lint:ui` warn) — **UI-1 planner shell next** | `archive/Plans/01-execution/specialists/06-UI-PLAN.md`, `ayushdocs/SESSION-RECAP.md` |
| CSS ownership | `app/css/` canonical; Tailwind v4 engine in `index.css` | `docs/architecture/CSS-SOLUTION.md` |
| Planner styling | CSS modules + `planner-*.css`; split token names historically (`--planner-primary` vs `--planner-accent`) | `site/app/css/core/locked/planner/` |
| Open3d layout | Real pilot route loads `open3d-workspace.css` bundle | `app/planner/open3d/layout.tsx`, `app/planner/open3d/page.tsx` |
| Admin styling | `admin-pages.css` + mixed Tailwind utilities on many routes | `site/app/css/core/locked/admin/` |
| ThemeEditor | **Fixed 2026-07-05** — admin tokens; no `slate-*` / `blue-*` | `app/admin/themes/` |
| Admin outliers | Other admin pages may still use ad hoc utilities | `app/admin/**` |
| Site marketing | Strongest token use (`typ-*`, scheme utilities) | `site/app/css/core/locked/site/` |
| Lint | `lint:ui` (warn); `lint:ui:strict` exists; **not** in `release:gate:fast` yet | `site/scripts/lint-ui-contract.mjs` |
| Rejected options | **Option F** (design-system / Storybook program) rejected — not pursuing | `CSS-SOLUTION.md`, `MODULE-UI-CONTRACT.md` |
| Drift risk | **High** on new modules without checklist | — |

## Packages (on disk)

| Tool | Role |
|------|------|
| Tailwind v4 | Base engine via `@import "tailwindcss"` |
| CSS modules | Open3d editor layout |
| `@phosphor-icons/react` | Partial open3d chrome; Lucide still present in places |
| `lucide-react` | Admin + some planner-adjacent |
| `react-resizable-panels` | Installed; open3d uses custom docking |
| `@ark-ui/react` | In `package.json`; unused in UI |

## Summary

Three styling dialects remain (site / planner modules / admin utilities). **UI-0 is complete** — token drift reduced and ThemeEditor palette abuse fixed. **UI-1 (planner open3d L1 shell)** is the active execution lane. New modules are still the main drift vector until module contract + strict lint land.

## Strengths

- Canonical tokens in `site/app/css/core/theme.css`; planner semantic layer exists
- Open3d pilot route (`/planner/open3d`) loads full workspace bundle — not redirect-only
- Automated `lint:ui` started (warn mode)

## Weaknesses

- No PR-blocking strict lint yet (`lint:ui:strict` not in `release:gate:fast`)
- L1 open3d shell incomplete (resize, status strip, Phosphor audit)
- Admin pages inconsistent beyond ThemeEditor
- No `open3dIconPolicy.test.ts` yet (planned TEST-1)
