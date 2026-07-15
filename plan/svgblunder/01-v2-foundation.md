# Phase 1: Reversible V2 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use `subagent-driven-development` or `executing-plans`. Use TDD. Do not commit or push unless the owner asks.

**Goal:** Establish isolated tests, a recoverable V1 baseline, versioned V2 contracts, and unambiguous Products DB/Supabase/R2 ownership.

**Architecture:** V2 uses new tables and storage records rather than mutating V1 definitions. V1 remains readable and restorable. A single repository layer coordinates Products DB metadata with Supabase draft objects and R2 release objects.

**Tech stack:** TypeScript, Zod, Drizzle, Supabase, Cloudflare R2, SHA-256, Vitest.

---

## Task 1: Prove test isolation first

**Files:**
- Create: `site/tests/unit/features/admin/svg-editor-v2/testIsolation.test.ts`
- Create: `site/tests/fixtures/svg-editor-v2/minimal-safe.svg`
- Modify: `site/tests/INVENTORY.md`

- [ ] Write a failing test that runs V2 persistence against a temporary directory and injected in-memory repositories.
- [ ] Assert the test cannot resolve or write beneath `site/inventory/descriptors/` or `site/public/svg-catalog/`.
- [ ] Implement shared V2 test factories with explicit cleanup in `finally` blocks.
- [ ] Run `pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor-v2/testIsolation.test.ts` and require PASS.

## Task 2: Inventory and archive V1 without deleting it

**Files:**
- Create: `site/scripts/svg-v2/inventory-v1.ts`
- Create: `site/scripts/svg-v2/archive-v1.ts`
- Test: `site/tests/unit/scripts/svg-v2/archive-v1.test.ts`

- [ ] Test that inventory output lists every descriptor, released SVG, revision row, artifact row, byte size, slug, version, and SHA-256 checksum.
- [ ] Implement dry-run inventory with deterministic sorting and JSON output under `results/admin/catalog-ops/` only.
- [ ] Implement archive upload to a timestamped R2 prefix and store a signed manifest checksum.
- [ ] Require a read-back verification pass before reporting archive success.
- [ ] Add a restore dry run that compares archive checksums to the inventory manifest without writing product files.
- [ ] Run the focused tests; do not run archive apply without owner approval.

## Task 3: Define V2 public contracts

**Files:**
- Create: `site/features/admin/svg-editor-v2/model/svgAssetManifestV2.ts`
- Create: `site/features/admin/svg-editor-v2/model/svgAssetSchemasV2.ts`
- Test: `site/tests/unit/features/admin/svg-editor-v2/svgAssetSchemasV2.test.ts`

- [ ] Define `SvgAssetManifestV2` with `version: 2`, asset/product identity, decimal millimetre dimensions, source checksum, lifecycle, current version, capability list, and timestamps.
- [ ] Define lifecycle as `draft | review | live | retired`.
- [ ] Require finite positive width/depth/height, unique slug, valid SHA-256, and an explicit capability list.
- [ ] Reject unknown manifest keys so future changes require a version bump.
- [ ] Test valid fixed, configurable, and unlinked draft assets plus every invalid boundary.

## Task 4: Add V2 database tables

**Files:**
- Modify: `site/platform/drizzle/schema/catalog.ts`
- Create: `site/platform/drizzle/migrations/products/<generated>-svg-assets-v2.sql`
- Test: `site/tests/unit/features/admin/svg-editor-v2/svgAssetRepositoryV2.test.ts`

- [ ] Add `svg_assets_v2` for identity, product linkage, dimensions, lifecycle, and current pointers.
- [ ] Add immutable `svg_asset_versions_v2` rows containing the V2 manifest and source checksum.
- [ ] Add `svg_asset_artifacts_v2` rows containing provider, bucket, object key, MIME type, size, and checksum.
- [ ] Add `svg_ai_runs_v2` metadata rows; snapshot bodies remain in Supabase Storage.
- [ ] Add foreign keys, unique slug/version constraints, lifecycle checks, and indexes for product, slug, status, and revision.
- [ ] Test repository concurrency using an optimistic version/checksum condition.
- [ ] Generate but do not apply the migration without owner approval.

## Task 5: Implement storage boundaries

**Files:**
- Create: `site/features/admin/svg-editor-v2/persistence/svgDraftStorage.ts`
- Create: `site/features/admin/svg-editor-v2/persistence/svgReleaseStorage.ts`
- Create: `site/features/admin/svg-editor-v2/persistence/svgAssetRepositoryV2.server.ts`
- Test: `site/tests/unit/features/admin/svg-editor-v2/svgStorageV2.test.ts`

- [ ] Define a typed storage interface for put, get, verify, and delete-by-explicit-key.
- [ ] Implement private draft and AI snapshot storage in Supabase Storage.
- [ ] Implement public release storage in R2.
- [ ] Verify content length, MIME type, and checksum after every upload.
- [ ] Make publish ordering transactional: upload candidates, verify, insert immutable version, update live pointer, then remove only failed candidate objects.
- [ ] Test upload failure, checksum mismatch, database failure, and retry idempotency.

## Task 6: Build sanitizer and capability registry

**Files:**
- Create: `site/features/admin/svg-editor-v2/security/svgSanitizerV2.ts`
- Create: `site/features/admin/svg-editor-v2/security/svgCapabilitiesV2.ts`
- Test: `site/tests/unit/features/admin/svg-editor-v2/svgSanitizerV2.test.ts`

- [ ] Allow SVG groups, definitions, geometry, text, transforms, clipping, masks, gradients, patterns, and managed image references.
- [ ] Reject scripts, event handlers, `foreignObject`, unsafe protocols, duplicate IDs, unresolved references, and unmanaged URLs.
- [ ] Return exact diagnostics with element ID, attribute, code, and message; never silently delete author content during draft save.
- [ ] Publish only the sanitized output and record sanitizer version/capabilities in the manifest.
- [ ] Add hostile fixtures for scripts, CSS URLs, nested data URLs, entity abuse, duplicate IDs, and oversized documents.

## Phase 1 gate

- [ ] Focused tests pass.
- [ ] Archive dry run is checksum-complete.
- [ ] V2 migration is generated but not applied.
- [ ] No canonical catalog file or V1 row changed.
- [ ] `pnpm run check:layout` passes.

