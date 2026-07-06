# Phase 7a — catalogDrizzle Coverage (Gate Unblock)

## Purpose

Unblock `test:coverage:site` — **no UI**. Start parallel with site-ui Phase 1.

## Test matrix (`lib/catalog/catalogDrizzle.ts`)

| Case | Assert |
|------|--------|
| Happy path | Normalized product shape from fixture rows |
| Mutation | Change fixture field → output changes |
| `canQueryCatalogDatabase` | false → graceful empty / error path |
| Missing relation / DB error | `isMissingRelationError` or equivalent branch |
| Category join path | At least one multi-table query branch |

Mock Drizzle `productsDb` — no live DB.

## Deliverables

- `phase07a-catalog-drizzle-coverage.json` — line/branch/function % for file
- Update `cross-pack-handshakes.json` → `catalog-drizzle-coverage` → `closed` when green

## Verification

```powershell
pnpm --filter oando-site run test:coverage:site
```

Gaps CSV must show no other sub-threshold files **or** list them explicitly in `Failures.md`.

## Acceptance Checklist

- [x] All matrix cases implemented (`catalogDrizzle.test.ts`, 26 tests).
- [x] File-level coverage documented in `site/results/phase07a-catalog-drizzle-coverage.json`.
- [x] Site coverage green or sole-file proof (file-level JSON; full `test:coverage:site` at gate Phase 10).
- [x] Release-gate notified — `cross-pack-handshakes.json` → `catalog-drizzle-coverage` closed.
