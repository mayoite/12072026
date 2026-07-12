# A8 — Release, audit, and rollback

**Status:** OPEN — publish writes artifacts, but admin-wide release governance is incomplete.

**Outcome:** Every catalog, system, SVG, asset, and price change has an accountable release path and a safe rollback.

## Functional scope

- Draft → review → approved → scheduled/active workflow.
- Human-readable diff for fields, assets, system rules, and price impact.
- Actor, timestamp, reason, source revision, and affected consumers.
- Release validation across SVG, 2D, 3D, catalog, and BOQ dependencies.
- Roll back to a known revision without deleting later history.
- Impact preview for existing plans and quotes.
- Failed release leaves the active version unchanged.

## Acceptance

- [ ] **Green when** a reviewer can reject a release with a required reason that is stored and shown on the audit trail.
- [ ] **Green when** a release commits across all its declared artifacts (SVG, 2D, 3D, catalog, BOQ) atomically — a mid-release failure activates none of them.
- [ ] **Green when** rollback restores a prior version and writes a new audit event (actor, timestamp, reason, source revision) without deleting later history.
- [ ] **Green when** production-only release permissions are browser-proven — an unauthorized actor cannot approve or activate.
- [ ] **Green when** injected failure (validation, persist, dependency-missing) proves no partial activation: the active version is unchanged after the failure.
- [ ] Operations page shows current release health and lists any broken cross-artifact dependencies by name.

## Data-loss & failure states

- [ ] **Green when** a failed release leaves the active version and all consumers exactly as before — proven by a before/after diff, not an assertion.
- [ ] **Green when** the human-readable diff previews impact on existing placed plans and saved quotes before activation, so no accountable change ships blind.
- [ ] Audit history is append-only; no release or rollback path deletes a prior revision.

## Evidence

`results/admin/release-audit-rollback/`

## Dependency

A5–A7. A1–A3 remain the SVG foundation, not the whole admin product.
