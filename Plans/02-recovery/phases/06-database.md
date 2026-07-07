# 06 Database

Goal: prove DB env, Drizzle ownership, and safe access.

## Modules

- Database.
- Drizzle.
- DB scripts.
- Server-side mutations.

## Allowed Scope

1. `site/platform/drizzle`
2. `site/platform/drizzle/schema`
3. DB scripts
4. DB docs

## Hard No-Go Scope

1. Migrations unless explicitly approved.
2. Direct data edits.
3. New Supabase `.from()` SQL for catalog/planner data.
4. Mutation work without auth ownership.

## Server Mutation Rule

Database mutations must stay server-side.

Every mutation path must state:

1. Auth check.
2. Database owner.
3. Schema owner.
4. Error behavior.
5. Evidence command.

Do not add new catalog or planner SQL through Supabase HTTP clients.

## Migration And Transaction Policy

Migrations are explicit-scope work only.

Before any migration:

1. Identify schema owner.
2. Identify affected DB.
3. Generate or locate SQL.
4. Define rollback or recovery path.
5. Confirm data backup policy.
6. Get explicit approval.

Transaction rule:

1. Multi-step writes need a transaction or a documented reason.
2. Partial writes must be recoverable.
3. Failed publish/save paths must leave consistent state.

## RLS Policy Map

Record table-level access:

| Table/domain | DB | RLS expected | Server auth check | Evidence |
| --- | --- | --- | --- | --- |
| Planner projects | Admin DB | Unknown until checked | Required | Pending |
| Catalog/products | Products DB | Unknown until checked | Required | Pending |
| CRM data | Admin DB | Unknown until checked | Required | Pending |

## Initial Commands

```powershell
pnpm --filter oando-site exec node scripts/validate-launch-env.mjs
pnpm --filter oando-site run db:test
```

## Exit Evidence

1. Env validation result.
2. DB test result.
3. Products DB ownership.
4. Admin DB ownership.
5. Migration risk, if any.
6. Mutation auth and DB ownership, if touched.
7. RLS matrix, if table access is reviewed.

## Stop Conditions

1. Env missing.
2. Connection fails.
3. Migration needed.
4. Mutation requires product or auth decision.
