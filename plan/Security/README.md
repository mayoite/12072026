# Security track

## Outcome

Security verifies every protected boundary created by Admin, Planner, and Site.

It does not create a separate product.

It proves that protected data, actions, integrations, and releases fail closed.

## Authority

- Security acceptance: `../../docs/architecture/10-SECURITY-BENCHMARK.md`.
- Database SVG contract: `../../docs/architecture/08-DATABASE-SVG-CONTRACT.md`.
- Database execution detail: `../../Plans/02-recovery/phases/06-database.md`.
- Operations: `../../OPERATIONS_RUNBOOK.md`.

OWASP ASVS 5.0.0 Level 2 is the verification target.

Higher-risk commercial actions receive stronger transaction checks.

## One plan with multiple execution sections

Plan: `PHASE-01-security.md`.

The plan contains:

1. Test isolation and live inventory.
2. Authentication, authorization, and CSRF.
3. Products DB, SVG storage, and publication transactions.
4. Sharing and commercial state transitions.
5. Data, integrations, AI, and rate limits.
6. Headers and accessible security states.
7. Release provenance, backup, restore, and rollback.

These are execution sections.

Nothing waits for a later decision bucket.

## Execution rule

Security begins when each direct boundary exists.

It does not wait for every product section.

A failure blocks only the affected route, object, integration, transaction, or release.

Unrelated work continues.

## Ownership

- Product tracks implement secure boundaries.
- Security independently verifies them.
- Client-side visibility is never authorization.
- TypeScript types are never runtime validation.
- A development auth bypass is never production proof.
- A schema file is never proof of a live database.
- `results/` is never proof of completion.

## Acceptance trace

| Execution section | Acceptance IDs |
|---|---|
| Inventory | `SEC-INV-01` through `SEC-INV-02` |
| Authentication and CSRF | `SEC-AUTH-01` through `SEC-AUTH-06`, `SEC-CSRF-01` through `SEC-CSRF-02` |
| Database and SVG | `SEC-DB-01` through `SEC-DB-04`, `SEC-SVG-01` through `SEC-SVG-05`, `DB-SVG-14`, `DB-SVG-19` |
| Transactions and idempotency | `SEC-TXN-01` through `SEC-TXN-05`, `SEC-IDEM-01` through `SEC-IDEM-02` |
| Sharing and data | `SEC-SHARE-01` through `SEC-SHARE-04`, `SEC-DATA-01` through `SEC-DATA-04` |
| Integrations and AI | `SEC-INT-01` through `SEC-INT-05`, `SEC-AI-01` through `SEC-AI-03` |
| Limits, headers, and UX | `SEC-RATE-01` through `SEC-RATE-02`, `SEC-HDR-01` through `SEC-HDR-03`, `SEC-UX-01` through `SEC-UX-04` |
| Release and operations | `SEC-REL-01` through `SEC-REL-05`, `SEC-OPS-01` through `SEC-OPS-03` |

## Status

`CHECKLIST.md` is the only Security status record.

Every item starts unchecked.

## Completion

Every applicable acceptance ID passes fresh positive and negative checks.

Protected data stays protected.

Commercial transactions are authorized, atomic, and auditable.

Released code, data, contracts, and artifacts are reproducible and recoverable.
