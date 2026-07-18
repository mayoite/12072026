# Admin features

Repo-sourced index: **feature → code path → honest gap**. Live code and fresh checks are authoritative.

| Doc | Role |
|---|---|
| This file | Current code map and known gaps |
| `CHECKLIST.md` | Evidence + phases + Part C execution spine |
| `IMPLEMENTATION-PLAN.md` | Bite-sized K1→C4 implementation tasks |
| `REALITY-AND-STACK.md` | Market reality + locked engines |
| `docs/architecture/07-ADMIN-UI-BENCHMARK.md` | UI bar (not PASS proof) |
| `docs/architecture/08-DATABASE-SVG-CONTRACT.md` | DB-SVG target IDs 01–20 |
| `docs/architecture/10-SECURITY-BENCHMARK.md` | Security bar |

**Code roots:** `site/features/admin/` · `site/app/admin/` · `site/app/api/admin/` · `site/platform/drizzle/schema/catalog.ts` · `site/inventory/descriptors/` · `site/public/svg-catalog/` · `site/features/crm/` (Admin-mounted demo CRM)

**Manual SVG editor:** `@excalidraw/excalidraw` via `svg-editor/editor/ExcalidrawClient.tsx`. Retired: `SvgStudioCanvas` (archived tests only).

**Section labels A0–A11** are code-map areas. Open work lives in `CHECKLIST.md`.

**Status vocabulary:** OPEN / PARTIAL / FAIL / DONE. FEATURES never grants DONE alone.

**Execution status (re-verify):** disk live SVG authority; dual-write optional; parametric form exists but **not Maker-only (K1 OPEN)** — form/compile/CLI call template `renderLinearDeskSvg`; browser Admin/guest smoke OPEN.

---

## Stack (locked — one line)

**Maker.js pen · eng type drawers · Admin forms (no code) · Fabric place · Dockview + React Aria chrome · AI field draft only after C2 (never geometry).**

| Component | Link | Pin (site) |
|-----------|------|------------|
| Monorepo | https://github.com/mayoite/12072026 | origin |
| Maker.js | https://github.com/microsoft/maker.js | `makerjs` `^0.19.2` |
| Fabric.js | https://github.com/fabricjs/fabric.js | `fabric` `7.4.0` |
| Excalidraw (draft only) | https://github.com/excalidraw/excalidraw | `@excalidraw/excalidraw` `^0.18.1` |

**Import:** planner `units` + `asset-engine` (this monorepo) + Maker npm. **Not:** https://github.com/cvdlab/react-planner or full GitHub planner apps.

**Do not switch pens.** Detail: `REALITY-AND-STACK.md`. Tasks: `IMPLEMENTATION-PLAN.md`. Spine: `CHECKLIST.md` Part C.

---

### Parametric brand library (CHECKLIST Part C)

