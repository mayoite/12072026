# Admin features

Repo-sourced index: **plan phase → code path → honest gap**. Live code and fresh checks are authoritative.

| Doc | Role |
|---|---|
| `PHASES-01-02`, `PHASES-03-04` | What to build and prove |
| This file | What exists in code today |
| `CHECKLIST.md` | Open acceptance work only |

**Code roots:** `site/features/admin/` · `site/app/admin/` · `site/app/api/admin/` · `site/platform/drizzle/schema/catalog.ts` · `site/inventory/descriptors/` · `site/public/svg-catalog/`

**Manual SVG editor:** `@excalidraw/excalidraw` via `editor/ExcalidrawClient.tsx`. Retired: `SvgStudioCanvas` (SVG.js scene canvas; tests archived only). Not active: SVG-Edit iframe (`plan/svgblunder/`).

---

## Publish authority (repo truth)

| Surface | Disk | DB | Notes |
|---|---|---|---|
| `publishDescriptorWithPipeline.ts` | **Yes** (authority) | Optional additive | Comment: “Phase 2 disk-path mapping (not full Products DB transaction yet)” |
| `persistBlockDescriptor.ts` | `inventory/descriptors/` (`{slug}.{n}.json` + `.latest.json`) | No | |
| `svgPipelineRunner.ts` S4 | `public/svg-catalog/` | No | |
| `publishSvgEditorAction.ts` | Yes | Best-effort if `PRODUCTS_DATABASE_URL` | Injects `dbRepository`; failure logged, publish still succeeds |
| `POST /api/admin/svg-editor` | Yes | Best-effort if `PRODUCTS_DATABASE_URL` | `route.ts` injects `dbRepository` — parity with server action |
| Lifecycle manifest + audit log | `results/admin/catalog-ops/` | No | `_catalog-lifecycle.json`, `_descriptor-audit.jsonl` — not in `inventory/descriptors/` |

**UI admits disk authority:** `AdminSvgEditorListView.tsx` — “Source: local disk inventory · Products DB not live”.

**DB tables:** `svg_revisions`, `svg_revision_artifacts`, `block_descriptors` in schema + Supabase migration `20260714100000_create_svg_revisions.sql`. When `PRODUCTS_DATABASE_URL` is configured (repo-root `.env.local`), `DrizzleSvgRevisionPersistence.insertRevision` **upserts `svg_revisions` and `block_descriptors`** (`onConflictDoUpdate` on `slug`). Dual-write still uses a stub definition and a hardcoded `version: 1` / `{slug}-r1`-style revision id, so it is not yet a full revision-authority transaction.

---

## DB-SVG contract (repo truth)

| ID | Status | Evidence |
|---|---|---|
| 01 | Partial | Publish upserts `block_descriptors` when `PRODUCTS_DATABASE_URL` set; disk still the real authority (stub payload); no `published_svg_revision_id` product pointer |
| 02 | Partial | `descriptorLock.ts`, versioned disk files |
| 03 | Partial | `ImmutableSvgRevisionRepository` + unit tests; not live authority |
| 04 | Partial | Types exist; dual-write payload is stub |
| 05 | Open | No `published_svg_revision_id` pointer write |
| 06 | Disk only | Pipeline rollback tested; not one DB transaction |
| 07 | Source present; status unverified | Failed-publish rollback handling exists in `publishDescriptorWithPipeline.ts`; not run in this repair |
| 08 | Source present; status unverified | Idempotent unchanged-publish handling exists in `publishDescriptorWithPipeline.ts`; not run in this repair |
| 09 | Source present; status unverified | `staleDraftPublishGate.ts` is wired into the editor publish flow; not run in this repair |
| 10–16 | Partial (Planner consumer) | `svg-blocks/route.ts` → `loadBuyerVisibleDescriptorsWithDb()`: reads `block_descriptors` DB rows when configured (lifecycle-filtered), falls back to `loadBuyerVisibleDescriptors()` disk; reads definition JSON, not committed artifact bytes |
| 17 | Source present; status unverified | `scripts/svg-disk-db-dry-run.ts` inventories disk inputs and writes report output; it does not prove DB write or authority |
| 18 | Open | No parity tooling before cutover |
| 19 | Security track | CSRF/rate limits on admin routes exist |
| 20 | Partial | Tmp-dir pattern in unit/e2e publish; no automated canonical hash gate; some tests read canonical fixtures |

---

## Step 0 — test isolation

| Feature | Code | Gap |
|---|---|---|
| Tmp-dir catalog writes | `tests/unit/features/admin/svg-editor/`, `isolatedAdminSvgPublish.ts` | Convention, not CI hash gate |
| E2E isolated publish | `admin-svg-publish-p01.spec.ts`, `admin-svg-scene-publish-a401.spec.ts` | Uses `DEV_AUTH_BYPASS=1` |

---

## Phase 1 — Excalidraw-first authoring

Plan: `PHASES-01-02.md` (Phase 1)

