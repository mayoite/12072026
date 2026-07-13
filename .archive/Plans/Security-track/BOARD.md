# Security-track board

**Scope:** CSP, CSRF, auth boundaries, RLS, upload surface, secret/dependency scan.  
**Flat:** [SEC-hardening.md](./SEC-hardening.md) + this board.  
**Nothing here is track-complete.** Old PARTIAL notes untrusted.

## Honest scores

| | Now | Blocker |
|--|-----|---------|
| Plan honesty | ~7 | Rows OPEN; A3 overlap named |
| Product / posture | ~4 | Admin A3 slice proven; track-wide CSP/RLS/CSRF not closed |

| ID | Name | Status | Green when |
|----|------|--------|------------|
| **SEC1** | API headers + CSP | **OPEN** | `/api/*` CSP review captured; no theater weaken |
| **SEC2** | CSRF mutating routes | **OPEN** | Re-prove CSRF on admin + public mutators |
| **SEC3** | Auth boundaries | **OPEN / ADMIN SLICE PROVEN** | A3 green for admin SVG; CRM/ops/public still open |
| **SEC4** | RLS / db advisors | **OPEN** | `db:advisors:security` **0 ERROR** log in `results/security/` |
| **SEC5** | SVG publish attack surface | **OPEN** | Sanitize/fail-closed publish matrix; publish ≠ plan-draw |
| **SEC6** | Dep / secret scan CI | **OPEN** | Standing gate doc + green run |

### Next action (only)

**SEC4** if DB available — capture advisor output.  
If blocked by env: write `results/security/BLOCKED.md` with the real reason (no fake green).

**Rules:** one SEC-ID at a time · no secrets in git · no CSP weaken for PASS  
**Related:** [Admin A3](../Admin-track/A3-production-auth.md) ≠ full SEC3 track close.
