# Operations Runbook

**Last updated:** 2026-06-30

**Owns:** deploy, backup, recovery, incidents. Commands → `START.md`. Conduct → `AGENTS.md`. Gate policy → `Failures.md`. Deep restore → `docs/database/RESTORE-RUNBOOK.md`.

**Vercel:** Root Directory = **`site`**. [`site/vercel.json`](site/vercel.json) — workspace install from repo root, then build in `site/`.

## Deploy

**Production**

1. Read `Failures.md` gate policy (`AGENTS.md` → Gates).
2. `pnpm run release:gate` — only if policy allows (`START.md` → Release gate).
3. `pnpm run vercel:prod` — secretlint + gate + `vercel --prod`.

**Preview:** `pnpm run vercel:preview`

**Rollback:** Vercel dashboard → Deployments → Instant Rollback on last good deploy. Or checkout known-good commit → `pnpm run vercel:prod`.

## Database

**Policy:** 2 Supabase (products + admin) + R2 offsite. Dashboard PITR + scripted copies.

**What is backed up**

- Catalog SQL — Products Supabase → dashboard + R2 `backups/products/`
- Auth / CRM / plans — Admin Supabase → dashboard + R2 `backups/admin/`
- Assets — R2 `oando-asset-cdn` → bucket versioning
- App code — GitHub → `git push` + R2 `backups/repo/` zip

**Backup commands** (all `pnpm --filter oando-site run` unless noted)

- Nightly SQL — GitHub Actions [`supabase-backup-r2.yml`](.github/workflows/supabase-backup-r2.yml) (02:15 UTC)
- Catalog JSON fallback — same workflow → R2 `backups/catalog/catalog-latest.json`
- Read-only mode — Vercel `SITE_MAINTENANCE_MODE=readonly`
- Local SQL dump — `db:backup:pgdump -- --target products|admin`
- Offsite SQL — `backup:supabase:r2`
- Repo zip to R2 — `repo:backup:r2`
- Combined — `backup:r2`
- Routine JSON — `supabase:backup`
- Pre-drop safety — `db:backup-dropped`

**Pre-apply:** backup before `db:apply` when SQL has `DROP`, column type change, or data backfill. Skip for idempotent index / `CREATE IF NOT EXISTS`.

**Apply:** `db:apply` · `db:apply:admin` · **Restore:** Supabase dashboard or `docs/database/RESTORE-RUNBOOK.md` · **Schema:** `db:sync-drizzle`, `db:types` · **Advisors:** `db:advisors:security`, `db:advisors:performance`, `db:advisors:admin` (report: `docs/audit/database/advisors-report.md` — target zero SECURITY ERRORs before gate).

Env: repo-root `.env.local` via `loadEnvLocal.cjs`. Actions secrets: `pnpm --filter oando-site run backup:github-secrets:sync`.

## Incidents

**Planner not loading** — Check `/planner` 200 + Vercel deploy; browser WebGL; `PlannerErrorBoundary`; IndexedDB (clear resets drafts).

**Auth** — `NEXT_PUBLIC_SUPABASE_*`; Supabase status; guest `/planner/guest/` still works.

**DB** — `pnpm --filter oando-site run db:test`; Supabase dashboard; pool exhaustion.

**Catalog images** — `assets:cdn:audit` → `assets:cdn:fix -- --apply`; check R2 `oando-asset-cdn`.

## Monitoring

- **Smoke:** `/`, `/planner`, `/sitemap.xml` → 200
- **Launch:** `launch:env`, `launch:smoke`, `audit:hosted:runtime`
- **Recovery:** `recovery:snapshot`, `recovery:watch`

## Assets & catalog

CDN and catalog scripts: **`START.md`** (Useful site-only scripts). Path policy: **`Readme.md`** (Assets & CDN).
