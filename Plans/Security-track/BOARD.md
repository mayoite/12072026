# Security-track board

**Scope:** CSP, CSRF, auth boundaries, RLS, upload surface, secret/dependency scan.  
**Flat:** [SEC-hardening.md](./SEC-hardening.md) + this board.  
**Nothing here is complete.** Old PARTIAL notes are untrusted — treat all rows as **OPEN** until fresh proof.

| ID | Name | Status | Notes |
|----|------|--------|-------|
| **SEC1** | API security headers + CSP | **OPEN** | `/api/*` CSP review |
| **SEC2** | CSRF on mutating routes | **OPEN** | CSRF lib may exist — re-prove; admin bypass documented |
| **SEC3** | Auth boundaries (admin vs public) | **OPEN** | `DEV_AUTH_BYPASS` on public hosts — with Admin A3 |
| **SEC4** | Supabase RLS / db advisors clean | **OPEN** | `db:advisors:security` zero ERRORs |
| **SEC5** | SVG publish / upload attack surface | **OPEN** | Admin pipeline + upload surface |
| **SEC6** | Dependency / secret scan in CI | **OPEN** | no standing gate doc yet |

**Rules:** one SEC-ID at a time · parallel other tracks OK  
**Hard:** no secrets in git · no weakening CSP for theater PASS  
**Related Admin:** [A3](../Admin-track/A3-production-auth.md) overlaps SEC3
