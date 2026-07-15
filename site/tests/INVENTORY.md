# Test inventory

## Admin SVG editor V2

| Test | Type | Isolation |
|---|---|---|
| `unit/features/admin/svg-editor-v2/testIsolation.test.ts` | Unit | Temporary descriptor and SVG directories; injected in-memory revision and artifact repositories; cleanup in `finally`. |
| `unit/features/admin/svg-editor-v2/svgAssetSchemasV2.test.ts` | Unit | Pure schema validation; no filesystem or catalog writes. |
| `unit/features/admin/svg-editor-v2/svgAssetRepositoryV2.test.ts` | Unit | Injected in-memory repository; no database writes. |
| `unit/features/admin/svg-editor-v2/svgStorageV2.test.ts` | Unit | Injected in-memory storage drivers for Supabase/R2 contracts; no network or bucket writes. |
| `unit/features/admin/svg-editor-v2/svgSanitizerV2.test.ts` | Unit | Reads SVG editor V2 fixtures only; no canonical catalog writes. |
| `unit/scripts/svg-v2/archive-v1.test.ts` | Unit | Temporary site/results roots and injected archive store/source; no R2 writes and no canonical catalog writes. |

Fixtures:

- `fixtures/svg-editor-v2/minimal-safe.svg`
- `fixtures/svg-editor-v2/full-safe.svg`
- `fixtures/svg-editor-v2/hostile/css-url.svg`
- `fixtures/svg-editor-v2/hostile/data-url.svg`
- `fixtures/svg-editor-v2/hostile/duplicate-id.svg`
- `fixtures/svg-editor-v2/hostile/entity.svg`
- `fixtures/svg-editor-v2/hostile/event-handler.svg`
- `fixtures/svg-editor-v2/hostile/script.svg`
- `fixtures/svg-editor-v2/hostile/unresolved-reference.svg`

Canonical `inventory/descriptors/` and `public/svg-catalog/` are forbidden test write targets.
