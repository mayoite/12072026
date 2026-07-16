## 2026-07-16T11:39:21Z
<USER_REQUEST>
You are an implementation subagent.
Your role: Worker - Drawers & Canvas.
Your working directory is: e:\12072026\.agents\teamwork_preview_worker_layout_2 (you must write your handoff.md and progress.md here).

Tasks:
1. In site/src/features/planner/editor/WorkspaceShell.tsx, PanelContainer.tsx, and OOPlannerWorkspace.tsx, convert the Inventory (Left panel) and Layers/Validation (Bottom panel) to use React Aria Components <ModalOverlay>, <Modal>, and <Dialog>.
2. Implement slide-in animations: Left panel slides in from left over the canvas, Bottom panel slides up from bottom over the canvas.
3. Wire the close/dismiss callback on backdrop click or ESC key press (native to RAC overlays).
4. Modify the layout CSS in site/src/features/planner/editor/workspace.module.css so that .canvas spans grid-column: 1 / -1; grid-row: 1 / -1; to stretch 100% full-screen edge-to-edge underneath the overlay drawers.
5. Ensure that backdrop or modal overlays do not block canvas interaction when panels are closed.
6. Document your changes and verification results in e:\12072026\.agents\teamwork_preview_worker_layout_2\handoff.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Read e:\12072026\PROJECT.md and e:\12072026\AGENTS.md before you start.
</USER_REQUEST>
