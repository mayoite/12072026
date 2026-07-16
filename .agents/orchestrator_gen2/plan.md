# Plan - Workspace Layout Refinement (Generation 2)

This plan coordinates the implementation of the RAC overlay drawers, responsive TopBar layout, edge-to-edge canvas, and comprehensive verification using the original and 3 additional subagents.

## Checklist

### Step 1: Setup and Startup
- [x] Create Gen 2 workspace files (`ORIGINAL_REQUEST.md`, `BRIEFING.md`).
- [x] Create `plan.md`, `progress.md`, and `context.md`.
- [ ] Schedule heartbeat cron for orchestrator_gen2.

### Step 2: Coordinate Implementation (Workers)
- [ ] Message Worker 1 (TopBar & Brand) to continue/start work.
- [ ] Message Worker 2 (Bottom Drawer) to focus on the Bottom Panel/Drawer implementation.
- [ ] Spawn Worker 4 (Left Drawer & Canvas) to implement Left Panel/Drawer and edge-to-edge canvas.
- [ ] Message Worker 3 (Integration & Tests) to orchestrate integration.
- [ ] Monitor all implementation subagents and collect their handoffs.

### Step 3: Coordinate Verification (Reviewers, Challengers, Auditor)
- [ ] Spawn Reviewer 1 and Reviewer 2 to review the implementation changes.
- [ ] Spawn Challenger 1 and Challenger 2 to run stress/unit tests.
- [ ] Spawn Challenger 3 (Focus & Accessibility) to verify focus traps, ESC closure, and backdrop clicks.
- [ ] Spawn Challenger 4 (Responsiveness) to verify responsive behavior at viewports < 48rem.
- [ ] Spawn Forensic Auditor to verify integrity (no hardcoding, authentic RAC usage).
- [ ] Collect and synthesize all verification reports.

### Step 4: Final Acceptance Gate
- [ ] Verify build and tests pass (run check:layout, typescript check, pnpm test).
- [ ] Ensure all reviewer and challenger gate criteria are met.
- [ ] Ensure Forensic Auditor verdict is clean.
- [ ] Resolve any conflicts/failures (retry/replace if needed).

### Step 5: Handoff and Completion
- [ ] Write handoff.md and final human report.
- [ ] Report task completion back to the parent agent (Sentinel).
