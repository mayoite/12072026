# CSS ownership

`site/app/css/` is the shared styling system.

## Rules

- TSX owns structure and behavior.
- CSS owns repeated presentation and surface layout.
- Use semantic tokens instead of raw palette values.
- Site, Admin, and Planner may have surface bundles.
- Planner CSS modules may live with Planner components.
- Do not create a second global styling tree.
- Do not add inline colors to bypass tokens.
- Extract a shared primitive only after repeated real use.

## Surface roots

| Surface | Style root |
|---|---|
| Shared tokens | `site/app/css/core/theme.css` |
| Site | `site/app/css/core/locked/site/` |
| Admin | Admin surface files under `site/app/css/core/` |
| Planner | `site/app/css/core/locked/planner/` and Planner CSS modules |

Run the existing UI lint and focused browser checks after styling changes.
