# CSS ownership

Shared system: `site/app/css/`.

## Rules

- TSX: structure and behavior. CSS: repeated presentation and surface layout.
- Semantic tokens only — no raw palette values, no inline colors to bypass tokens.
- One global styling tree. Extract shared primitives only after repeated real use.
- Light product surfaces use the **ecru paper stack** (`--color-ecru-*` via `--surface-*` in `theme.css`). Cool pure-white-only shells fail the product bar.
- Do **not** thrash `theme.css` for feature experiments.
- Hardcoding audits (use on UI CSS/TSX changes):  
  `node site/scripts/audit-hardcoded-detail.mjs` · `node site/scripts/audit-tsx-hardcoded.mjs`

## Surface roots (live)

| Surface | Root |
|---|---|
| Tokens | `site/app/css/core/theme.css` |
| Site marketing | `site/app/css/core/locked/site/` |
| Admin pages / primitives / SVG shell | `site/app/css/core/locked/admin/` |
| Shared studio chrome (docks, tool rail, studio helpers) | `site/app/css/core/locked/chrome/` |
| SVG paint / plan preview tokens & plates | `site/app/css/core/locked/svg/` |
| Planner shell / marketing planner | `site/app/css/core/locked/planner/` |
| Planner domain UI | Co-located CSS modules next to features (e.g. `workspace.module.css`) — **not** shared dock/tool-rail chrome |

## Import order (Admin)

Admin index loads **chrome before svg paint**, then admin shell:

`locked/chrome` → `locked/svg` → admin pages / `svg-editor-shell.css`.

Form/parametric stage must **not** inherit freehand graph-paper background. Freehand canvas stage may keep grid; form stage is solid panel (`data-stage-engine="form-maker"` / `.admin-parametric-stage`).

## Shell chrome package (Admin + Planner)

| Surface | Pattern |
|---|---|
| Planner TopBar | brand \| center packs \| actions; ecru panel |
| Admin shell header | Same language; ecru, not ocean dark brand bar |
| Admin list toolbars | `.admin-toolbar` |
| SVG studio topbar | `svg-editor-shell.css` + parametric helpers in `locked/chrome/studio-chrome.css` |
| Dock modules | `locked/chrome/*-dock.module.css`, `canvas-tool-rail.module.css` — import from components |

After shared CSS changes: `pnpm --filter oando-site run lint:ui` (strict: `lint:ui:strict`) and focused browser checks where UI acceptance applies.

Detail for engines/packages: `12-DEPENDENCIES-ENGINES.md`. Process: `Agents/INDEX.md`.
