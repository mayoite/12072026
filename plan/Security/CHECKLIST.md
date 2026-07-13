# Security checklist

This file records status only.

Treat every item as not done.

## Section 0 — isolation and inventory

- [ ] Security proof loads the repo-root environment and disables development auth bypass.
- [ ] Test users, products, revisions, rows, and storage prefixes are isolated.
- [ ] Tests never mutate released catalog or SVG rows.
- [ ] `SEC-INV-01` Every route, action, table, storage key, export, integration, and job is in one control matrix.
- [ ] `SEC-INV-02` Every matrix row names classification, actors, ownership, CSRF, schema, limit, cache, log, failure, and tests.

## Section 1 — authentication, authorization, and CSRF

- [ ] `SEC-AUTH-01` Authentication and role checks are enforced server-side.
- [ ] `SEC-AUTH-02` Object authorization rejects wrong owner, project, product, revision, and tenant.
- [ ] `SEC-AUTH-03` Authorization denies by default and trusts no client actor or state.
- [ ] `SEC-AUTH-04` Development auth bypass cannot activate in production.
- [ ] `SEC-AUTH-05` Expiry, revocation, role change, and logout affect the next protected request.
- [ ] `SEC-AUTH-06` Production security proof runs with development bypass disabled.
- [ ] `SEC-CSRF-01` Every cookie-authenticated mutation verifies CSRF.
- [ ] `SEC-CSRF-02` Missing, malformed, mismatched, expired, and replayed CSRF requests fail safely.

## Section 2 — database, SVG, and storage

- [ ] `SEC-DB-01` Products catalog and SVG persistence use the approved Drizzle boundary.
- [ ] `SEC-DB-02` RLS, grants, and application authorization agree.
- [ ] `SEC-DB-03` Database and storage credentials are server-only and least-privileged.
- [ ] `SEC-DB-04` Database, storage, and rollback failures never invent success.
- [ ] `SEC-SVG-01` SVG inputs have strict schema, type, byte, node, path, reference, and time limits.
- [ ] `SEC-SVG-02` Sanitization blocks scripts, handlers, active URLs, external references, foreign content, and unsafe CSS.
- [ ] `SEC-SVG-03` Stored checksum covers the exact served artifact bytes.
- [ ] `SEC-SVG-04` Public SVG reads resolve only a committed same-product release.
- [ ] `SEC-SVG-05` Malicious and parser-stress corpora fail safely.
- [ ] `DB-SVG-14` Public responses exclude drafts, credentials, audit internals, and commercial data.
- [ ] `DB-SVG-19` Drizzle, RLS, authorization, CSRF, rate limits, and audit pass positive and negative checks.

## Section 3 — transactions and idempotency

- [ ] `SEC-TXN-01` Publication authorizes exact product, source revision, checksums, target, and reason.
- [ ] `SEC-TXN-02` Stale lock or changed data invalidates publication authorization.
- [ ] `SEC-TXN-03` Revision metadata, artifacts, product pointer, and audit commit atomically.
- [ ] `SEC-TXN-04` Uncommitted artifacts remain unreachable and are cleaned safely.
- [ ] `SEC-TXN-05` Approval, activation, retirement, rollback, and BOQ submission enforce valid transitions.
- [ ] `SEC-IDEM-01` Retryable writes use actor-and-payload-bound idempotency keys.
- [ ] `SEC-IDEM-02` Reusing a key with different data fails.

## Section 4 — sharing and data

- [ ] `SEC-SHARE-01` Share tokens have sufficient entropy and safe storage.
- [ ] `SEC-SHARE-02` A share binds to one immutable revision.
- [ ] `SEC-SHARE-03` Expiry, revocation, permission, and enumeration checks run on every request.
- [ ] `SEC-SHARE-04` Private shares stay out of public caches, indexes, analytics, URLs, and logs.
- [ ] `SEC-DATA-01` Draft catalog, prices, BOQs, quotes, customer, audit, and SVG data are classified.
- [ ] `SEC-DATA-02` Public responses and R2 snapshots expose released minimum fields only.
- [ ] `SEC-DATA-03` Secrets, tokens, cookies, private prompts, and commercial data stay out of logs and bundles.
- [ ] `SEC-DATA-04` Retention, deletion, export, backup, and restore rules exist.

## Section 5 — integrations, AI, and limits

- [ ] `SEC-INT-01` External credentials are server-only and least-privileged.
- [ ] `SEC-INT-02` Inbound payloads, files, and webhooks are validated and authenticated.
- [ ] `SEC-INT-03` Outbound URLs use exact allowlists and SSRF protection.
- [ ] `SEC-INT-04` Size, duration, redirect, retry, concurrency, and cost are bounded.
- [ ] `SEC-INT-05` Timeout, duplicate, replay, and partial-delivery tests pass.
- [ ] `SEC-AI-01` AI input and output are untrusted and runtime-validated.
- [ ] `SEC-AI-02` AI providers receive no unnecessary personal, project, BOQ, or secret data.
- [ ] `SEC-AI-03` AI tool, URL, cost, retry, and logging boundaries are enforced.
- [ ] `SEC-RATE-01` Public and commercial limits use a distributed production backend.
- [ ] `SEC-RATE-02` Missing distributed limits fail closed for protected expensive scopes.

## Section 6 — headers and security experience

- [ ] `SEC-HDR-01` CSP permissions are route-specific and every external origin is justified.
- [ ] `SEC-HDR-02` Production minimizes unsafe inline and eval behavior and proves canvas needs.
- [ ] `SEC-HDR-03` Security headers, cookies, and cache controls pass runtime checks.
- [ ] `SEC-UX-01` Security states use plain language without sensitive disclosure.
- [ ] `SEC-UX-02` Recoverable failure preserves safe work and gives one next action.
- [ ] `SEC-UX-03` Authentication and high-risk confirmation meet WCAG 2.2 AA.
- [ ] `SEC-UX-04` Status, errors, expiry, and recovery are announced and keyboard-completable.

## Section 7 — release and operations

- [ ] `SEC-REL-01` Release records all source, runtime, schema, catalog, SVG, family, price, and BOQ versions.
- [ ] `SEC-REL-02` Released code, contracts, revisions, and artifacts have recorded hashes.
- [ ] `SEC-REL-03` Secret, dependency, advisor, route, header, and authorization gates pass or have active failures.
- [ ] `SEC-REL-04` Release evidence is append-only or tamper-evident.
- [ ] `SEC-REL-05` All rollback paths preserve audit history.
- [ ] `SEC-OPS-01` Products DB, Admin DB, artifact storage, and R2 snapshot backup coverage is verified.
- [ ] `SEC-OPS-02` A restore drill proves released product and SVG pointer integrity.
- [ ] `SEC-OPS-03` Maintenance and degraded modes expose no protected data and enable no forbidden writes.

## Completion

- [ ] Positive and negative authorization tests pass.
- [ ] Direct API tests pass without relying on hidden UI.
- [ ] Production-like runtime checks pass.
- [ ] Database advisor checks pass on both databases.
- [ ] SVG rollback, stale-write, checksum, and malicious-input checks pass.
- [ ] Backup and restore pass on a non-production target.
- [ ] Security UI passes keyboard and assistive-technology checks.
- [ ] Fresh commands and exit codes are recorded here.
- [ ] Only active failures remain in `../../Failures.md`.
