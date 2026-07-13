# 06 Database-backed SVG publication

## Goal

Admin stores block definitions, released revisions, and artifact metadata in the Products database.

Sanitized SVG artifacts use immutable content-addressed storage keys.

Planner imports the released revision through a server API.

The target contract is `../../../docs/architecture/08-DATABASE-SVG-CONTRACT.md`.

This file has no separate status.

Status remains in the Admin, Planner, and Security checklists.

Nothing is deferred to a later decision bucket.

## Current truth

`planner_managed_products` already exists in the Products database.

`GET /api/planner/catalog` already reads it.

`GET /api/planner/catalog/svg-blocks` still reads descriptors from disk.

That split authority is not acceptable as the final state.

The required SVG tables and product release pointer do not yet exist in the checked migration.

## Ownership

- Products database: products, block definitions, immutable SVG revisions, artifact metadata, and release pointer.
- Admin server: authenticated draft and publication writes.
- Planner catalog server: released read boundary.
- Admin checklist: authoring, publication, migration, and audit status.
- Planner checklist: import, rendering, persistence, and BOQ identity status.
- Security checklist: RLS, roles, data minimization, abuse, and failure status.

## Allowed scope

1. `site/platform/supabase/migrations/`
2. Products database access modules.
3. Admin SVG server actions and repositories.
4. Planner catalog server routes and adapters.
5. Database scripts and documentation.
6. Isolated database fixtures and focused tests.

## Hard limits

1. Do not apply a migration without explicit owner approval.
2. Do not edit live rows by hand.
3. Do not expose service credentials to browser code.
4. Do not let the browser write SVG rows directly.
5. Do not make disk files a production fallback authority.
6. Do not mutate released rows in tests.
7. Do not mark a schema file as proof of a live database.
8. Do not add a new Supabase `.from()` path for catalog or Planner data.

## Execution phase 0 — isolation and ownership proof

1. Verify root environment loading.
2. Identify the Products database project.
3. Verify the existing `planner_managed_products` schema live.
4. Record current RLS and grants.
5. Hash canonical disk descriptors and SVGs before tests.
6. Create temporary database fixtures with cleanup in `finally`.
7. Prove focused tests leave released rows and canonical hashes unchanged.

This phase blocks only database-writing tests.

Read-only planning and code review continue.

## Execution phase 1 — schema and migration

Plan one Products database migration.

It creates:

- `block_descriptors`.
- `published_svg_revisions` matching `PublishedRevisionV1`.
- `svg_artifacts` matching `SvgArtifactRecord`.
- `planner_managed_products.published_svg_revision_id`.
- Same-product pointer enforcement.
- Unique product-scoped revision numbers.
- Checksum and idempotency constraints.
- Required indexes.
- RLS policies and grants.

The migration also defines rollback or recovery.

Run its dry mode before approval.

Do not apply it until the owner approves the exact SQL and target database.

## Execution phase 2 — Admin write path

1. Save validated scene and descriptor drafts server-side.
2. Require an expected `lock_version` on updates.
3. Reject stale saves without overwriting newer work.
4. Compile and sanitize on the server.
5. Calculate SHA-256 from every exact artifact.
6. Upload artifacts to immutable content-addressed keys.
7. Insert revision and artifact metadata, update the product pointer, and write audit in one transaction.
8. Return the existing revision for an unchanged valid publish.
9. Preserve the prior pointer on every failure.
10. Keep uncommitted objects unreachable and clean verified orphans safely.
11. Return product, revision, checksums, and outcome to Admin.
12. Keep draft and audit fields out of public responses.

## Execution phase 3 — Planner import and cutover

1. Extend `GET /api/planner/catalog` with product and SVG revision identity.
2. Add `GET /api/planner/catalog/svg/[revisionId]`.
3. Resolve the committed artifact storage key.
4. Return exact sanitized SVG bytes as `image/svg+xml`.
5. Use the checksum as `ETag`.
6. Cache immutable revisions safely.
7. Reject draft, missing, mismatched, and retired revisions.
8. Pin product and SVG revision identity on placement.
9. Preserve both through save, reload, 2D, 3D, and BOQ.
10. Make Products DB, storage, and verified R2 snapshot state explicit.
11. Remove disk reads from the production SVG catalog path.

## Execution phase 4 — migration and parity

1. Inventory every existing descriptor and compiled SVG.
2. Verify identity, millimetre footprint, safety, and license provenance.
3. Dry-run database import.
4. Report additions, conflicts, rejects, dimensions, and hashes.
5. Import approved drafts into a non-production target.
6. Compare database and disk outputs by product ID, footprint, and checksum.
7. Publish through the normal transaction.
8. Run a temporary dual-read parity harness.
9. Cut Planner to database-only reads after parity passes.
10. Remove production disk-write authority.

Dual read is verification only.

It is not a permanent fallback.

## Execution phase 5 — security and operations

1. Prove Admin authorization at the page, API, and database boundaries.
2. Prove RLS and application rules agree.
3. Prove CSRF protection on browser writes.
4. Prove public responses exclude drafts and protected fields.
5. Prove malicious SVG input is rejected.
6. Prove stored and served SVG stays sanitized.
7. Prove rate limits for publication and public reads.
8. Prove audit records actor, product, revision, reason, result, and time.
9. Prove backup and restore include SVG tables and release pointers.
10. Prove the R2 degraded snapshot includes committed SVG revision and artifact identity.
11. Prove database or artifact-storage outage behavior does not invent success.

## Initial commands

```powershell
pnpm --filter oando-site exec node scripts/validate-launch-env.mjs
pnpm --filter oando-site run db:test
pnpm --filter oando-site run db:advisors
```

Run commands from the repository root.

Do not treat old output as proof.

## Required proof

1. Environment and database ownership.
2. Exact migration dry run.
3. Live schema and RLS inspection after approved application.
4. Transaction rollback on compile, insert, pointer, and audit failure.
5. Stale-lock rejection.
6. Idempotent unchanged publication.
7. Exact artifact byte, storage-key, and checksum parity.
8. Planner placement, save, reload, and BOQ identity.
9. Public-field minimization.
10. Products DB, artifact storage, and R2 snapshot outage and recovery.
11. Backup and restore coverage.

## Stop conditions

Stop only the dependent item when:

1. The target database cannot be identified.
2. Required environment values are missing.
3. The live schema disagrees with the plan.
4. The exact migration lacks owner approval.
5. Backup or rollback cannot be established.
6. Product identity conflicts cannot be resolved safely.

Other planning and read-only work continues.
