# Dependencies and engines

Live package files and `pnpm-lock.yaml` are authoritative.

This file records architectural limits.

## Engines

- Fabric is the sole interactive 2D canvas engine.
- Three.js is the 3D engine.
- React Three Fiber and Drei are Three.js bindings and helpers.
- SVG.js is used by the Admin SVG authoring surface.
- Server SVG compilation and sanitization remain the publish authority.
- Do not add a second general canvas engine.

## Toolchain

- Use the Node version declared by root `package.json`.
- Use the pnpm version declared by root `package.json`.
- Install only from the repository root.
- Do not maintain nested lockfiles.

## Package decisions

- Verify a package is used before removing it.
- Verify its license before adding it.
- Prefer existing platform libraries when they meet the need.
- Record paid or restricted asset approval before use.
- Do not copy competitor code, assets, models, or trade dress.

## Internationalization (i18n)

- `next-intl` is the sole i18n layer for public Site marketing pages.
- Do not add a second i18n framework (`react-intl`, `i18next`, etc.).
- Supported locales: `en` (default), `hi`, `fr`, `de`, `es` — declared in `site/i18n/config.ts`.
- Locale negotiation runs in `site/proxy.ts` via `next-intl/middleware`.
- Routing uses `localePrefix: 'never'` — no locale segment in public URLs (`site/i18n/routing.ts`).
- Message catalogs live in `site/i18n/messages/`. Wave-1 parity locales and namespaces are declared in `site/i18n/marketing-parity-manifest.json`.
- Marketing copy parity is gated by `pnpm --filter oando-site run check:i18n:parity` (`site/scripts/check-i18n-key-parity.mjs`).
- SEO hreflang alternates use the same locale list via `site/lib/site-data/seo.ts`.
- Planner and Admin workspace UI are English-only today. Do not wire partial locale without an explicit plan item.
- Conversion analytics carry a `locale` field where the contract requires it (`site/lib/analytics/conversionContract.ts`).

## Persistence

- Drizzle and `postgres` are the catalog and SVG database boundary.
- Do not add a new Supabase `.from()` catalog or Planner path.
- The installed AWS S3 client covers immutable R2 artifact storage.
- The server API is the browser boundary.
- No new package is approved for this work.
- SVG publish and Planner catalog read are **disk-authoritative** today (`block-descriptors/`, `public/svg-catalog/`).
- Optional additive DB dual-write exists on the Admin server-action publish path only when `PRODUCTS_DATABASE_URL` is set. It is not live authority. `block_descriptors` and product revision pointers are not fully wired.
- Cutover to DB authority requires `DB-SVG-01` … `DB-SVG-05` in `plan/Admin/CHECKLIST.md`.

## Catalog assets

- Published SVG must be owned, licensed, or created for Oando.
- Provenance belongs beside durable asset metadata.
- External benchmark images are reference only.
