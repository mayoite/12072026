# CSS restructure archive (2026-07-07)

Superseded paths from the `core/locked/{site,admin,planner}` flatten. **Do not import from live layouts.**

| Path | Was | Live replacement |
|------|-----|------------------|
| `core-planner/` | `app/css/core/planner/` fabric-era globals | `core/locked/planner/open3d-workspace.css` + CSS modules |
| `workspace-legacy.css` | `bundles/workspace.css` (never imported) | `open3d-workspace.css` |
| `ooplanner/` | `app/css/ooplanner/` globals barrel | `core/locked/planner/workspace-*.css` via `open3d-workspace.css` |
| `ooplanner/index.css`, `styles.css` | unused re-export stubs | archived under `ooplanner/` here |

Restore only for archaeology or contrast regression (`planner-catalog-sku-contrast.test.ts`).
