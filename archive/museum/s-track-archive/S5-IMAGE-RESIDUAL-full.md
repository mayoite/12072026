# D5 ΓÇö Catalog image residual

**Date:** 2026-07-10  
**Track:** D5 only (D4 closed)  
**Package:** `site/lib/assetPaths.ts`, `site/lib/catalog/adapters.ts` (+ unit tests)  
**Out of scope:** locked CSS, homepage vanity, marketing pages, catalog JSON / R2 data migration

## Problem

Phase 3 (`IMAGE-PATHS.md`) fixed pad/ext/nearest-sibling for seating-style `image-N` paths. Residual catalog rows still pointed at:

1. **CMS-hash basenames** under `/images/catalog/686d3b55ΓÇª_name.jpg` (no product folder in the path)
2. **Wrong imported trees** (`/images/products/imported/ΓÇª`) while real assets live under `/images/catalog/{slug}/image-*.jpg`
3. **Short marketing slugs** (`fluid-x`, `sway`, `myel`) whose folders are `oando-seating--{slug}`

Those miss FS pad/ext/sibling because the **folder name in the path is wrong**, not the image index.

## Code change

| File | Change |
|------|--------|
| `site/lib/assetPaths.ts` | `isProductImageFallback`, `listCatalogSlugImages`, `resolveProductCatalogAssets` ΓÇö after preferred path fails, list `/images/catalog/{slug}/image-*` (exact folder, else unique `--{slug}` suffix) |
| `site/lib/catalog/adapters.ts` | `normalizeProducts` / `toCompatProduct` use slug-aware resolve (not bare `normalizeAssetPath` alone) |
| tests | assetPaths slug-folder cases; adapters keep jsdom client path-keep expectation |

Server-only FS (same pattern as pad/sibling). Catalog adapters run on the server for product listing SSR.

## Probe (local catalog index)

```text
node ../results/site/ui-websuite-products/_probe-d5-slug.mjs
# from site/
```

| Metric | Count |
|--------|------:|
| Catalog products | **279** |
| Flagship OK path-only (pad/ext/sibling) | **221** |
| Flagship OK after slug-folder | **268** |
| **Slug-folder wins** | **47** |
| Still miss (need assets / JSON migration) | **11** |

### Via breakdown

| via | count |
|-----|------:|
| path (pad/ext/sibling on raw) | 221 |
| slug-folder | 47 |
| miss | 11 |

### Sample wins (raw ΓåÆ disk)

| Slug | Catalog raw (broken) | Resolved |
|------|----------------------|----------|
| `oando-workstations--adaptable` | `/images/catalog/686d3b55ΓÇª_hat_2a.jpg` | `ΓÇª/oando-workstations--adaptable/image-1.jpg` |
| `oando-tables--convesso` | `ΓÇª/686d3b55ΓÇª_convesso.jpg` | `ΓÇª/oando-tables--convesso/image-1.jpg` |
| `oando-educational--audi-chair` | `/images/products/imported/lab-furniture/image-1.webp` | `ΓÇª/oando-educational--audi-chair/image-1.jpg` |
| `fluid-x` (short) | `/images/products/fluid-x-chair-1.webp` | `ΓÇª/oando-seating--fluid-x/image-1.webp` |
| `myel` / `sway` / storage shorts | missing flat products paths | `oando-seating--*` / `oando-storage--*` folders |

## Residual honesty ΓÇö needs data migration / asset import

**Path code cannot invent files.** These **11** still miss after slug-folder:

| Slug | Raw path | Why |
|------|----------|-----|
| `collaborate-table` | `/images/products/meeting-table-6pax.webp` | file absent; no catalog folder |
| `compact-meeting-table` | same | same |
| `executive-meeting-table` | `/images/products/meeting-table-10pax.webp` | file absent |
| `nuvora-pod` | `/images/products/nuvora-pod-1.webp` | file absent; no folder |
| `nuvora-pod-2` | `ΓÇª/nuvora-pod-2.webp` | same |
| `nuvora-pod-3` | `ΓÇª/nuvora-pod-3.webp` | same |
| `cafeteria-seating` | `/images/products/chair-cafeteria.webp` | file absent |
| `conference-setup` | `/images/products/meeting table top render.webp` | file absent (spaces in name) |
| `paper-tray` | `/images/products/dauble paper tray.webp` | file absent |
| `tectara` | `/images/products/imported/workstations-copy/image-2.webp` | imported tree incomplete; no `*tectara*` catalog folder |
| `oando-soft-seating--tectara` | same imported path | no `oando-soft-seating--tectara` folder on disk |

**Next (not D5 path thrash):**

1. Import or generate assets into `public/images/catalog/{slug}/` **or**
2. Rewrite `localCatalogIndex.json` / CMS / R2 keys to real paths **or**
3. Drop orphan demo SKUs if not sellable

Optional later: fix `localCatalogIndex` hash paths to canonical folder paths so CDN/offline without FS still works. Resolver covers local SSR; canonical JSON remains cleaner.

## Tests

```text
cd site
pnpm exec vitest run tests/unit/lib/assetPaths.test.ts tests/unit/catalog-adapters.test.ts tests/unit/lib/catalog/fallback.test.ts
# 23/23 pass
```

## Commit

`fix(ui): D5 catalog image residual`
