# Phase 3 — Products seating image path honesty

**Date:** 2026-07-10  
**Package:** `site/lib/assetPaths.ts` (+ unit tests). Catalog adapters already call `normalizeAssetPath` / `normalizeAssetList` — no adapter API change.  
**Out of scope:** homepage, locked CSS, `FilterGrid.tsx` (helpers re-call normalize; fixed at source so re-entry is safe).

## Problem (honest)

Catalog JSON (`localCatalogIndex.json`) still carries many zero-padded webp paths (`image-01.webp`). Public disk is mixed:

| Pattern | Example |
|--------|---------|
| Unpadded webp only | `fluid-x/image-1.webp` (no `image-01.webp`) |
| Padded webp exists | `arvo/image-01.webp` (+ separate `image-1.jpg`) |
| Unpadded jpg only | `canaret/image-1.jpg` (no `image-1.webp`) |
| Missing index-1 | `casca/` has only `image-2.jpg`, `image-3.jpg` |

Prior server logic (zero-pad strip + extension swap) already fixed most pad/ext misses. Residual bugs:

1. **Client always unpadded** `image-01 → image-1`, destroying SSR-correct `image-01.webp` when client re-normalized (FilterGrid helpers).
2. **No same-folder sibling fallback** when index `1` is absent but `image-2.*` exists (casca, fluid).

## Code change

`site/lib/assetPaths.ts`:

1. **Client:** keep original path (no destructive unpad). Server + adapters do FS resolve; client re-entry must not undo it.
2. **Expand both pad directions:** `image-01` ↔ `image-1`.
3. **Server nearest-sibling:** if pad/ext miss, list product folder and pick exact index / nearest lower / first `image-*`.

Tests: `site/tests/unit/lib/assetPaths.test.ts` — 12/12 pass (`pnpm exec vitest run tests/unit/lib/assetPaths.test.ts`).

## Sample of 5 seating products (before → after)

Source: `localCatalogIndex.json` flagship paths vs `site/public/images/catalog/*`.

| # | Product / folder | Catalog raw (before) | Disk reality | Server before | Server after | Client before | Client after (re-entry) |
|---|------------------|----------------------|--------------|---------------|--------------|---------------|-------------------------|
| 1 | fluid-x (`oando-seating--fluid-x-with-headrest`) | `/images/catalog/oando-seating--fluid-x/image-01.webp` | has `image-1.webp`, not `image-01.webp` | `…/image-1.webp` ✓ | `…/image-1.webp` ✓ (pad) | `…/image-1.webp` ✓ | keeps SSR path; raw alone stays `image-01` (server owns resolve) |
| 2 | canaret | `…/canaret/image-01.webp` | `image-1.jpg` only for index 1 | `…/image-1.jpg` ✓ | `…/image-1.jpg` ✓ (ext) | `…/image-1.webp` ✗ | preserves server `…/image-1.jpg` when re-normalized |
| 3 | arvo | `…/arvo/image-01.webp` | **`image-01.webp` exists** (+ `image-1.jpg`) | `…/image-01.webp` ✓ | `…/image-01.webp` ✓ (exact) | `…/image-1.webp` ✗ | `…/image-01.webp` ✓ (no unpad) |
| 4 | casca | `…/casca/image-1.jpg` | only `image-2.jpg`, `image-3.jpg` | **null → placeholder** ✗ | `…/image-2.jpg` ✓ (nearest-sibling) | raw missing ✗ | preserves server `…/image-2.jpg` |
| 5 | phoenix | `…/phoenix/image-01.webp` | `image-01.webp` + `image-1.webp` + jpg | `…/image-01.webp` ✓ | `…/image-01.webp` ✓ | unpad happened to work | keeps `image-01.webp` ✓ |

### Path wins (this slice)

| Win | Count / note |
|-----|----------------|
| Seating flagships resolvable (pad/ext only) | **73 / 76** |
| After nearest-sibling | **76 / 76** (casca + fluid with/without headrest) |
| Client no longer breaks padded SSR paths | arvo / moonlight / spino-class folders |

## Residual (stop — needs data migration or asset import, not more path thrash)

**Seating (task scope):** none remaining for flagship paths under current public tree + resolver.

**Adjacent soft-seating / non-folder paths (out of phase package, documented only):**

| Slug | Raw path | Why path code cannot win |
|------|----------|---------------------------|
| `oando-soft-seating--brim` etc. | `/images/catalog/686d3b55…_brim_1.jpg` | CMS-hash filenames not present under catalog folders |
| `oando-soft-seating--tectara` | `/images/products/imported/workstations-copy/image-2.webp` | imported tree missing |
| `oando-soft-seating--twig` | `/images/products/imported/fluid/image-1.webp` | imported tree missing |
| Soft casca | `…/oando-soft-seating--casca/image-1.jpg` | folder has only `image-3.jpg`/`image-4.jpg` — sibling fallback **would** help if same code path runs (it does via normalizeProducts) |

Soft-seating residual with **wrong absolute basenames** needs catalog JSON / R2 migration, not more `assetPaths` heuristics.

**Client without prior server normalize:** raw `image-01.webp` that only exists as `image-1.jpg` still fails on pure client. Product listing path is adapter-normalized server-side first — acceptable.

**Phoenix special-case** in `normalizeAssetPath` (hardcodes jpg for indices 1–3) is legacy; disk now has webps. Left untouched (no thrash); exact resolve already hits `image-01.webp` before that branch when path is still padded webp — actually phoenix branch runs first for `.webp` under phoenix and rewrites to `image-1.jpg`. Works; not changed.

## Verify commands

```text
cd site
pnpm exec vitest run tests/unit/lib/assetPaths.test.ts
# optional probe (not required for CI):
node ../results/site/ui-websuite-products/_probe-image-paths.mjs
```

## Commit message (if code lands)

`fix(ui): phase3 product image path residual`
