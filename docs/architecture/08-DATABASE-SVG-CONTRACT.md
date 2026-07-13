# Database SVG contract

## Status

This is the target architecture.

It was accepted by the owner on 2026-07-13.

It is not proof of implementation.

## Decision

The Products database owns released SVG identity and revision truth.

Admin authors and publishes them.

Planner imports them through server APIs.

The released SVG artifact uses an immutable content-addressed storage key.

Its revision and artifact metadata live in the Products database.

Public static SVG files are not the release authority.

They may exist as migration inputs or test fixtures.

They must not silently override database truth.

## Current gap

The product catalog already reads `planner_managed_products` from the Products database.

The SVG-block route still reads descriptors from disk.

That is a split authority.

It must be removed.

## Ownership

The Products database owns:

- Published product identity.
- Block definitions and authoring drafts.
- Immutable SVG revisions.
- Immutable artifact metadata and storage keys.
- The current published revision pointer.
- The append-only publication event ledger.

The Admin server owns writes.

The Planner catalog server owns public reads.

The browser never receives database credentials or write authority.

## Data model

Catalog and SVG persistence use Drizzle.

Do not add a new Supabase `.from()` path for catalog or Planner data.

### `block_descriptors`

One mutable draft exists per product.

Required fields are:

| Field | Purpose |
|---|---|
| `product_id` | Foreign key to `planner_managed_products`. |
| `definition` | Validated `SvgBlockDefinitionV1` JSON. |
| `scene_document` | Validated no-code scene JSON when it differs from the definition. |
| `schema_version` | Definition contract version. |
| `checksum` | Canonical definition checksum. |
| `lock_version` | Optimistic concurrency token. |
| `updated_by` | Admin actor. |
| `updated_at` | Last saved time. |

Draft rows are private.

They are never returned by public catalog routes.

### `published_svg_revisions`

Published revisions are immutable.

Required fields are:

| Field | Purpose |
|---|---|
| `id` | Stable UUID. |
| `revision_id` | Stable `PublishedRevisionV1.revisionId`. |
| `definition_type_id` | Stable product or block type identity. |
| `definition_version` | Immutable definition version. |
| `source_revision` | Source draft revision. |
| `compiler_version` | Compiler contract version. |
| `definition_snapshot` | Exact validated `SvgBlockDefinitionV1`. |
| `artifact_checksums` | Descriptor, SVG, PNG, and thumbnail checksums. |
| `validation` | Successful publication diagnostics. |
| `actor_id` | Publishing Admin actor. |
| `published_at` | Publication time. |
| `reason` | Required publication reason. |
| `supersedes_id` | Prior released revision when present. |

The database enforces unique `(definition_type_id, definition_version)`.

The database enforces the revision and checksum rules required for idempotency.

Released SVG text is never edited in place.

### `svg_artifacts`

Artifact rows implement the live `SvgArtifactRecord` contract.

Required fields are:

| Field | Purpose |
|---|---|
| `revision_id` | Foreign key to `published_svg_revisions`. |
| `kind` | `descriptor`, `svg`, `png`, or `thumbnail`. |
| `checksum` | SHA-256 of exact artifact bytes. |
| `storage_key` | Immutable content-addressed object key. |
| `width` | Thumbnail width when relevant. |
| `media_type` | Exact response media type. |
| `byte_size` | Exact artifact byte count. |

The sanitized SVG artifact is uploaded before pointer activation.

The object key includes or is bound to its checksum.

An object without a committed database revision is not public truth.

### `svg_publication_events`

Publication success audit must commit in the Products database.

The existing Admin database `audit_events` table cannot join the Products database transaction.

It is not the atomic publication ledger.

The Products database therefore receives an append-only publication event table.

Required fields are:

| Field | Purpose |
|---|---|
| `id` | Stable event UUID and downstream idempotency key. |
| `product_id` | Published product identity. |
| `revision_id` | Committed SVG revision identity. |
| `actor_id` | Authenticated Admin actor. |
| `action` | Publish, rollback, retire, or restore transition. |
| `reason` | Required operator reason. |
| `prior_revision_id` | Pointer value before the transition. |
| `next_revision_id` | Pointer value after the transition. |
| `artifact_bundle_checksum` | Checksum identity authorized for the transition. |
| `occurred_at` | Database-assigned event time. |
| `delivery_state` | Optional outbox delivery state for downstream projection. |

The row is inserted in the same Products database transaction as revision metadata and the product pointer.

It is the authoritative success audit for the release transition.

After commit, an outbox worker may project the event into Admin DB reporting.

Projection is at-least-once and deduplicates by event `id`.

A projection failure never rolls back or misreports the committed Products database release.

Failed attempts cannot be recorded inside a transaction that rolls back.

They are recorded separately in server security telemetry with the attempted product, actor, reason, and failure class.

### Product release pointer

`planner_managed_products` receives `published_svg_revision_id`.

It references `published_svg_revisions.revision_id`.

The referenced revision must belong to the same product.

Only an active product with a valid published revision enters the released Planner catalog.

## Publication transaction

The server performs these steps:

