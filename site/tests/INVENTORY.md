# Test inventory

## Admin SVG editor V2

| Test | Type | Isolation |
|---|---|---|
| `unit/features/admin/svg-editor-v2/testIsolation.test.ts` | Unit | Temporary descriptor and SVG directories; injected in-memory revision and artifact repositories; cleanup in `finally`. |

Fixture: `fixtures/svg-editor-v2/minimal-safe.svg`.

Canonical `inventory/descriptors/` and `public/svg-catalog/` are forbidden test write targets.
