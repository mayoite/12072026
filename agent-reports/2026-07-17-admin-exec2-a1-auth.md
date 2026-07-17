# EXEC-2 A1 — Admin auth gates

**Date:** 2026-07-17  
**Agent:** ADMIN-EXEC-2  
**Scope:** Automated auth for Admin (bypass off)

## Verdict

| Claim | Status |
|-------|--------|
| Unauth `/admin` → `/access` (unit, bypass off) | **PASS** |
| Nested `/admin/*` → `/access` (unit, bypass off) | **PASS** |
| Unauth `/api/admin` → 401 (unit, bypass off) | **PASS** |
| Non-admin member → 403 (API) / redirect (layout session) | **PASS** |
| `requireAdminSession` / `resolveAuthContext` / `isProtectedPath` | **PASS** |
| Browser unauth journey (bypass off) | **OPEN** (not run; do not kill owner dev server) |
| Deploy/preview real session (**ADM-AUTH-03**) | **OPEN** |
| Bypass-on local interactive admin | Expected for dev; **not** deploy proof |

Automated A1 exit gate: **met**. Deploy auth remains **OPEN**.

## Layers (live code)

| Layer | Path | Unauth (bypass off) |
|-------|------|---------------------|
| Edge proxy | `site/proxy.ts` | `isProtectedPath` → redirect `/access?next=…` for `/admin` and `/admin/*` |
| Admin layout | `site/app/admin/layout.tsx` | `requireAuthUser("/admin", "admin")` |
| Session gate | `site/lib/auth/session.ts` | no user → access; non-owner → `/dashboard?error=unauthorized_admin_access` |
| API helper | `site/app/api/admin/_lib/server.ts` | `requireAdminSession` → 401/403 JSON |
| withAuth | `site/features/shared/api/withAuth.ts` | `resolveAuthContext("admin")` → 401/403 |
| Bypass | `site/lib/auth/devAuthBypass.ts` | only `DEV_AUTH_BYPASS=1` **and** non-production |

`/api/admin/*` is **not** edge-redirected to `/access` (by design). JSON 401/403 comes from `requireAdminSession` / `withAuth({ role: "admin" })`.

## Fresh command evidence

```text
pnpm --filter oando-site exec vitest run \
  tests/unit/proxy.test.ts \
  tests/unit/lib/auth/session.test.ts \
  tests/unit/app/api/admin/_lib/server.test.ts \
  tests/unit/features/shared/api/withAuth.test.ts \
  tests/unit/app/admin/layout.test.tsx \
  tests/unit/lib/auth/devAuthBypass.test.ts \
  tests/unit/lib/auth/roles.test.ts
```

**Result:** 7 files, **82 tests passed** (this session).

## What this agent changed

Additive test honesty only (no product auth logic rewrites; coordinated with FIX-ADMIN / TDD-3):

- `site/tests/unit/features/shared/api/withAuth.test.ts`
  - Force `DEV_AUTH_BYPASS=0` in suite setup so unauth admin paths cannot pass under local bypass env.
  - Add admin-route unauth **401** case with role `admin` and `/api/admin/plans` URL.
  - Point existing admin 403 case at `/api/admin/plans`.

Proxy nested-path / production-bypass-off cases already present (parallel agents); re-verified green.

## Not done (honest OPEN)

1. **Browser:** unauth `/admin` with bypass off on a controlled server — not run.
2. **Deploy (ADM-AUTH-03 / AF-10c):** real admin session without `DEV_AUTH_BYPASS` on preview/prod — not run.
3. Full admin API route matrix in browser/network — unit covers helpers; per-route CSRF matrix is A11/AF-19 territory.

## Production code status

No production auth code edits required this slice. Gates already wired:

- `proxy.ts` — `/admin` protected; bypass skip only via `isDevAuthBypassEnabled()`
- `layout.tsx` — `requireAuthUser("/admin", "admin")`
- `requireAdminSession` → `resolveAuthContext("admin")`
- `isDevAuthBypassEnabled` fails closed in `NODE_ENV=production`

## IDs

| ID | Status after this slice |
|----|-------------------------|
| ADM-AUTH-01 / AF-10 | **PARTIAL** — unit PASS; browser OPEN |
| ADM-AUTH-02 / AF-10b | **PARTIAL** — unit PASS; full route browser OPEN |
| ADM-AUTH-03 / AF-10c | **OPEN** — deploy not proven |

## Do not claim

- Production authorization from `DEV_AUTH_BYPASS=1`
- Browser PASS for unauth admin
- Release gate green for auth alone
