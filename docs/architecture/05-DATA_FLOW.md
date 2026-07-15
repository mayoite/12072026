# Product data flow

## Live path — disk SVG (2026-07)

1. Admin edits in SVG studio (`site/features/admin/svg-editor/`).
2. Validate + compile in `publishDescriptorWithPipeline.ts`.
3. SVG bytes → `site/public/svg-catalog/`; descriptor JSON → `site/inventory/descriptors/` (`{slug}.json` / `{slug}.{n}.json` / `{slug}.latest.json`).
4. Lifecycle/audit → `results/admin/catalog-ops/` when configured.
5. Both publish entrypoints contain a best-effort Products DB adapter behind `PRODUCTS_DATABASE_URL`, but the SVG tables have no released migration yet. This path is not production authority; failures are logged and disk wins.
6. The Planner `svg-blocks` route contains an awaited DB-read adapter with disk fallback. Treat it as pre-cutover code until the schema migration and isolated database verification close `DB-SVG-01..05`. `Block2D` remains the loading/missing-SVG fallback.

Both publish paths behave the same way: DB dual-write is a best-effort stub, so failed compile/write keeps the prior on-disk release and disk stays the real authority.

## Target path — Products DB

1. Admin edits draft product + SVG scene.
2. Server validation (identity, dimensions, structure, safety).
3. Deterministic SVG compile → immutable R2 artifact upload.
4. One Products DB transaction: metadata, same-product pointer, audit.
5. Planner loads released catalog + exact revision bytes via server API.
6. `Block2D` only while loading or unavailable.

Failed compile/upload/transaction leaves prior publication intact. Upload is not released until DB pointer commits.

## Customer planning

Guest/member route → one normalized document for canvas, 3D, save, export → placed products keep catalog identity/options → save failure never shows success → reload restores document.

## BOQ handoff

Placed catalog products → stable product/option IDs → branded JSON/CSV/PDF → customer review → submit to Oando destination → store revision, BOQ hash, consent, status → retry with idempotency key. No commercial pricing without approved authority.

## Storage authority

| Layer | Target role | Live (2026-07) |
|---|---|---|
| Products DB | Release identity + pointer | Marketing + managed catalog only for SVG |
| R2 artifacts | Immutable SVG bytes | Planned |
| Disk descriptors | Migration/fixtures | **Live SVG authority** |
| R2 catalog snapshot | Degraded read only | Active fallback |
| Admin drafts | Private | Private |

Contract: `08-DATABASE-SVG-CONTRACT.md`.
