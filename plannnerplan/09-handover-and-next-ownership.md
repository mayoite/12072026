# 09 Handover And Ownership

## Objective

Leave a complete handover that lets another agent or developer continue implementation without re-spending tokens on avoidable ambiguity.

## Non-negotiable priorities and sequence

Handover must preserve the co-dependent release dimensions: **workflow/data/auth integrity; drawing-tool/geometry correctness; UX/accessibility; UI/responsive layout; inventory architecture; recoverable dockable toolbars/panels; visual consistency/performance**. Every dimension is release-blocking. Record the donor revision, frozen staging revision, moved production paths, intentional differences, accepted evidence, known limitations, regression coverage, and named ownership for every dimension.

**Mandatory acceptance:** `QUALITY-GATES.md` applies to this phase.

**Governing decisions:** `IMPLEMENTATION-DECISIONS.md` applies to this phase.

## Inputs to read

- Phase 01A through Phase 08 evidence, including Phase 03A.
- `Failures.md`
- `HANDOVER.md` if implementation scope includes session status.
- `DOC-MAP.md` if docs are updated.
- Final changed files and git diff.

## Scope

- Summarize implementation truth, not optimism.
- Use the status taxonomy from `IMPLEMENTATION-DECISIONS.md` and trace requirements to implementation, fixtures, artifacts, and owners.
- Include decision log, schema/version table, feature-flag state, rollback runbook, operational ownership, and known data-loss/compatibility boundaries.
- State exactly what passed, failed, was skipped, or remains risky.
- Do not commit, push, publish, apply migrations, delete, or run destructive cleanup unless separately requested.

## Checklist

- [ ] Summarize architecture: native Open3D replacement path, fallback status, current planner code status, and `open3d-floorplan` package status.
- [ ] Summarize route status for `/planner/guest/` and `/planner/canvas/?id=<uuid>`.
- [ ] Summarize guest/member/admin auth behavior separately.
- [ ] Summarize catalog/admin ownership and product identity preservation.
- [ ] Summarize persistence and document schema decisions.
- [ ] Summarize uploads, AI, export, and 3D status.
- [ ] Summarize CSS/i18n/route-contract changes.
- [ ] List exact commands/manual checks with working directory, exit code, stdout/stderr/artifact paths, warnings, and skips.
- [ ] List checks not run, including Playwright if not explicitly permitted.
- [ ] List unresolved blockers and the next smallest implementation step.
- [ ] Confirm no background commands are left running.

## Exit gate

- [ ] User can see what changed, what is verified, what is skipped, and what remains risky.
- [ ] Another agent can continue from the next step without guessing source, route, auth, catalog, CSS, i18n, or evidence rules.
- [ ] No unsupported ship-ready claim is made.

## Evidence required

- Final git status.
- Exact file list changed.
- Verification command list or explicit skipped-check list.
- Remaining risk register.

## Phase governance

### Forbidden actions

- Do not commit, push, publish, apply migrations, delete, or run destructive cleanup unless separately requested.
- Do not claim ship-ready without evidence.
- Do not hide skipped checks or failures.
- Do not leave background commands running.
- Do not make unsupported claims about verification status.
- Do not omit known limitations or data-loss boundaries.

### Phase entry checklist

- [ ] Phase 08 cleanup completed and verified.
- [ ] All prior phase evidence gathered.
- [ ] Final git status captured.
- [ ] All changed files identified.
- [ ] Verification commands list or skipped-check list prepared.

### Rollback criteria

- If handover document is incomplete, abort and gather missing information.
- If evidence is missing for critical paths, abort and document gaps.
- If ownership is unclear, abort and clarify before proceeding.

### Risk register

- **Risk:** Silent skipped checks worse than failed checks. **Impact:** high. **Mitigation:** explicit skipped-check list with reasons. **Owner:** handover agent. **Status:** open.
- **Risk:** Native-looking planner without data/auth/catalog proof. **Impact:** critical. **Mitigation:** require evidence for every dimension. **Owner:** handover agent. **Status:** open.
- **Risk:** Fallback status unclear. **Impact:** medium. **Mitigation:** explicit statement: fallback remains or retired with evidence. **Owner:** handover agent. **Status:** open.

### Success metrics

- User can see what changed, verified, skipped, risky: pending
- Another agent can continue without guessing rules: pending
- No unsupported ship-ready claim: pending
- All dimensions have evidence or explicit skip reason: pending
- Decision log complete: pending
- Risk register current: pending

### Dependencies on external systems

- Phases 01A-08 evidence.
- `Failures.md` for failure tracking.
- `HANDOVER.md` for session status.
- `DOC-MAP.md` if docs updated.
- Git for final status and diff.

### Performance budgets

- Handover document creation: <1 hour.
- Evidence compilation: <30 minutes.
- Risk register update: <15 minutes.

### Security considerations

- No secrets in handover document.
- No sensitive data in evidence artifacts.
- Ownership clearly assigned.

### Accessibility considerations

- Handover document is accessible (markdown format).
- Evidence artifacts preserve accessibility test results.

### Decision log

- *(To be filled during implementation)*

## Risks/blockers

- Silent skipped checks are worse than failed checks.
- A native-looking planner without data/auth/catalog proof is not done.
- If fallback remains, say fallback remains; if fallback is retired, show accepted evidence.
