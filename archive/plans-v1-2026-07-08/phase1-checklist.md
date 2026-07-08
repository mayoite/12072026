# Phase 1 Checklist (Separate)

Extracted from Plans/01-execution/core/02-PHASE-1.md. Status based on subagent execution (2026-07-05/06) in D:\oandO04072026 (ayushonmicrosoft remote). OOFPL05072026 aside.

**Phase 1A � Open3D shell (pilot) � COMPLETE**

### 1. Baseline and Ownership
- [ ] Capture 1440x900, 1024x768, 768x1024, and 390x844 screenshots.
- [ ] Capture DOM identity, console output, failed requests, and framework overlays.
- [ ] Record current interaction and bundle performance.
- [ ] Inventory planner controls, packages, tokens, inline styles, raw values, breakpoints, and route chrome.
- [ ] Separate canonical document, view, workspace preference, engine, and transient state ownership.
- [ ] Record the exact starting revision and dirty-worktree state.

### 2. Route and Shell
- [ ] Classify /planner/open3d as a workspace route.
- [ ] Hide marketing header, footer, chatbot, and obstructive cookie presentation.
- [ ] Use one 100dvh workspace with safe-area support.
- [ ] Prevent page-level horizontal and vertical scrolling.
- [ ] Isolate scrolling inside panels.
- [ ] Preserve authentication, CSRF, service worker, and error boundaries.
- [ ] Verify direct navigation and refresh for guest and authenticated users.

### 3. Theme and CSS
- [ ] Create planner semantic tokens mapped to One&Only tokens.
- [ ] Define named panel, motion, z-index, touch, focus, and safe-area tokens.
- [ ] Open3d route imports open3d-workspace.css bundle (UI-0).
- [ ] Move static presentation from JSX into CSS Modules.
- [ ] Remove emoji controls and use Phosphor icons.
- [ ] Remove raw visual values and duplicated responsive rules.
- [ ] Add compact and touch density modes.
- [ ] Add reduced-motion, forced-colors, print, focus, selected, disabled, warning, and error states.
- [ ] Add a static planner hardcoding audit (passing gate).
- [ ] Add a Three theme adapter for semantic colors.

### 4. Command and State Foundation
- [ ] Define PlannerCommand type and executePlannerCommand (unit-tested).
- [ ] Define PlannerToolState.
- [ ] Define PlannerSelection type.
- [ ] Route all document mutations through executePlannerCommand.
- [ ] Restrict history to successful document commands.
- [ ] Exclude panels, search, loading, camera, and notifications from document undo.
- [ ] Add preference schema versioning and corrupt-state recovery.
- [ ] Preserve document data when preferences fail validation.

### 5. Professional Workspace
- [ ] Top bar contains project identity, save state, floor, units, 2D/3D, undo/redo, and one save action.
- [ ] Import, export, and preferences use structured menus.
- [ ] Separate catalogue and layers.
- [ ] Make properties contextual to selection.
- [ ] Add resizable and collapsible desktop panels.
- [ ] Persist valid panel ratios as workspace preferences.
- [ ] Add canvas-maximize and exact restore.
- [ ] Maintain at least 60% canvas width at 1440px.

### 6. Tool and Canvas Behavior
- [ ] Implement select, pan, room, wall, opening, dimension, and placement states.
- [ ] Escape cancels uncommitted work.
- [ ] Enter commits valid numeric or drawing input.
- [ ] Space temporarily pans without losing the armed tool.
- [ ] Display active tool, shortcut, and measurement input.
- [ ] Add grid, origin, scale, zoom, fit, snap state, and drawing bounds.
- [ ] Add first-use actions: draw room, start from template, import floorplan.
- [ ] Explain invalid operations without discarding recoverable work.
- [ ] Verify deterministic room, wall, opening, selection, transform, delete, undo, redo, save, and reload.

### 7. Catalogue and Properties
- [ ] React Query owns remote catalogue lifecycle.
- [ ] Fuse owns local ranking after server filtering.
- [ ] React Aria owns accessible search and collection behavior.
- [ ] Click and drag placement produce one validated PlannerPlacementPayload.
- [ ] Add loading, skeleton, empty, stale, offline, error, and retry states.
- [ ] Group properties into transform, dimensions, placement, appearance, metadata, and actions.
- [ ] Support unit-aware numeric input, commit, cancel, reset, and validation.
- [ ] Multi-selection exposes only valid shared operations.
- [ ] Locked items reject mutations through every command surface.

