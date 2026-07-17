# F7b — `site/features/admin/` exclusive (non-svg-editor)

**Date:** 2026-07-17  
**Scope:** Everything under `site/features/admin/` **except** `svg-editor/**`.

## Inventory

| Bucket | Source files | Name-mirror tests |
|--------|--------------|-------------------|
| analytics | 1 | 1 |
| api | 2 | 2 |
| catalog | 10 | 10 |
| dashboard | 1 | 1 |
| feature-flags | 1 | 1 |
| inventory | 1 | 1 |
| plans | 3 | 3 |
| pricing | 11 (+ data/fixtures) | 10 (`.ts` mirror; `priceBookContract.test.tsx` OK) |
| settings | 1 | 1 |
| ui | 4 | 4 |
| workspace-catalog | 1 | 1 |
| workstation | 5 | 5 |
| **Total exclusive TS/TSX** | **40** | **mirrored** |

### Mutation surfaces (client → API)

| Client | Methods | Transport | API auth |
|--------|---------|-----------|----------|
| `api/adminCatalogClient.ts` | POST/PATCH/DELETE | `browserApiFetch` (CSRF auto) | `withAuth` + `requireCsrf` on catalogs routes |
| `feature-flags/AdminFeatureFlagsPageView` | PATCH | `browserApiFetch` | `withAuth` + CSRF |
| `pricing/AdminPriceBookPageView` | POST action | `browserApiFetch` | `withAuth` + CSRF |
| `plans/AdminPlanDetailPageView` | PATCH | `browserApiFetch` | `requireAdminSession` + `validateCsrfRequest` |
| analytics / plans list / inventory | GET only | `browserApiFetch` | admin session / withAuth |

Read-only / non-mutation: dashboard, settings, workspace-catalog, ui shell, workstation family authoring helpers (no live admin write API in exclusive tree).

## Auth mutations

Static CSRF + rate matrix extended for exclusive catalog mutators:

- `admin/catalog/[id]`
- `admin/catalogs/[type]`
- `admin/catalogs/[type]/[id]`
- `admin/planner-catalog`
- `admin/configurator-catalog/[id]`

Already covered: plans, features, price-books action, legacy catalog list.

Route handlers in exclusive surface use admin role + CSRF on writes. Clients use `browserApiFetch` so CSRF header is attached on POST/PATCH/DELETE.

## Fixes (exclusive)

1. **`AdminPlansPageView.tsx`** — repaired double-newline corruption (619 → normal ~300 lines). Behaviour unchanged.
2. **BOM strip** — `AdminPlanDetailPageView.tsx`, `AdminFeatureFlagsPageView.tsx`.
3. **Mutation matrix** — exclusive catalog routes added to `mutation-route-safety.matrix.test.ts`.
4. **Feature flags tests** — name-mirror now covers load, load fail, PATCH toggle, PATCH fail (no `any`).
5. **Analytics tests** — period change, 401, refresh + existing live/empty honesty.
6. **Plan detail tests** — PATCH Approve success path + 403 failure via `browserApiFetch`.
7. **Removed** non–svg-editor `tests/unit/features/admin/planner-views/**` duplicates (had handwritten `any`; name-mirror is authority). Left `planner-views/svg-editor/**` for F7a.

## Verification

```text
pnpm --filter oando-site exec vitest run tests/unit/features/admin/{analytics,api,catalog,dashboard,feature-flags,inventory,plans,pricing,settings,ui,workspace-catalog,workstation}
→ 40 files, 293 tests PASS

pnpm --filter oando-site exec vitest run tests/unit/app/api/mutation-route-safety.matrix.test.ts
→ 27 tests PASS (includes new catalog rows)

pnpm run check:layout
→ OK
```

## OPEN (not claimed)

- Browser unauth/bypass-off for exclusive admin pages (AF-01 browser).
- Deploy/production-auth smoke (AF-04 / AF-10).
- Browser journeys for plans / price books / feature flags (unit only here).
- Full AF-14 matrix beyond static source + exclusive unit paths.
- svg-editor/** — F7a, not touched.
