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

## Stop Conditions

1. Env missing.
2. Connection fails.
3. Migration needed.
4. Mutation requires product or auth decision.
