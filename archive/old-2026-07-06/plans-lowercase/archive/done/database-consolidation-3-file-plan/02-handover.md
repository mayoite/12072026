# Database Consolidation — Handover

**Last updated:** 2026-06-29

**Plan:** [`01-execution-plan.md`](01-execution-plan.md) · **Scope:** [`00-start.md`](00-start.md)

---

## Done (agent, 2026-06-29)

| Check | Result |
|-------|--------|
| `pnpm run typecheck` | **green** |
| `pnpm --filter oando-site run db:test` | **green** — admin Supabase, `oando_plans` reachable |
| `pnpm --filter oando-site run catalog:snapshot:r2` | **green** — 85 products → R2 (`catalog-latest.json`) |
| `gh workflow run supabase-backup-r2.yml` | **dispatched** — [run 28382419944](https://github.com/ayushonmicrosoft/OOFPLWeb/actions/runs/28382419944) |

Architecture in code matches locked plan: `PRODUCTS_DATABASE_URL` + `SUPABASE_AUTH_DATABASE_URL` + R2.

---

## Not done (owner / ops only)

| # | Task | Owner |
|---|------|--------|
| 1 | Remove `DATABASE_URL` + `ORIGIN_ENDPOINT` (DO Spaces) from Vercel + `.env.local` | **You** |
| 2 | Decommission DO Postgres in DigitalOcean | **You** |
| 3 | Vercel prod deploy (`site/` root) | **You** |
| 4 | Confirm scheduled backup cron (02:15 UTC) after dispatch run is green | **You** |

**Note:** `site/scripts/push_vercel_env_from_local.mjs` still lists `DATABASE_URL` and `ORIGIN_ENDPOINT` — do not push those after cleanup, or remove them from that script.

---

## Optional (not run)

- `pnpm run release:gate` — blocked on site ESLint debt (see root `Failures.md`)
- Migration apply / prod deploy — not permissioned

---

## Outage

`SITE_MAINTENANCE_MODE=readonly` — `docs/database/RESTORE-RUNBOOK.md` §5

---

## Baseline

| Item | Now |
|------|-----|
| Drizzle dual-DB | live |
| `db:test` | green |
| Catalog R2 snapshot | green (85 rows) |
| DO legacy env | still open in `Failures.md` |
