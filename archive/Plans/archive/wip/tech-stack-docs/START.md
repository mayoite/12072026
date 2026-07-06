# Tech Stack Docs Start Instructions

**Status:** Ready to begin Phase 1.  
**Owner:** monorepo root orchestration; `site/` is a canonical source and `tech-stack-generator/` is the renderer.

## Read In Order

1. Repository `AGENTS.md`
2. Repository `Readme.md`
3. This file
4. `DESIGN.md`
5. `PLAN.md`
6. `TEST.md`
7. `FAILURES.md`
8. Live files being changed

Read `HANDOVER.md` before closing Phase 3.

## Start Conditions

- Work only in the active repository.
- Preserve unrelated worktree changes.
- Do not commit, push, publish, migrate, delete, or run tests without explicit user permission.
- Treat `PLAN.md` as the only active implementation plan.
- Treat the complete `Documents/` tree as generated output.
- Do not manually edit anything under `Documents/`.
- Log plan-specific issues in `FAILURES.md`.
- Log meaningful repository failures, skips, blockers, and follow-ups in root `Failures.md`.

## Execution Order

1. Execute `PLAN.md` Phase 1 and prove its exit criteria.
2. Execute Phase 2 only after Phase 1 is complete.
3. Execute Phase 3 only after Phase 2 is complete.
4. Apply `TEST.md` when test permission is granted.
5. Complete `HANDOVER.md` before claiming completion.

## Required Reporting

After each phase report:

- Done
- Verified
- Skipped
- Risks
- Next

No phase or accuracy claim is complete without the proof required by `PLAN.md`.
