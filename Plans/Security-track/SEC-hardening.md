# SEC-hardening — combined security phase

**Status:** OPEN — not complete. Work items on [BOARD.md](./BOARD.md).

**Owns:** CSP · CSRF · auth boundaries · RLS · upload surface · dep/secret scan

Thin execute card. Kill order and status live on the board (rows **SEC1**–**SEC6**). Land detail here when a row starts.

| Board ID | Work |
|----------|------|
| SEC1 | API security headers + CSP (`/api/*`) |
| SEC2 | CSRF on mutating routes |
| SEC3 | Auth boundaries (admin vs public; overlaps Admin A3) |
| SEC4 | Supabase RLS / `db:advisors:security` |
| SEC5 | SVG publish / upload attack surface |
| SEC6 | Dependency / secret scan in CI |

**Rules:** one SEC-ID at a time · no secrets in git · no weakening CSP for theater PASS  
**Related:** [Admin A3](../Admin-track/A3-production-auth.md) overlaps SEC3
