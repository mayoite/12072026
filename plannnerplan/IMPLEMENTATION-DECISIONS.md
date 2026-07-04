# Implementation Decisions And Release Slices

## Status

This file resolves cross-phase decisions. Phase plans and `QUALITY-GATES.md` must not contradict it.

## Non-negotiable release dimensions

Build and validate in dependency order: **1. workflow integrity, data safety, and auth correctness; 2. drawing-tool and geometry correctness; 3. UX and accessibility; 4. UI structure and responsive layout; 5. inventory architecture and arrangement; 6. dockable, movable, and recoverable toolbars/panels; 7. visual outlook, consistency, and performance.** Every dimension is release-blocking. Strength in one cannot compensate for failure in another.

## Fresh design decision

- The donor is a functional reference, not a visual baseline.
- The React planner receives a fresh information architecture, interaction model, layout system, and visual language.
- `DESIGN-BENCHMARK-PROTOCOL.md` is mandatory before every design-affecting phase or slice.
- A dedicated benchmark agent supplies current advisory research; the primary agent retains final editorial and implementation authority.
- Accepted design decisions must be made binding before code is written.

## Theme, type-safety, and coverage constraints

- The planner theme comes from canonical `site/app/css/`, especially `site/app/css/core/tokens/theme.css` and planner bundles. Staging may bridge those variables; it must not create a competing theme system.
- Handwritten conversion code uses no explicit `any`.
- Do not use TypeScript, ESLint, test, or coverage ignore comments/directives to hide lines or failures.
- Do not skip tests, branches, files, or executable lines from converted-planner coverage to reach a target.
- Converted-planner coverage target is 95% for statements, branches, functions, and lines globally and per handwritten production file. The hard acceptance floor is 90% for every metric globally and per file; results between 90% and 95% require an explicit gap list and remain target-incomplete.
- Generated, vendored, build, cache, and artifact output remains outside handwritten-source coverage as defined by `testing-handbook.md`.

## Source of truth and promotion

- `open3d-floorplan/` is the immutable donor/reference except for deliberate donor refreshes.
- **`site/features/planner/open3d/` is the production source of truth.** All new planner implementation, fixes, and acceptance gates run against site paths and the site dependency tree (`pnpm --filter oando-site`).
- **`site/tests/unit/features/planner/open3d/`** holds the converted-planner unit/integration tests (migrated from `OOPlanner/tests/`). Co-located `*.test.*` files must not live under `features/planner/open3d/`.
- **Live routes** under `site/app/planner/` (2026-07-04 — Fabric restored for deploy):
  - `/planner/guest`, `/planner/canvas` → Fabric `PlannerWorkspaceRoute` (deployable production)
  - `/planner/open3d` → native `Open3dPlannerHost` (pilot; not deploy-ready)
  - `/planner/fabric/guest`, `/planner/fabric/canvas` → Fabric mirror (rollback drill)
- `OOPlanner/` and `open3d-next-staging/` are **archive mirrors only** for local parity and donor conversion history. They are not imported by live routes and must not receive independent feature edits ahead of site.
- Promotion manifest (when required) lists source path, destination path, SHA-256, donor revision/hash, site revision/hash, and approval evidence.
- After copying, destination hashes must match the manifest and production-path checks must rerun from `site/`.
- Fixes are made in `site/features/planner/open3d/` first; mirrors may be synced for reference but must not diverge as a second implementation.
- Archive `OOPlanner/` and `open3d-next-staging/` only after production acceptance and soak; preserve manifest and restore instructions.

## State ownership

- **Canonical document:** geometry, floors, openings, placed items, product/configuration snapshots, annotations, units, and document metadata.
- **View state:** active floor, selection, visibility, 2D camera, 3D camera, and current view mode. Persist only where explicitly specified.
- **Workspace preferences:** panel docking/layout, density, theme, inventory filters, and layout presets. User/browser/device scoped, separately versioned, never stored as canonical plan geometry.
- **Transient session state:** pointer gestures, open menus, drag previews, pending commands, progress, and ephemeral errors. Never persisted.

