# Database seeding

Two databases, multiple entry points.  
**Env:** repo-root `.env.local` — `PRODUCTS_DATABASE_URL` (and `SUPABASE_AUTH_DATABASE_URL` for admin).  
**Commands:** `pnpm --filter oando-site run …` from **repo root** only.

## Quick reference

| Goal | Command | DB |
|------|---------|-----|
| Marketing catalog | `seed` | Products |
| Configurator catalog | `seed:configurator` | Products |
| Planner managed rows | `seed:managed` | Products (after schema exists) |
| Products migrations | `db:apply` | Products |
| Admin migrations | `db:apply:admin` | Admin |
| Admin schema verify | `db:sync-drizzle` | Admin |

`seed_direct.ts` is **deprecated** — not routine CI.

---

## Marketing catalog — `seed`

| | |
|--|--|
| Script | `site/scripts/seed.ts` |
| Data | `site/scripts/seed_data.sql` |
| Target | `catalog_products` / `catalog_categories` (via legacy view names `products` / `categories` when used in SQL) |

**Behaviour (live code):**

1. Loads env via `loadEnvLocal.cjs` from **repo root** (not only `site/.env.local`).
2. Connects with `postgres` (bypasses RLS).
3. Strips full-line `--` SQL comments before split (so category/product statements that follow comment headers are not dropped).
4. Upserts products; categories insert on conflict do nothing / upsert as written.
5. Safe to re-run.

```powershell
pnpm --filter oando-site run seed
```

**Workstations:** seed data includes `oando-workstations` (and related). Empty marketing workstations was a seed/comment-split bug, not a missing route — re-seed if DB lacks rows.

**Do not** use seed to invent SVG release authority. Live SVG remains disk until cutover.

---

## Configurator — `seed:configurator`

| | |
|--|--|
| Script | `site/scripts/seed_configurator_catalog.ts` |
| Target | `configurator_products` |

Separate from marketing so incomplete parametric rows never pollute the public catalog site.

```powershell
pnpm --filter oando-site run seed:configurator
```

---

## Planner managed — `seed:managed`

Idempotent workspace library rows into `planner_managed_products` (Products DB). Requires table from migrations (`db:apply`).

---

## Admin schema — not a data seed

```powershell
pnpm --filter oando-site run db:apply:admin
pnpm --filter oando-site run db:sync-drizzle
```

---

## SVG / proof pollution

- **Do not** leave `oando-param-proof-*` descriptors/SVGs as “test food.”
- Tests must not mutate committed catalog or rely on random proof slugs on disk.
- Dual-write / revision tables may receive rows when enabled; that is not cutover.

Contract: `docs/architecture/08-DATABASE-SVG-CONTRACT.md`. Schema honesty: `docs/database/SCHEMA.md`.

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `PRODUCTS_DATABASE_URL is not set` | Repo-root `.env.local` |
| `seed_data.sql not found` | Run from monorepo root via filter |
| Workstations total 0 | Re-run `seed`; verify category insert not skipped |
| Auth DB errors | Set `SUPABASE_AUTH_DATABASE_URL` for admin apply |
