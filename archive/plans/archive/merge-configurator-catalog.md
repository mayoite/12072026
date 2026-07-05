# Plan: Merge configurator catalog into planner workspace library

**Status:** **Implemented** (2026-06-28) — configurator read path + store merge. Seed rows via `seed_configurator_catalog.ts` for live panel proof.  
**Updated:** 2026-06-28  
**Owner action required:** approve / amend / reject before §11 execution.  
**Reference rules:** `AGENTS.md` (minimum change; no migration apply without explicit request; log gaps in `Failures.md`).  
**Related:** [`docs/audit/database/database-structure.md`](../docs/audit/database/database-structure.md), [`docs/database/SEEDING.md`](../docs/database/SEEDING.md)

---

## 0. Current state (verified 2026-06-28)

### Database (products Supabase) — live

| Table | Migration | Live | Rows |
|-------|-----------|------|------|
| `configurator_products` | `20260601120000_create_configurator_products.sql` | yes | seed-dependent |
| `planner_managed_products` | `20260628100000_create_planner_managed_products_and_feature_flags.sql` | yes | **0** |
| `feature_flags` | same file | yes | **0** |

`pnpm --filter oando-site run db:apply -- --dry` → **none pending**.

Seed configurator rows (optional, owner-run):

```powershell
pnpm --filter oando-site exec npx tsx scripts/seed_configurator_catalog.ts
```

### Code — what exists today

| Piece | Status |
|-------|--------|
| Admin CRUD for `configurator_products` | **Done** — `lib/api/catalogAdminHandlers.ts`, `/api/admin/catalogs/configurator` |
| Admin CRUD for `planner_managed_products` | **Done** — same handlers, `/api/admin/catalogs/standard` |
| Public planner read: managed | **Done** — `GET /api/planner/catalog` → `createAdminServiceClient()` → `managedProductRowToCatalogItem` |
| Public planner read: configurator | **Missing** — no route, no client fetcher, no store wiring |
| Workspace hydration | **2-layer only** — `catalogStore.hydrateCatalog` merges static + managed via `mergeWorkspaceCatalogItems` |
| Typed mapper `rowToProduct` | **Done** — `lib/catalog/configuratorCatalog.ts` |

**Gap unchanged:** configurator catalog has admin writes and DB persistence but **zero planner-side readers**.

---

## 1. Goal (single sentence)

Make every product in **`configurator_products`** (typed as `Product` in `lib/catalog/types.ts`) appear in the **planner workspace library** (`features/planner/catalog/*` → `CatalogPanel` / `CatalogSidebar`) as a draggable `CatalogItem`, preserving parametric / discrete / fixed sizing semantics and deduplicating against static + `planner_managed_products`.

---

## 2. Why this is a real merge (not a UI tweak)

Three catalogs, three types, three sources:

| # | Catalog | Type | Source | Consumer |
|---|---------|------|--------|----------|
| 1 | **Static workspace** | `CatalogItem` | `workspaceCatalog.ts` + `generatedCatalogItems*.ts` | Planner panel, drag/drop, BOM |
| 2 | **Planner-managed** | `PlannerManagedProductRow` → `CatalogItem` | `planner_managed_products` via `/api/planner/catalog` | Same; merged in `catalogStore.hydrateCatalog` |
| 3 | **Configurator** | `Product` (`sizingType: parametric \| discrete \| fixed`) | `configurator_products` | Admin only today — **no planner reader** |

Footprint semantics differ — must not confuse units:

- `CatalogItem.widthMm` / `heightMm` are **catalog cm units** (`millimetersToCatalogCmFields` divides real mm by 10).
- `Product.workstation` / `sizeOptions` / `defaultFootprint` carry **true millimetres**.

This requires a typed bridge + new read path, not a rename. Wrong units → **10× canvas scale bug**.

---

## 3. Scope

### In scope

1. Typed adapter: `Product` → `CatalogItem` (all three `sizingType` paths).
2. Server read path: `configurator_products` → new public API route.
3. Store integration: third source in `catalogStore.hydrateCatalog` (parallel fetch).
4. Layered deduplication (§4) — id + sku eviction so managed overrides configurator for the same slug.
5. Default parametric footprint: smallest valid combination.
6. Vitest unit + integration coverage.
7. `Failures.md` follow-ups for any gap discovered.

### Out of scope

