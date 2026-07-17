# EXEC-1 A0 — Admin test isolation

**Date:** 2026-07-17  
**Agent:** ADMIN-EXEC-1  
**Verdict:** **PASS** (unit isolation proven this session)

## Scope

Prove/fix Admin publish/lifecycle test isolation:

- Publish/lifecycle tests use temp inventory roots only
- No test writes committed `site/inventory/descriptors/` or `site/public/svg-catalog` without isolated fixture + cleanup
- Fail loudly if a test path points at canonical dirs without isolation

## What landed

| Piece | Path |
|-------|------|
| Runtime guard | `site/features/admin/svg-editor/storage/catalogWriteIsolation.ts` |
| Wired writers | `persistBlockDescriptor`, `unlinkBlockDescriptor`, `bulkImportBlockDescriptors`, `runSvgPipeline` |
| Test helpers | `site/tests/helpers/adminCatalogIsolation.ts` |
| Guard unit tests | `site/tests/unit/features/admin/svg-editor/storage/catalogWriteIsolation.test.ts` |
| A0 proof suite | `site/tests/unit/features/admin/svg-editor/publish/adminCatalogIsolation.a0.test.ts` |

### Behaviour

- Under Vitest / `NODE_ENV=test`, writes to committed `inventory/descriptors` or `public/svg-catalog` throw `CatalogIsolationError` (or return `pathEscape` / `writeFixtureError`).
- Production (non-test) publish still writes disk authority paths.
- A0 suite: static convention scan of publish/lifecycle/storage unit tests; runtime fail-loud; hash snapshot before/after isolated writes.

## Commands (fresh, exit 0)

```powershell
# Focused isolation + primary write surfaces
pnpm --filter oando-site exec vitest run `
  tests/unit/features/admin/svg-editor/storage/catalogWriteIsolation.test.ts `
  tests/unit/features/admin/svg-editor/publish/adminCatalogIsolation.a0.test.ts `
  tests/unit/features/admin/svg-editor/publish/isolatedAdminSvgPublish.test.ts `
  tests/unit/features/admin/svg-editor/publish/publishDescriptorWithPipeline.test.ts `
  tests/unit/features/admin/svg-editor/storage/persistBlockDescriptor.test.ts `
  tests/unit/features/admin/svg-editor/storage/bulkImportBlockDescriptors.test.ts `
  tests/unit/features/admin/svg-editor/lifecycle/catalogLifecycle.test.ts `
  tests/unit/features/admin/svg-editor/publish/svgPipelineRunner.test.ts
# → 8 files, 80 tests, exit 0

# Full lifecycle + storage trees + isolation suites
pnpm --filter oando-site exec vitest run `
  tests/unit/features/admin/svg-editor/lifecycle `
  tests/unit/features/admin/svg-editor/storage `
  tests/unit/features/admin/svg-editor/publish/isolatedAdminSvgPublish.test.ts `
  tests/unit/features/admin/svg-editor/publish/adminCatalogIsolation.a0.test.ts
# → 26 files, 142 tests, exit 0

pnpm run check:layout
# → check-repo-layout OK
```

## Proof summary

| Check | Result |
|-------|--------|
| Temp-root publish/persist/lifecycle unit paths | PASS (existing + static scan) |
| Default/canonical `persistBlockDescriptor` under Vitest | FAIL-CLOSED (`500.catalog_isolation`) |
| Default/canonical `bulkImport` / `unlink` under Vitest | FAIL-CLOSED (throw) |
| Canonical monorepo `runSvgPipeline` SVG path under Vitest | FAIL-CLOSED (`writeFixtureError`) |
| Isolated temp write leaves catalog hashes unchanged | PASS |
| `createIsolatedAdminSvgWorkspace` mutates only temp | PASS |
| Layout | PASS |

## Residual OPEN

1. **AF-12 CI hash gate** — unit snapshot helper exists; no dedicated CI job/script that hashes committed catalog after full admin suite in every pipeline run.
2. **E2E / browser** — isolation guard is Vitest-only. Playwright against a live Next process can still mutate disk if a spec does not use `createIsolatedAdminSvgWorkspace`. Existing admin SVG e2e helpers already isolate; re-proof browser smoke remains optional for A2.
3. **RESULTS under `results/admin/catalog-ops/`** — lifecycle defaults to gitignored ops dir, not product catalog. Not treated as canonical inventory; still prefer temp dirs in unit tests (already done).

## Baseline FAIL list

No new FAIL from this slice. Isolation regressions would surface as:

- `CatalogIsolationError` / `500.catalog_isolation`
- A0 static scan offender list non-empty
- Canonical hash mismatch in snapshot asserts

## Plan status (honest)

- A0 unit isolation: **PASS this session**
- Full A0 exit (reproducible CI hash gate + browser isolation re-proof): still **PARTIAL** until AF-12 / e2e notes close

No commit. No secrets. No Planner/Site marketing/price-book UI rewrites.