| Surface | Path | Gap |
|---|---|---|
| Linear desk fields (Zod + fit) | `features/planner/asset-engine/svg/parametric/linearDeskFields.ts` | PARTIAL (unit) — exact: `type`, `widthMm`, `depthMm`, `heightMm`, `topThicknessMm`, `pedestalWidthMm`, `pedestalInsetMm`, `pedestalTopGapMm`, `pedestalBackInsetMm`, `pedestalCount` 0\|2, `modesty`, `seriesId`, `name`, `sku`, `slug` |
| Template draw + SVG | `…/parametric/drawLinearDeskFromTemplate.ts` · `renderLinearDeskSvg` | PARTIAL — **still form/publish pen (K1 OPEN)** |
| Maker recipes | `features/planner/asset-engine/svg/makerJsRecipes.ts` — `buildLinearDeskMakerModel`, `buildLDeskMakerModel`, `buildMakerModel` | PARTIAL (unit); fewer knobs than schema (inset hard-coded constants) |
| Maker → path `d` | `features/planner/asset-engine/svg/makerJsToPath.ts` — `compileMakerRecipeToPaths` | PARTIAL (unit) |
| Parametric barrel | `features/planner/asset-engine/svg/parametric/index.ts` | PARTIAL — re-exports **template** today |
| CLI JSON → SVG | `scripts/render-linear-desk.mts` · `scripts:render-linear-desk` | PARTIAL — uses template `renderLinearDeskSvg`; default `results/admin/parametric/` |
| Form model mm/cm | `features/admin/svg-editor/parametric/linearDeskFormModel.ts` | PARTIAL (unit) — uses `units.ts`; maps full schema incl. topGap/backInset |
| Compile + sanitise | `features/admin/svg-editor/parametric/compileLinearDeskSvg.ts` | PARTIAL (unit) — template draw |
| Form UI + preview | `features/admin/svg-editor/parametric/LinearDeskParametricForm.tsx` | PARTIAL — browser OPEN; preview = **template** not Maker; **no UI** for pedestalTopGap / pedestalBackInset (defaults only) → K3 OPEN |
| Publish action | `features/admin/svg-editor/parametric/publishLinearDeskAction.ts` | PARTIAL — browser OPEN; disk pipeline; SVG still template |
| Route | `app/admin/svg-editor/parametric/page.tsx` | PARTIAL |
| List CTA | `svg-editor/views/AdminSvgEditorListView.tsx` | PARTIAL |
| Units | `features/planner/model/units.ts` — `displayValueToMm`, `mmToDisplayValue` | DONE (API) |
| Catalog write isolation | `svg-editor/storage/catalogWriteIsolation.ts` | DONE (unit A0) |
| Sample bar | `public/svg-catalog/sample-desk-1.svg` | reference |
| Planner place + BOQ | guest inventory / place | OPEN (C4) |

**Verified call chain (K1 still OPEN):**

```text
LinearDeskParametricForm → renderLinearDeskSvg (barrel)
compileLinearDeskSvg → renderLinearDeskSvg
scripts/render-linear-desk.mts → renderLinearDeskSvg
renderLinearDeskSvg → drawLinearDeskFromTemplate (NOT Maker)
```

Maker path exists for pipeline IR (`normalizeDescriptorForPipeline` optional `maker` → `compileMakerRecipeToPaths`) but parametric form does **not** use it yet.

---

## Publish authority (repo truth)

| Surface | Disk | DB | Notes |
|---|---|---|---|
| `publish/publishDescriptorWithPipeline.ts` | **Yes** (authority) | Optional dual-write | Not full Products DB transaction |
| `storage/persistBlockDescriptor.ts` | `inventory/descriptors/` (`{slug}.{n}.json` + `.latest.json`) | No | |
| `publish/svgPipelineRunner.ts` S4 | `public/svg-catalog/` | No | |
| `publish/publishSvgEditorAction.ts` | Yes | Via `resolveSvgPublishDualWrite` | Only if Products DB **and** R2 ready |
| `POST /api/admin/svg-editor` | Yes | Same dual-write gate | `withAuth` admin + CSRF |
| `publish/resolveSvgPublishDualWrite.ts` | — | Injects revision repo + R2 `putText` | Modes: `enabled` \| `skipped_no_db` \| `skipped_r2_unavailable` |
| Lifecycle manifest + audit | `results/admin/catalog-ops/` (gitignored) | No | Not durable product authority |
| Parametric publish | `publishLinearDeskAction.ts` | Same dual-write resolve | Disk live; SVG still template |

**UI admits disk authority:** `views/AdminSvgEditorListView.tsx`.

**DB tables (schema present):** `svg_revisions`, `svg_revision_artifacts`, `block_descriptors`. Dual-write upserts exist; cutover incomplete (`Failures.md`). DB is **not** release authority.

---

## DB-SVG contract map (repo truth)

