# Locked surface modules

Only folder under `core/` besides flat base files. Three path segments: `core` / `locked` / `{site|admin|planner}`.

```text
app/css/core/locked/{site|admin|planner}/
  index.css              # site shell entry (site + planner root)
  *.css                  # shell-*, home-*, bundle aggregators, route leaves
```

| Layout | Imports |
|--------|---------|
| `app/(site)/layout.tsx` | `locked/site/index.css` + bundle siblings |
| `app/admin/layout.tsx` | `locked/admin/index.css` |
| `app/planner/layout.tsx` | `locked/site/index.css` |
| `app/planner/(marketing)/` | `locked/planner/marketing.css` |
| `app/planner/(workspace)/` | `locked/planner/open3d-workspace.css` |

`workspace-*.css` — open3d editor/canvas globals (formerly `app/css/ooplanner/`). Imported only through `open3d-workspace.css`.

Base fundamentals (`theme.css`, `utilities.css`, `components.css`) are siblings in `core/` — not inside `locked/`.
