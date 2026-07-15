# Admin Phases 3–4 — families and commercial governance

## Phase 3 — configurable product families

### In plain words

Many products are not one fixed item.

They are families with sizes, layouts, finishes, accessories, and other choices.

This phase lets Admin define those choices once.

Planner then uses only valid combinations.

### Why this matters

A customer must see the same configuration in 2D, 3D, and the BOQ.

Separate option logic creates mismatched layouts and wrong quantities.

### Product outcome

An Admin can:

1. Create a product family.
2. Define its available options.
3. Define which options work together.
4. Preview a valid configuration.
5. Release a family version.
6. See which version Planner uses.

### Work

#### Family identity

- Give each family a stable identifier.
- Give each released version an immutable version identifier.
- Keep family identity separate from a specific option selection.
- Preserve the exact released version used by a placed product.

#### Option model

- Define option groups in plain Admin language.
- Support required and optional choices.
- Support single-choice and multi-choice groups where justified.
- Give every option a stable identifier and BOQ identity.
- Keep labels separate from machine identity.

#### Compatibility

- Define valid and invalid option combinations.
- Explain why an invalid combination cannot be released or placed.
- Prevent incompatible options from reaching Planner.
- Keep compatibility rules versioned with the family.
- Do not silently replace an invalid choice with a default.

#### Shared output

- Make one released configuration drive the 2D footprint.
- Make the same configuration drive 3D parts or model selection.
- Make the same configuration drive BOQ identity and quantities.
- Preserve the selected options through save and reload.

#### Admin experience

- Provide a real form for family and option authoring.
- Preview representative valid configurations.
- Show unresolved compatibility errors before release.
- Show which family version is draft and which is released.
- Require an explicit migration choice when replacing a released version.
- Use plain language for options and compatibility rules.
- Preview matching 2D, 3D, and BOQ identity before release.

### Phase 3 interface acceptance

`ADM-FAM-01` and `ADM-FAM-02`.

The exact requirements are in `../../docs/architecture/07-ADMIN-UI-BENCHMARK.md`.

### Phase 3 parallel execution

- Family identity and option-form work may run together.
- Compatibility rules and 2D/3D/BOQ adapters may run together against fixtures.
- Planner may consume a released family fixture before live Admin release is ready.

### Phase 3 dependencies

The core catalog identity from Phase 2 is required.

Missing 3D assets block only 3D verification.

They do not block option, 2D, or BOQ identity work.

### Phase 3 done when

- Admin releases one configurable family version.
- Valid configurations can be selected.
- Invalid combinations are blocked with a reason.
- One option set produces matching 2D, 3D, and BOQ identity.
- Save and reload preserve the family version and options.
- Replacing a released version requires an explicit migration decision.

### Phase 3 proof required

- Family contract tests.
- Compatibility tests for valid and invalid combinations.
- 2D, 3D, and BOQ parity tests.
- Admin browser authoring and release journey.
- Planner fixture-consumption test.
- Relevant unchecked items completed in `CHECKLIST.md`.

---

## Phase 4 — pricing, approval, retirement, and release

### In plain words

This phase controls which products and prices are commercially active.

It prevents drafts, old prices, and retired products from becoming customer truth.

### Why this matters

Catalog publication alone is not commercial approval.

Prices change over time.

Past BOQs and quotes must remain reproducible.

### Product outcome

An authorized Admin can:

1. Create a price-book draft.
2. Review its currency, dates, and rules.
3. Approve and activate a version.
4. Retire a product without deleting its history.
5. Roll back an incorrect release.
6. See who approved, activated, retired, or restored each revision.

### Work

#### Versioned price books

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

#### Approval

- Separate author and approver permissions.
- Keep drafts invisible to customer-facing pricing.
- Require explicit approval before activation.
- Prevent approval of invalid or incomplete data.
- Keep the previous active version when activation fails.
- Show the authorized role, reason, version, and impact before confirmation.

#### Retirement and restoration

- Retire products without deleting their history.
- Hide retired products from new customer placement.
- Preserve retired products in existing saved designs and commercial records.
- Restore a product through an explicit authorized action.
- Explain the effect of retirement before confirmation.

#### Release and rollback

- Release catalog, family, and price versions deliberately.
- Show the exact versions included in a release.
- Roll back to a prior valid release without deleting newer history.
- Prevent partial release.
- Keep the previous active release when any step fails.

#### Authorization and audit

- Enforce author, approver, and viewer permissions server-side.
- Record actor, action, object, old version, new version, reason, and time.
- Protect state-changing requests from CSRF.
- Rate-limit expensive release actions.
- Keep secrets and commercial data out of public responses.
- Explain unavailable actions without leaking protected data.
- Show actor, action, object, versions, reason, time, and result in history.

### Phase 4 interface acceptance

- `ADM-PUB-02`.
- `ADM-PRICE-01` through `ADM-PRICE-03`.
- `ADM-ROLE-01`.
- `ADM-AUDIT-01`.

The exact requirements are in `../../docs/architecture/07-ADMIN-UI-BENCHMARK.md`.

### Phase 4 parallel execution

- Price-book modelling and approval UI may run together.
- Retirement rules and audit work may run together.
- Release assembly may use fixtures before every upstream surface is complete.

### Phase 4 dependencies

Price-book activation requires the core catalog contract from Phase 2.

Family-specific pricing requires the family contract from Phase 3.

Core product pricing does not wait for family-specific pricing.

### Phase 4 done when

- Admin creates, approves, and activates a price-book version.
- Missing prices remain visibly unavailable.
- A past calculation can reproduce its original price version.
- Retired products disappear from new placement but remain in history.
- Failed activation preserves the previous active version.
- Rollback restores a prior release and preserves newer history.
- Authorization and audit checks pass.

### Phase 4 proof required

- Price-book version and reproduction tests.
- Permission tests for author, approver, and viewer roles.
- Retirement and restoration tests.
- Failed activation and rollback tests.
- Admin browser journey for draft, approve, activate, retire, and rollback.
- Fresh security, typecheck, and lint results.
- Relevant unchecked items completed in `CHECKLIST.md`.

### Outside the current product boundary

- Customer-facing live pricing.
- Named customer revisions.
- Sharing and review.
- Quote handoff.
- External commercial exports.