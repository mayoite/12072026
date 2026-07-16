# Plan - Workspace Layout Refinement with RAC Overlay Drawers

This plan outlines the steps for refining the OOPlanner Workspace layout to use floating React Aria Components (RAC) overlay drawers, restoring the OneAndOnlyLogo, and ensuring responsiveness.

## Steps

### Step 1: Initial Planning and Setup
- [x] Read ORIGINAL_REQUEST.md and AGENTS.md rules.
- [ ] Create `PROJECT.md` at workspace root.
- [ ] Schedule heartbeat cron.

### Step 2: Codebase Exploration and Analysis
- [ ] Spawn 3 Explorer subagents to:
  - Locate and analyze `OOPlannerWorkspace.tsx`, `WorkspaceLeftPanel.tsx`, `BottomSheet.tsx`, `TopBar.tsx`, and associated styles/tests.
  - Review how React Aria Components (RAC) is integrated or used.
  - Propose layout structure for edge-to-edge full-screen canvas and floating overlay drawers.
  - Detail how to handle focus trapping and dismissals via RAC `<ModalOverlay>` and `<Modal>`.
  - Propose responsive behavior for TopBar elements (Grid, Snap, Logo) on viewports < 48rem.
- [ ] Collect and synthesize Explorer reports.

### Step 3: Implementation
- [ ] Spawn 1 Worker subagent to:
  - Implement the RAC overlay drawers for the Left Panel (Inventory) and Bottom Panel (Layers/Validation).
  - Restore `OneAndOnlyLogo` inside the brand area of `TopBar.tsx`.
  - Align TopBar responsiveness to wrap/stack/hide buttons appropriately for viewports < 48rem.
  - Ensure edge-to-edge full-screen layout of canvas.
  - Run build and unit/integration tests to ensure no regressions.

### Step 4: Verification and Review
- [ ] Spawn 2 Reviewer subagents to review correctness, focus trap, accessibility, and visual structure.
- [ ] Spawn 2 Challenger subagents to verify the layout, responsiveness, and interaction with tests.
- [ ] Spawn 1 Forensic Auditor subagent to perform integrity verification (no hardcoding, clean implementation).
- [ ] Check gate criteria. Loop back if failure.

### Step 5: Wrap-up and Report
- [ ] Run `pnpm run check:layout` to ensure layout rules are respected.
- [ ] Write final reports and handoff.md.
- [ ] Notify parent Sentinel of task completion.
