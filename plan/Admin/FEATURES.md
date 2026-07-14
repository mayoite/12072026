# Admin features

Repo-sourced index: **plan phase → code path → honest gap**. Reconciled against `site/` on 2026-07-14.

| Doc | Role |
|---|---|
| `PHASE-01` … `PHASE-04` | What to build and prove |
| This file | What exists in code today |
| `CHECKLIST.md` | Open acceptance work only |

**Code roots:** `site/features/admin/` · `site/app/admin/` · `site/app/api/admin/` · `site/platform/drizzle/schema/catalog.ts` · `site/block-descriptors/` · `site/public/svg-catalog/`

---

## Publish authority (repo truth)

| Surface | Disk | DB | Notes |
|---|---|---|---|
| `publishDescriptorWithPipeline.ts` | **Yes** (authority) | Optional additive | Comment: “Phase 2 disk-path mapping (not full Products DB transaction yet)” |
| `persistBlockDescriptor.ts` | `block-descriptors/` | No | |
| `svgPipelineRunner.ts` S4 | `public/svg-catalog/` | No | |
| `publishSvgEditorAction.ts` | Yes | Best-effort if `PRODUCTS_DATABASE_URL` | Injects `dbRepository`; failure logged, publish still succeeds |
| `POST /api/admin/svg-editor` | Yes | **No** | `route.ts` calls pipeline without `dbRepository` |
| Lifecycle manifest + audit log | `results/admin/catalog-ops/` | No | `_catalog-lifecycle.json`, `_descriptor-audit.jsonl` — not in `block-descriptors/` |

**UI admits disk authority:** `AdminSvgEditorListView.tsx` — “Source: local disk inventory · Products DB not live”.

**DB tables:** `svg_revisions`, `svg_revision_artifacts` in schema + Supabase migration `20260714100000_create_svg_revisions.sql`. **`block_descriptors` table is never written.** Dual-write uses stub definition and hardcoded `{slug}-r1` revision id.

---

## DB-SVG contract (repo truth)

| ID | Status | Evidence |
|---|---|---|
| 01 | Open | Disk is live authority; Planner reads disk; no product→revision pointer |
| 02 | Partial | `descriptorLock.ts`, versioned disk files |
| 03 | Partial | `ImmutableSvgRevisionRepository` + unit tests; not live authority |
| 04 | Partial | Types exist; dual-write payload is stub |
| 05 | Open | No `published_svg_revision_id` pointer write |
| 06 | Disk only | Pipeline rollback tested; not one DB transaction |
| 07 | Done (disk) | Failed publish preserves prior release |
| 08 | Done (disk) | Idempotent unchanged publish |
| 09 | Done (disk) | `staleDraftPublishGate.ts` |
| 10–16 | Open (Planner consumer) | `svg-blocks/route.ts` → `loadBuyerVisibleDescriptors()` from disk |
| 17 | Open | No SVG disk→DB dry-run tooling |
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

## Phase 1 — SVG-first authoring

Plan: `PHASE-01-authoring-quality.md`

| Feature | Code | Gap |
|---|---|---|
| SVG inventory + studio | `AdminSvgEditorListView.tsx`, `SvgStudioCanvas.tsx`, `SvgEditorForm.tsx` | **Implemented** |
| Publish + compile | `publishDescriptorWithPipeline.ts`, `compileSvgForPublish`, `sharedCompilerAuthority.ts` | Disk authority; browser re-proof open |
| Undo / rollback / lock | `descriptorLock.ts`, `rollbackDescriptorVersion.ts`, `staleDraftPublishGate.ts` | **Implemented** |
| Bulk JSON import | `AdminSvgBulkImportPanel.tsx`, `bulkImportBlockDescriptors.ts` | **Implemented** (advanced path) |
| AI SVG generate | `app/api/admin/svg-editor/ai-generate/route.ts` | **Implemented** |
| 3D previews | `GlbExtruderPreview.tsx`, `ModelViewerPreview.tsx` | Partial |
| `ADM-SVG-01`…`17`, shell, form, pub, a11y | Unit coverage in `tests/unit/features/admin/svg-editor/` (208 tests, 2026-07-13) | Fresh browser proof; prod auth smoke |