- Schema changes to `configurator_products` or `planner_managed_products`.
- New migration apply (tables already live).
- UI redesign of `CatalogPanel` / `CatalogSidebar`.
- Marketing `catalog_products` table.
- AI advisor / sketch-to-plan.
- Regenerating `lib/supabase/types.ts` (follow-up, not blocker).

### Explicit non-goals

- Do not delete `planner_managed_products` (admin-curated surface).
- Do not change `CatalogItem` shape unless a consumer truly needs a new optional field.
- Do not remove static `workspaceCatalog.ts` items (offline / unauth baseline).

---

## 4. Precedence and deduplication

Layer order (weakest → strongest):

```
static workspace  →  configurator catalog  →  planner_managed_products
```

### Merge mechanics (corrected after repo audit)

`mergeWorkspaceCatalogItems` today keys **only by `CatalogItem.id`** (`mergeCatalogItems.ts`). That stays the base mechanism.

| Source | `CatalogItem.id` | `CatalogItem.sku` |
|--------|------------------|-------------------|
| Static | stable string ids from TS arrays | often same as id |
| Configurator (new bridge) | `product.slug` | `product.slug` |
| Managed (existing bridge) | `row.id` (uuid) | `row.slug` |

Because managed ids are uuids, **id-only merge cannot express “managed wins over configurator for same slug”**. Extend merge with **sku-aware eviction**:

When applying a layer, for each incoming item:

1. Collect eviction keys: `[item.id, item.sku].filter(Boolean)`.
2. Remove any existing map entry whose `id` **or** `sku` matches an eviction key.
3. Insert the incoming item keyed by `id`.

Apply layers in order: static → configurator → managed. Result:

- Same slug in static + configurator → configurator wins.
- Same slug in configurator + managed → managed wins (managed sku evicts configurator id/sku).
- Same id in static + managed → managed wins (existing behaviour, covered by `planner-catalog-merge.test.ts`).

Add `mergeWorkspaceCatalogItemsLayered(...layers: CatalogItem[][])`; keep the existing 2-arg export as a thin wrapper for BC.

---

## 5. Footprint mapping

Bridge `Product → CatalogItem` via `productToCatalogItem(product: Product): CatalogItem | null`.

Reuse `millimetersToCatalogCmFields`, `mapAdminCategoryToWorkspace`, `shapeTypeForCategory` from `managedProductCatalogBridge.ts`.

### 5a. `fixed`

- Source: `product.defaultFootprint = { L, D, H? }` (mm).
- Map: `widthMm = round(L/10)`, `heightMm = round(D/10)`, `depthMm = round((H ?? 750)/10)`.

### 5b. `discrete`

- Source: `product.sizeOptions[]`.
- Default: **one** `CatalogItem` per `Product` using smallest variant by `L × D` (sort ascending; first wins).
- SKU picker per variant = follow-up TODO.

### 5c. `parametric` (workstations)

- Source: `product.workstation`.
- Default: smallest valid combo — `length = min(lengthOptions)`, `depth = min(depthOptions)`, seaters = `min(seaterOptions)` (usually 1).
- `straight`: `L = seaters × length`; `D = depth` (NS) or `depth × 2` (SH).
- `l-shape`: bounding box with `L1 = L2 = min(lengthOptions)`.
- Height: 750 mm default.
- Return `null` (do not throw) on invalid shape; log count in tests.

### 5d. Category mapping

- `Product.category_id` + `Product.family` → `mapAdminCategoryToWorkspace` + `shapeTypeForCategory`.

### 5e. Bridge ids

- Set `CatalogItem.id = product.slug`, `sku = product.slug`, `tags` includes `"configurator"`.

---

## 6. Read path

### 6a. New API route

- **Path:** `site/app/api/planner/catalog/configurator/route.ts` (GET).
- **Client:** `createAdminServiceClient()` from `app/api/admin/_lib/server.ts` — **same as** existing `GET /api/planner/catalog` (not anon SSR). Returns `{ items: [], source: "none" }` when env missing.
- **Query:** `configurator_products` where `active = true`, ordered by `updated_at desc`, limit ≤ 500.
- **Map:** DB row → `rowToProduct` (`lib/catalog/configuratorCatalog.ts`) → `productToCatalogItem`.
- **Response:** `{ success: true, items: CatalogItem[], source: "configurator_products", total }`.
- **Telemetry:** mirror `applyPlannerRouteTelemetry` on the managed route.
- **RLS:** migration policy `configurator_products public read active` exists; service role bypasses RLS anyway — **verified in migration** (`20260601120000`).

