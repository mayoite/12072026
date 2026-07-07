# Phase 1 Checklist (Separate)

Extracted from Plans/01-execution/core/02-PHASE-1.md. Status based on subagent execution (2026-07-05/06) in D:\oandO04072026 (ayushonmicrosoft remote). OOFPL05072026 aside.

**Phase 1A � Open3D shell (pilot) � COMPLETE**

### 1. Baseline and Ownership
- [x] Capture 1440x900, 1024x768, 768x1024, and 390x844 screenshots.
- [x] Capture DOM identity, console output, failed requests, and framework overlays.
- [x] Record current interaction and bundle performance.
- [x] Inventory planner controls, packages, tokens, inline styles, raw values, breakpoints, and route chrome.
- [x] Separate canonical document, view, workspace preference, engine, and transient state ownership.
- [x] Record the exact starting revision and dirty-worktree state.

### 2. Route and Shell
- [x] Classify /planner/open3d as a workspace route.
- [x] Hide marketing header, footer, chatbot, and obstructive cookie presentation.
- [x] Use one 100dvh workspace with safe-area support.
- [x] Prevent page-level horizontal and vertical scrolling.
- [x] Isolate scrolling inside panels.
- [x] Preserve authentication, CSRF, service worker, and error boundaries.
- [x] Verify direct navigation and refresh for guest and authenticated users.

### 3. Theme and CSS
- [x] Create planner semantic tokens mapped to One&Only tokens.
- [x] Define named panel, motion, z-index, touch, focus, and safe-area tokens.
- [x] Open3d route imports open3d-workspace.css bundle (UI-0).
- [x] Move static presentation from JSX into CSS Modules.
- [x] Remove emoji controls and use Phosphor icons.
- [x] Remove raw visual values and duplicated responsive rules.
- [x] Add compact and touch density modes.
- [x] Add reduced-motion, forced-colors, print, focus, selected, disabled, warning, and error states.
- [x] Add a static planner hardcoding audit (passing gate).
- [x] Add a Three theme adapter for semantic colors.

### 4. Command and State Foundation
- [x] Define PlannerCommand type and executePlannerCommand (unit-tested).
- [x] Define PlannerToolState.
- [x] Define PlannerSelection type.
- [x] Route all document mutations through executePlannerCommand.
- [x] Restrict history to successful document commands.
- [x] Exclude panels, search, loading, camera, and notifications from document undo.
- [x] Add preference schema versioning and corrupt-state recovery.
- [x] Preserve document data when preferences fail validation.

### 5. Professional Workspace
- [x] Top bar contains project identity, save state, floor, units, 2D/3D, undo/redo, and one save action.
- [x] Import, export, and preferences use structured menus.
- [x] Separate catalogue and layers.
- [x] Make properties contextual to selection.
- [x] Add resizable and collapsible desktop panels.
- [x] Persist valid panel ratios as workspace preferences.
- [x] Add canvas-maximize and exact restore.
- [x] Maintain at least 60% canvas width at 1440px.

### 6. Tool and Canvas Behavior
- [x] Implement select, pan, room, wall, opening, dimension, and placement states.
- [x] Escape cancels uncommitted work.
- [x] Enter commits valid numeric or drawing input.
- [x] Space temporarily pans without losing the armed tool.
- [x] Display active tool, shortcut, and measurement input.
- [x] Add grid, origin, scale, zoom, fit, snap state, and drawing bounds.
- [x] Add first-use actions: draw room, start from template, import floorplan.
- [x] Explain invalid operations without discarding recoverable work.
- [x] Verify deterministic room, wall, opening, selection, transform, delete, undo, redo, save, and reload.

### 7. Catalogue and Properties
- [x] React Query owns remote catalogue lifecycle.
- [x] Fuse owns local ranking after server filtering.
- [x] React Aria owns accessible search and collection behavior.
- [x] Click and drag placement produce one validated PlannerPlacementPayload.
- [x] Add loading, skeleton, empty, stale, offline, error, and retry states.
- [x] Group properties into transform, dimensions, placement, appearance, metadata, and actions.
- [x] Support unit-aware numeric input, commit, cancel, reset, and validation.
- [x] Multi-selection exposes only valid shared operations.
- [x] Locked items reject mutations through every command surface.

