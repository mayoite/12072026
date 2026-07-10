# SEC track board

| ID | Name | Status | Notes |
|----|------|--------|-------|
| **SEC1** | API security headers + CSP | **OPEN** | `/api/*` CSP `default-src 'self'` — planner/admin need review |
| **SEC2** | CSRF on mutating routes | **PARTIAL** | CSRF lib + bootstrap; admin bypass documented |
| **SEC3** | Auth boundaries (admin vs public) | **PARTIAL** | `DEV_AUTH_BYPASS` dev-only; prod path OPEN |
| **SEC4** | Supabase RLS / db advisors clean | **OPEN** | `db:advisors:security` — zero ERRORs target |
| **SEC5** | SVG publish / upload attack surface | **OPEN** | Admin pipeline + `docs/audit/admin/` |
| **SEC6** | Dependency / secret scan in CI | **OPEN** | No standing gate doc yet |

**Rules:** one SEC-ID at a time · parallel other tracks OK if different packages  
**Hard:** no secrets in git · no weakening CSP for theater PASS

**Related A-track:** [A3 production auth](../A-track/BOARD.md) overlaps SEC3
