# CSS ownership

Shared system: `site/app/css/`.

## Rules

- TSX: structure and behavior. CSS: repeated presentation and surface layout.
- Semantic tokens only — no raw palette values, no inline colors to bypass tokens.
- Surface bundles allowed for Site, Admin, Planner. Planner CSS modules may co-locate with components.
- One global styling tree. Extract shared primitives only after repeated real use.

## Surface roots

| Surface | Root |
|---|---|
| Tokens | `site/app/css/core/theme.css` |
| Site | `site/app/css/core/locked/site/` |
| Admin | `site/app/css/core/` (admin surface files) |
| Planner | `site/app/css/core/locked/planner/` + co-located CSS modules |

After styling changes: `pnpm --filter oando-site run lint:ui` (strict: `lint:ui:strict`) and focused browser checks where UI acceptance applies.
