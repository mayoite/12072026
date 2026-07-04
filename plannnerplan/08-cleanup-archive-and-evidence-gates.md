# 08 Cleanup, Archive, And Evidence Gates

## Objective

Clean up replaced planner code only after route replacement is proven, archiving before deletion and preserving evidence integrity.

## Non-negotiable priorities and sequence

Treat these as co-dependent release dimensions: **workflow/data/auth integrity; drawing-tool/geometry correctness; UX/accessibility; UI/responsive layout; inventory architecture; recoverable dockable toolbars/panels; visual consistency/performance**. Every dimension is release-blocking. Do not remove donor, staging, or fallback references until all dimension and production-path evidence is accepted. Archive `open3d-next-staging/` only after the moved implementation is verified.

**Mandatory acceptance:** `QUALITY-GATES.md` applies to this phase.

**Governing decisions:** `IMPLEMENTATION-DECISIONS.md` applies to this phase.

## Inputs to read

- Phase 07 evidence.
- `Failures.md`
- `TESTING.md`
- `testing-handbook.md`
- `START.md`
- `site/features/planner/CONTENTS.md`
- `site/public/vendor/open3d-floorplan/embed/...`
- `open3d-floorplan/static/models/`
- `open3d-floorplan/static/textures/`
- `site/public/cdn/`
- `package.json`, `pnpm-workspace.yaml`, `site/package.json`, and `open3d-floorplan/package.json`

## Scope

- Require pilot soak, fallback-use review, representative legacy audit, rollback drill, and explicit user approval before retirement.

- Cleanup is separate from route swap.
- Archive before deleting.
- Do not remove packages, assets, scripts, or fallback paths without explicit evidence and approval.
- Do not run release/test gates without explicit permission.

## Checklist

- [ ] Record fallback retirement decision in `Failures.md` if write scope permits.
- [ ] Archive replaced route/runtime pieces before deletion.
- [ ] Remove active dependency on iframe/static embed only after native route sign-off.
- [ ] Remove or keep `open3d-floorplan` workspace package based on future ownership: source reference, build fallback, or fully absorbed native code.
- [ ] Remove Fabric/r3f planner code only after confirming no route, API, test, export, portal, admin, or fallback path imports it.
- [ ] Move only classified runtime/editor assets to `site/public/cdn/planner/open3d`.
- [ ] Leave product/catalog images and 3D models in R2/DB-backed flow.
- [ ] Preserve license and attribution for any Open3D assets copied.
- [ ] Update docs only in their owning layer and only if implementation scope allows.
- [ ] Capture warnings, skips, blockers, and follow-ups.

## Exit gate

- [ ] No active production route depends on retired code.
- [ ] Archived fallback exists until user accepts removal.
- [ ] Asset ownership is correct.
- [ ] Dependency removals are justified by import/search evidence.

## Evidence required

- Import graph/search proof before removing any code.
- Asset classification table.
- Dependency diff and reason.
- Command outputs and artifacts for any permitted checks.

## Phase governance

### Forbidden actions

- Do not delete old planner code before Phase 07 route swap is verified.
- Do not copy product/catalog assets into git (CDN/R2 ownership).
- Do not remove packages, assets, scripts, or fallback paths without explicit evidence and approval.
- Do not run release/test gates without explicit permission.
- Do not archive `open3d-next-staging/` before production verification.
- Do not delete without archiving first.
- Do not remove fallback paths without soak period evidence.

### Phase entry checklist

- [ ] Phase 07 route swap verified and accepted.
- [ ] Pilot soak period completed with evidence.
- [ ] Fallback-use telemetry reviewed (where permitted).
- [ ] Representative legacy-document audit completed.
- [ ] Rollback drill completed successfully.
- [ ] Explicit user approval obtained for cleanup.

### Rollback criteria

- If any production route breaks after cleanup, abort and restore from archive.
- If asset ownership is incorrect, abort and reclassify.
- If import graph shows unexpected dependencies, abort and investigate.
- If evidence is incomplete, abort and gather before continuing.

### Risk register

- **Risk:** Premature deletion removes recovery paths. **Impact:** high. **Mitigation:** archive before delete; soak period evidence. **Owner:** cleanup agent. **Status:** open.
- **Risk:** Product assets in git violate CDN/R2 ownership. **Impact:** high. **Mitigation:** asset classification table; only runtime/editor assets to CDN. **Owner:** cleanup agent. **Status:** open.
- **Risk:** Missing evidence makes cleanup incomplete. **Impact:** medium. **Mitigation:** import graph/search proof before every removal. **Owner:** cleanup agent. **Status:** open.

### Success metrics

- No active production route depends on retired code: pending
- Archived fallback exists until user accepts removal: pending
- Asset ownership is correct (CDN/R2 vs. git): pending
- Dependency removals justified by import/search evidence: pending
- All cleanup actions documented with evidence: pending

### Dependencies on external systems

- Phase 07 route swap completed.
- `Failures.md` for failure tracking.
- `TESTING.md` and `testing-handbook.md` for test policies.
- `site/features/planner/CONTENTS.md` for feature inventory.
- Import graph tools for dependency analysis.

### Performance budgets

- Cleanup execution: <30 minutes.
- Archive creation: <5 minutes.
- Import graph analysis: <2 minutes.

### Security considerations

- No secrets in archived code.
- Asset provenance documented.
- License/attribution preserved for copied assets.
- No sensitive data in git.

### Accessibility considerations

- Cleanup does not affect accessibility of remaining code.
- Archive includes accessibility test evidence.

### Decision log

- *(To be filled during implementation)*

## Risks/blockers

- Deleting old planner code too early removes recovery and comparison paths.
- Product assets copied into git can violate CDN/R2 ownership.
- Missing evidence makes cleanup incomplete, not done.
