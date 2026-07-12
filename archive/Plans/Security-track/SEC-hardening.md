# SEC-hardening — combined security phase

**Status:** OPEN — not track-complete. Status lives on [BOARD.md](./BOARD.md).

**Owns:** CSP · CSRF · auth boundaries · RLS · upload surface · dep/secret scan

| Board ID | Work | Product green requires |
|----------|------|------------------------|
| SEC1 | API security headers + CSP | Captured review + no weaken |
| SEC2 | CSRF on mutating routes | Live proof mutating routes reject bad CSRF |
| SEC3 | Auth boundaries | Broader than Admin A3; list surfaces still open |
| SEC4 | Supabase RLS / advisors | 0 ERROR on advisors run |
| SEC5 | SVG publish / upload | Fail-closed sanitize proof |
| SEC6 | Dep / secret scan in CI | Gate exists and runs |

**Rules:** one SEC-ID at a time · no secrets in git · no CSP theater  
**Related:** [Admin A3](../Admin-track/A3-production-auth.md) overlaps SEC3 admin slice only.

**Evidence:** `results/security/` (create on first real run).
