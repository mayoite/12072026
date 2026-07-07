# 05 Auth

Goal: prove guest, member, and admin route gates.

## Modules

- Auth.
- Middleware.
- Route gates.
- Server Function auth checks.

## Allowed Scope

1. `site/features/shared/auth`
2. `site/lib/auth`
3. Middleware and route gate tests

## Hard No-Go Scope

1. Provider replacement.
2. Secret changes.
3. Database migration.
4. Treating Server Functions as private only because they live on the server.

## Server Function Rule

Every mutation must verify auth and authorization.

Do not rely on file location as security.

Server Functions can be invoked from client flows.

For auth-sensitive mutations, record:

1. Caller role.
2. Required permission.
3. Failure behavior.
4. Redirect or error path.

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

## ASVS/Session Matrix

Use ASVS and session-management checks as benchmark guidance.

Record:

| Field | Required |
| --- | --- |
| Route or mutation | Path or function |
| Actor | Guest, member, admin, service |
| Authn required | Yes or no |
| Authz rule | Role or ownership rule |
| Session/cookie concern | Present, absent, or not applicable |
| Failure behavior | Redirect, 401, 403, or safe error |
| Evidence | Command, browser artifact, or skipped reason |

## Exit Evidence

1. Route matrix result.
2. Auth failure buckets.
3. Env blockers, if any.
4. Mutation auth matrix, if touched.
5. Cookie/session review, if auth behavior is touched.

## Stop Conditions

1. Missing env blocks proof.
2. Auth behavior is a product decision.
3. Fix requires database migration.
4. Mutation ownership is unclear.
