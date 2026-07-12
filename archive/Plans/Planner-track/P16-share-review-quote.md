# P16 — Share, review, and quote

**Status:** OPEN — blocked by P15 and Security · **Depends:** P15 + auth/security gates

## Outcome

A buyer shares one immutable revision, collects review, and requests a quote for that exact revision.

## Build

Named revision, read-only link, permission, expiry, revocation, anchored comments, resolution, quote request, and status history.

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

**Evidence:** `results/planner/product-wave/16-share-review-quote/`
