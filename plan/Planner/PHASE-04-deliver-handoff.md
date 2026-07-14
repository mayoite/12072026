# Planner Phase 4 — deliver and handoff

## Outcome

The customer exports the exact reviewed package and sends it to Oando.

## Quote handoff

- Product count and BOQ readiness visible from workspace.
- Show exact named revision before submission; BOQ, pricing, exclusions, validation status.
- Distinguish draft export from customer-ready BOQ; block handoff on hard validation failures.
- Intentional confirmation; `Send to Oando` explicit final action.
- Send revision, BOQ, price version, validation result, and hash; record consent, status, time, hash.
- Idempotency prevents duplicate requests; safe retry without rebuilding package.
- Emit `HANDOFF_INTENT`, `HANDOFF_SUCCESS`, `HANDOFF_FAILURE` per Site contract.

## External exports

- JSON, SVG, PNG, PDF, DXF floor plans; furniture BOQ JSON/CSV; branded BOQ PDF.
- One calculation authority behind every export; same hash where applicable.
- Export preflight before delivery; guest export menu honestly narrower than member.
- Retire or unify parallel BOQ paths (`workstationBoqV0`, `buildBoq`, buddy adapter).
- Product, revision, price, and validation identity in every format.

## Security

- Authorize commercial data server-side; CSRF and rate limits on submission.
- Private revisions and prices out of URLs and logs; sharing permissions on export and handoff.
- Record release provenance for the commercial package.

## Blockers

| Gap | Blocks only |
|---|---|
| Delivery infrastructure | Live handoff proof |
| Analytics delivery | End-to-end handoff event receipt |
