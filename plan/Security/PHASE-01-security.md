# Security Phase 1

## Outcome

Every protected boundary is inventoried and verified.

The exact acceptance requirements are in `../../docs/architecture/10-SECURITY-BENCHMARK.md`.

The SVG transaction requirements are in `../../docs/architecture/08-DATABASE-SVG-CONTRACT.md`.

## Section 0 — isolation and live inventory

Start here.

- Load the repo-root `.env.local` through the existing loader.
- Disable the development auth bypass for security proof.
- Use isolated users, products, revisions, database rows, and storage prefixes.
- Clean only test-owned state.
- Never mutate released catalog or SVG rows.
- Inventory every route, Server Action, table, storage key, export, integration, and job.
- Record data class, actors, ownership, auth, CSRF, schema, limits, cache, logs, failure, and tests.
- Compare the inventory with live route and package commands.

This section owns `SEC-INV-01`, `SEC-INV-02`, and `SEC-AUTH-06`.

## Section 1 — authentication, authorization, and CSRF

- Deny by default.
- Enforce identity, role, tenant, project, product, revision, and object ownership on the server.
- Reject client-supplied actors and approval state.
- Verify expiry, revocation, role change, logout, and session change on the next protected request.
- Prove the development bypass cannot activate in a production build or deployment.
- Require CSRF on every cookie-authenticated mutation.
- Test missing, malformed, mismatched, expired, and replayed CSRF requests.
- Test direct APIs without relying on hidden buttons.

This section owns `SEC-AUTH-01` through `SEC-AUTH-06` and `SEC-CSRF-01` through `SEC-CSRF-02`.

## Section 2 — Products DB, SVG, and storage

- Use Drizzle and `postgres` for catalog and SVG persistence.
- Do not add a new Supabase `.from()` catalog or Planner path.
- Verify RLS, grants, application authorization, and least-privilege credentials.
- Validate SVG schema, type, bytes, nodes, paths, references, complexity, and processing time.
- Sanitize on the server.
- Block scripts, handlers, active URLs, external references, foreign content, and unsafe CSS.
- Hash the exact served bytes.
- Resolve public SVG only through a committed same-product release pointer.
- Test malicious and parser-stress corpora.
- Keep drafts, credentials, audit internals, and commercial data out of public responses and R2 snapshots.

This section owns `SEC-DB-01` through `SEC-DB-04`, `SEC-SVG-01` through `SEC-SVG-05`, `DB-SVG-14`, and `DB-SVG-19`.

## Section 3 — commercial transactions and idempotency

- Authorize the exact actor, product, source revision, checksums, target revision, reason, and impact.
- Invalidate authorization when locked data changes.
- Upload immutable artifacts before database activation.
- Commit revision metadata, artifact records, same-product pointer, and audit atomically.
- Keep uncommitted objects unreachable.
- Clean verified orphans safely.
- Preserve the prior live pointer on every failure.
- Enforce valid approval, activation, retirement, rollback, and BOQ submission transitions.
- Bind idempotency keys to actor and exact payload.
- Reject reuse with different data.

This section owns `SEC-TXN-01` through `SEC-TXN-05` and `SEC-IDEM-01` through `SEC-IDEM-02`.

## Section 4 — sharing and protected data

- Use random, scoped, expiring, revocable share tokens.
- Bind each share to one immutable revision.
- Recheck expiry, revocation, permission, and enumeration on every request.
- Keep private shares out of public caches, indexes, analytics, URLs, and logs.
- Classify catalog drafts, prices, BOQs, quotes, customer data, audit, and SVG records.
- Minimize public and degraded responses.
- Keep secrets, tokens, cookies, prompts, and commercial data out of logs and bundles.
- Define retention, deletion, export, backup, and restore rules.

This section owns `SEC-SHARE-01` through `SEC-SHARE-04` and `SEC-DATA-01` through `SEC-DATA-04`.

## Section 5 — integrations, AI, and abuse controls

- Inventory trust boundaries and credentials.
- Authenticate and validate inbound payloads, files, and webhooks.
- Allowlist outbound protocols and destinations.
- Block private-network and unsafe redirects where input can influence URLs.
- Bound size, duration, redirects, retries, concurrency, and cost.
- Test timeout, duplicate, replay, and partial delivery.
- Treat AI input and output as untrusted.
- Send providers no unnecessary personal, project, BOQ, prompt, or secret data.
- Constrain AI tools, URLs, cost, retries, and logs.
- Use a distributed production rate-limit backend for public and commercial scopes.
- Fail closed when distributed limits are unavailable for AI, publication, import, share, quote, and expensive export.

This section owns `SEC-INT-01` through `SEC-INT-05`, `SEC-AI-01` through `SEC-AI-03`, and `SEC-RATE-01` through `SEC-RATE-02`.

## Section 6 — browser policy and security experience

- Map CSP needs by route.
- Justify every external origin.
- Minimize `unsafe-inline` and `unsafe-eval`.
- Prove required canvas behavior under production policy.
- Verify CSP, HSTS, nosniff, frame, referrer, permissions, cookies, and cache headers at runtime.
- Distinguish unauthenticated, unauthorized, expired, stale, rate-limited, offline, and server failure.
- Reveal no protected object or sensitive detail.
- Preserve safe work after recoverable failure.
- Give one safe next action.
- Verify WCAG 2.2 AA, keyboard completion, focus, status announcements, and accessible authentication.

This section owns `SEC-HDR-01` through `SEC-HDR-03` and `SEC-UX-01` through `SEC-UX-04`.

## Section 7 — release, backup, restore, and rollback

- Record source, lockfile, runtime, dependencies, build, schema, catalog, SVG, family, price, and BOQ versions.
- Record hashes for released code, contracts, revisions, and artifacts.
- Run secret, dependency, database-advisor, route, header, and authorization gates.
- Keep release evidence append-only or tamper-evident.
- Verify code, database, catalog, SVG, storage, price, and configuration rollback.
- Verify Products DB, Admin DB, artifact storage, and R2 snapshot backup coverage.
- Restore into a non-production target.
- Prove released product, same-product pointer, artifact existence, checksum, and Planner import.
- Verify maintenance and degraded modes expose no protected data and allow no forbidden writes.

This section owns `SEC-REL-01` through `SEC-REL-05` and `SEC-OPS-01` through `SEC-OPS-03`.

## Parallel execution

Each section starts when its direct boundary exists.

Independent sections run in parallel.

One failed boundary blocks only that boundary.

Release approval waits for the evidence relevant to that release.

## Required proof

- Fresh commands and exit codes.
- Positive and negative tests.
- Direct API tests.
- Production-like headers and cookies.
- Database advisors on both databases.
- Transaction rollback and stale-write tests.
- Exact artifact checksum tests.
- Keyboard and assistive-technology checks.
- Non-production backup and restore drill.
- Active failures in `../../Failures.md`.

## Done when

Every `SEC-*` item and Security-owned `DB-SVG-*` item in `CHECKLIST.md` passes.

No completion claim relies on old reports, hidden UI, schema files, or `results/`.
