# Planner Phase 4 — live pricing, revisions, sharing, and review

## Outcome

The customer can price and share an immutable project revision safely.

## Live pricing

- Use one approved Admin price-book version.
- Pin currency and price-book version to the priced result.
- Show quantity, unit price, adjustment, tax, and line total.
- Show calculation time.
- Show price unavailable when no approved rule applies.
- Never treat missing price as zero.
- Prevent draft prices from reaching customers.
- Keep historical priced outputs reproducible.
- Preserve the Phase 1 BOQ lines and hash inputs.

## Named revisions

- Create named immutable revisions.
- Record project, catalog, family, validation, and price versions.
- Keep later edits separate from the named revision.
- Compare the current draft with a named revision.
- Prevent BOQ and quote records from drifting to later edits.

## Sharing and review

- Create read-only review links for named revisions.
- Support permission, expiry, and revocation.
- Prevent reviewers from changing the owner project.
- Anchor comments to project objects where practical.
- Record reviewer identity and time.
- Block all future access after revocation.
- Keep private projects and commercial data private.

## Parallel work

- Pricing and unpriced-state work can run together.
- Revision storage and review UI can run together.
- Authorization tests run with sharing implementation.

## Limited blockers

- Missing approved prices block only live-price acceptance.
- Named unpriced revisions continue.
- Missing message delivery blocks only notification proof.
- Direct review-link proof continues.

## Required proof

- Price-book pinning and historical reproduction tests.
- Missing-price and draft-price protection tests.
- Revision immutability and comparison tests.
- Sharing permission, expiry, revocation, and privacy tests.
- BOQ repeatability from a named revision.

## Done when

- Approved live pricing is reproducible.
- Named revisions remain immutable.
- Review access is controlled and revocable.
- The BOQ always refers to the exact named revision.
