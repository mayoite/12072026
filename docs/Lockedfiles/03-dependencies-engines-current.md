# Dependencies and engines

`package.json` + `pnpm-lock.yaml` are authoritative. This file records architectural limits.

**How to prove stack health / “done”:** `plan/TechStack/CHECKLIST.md` (evidence section + phases) and `plan/TechStack/FEATURES.md`. Update this file when engines or policy change; do not claim PASS from this list alone.

## Engines

| Role | Package | Rule |
|---|---|---|
| 2D canvas | Fabric | Sole interactive 2D engine |
| 3D | Three.js + R3F + Drei | Bindings/helpers only |
| Admin SVG authoring | `@excalidraw/excalidraw` | Embedded Excalidraw studio; host (`AdminSvgEditorShell`) owns dimensions, validation, draft state, compile, and publish |
| Parametric geometry pen (locked) | `makerjs` (Maker.js) — https://github.com/microsoft/maker.js | Owner-locked Part C pen. **Live form/CLI/publish** = Maker `drawLinearDesk` / `renderLinearDeskSvg` → `compileMakerRecipeToPaths` (`plan/Admin/CHECKLIST.md` Part C; K1–K3 unit-green; C3 browser OPEN). Template multipath deprecated residual only. Not freehand publish authority. Do not switch pens |
| Publish authority | Server compile + sanitize | Not client engines. Live SVG = **disk** until Failures.md cutover |

No second general canvas engine.

## Toolchain

Node and pnpm versions from root `package.json`. Install from repo root only. No nested lockfiles.

## Package decisions

Verify use before remove; verify license before add. Prefer existing platform libs. Record paid/restricted asset approval. No competitor code, assets, models, or trade dress.

## i18n

| Item | Value |
|---|---|
| Framework | `next-intl` only on public Site — no `react-intl`, `i18next`, etc. |
| Locales | `en` (default), `hi`, `fr`, `de`, `es` — `site/i18n/config.ts` |
| Negotiation | `site/proxy.ts` + `next-intl/middleware` |
| URLs | `localePrefix: 'never'` — `site/i18n/routing.ts` |
| Messages | `site/i18n/messages/`; parity manifest: `site/i18n/marketing-parity-manifest.json` |
| Parity gate | `pnpm --filter oando-site run check:i18n:parity` |
| SEO hreflang | `site/features/site/data/seo.ts` |
| Planner / Admin UI | English only — no partial locale without plan item |
| Analytics | `locale` field per `site/lib/analytics/conversionContract.ts` |

## Persistence

| Item | Rule |
|---|---|
| DB boundary | Drizzle + `postgres` for catalog/SVG DB work |
| Supabase client | No new `.from()` catalog or Planner path |
| Object storage | AWS S3 client → R2 immutable artifacts |
| Browser boundary | Server API only |
| New packages | None approved for DB-SVG cutover work |
| **Live SVG** | **Disk** — `inventory/descriptors/`, `public/svg-catalog/` |
| DB dual-write | Optional when Products DB configured **and** R2 ListObjects ok **and** pointer column present (`resolveSvgPublishDualWriteDeps`) — not release authority; cutover still OPEN |
| Cutover | `DB-SVG-01` … `05` in `docs/architecture/08-DATABASE-SVG-CONTRACT.md` |

## Catalog assets

Published SVG must be owned, licensed, or Oando-created. Provenance beside durable metadata. External benchmark images: reference only.