Alternative (combined payload in `/api/planner/catalog`) rejected — mixed sources and precedence are clearer as separate endpoints unless metrics show double-fetch cost.

### 6b. Client fetcher

- **New:** `features/planner/catalog/configuratorCatalogApi.ts`.
- Mirrors `plannerCatalogApi.ts` → `browserApiFetch(apiPath("/api/planner/catalog/configurator"))`.
- On non-ok: `{ items: [], source: "static" }` (same silent UX as managed fetch).

### 6c. Store integration

Extend `catalogStore.ts`:

- Add `configuratorCount: number`.
- `hydrateCatalog`: `Promise.all([fetchPlannerCatalogItems(), fetchConfiguratorCatalogItems()])`.
- Merge: `mergeWorkspaceCatalogItemsLayered(PLANNER_CATALOG_ITEMS, configuratorItems, managedItems)`.
- `catalogSource`: composite when multiple layers load, e.g. `"static+configurator+managed"` or `"static+managed"` when configurator empty — see §10 Q2.
- Extend `usePlannerCatalogHydration` return type if UI needs `configuratorCount` (optional; can stay internal initially).

---

## 7. Files to add / edit / leave

### Add

| File | Purpose |
|------|---------|
| `features/planner/catalog/configuratorProductCatalogBridge.ts` | `productToCatalogItem` + sizing helpers |
| `features/planner/catalog/configuratorCatalogApi.ts` | Browser fetch |
| `app/api/planner/catalog/configurator/route.ts` | Server reader |
| `tests/unit/planner-catalog-configuratorProductCatalogBridge.test.ts` | Adapter unit tests |
| `tests/unit/planner-catalog-store-merge-configurator.test.ts` | Layered merge + store (or extend `planner-catalog-merge.test.ts`) |

### Edit

| File | Change |
|------|--------|
| `features/planner/catalog/mergeCatalogItems.ts` | `mergeWorkspaceCatalogItemsLayered` + sku eviction |
| `features/planner/catalog/catalogStore.ts` | Third source, `configuratorCount`, parallel fetch |
| `features/planner/catalog/usePlannerCatalogHydration.ts` | Optional: expose `configuratorCount` |
| `Failures.md` | Close merge blocker when done; log runtime E2E as permissioned |

### Leave alone

- `lib/catalog/configuratorCatalog.ts`, `configuratorCatalogPayload.ts`
- `lib/api/catalogAdminHandlers.ts`
- `workspaceCatalog.ts`, `generatedCatalogItems*.ts`
- `managedProductCatalogBridge.ts` (reuse exports; no signature changes)
- DB migrations (already applied)

---

## 8. Test plan

### 8a. Adapter unit

File: `tests/unit/planner-catalog-configuratorProductCatalogBridge.test.ts`

- `fixed` `{ L: 1500, D: 750 }` → `{ widthMm: 150, heightMm: 75, depthMm: 75 }`.
- `discrete` with 3 options → one item, smallest `L×D`.
- `parametric` straight → smallest seaters × min length.
- `parametric` l-shape → min length both arms.
- Invalid product → `null`, no throw.
- Category smoke: `workstations` → `desks`; `storage` → `storage`.
- Bridge sets `id` and `sku` to `product.slug`.

### 8b. Merge / store

Extend or add tests alongside `tests/unit/planner-catalog-merge.test.ts`:

- Layered merge: same slug static + configurator → configurator wins.
- Same slug configurator + managed → managed wins (sku eviction).
- Same id static + managed → managed wins (regression).
- One fetch fails → other layers still merge.
- Mock both API fetchers in store test.

### 8c. Existing tests (must stay green)

- `tests/unit/catalog-configuratorCatalog.test.ts`
- `tests/unit/catalog-configuratorCatalogPayload.test.ts`
- `tests/unit/planner-catalog-catalogStore.test.ts`
- `tests/integration/planner-catalog-managedProducts.test.ts`

### 8d. Manual / Playwright (permissioned)

- Planner with seeded configurator rows → items in `CatalogPanel`.
- Drag parametric item → smallest footprint, not placeholder.
- Managed product with same slug as configurator → managed entry shown.

