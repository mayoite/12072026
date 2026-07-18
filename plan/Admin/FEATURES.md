# Admin features

Repo-sourced index: **feature → code path → honest gap**. Live code and fresh checks are authoritative.

| Doc | Role |
|---|---|
| This file | Current code map and known gaps |
| `CHECKLIST.md` | Open / partial work only |
| `docs/architecture/07-ADMIN-UI-BENCHMARK.md` | UI bar (not PASS proof) |
| `docs/architecture/08-DATABASE-SVG-CONTRACT.md` | DB-SVG target IDs 01–20 |
| `docs/architecture/10-SECURITY-BENCHMARK.md` | Security bar |

**Only two plan docs per track:** `CHECKLIST.md` + `FEATURES.md`.

**Code roots:** `site/features/admin/` · `site/app/admin/` · `site/app/api/admin/` · `site/platform/drizzle/schema/catalog.ts` · `site/inventory/descriptors/` · `site/public/svg-catalog/` · `site/features/crm/` (Admin-mounted demo CRM)

**Manual SVG editor:** `@excalidraw/excalidraw` via `svg-editor/editor/ExcalidrawClient.tsx`. Retired: `SvgStudioCanvas` (archived tests only). Not active: SVG-Edit iframe (`plan/svgblunder/` reference only).

**Section labels A0–A11 below** are code-map areas. Open work lives in `CHECKLIST.md`.

**Status vocabulary:** OPEN / PARTIAL / FAIL / DONE. FEATURES never grants DONE alone.

**Execution status (2026-07-18):** dual-write batch 22/22 on owner env; disk live SVG authority; browser Admin smoke OPEN. See `CHECKLIST.md`.

---

## Publish authority (repo truth)

| Surface | Disk | DB | Notes |
|---|---|---|---|
| `publish/publishDescriptorWithPipeline.ts` | **Yes** (authority) | Optional dual-write | Comment: disk-path mapping; not full Products DB transaction |
| `storage/persistBlockDescriptor.ts` | `inventory/descriptors/` (`{slug}.{n}.json` + `.latest.json`) | No | |
| `publish/svgPipelineRunner.ts` S4 | `public/svg-catalog/` | No | |
| `publish/publishSvgEditorAction.ts` | Yes | Via `resolveSvgPublishDualWrite` | Only if Products DB **and** R2 ready |
| `POST /api/admin/svg-editor` | Yes | Same dual-write gate | `withAuth` admin + CSRF |
| `publish/resolveSvgPublishDualWrite.ts` | — | Injects `ImmutableSvgRevisionRepository` + R2 `putText` | Modes: `enabled` \| `skipped_no_db` \| `skipped_r2_unavailable` |
| Lifecycle manifest + audit | `results/admin/catalog-ops/` (gitignored) | No | Not durable product authority |

**UI admits disk authority:** `views/AdminSvgEditorListView.tsx` — local disk inventory messaging when DB not live.

**DB tables (schema present):** `svg_revisions`, `svg_revision_artifacts`, `block_descriptors` + migration `20260714100000_create_svg_revisions.sql`. Dual-write upserts exist in `storage/drizzleSvgPersistence.server.ts` but cutover incomplete (Failures.md). Stub/incomplete revision payload risk remains — treat DB as **not** release authority.

---

## DB-SVG contract map (repo truth)

| ID | Status | Evidence in code |
|---|---|---|
| 01 | OPEN | Disk authority live; DB not sole release authority |
| 02 | PARTIAL | `storage/descriptorLock.ts`, versioned disk files; DB draft lock not sole path |
| 03 | PARTIAL | `svgRevisionRepository.server.ts` + unit tests; not live authority |
| 04 | PARTIAL | Types/schemas; dual-write not full `PublishedRevisionV1` transaction |
| 05 | OPEN | No `published_svg_revision_id` product pointer write found as cutover |
| 06 | OPEN | Not one DB transaction with artifact upload + pointer + audit |
| 07 | PARTIAL | Disk rollback in `publishDescriptorWithPipeline.ts` (unit exists); DB pointer N/A |
| 08 | PARTIAL | Disk idempotent short-circuit; DB idempotency unproved as authority |
| 09 | PARTIAL | `lifecycle/staleDraftPublishGate.ts` wired on POST svg-editor |
| 10–12 | PARTIAL | Planner `app/api/planner/catalog/svg-blocks/route.ts` → `loadBuyerVisibleDescriptorsWithDb()`; DB rows when configured else disk; not committed artifact bytes by revision id |
| 13 | OPEN / Planner co-own | Pin revision on place — Planner track |
| 14–15 | PARTIAL | Server-only Drizzle patterns; degraded messaging incomplete for cutover |
| 16 | OPEN | Disk can still be what Planner falls back to |
| 17 | PARTIAL | `scripts/svg-disk-db-dry-run.ts` (report only; does not prove write authority) |
| 18 | OPEN | No parity tooling before cutover |
| 19 | PARTIAL | CSRF/rate limits on admin routes; unit static matrix complete (plan-A2); browser OPEN |
| 20 | PARTIAL | Tmp-dir unit/e2e patterns; no automated canonical hash gate |

