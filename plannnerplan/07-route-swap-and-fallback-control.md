# 07 Route Swap And Fallback Control

## Objective

Move the native Open3D replacement into `/planner/guest/` and `/planner/canvas/` only after earlier gates prove data, auth, catalog, UI, and workflow behavior.

## Non-negotiable priorities and sequence

Treat these as co-dependent release dimensions: **workflow/data/auth integrity; drawing-tool/geometry correctness; UX/accessibility; UI/responsive layout; inventory architecture; recoverable dockable toolbars/panels; visual consistency/performance**. Every dimension is release-blocking. Freeze the verified `open3d-next-staging/` revision, move reviewed React modules/assets into `site/features/planner/open3d/`, re-run parity checks from production paths, and only then swap routes.

**Mandatory acceptance:** `QUALITY-GATES.md` applies to this phase.

**Governing decisions:** `IMPLEMENTATION-DECISIONS.md` applies to this phase.

**Design acceptance:** Route pilot requires evidence against the accepted fresh-design brief, not donor appearance.

## Current status

- **2026-07-03 (updated):** Route swap **executed** on explicit user override with green `test:planner` (2409) and typecheck prerequisites.
- Live `/planner/guest` and `/planner/canvas` → `Open3dPlannerHost` → native Open3D workspace.
- Fabric rollback drill → `/planner/fabric/guest`, `/planner/fabric/canvas` → archived stack under `site/features/planner/_archive/fabric/`.
- Phases 05/06 formal acceptance and promotion manifest remain **open**; browser soak not yet captured.
- Evidence: `results/planner/phase-07/route-swap/`, `plannnerplan/phases/07/evidence.md`.

## Inputs to read

- Phase 01A through Phase 06 evidence.
- `site/app/planner/(workspace)/guest/page.tsx`
- `site/app/planner/(workspace)/canvas/page.tsx`
- `site/app/planner/(workspace)/layout.tsx`
- `site/features/planner/ui/Open3dPlannerHost.tsx`
- `site/features/planner/ui/PlannerWorkspaceRoute.tsx`
- `site/config/route-contract.json`
- Middleware/auth route protection files if route semantics need review.

## Scope

- Use an owned, expiring feature flag with cohort, kill switch, compatibility rules, and telemetry boundaries.
- Rehearse rollback before pilot; separate technical route verification from pilot acceptance.

- Swap route host late.
- Keep routes thin.
- Preserve `/planner/guest` as public and `/planner/canvas` as protected.
- Keep iframe/static embed and old Fabric/r3f code available as fallback/archive until sign-off.

## Checklist

- [ ] Confirm Phases 01-06 exit gates passed or explicitly document remaining blockers.
- [ ] Add a fallback selector only if it is explicit, tested, and not a silent behavior fork.
- [ ] Replace `Open3dPlannerHost` route usage with the native Open3D host only after evidence is accepted.
- [ ] Keep `site/app/planner/(workspace)/guest/page.tsx` thin.
- [ ] Keep `site/app/planner/(workspace)/canvas/page.tsx` thin and preserve `id` handling.
- [ ] Preserve route metadata/noindex behavior from workspace layout.
- [ ] Update `site/config/route-contract.json` only if semantics change.
- [ ] Verify legacy redirects remain compatible.
- [ ] Do not delete `site/public/vendor/open3d-floorplan/embed/...` in this phase.
- [ ] Do not delete Fabric/r3f planner code in this phase unless separately approved and archived.

## Exit gate

- [ ] `/planner/guest/` uses native Open3D replacement.
- [ ] `/planner/canvas/?id=<uuid>` uses native Open3D replacement.
- [ ] Fallback path remains available.
- [ ] Public/protected route semantics are preserved.

## Evidence required

- Route diff summary.
- Guest route proof.
- Member route proof.
- Route contract review.
- Fallback invocation proof.
- Skipped Playwright/browser checks stated if not permitted.

## Phase governance

### Forbidden actions

- Do not swap routes before Phases 01-06 exit gates pass.
- Do not delete iframe/static embed (`site/public/vendor/open3d-floorplan/embed/...`).
- Do not delete Fabric/r3f planner code unless separately approved and archived.
- Do not create silent behavior forks via fallback selectors.
- Do not change route semantics without explicit approval.
- Do not remove legacy redirects without verification.
- Do not make routes thick; keep them thin.

### Phase entry checklist

- [ ] Phases 01-06 exit gates passed or blockers explicitly documented.
- [ ] Promotion manifest created for staging-to-production move.
- [ ] Feature flag designed with cohort, kill switch, expiry, telemetry boundaries.
- [ ] Rollback rehearsal completed.
- [ ] Route contract reviewed.

### Rollback criteria

- If data loss occurs during route swap, abort and revert immediately.
- If auth behavior differs between guest/member/admin, abort and fix.
- If fallback path fails, abort and restore previous route.
- If feature flag kill switch fails, abort and fix before continuing.
- If performance degrades beyond budgets, abort and optimize.

### Risk register

- **Risk:** Data loss from premature route swap. **Impact:** critical. **Mitigation:** require all prior phase gates; rollback rehearsal. **Owner:** route agent. **Status:** open.
- **Risk:** Fallback flags hide production regressions. **Impact:** high. **Mitigation:** explicit flag documentation; telemetry monitoring. **Owner:** route agent. **Status:** open.
- **Risk:** Auth behavior differs across user types. **Impact:** high. **Mitigation:** separate verification for guest/member/admin. **Owner:** route agent. **Status:** open.

### Success metrics

- `/planner/guest/` uses native Open3D replacement: pending
- `/planner/canvas/?id=<uuid>` uses native Open3D replacement: pending
- Fallback path remains available: pending
- Public/protected route semantics preserved: pending
- Feature flag cohort activated successfully: pending
- Rollback rehearsal completed without data loss: pending

### Dependencies on external systems

- Phases 01A-06 completed and verified.
- `/planner/guest/` and `/planner/canvas/` route files.
- `Open3dPlannerHost` component.
- Feature flag system.
- Middleware/auth route protection.

### Performance budgets

- Route swap time: <5 minutes (feature flag toggle).
- Fallback activation: <1 second.
- No performance regression vs. previous implementation.
- p95 page load: <2 seconds.

### Security considerations

- Feature flag with explicit cohort, kill switch, expiry.
- Telemetry boundaries defined.
- Auth behavior verified for guest/member/admin.
- Fallback path does not expose sensitive data.

### Accessibility considerations

- Route swap does not change accessibility behavior.
- Fallback path maintains same accessibility features.
- Feature flag does not affect keyboard navigation or screen readers.

### Decision log

- **2026-07-03:** Route swap executed on user override (prerequisite: `test:planner` green). Formal acceptance gates (05/06, promotion manifest, browser soak) remain open — see `phases/07/evidence.md`.

## Risks/blockers

- Swapping routes before persistence and catalog evidence can create visible data loss.
- Fallback flags can hide production regressions if undocumented.
- Auth behavior must be verified separately for guest, member, and admin.
