# SECURITY.md — one plan

**HEAD:** `7807198d` · **Engines:** `config/build/next.config.js` (headers/CSP), `proxy.ts` (auth boundary — no middleware.ts), `app/api/csrf/route.ts`, `scripts/db_advisors.ts`, `admin/svg-editor/*` (upload surface).
**Replaces:** Security BOARD + SEC-hardening (SEC1–6).

## Honest state
Admin auth slice proven (A3 / `devAuthBypass.ts` false-in-prod). Track-wide CSP/CSRF/RLS **not** closed. Streams are independent — run in parallel, one owner each.

### Stream SEC-1 — API headers + CSP
**Engine:** `config/build/next.config.js`, `proxy.ts`.
**Checklist:** capture CSP for `/api/*` and app routes; document each directive; no weakening for a green.
**Blocks on:** nothing.

### Stream SEC-2 — CSRF on mutators
**Engine:** `app/api/csrf/route.ts`, `app/api/admin/plans/*`, public mutating routes.
**Checklist:** re-prove CSRF rejects forged mutations on admin + public routes (anon publish already 403s at CSRF gate — extend the matrix).
**Blocks on:** nothing.

### Stream SEC-3 — Auth boundaries
**Engine:** `proxy.ts` guest allowlist, admin/crm/ops guards.
**State:** admin SVG slice PROVEN; CRM/ops/public still open.
**Checklist:** each protected surface rejects anon in production; guest allowlist is exactly `/planner`, `/planner/guest`, `/planner/canvas`.
**Blocks on:** nothing.

### Stream SEC-4 — RLS / db advisors (do when DB available)
**Engine:** `scripts/db_advisors.ts` (`db:advisors:security`).
**Checklist:** advisor run logs **0 ERROR**; if env blocks it, write the real blocker — no fake green.
**Blocks on:** DB env.

### Stream SEC-5 — SVG publish attack surface
**Engine:** `admin/svg-editor/svgArtifactCompiler.server.ts` (Resvg), publish pipeline.
**Checklist:** sanitize/fail-closed matrix on publish input; publish ≠ plan-draw; malicious SVG rejected.
**Blocks on:** nothing. **Couples to Admin Stream A** (same publish path).

### Stream SEC-6 — Dep / secret scan CI
**Engine:** CI config.
**Checklist:** standing gate doc + one green scan run; no secrets in git.
**Blocks on:** nothing.

## Status
| Stream | State | Blocks on |
|--------|-------|-----------|
| SEC-1 headers/CSP | OPEN | — |
| SEC-2 CSRF | OPEN | — |
| SEC-3 auth boundaries | OPEN / admin slice proven | — |
| SEC-4 RLS/advisors | OPEN | DB env |
| SEC-5 SVG attack surface | OPEN | — (couples Admin A) |
| SEC-6 dep/secret scan | OPEN | — |

**Rules:** no secrets in git · no CSP weaken for PASS · `results/` ≠ proof.
**Related:** Admin auth slice ≠ full SEC-3 close.
