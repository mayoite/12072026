# Auth — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** [`Plans/global-standard-revision/README.md`](../../../Plans/global-standard-revision/README.md) — guest/canvas promotion is **Phase 2** after 1A+1B accepted

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | Policy | Paths | Docs |
|--------|--------|-------|------|
| Page auth | Shared server helpers for all surfaces | `site/lib/auth/session.ts` | `Readme.md` |
| API auth | Rate limit + role + CSRF on mutating routes | `site/lib/api/withAuth.ts` | `docs/audit/admin/README.md` |
| Roles | **Never** elevate from `user_metadata` (user-writable); use `app_metadata` only | `site/lib/auth/roles.ts` | audit README |
| Supabase clients | Single canonical server client path (consolidate duplicates) | `site/platform/supabase/` | audit README |
| Planner guest | `/planner/guest/` works without login until Phase 2 promotion | `plannerSession.ts` | `START.md` |
| Private surfaces | `noindex` robots on admin, dashboard, portal layouts | app layouts | audit README |

## Packages (proposed per plan)

| Package | Policy |
|---------|--------|
| `@supabase/ssr`, `@supabase/supabase-js` | Single canonical server client path (consolidate duplicates) |
| — | No NextAuth, no Clerk — Supabase remains sole auth SDK |
| `zod` | Optional for session/API payload helpers |

Role elevation stays **`app_metadata` only** — no new auth packages that read `user_metadata`.
