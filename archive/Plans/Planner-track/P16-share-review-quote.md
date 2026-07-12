# P16 — Share, review, and quote request

**Status:** OPEN — technical evidence packs do not create a buyer handoff.

**Outcome:** A buyer shares a stable plan, collects review, and requests a quote with the exact plan and BOQ revision attached.

## Functional scope

- Named project revision and read-only share link.
- Permission and expiry controls.
- Reviewer comments anchored to a plan location or object.
- Resolve/reopen comment flow.
- Quote request captures contact, revision, validation summary, and BOQ version.
- Status: draft, shared, changes requested, quote requested, quoted.
- Revoking a link stops future access.

## Acceptance

- [ ] Anonymous recipient can view only the shared revision.
- [ ] Reviewer cannot mutate the owner plan.
- [ ] Quote request cannot silently switch to a newer revision.
- [ ] Revocation and permission boundaries are browser-proven.
- [ ] Sales/admin receives one traceable request, not disconnected form data.

## Evidence

`results/planner/product-wave/16-share-review-quote/`

## Dependency

P15 plus auth/security gates.
