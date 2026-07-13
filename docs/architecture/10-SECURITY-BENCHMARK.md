# Security benchmark

## Status

This is the security acceptance benchmark.

It is not an execution plan.

It was refreshed on 2026-07-13.

The target is risk-based OWASP ASVS 5.0.0 Level 2.

Higher-risk commercial actions receive stronger transaction controls.

## Verdict

The current Security plan has the right themes.

It is not detailed enough to verify this product.

The code has useful security foundations.

It also has material unproved boundaries.

Local Admin browser access used a development bypass.

That proves UI reachability only.

It proves nothing about production authorization.

Database-backed SVG publication adds a new high-risk transaction.

It needs exact role, revision, artifact, storage, rollback, and audit controls.

## Reviewed foundations

The reviewed code includes:

- `site/features/shared/api/withAuth.ts`
- `site/lib/auth/devAuthBypass.ts`
- `site/lib/security/csrf.ts`
- `site/lib/security/sanitize.ts`
- `site/lib/rateLimit.ts`
- `site/proxy.ts`
- Admin SVG routes.
- Planner catalog routes.
- Products and Admin database documentation.

Useful foundations exist:

- Central role resolution.
- Server-side Admin checks.
- Optional CSRF enforcement.
- Timing-safe CSRF comparison.
- Public and authenticated rate-limit helpers.
- Production-disabled development auth bypass.
- Runtime security headers.
- Zod request and SVG contracts.
- Secret scanning commands.
- Database advisor commands.
- Backup and restore documentation.

These foundations are not completion proof.

## Current gaps

### Control coverage

There is no accepted route-to-control matrix.

`withAuth` makes CSRF optional.

Every cookie-authenticated mutation must be checked.

Client role visibility must not replace object-level authorization.

The development bypass must be excluded from production-like security proof.

### SVG safety

The inline SVG helper uses regular-expression replacement.

That is not a sufficient general SVG security boundary.

The server compiler and sanitizer must remain authoritative.

Validation must cover external references, scripts, event handlers, foreign content, CSS, URLs, entity expansion, size, node count, path complexity, and decompression risk.

The stored checksum must cover the exact served bytes.

### Database SVG publication

The target database revision adapter is not implemented.

The existing repository interface separates revision and artifact inserts.

The production adapter must activate revision metadata, artifact records, product pointer, and audit atomically.

Immutable object upload occurs before database activation.

Uncommitted objects must remain unreachable.

Stale draft locks and changed transaction data must invalidate publication.

### Headers and browser policy

The current CSP permits `'unsafe-inline'` broadly.

It permits `'unsafe-eval'` on canvas-heavy production paths.

Its connection allowlist includes several external hosts.

These allowances require route-specific necessity and runtime proof.

The target is nonce or hash-based script policy where practical.

Frame, form, object, base, worker, and connection destinations need an explicit route matrix.

### Rate limits

A distributed limiter exists when Supabase service configuration is present.

The memory fallback fails closed in production only for recognized AI scopes.

Commercial publication, import, quote, share, and expensive export scopes need explicit distributed behavior.

### Public and private catalog data

The public Planner catalog currently uses a Supabase client read.

The target contract requires a server catalog boundary with released fields only.

Draft definitions, audit data, storage credentials, internal prices, and private retired records must never enter the public response or R2 degraded snapshot.

### Security experience

Security states are product states.

Expired sessions, forbidden actions, stale drafts, CSRF failure, rate limits, revoked shares, and failed publication need precise recovery.

They must not expose sensitive detail.

They must remain keyboard and assistive-technology usable.

## External benchmark

### Verification standard

[OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) provides the verification baseline.

Use the stable 5.0.0 requirement identifiers when mapping tests.

Oando targets Level 2 by risk.

Security-critical commercial actions receive additional business-logic and transaction tests.

### Authorization

[OWASP Authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) requires deny by default, server enforcement, object-level checks, and useful security logging.

Test the matrix continuously.

Do not infer authorization from hidden buttons.

### Transaction authorization

[OWASP Transaction Authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html) requires server-side authorization, ordered state transitions, protected transaction data, replay resistance, and a final execution gate.

This applies to:

- SVG publication.
- Price approval and activation.
- Catalog release.
- Retirement and rollback.
- BOQ submission.
- Share creation and revocation.

### Upload and content safety

[OWASP File Upload guidance](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) requires allowlisted types, independent content validation, safe naming, size limits, storage separation, and least privilege.

SVG is active content.

Extension and MIME checks alone are not sufficient.

### Accessibility

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) includes accessible authentication, error identification, error prevention, and status messages.

High-risk confirmation must remain understandable and keyboard-completable.

Password managers and paste must not be blocked.

Security errors must be announced without exposing protected data.

