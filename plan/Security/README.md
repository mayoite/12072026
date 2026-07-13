# Security track

## Outcome

Security is one primary phase.

It verifies the boundaries created by Admin, Planner, and Site.

## Phase 1

Plan: `PHASE-01-security.md`.

It covers:

1. Commercial data authorization.
2. Revision and sharing permissions.
3. Integration security.
4. Release provenance.

## Execution rule

Security starts when each direct boundary is available.

It does not wait for every product phase.

A failure blocks only the affected route, permission, integration, or release.

Unrelated work continues.

## Ownership

- Product tracks implement secure boundaries.
- Security independently verifies them.
- Client-side visibility is never treated as authorization.
- TypeScript types are never treated as runtime validation.
- Infrastructure controls are verified at runtime when they are not visible in code.

## Parallel execution

- Commercial authorization can run with Admin pricing and Planner BOQ work.
- Revision permissions can run with Planner revision and sharing work.
- Integration security can run with ingestion, exports, and quote handoff.
- Release provenance can run with every release candidate.

## Status

`CHECKLIST.md` is the only Security status record.

Every item starts unchecked.

## Completion

Protected data and actions fail closed.

Sharing and integrations resist unauthorized use.

Every released commercial package has reproducible provenance.