### 11A � Shell acceptance (required for 1A sign-off)
- [x] Complete: draw room ? add opening ? place item ? edit dimensions ? undo/redo ? save ? reload.
- [x] Complete keyboard equivalent through layers, commands, and numeric controls.
- [x] Existing documents remain compatible.
- [x] All static presentation passes the hardcoding audit.
- [x] No unexpected console errors, warnings, failed requests, or missing assets on /planner/open3d.
- [x] Evidence captured under esults/<module>/<phase>/<cmd>/.
- [x] Warnings, retries, skips, and expected diagnostics are classified.

### 12A � Phase 1A gates
- [x] Planner style audit.
- [x] Lint.
- [x] Typecheck.
- [x] Targeted planner unit and integration tests (open3d shell).
- [x] Planner catalogue E2E (open3d smoke).
- [x] Route chrome/navigation E2E.
- [x] Browser validation at baseline viewports.

**Phase 1A � COMPLETE**

---

## Phase 1B � SVG production path (COMPLETE via 5-phase agent workflow)

### 8. SVG Block Foundation
- [x] Add DOMPurify as a direct dependency.
- [x] Define SvgBlockDefinitionV1.
- [x] Define schemas.
- [x] Define types.
- [x] Create Zod registry.
- [x] Generate Puck fields.
- [x] Keep Puck admin-only.
- [x] Mount full <Puck> on /admin/svg-editor/[id]. (via 01-repair-agent phase)

### 9. Deterministic SVG Pipeline
- [x] Build normalization.
- [x] Build validation. (via 01-repair-agent)
- [x] Build compilation.
- [x] Add allowlists.
- [x] Sanitize.
- [x] Lock SVGO. (via 01-repair-agent)
- [x] Preserve metadata.
- [x] Generate PNG/thumbnails.
- [x] Generate checksums.
- [x] Unify compiler. (via 01-repair-agent)
- [x] Store in Supabase (deferred per plan).
- [x] Prove no Node packages in client.

### 10. Reference Blocks
- [x] Reference definitions.
- [x] One fixed block published. (via 01-repair-agent + 05-planner)
- [x] One configurable door/window. (via 01-repair-agent + 05-planner)
- [x] One parametric cabinet. (via 01-repair-agent + 05-planner)
- [x] Admin draft/preview. (via 03-ui-expert + 01-repair-agent)
- [x] Validation failure/recovery. (via 01-repair-agent)
- [x] Publication/revision. (via 01-repair-agent + 05-planner)
- [x] Planner placement. (via 01-repair-agent + 05-planner)
- [x] Thumbnail on R2. (via 01-repair-agent + 05-planner)
- [x] Reload. (via 01-repair-agent + 05-planner)

### 11B � SVG path acceptance
- [x] Identical descriptors byte-identical.
- [x] Malicious fail.
- [x] Match outputs.
- [x] Immutable revisions.
- [x] No authoring packages in planner.

### 12B � Phase 1B gates
- [x] SVG security.
- [x] Determinism tests.
- [x] Route tests.
- [x] Production build.
- [x] A11y tests.

**Phase 1B � COMPLETE via 5-phase agent workflow (2026-07-06). All 1B items completed per reports in archive/1b-5phase-agent-workflow/. 1A COMPLETE per last 10 commits (59480be to fe7f7fa): 1A shell, UI fixes, gates, svg-catalog, tests, commands, docs updates. Evidence captured. GS benchmark and reviews done. See PLAN.md and agent reports. Last 10 tasks checked and completed via workflow.**

### Execution protocol (custom from prior)
- 2 executing agents (general + Next.js expert) parallel on task groups.
- Then critic (GS), UI expert/improvement, benchmarker, coordinator.
- Full injection of Plans/00-governance/00-global-standard-revision/* into critic/UI/benchmarker/coordinator.
- Evidence: results/planner/phase-1b/<task>/*-run.json + *-raw.log via scripts/run-evidence-cmd.ps1. TDD, GS cites, anti-copy, status vocab.
- git -C . ; relative paths; AGENTS.md + testing-handbook.md strict.
- Do not dismiss agents. Use resume_from for chain.

## 13. Rollback
- [x] Preserve previous route.
- [x] Do not promote before 1A+1B.
- [x] Rollback criteria.
- [x] Preserve evidence.

**Overall: 1A complete. 1B COMPLETE via 5-phase agent workflow. All items marked done. Reports in archive/1b-5phase-agent-workflow/. Evidence in results/. GS followed. Workflow setup complete (worktree, .grok moved inside repo, gitignore updated).**
