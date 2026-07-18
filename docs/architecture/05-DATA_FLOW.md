# Product data flow

## Live path — disk SVG (2026-07-17)

1. Admin edits in SVG studio (`site/features/admin/svg-editor/`).
2. Validate + compile in `publishDescriptorWithPipeline.ts` (S1–S3). Fail-closed on compile fail.
3. S4: SVG bytes → `site/public/svg-catalog/`; descriptor JSON → `site/inventory/descriptors/` (`{slug}.{n}.json` + `.latest.json`).
4. Lifecycle/audit → `results/admin/catalog-ops/` when configured (filesystem, not Products DB).
5. Dual-write resolve (`resolveSvgPublishDualWriteDeps`):
   - `skipped_no_db` — no Products DB URL
   - `skipped_r2_unavailable` — DB set, R2 ListObjects fail (disk publish not rolled back at resolve)
   - `enabled` — DB + R2 probe ok → inject repository + artifact put
6. When dual-write **enabled**, artifacts may write — still **not** sole revision/release authority. Disk remains live authority.
7. Optional best-effort Supabase catalog mirror after disk success; mirror failure must not undo disk.
8. Planner `svg-blocks`: DB-aware read of usable descriptors when configured, **disk fallback**. Not revision artifact-byte authority. `Block2D` = load/missing fallback only.

## Target path — Products DB

1. Admin edits draft product + SVG scene.
2. Server validation (identity, dimensions, structure, safety).
3. Deterministic SVG compile → immutable R2 artifact upload.
4. One Products DB transaction: metadata, same-product pointer, audit.
5. Planner loads released catalog + exact revision bytes via server API.
6. `Block2D` only while loading or unavailable.

Failed compile/upload/transaction leaves prior publication intact. Upload is not released until DB pointer commits.

## Customer planning

Guest/member route → one normalized document for canvas, 3D, save, export → placed products keep catalog identity/options → save failure never shows success → reload restores document. Guest IndexedDB keys scoped by plan UUID.

## BOQ handoff

Placed catalog products → stable product/option IDs → branded JSON/CSV/PDF → customer review → **Send to Oando** (`POST /api/planner/handoff`) → insert `customer_queries` (source `planner-handoff`) when admin CRM client env present → optional staff email via Resend → idempotency key + CSRF + rate limit. Demo list prices labeled; no commercial authority without approved price book.

Env names (values never in docs): `NEXT_ADMIN_SUPABASE_URL`, `SUPABASE_ADMIN_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `STAFF_NOTIFY_EMAIL`.

## Storage authority

| Layer | Target role | Live (2026-07-17) |
|---|---|---|
| Products DB | Release identity + pointer | Marketing + managed catalog; SVG dual-write optional when DB+R2 ready (≠ cutover) |
| R2 artifacts | Immutable SVG bytes | Dual-write put when probe ok; not release authority yet |
| Disk descriptors + svg-catalog | Migration/fixtures after cutover | **Live SVG authority** |
| Lifecycle filesystem | — | `results/admin/catalog-ops/` |
| Admin drafts | Private | Private |

Contract: `08-DATABASE-SVG-CONTRACT.md`. Active blocker: `../../Failures.md`.