1. Authenticate the Admin.
2. Authorize the publication action.
3. Read the expected draft lock version.
4. Validate product, descriptor, scene, dimensions, and SVG safety.
5. Compile and sanitize once.
6. Compute every artifact SHA-256 checksum.
7. Upload immutable artifacts to content-addressed storage.
8. Start one database transaction.
9. Lock the product and draft rows.
10. Reject a stale draft lock version.
11. Insert one immutable revision and its artifact metadata.
12. Update the product's published revision pointer.
13. Insert the append-only `svg_publication_events` success record.
14. Commit.

Any failed step rolls back the transaction.

The prior product pointer remains live.

An unchanged valid publish returns the existing revision.

It does not create duplicate releases.

An uploaded object left by a failed database transaction is an orphan.

It is never linked publicly.

A cleanup job removes verified orphans after a safe retention window.

## Planner import boundary

`GET /api/planner/catalog` returns released product records.

Each record includes:

- Product ID and version.
- SVG revision ID.
- SVG checksum.
- Width and depth in millimetres.
- Immutable SVG resource URL.

`GET /api/planner/catalog/svg/[revisionId]` resolves the committed artifact record.

It returns the exact sanitized SVG bytes from the immutable storage key.

It returns `image/svg+xml`.

It uses the checksum as an `ETag`.

Immutable revisions may use immutable cache headers.

The route never accepts a draft identifier.

Planner pins the product ID and SVG revision ID in placed items.

Reload and BOQ generation keep that identity.

## Failure behavior

A database outage is explicit.

Production must not present an unverified disk file as the current release.

The documented R2 catalog snapshot may serve a previously released revision.

The snapshot must include revision and artifact identity.

The artifact checksum must still verify.

The response must identify stale or degraded catalog state.

`Block2D` remains a visual fallback for a missing symbol.

It does not become product truth.

## Migration from disk

The migration is deliberate.

It uses these stages:

1. Inventory every existing descriptor and SVG.
2. Validate identity, dimensions, safety, and license provenance.
3. Compile and checksum without writing live data.
4. Produce a dry-run report of additions, conflicts, and rejects.
5. Import drafts into non-production tables.
6. Compare record counts, product IDs, footprints, and hashes.
7. Publish approved revisions through the normal transaction.
8. Run database and disk reads in comparison mode.
9. Cut Planner to database-only reads.
10. Remove production disk-write authority.

Tests use temporary rows and transactions.

Tests never mutate released catalog rows.

## Security

Admin writes use server-only Drizzle access.

Database and storage credentials never reach browser code.

Public reads expose released fields only.

RLS and application authorization must agree.

SVG content is validated before storage and before response.

Responses use a restrictive SVG content policy.

Publication, rollback, and retirement are audited.

Products database publication events are the atomic release ledger.

Admin database audit rows are a post-commit projection only.

Rate limits apply at public and Admin boundaries.

## Acceptance contract

| ID | Requirement |
|---|---|
| DB-SVG-01 | The Products database is the released SVG revision and pointer authority. |
| DB-SVG-02 | Draft scenes and descriptors are private and version-locked. |
| DB-SVG-03 | Published SVG revisions are immutable. |
| DB-SVG-04 | Each revision conforms to `PublishedRevisionV1`, stores the exact definition snapshot, and has artifact rows matching `SvgArtifactRecord`. |
| DB-SVG-05 | The product points to one same-product published SVG revision. |
| DB-SVG-06 | Publication uploads immutable artifacts, then inserts metadata, the pointer, and a Products DB publication event in one transaction. |
| DB-SVG-07 | Failed publication leaves the prior pointer live. |
| DB-SVG-08 | Repeated unchanged publication is idempotent. |
| DB-SVG-09 | Stale draft versions are rejected without data loss. |
| DB-SVG-10 | Planner reads released SVG identity through a server catalog API. |
| DB-SVG-11 | Planner imports exact SVG bytes through the committed revision and artifact storage key. |
| DB-SVG-12 | The SVG resource uses `image/svg+xml`, checksum `ETag`, and safe immutable caching. |
| DB-SVG-13 | Placed items pin product and SVG revision identity. |
| DB-SVG-14 | Drafts, credentials, audit internals, and commercial data never enter public responses. |
| DB-SVG-15 | Products DB, artifact storage, R2 snapshot, and stale degraded states are explicit. |
| DB-SVG-16 | A disk file never silently overrides a database release. |
| DB-SVG-17 | Migration dry-runs and reports additions, conflicts, rejects, footprints, and hashes. |
| DB-SVG-18 | Cutover proves database and approved source parity before disk authority is removed. |
| DB-SVG-19 | Drizzle access, RLS, server authorization, CSRF, rate limits, and audit pass positive and negative checks. |
| DB-SVG-20 | Tests use isolated temporary rows and never mutate released rows. |

## Verification

Do not close an ID from a schema file alone.

Verify the real database contract.

Verify transaction rollback.

Verify stale-write rejection.

Verify idempotency.

Verify exact byte and checksum parity.

Verify Planner import and reload.

Verify public data minimization.

Verify database outage behavior.

Record commands and exit codes in the active track checklists.