| Feature | Code | Gap |
|---|---|---|
| SVG inventory + Excalidraw studio | `AdminSvgEditorListView.tsx`, `AdminSvgEditorShell.tsx`, `ExcalidrawClient.tsx`, `DimensionPanel.tsx`, `gridSnapping.ts`, `SvgEditorForm.tsx` | **Implemented** |
| Excalidraw draft persistence | `svgEditorFormState.ts` (`excalidrawElements`, `compiledSvg`), `svgEditorFormAdapters.ts`, `publishSvgEditorAction.ts` | Publish uses Excalidraw-exported SVG; legacy `sceneParts` bridge remains |
| Publish + compile | `publishDescriptorWithPipeline.ts`, `compileSvgForPublish`, `sharedCompilerAuthority.ts` | Disk authority; browser re-proof open |
| Supabase catalog mirror | `publishSymbolToSupabaseCatalog` via `catalogAssetStorage.server.ts` after publish | Best-effort; paths `planner-symbols/{slug}/symbol.svg` + `descriptor.json` for Planner CDN import |
| Planner-style export menu | `AdminSvgEditorTopBar` RAC Export (SVG / descriptor JSON / Open Planner) | Aligns chrome with Planner TopBar Export pattern |
| Undo / rollback / lock | `descriptorLock.ts`, `rollbackDescriptorVersion.ts`, `staleDraftPublishGate.ts` | **Implemented** |
| Bulk JSON import | `AdminSvgBulkImportPanel.tsx`, `bulkImportBlockDescriptors.ts` | **Implemented** (advanced path) |
| AI SVG generate | *(no route.ts; empty dir removed 2026-07-17)* | **Not implemented** |
| 3D previews | `GlbExtruderPreview.tsx`, `ModelViewerPreview.tsx` | Partial |
| `ADM-SVG-01`…`17`, shell, form, pub, a11y | Test sources in `tests/unit/features/admin/svg-editor/` | Not run in this repair |

---

## Phase 2 — catalog lifecycle and Planner handoff

Plan: `PHASES-01-02.md` (Phase 2)

| Feature | Code | Gap |
|---|---|---|
| Standard + configurator CRUD | `AdminCatalogManager.tsx`, `ConfiguratorCatalogPageView.tsx`, `app/api/admin/catalog/`, `catalogs/[type]/` | **Implemented** |
| Lifecycle / bulk | `catalogLifecycle.ts`, `bulkLifecycleBatch.ts`, `bulk-import/route.ts` | **Implemented** (disk manifest) |
| Planner consumer | `app/api/planner/catalog/svg-blocks/route.ts` | **DB-aware bridge** (`loadBuyerVisibleDescriptorsWithDb`) — `block_descriptors` rows when configured, disk fallback; not artifact bytes |
| `ADM-LIST-*`, `ADM-BULK-*`, `ADM-MOB-*`, `ADM-SVG-18` | List views, bulk panels, mobile CSS | Unit + partial Playwright |
| Ops surfaces | `AdminPlansPageView.tsx`, `AdminInventoryPageView.tsx`, themes, flags, analytics | **Implemented**; not all in `admin-phases-live` |
| Security | `requireCsrf`, rate limits on mutation routes | **Implemented** |

---

## Phase 3 — product families

Plan: `PHASES-03-04.md` (Phase 3)

| Feature | Code | Gap |
|---|---|---|
| Family form + persistence | `AdminProductFamilyForm.tsx`, `productFamilyPersistence.ts` | **Implemented** |
| Workstation families | `WorkstationFamilyAuthorFields.tsx`, `workstationFamilyRelease.ts` | **Implemented** |
| `ADM-FAM-01`, `ADM-FAM-02` | Contracts + form unit tests | Browser release journey open |
| 2D / 3D / BOQ parity | Planner configurator bridges | End-to-end browser proof open |

---

## Phase 4 — commercial governance

Plan: `PHASES-03-04.md` (Phase 4)

| Feature | Code | Gap |
|---|---|---|
| Price books (filesystem) | `AdminPriceBookPageView.tsx`, `priceBookService.ts`, `priceBookFileStore.ts` → `features/admin/data/price-books/` | **Implemented** |
| Governance API | `app/api/admin/price-books/[bookId]/action/route.ts` | **Implemented** |
| Retire / restore | `catalogRetirement.ts`, lifecycle PATCH, `admin-svg-retire-restore.spec.ts` | Source and browser spec exist; not run in this repair |
| `ADM-PUB-02`, `ADM-PRICE-*`, `ADM-ROLE-01`, `ADM-AUDIT-01` | Unit + `admin-pricing-pricebook-p05.spec.ts` | Current browser status not verified in this repair |
| CRM / queries | `features/crm/`, `app/admin/customer-queries/` | **localStorage demo** — not production CRM |

---

## APIs

| Route | Code | DB on publish |
|---|---|---|
| `POST /api/admin/svg-editor` | `app/api/admin/svg-editor/route.ts` | Optional dual-write |
| Server action publish | `publishSvgEditorAction.ts` | Optional dual-write |
| `POST .../bulk-import`, `.../lifecycle`, `.../rollback` | under `svg-editor/` | No |
| `GET/POST /api/admin/catalog`, `catalogs/[type]` | catalog routes | — |
| `GET/POST /api/admin/price-books` | price-book routes | — |

---

## Test inventory

| Suite | Path | Notes |
|---|---|---|
| SVG editor unit | `tests/unit/features/admin/svg-editor/` | Not run in this repair |
| Playwright admin | `tests/e2e/admin-phases-live.spec.ts`, `admin-svg-publish-p01.spec.ts`, `admin-pricing-pricebook-p05.spec.ts` | Not run in this repair; development-auth output would not prove production authorization |
| Auth smoke | `admin-smoke.spec.ts` via `pnpm run test:admin:production-auth` | Not run in this repair |
| Admin unit coverage | `vitest.admin.coverage.config.ts` | Not run in this repair; no current coverage status claimed |

---

## Reference (not truth)

`CHECKLIST.md` · `PHASES-01-02` · `PHASES-03-04` · `07-ADMIN-UI-BENCHMARK.md` · `08-DATABASE-SVG-CONTRACT.md`