Invalid or off-screen workspace preferences must recover to a safe default without changing the document.

## Migration policy

- Never overwrite an original document merely by opening it.
- Keep an immutable source backup before conversion.
- Use a registry of pure `fromVersion -> toVersion` migrations.
- Migrations must be deterministic, idempotent, fixture-tested, and validate referential integrity.
- Produce a conversion report: preserved, transformed, approximated, unsupported, and failed entities.
- Commit converted data atomically only after validation.
- Provide open-original/rollback while dual-read support remains.
- Retire legacy writes only after representative-document audit and pilot evidence.

## Release slices

### R1 Safe native core

One floor; walls and openings; identified furniture placement; canonical units; undo/redo; deterministic JSON/SVG; guest local save/recovery; accessible core commands; hidden route only.

### R2 Member and catalog

Member persistence, guest claim, conflict/recovery UX, managed catalog identity, inventory search/index, placement snapshots, and missing-asset fallbacks.

### R3 Production pilot

Verified workspace UI, constrained docking, inventory UI, core workflows, feature-flagged route cohort, fallback, rollback rehearsal, and production-path verification.

### R4 Advanced planning and exports

Advanced entities, multi-floor depth, PNG/PDF/DXF, RoomPlan, export jobs, and expanded responsive authoring.

### R5 3D and AI

Lazy 3D with explicit ViewState and safe fallbacks; AI as schema-validated, previewed, confirmable, undoable proposals. Neither blocks R1–R3 unless route parity evidence proves it contractually required.

### R6 Soak and cleanup

Monitored pilot, adoption/fallback review, representative legacy audit, rollback drill, explicit user approval, archive, then cleanup.

## Viewport capability tiers

- **Desktop (≥1280 CSS px):** full authoring, constrained docking, optional floating utility panels.
- **Tablet (768–1279 CSS px):** supported authoring with one active edge sheet and compact command bar.
- **Small (<768 CSS px):** review and deliberately limited editing until a specific authoring workflow is accepted; use sheets, not miniature floating windows.

## Command and mutation architecture

All toolbar, menu, context-menu, keyboard, command-palette, inventory, import, AI, and accessible-tree operations use:

- one typed command registry;
- one action dispatcher;
- one transaction/history boundary;
- one autosave observation path;
- stable command IDs and localized labels;
- explicit enabled/disabled reasons.

## Acceptance statuses

- **Planned:** requirement exists only in plan.
- **Implemented:** code exists; required verification may be pending.
- **Verified in staging:** applicable staging gates passed.
- **Promoted:** manifest-verified copy exists in production paths.
- **Verified in production path:** applicable production-path gates passed.
- **Piloted:** cohort evidence and rollback drill passed.
- **Accepted:** named release gate approved.
- **Deferred/blocked:** not passed; owner and destination phase required.

Lack of permission to run a check can allow `Implemented`, never `Verified` or `Accepted`.

## Requirement traceability

Every checklist item in every numbered phase file carries a stable ID in the form `<phase>-<category>-<nn>` (e.g., `01B-MOD-01`, `02-ACT-03`, `05-DOCK-02`). Each item maps to:

- implementation owner/path;
- fixture or test name;
- evidence artifact path;
- release gate.

This prevents broad checklist items from being marked complete by narrow tests and enables audit of what passed, what was skipped, and what remains.

## Minimum-necessary-changes policy

Every phase must:

- solve only the stated problem for that phase;
- not refactor, rename, or restructure unrelated code;
- not add features beyond the checklist;
- archive over delete unless deletion is explicitly requested;
- record any scope expansion in `FAILURESPLAN.md` before proceeding.

Scope creep in one phase creates verification debt for all dependent phases.

## Phase-completion template

Before any phase claims exit, the agent must fill this template and attach it to the phase evidence:

