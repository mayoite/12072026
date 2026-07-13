# Admin Phase 4 — pricing, approval, retirement, and release

## In plain words

This phase controls which products and prices are commercially active.

It prevents drafts, old prices, and retired products from becoming customer truth.

## Why this matters

Catalog publication alone is not commercial approval.

Prices change over time.

Past BOQs and quotes must remain reproducible.

## Product outcome

An authorized Admin can:

1. Create a price-book draft.
2. Review its currency, dates, and rules.
3. Approve and activate a version.
4. Retire a product without deleting its history.
5. Roll back an incorrect release.
6. See who approved, activated, retired, or restored each revision.

## Work

### Versioned price books

- Give every price book an immutable version identifier.
- Record currency, effective dates, and status.
- Store unit prices and adjustments as explicit rules.
- Show “Price unavailable” when no approved rule applies.
- Never convert a missing price into zero.
- Keep prior price-book versions available for reproduction.
- Pin every priced commercial output to one price-book version.
- Format operator-facing amounts as currency.
- Keep raw minor units and basis points in an advanced technical view.
- Make draft, approved, active, retired, and rolled-back states distinct.

### Approval

- Separate author and approver permissions.
- Keep drafts invisible to customer-facing pricing.
- Require explicit approval before activation.
- Prevent approval of invalid or incomplete data.
- Keep the previous active version when activation fails.
- Show the authorized role, reason, version, and impact before confirmation.

### Retirement and restoration

- Retire products without deleting their history.
- Hide retired products from new customer placement.
- Preserve retired products in existing saved designs and commercial records.
- Restore a product through an explicit authorized action.
- Explain the effect of retirement before confirmation.

### Release and rollback

- Release catalog, family, and price versions deliberately.
- Show the exact versions included in a release.
- Roll back to a prior valid release without deleting newer history.
- Prevent partial release.
- Keep the previous active release when any step fails.

### Authorization and audit

- Enforce author, approver, and viewer permissions server-side.
- Record actor, action, object, old version, new version, reason, and time.
- Protect state-changing requests from CSRF.
- Rate-limit expensive release actions.
- Keep secrets and commercial data out of public responses.
- Explain unavailable actions without leaking protected data.
- Show actor, action, object, versions, reason, time, and result in history.

## Interface acceptance

This phase owns:

- `ADM-PUB-02`.
- `ADM-PRICE-01` through `ADM-PRICE-03`.
- `ADM-ROLE-01`.
- `ADM-AUDIT-01`.

The exact requirements are in `../../docs/architecture/07-ADMIN-UI-BENCHMARK.md`.

## Parallel execution

- Price-book modelling and approval UI may run together.
- Retirement rules and audit work may run together.
- Release assembly may use fixtures before every upstream surface is complete.

## Dependencies

Price-book activation requires the core catalog contract from Phase 2.

Family-specific pricing requires the family contract from Phase 3.

Core product pricing does not wait for family-specific pricing.

## Done when

- Admin creates, approves, and activates a price-book version.
- Missing prices remain visibly unavailable.
- A past calculation can reproduce its original price version.
- Retired products disappear from new placement but remain in history.
- Failed activation preserves the previous active version.
- Rollback restores a prior release and preserves newer history.
- Authorization and audit checks pass.

## Proof required

- Price-book version and reproduction tests.
- Permission tests for author, approver, and viewer roles.
- Retirement and restoration tests.
- Failed activation and rollback tests.
- Admin browser journey for draft, approve, activate, retire, and rollback.
- Fresh security, typecheck, and lint results.
- Relevant unchecked items completed in `CHECKLIST.md`.

## Outside the current product boundary

- Customer-facing live pricing.
- Named customer revisions.
- Sharing and review.
- Quote handoff.
- External commercial exports.
