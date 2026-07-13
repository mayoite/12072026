# Module layout

## Repository

| Path | Ownership |
|---|---|
| `site/app/` | Routes, layouts, and API handlers. Keep them thin. |
| `site/features/` | Product behavior and domain UI. |
| `site/components/` | Shared and marketing presentation. |
| `site/lib/` | Pure utilities, shared data, and server helpers. |
| `site/platform/` | Database and external platform clients. |
| `site/app/css/` | Shared styling system. |
| `site/config/` | Build and route configuration. |
| `site/tests/` | Unit, integration, and browser tests. |
| `site/public/` | Public static catalog and product assets. |
| `site/scripts/` | Repository tooling. |

## Product roots

| Area | Root |
|---|---|
| Planner workspace | `site/features/planner/editor/` |
| 2D canvas | `site/features/planner/canvas/` |
| Planner document | `site/features/planner/project/` |
| 3D view | `site/features/planner/3d/` |
| Planner routes | `site/app/planner/` |
| Admin routes | `site/app/admin/` |
| Admin inventory tools | `site/features/planner/admin/` |
| Catalog contract | `site/lib/catalog/` and planner catalog adapters |
| Published SVG | `site/public/svg-catalog/` |
| Catalog descriptors | `site/block-descriptors/` |

Do not create parallel planner, catalog, or canvas trees.

Move code only when a live dependency requires it.
