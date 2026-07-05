# Auth — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** Guest planner access is in scope for **1A** (not yet accepted). Svg-editor publish permissions may tighten in **1B**.

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | On disk today | Paths |
|--------|---------------|-------|
| Page auth | `requireAuthUser`, `getOptionalUser` | `site/lib/auth/session.ts` |
| API auth | `withAuth(['admin' \| 'member' \| 'guest'])` | `site/lib/api/withAuth.ts` |
| Roles | `isAppAdmin` reads `app_metadata.role` / roles array | `site/lib/auth/roles.ts` |
| Supabase clients | **Two** entry points: `platform/supabase/server.ts` and `lib/supabase/server.ts` | both paths |
| Planner guest | Guest planner without login | `plannerSession.ts`, `plannerRedirect.ts` |
| Admin layout | `requireAuthUser("/admin", "admin")` | `app/admin/layout.tsx` |

## Packages (on disk)

| Package | Pin | Role in this domain |
|---------|-----|---------------------|
| `@supabase/ssr` | `^0.12.0` | Server session cookies |
| `@supabase/supabase-js` | `^2.108.2` | Auth client |

**Note:** `ADMIN_workflow.md` references `requireAdminUser` / `adminSession.ts` — those names are not on disk; live gate is `requireAuthUser`.

---

## Summary

Auth is generally sound for a Supabase-backed app: server session helpers for pages, `withAuth` for APIs with rate limiting and CSRF, and admin elevation tied to `app_metadata` rather than user-writable metadata. Guest planner access works without login. Main friction is duplication and naming drift in docs.

## Strengths

`roles.ts` correctly refuses to trust `user_metadata` for elevation. CSRF on mutating admin APIs is implemented and audited. Consistent `requireAuthUser(path, role)` pattern on layouts. Guest planner path is explicit and tested. E2E auth helpers exist for seeded users.

## Weaknesses

Two Supabase server client paths (`platform/` vs `lib/`) invite subtle import mistakes. `ADMIN_workflow.md` documents APIs that do not match live function names. Consolidation of auth wrappers called out in audit remains open. Role model is coarse (admin/member/guest) — may strain when svg-editor publish permissions tighten in 1B.
