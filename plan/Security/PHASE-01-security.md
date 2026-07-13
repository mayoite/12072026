# Security Phase 1

## Outcome

Commercial data, revisions, integrations, and releases are protected by verified server-side controls.

## Commercial data authorization

- Inventory every route, Route Handler, Server Action, storage path, and export that touches commercial data.
- Define who may read and change draft catalog, approved prices, BOQs, quotes, customer details, and audit records.
- Enforce authentication and resource authorization server-side.
- Treat frontend role checks as interface behavior only.
- Reject cross-tenant and cross-project object access.
- Use non-guessable public identifiers.
- Validate request data at runtime.
- Protect cookie-authenticated state changes from CSRF.
- Keep sensitive responses private and out of shared caches.
- Keep secrets, tokens, cookies, prices, and customer data out of logs and client bundles.
- Verify database policies agree with application authorization.

## Revision and sharing permissions

- Define owner, reviewer, Admin, expired, revoked, and anonymous access.
- Bind every review link to one immutable revision.
- Prevent reviewers from changing the source project.
- Prevent access to later drafts through an older share.
- Use high-entropy share identifiers.
- Enforce expiry and revocation on every request.
- Prevent identifier enumeration and object-reference bypass.
- Authorize comments against the shared revision and allowed identity.
- Keep private revisions out of public caches, search indexes, URLs, analytics, and logs.
- Recheck active sessions after permission or ownership changes.

## Integration security

- Inventory catalog ingestion, object storage, analytics, email, quote delivery, exports, webhooks, and external APIs.
- Keep credentials server-only and scoped to least privilege.
- Validate every inbound payload and uploaded file.
- Verify webhook authenticity against the raw request body where webhooks exist.
- Allowlist outbound destinations and block unsafe protocols and private-network targets where URLs are influenced externally.
- Keep CORS disabled unless required; otherwise use exact origin allowlists.
- Rate-limit public, expensive, and abuse-prone operations.
- Use idempotency for quote submission and retryable writes.
- Bound payload size, processing time, redirects, and retry count.
- Prevent command, SQL, path, template, HTML, and formula injection.
- Redact sensitive errors while preserving useful server-side evidence.
- Test failure, timeout, duplicate, replay, and partial-delivery behavior.

## Release provenance

- Record source revision, lockfile, build command, runtime, and dependency versions.
- Record schema migration, catalog version, family versions, price-book version, and BOQ calculation version.
- Run secret scanning and dependency advisory checks.
- Verify production mode and deployment configuration.
- Verify security headers, cookie behavior, cache controls, and route protection at runtime.
- Hash released artifacts and commercial output contracts.
- Record who approved and released each commercial authority.
- Keep release evidence append-only or otherwise tamper-evident.
- Define rollback for code, schema, catalog, and pricing changes.
- Prove rollback without erasing audit history.
- Do not claim provenance when required evidence is missing.

## Verification

- Use positive and negative authorization tests.
- Test unauthenticated, wrong-role, wrong-owner, expired, revoked, replayed, and malformed requests.
- Test direct API access without using the UI.
- Test browser controls normally without forced clicks.
- Verify runtime headers and edge behavior in a production-like environment.
- Read live code before accepting any old test or report.
- Record only active failures in `../../Failures.md`.

## Parallel work

- Each security area runs when its direct product boundary is ready.
- Independent areas run in parallel.
- A failed boundary blocks only that boundary.
- Release approval waits only for security evidence relevant to that release.

## Done when

- Commercial data follows the authorization matrix.
- Shared revisions enforce immutable, expiring, revocable access.
- Integrations validate, authenticate, limit, and recover safely.
- Release evidence reproduces the shipped code and commercial authorities.
