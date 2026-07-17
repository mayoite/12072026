# CSS ownership

Shared system: `site/app/css/`.

## Rules

- TSX: structure and behavior. CSS: repeated presentation and surface layout.
- Semantic tokens only — no raw palette values, no inline colors to bypass tokens.
- Surface bundles allowed for Site, Admin, Planner. Planner CSS modules may co-locate with components.
- One global styling tree. Extract shared primitives only after repeated real use.
- Light product surfaces use the **ecru paper stack** (`--color-ecru-*` via `--surface-*` in `theme.css`). Cool pure-white-only shells fail the product bar.

## Surface roots

| Surface | Root |
|---|---|
| Tokens | `site/app/css/core/theme.css` (`--surface-page` = ecru-50, etc.) |
| Site | `site/app/css/core/locked/site/` |
| Admin | `site/app/css/core/locked/admin/` (`admin.css`, primitives, SVG studio shells) |
| Planner | `site/app/css/core/locked/planner/` + co-located CSS modules (`workspace.module.css`, …) |

## Shell chrome package (Admin + Planner)

| Surface | Pattern |
|---|---|
| Planner TopBar | brand \| center packs \| actions; flat hairline; ecru panel (`pw-topbar` / workspace modules) |
| Admin shell header | Same package (`shell-admin-topbar`); ecru, not ocean dark brand bar |
| Admin list toolbars | `.admin-toolbar` ecru strip |
| SVG studio topbar | ecru flat chrome under `svg-editor-shell.css` |

After styling changes: `pnpm --filter oando-site run lint:ui` (strict: `lint:ui:strict`) and focused browser checks where UI acceptance applies.
