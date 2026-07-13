# Security checklist

This file records status only.

Treat every item as not done.

## Commercial data authorization

- [ ] Commercial routes, actions, storage paths, and exports are inventoried from live code.
- [ ] Draft catalog, prices, BOQs, quotes, customer data, and audit records have explicit access rules.
- [ ] Authentication and resource authorization are enforced server-side.
- [ ] Frontend role checks are not treated as protection.
- [ ] Cross-tenant and cross-project access is rejected.
- [ ] Public identifiers are non-guessable.
- [ ] Attacker-controlled input is validated at runtime.
- [ ] Cookie-authenticated state changes have CSRF protection.
- [ ] Sensitive responses are private and excluded from shared caches.
- [ ] Secrets and commercial data stay out of logs and client bundles.
- [ ] Database policies agree with application authorization.

## Revision and sharing permissions

- [ ] Owner, reviewer, Admin, expired, revoked, and anonymous permissions are defined.
- [ ] Every review link is bound to one immutable revision.
- [ ] Reviewers cannot mutate the source project.
- [ ] An older share cannot expose later drafts.
- [ ] Share identifiers have sufficient entropy.
- [ ] Expiry and revocation are enforced on every request.
- [ ] Identifier enumeration and direct-object-reference bypass fail.
- [ ] Comment access follows revision permissions.
- [ ] Private revisions stay out of public caches, indexes, URLs, analytics, and logs.
- [ ] Permission changes affect active access correctly.

## Integration security

- [ ] External integrations and their trust boundaries are inventoried.
- [ ] Credentials are server-only and least-privileged.
- [ ] Inbound payloads and uploaded files are validated.
- [ ] Existing webhooks verify signatures against raw request bodies.
- [ ] Outbound destinations and protocols are constrained.
- [ ] CORS is disabled unless required and otherwise uses exact origin allowlists.
- [ ] Public and expensive operations are rate-limited.
- [ ] Quote submission and retryable writes use idempotency.
- [ ] Payload size, processing time, redirects, and retries are bounded.
- [ ] Command, SQL, path, template, HTML, and formula injection checks pass.
- [ ] Client errors are redacted without hiding server evidence.
- [ ] Timeout, duplicate, replay, and partial-delivery tests pass.

## Release provenance

- [ ] Source revision, lockfile, build command, runtime, and dependencies are recorded.
- [ ] Schema, catalog, family, price-book, and BOQ calculation versions are recorded.
- [ ] Secret scanning passes.
- [ ] Dependency advisory review passes or has explicit active failures.
- [ ] Production mode and deployment configuration are verified.
- [ ] Runtime security headers, cookies, cache controls, and route protection are verified.
- [ ] Released artifacts and commercial contracts have recorded hashes.
- [ ] Commercial authority approvals and release identity are recorded.
- [ ] Release evidence is tamper-evident.
- [ ] Code, schema, catalog, and pricing rollback paths are verified.
- [ ] Rollback preserves audit history.

## Completion

- [ ] Positive and negative authorization tests pass.
- [ ] Direct API tests pass without relying on hidden UI.
- [ ] Production-like runtime checks pass.
- [ ] Fresh commands and exit codes are recorded here.
- [ ] Only active failures remain in `../../Failures.md`.