---

## A0 — Test isolation

| Feature | Code | Gap |
|---|---|---|
| Tmp-dir catalog writes | `tests/e2e/helpers/isolatedAdminSvgPublish.ts`, `tests/unit/features/admin/svg-editor/publish/isolatedAdminSvgPublish.test.ts` | Convention; AF-12 CI hash gate open |
| E2E isolated publish | `tests/e2e/admin-svg-publish-p01.spec.ts`, `admin-svg-scene-publish-a401.spec.ts` | Often `DEV_AUTH_BYPASS`; not production-auth proof |
| Unit tree | `tests/unit/features/admin/**` (large: svg-editor, catalog, pricing, ui, …) | Not re-run this session |

---

## A1 — Shell, auth, navigation

| Feature | Code | Gap |
|---|---|---|
| Edge proxy | `site/proxy.ts` · `isProtectedPath` | Unauth `/admin/*` → `/access?next=…` when `DEV_AUTH_BYPASS` off |
| Layout auth | `app/admin/layout.tsx` → `requireAuthUser("/admin", "admin")` | Unit: layout calls requireAuthUser; production-auth smoke OPEN (AF-10) |
| API session | `app/api/admin/_lib/server.ts` · `requireAdminSession` | 401 no session / 403 non-admin when bypass off |
| withAuth admin | `features/shared/api/withAuth.ts` | role `admin` 401/403 when bypass off |
| Dev bypass | `lib/auth/devAuthBypass.ts` | `DEV_AUTH_BYPASS=1` + non-prod only; local interactive admin |
| Shell / nav | `ui/AdminLayoutShell.tsx`, `ui/adminNav.ts` | Groups Overview · Planner · Catalog · CRM · System |
| Dashboard | `dashboard/AdminDashboardPageView.tsx`, `app/admin/page.tsx` | Browser re-proof open |
| Mobile review helpers | `ui/adminMobileReview.ts` | AF-06 catalog phone unit PASS (A-W2); browser OPEN |

**Auth unit proof (bypass mocked off):** `tests/unit/proxy.test.ts`, `tests/unit/lib/auth/session.test.ts`, `tests/unit/app/api/admin/_lib/server.test.ts`, `tests/unit/features/shared/api/withAuth.test.ts`, `tests/unit/app/admin/layout.test.tsx`. Bypass-on probes are **not** deploy auth proof.

---

## A2 — Excalidraw-first authoring

Plan phase: see `CHECKLIST.md`.

| Feature | Code | Gap |
|---|---|---|
| SVG inventory list | `views/AdminSvgEditorListView.tsx`, `app/admin/svg-editor/page.tsx` | Bulk/advanced dominance AF-05; internal language AF-13 |
| Studio shell | `views/edit-shell/AdminSvgEditorShell.tsx`, `AdminSvgEditorTopBar.tsx`, rails, `useAdminSvgEditorPublish.ts` | Browser stage measurements open |
| Excalidraw | `editor/ExcalidrawClient.tsx`, `ExcalidrawCanvas.tsx`, `gridSnapping.ts`, `DimensionPanel.tsx` | Supported subset contracts unit-covered; full safe path open |
| Form / identity | `form/SvgEditorForm.tsx`, `svgEditorFormState.ts`, `svgEditorFormAdapters.ts`, `validateCoreProductFields.ts` | Legacy `sceneParts` bridge remains for old descriptors |
| Contracts | `contracts/svgBlockSchemas.ts`, `supportedSvgAuthoringSubset.ts`, `stageLayoutContract.ts` | — |
| AI SVG generate | *(no route)* | **Not implemented** (AF-11) |
| 3D previews | `publish/GlbExtruderPreview.tsx`, `ModelViewerPreview.tsx` | Partial / preview only |

---

## A3 — Publish pipeline

