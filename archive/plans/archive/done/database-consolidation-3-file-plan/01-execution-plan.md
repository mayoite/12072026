# Database Consolidation — Pending

**Last updated:** 2026-06-29

**Path convention:** app commands and env use `site/` (`pnpm --filter oando-site` from repo root).

Architecture is locked. **Only owner/ops items remain.**

---

## Pending (owner)

| # | Task | Owner |
|---|------|--------|
| 1 | Remove `DATABASE_URL` + DO Spaces keys from Vercel and `.env.local` | You |
| 2 | Decommission DO Postgres in DigitalOcean dashboard | You |
| 3 | Vercel deploy (root directory `site/`) | You |
| 4 | Verify scheduled `supabase-backup-r2` cron (02:15 UTC) | You / CI |

**Outage:** `SITE_MAINTENANCE_MODE=readonly` — `docs/database/RESTORE-RUNBOOK.md` §5.

---

## Optional (permissioned)

| Task | Notes |
|------|--------|
| `pnpm run release:gate` | Not re-run since consolidation |
| `pnpm --filter oando-site run db:test` | After env cleanup |

---

## Verification (when env ready)

```powershell
pnpm run typecheck
pnpm --filter oando-site run db:test
pnpm --filter oando-site run catalog:snapshot:r2
gh workflow run supabase-backup-r2.yml
```
