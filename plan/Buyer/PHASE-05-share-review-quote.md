# PHASE-05 — Share, review, and quote

**Parallel:** no · **Blocks on:** Buyer P04 · Security P03 · **Proof:** live browser

---

## Outcome

A buyer shares one immutable revision, collects review, and requests a quote for that exact revision.

## Build

Named revision, read-only link, permission, expiry, revocation, anchored comments, resolution,
quote request, and status history.

## UI gates

- Owner sees link scope, expiry, and revocation state before sharing.
- Reviewer sees read-only status and cannot reach edit controls.
- Comments focus the exact object or plan location.
- Quote confirmation names revision, validation result, and BOQ version.

## PASS gates

- Anonymous access is limited to the shared revision.
- Reviewer cannot mutate the owner plan.
- Revocation blocks future access.
- Quote request cannot drift to a newer revision.
- Sales receives one traceable record.
- Permission and revocation journeys pass in browser.

## Steps

1. Owner sees link scope, expiry, revocation before sharing.
2. Reviewer read-only — no edit controls; comments focus plan location.
3. Quote confirmation names revision, validation result, BOQ version.
4. Revocation blocks access; quote locked to revision.

## Done when

[UI-BAR.md](../UI-BAR.md) ticked · [CHECKLIST.md](./CHECKLIST.md) PHASE-05.

## How to prove

Permission and revocation journeys in browser. Anonymous scope limited to shared revision only.

Report → `agents-work/reports/buyer-phase-05.md`. Raw artifacts → `results/buyer/phase-05/`.