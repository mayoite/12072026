# Dependencies and engines

**Authority:** root `package.json` + `pnpm-lock.yaml` + live imports.  
**This file:** architectural limits only — not PASS proof.  
**Ship evidence:** `plan/TechStack/CHECKLIST.md` + `FEATURES.md`.

## Toolchain

| Item | Rule |
|------|------|
| Node | `>=24` (root `engines`) |
| pnpm | Root `packageManager` only (Corepack). Install **from repo root**. No install inside `site/` or `tech-docs-generator/`. |
| App | `site/` package `oando-site` (Next). Optional: `tech-docs-generator`. |

## Product engines

| Role | Package | Rule |
|------|---------|------|
| 2D canvas (Planner) | Fabric | Sole interactive 2D place canvas |
| 3D | Three.js + R3F + Drei | Bindings/helpers only |
| Freehand Admin SVG | `@excalidraw/excalidraw` | Stage only — not release authority |
| Parametric geometry | `makerjs` | **Only** pen for form/CLI/publish: `drawLinearDesk` / `renderLinearDeskSvg` → `compileMakerRecipeToPaths` |
| Admin / Planner shell chrome | Dockview + React Aria + Phosphor (+ Planner WorkspaceShell / CanvasToolRail for parametric Admin) | Shell only. Freehand Admin = Dockview host; parametric Admin = planner workspace chrome, not Fabric place canvas. No second geometry pen |
| Publish | Server compile + sanitize | Client engines do not authorize release |

No second general canvas engine. No pen switch for parametric.

## CSS homes (not engines — enforcement)

| Kind | Path |
|------|------|
| Tokens | `site/app/css/core/theme.css` — do not thrash for experiments |
| Shared chrome (docks, tool rail, studio helpers) | `site/app/css/core/locked/chrome/` |
| SVG paint / plan preview | `site/app/css/core/locked/svg/` |
| Admin shell pages | `site/app/css/core/locked/admin/` |
| Site marketing | `site/app/css/core/locked/site/` |
| Planner shell | `site/app/css/core/locked/planner/` + co-located modules for domain UI |

Semantic tokens only. No raw hex when a token exists.  
Hardcoding audits: `site/scripts/audit-hardcoded-detail.mjs`, `site/scripts/audit-tsx-hardcoded.mjs`.  
Policy: `Agents/Agents-09-css.md`, `docs/architecture/04-CSS-SOLUTION.md`.

## Package decisions

- Verify use before remove; license before add.  
- Prefer existing platform libs.  
- No competitor code, assets, models, or trade dress.  
- Record paid/restricted asset approval.

## i18n

| Item | Value |
|------|--------|
| Framework | `next-intl` on public Site only |
| Locales | `en` (default), `hi`, `fr`, `de`, `es` — `site/i18n/config.ts` |
| URLs | `localePrefix: 'never'` |
| Planner / Admin UI | English only |
| Parity | `pnpm --filter oando-site run check:i18n:parity` |

## Persistence / SVG authority

| Item | Rule |
|------|------|
| DB | Drizzle + `postgres` for Products / catalog DB work |
| Object storage | S3-compatible client → R2 for target artifacts |
| **Live SVG** | **Disk** — `inventory/descriptors/`, `public/svg-catalog/` |
| Dual-write | Optional when Products DB + R2 probe + pointer column (`resolveSvgPublishDualWriteDeps`) — **not** cutover |
| Cutover | Parent-seen place proof, then `SVG_RELEASE_AUTHORITY=db`. See `08-DATABASE-SVG-CONTRACT.md`, `Failures.md` |

## Catalog assets

Published SVG must be owned, licensed, or Oando-created. No agent `param-proof` pollution as suite food. Tests never mutate canonical catalog.

## Factory status (honesty)

| Gate | Status language |
|------|-----------------|
| K1–K3 Maker/form units | Unit path — not ship alone |
| C3 browser publish | Required for factory |
| C4 guest place + BOQ | Required for factory |
| DB-SVG cutover | After C4 place proof |

Operate per `docs/approach.md`. Process floor: `Agents.md`.
