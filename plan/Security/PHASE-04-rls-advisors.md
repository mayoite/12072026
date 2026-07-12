# PHASE-04 — RLS / db advisors

**Parallel:** yes · **Blocks on:** DB env available · **Proof:** advisor run log

---

## In plain words
RLS (row-level security) is the database rule that stops one user reading another's data. Supabase
ships an "advisor" that flags security problems. This phase runs it and requires zero errors —
and if the database isn't reachable, it says so honestly instead of faking a pass.

## Why this matters
A misconfigured RLS policy can expose every user's data. The advisor is the direct check for it.

## What exists today (grounded in code)
- `scripts/db_advisors.ts` (`db:advisors:security`).

## What "good" looks like
The security advisor runs and reports **0 ERROR**, with the log captured. If env blocks it, a
recorded BLOCKED reason instead of a silent skip.

## Steps
1. Run `db:advisors:security` against the DB.
2. Capture the log; confirm 0 ERROR.
3. If the DB isn't available, record the real blocker in the handover report.

## Done when
Boxes in `plan/Security/CHECKLIST.md` → PHASE-04.

## How to prove
Capture the advisor run log showing 0 ERROR. Raw artifacts → `results/security/phase-04/` (gitignored dump). Report → `agents-work/reports/security-phase-04.md`.

## Guardrails
No fake green — if the env blocks the run, log it as BLOCKED with the real reason.

## Out of scope
App-layer auth (PHASE-03).
