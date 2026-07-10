# Admin + members static audit

**Date:** 2026-07-01  
**Scope:** `/admin`, `/dashboard`, `/portal`, `lib/auth/*`, admin API routes

## Verified in code

| Item | Status | Evidence |
|------|--------|----------|
| `user_metadata.role` not used for elevation | **Done** | `site/lib/auth/roles.ts` — metadata is user-writable only |
| CSRF on mutating admin APIs | **Done** | `withAuth.requireCsrf` in `site/lib/api/withAuth.ts` |
| `noindex` / `robots` on private surfaces | **Done** | `robots: { index: false, follow: false }` on `app/admin/layout.tsx`, `app/(site)/dashboard/layout.tsx`, `app/(site)/portal/layout.tsx` (matches planner workspace pattern) |

## Open (deferred)

- Consolidate split admin auth wrappers (`adminSession` vs `withAuth` vs `requireAuthUser`).
- Retire legacy catalog shims; split `AdminCatalogManager`.
- CRM server persistence (demo banner + embedded hero dedup landed in UI/UX phase 6).
- Lighthouse, Playwright E2E, `/review-security` subagent — not run (environment / scope).

## Status

**Partial** — security/metadata fixes landed; structural refactors and runtime audits remain.
