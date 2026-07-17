# Database restore runbook

**Scope:** Products + Admin Supabase Postgres, immutable SVG artifacts, catalog degraded mode, and maintenance mode.
**Architecture:** 2 Supabase + Cloudflare R2 + Vercel.

The SVG database tables and release pointer are planned. They are not live yet.

After migration, Products DB backups must include definitions, revisions, artifact metadata, and release pointers.

---

## When to use what

| Situation | First action |
|-----------|--------------|
| Bad deploy | Vercel → Instant Rollback |
| Wrong migration / bad data | Supabase dashboard → PITR / daily backup |
| Supabase project unavailable | R2 `pg_dump` → new Supabase project |
| Catalog pages empty during outage | Serve a verified R2 snapshot and committed immutable SVG artifacts. |
| SVG artifact missing or corrupt | Stop serving that revision and keep the prior valid release. |
| Planned maintenance | Set `SITE_MAINTENANCE_MODE=readonly` on Vercel |

---

## 1. Enable nightly backups (one-time)

GitHub → **Settings → Secrets → Actions** (or sync from repo root):

```powershell
pnpm --filter oando-site run backup:github-secrets:sync
```

Secrets:

- `PRODUCTS_DATABASE_URL`
- `SUPABASE_AUTH_DATABASE_URL`
- `CLOUDFLARE_S3_URL` (or `CLOUDFLARE_ACCOUNT_ID`)
- One intact S3 pair: `CLOUDFLARE_R2_ACCESS_KEY_ID` + `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
  (or alias pair `CLOUDFLARE_ACCESS_KEY_ID` + `CLOUDFLARE_SECRET_ACCESS_KEY`)
- `CLOUDFLARE_R2_CATALOG_BUCKET`

Workflow: [`.github/workflows/supabase-backup-r2.yml`](../../.github/workflows/supabase-backup-r2.yml) (daily 02:15 UTC). Requires Node 24, pnpm from root `packageManager` (11.13.0), PostgreSQL client 17 on the runner.

Manual run: **Actions → Supabase backup to R2 → Run workflow** (or `gh workflow run supabase-backup-r2.yml`).

**R2 layout after success:**

| Path | Contents |
|------|----------|
| `backups/products/pgdump-products-*.dump` | Products DB |
| `backups/admin/pgdump-admin-*.dump` | Admin DB |
| `backups/catalog/catalog-latest.json` | Full catalog for degraded reads (**85** products = live `catalog_products` count) |
| Content-addressed SVG artifact keys | Immutable sanitized bytes after SVG cutover |
| `backups/repo/oofplweb-*.zip` | Git archive |

After cutover, snapshots must include released product, revision, checksum, artifact kind, and storage identity.

They must exclude drafts, credentials, audit internals, and private commercial fields.

Enable GitHub email notifications: **Watch → Custom → Actions**.

---

## 2. Restore SQL from Supabase dashboard (fastest)

**Products project**

1. Supabase dashboard → **Database → Backups**
2. Pick restore point → Restore (or PITR if enabled)

**Admin project** — same steps on the admin Supabase project.

Verify:

```powershell
pnpm --filter oando-site run db:test
pnpm --filter oando-site run db:apply --dry
pnpm --filter oando-site run db:apply:admin --dry
```

---

## 3. Restore SQL from R2 pg_dump (project lost / dashboard unavailable)

### 3a. Download dump

From Cloudflare R2 bucket (`oando-asset-cdn` by default):

- Latest products: `backups/products/pgdump-products-<timestamp>.dump`
- Latest admin: `backups/admin/pgdump-admin-<timestamp>.dump`

### 3b. Create replacement Supabase projects (if needed)

Create two new projects or one staging pair for drill:

- Products → get new `PRODUCTS_DATABASE_URL`
- Admin → get new `SUPABASE_AUTH_DATABASE_URL`, `NEXT_ADMIN_SUPABASE_URL`, service role keys

### 3c. Restore with pg_restore

```powershell
# PRODUCTS_DATABASE_URL must already be set in the shell (Supabase Session pooler URI).
if (-not $env:PRODUCTS_DATABASE_URL) { throw "Set PRODUCTS_DATABASE_URL first." }
$TargetDb = $env:PRODUCTS_DATABASE_URL
pg_restore -d $TargetDb --no-owner --no-acl -Fc products.dump
```

Run separately for products and admin dumps into the matching project.

### 3d. Apply pending migrations

```powershell
pnpm --filter oando-site run db:apply
pnpm --filter oando-site run db:apply:admin
```

### 3e. Update Vercel env + redeploy

Update connection strings and Supabase HTTP keys → redeploy.

---

## 4. Quarterly restore drill (recommended)

1. Create **staging** Supabase projects (or use existing non-prod).
2. Restore latest R2 dumps into staging.
3. Point a preview Vercel env at staging URLs.
4. Run `db:test`, smoke catalog + planner guest.
5. Verify released pointers belong to the same product.
6. Verify artifact keys and exact byte checksums.
7. Verify Planner imports and reloads the exact revision.
8. Log the result and blockers in `Failures.md`.

---

## 5. Read-only maintenance mode

When Supabase Auth or Postgres is unstable:

**Vercel env**

```env
SITE_MAINTENANCE_MODE=readonly
```

Effects:

- Banner on site + planner
- `/admin`, `/crm`, `/ops` → maintenance page
- POST/PUT/PATCH/DELETE blocked on `/api/plans`, `/api/planner`, `/api/tracking`, `/api/quotes`, `/api/customer-queries`
- Public catalog + planner **local drafts** (IndexedDB) still work
- SVG publication, pointer changes, retirement, rollback, and cleanup are blocked

Clear flag when healthy:

```env
SITE_MAINTENANCE_MODE=off
```

(or remove the variable)

---

## 6. Catalog degraded mode (automatic)

The current catalog fallback reads in this order when `PRODUCTS_DATABASE_URL` fails:

1. R2 `backups/catalog/catalog-latest.json` (nightly export)
2. Bundled `site/features/site/data/localCatalogIndex.json` (subset)

No manual step unless R2 snapshot is stale — re-run:

```powershell
pnpm --filter oando-site run catalog:snapshot:r2
```

Live DB row count may differ from seed file (~100 inserts) or bundled fallback (`localCatalogIndex.json`); snapshot always reflects **current** `catalog_products` rows.

After SVG cutover, degraded reads may use only a released R2 snapshot and checksum-verified immutable artifact.

Bundled files are not current SVG authority.

Every degraded response must say it is stale or degraded.

Unverifiable state fails visibly.

---

## 7. Planner during outage

- **Cloud saves:** fail until admin DB returns
- **Local drafts:** IndexedDB + sync queue — sync when Supabase is back

---

## Contacts / ownership

| Asset | Owner action |
|-------|----------------|
| Supabase projects | Dashboard restore / billing |
| R2 bucket | Cloudflare dashboard |
| GitHub secrets | Repo admin |
| Vercel env | Project settings |

Log blockers in repo-root `Failures.md`.