---

## 9. Risks

| # | Risk | Mitigation |
|---|------|------------|
| 1 | mm vs catalog-cm → 10× scale | Single chokepoint `productToCatalogItem`; numeric unit tests |
| 2 | Parametric default looks wrong | Smallest combo + 1 seater; document; SKU picker follow-up |
| 3 | Two API calls on hydrate | `Promise.all`; static items render immediately |
| 4 | Empty `configurator_products` | Empty array; planner = static + managed only |
| 5 | Cross-source duplicate slugs | Sku-aware layered merge (§4) |
| 6 | RLS blocks read | **Resolved** — public-active policy in migration; route uses service role like managed |
| 7 | Static slug worse than configurator | Configurator layer overwrites static by id/sku |
| 8 | `planner_managed_products` empty | Merge still works; configurator + static only until admin seeds managed rows |
| 9 | Untyped Supabase client (`any`) | Pre-existing; regenerate types is follow-up, not merge blocker |

---

## 10. Open questions (owner answers before implementation)

**Resolved since original plan:**

- ~~Missing `planner_managed_products` migration~~ → applied `20260628100000` (2026-06-28).
- ~~RLS for configurator read~~ → policy exists; service role used on public route.

**Still need answers:**

1. **Discrete products: 1 catalog item or N?**  
   Default: **1** (smallest variant). Alternative: N items (one per SKU).

2. **`catalogSource` label.**  
   Default: composite string `"static+configurator+managed"`. Alternative: booleans `{ hasStatic, hasManaged, hasConfigurator }`.

3. **Empty-configurator UX.**  
   Default: silent (no panel hint). Alternative: small “configurator not loaded” hint.

4. **Precedence sanity.**  
   Confirm `static → configurator → managed` (§4). Alternative: `static → managed → configurator` if admin overrides should lose to parametric defs (unlikely).

5. **One endpoint vs two.**  
   Default: new `/api/planner/catalog/configurator`. Alternative: combined `/api/planner/catalog` payload.

6. **Parametric default seaters.**  
   Default: `min(seaterOptions)`. Alternative: fixed 2 seaters.

7. **Supabase client for new route.**  
   Default: **`createAdminServiceClient()`** (matches existing managed route). Alternative: anon SSR client (RLS policy allows public active read).

---

## 11. Execution order (when approved)

Vitest only; no Playwright without permission (`AGENTS.md`).

1. `configuratorProductCatalogBridge.ts` — all `sizingType` paths + invalid → `null`.
2. `tests/unit/planner-catalog-configuratorProductCatalogBridge.test.ts` → green.
3. `configuratorCatalogApi.ts`.
4. `app/api/planner/catalog/configurator/route.ts`.
5. `mergeWorkspaceCatalogItemsLayered` in `mergeCatalogItems.ts` (sku eviction).
6. Wire `catalogStore.hydrateCatalog` (parallel fetch + layered merge + `configuratorCount`).
7. Merge/store tests → green.
8. `pnpm run typecheck` + `pnpm run lint`.
9. Scoped: `pnpm --filter oando-site exec vitest run tests/unit/planner-catalog-merge.test.ts tests/unit/planner-catalog-catalogStore.test.ts tests/unit/planner-catalog-configuratorProductCatalogBridge.test.ts`.
10. Update `Failures.md` (close configurator merge item; log permissioned E2E).
11. Report **Done · Verified · Skipped · Risks · Next**.

**Stop after step 11.** No commits, no new migrations, no Playwright, no `release:gate` unless you request.

---

## 12. What this plan does not promise

- Configurator items may not match managed items visually — same category heuristics as managed bridge.
- BOM/pricing correctness beyond canvas placement.
- Permissioned E2E proof without Playwright approval.
- Automatic seed of `configurator_products` or `planner_managed_products` — run seed scripts or admin CRUD separately.

---

## 13. Ready-to-go check

Before approving, confirm:

- [ ] Precedence §4 (`static → configurator → managed` + sku eviction).
- [ ] §10 Q1 (discrete = 1 vs N).
- [ ] §10 Q5 (one vs combined endpoint).
- [ ] §10 Q7 (default: service role client).

Optional: seed configurator rows so runtime smoke shows more than static catalog after merge.

Once answered, execute §11 and stop with the standard report.
