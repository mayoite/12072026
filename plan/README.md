# Execution plan

This is the execution order.

The checklists record status only.

## Outcome

1. Admin publishes trusted inventory.
2. Site helps a public visitor discover Oando.
3. The visitor opens Planner.
4. The customer designs with available inventory.
5. Planner generates a branded BOQ.
6. The customer sends the BOQ to Oando.

## First gate

Run Admin Step 0 test isolation first.

Step 0 is defined in `Admin/README.md` and `Admin/CHECKLIST.md`.

Only catalog-writing tests wait for this gate.

Unrelated read-only work may continue.

## Parallel execution

### Stream A: Admin

1. `Admin/PHASE-01-authoring-quality.md`
2. `Admin/PHASE-02-catalog-lifecycle.md`
3. `Admin/PHASE-03-product-families.md`
4. `Admin/PHASE-04-commercial-governance.md`

### Stream B: Planner

1. `Planner/PHASE-01-start-and-boq.md`
2. `Planner/PHASE-02-design-workspace.md`
3. `Planner/PHASE-03-scale-validate-price.md`
4. `Planner/PHASE-04-deliver-handoff.md`

### Stream C: Site

1. `Site/PHASE-01-measurement-foundation.md`
2. `Site/PHASE-02-commercial-landing-pages.md`
3. `Site/PHASE-03-search-led-content.md`
4. `Site/PHASE-04-public-product-discovery.md`
5. `Site/PHASE-05-structured-data-release.md`

### Stream D: Security

1. `Security/PHASE-01-security.md`

Security is one plan with multiple execution sections.

It maps every `SEC-*` acceptance ID.

Admin, Planner, Site, and Security run in parallel after test isolation.

Within each stream, independent sections may run in parallel.

## Exact dependencies

| Work | Depends on |
|---|---|
| Planner catalog integration | Published catalog contract or isolated fixture. |
| Planner 2D SVG rendering | Released database revision and artifact contract, or isolated fixture. |
| Database SVG migration | Owner-approved SQL, target Products database, storage, backup, and rollback. |
| Database SVG security and operations | Admin and Planner boundaries plus Security-owned `DB-SVG-14` and `DB-SVG-19`. |
| Family-specific Admin pricing | Released family contract. |
| Phase 1 deterministic BOQ | Canonical project data or an isolated product-backed fixture. |
| Site public product discovery | Published catalog contract or isolated fixture. |
| Customer BOQ submission | Branded BOQ and Oando endpoint contract. |
| Final recheck | All four checklists and all active failures. |

A dependency blocks only the named work.

It does not stop either track.

## Folded concerns

- UI applies to Admin, Planner, and Site.
- SEO belongs to Site.
- Security verifies every changed boundary.
- Buyer work is part of the external customer Planner journey.
- `../Plans/02-recovery/phases/06-database.md` supplies database execution detail.
- Status for that database work remains in the Admin, Planner, and Security checklists.

## Verification

- Treat every checklist item as not done.
- Read live code before claiming support.
- Run focused checks during each phase.
- Run browser checks for interface claims.
- Rerun changed checks from clean state.
- Record active failures in `../Failures.md`.
- Remove failures after fresh verification.

Raw output uses stable paths under `results/<track>/<command>/`.

Each run cleans and overwrites its own command folder.

Do not create timestamped result dumps.

## Completion

Admin completes when trusted inventory is safely published and consumed.

Planner completes when a customer can design and send a branded BOQ to Oando.

Site completes when public discovery is truthful, measurable, and leads customers into Planner.

Security completes when protected data, permissions, integrations, and release provenance pass fresh negative and positive checks.

No requirement waits for a later decision bucket.

Every accepted requirement belongs to an execution phase in an active track.
