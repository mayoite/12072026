# Security — CHECKLIST

Live run gates each tick.
No secrets in git · no CSP weaken for a green.

## PHASE-01 — Headers + CSP
- [ ] Live headers captured for `/api/*` + app routes
- [ ] Each CSP directive documented
- [ ] Over-permissive directives flagged for tightening

## PHASE-02 — CSRF
- [ ] Mutating routes enumerated (admin + public)
- [ ] Forged/missing-token requests rejected
- [ ] Valid-token requests succeed

## PHASE-03 — Auth boundaries
- [ ] Admin/crm/ops reject anonymous in production
- [ ] Guest allowlist is exactly the three planner paths
- [ ] Each surface proven (not just admin slice)

## PHASE-04 — RLS / advisors
- [ ] `db:advisors:security` run
- [ ] 0 ERROR in log
- [ ] If DB unavailable: BLOCKED logged with real reason

## PHASE-05 — SVG attack surface
- [ ] Malicious-input matrix built
- [ ] Each dangerous input sanitized/rejected (fail closed)
- [ ] Valid symbols still publish

## PHASE-06 — Dep / secret scan
- [ ] Dependency scan in CI
- [ ] Secret scan in CI
- [ ] One green/triaged run; standing gate documented
