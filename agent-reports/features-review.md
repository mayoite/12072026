# site/features review

Date: 2026-07-14  
Scope: `site/features/` (admin, crm, ops, planner, shared, site). Read-only at write time.  
Benchmarks: `docs/architecture/01-MODULE-LAYOUT.md`, `02-DOMAINS.md`, `10-SECURITY-BENCHMARK.md`, `site/ARCHITECTURE.md`, `site/tests/CONTENTS.md`.

## Verification stamp (2026-07-14 recheck)

| Claim | Live status |
|-------|-------------|
| ops unit = 0 | **FIXED** — `tests/unit/features/ops/CustomerQueriesOpsPageView.test.tsx` (13 tests verified earlier) |
| shared unit thin | **IMPROVED** — many name-mirrors + shared suite expanded |
| name-mirror gaps large | **FIXED for path metric** — features name-mirror **100%** (584/584) |
| `dangerouslySetInnerHTML` in `renderBlockPrims` | **STILL OPEN** (security) |
| Dual planner trees / store facade | **STILL OPEN** (structure) |
| Misplaced `planner-views` / `geometry` test folders | **STILL OPEN** (layout debt) |

**Test quality floor (owner agreed ~5% export-surface):** whole `tests/unit` measured ~6.3% export-only (slightly over 5%). features/planner holds most of that.

## Inventory (top-level)

| Area | Product role | Scale | Unit test mirror |
|------|--------------|-------|------------------|
| `admin/` | Internal inventory, SVG studio, pricing, catalog APIs | Large (svg-editor heavy) | Strong under `tests/unit/features/admin/` |
| `planner/` | Customer layout, catalog consume, BOQ, 2D/3D | Dominant tree | Strong volume; uneven mirror vs live host |
| `site/` | Marketing data, assistant, advisor | Small | Good under `tests/unit/features/site/` |
| `crm/` | Demo CRM portal (localStorage) | Small | Covered |
| `ops/` | Customer queries ops UI | **1 file** | **Unit = 0** (integration only) |
| `shared/` | Auth shell, API envelope, contracts, entry | Medium | Thin unit; auth integration better |

## Strengths

1. **Domain roots match docs.** Admin, Planner, Site, CRM, ops, shared sit under `features/` as product behavior. Routes stay thin; live canvas host is documented as `planner/project/`.
2. **Shared contracts are real.** `shared/catalog/productFamilyContract` and `releasedCatalogProductContract` are the authority; admin/planner boundary files re-export them. Good producer/consumer discipline for released product shape.
3. **No handwritten `any` / `as any` found** under `features/**/*.{ts,tsx}` (only comments forbidding it). Matches AGENTS quality floor.
4. **Admin SVG path has real gates.** Publish/preview server actions call `resolveAuthContext("admin")`. Server-side DOMPurify + SVGO lives in `project/catalog/svg/svgServerSanitizer.ts`. Compile authority is intentional, not accidental.
5. **Test volume on admin svg-editor and planner catalog-api/cloud-store is serious.** Not theater for those subtrees.
6. **Auth middleware foundation exists.** `shared/api/withAuth.ts` centralizes role resolution, rate limit, optional CSRF, and dev-bypass exclusion path for production builds (bypass is still a risk for proof, not for code structure).
7. **Ops mutations send CSRF on 403 retry** (`CustomerQueriesOpsPageView`). Client at least knows the commercial path needs CSRF.

## Issues