## Package decision

No new security package is approved by this benchmark.

Use the installed capabilities first:

| Need | Existing authority |
|---|---|
| Runtime request and contract validation | Zod |
| Database access | Drizzle and `postgres` |
| SVG normalization and optimization | Existing compiler, SVGO, and server sanitizer |
| Browser sanitization where needed | DOMPurify |
| Authentication | Existing Supabase server session layer |
| CSRF | Existing double-submit implementation |
| Secret scanning | Secretlint and repository scan script |
| Database checks | Existing advisor scripts |
| Browser verification | Playwright and Axe |

Do not add another authentication system.

Do not parse untrusted SVG with regular expressions alone.

Do not add a second database access path.

## Required control model

### Route matrix

Every route, Server Action, storage key, database table, export, and background job receives:

- Data classification.
- Allowed actors.
- Object ownership rule.
- Authentication method.
- CSRF rule.
- Runtime schema.
- Size and rate limit.
- Cache rule.
- Log and audit rule.
- Failure behavior.
- Positive test.
- Negative test.

### Roles and objects

Use deny by default.

Check role and object on the server.

Use the exact current user identity.

Reject wrong owner, wrong project, wrong product, wrong revision, expired share, revoked share, stale lock, and retired release.

Do not accept a client-supplied actor or approval state.

### Database SVG transaction

Publication authorizes the exact product, definition version, artifact checksums, target revision, and reason.

Any changed field invalidates prior authorization.

The final transaction checks authorization again.

Artifact upload does not activate a release.

Only the committed product pointer makes a revision public.

Rollback creates an audited pointer transition.

It never edits immutable revision rows.

### Public SVG response

The server resolves only a committed released revision.

It verifies artifact kind, checksum, and product relationship.

It returns a fixed SVG media type.

It sets `nosniff` and safe cache headers.

The SVG content policy blocks executable and external behavior.

The route never redirects to an attacker-controlled destination.

### Commercial actions

Approval and execution are separate when roles require it.

The confirmation shows exact versions and impact.

The server controls the valid state transition.

Idempotency keys bind to the exact payload and actor.

Reusing a key with different data fails.

### Sharing

Share tokens are random, scoped, expiring, revocable, and stored safely.

They bind to one immutable revision.

They never expose later drafts.

Private share responses are not indexed or stored in shared caches.

### AI and external services

Treat model output as untrusted input.

Do not send secrets, private geometry, full BOQ data, or unnecessary personal data.

Constrain tool and URL access.

Bound cost, size, duration, retries, and concurrency.

Record provider failure without logging prompts that contain protected data.

### Security UX

Use plain language.

Distinguish unauthenticated, unauthorized, expired, stale, rate-limited, offline, and server failure.

Do not reveal whether another user's object exists.

Preserve safe user work after recoverable failure.

Return focus to the failed action or recovery target.

Announce status without forcing focus unless action is required.

## Acceptance contract

These IDs are stable.

