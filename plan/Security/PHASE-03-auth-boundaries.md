# PHASE-03 — Auth boundaries

**Parallel:** yes · **Blocks on:** — · **Proof:** live per-surface checks

---

## In plain words
Different parts of the app need different access — admin, CRM, ops pages must reject anonymous
users in production; the planner guest area is deliberately open. This phase proves each
protected surface actually blocks anonymous access, and that the guest allowlist is exactly what
it should be.

## Why this matters
The admin slice is already proven, but CRM/ops/public boundaries aren't. An unguarded admin-like
surface is a serious leak.

## What exists today (grounded in code)
- `proxy.ts` — the auth boundary and guest allowlist (`/planner`, `/planner/guest`,
  `/planner/canvas`).
- `devAuthBypass.ts` — proven false-in-production (admin slice).

## What "good" looks like
Every protected surface (admin, crm, ops) rejects anonymous in production; the guest allowlist is
exactly the three planner paths and nothing more.

## Steps
1. List protected surfaces and expected access.
2. Verify each rejects anonymous in production.
3. Confirm the guest allowlist is exactly the intended paths.

## Done when
Boxes in `plan/Security/CHECKLIST.md` → PHASE-03.

## How to prove
Hit each protected surface anonymously in a production build; confirm rejection. Raw artifacts → `results/security/phase-03/` (gitignored dump). Report → `agents-work/reports/security-phase-03.md`.

## Guardrails
Admin slice ≠ full close — CRM/ops/public must each be proven.

## Out of scope
Row-level DB security (PHASE-04).