| Severity | Axis | Location | Fact | Recommendation |
|----------|------|----------|------|----------------|
| **Critical** | Security / SVG XSS | `planner/catalog-api/renderBlockPrims.tsx` | `dangerouslySetInnerHTML` injects `blockToSvg` markup **without** `sanitizeInlineSvg`. Sibling `CatalogBlockPreview.tsx` does sanitize. Same pattern, different safety. | Always sanitize (or only render server-sanitized bytes). Prefer one shared preview helper. Treat this as a fail-closed default. |
| **Critical** | Security / SVG XSS | `lib/security/sanitize.ts` → consumers in features | `sanitizeInlineSvg` is regex strip of script/`on*`/`javascript:` only. Security benchmark explicitly says regex is **not** a sufficient SVG boundary. Client previews still rely on it. | Do not treat client regex as the authority. Prefer server-sanitized artifacts only; if client must paint, use a real SVG sanitizer with allowlists (as server path already does). |
| **Critical** | Security / transaction | `admin/svg-editor/drizzleSvgPersistence.server.ts` + `svgRevisionRepository.server.ts` | `publish()` does `insertRevision` then `insertArtifacts` **without a DB transaction**. `insertRevision` itself does revision insert + `block_descriptors` upsert as **two** non-atomic statements. Partial publish / pointer without artifacts is possible. Contradicts SEC-TXN-03 / docs target for atomic publish. | Wrap revision + artifacts + product pointer + audit in one transaction. Fail closed on any partial step. Do not claim DB publish complete until that lands. |
| **Important** | Structure purity | Dual Planner trees: `project/` vs `catalog-api/` vs `cloud-store/` vs `persistence/` | Architecture docs admit dual trees. Reality: full **duplicate modules** (`plannerManagedProducts*.ts` nearly twin in catalog-api and cloud-store; admin handlers import cloud-store, API route imports catalog-api). Live host is `project/`; parallel trees still own real behavior and imports. | Pick one owner per concern (managed products, catalog core, save). Make others thin re-exports only, then delete duplicates. Stop growing both. |
| **Important** | Coupling | Admin → Planner deep imports | Admin imports Planner catalog loaders, feature flags, workstation v0, cloud-store catalog data, catalog-api store. Domains doc: Admin produces released inventory; Planner consumes. Direction is inverted for several commercial surfaces. | Move shared product/workstation contracts into `shared/` (or admin-owned contract packages). Planner should depend on released contracts, not the reverse for Admin UI. |
| **Important** | Coupling | Planner → Admin | `releasedCatalogBoundary` imports Admin retirement/lifecycle; `workstationFamilyBuyer` imports Admin workstation drive/release; `svgCompiler.server` imports Admin `svgBlockSchemas`. Cross-domain cycle risk. | Shared lifecycle/retirement types under `shared/` or `lib/catalog`. Admin remains the only writer. |
| **Important** | Dead / deprecated still used | `planner/cloud-store/plannerStore.ts` | Marked `@deprecated` but still exported from `cloud-store/index`, used by `shared/components/editor/Toolbar.tsx`, many tests, and types re-exported as the type hub for wall/furniture utils. Facade is still a god surface. | Migrate Toolbar and remaining consumers to domain stores; stop exporting facade from package index; kill after zero imports. |
| **Important** | Dead / deprecated | `planner/ai/applySuggestedLayout.ts` | `@deprecated` no-op “until open3d apply is wired”; still exported from `ai/index.ts`. `buildShapesFromSuggestedLayout` returns `[]`. Callers can believe apply succeeded after schema log only. | Remove from public exports or make it throw/hard-fail until real apply exists. Wire AI to `applyLayoutToWorkspace` / project host only. |
| **Important** | Test mirror / purity | `tests/unit/features/admin/planner-views/` | Folder name is legacy (`CONTENTS.md`: was `features/planner/admin/`). Tests target `features/admin/*` page views. Mirror is wrong; confuses ownership and greps. | Flatten into `tests/unit/features/admin/` next to product files (or `admin/page-views/`). Drop “planner-views”. |
| **Important** | Test mirror / purity | `tests/unit/features/planner/geometry/` | No product folder `features/planner/geometry/`. Tests import `project/lib/geometry/*` and `cloud-store/plannerStoreGeometry`. Mirror rule broken. | Move to `tests/unit/features/planner/project/lib/geometry/` and `…/cloud-store/` as appropriate. |
| **Important** | Test mirror gaps | `ops/` | Product: one page view. Unit tests: **none**. Only `tests/integration/features/ops/`. | Add unit tests for status draft, CSRF header path, and error UI states. |
| **Important** | Test mirror gaps | `planner/project/` | Live canvas host (catalog client, model, persistence, export, AI, svg). Unit mirror is essentially **one** file under `tests/unit/features/planner/project/`. Huge surface unmirrored at unit level (some coverage lives flattened under `planner/` root or elsewhere). | Mirror critical pure modules under `tests/unit/features/planner/project/...`. Prioritize catalog client, placement, export preflight, persistence errors. |
| **Important** | Test mirror gaps | `shared/` | Product has api, auth, catalog, components, dashboard, entry, shell, quotes, crm types, analytics. Unit tree is thin: partial auth, catalog contracts, dashboard, index-exports. No unit for `withAuth` under features (covered under `tests/unit/lib/api` — platform-adjacent split). | Mirror `shared/api`, entry pages, shell, RestrictedActionButton. Keep withAuth tests collocated or document single owner. |
| **Important** | Security / admin gates | Server actions | `publishSvgEditorAction` / `previewSvgEditorAction` use `resolveAuthContext("admin")` but **not** `withAuth` CSRF options. Cookie session mutations via Server Actions need explicit CSRF/origin policy per SEC-CSRF-01. | Confirm Next Server Action CSRF story for this app; if not automatic, enforce CSRF or double-submit on publish/preview/rollback paths. |
| **Important** | Security / actor honesty | `publishSvgEditorAction.ts` | On auth success, `actorId = auth.user?.id ?? DEV_BYPASS_USER.id`. Admin path should not fall back to dev bypass identity for audit. | Fail closed if `auth.user` missing after admin resolve. Never stamp audit as bypass user in real sessions. |
| **Important** | Platform-adjacent in features | `admin/svg-editor/drizzleSvgPersistence.server.ts` | Features layer talks Drizzle schema and `productsDb` directly. Docs put DB boundary in `platform/`. Adapter in features is acceptable only if thin; current file owns upsert policy and versioning. | Keep SQL/schema in platform; features should call a platform repository with a narrow interface. |
| **Important** | God files / coupling | `planner/editor/OOPlannerWorkspace.tsx` (~1.3k lines) | Orchestrates catalog, autosave, export, AI bridge, 3D, tools, floors, BOQ, quote cart, validation, keyboard. Single composition root does too much. | Split by concern: export controller, placement controller, shell wiring. Keep file as thin layout. |
| **Important** | God files | `planner/project/catalog/catalogClient.ts`, `InventoryPanel.tsx`, `svgTypes.ts`, `admin/svg-editor/puckBlockRegistry.tsx` | Multi-hundred-line modules mixing cache, search, UI, schema, and portal registry. Puck registry still large while Admin authoring claims “No Puck”. | Split pure schema/index from UI. Quarantine or delete unused Puck authoring path if Admin form is the only writer. |
| **Important** | Product honesty | CRM | `crmStore` is browser `localStorage` persist + demo seed. Admin hub itself warns “Browser-only CRM storage.” Fine as demo; dangerous if treated as real CRM. | Keep demo banner mandatory; do not extend CRM features without a real backend plan. |
| **Minor** | Dead re-exports | `shared/analytics`, `shared/crm`, `shared/quotes` | Often `export * from './types'` only. Fine as contracts, but easy to become dump barrels. | Keep thin; do not add logic without owners. |
| **Minor** | Deprecated aliases still live | `formatCatalogFootprintCm`, `writeHistory`, `isSynced`, `CATALOG_PURPOSE` deprecated tabs, `exportPreflight` old format names | Migration incomplete; dual APIs stay. | Delete aliases once tests/consumers moved. |
| **Minor** | Structure | `admin/data/price-books/` under features | Architecture allows admin runtime files; still odd next to UI. Runtime JSON/audit under features blurs data vs behavior. | Keep documented; do not add catalog authority here. |
| **Minor** | Naming debt | `plannerCatalogCore` re-export comment says `features/planner/store/...` | Path is wrong (`cloud-store`). Docs and comments lie. | Fix comments to real paths. |
| **Minor** | Test purity | `CONTENTS.md` still sanctifies `admin/planner-views/` | Documents a bad name as the layout rule. | Update CONTENTS when tests move. |