| Feature | Code | Gap |
|---|---|---|
| Publish core | `publish/publishDescriptorWithPipeline.ts` | Disk authority; DB transaction open |
| Server action | `publish/publishSvgEditorAction.ts` | Dual-write gated |
| HTTP publish | `app/api/admin/svg-editor/route.ts` | admin + CSRF |
| Compiler | `publish/sharedCompilerAuthority.ts`, planner `compileSvgForPublish` | Fail-closed before S4 |
| Dual-write resolve | `publish/resolveSvgPublishDualWrite.ts` | AF-02/18 |
| Rollback / lock / stale | `lifecycle/rollbackDescriptorVersion.ts`, `storage/descriptorLock.ts`, `lifecycle/staleDraftPublishGate.ts` | Disk-path proved in unit; browser open |
| Supabase symbol mirror | `catalogAssetStorage` paths via publish side effects | Best-effort CDN mirror; not authority |
| Export chrome | `views/edit-shell/AdminSvgEditorTopBar.tsx` RAC Export | Aligns with Planner export pattern |

---

## A4 — Catalog lifecycle and bulk

| Feature | Code | Gap |
|---|---|---|
| Managed products UI | `catalog/AdminCatalogManager.tsx`, `AdminCatalogPageView.tsx`, `AdminCatalogTable.tsx`, `app/admin/catalog/page.tsx` | AF-06 unit PASS (A-W2 cards-priority, labels, ≥44px + CSS); browser 390×844 OPEN |
| Configurator catalog | `catalog/ConfiguratorCatalogPageView.tsx`, `app/admin/planner-catalog/page.tsx` | Browser open |
| Workspace library | `workspace-catalog/AdminWorkspaceCatalogPageView.tsx` | Read-oriented |
| Catalog APIs | `app/api/admin/catalog/`, `catalogs/[type]/`, `configurator-catalog/`, `planner-catalog/` | CSRF on mutations |
| Lifecycle | `lifecycle/catalogLifecycle.ts`, `catalogLifecycle.db.server.ts`, `bulkLifecycleBatch.ts`, `catalogRetirement.ts` | Disk manifest + optional DB helpers |
| Lifecycle HTTP | `app/api/admin/svg-editor/[slug]/lifecycle/route.ts`, `rollback/`, `revisions/` | — |
| Bulk import | `views/AdminSvgBulkImportPanel.tsx`, `storage/bulkImportBlockDescriptors.ts`, `app/api/admin/svg-editor/bulk-import/route.ts` | Advanced path; UX dominance issue |
| Retire/restore e2e | `tests/e2e/admin-svg-retire-restore.spec.ts` | Not re-run this session |

---

## A5 — Product families

| Feature | Code | Gap |
|---|---|---|
| Family form | `catalog/AdminProductFamilyForm.tsx`, `productFamilyContract.ts` | Browser release journey open |
| Workstation | `workstation/WorkstationFamilyAuthorFields.tsx`, `workstationFamilyRelease.ts`, `workstationFamilyContract.ts` | End-to-end Planner parity open |

---

## A6 — Price books / commercial governance

| Feature | Code | Gap |
|---|---|---|
| UI | `pricing/AdminPriceBookPageView.tsx`, `app/admin/price-books/page.tsx` | Currency primary + Advanced minor units + activate primary unit-proven (AF-07); browser OPEN |
| Service / store | `pricing/priceBookService.ts`, `priceBookFileStore.ts` → `pricing/data/price-books/` | Filesystem authority for books |
| Drizzle store | `pricing/priceBookDrizzleStore.server.ts` | Present; cutover/usage honesty open |
| Governance | `pricing/priceBookGovernance.ts`, `priceBookGovernance.server.ts` | Unit exists |
| API | `app/api/admin/price-books/`, `[bookId]/action/route.ts` | — |
| Browser spec | `tests/e2e/admin-pricing-pricebook-p05.spec.ts` | Not re-run this session |

---

## A7 — DB-SVG cutover

| Feature | Code | Gap |
|---|---|---|
| Repository | `svg-editor/svgRevisionRepository.server.ts` | Interface + tests; not sole authority |
| Drizzle persistence | `storage/drizzleSvgPersistence.server.ts` | Upsert path; incomplete cutover |
| Dual-read harness | `storage/dualReadHarness.ts` | Support tooling |
| Active blocker | `Failures.md` | DB-SVG authority open until dual-write + pointer + Planner bytes proved |

---

## A8 — Planner / consumer handoff

| Feature | Code | Gap |
|---|---|---|
| Planner SVG blocks API | `app/api/planner/catalog/svg-blocks/route.ts` | DB-aware + disk fallback (AF-17) |
| Buyer-visible loaders | `lifecycle/catalogLifecycle.ts`, `catalogLifecycle.db.server.ts` | Definition rows ≠ artifact bytes |
| Portal SVG catalog | `app/(site)/portal/svg-catalog/page.tsx` | Disk `loadBuyerVisibleDescriptors` |