1. **What ran:** exact commands, working directory, revision, exit codes, stdout/stderr paths.
2. **What passed:** specific checklist items with evidence references.
3. **What was skipped:** items not run, with reason and owner.
4. **What is blocked:** items that cannot run, with blocker and destination phase.
5. **What is risky:** known limitations, untested paths, or deferred verification.
6. **Evidence location:** absolute path to all artifacts.

A phase without a completed template is not exited.

## Go/no-go decision points

Every phase declares explicit entry criteria that must be satisfied before work begins. If entry criteria are not met, the phase must not start. Entry criteria for each phase:

- **01A:** Governing documents read; repo docs read; donor source location confirmed.
- **01B:** Phase 01A baseline accepted; donor inventory complete; staging workspace created.
- **02:** Phase 01B exit gate passed or explicitly documented as deferred.
- **03:** Phase 02 domain model and actions verified in staging.
- **03A:** Phase 03 catalog identity and mapping verified.
- **04:** Phase 03A inventory domain and SVG engine verified.
- **05:** Phase 04 repository and auth contracts verified; design benchmark complete.
- **06:** Phase 05 workspace UI and canvas port verified.
- **07:** Phases 01–06 exit gates passed; promotion manifest created.
- **08:** Phase 07 route swap verified; pilot soak evidence collected.
- **09:** Phase 08 cleanup verified; archive complete.

Each phase must record its entry-criteria status in its evidence file before implementation begins.

## Phase governance template

Every numbered phase file must include these sections to ensure consistent risk management and governance:

### 1. Forbidden actions

Explicit list of what must NOT be done in this phase. Prevents scope creep and makes the minimum-changes policy concrete. Examples: "do not implement final toolbar layout", "do not replace production routes", "do not delete fallback code".

### 2. Phase entry checklist

Before starting implementation, verify:
- Entry criteria satisfied (see go/no-go decision points above)
- Predecessor evidence reviewed and accepted
- Staging workspace ready and isolated
- No conflicting agent work in progress
- Required inputs read

### 3. Rollback criteria

Explicit abort thresholds. When to stop and reassess strategy rather than continue. Examples: "if React canvas latency exceeds 100ms p95, abort", "if coverage cannot reach 90% floor, abort", "if typecheck fails with unresolvable errors, abort".

### 4. Risk register

Top 3 risks with mitigation strategies. Format:
- **Risk:** description
- **Impact:** high/medium/low
- **Mitigation:** how to prevent or reduce
- **Owner:** who is responsible

### 5. Success metrics

Measurable outcomes beyond binary checklist completion. Examples: "typecheck passes in <30s", "bundle size <50KB", "coverage ≥95%", "p95 latency <50ms".

### 6. Dependencies on external systems

Explicit list of external APIs, routes, packages, or contracts this phase depends on. Makes blockers visible early. Examples: "depends on `/api/plans` contract stability", "depends on existing AI API availability".

### 7. Performance budgets

Provisional or final performance targets for this phase. Tied to QUALITY-GATES.md provisional budgets but phase-specific. Examples: "canvas render <16ms", "inventory search <100ms at 1K records".

### 8. Security considerations

Phase-specific security requirements. Examples: "guest cannot call protected APIs", "no client-side API keys", "SVG sanitization required", "auth boundaries enforced".

### 9. Accessibility considerations

Phase-specific accessibility requirements beyond quality gates. Examples: "all commands keyboard-accessible", "focus order verified", "WCAG AA contrast", "screen-reader announcements restrained".

### 10. Decision log

Track key architectural choices made during implementation. Format:
- **Date:** YYYY-MM-DD
- **Decision:** what was chosen
- **Reason:** why
- **Alternatives considered:** what else was evaluated
- **Owner:** who decided

This prevents re-litigation and aids handover.

## Decisions still requiring explicit owner approval

- Supported browser versions and secondary engine.
- Final performance budgets after baseline measurement.
- Background-image storage ownership and size limits.
- Guest-claim copy/move semantics and backup retention.
- Pilot cohort, telemetry boundaries, kill-switch owner, and soak duration.