## Axis notes

### 1. Structure purity vs docs

Docs say: features = product behavior; Admin owns inventory; Planner consumes; no parallel planner/catalog trees “when possible.”

Truth: dual Planner trees are **active**, not residual. `project/` is live host, but `catalog-api` and `cloud-store` still implement real catalog and managed-product I/O, with near-duplicates. Admin↔Planner imports form a cycle through lifecycle and workstation contracts. Shared contracts for released product/family are the bright spot.

### 2. Misplaced test trees

Confirmed:

- `site/tests/unit/features/admin/planner-views/` — admin views under a “planner” label.
- `site/tests/unit/features/planner/geometry/` — no matching product directory; real code is `project/lib/geometry` and cloud-store helpers.

Also: live host `features/planner/project/**` lacks a proportional unit mirror.

### 3. Dead reexports / @deprecated heavily used

`usePlannerStore` is the headline. Deprecated and still structural. AI `applySuggestedLayout` is a no-op still exported. Several smaller deprecations remain as shims. Catalog-api re-export of cloud-store catalog core is honest; duplicate **implementations** of managed products are not.

### 4. Security

- Auth gates on admin SVG actions: present.
- CSRF: optional in `withAuth`; used on several admin API routes; Server Actions not clearly covered.
- SVG: server DOMPurify path is good; client regex + unsanitized `renderBlockPrims` are not.
- DB publish dual-write is non-atomic.
- Dev bypass identity can pollute audit actor on edge cases.
- CRM is localStorage — data classification honesty depends on UI warnings.

