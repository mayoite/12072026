# 05 Auth

Goal: prove guest, member, and admin route gates.

## Modules

- Auth.
- Middleware.
- Route gates.

## Allowed Scope

1. `site/features/shared/auth`
2. `site/lib/auth`
3. Middleware and route gate tests

## Hard No-Go Scope

1. Provider replacement.
2. Secret changes.
3. Database migration.

## Initial Proof

```powershell
rg -n "middleware|admin|guest|member|auth" site/app site/features site/lib
pnpm --filter oando-site run typecheck
```

## Route Matrix

1. Guest planner.
2. Member dashboard.
3. Admin dashboard.
4. Admin SVG editor.
5. CRM route.

## Exit Evidence

1. Route matrix result.
2. Auth failure buckets.
3. Env blockers, if any.

## Stop Conditions

1. Missing env blocks proof.
2. Auth behavior is a product decision.
3. Fix requires database migration.