| ID | Status | Evidence in code |
|---|---|---|
| 01 | OPEN | Disk authority live; DB not sole release authority |
| 02 | PARTIAL | `storage/descriptorLock.ts`, versioned disk files |
| 03 | PARTIAL | `svgRevisionRepository.server.ts` + unit tests; not live authority |
| 04 | PARTIAL | Types/schemas; dual-write not full `PublishedRevisionV1` transaction |
| 05 | PARTIAL | Column + dual-write path; disk still live |
| 06 | OPEN | Not one DB transaction with artifact + pointer + audit |
| 07 | PARTIAL | Disk rollback in `publishDescriptorWithPipeline.ts` |
| 08 | PARTIAL | Disk idempotent short-circuit; DB idempotency unproved |
| 09 | PARTIAL | `lifecycle/staleDraftPublishGate.ts` on POST svg-editor |
| 10–12 | PARTIAL | Planner `app/api/planner/catalog/svg-blocks/route.ts` → DB rows when configured else disk |
| 13 | OPEN / Planner co-own | Pin revision on place |
| 14–15 | PARTIAL | Server-only Drizzle; degraded messaging incomplete |
| 16 | OPEN | Disk can still be Planner fallback |
| 17 | PARTIAL | `scripts/svg-disk-db-dry-run.ts` (report only) |
| 18 | OPEN | No parity tooling before cutover |
| 19 | PARTIAL | CSRF/rate limits; unit matrix; browser OPEN |
| 20 | PARTIAL | Tmp-dir unit/e2e; no automated canonical hash gate |

---

## A0 — Test isolation

| Feature | Code | Gap |
|---|---|---|
| Isolation guard | `storage/catalogWriteIsolation.ts` · `assertCatalogWriteAllowed` | Unit green; AF-12 CI hash gate OPEN |
| Tmp-dir helpers | `tests/e2e/helpers/isolatedAdminSvgPublish.ts`, `tests/helpers/adminCatalogIsolation.ts` | Convention |
| Isolation unit | `tests/unit/features/admin/svg-editor/storage/catalogWriteIsolation.test.ts`, `publish/adminCatalogIsolation.a0.test.ts` | Re-verify on change |
| E2E isolated publish | `tests/e2e/admin-svg-publish-p01.spec.ts`, `admin-svg-scene-publish-a401.spec.ts` | Often `DEV_AUTH_BYPASS`; not production-auth proof |

---

## A1 — Shell, auth, navigation

| Feature | Code | Gap |
|---|---|---|
| Edge proxy | `site/proxy.ts` / `isProtectedPath` | Unauth `/admin/*` → `/access?next=…` when bypass off |
| Layout auth | `app/admin/layout.tsx` → `requireAuthUser("/admin", "admin")` | Unit green; production-auth smoke OPEN (AF-10) |
| API session | `app/api/admin/_lib/server.ts` / `requireAdminSession` | 401/403 when bypass off |
| withAuth admin | `features/shared/api/withAuth.ts` | role `admin` 401/403 when bypass off |
| Dev bypass | `lib/auth/devAuthBypass.ts` | `DEV_AUTH_BYPASS=1` + non-prod only |
| Shell / nav | `ui/AdminLayoutShell.tsx`, `ui/adminNav.ts` | Groups Overview / Planner / Catalog / CRM / System |
| Dashboard | `dashboard/AdminDashboardPageView.tsx`, `app/admin/page.tsx` | Browser re-proof OPEN |
| Mobile helpers | `ui/adminMobileReview.ts` | AF-06 unit PARTIAL; browser OPEN |

**Auth unit proof (bypass off):** `tests/unit/proxy.test.ts`, `tests/unit/lib/auth/session.test.ts`, `tests/unit/app/api/admin/_lib/server.test.ts`, `tests/unit/features/shared/api/withAuth.test.ts`, `tests/unit/app/admin/layout.test.tsx`.

---

## A2 — Excalidraw-first authoring

