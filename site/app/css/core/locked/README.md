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

`workspace-*.css` — planner editor/canvas globals (formerly `app/css/ooplanner/`). Imported only through `open3d-workspace.css`.

**Fence:** do not rename `open3d-workspace.css` / `open3d.css` / class prefixes here without a deliberate CSS unlock. Filenames are historical; live product is Fabric host on `/planner/guest` + `/planner/canvas`.

Base fundamentals (`theme.css`, `utilities.css`, `components.css`) are siblings in `core/` — not inside `locked/`.
