# Database Consolidation — Scope

**Archived:** 2026-06-29 → `archive/plans/done/database-consolidation-3-file-plan/`. Live status: root [`Failures.md`](../../../Failures.md).

Read **`01-execution-plan.md`** for pending tasks.

## Locked architecture

2 Supabase + R2 + Drizzle (`productsDb`, `adminDb`). App on Vercel (`site/`). Not in target: DO Postgres, DO Spaces.

## Remove from env (owner)

```env
DATABASE_URL=
ORIGIN_ENDPOINT=
```

Keep: `PRODUCTS_DATABASE_URL`, `SUPABASE_AUTH_DATABASE_URL`, R2 keys — see `.env.example`.

## Rules

No deploy or migration apply without explicit permission. Log gaps in `Failures.md`.
