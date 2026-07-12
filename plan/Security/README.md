# Security track

**HEAD:** `7807198d` · **Engines:** `config/build/next.config.js` (headers/CSP), `proxy.ts` (auth boundary — no middleware.ts), `app/api/csrf/route.ts`, `scripts/db_advisors.ts`, `admin/svg-editor/*` (upload surface).
Phases are independent files, each with one owner. Checklist: [CHECKLIST.md](./CHECKLIST.md). Failures: [../FAILURES.md](../FAILURES.md). Proof = live run; `results/` = dump.

## Honest state
Admin auth slice proven (`devAuthBypass.ts` false-in-prod). Track-wide CSP/CSRF/RLS **not** closed. All phases independent — run in parallel.

## Phases
| File | Owns | Parallel? | Blocks on |
|------|------|-----------|-----------|
| [PHASE-01-headers-csp.md](./PHASE-01-headers-csp.md) | API headers + CSP | yes | — |
| [PHASE-02-csrf.md](./PHASE-02-csrf.md) | CSRF on mutating routes | yes | — |
| [PHASE-03-auth-boundaries.md](./PHASE-03-auth-boundaries.md) | Auth on admin/crm/ops/public | yes | — |
| [PHASE-04-rls-advisors.md](./PHASE-04-rls-advisors.md) | RLS / db advisors | yes | DB env |
| [PHASE-05-svg-attack-surface.md](./PHASE-05-svg-attack-surface.md) | SVG publish sanitize/fail-closed | yes | — (couples Admin PHASE-01) |
| [PHASE-06-dep-secret-scan.md](./PHASE-06-dep-secret-scan.md) | Dep / secret scan CI | yes | — |

## Rules
No secrets in git · no CSP weaken for a green · `results/` ≠ proof.
Admin auth slice ≠ full auth-boundary close (PHASE-03).