| ID | Requirement |
|---|---|
| SEC-INV-01 | Every route, action, table, storage key, export, integration, and job is in one control matrix. |
| SEC-INV-02 | Every matrix row names classification, actors, ownership, CSRF, schema, limit, cache, log, failure, and tests. |
| SEC-AUTH-01 | Authentication and role checks are enforced server-side. |
| SEC-AUTH-02 | Object-level authorization rejects wrong owner, project, product, revision, and tenant. |
| SEC-AUTH-03 | Authorization denies by default and never trusts a client actor or state. |
| SEC-AUTH-04 | Development auth bypass cannot activate in a production build or deployment. |
| SEC-AUTH-05 | Session expiry, revocation, role change, and logout affect the next protected request. |
| SEC-AUTH-06 | Production security proof runs with development bypass disabled. |
| SEC-CSRF-01 | Every cookie-authenticated mutation requires and verifies CSRF. |
| SEC-CSRF-02 | Missing, malformed, mismatched, expired, and replayed CSRF requests fail safely. |
| SEC-DB-01 | Products catalog and SVG persistence use the approved Drizzle boundary. |
| SEC-DB-02 | RLS, grants, and application authorization agree for every affected table. |
| SEC-DB-03 | Database and storage credentials remain server-only and least-privileged. |
| SEC-DB-04 | Database failure, storage failure, and transaction rollback never invent success. |
| SEC-SVG-01 | SVG inputs have strict schema, type, byte, node, path, reference, and time limits. |
| SEC-SVG-02 | Server sanitization blocks scripts, handlers, active URLs, external references, foreign content, and unsafe CSS. |
| SEC-SVG-03 | Stored checksum covers the exact served artifact bytes. |
| SEC-SVG-04 | Public SVG reads resolve only a committed same-product released revision. |
| SEC-SVG-05 | Malicious SVG and parser-stress corpora fail without partial publication or resource exhaustion. |
| SEC-TXN-01 | Publication authorizes exact product, source revision, checksums, target, and reason. |
| SEC-TXN-02 | Stale lock or changed transaction data invalidates publication authorization. |
| SEC-TXN-03 | Revision metadata, artifact records, product pointer, and audit commit atomically. |
| SEC-TXN-04 | Uncommitted uploaded artifacts remain unreachable and are cleaned safely. |
| SEC-TXN-05 | Approval, activation, retirement, rollback, and BOQ submission enforce valid state transitions. |
| SEC-IDEM-01 | Retryable writes use actor-and-payload-bound idempotency keys. |
| SEC-IDEM-02 | Reusing an idempotency key with different data fails. |
| SEC-SHARE-01 | Share tokens have sufficient entropy and safe storage. |
| SEC-SHARE-02 | A share binds to one immutable revision and never exposes later drafts. |
| SEC-SHARE-03 | Expiry, revocation, permission change, and enumeration checks run on every request. |
| SEC-SHARE-04 | Private shares stay out of public caches, indexes, analytics, URLs, and logs. |
| SEC-DATA-01 | Draft catalog, prices, BOQs, quotes, customer data, audit, and SVG records have explicit classification. |
| SEC-DATA-02 | Public responses and R2 snapshots expose released minimum fields only. |
| SEC-DATA-03 | Secrets, tokens, cookies, private prompts, and commercial data stay out of logs and bundles. |
| SEC-DATA-04 | Retention, deletion, export, backup, and restore rules exist for customer and audit data. |
| SEC-INT-01 | External service credentials are server-only and least-privileged. |
| SEC-INT-02 | Inbound payloads, files, and webhooks are validated and authenticated. |
| SEC-INT-03 | Outbound URLs use exact destination and protocol allowlists with SSRF protection. |
| SEC-INT-04 | Size, duration, redirect, retry, concurrency, and cost are bounded. |
| SEC-INT-05 | Timeout, duplicate, replay, and partial-delivery tests pass. |
| SEC-AI-01 | AI input and output are untrusted and runtime-validated. |
| SEC-AI-02 | AI providers receive no unnecessary personal, project, BOQ, or secret data. |
| SEC-AI-03 | AI tool, URL, cost, retry, and logging boundaries are enforced. |
| SEC-RATE-01 | Public and commercial limits use a distributed production backend. |
| SEC-RATE-02 | Missing distributed limits fail closed for AI, publication, import, share, quote, and expensive export scopes. |
| SEC-HDR-01 | CSP permissions are route-specific and every external origin has a verified need. |
| SEC-HDR-02 | Production minimizes `unsafe-inline` and `unsafe-eval` and proves required canvas behavior. |
| SEC-HDR-03 | CSP, HSTS, nosniff, frame, referrer, permissions, cookies, and cache headers pass runtime checks. |
| SEC-UX-01 | Security states use plain language without object or sensitive-data disclosure. |
| SEC-UX-02 | Recoverable failure preserves safe work and provides one next action. |
| SEC-UX-03 | Authentication and high-risk confirmation meet WCAG 2.2 AA. |
| SEC-UX-04 | Security status, errors, expiry, and recovery are announced and keyboard-completable. |
| SEC-REL-01 | Release records source, lockfile, runtime, dependencies, build, schema, catalog, SVG, family, price, and BOQ versions. |
| SEC-REL-02 | Released code, contracts, revisions, and artifacts have recorded hashes. |
| SEC-REL-03 | Secret, dependency, database-advisor, route, header, and authorization gates pass or have active failures. |
| SEC-REL-04 | Release evidence is append-only or tamper-evident. |
| SEC-REL-05 | Code, database, catalog, SVG, storage, price, and configuration rollback preserve audit history. |
| SEC-OPS-01 | Products DB, Admin DB, artifact storage, and R2 snapshot backup coverage is verified. |
| SEC-OPS-02 | A restore drill proves released product and SVG pointer integrity. |
| SEC-OPS-03 | Maintenance and degraded modes never expose protected data or enable forbidden writes. |

## Verification standard

Do not close an ID from code review.

Pin ASVS references to version 5.0.0.

Use positive and negative tests.

Test direct APIs without relying on UI visibility.

Disable development auth bypass.

Use isolated database rows and storage prefixes.

Test wrong actor, wrong object, stale revision, changed payload, missing CSRF, replay, timeout, and rollback.

Test production headers and cookies from a production-like runtime.

Test security UI with keyboard and assistive-technology checks.

Run database advisors on both databases.

Run backup and restore drills against non-production targets.

Record exact commands and failures.

Never use `results/` as proof of completion.
