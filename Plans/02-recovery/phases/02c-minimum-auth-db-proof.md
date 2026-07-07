# 02c Minimum Auth And DB Proof

Goal: get the minimum auth and DB truth needed before admin publish or planner persistence work.

## Entry Condition

1. Phase 00 is complete.
2. Phase 00b contradictions are recorded.
3. Phase 01 has no package blocker for auth or DB proof.

## Allowed Scope

1. Read auth code.
2. Read DB config.
3. Run env validation if needed.
4. Record minimum route and DB ownership matrices.

## Hard No-Go Scope

1. Auth provider replacement.
2. Migrations.
3. Data edits.
4. Secret edits.
5. Runtime repair beyond proof collection.

## Initial Checks

```powershell
rg -n "middleware|admin|guest|member|auth" site/app site/features site/lib
rg -n "productsDb|adminDb|SUPABASE_AUTH_DATABASE_URL|PRODUCTS_DATABASE_URL|drizzle" site/platform site/scripts site/features site/app
pnpm --filter oando-site exec node scripts/validate-launch-env.mjs
```

Run env validation only when `.env.local` exists and secrets will not be printed.

## Minimum Matrix

| Field | Required |
| --- | --- |
| Route or mutation | Path or function |
| Actor | Guest, member, admin, service |
| DB owner | Products DB, Admin DB, none, or unknown |
| Auth required | Yes, no, or unknown |
| Evidence | Command or skipped reason |

## Artifact Path

```text
results/auth-db/02c-minimum-auth-db-proof/minimum-proof/minimum-proof-run.json
results/auth-db/02c-minimum-auth-db-proof/minimum-proof/minimum-proof-raw.log
```

## Exit Evidence

1. Minimum route matrix.
2. Minimum DB owner matrix.
3. Env validation result or skipped reason.
4. Secrets redaction confirmation.

## Stop Conditions

1. Env validation would expose secrets.
2. DB ownership is unclear.
3. Auth route behavior is a product decision.
4. Migration is required.