---

## A9 — Ops surfaces

| Feature | Code | Gap |
|---|---|---|
| Plans | `plans/AdminPlansPageView.tsx`, `AdminPlanDetailPageView.tsx`, `app/api/admin/plans/` | Browser open |
| Features | `feature-flags/AdminFeatureFlagsPageView.tsx`, `app/api/admin/features/route.ts` | — |
| Analytics | `analytics/AdminAnalyticsPageView.tsx`, `app/api/admin/analytics/route.ts` | — |
| Themes | `app/admin/themes/`, `app/api/admin/themes/` | — |
| Inventory map | `inventory/AdminInventoryPageView.tsx` | — |
| Settings | `settings/AdminSettingsPageView.tsx` | — |

---

## A10 — CRM (Admin-mounted)

| Feature | Code | Gap |
|---|---|---|
| CRM hub | `app/admin/crm/page.tsx` → `CrmHubView` + `CrmSubnav` | **Hub page** (not redirect-only); unit `tests/unit/app/admin/crm/page.test.tsx` |
| CRM routes | `app/admin/crm/**` | **localStorage demo** (`features/crm/`, banners); not production |
| Customer queries | `app/admin/customer-queries/` + `api/customer-queries/manage` | **Server-backed** Supabase inbox; auth = admin session **or** `CUSTOMER_QUERIES_ADMIN_TOKEN` (distinct from CRM demo store) |
| Honesty | `CrmDemoBanner.tsx`, `CrmWorkspaceBanner.tsx` | AF-08 unit PASS — localStorage + "not production CRM" labelled; browser OPEN |

---

## A11 — Security (Admin surface)

| Feature | Code | Gap |
|---|---|---|
| Layout role | `requireAuthUser` admin | Unit gate PARTIAL; production-auth OPEN |
| API auth | `requireAdminSession` and/or `withAuth({ role: "admin", requireCsrf: true, rateLimit… })` | Unit 401/403 with bypass off; full route matrix open |
| Dev bypass | `lib/auth/devAuthBypass.ts` | Must be excluded from production-auth PASS |
| SVG safety | compile/sanitize server path | Regex helpers elsewhere are not sufficient authority (security benchmark) |

---

## APIs (inventory)

| Route | Code | Notes |
|---|---|---|
| `POST /api/admin/svg-editor` | `app/api/admin/svg-editor/route.ts` | Publish + dual-write gate |
| `…/svg-editor/bulk-import` | `bulk-import/route.ts` | |
| `…/svg-editor/[slug]/lifecycle` | `lifecycle/route.ts` | |
| `…/svg-editor/[slug]/rollback` | `rollback/route.ts` | |
| `…/svg-editor/[slug]/revisions` | `revisions/route.ts` | |
| `GET/POST /api/admin/catalog`, `catalog/[id]` | catalog routes | CSRF on write |
| `…/catalogs/[type]`, `configurator-catalog`, `planner-catalog` | | |
| `GET/POST/action /api/admin/price-books` | price-book routes | |
| `…/plans`, `features`, `analytics`, `themes` | ops routes | |

---

## Test inventory

| Suite | Path / command | Notes |
|---|---|---|
| Auth gate unit | proxy, session, `requireAdminSession`, withAuth admin, admin layout | Bypass **off** for unauth paths |
| CRM hub unit | `tests/unit/app/admin/crm/page.test.tsx` | Hub vs legacy redirect |
| Dual-write unit | `tests/unit/features/admin/svg-editor/publish/resolveSvgPublishDualWrite.test.ts` | Modes honest |
| Admin unit | `tests/unit/features/admin/` | Extensive |
| Admin coverage | `pnpm run test:coverage:admin` → `vitest.admin.coverage.config.ts` | No current coverage % claimed |
| p0 SVG publish | `pnpm run p0:admin-svg` | OPEN this session |
| Retire/restore | `pnpm run test:e2e:admin-retire-restore` | OPEN |
| Price book e2e | `tests/e2e/admin-pricing-pricebook-p05.spec.ts` | OPEN |
| Phases live | `tests/e2e/admin-phases-live.spec.ts` | OPEN; dev-auth ≠ production |
| Production auth | `pnpm run test:admin:production-auth` | OPEN (AF-10) |
| Inventory preview | `tests/e2e/admin-svg-inventory-preview-p01.spec.ts` | OPEN |

---

## Reference (not PASS proof)

`CHECKLIST.md` · `07-ADMIN-UI-BENCHMARK.md` · `08-DATABASE-SVG-CONTRACT.md` · `10-SECURITY-BENCHMARK.md` · `../../Failures.md`