---

## Phase 2 — catalog lifecycle and Planner handoff

Plan: `PHASE-02-catalog-lifecycle.md`

| Feature | Code | Gap |
|---|---|---|
| Standard + configurator CRUD | `AdminCatalogManager.tsx`, `ConfiguratorCatalogPageView.tsx`, `app/api/admin/catalog/`, `catalogs/[type]/` | **Implemented** |
| Lifecycle / bulk | `catalogLifecycle.ts`, `bulkLifecycleBatch.ts`, `bulk-import/route.ts` | **Implemented** (disk manifest) |
| Planner consumer | `app/api/planner/catalog/svg-blocks/route.ts` | **Disk bridge** — not DB bytes |
| `ADM-LIST-*`, `ADM-BULK-*`, `ADM-MOB-*`, `ADM-SVG-18` | List views, bulk panels, mobile CSS | Unit + partial Playwright |
| Ops surfaces | `AdminPlansPageView.tsx`, `AdminInventoryPageView.tsx`, themes, flags, analytics | **Implemented**; not all in `admin-phases-live` |
| Security | `requireCsrf`, rate limits on mutation routes | **Implemented** |

---

## Phase 3 — product families

Plan: `PHASE-03-product-families.md`

| Feature | Code | Gap |
|---|---|---|
| Family form + persistence | `AdminProductFamilyForm.tsx`, `productFamilyPersistence.ts` | **Implemented** |
| Workstation families | `WorkstationFamilyAuthorFields.tsx`, `workstationFamilyRelease.ts` | **Implemented** |
| `ADM-FAM-01`, `ADM-FAM-02` | Contracts + form unit tests | Browser release journey open |
| 2D / 3D / BOQ parity | Planner configurator bridges | End-to-end browser proof open |

---

## Phase 4 — commercial governance

Plan: `PHASE-04-commercial-governance.md`

| Feature | Code | Gap |
|---|---|---|
| Price books (filesystem) | `AdminPriceBookPageView.tsx`, `priceBookService.ts`, `priceBookFileStore.ts` → `features/admin/data/price-books/` | **Implemented** |
| Governance API | `app/api/admin/price-books/[bookId]/action/route.ts` | **Implemented** |
| Retire / restore | `catalogRetirement.ts`, `placementPolicyForLifecycle` | Unit only; live Planner canvas open |
| `ADM-PUB-02`, `ADM-PRICE-*`, `ADM-ROLE-01`, `ADM-AUDIT-01` | Unit + `admin-pricing-pricebook-p05.spec.ts` | Retire/restore browser journey incomplete |
| CRM / queries | `features/crm/`, `app/admin/customer-queries/` | **localStorage demo** — not production CRM |

---

## APIs

| Route | Code | DB on publish |
|---|---|---|
| `POST /api/admin/svg-editor` | `app/api/admin/svg-editor/route.ts` | No |
| Server action publish | `publishSvgEditorAction.ts` | Optional dual-write |
| `POST .../bulk-import`, `.../lifecycle`, `.../rollback` | under `svg-editor/` | No |
| `GET/POST /api/admin/catalog`, `catalogs/[type]` | catalog routes | — |
| `GET/POST /api/admin/price-books` | price-book routes | — |

---

## Tests (repo truth)

| Suite | Path | Notes |
|---|---|---|
| SVG editor unit | `tests/unit/features/admin/svg-editor/` | 208 tests, exit 0 on 2026-07-13 |
| Playwright admin | `tests/e2e/admin-phases-live.spec.ts`, `admin-svg-publish-p01.spec.ts`, `admin-pricing-pricebook-p05.spec.ts` | `DEV_AUTH_BYPASS=1`; evidence `results/admin/2026-07-13T-admin-phases-final/` |
| Auth smoke | `admin-smoke.spec.ts` | Skipped when bypass on |

---

## Reference (not truth)

`CHECKLIST.md` · `PHASE-01` … `PHASE-04` · `07-ADMIN-UI-BENCHMARK.md` · `08-DATABASE-SVG-CONTRACT.md`