| Feature | Code | Gap |
|---|---|---|
| SVG inventory list | `views/AdminSvgEditorListView.tsx`, `app/admin/svg-editor/page.tsx` | AF-05 bulk dominance; AF-13 internal language |
| Studio shell | `views/edit-shell/AdminSvgEditorShell.tsx`, `AdminSvgEditorTopBar.tsx`, `useAdminSvgEditorPublish.ts` | Browser OPEN |
| Excalidraw | `editor/ExcalidrawClient.tsx`, `ExcalidrawCanvas.tsx`, `gridSnapping.ts`, `DimensionPanel.tsx` | Subset contracts unit; full safe path open |
| Form / identity | `form/SvgEditorForm.tsx`, `svgEditorFormState.ts`, `svgEditorFormAdapters.ts` | Legacy `sceneParts` bridge |
| Contracts | `contracts/svgBlockSchemas.ts`, `supportedSvgAuthoringSubset.ts`, `stageLayoutContract.ts` | — |
| AI freeform SVG generate | *(no route)* | **Not implemented** (AF-11); C-AI is field draft only |
| 3D previews | `publish/GlbExtruderPreview.tsx`, `ModelViewerPreview.tsx` | Preview only |

---

## A3 — Publish pipeline

| Feature | Code | Gap |
|---|---|---|
| Publish core | `publish/publishDescriptorWithPipeline.ts` | Disk authority; DB transaction open |
| Server action | `publish/publishSvgEditorAction.ts` | Dual-write gated |
| HTTP publish | `app/api/admin/svg-editor/route.ts` | admin + CSRF |
| Compiler | `publish/sharedCompilerAuthority.ts`, planner `compileSvgForPublish` | Fail-closed before S4 |
| Dual-write resolve | `publish/resolveSvgPublishDualWrite.ts` | AF-18a modes unit; live R2 OPEN |
| Rollback / lock / stale | `lifecycle/rollbackDescriptorVersion.ts`, `storage/descriptorLock.ts`, `lifecycle/staleDraftPublishGate.ts` | Disk unit; browser OPEN |
| Preview compile | `publish/previewSvgEditorAction.ts`, `useDebouncedCompile.ts` | Align preview = publish |
| Quality gate | `publish/planSvgQualityGate.ts` | Soft gate if present |
| S1 normalize | `features/planner/asset-engine/svg/normalizeDescriptorForPipeline.ts` | Track G greys |
| S2/S3 paint | `scripts/generate-svg/pipelineCore.ts` | Role paint / stroke scale |

---

## A4 — Catalog lifecycle and bulk

| Feature | Code | Gap |
|---|---|---|
| Managed products UI | `catalog/AdminCatalogManager.tsx`, `AdminCatalogPageView.tsx`, `AdminCatalogTable.tsx`, `app/admin/catalog/page.tsx` | AF-06 unit PARTIAL; browser OPEN |
| Configurator catalog | `catalog/ConfiguratorCatalogPageView.tsx`, `app/admin/planner-catalog/page.tsx` | Browser OPEN |
| Workspace library | `workspace-catalog/AdminWorkspaceCatalogPageView.tsx` | Read-oriented |
| Catalog APIs | `app/api/admin/catalog/`, `catalogs/[type]/`, `configurator-catalog/`, `planner-catalog/` | CSRF on mutations |
| Lifecycle | `lifecycle/catalogLifecycle.ts`, `catalogLifecycle.db.server.ts`, `bulkLifecycleBatch.ts`, `catalogRetirement.ts` | Disk manifest + optional DB |
| Lifecycle HTTP | `app/api/admin/svg-editor/[slug]/lifecycle/route.ts`, `rollback/`, `revisions/` | — |
| Bulk import | `views/AdminSvgBulkImportPanel.tsx`, `storage/bulkImportBlockDescriptors.ts`, `app/api/admin/svg-editor/bulk-import/route.ts` | Advanced path; AF-05 |

---

## A5 — Product families

| Feature | Code | Gap |
|---|---|---|
| Family form | `catalog/AdminProductFamilyForm.tsx`, `productFamilyContract.ts` | Browser release OPEN |
| Workstation | `workstation/WorkstationFamilyAuthorFields.tsx`, `workstationFamilyRelease.ts`, `workstationFamilyContract.ts` | Planner parity OPEN |

---

## A6 — Price books / commercial governance

