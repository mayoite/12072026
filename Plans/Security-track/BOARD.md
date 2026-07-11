# Security-track board

**Scope:** CSP, CSRF, auth boundaries, RLS, upload surface, secret/dependency scan.  
**Flat:** [SEC-hardening.md](./SEC-hardening.md) + this board.

| ID | Name | Status | Notes |
|----|------|--------|-------|
| **SEC1** | API security headers + CSP | **OPEN** | `/api/*` CSP review |
| **SEC2** | CSRF on mutating routes | **PARTIAL** | CSRF lib + bootstrap; admin bypass documented |
| **SEC3** | Auth boundaries (admin vs public) | **PARTIAL** | `DEV_AUTH_BYPASS` prod path OPEN |
| **SEC4** | Supabase RLS / db advisors clean | **OPEN** | `db:advisors:security` zero ERRORs |
| **SEC5** | SVG publish / upload attack surface | **OPEN** | Admin pipeline + `docs/audit/admin/` |
| **SEC6** | Dependency / secret scan in CI | **OPEN** | no standing gate doc yet |

**Rules:** one SEC-ID at a time · parallel other tracks OK  
**Hard:** no secrets in git · no weakening CSP for theater PASS  
**Related Admin:** [A3](../Admin-track/A3-production-auth.md) overlaps SEC3
