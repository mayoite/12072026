# DB-SVG residual — pointer applied, cutover still OPEN

**Date:** 2026-07-18  
**Task:** R5 (docs only)  
**Verdict:** Pointer migration **applied**. Production dual-write publish **OPEN**. Cutover **OPEN**. **Do not set `SVG_RELEASE_AUTHORITY=db`.**

## Applied migration

| Item | Value |
|------|--------|
| File | `site/platform/supabase/migrations/20260716100000_add_published_svg_revision_id.sql` |
| Target | Products DB |
| Column | `planner_managed_products.published_svg_revision_id` (text, nullable) |
| Index | `idx_planner_managed_products_published_svg_revision_id` (partial, non-null) |
| Apply command | `pnpm --filter oando-site run db:apply` |
| Applied | **2026-07-18** (owner env) |

Migration SQL:

```sql
alter table public.planner_managed_products
  add column if not exists published_svg_revision_id text;
-- + partial index on published_svg_revision_id
```

Pointer references `svg_revisions.revision_id` (DB-SVG-05). Column alone is not cutover.

## Verify script commands

Run from **repo root**. Requires root `.env.local` with `PRODUCTS_DATABASE_URL`.

### 1. Pointer column + migration history

```powershell
pnpm --filter oando-site exec tsx scripts/db_verify_published_svg_pointer.ts
```

Expect:

- `OK: column present` for `published_svg_revision_id`
- `OK: migration history …` for `20260716100000_add_published_svg_revision_id.sql`  
  (or `WARN` if column exists but history row missing)

Exit `1` if column missing or URL unset.

### 2. Dual-write resolve (live mode)

Resolver: `site/features/admin/svg-editor/publish/resolveSvgPublishDualWrite.ts`  
(`resolveSvgPublishDualWriteDeps({ forceR2Probe: true })`).

Optional readiness script (R1, if present):

```powershell
pnpm --filter oando-site exec tsx scripts/db_dual_write_readiness.ts
```

Expect print of `mode` + `r2Probe`; exit `0` only when `mode === "enabled"`.

### 3. Re-apply plan (dry / apply)

```powershell
pnpm --filter oando-site run db:apply -- --dry
pnpm --filter oando-site run db:apply
```

Do not re-apply blindly in production without owner approval. Idempotent `IF NOT EXISTS` on column/index.

### 4. Unit coverage (not env proof)

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/features/admin/svg-editor/publish/resolveSvgPublishDualWrite.test.ts `
  tests/unit/features/admin/svg-editor/publish/svgReleaseAuthority.test.ts
```

Unit green ≠ production dual-write PASS.

## Dual-write modes

Source: `resolveSvgPublishDualWriteDeps` / `SvgPublishDualWriteMode`.

| Mode | When | Injects DB+R2? | Disk publish under default authority |
|------|------|----------------|--------------------------------------|
| `skipped_no_db` | `PRODUCTS_DATABASE_URL` not configured | No | Allowed (disk-only) |
| `skipped_r2_unavailable` | DB configured; R2 ListObjects probe not ok | No | Allowed (disk-only; no dual-write rollback) |
| `skipped_schema_missing` | DB + R2 ok; `published_svg_revision_id` absent | No | Allowed (disk-only; avoids hard pointer UPDATE crash) |
| `enabled` | DB + R2 ok + pointer column present | Yes | Allowed; dual-write fail-closed (DB/R2 error rolls back disk) |

Rules:

- **Default authority is disk.** Live paths: `inventory/descriptors/`, `public/svg-catalog/`.
- **`enabled` ≠ cutover.** Rows in Products DB + R2 objects are not sole release authority until flip + proof.
- When `enabled`: honest immutable artifacts (descriptor + SVG + PNG + checksums); product pointer via `DrizzleSvgRevisionPersistence` (0 matching products ok; >1 fail-closed).
- When `SVG_RELEASE_AUTHORITY=db` and mode ≠ ready: publish **fails closed** (no silent disk-only success). See `svgReleaseAuthority.ts`.

## Live vs target (honesty)

| Surface | Live (2026-07-18) | Target cutover |
|---------|-------------------|----------------|
| Admin publish write | Disk | Products DB transaction + R2 |
| Dual-write | Optional when mode `enabled` | Required path under db authority |
| Lifecycle / audit | `results/admin/catalog-ops/` | Durable store |
| Planner SVG read | DB-aware when configured; **disk fallback** | Revision API + R2 bytes only |
| `SVG_RELEASE_AUTHORITY` | Default **disk** (unset) | `db` only after checklist |

Contract: `docs/architecture/08-DATABASE-SVG-CONTRACT.md` (`DB-SVG-01`…`20`).  
Active blocker: `Failures.md`.

## Cutover checklist

Do **not** mark cutover PASS or set `SVG_RELEASE_AUTHORITY=db` until every box is proven in the **target environment**.

### Schema (done 2026-07-18)

- [x] Apply `20260716100000_add_published_svg_revision_id.sql` to Products DB  
- [x] Verify column via `db_verify_published_svg_pointer.ts`  
- [x] Dual-write gate soft-skips on missing column (`skipped_schema_missing`)

### Dual-write publish (OPEN)

- [ ] Live resolve mode is `enabled` (Products DB + R2 + schema)  
- [ ] One **real Admin publish** of an **inventory product** (server action or `POST /api/admin/svg-editor`):
  - [ ] Disk path succeeds (current live authority)
  - [ ] R2 receives immutable `descriptor` + `svg` + PNG (checksum match)
  - [ ] `svg_revisions` + artifact rows + `block_descriptors` written
  - [ ] Matching `planner_managed_products.published_svg_revision_id` set when product exists (0 ok; >1 fail-closed)
- [ ] Failed dual-write after inject does not leave silent half-state as “success”

### Planner consumer (OPEN)

- [ ] `GET /api/planner/catalog/svg-blocks` exposes `/api/planner/catalog/svg/{revisionId}` for that product  
- [ ] `GET /api/planner/catalog/svg/{revisionId}` returns R2 bytes with checksum integrity  
- [ ] No disk-only reliance for that released symbol under intended post-cutover path

### Authority flip (last; OPEN)

- [ ] Only after publish + Planner proof above  
- [ ] Set `SVG_RELEASE_AUTHORITY=db` in that environment only  
- [ ] Re-prove fail-closed:
  - [ ] Missing R2/DB blocks publish (no disk-only silent success)
  - [ ] Empty/corrupt DB does **not** fall back to disk for public release reads  
- [ ] Contract IDs DB-SVG-01…20 evidenced (not schema-file-only)

## Explicit non-claims

- Not cutover PASS  
- Not production dual-write publish PASS  
- Not recommending `SVG_RELEASE_AUTHORITY=db` now  
- Unit dual-write green does not close the gap  
- Pointer column applied does not close the gap  

## References

| Path | Role |
|------|------|
| `Failures.md` | Active blocker (short) |
| `docs/architecture/08-DATABASE-SVG-CONTRACT.md` | Target contract |
| `site/features/admin/svg-editor/publish/resolveSvgPublishDualWrite.ts` | Dual-write modes |
| `site/features/admin/svg-editor/publish/svgReleaseAuthority.ts` | Authority + fail-closed |
| `site/scripts/db_verify_published_svg_pointer.ts` | Column verify |
| `agent-reports/2026-07-17-fail0-w2.md` | Prior dual-write probe (pre-migration column miss) |

## Files touched (this R5)

- `Failures.md` — tightened DB-SVG entry; pointer applied date; numbered OPEN steps; no flip  
- This report  

No production code. No commit.