| Feature | Code | Gap |
|---|---|---|
| UI | `pricing/AdminPriceBookPageView.tsx`, `app/admin/price-books/page.tsx` | Unit UX PARTIAL; browser OPEN |
| Service / store | `pricing/priceBookService.ts`, `priceBookFileStore.ts` → `pricing/data/price-books/` | Filesystem authority |
| Drizzle store | `pricing/priceBookDrizzleStore.server.ts` | Usage honesty open |
| Governance | `pricing/priceBookGovernance.ts`, `priceBookGovernance.server.ts` | Unit exists |
| API | `app/api/admin/price-books/`, `[bookId]/action/route.ts` | — |

---

## A7 — DB-SVG cutover

| Feature | Code | Gap |
|---|---|---|
| Repository | `svg-editor/svgRevisionRepository.server.ts` | Not sole authority |
| Drizzle persistence | `storage/drizzleSvgPersistence.server.ts` | Incomplete cutover |
| Dual-read harness | `storage/dualReadHarness.ts` | Support tooling |
| Active blocker | `Failures.md` | OPEN until browser place + authority flip |

---

## A8 — Planner / consumer handoff

| Feature | Code | Gap |
|---|---|---|
| Planner SVG blocks API | `app/api/planner/catalog/svg-blocks/route.ts` | DB-aware + disk fallback |
| Buyer-visible loaders | `lifecycle/catalogLifecycle.ts`, `catalogLifecycle.db.server.ts` | Definition rows ≠ artifact bytes |
| Portal SVG catalog | `app/(site)/portal/svg-catalog/page.tsx` | Disk load |

---

## A9 — Ops surfaces

| Feature | Code | Gap |
|---|---|---|
| Plans | `plans/AdminPlansPageView.tsx`, `AdminPlanDetailPageView.tsx`, `app/api/admin/plans/` | Browser OPEN |
| Features | `feature-flags/AdminFeatureFlagsPageView.tsx`, `app/api/admin/features/route.ts` | — |
| Analytics | `analytics/AdminAnalyticsPageView.tsx`, `app/api/admin/analytics/route.ts` | — |
| Themes | `app/admin/themes/`, `app/api/admin/themes/` | — |
| Inventory map | `inventory/AdminInventoryPageView.tsx` | — |
| Settings | `settings/AdminSettingsPageView.tsx` | — |

---

## A10 — CRM (Admin-mounted)

| Feature | Code | Gap |
|---|---|---|
| CRM hub | `app/admin/crm/page.tsx` → `CrmHubView` + `CrmSubnav` | Hub page (not redirect-only); unit exists |
| CRM routes | `app/admin/crm/**` | **localStorage demo** — not production |
| Customer queries | `app/admin/customer-queries/` + manage API | Server-backed; distinct from CRM demo |
| Honesty | `CrmDemoBanner.tsx`, `CrmWorkspaceBanner.tsx` | AF-08 unit PARTIAL; browser OPEN |

---

## A11 — Security (Admin surface)

| Feature | Code | Gap |
|---|---|---|
| CSRF + rate | admin mutators + shared API helpers | Unit matrix PARTIAL; browser OPEN |
| Production-auth smoke | AF-10 | OPEN |

---

## Unit test map (parametric + Maker)

| Suite | Path |
|---|---|
| Form model | `tests/unit/features/admin/svg-editor/parametric/linearDeskFormModel.test.ts` |
| Template draw | `tests/unit/features/planner/asset-engine/svg/parametric/drawLinearDeskFromTemplate.test.ts` |
| Maker recipes | `tests/unit/features/planner/asset-engine/svg/makerJsRecipes.test.ts` |
| Maker → path | `tests/unit/features/planner/asset-engine/svg/makerJsToPath.test.ts` |
| Maker pipeline | `tests/unit/features/planner/asset-engine/makerJsPipeline.test.ts` |
| Isolation | `tests/unit/features/admin/svg-editor/storage/catalogWriteIsolation.test.ts` |

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/parametric tests/unit/features/admin/svg-editor/parametric tests/unit/features/planner/asset-engine/svg/makerJsRecipes.test.ts
```
