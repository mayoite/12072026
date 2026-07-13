# Planner Phase 5 — quote handoff and external exports

## Outcome

The customer sends the exact reviewed package to Oando.

The handoff meets `UI-BOQ-01` through `UI-BOQ-03`.

## Quote handoff

- Keep product count and BOQ readiness visible from the workspace.
- Show the exact named revision before submission.
- Show BOQ lines, pricing status, exclusions, and validation status.
- Distinguish draft export from customer-ready BOQ.
- Block handoff for hard validation failures.
- Require intentional customer confirmation.
- Make `Send to Oando` an explicit final action.
- Send the revision, BOQ, price version, validation result, and hash to Oando.
- Record consent, status, time, revision, and hash.
- Use idempotency to prevent duplicate requests.
- Keep failed submissions available for safe retry.
- Let the customer recover from a failed submission without rebuilding the package.
- Prevent successful records from drifting to later edits.
- Emit the agreed completion and failure events for Site measurement.

## External exports

- Produce only documented commercial formats.
- Keep one calculation authority behind every export.
- Keep product, revision, price, and validation identity in every format.
- Align PDF, workbook, JSON, and approved external schemas.
- Give every output the same calculation hash.
- Validate schemas before delivery.
- Do not claim an integration without a live verified path.

## Security

- Authorize commercial data server-side.
- Protect submission from CSRF and abuse.
- Rate-limit public submission.
- Keep private revisions and prices out of URLs and logs.
- Enforce sharing permissions during export and handoff.
- Record release provenance for the commercial package.

## Parallel work

- Handoff and export validation can run together.
- Submission security runs with the boundary it protects.
- Event emission can run against the Site event contract.

## Limited blockers

- Missing delivery infrastructure blocks only live handoff proof.
- Export and retry behavior continue against fixtures.
- Missing analytics delivery blocks only end-to-end event receipt proof.

## Required proof

- Customer review and submission browser journey.
- Workspace product-count and BOQ-readiness checks.
- Draft-versus-customer-ready export checks.
- Explicit send, confirmation, failure, retry, and recovery checks.
- Idempotency, retry, authorization, CSRF, and rate-limit checks.
- Cross-format line, total, revision, and hash parity.
- Handoff completion and failure event checks.

## Done when

- Oando receives the exact package reviewed by the customer.
- Exports agree with the deterministic BOQ.
- Failed delivery is recoverable without duplication.