### 5. Test mirror gaps

| Area | Gap |
|------|-----|
| ops | unit = 0 |
| shared | thin unit vs surface |
| planner/project | near-zero dedicated unit tree |
| platform-adjacent | withAuth tests live under `lib/api`, features owns the source |

Admin svg-editor and planner catalog-api/cloud-store are comparatively healthy.

### 6. `any` usage

**None found** in handwritten features (production). Pass for this axis.

### 7. Coupling / god files

Worst coupling: Admin/Planner import cycles; dual managed-product stacks; workspace shell mega-file. Worst size concentration: `OOPlannerWorkspace`, `catalogClient`, `InventoryPanel`, `svgTypes`, `puckBlockRegistry`, `plannerStore` facade.

## Top 5 fix order

1. **Close SVG XSS holes** — sanitize `renderBlockPrims`; stop relying on client regex as the security boundary; only paint server-sanitized or allowlisted markup.
2. **Make DB SVG publish atomic** — single transaction for revision, artifacts, pointer, audit; fail closed; align with SEC-TXN-*.
3. **Collapse dual Planner catalog ownership** — one managed-products module, one catalog-core owner; re-exports only elsewhere; fix Admin import to that owner.
4. **Break Admin↔Planner cycles** — move lifecycle/retirement/workstation **contracts** to shared; keep writers in Admin, consumers in Planner.
5. **Kill deprecated plannerStore facade usage + no-op AI apply exports** — then re-home misplaced tests (`admin/planner-views`, `planner/geometry`) and start a real `project/` unit mirror.

## Assessment

`features/` is a real product layer, not a junk drawer. Domain folders match the product map. Shared released-catalog contracts and the absence of `any` are genuine quality signals. Admin SVG work shows intentional auth and server sanitization.

It is **not** structure-pure. Dual Planner trees and Admin↔Planner import cycles are active architecture debt, not comments. Security is **split-brain**: server SVG pipeline is serious; client preview injection and non-atomic DB dual-write are not. Test coverage is **lumpy**: admin studio and catalog-api look strong; ops and live `project/` host do not.

Verdict: **usable foundation with material purity, security, and mirror debt.** Do not declare features “done” or “secure by structure.” Fix order above is the honest sequence: XSS and publish atomicity before more feature growth on dual trees.

No code changes. No commit.