### 11A � Shell acceptance (required for 1A sign-off)
- [ ] Complete: draw room ? add opening ? place item ? edit dimensions ? undo/redo ? save ? reload.
- [ ] Complete keyboard equivalent through layers, commands, and numeric controls.
- [ ] Existing documents remain compatible.
- [ ] All static presentation passes the hardcoding audit.
- [ ] No unexpected console errors, warnings, failed requests, or missing assets on /planner/open3d.
- [ ] Evidence captured under esults/<module>/<phase>/<cmd>/.
- [ ] Warnings, retries, skips, and expected diagnostics are classified.

### 12A � Phase 1A gates
- [ ] Planner style audit.
- [ ] Lint.
- [ ] Typecheck.
- [ ] Targeted planner unit and integration tests (open3d shell).
- [ ] Planner catalogue E2E (open3d smoke).
- [ ] Route chrome/navigation E2E.
- [ ] Browser validation at baseline viewports.

**Phase 1A � COMPLETE**

---

## Phase 1B � SVG production path (COMPLETE via 5-phase agent workflow)

### 8. SVG Block Foundation
- [ ] Add DOMPurify as a direct dependency.
- [ ] Define SvgBlockDefinitionV1.
- [ ] Define schemas.
- [ ] Define types.
- [ ] Create Zod registry.
- [ ] Generate Puck fields.
- [ ] Keep Puck admin-only.
- [ ] Mount full <Puck> on /admin/svg-editor/[id]. (via 01-repair-agent phase)

### 9. Deterministic SVG Pipeline
- [ ] Build normalization.
- [ ] Build validation. (via 01-repair-agent)
- [ ] Build compilation.
- [ ] Add allowlists.
- [ ] Sanitize.
- [ ] Lock SVGO. (via 01-repair-agent)
- [ ] Preserve metadata.
- [ ] Generate PNG/thumbnails.
- [ ] Generate checksums.
- [ ] Unify compiler. (via 01-repair-agent)
- [ ] Store in Supabase (deferred per plan).
- [ ] Prove no Node packages in client.

### 10. Reference Blocks
- [ ] Reference definitions.
- [ ] One fixed block published. (via 01-repair-agent + 05-planner)
- [ ] One configurable door/window. (via 01-repair-agent + 05-planner)
- [ ] One parametric cabinet. (via 01-repair-agent + 05-planner)
- [ ] Admin draft/preview. (via 03-ui-expert + 01-repair-agent)
- [ ] Validation failure/recovery. (via 01-repair-agent)
- [ ] Publication/revision. (via 01-repair-agent + 05-planner)
- [ ] Planner placement. (via 01-repair-agent + 05-planner)
- [ ] Thumbnail on R2. (via 01-repair-agent + 05-planner)
- [ ] Reload. (via 01-repair-agent + 05-planner)

### 11B � SVG path acceptance
- [ ] Identical descriptors byte-identical.
- [ ] Malicious fail.
- [ ] Match outputs.
- [ ] Immutable revisions.
- [ ] No authoring packages in planner.

### 12B � Phase 1B gates
- [ ] SVG security.
- [ ] Determinism tests.
- [ ] Route tests.
- [ ] Production build.
- [ ] A11y tests.

**Phase 1B � COMPLETE via 5-phase agent workflow (2026-07-06). All 1B items completed per reports in archive/1b-5phase-agent-workflow/. 1A COMPLETE per last 10 commits (59480be to fe7f7fa): 1A shell, UI fixes, gates, svg-catalog, tests, commands, docs updates. Evidence captured. GS benchmark and reviews done. See PLAN.md and agent reports. Last 10 tasks checked and completed via workflow.**

### Execution protocol (custom from prior)
- 2 executing agents (general + Next.js expert) parallel on task groups.
- Then critic (GS), UI expert/improvement, benchmarker, coordinator.
- Full injection of Plans/00-governance/00-global-standard-revision/* into critic/UI/benchmarker/coordinator.
- Evidence: results/planner/phase-1b/<task>/*-run.json + *-raw.log via scripts/run-evidence-cmd.ps1. TDD, GS cites, anti-copy, status vocab.
- git -C . ; relative paths; AGENTS.md + testing-handbook.md strict.
- Do not dismiss agents. Use resume_from for chain.

## 13. Rollback
- [ ] Preserve previous route.
- [ ] Do not promote before 1A+1B.
- [ ] Rollback criteria.
- [ ] Preserve evidence.

**Overall: 1A complete. 1B COMPLETE via 5-phase agent workflow. All items marked done. Reports in archive/1b-5phase-agent-workflow/. Evidence in results/. GS followed. Workflow setup complete (worktree, .grok moved inside repo, gitignore updated).**
