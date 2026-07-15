# Planner Phases 3–4 — scale, price, and handoff

## Phase 3 — scale, validate, and price

### Outcome

The customer scales layouts, resolves planning issues, prices safely, and freezes shareable revisions.

### Product configuration

- Consume released Admin product-family versions; grouped-family model during configuration.
- Compatible options only; invalid combinations explained.
- Family version and options preserved through every edit; explicit migration for newer versions.
- Configuration identical in 2D, 3D, validation, and BOQ.

### Bulk layout

- Multi-select, duplicate, align, distribute.
- Row, array, grid, group, ungroup, exact spacing.
- Preview bulk changes before application; one bulk operation = one undoable command.
- Identifiers, options, and BOQ identity preserved through bulk edits and undo.
- 100-seat layout practical; 2,000-seat plan measured against recorded budgets.

### Advanced validation

- Overlaps; wall, opening, and room-boundary conflicts; aisle and chair-clearance failures.
- Approved, versioned accessibility rules; implement or remove `compliance.ts` stub.
- Issues show severity, location, objects, remedy; focus on canvas.
- Advisory waivers require a reason; hard errors block quote readiness.
- Recheck after fix; same validation result for revisions, BOQ, and handoff.

### Live pricing

- One approved Admin price-book version in workspace; pin currency and version on priced result.
- Show quantity, unit price, adjustment, tax, line total, calculation time.
- Price unavailable when no approved rule; never treat missing price as zero.
- Draft and demo-list prices must not reach customers as truth.
- Historical priced outputs reproducible; price status distinct from save and validation.

### Named revisions and review

- Named immutable revisions record project, catalog, family, validation, and price versions.
- Compare draft vs named revision; BOQ and quote cannot drift to later edits.
- Read-only review links: permission, expiry, revocation; API routes and workspace UI.
- Comments anchored to objects; reviewers cannot mutate owner project.
- Portal publish and plan read views; admin plan list/detail.
- Integrate local version snapshots with named revision record.

### Phase 3 blockers

| Gap | Blocks only |
|---|---|
| Live product families | Live family acceptance |
| Missing approved rule | That rule only |
| Approved prices | Live-price acceptance |
| Review API/UI | End-to-end sharing proof |

---

## Phase 4 — deliver and handoff

### Outcome

The customer exports the exact reviewed package and sends it to Oando.

### Quote handoff

- Product count and BOQ readiness visible from workspace.
- Show exact named revision before submission; BOQ, pricing, exclusions, validation status.
- Distinguish draft export from customer-ready BOQ; block handoff on hard validation failures.
- Intentional confirmation; `Send to Oando` explicit final action.
- Send revision, BOQ, price version, validation result, and hash; record consent, status, time, hash.
- Idempotency prevents duplicate requests; safe retry without rebuilding package.
- Emit `HANDOFF_INTENT`, `HANDOFF_SUCCESS`, `HANDOFF_FAILURE` per Site contract.

### External exports

- JSON, SVG, PNG, PDF, DXF floor plans; furniture BOQ JSON/CSV; branded BOQ PDF.
- One calculation authority behind every export; same hash where applicable.
- Export preflight before delivery; guest export menu honestly narrower than member.
- Retire or unify parallel BOQ paths (`workstationBoqV0`, `buildBoq`, buddy adapter).
- Product, revision, price, and validation identity in every format.

### Security

- Authorize commercial data server-side; CSRF and rate limits on submission.
- Private revisions and prices out of URLs and logs; sharing permissions on export and handoff.
- Record release provenance for the commercial package.

### Phase 4 blockers

| Gap | Blocks only |
|---|---|
| Delivery infrastructure | Live handoff proof |
| Analytics delivery | End-to-end handoff event receipt |