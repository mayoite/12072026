# PHASE-02 — CSRF on mutating routes

**Parallel:** yes · **Blocks on:** — · **Proof:** live request matrix

---

## In plain words
CSRF is an attack where another site tricks a logged-in user's browser into making a change on
your site. The defense is a token every write must carry. This phase re-proves that every route
which changes data rejects forged requests.

## Why this matters
Any unprotected write (publish, edit, delete) is a hole. One already-good signal: anonymous
publish returns 403 at the CSRF gate — this extends that guarantee across all mutators.

## What exists today (grounded in code)
- `app/api/csrf/route.ts` — the CSRF mechanism.
- `app/api/admin/plans/*` and public mutating routes.

## What "good" looks like
A matrix of every mutating route showing a forged/missing-token request is rejected, and a valid
one succeeds.

## Steps
1. Enumerate mutating routes (admin + public).
2. Fire forged/missing-token requests; confirm rejection.
3. Confirm valid-token requests still succeed.

## Done when
Boxes in `plan/Security/CHECKLIST.md` → PHASE-02.

## How to prove
Run the request matrix; capture reject/accept per route. Raw artifacts → `results/security/phase-02/` (gitignored dump). Report → `agents-work/reports/security-phase-02.md`.

## Guardrails
Test both the reject (forged) and accept (valid) sides — a route that rejects everything is also
broken.

## Out of scope
Auth boundaries (PHASE-03) — CSRF assumes an authenticated session.
