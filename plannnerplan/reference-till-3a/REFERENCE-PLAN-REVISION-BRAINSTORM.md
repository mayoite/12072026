# Reference: Plan Revision Brainstorm

Date reviewed: 2026-07-03

Status: advisory only. The primary agent retains final editorial control. This file proposes revisions; it does not replace or amend the phase plans.

## Overall assessment

The plan is strong on scope awareness, data-loss prevention, identity preservation, SVG determinism, fallback safety, and evidence integrity. Its largest weakness is executability: it treats the full final quality matrix as an exit condition for every phase, assigns finished UI behavior before the UI exists, and combines too many independent product systems into a single critical path. Without revision, agents could either remain permanently blocked or claim that broad gates are ΓÇ£not applicableΓÇ¥ without a consistent rule.

## Critical defects

### 1. The universal phase gate is circular

Every phase says `QUALITY-GATES.md` is mandatory, while that file requires complete UI, visual, browser, route, export, inventory, 3D, and workflow evidence. Phase 00 is documentation-only and Phase 01 is a hidden feasibility slice, so they cannot satisfy final-route, full-workflow, multi-browser, or full visual-state gates.

**Correction:** add a gate-applicability table by phase. Distinguish:

- entry criteria;
- phase-local exit criteria;
- cumulative release criteria;
- deferred gates with an explicit destination phase and owner.

Deferral should not mean ΓÇ£passed,ΓÇ¥ but an early phase should be able to exit when its own declared gates pass.

### 2. Test policy contradicts the exit rule

Several phases prohibit tests or browser checks without explicit permission, while `QUALITY-GATES.md` says a phase exits only when applicable automated gates pass and no skip remains. This makes completion impossible whenever permission is absent.

**Correction:** define two statuses: `implementation complete, verification pending` and `phase accepted`. The first may be reached with accurately recorded skips; only the second may satisfy release dependencies. State who can authorize each test class.

### 3. Phase 03A requires a UI system that Phase 05 has not built

Phase 03A requires dockable, movable, resizable inventory panels, keyboard behavior, tablet screenshots, and visual acceptance. Phase 05 later creates the workspace shell and docking framework. The dependency runs backward.

**Correction:** split 03A into:

- `03A Inventory domain, taxonomy, indexing, and SVG engine`;
- `05A Inventory UI integrated into the workspace`.

Keep panel docking and responsive visual acceptance in Phase 05.

### 4. Staging-to-production movement is underspecified and duplicated

Phases repeatedly say to build in `open3d-next-staging/`, move verified code into production, and verify again. They do not define whether staging is a package, a temporary copy, a worktree, or a source directory. Copying can create two divergent implementations, broken imports, and unverifiable revision claims.

**Correction:** define one source-of-truth strategy before Phase 01. Prefer a workspace package or production-compatible module path consumed by a hidden host, then promote by route/feature configuration rather than file copying. If copying is mandatory, define a manifest, checksum/diff gate, import-boundary rules, and archive point.

### 5. Migration safety is incomplete

The plan mentions versions, legacy conversion, corrupt input, and future versions, but not a migration registry, idempotency, backups, atomic save, rollback, partial conversion reporting, or repeated migration behavior.

**Correction:** add:

- immutable source document backup before conversion;
- explicit `fromVersion -> toVersion` migration registry;
- pure, idempotent migrations with fixture coverage;
- validate-before-commit and atomic replacement;
- conversion report listing preserved, transformed, approximated, and unsupported entities;
- stable IDs and referential-integrity checks;
- dual-read period before legacy write retirement;
- rollback/open-original action.

### 6. Persistence and layout ownership conflict

Phase 02 says state contracts must support persisted panel layout; Phase 04 says persistence must preserve editor layout; the benchmark recommends document-independent layout persistence. The plan never decides whether layout follows the user, browser, device, route, or plan.

**Correction:** separate:

- canonical document state;
- user workspace preferences;
- device/viewport-specific layout;
- transient session state.

Document saves should not normally carry panel coordinates. Version the layout schema separately and recover safely from invalid/off-screen layouts.

### 7. Scope is too large for one release train

The critical path includes a framework conversion, geometry editor, large catalog, SVG engine, auth/persistence, AI, five export formats, 3D, full docking, legacy migration, accessibility, responsive design, and cleanup. There is no minimum releasable capability or explicit cut line.

**Correction:** define release slices:

1. safe native core: one floor, walls/openings, furniture, JSON, guest local save;
2. member persistence and catalog;
3. production route pilot with fallback;
4. advanced entities and exports;
5. 3D and AI;
6. cleanup only after adoption evidence.

Advanced capability should not block a safe core pilot unless it is already present on the route being replaced and is contractually required.

### 8. Performance gates request measurement but not acceptance

The gates name datasets and metrics but provide no device tiers, fixture complexity, sampling method, percentile, warm/cold distinction, or pass threshold. ΓÇ£RecordΓÇ¥ is not measurable acceptance.

**Correction:** create a signed-off performance budget table before UI implementation. At minimum specify hardware/browser tier, dataset, cold/warm run, sample count, p50/p95, memory measurement window, and failure threshold. Reasonable provisional targets to validate against the current product include:

- pointer-to-visual feedback p95 at or below 50 ms during normal drag/pan;
- catalog search/filter p95 at or below 100 ms for 1,000 records and 200 ms for 10,000;
- placement acknowledgement at or below 100 ms;
- no sustained heap growth after repeated open/close or 2D/3D cycles;
- lazy 3D code and renderer absent from the default 2D load.

### 9. Product acceptance lacks ownership and decision records

ΓÇ£Visual evidence is acceptedΓÇ¥ appears repeatedly, but no approver, review rubric, baseline, or decision location is named. The priority order also says UI outranks workflow, which could permit a visually strong editor with a broken save path.

**Correction:** replace the ordinal priority list with non-negotiable release dimensions. Name product, design, engineering, accessibility, and data-safety approvers where available. No dimension should compensate for data loss, auth failure, inaccessible core workflows, or route breakage.

### 10. Cleanup timing is premature

Phase 08 follows route swap, but immediate technical proof is not enough to retire fallback code safely. There is no soak period, adoption metric, rollback drill, or open-document compatibility audit.

**Correction:** require a monitored pilot/soak window, fallback-use telemetry where permitted, representative legacy-document audit, rollback drill, and explicit user approval before retirement or deletion.

## Recommended structural changes

### A. Add a governing decision document

Create a short implementation decision record containing:

- source-of-truth and staging strategy;
- MVP/release cut line;
- document, preference, and session-state ownership;
- schema/version/migration policy;
- supported browsers and viewport capability tiers;
- performance budgets;
- feature-flag and rollback owner;
- acceptance owners.

This prevents the same unresolved decisions from being rediscovered in every phase.

### B. Rebuild the dependency graph

Recommended order:

1. Baseline, compatibility inventory, and measurable budgets.
2. Feasibility spike with explicit go/no-go criteria.
3. Canonical model, migration registry, actions, command registry, and repositories.
4. Catalog mapping, inventory query/index model, and deterministic SVG geometry.
5. Workspace shell, constrained docking grammar, accessible project tree, and canvas slices.
6. Guest/member persistence, claim flow, autosave/conflict/recovery UX.
7. Inventory UI and end-to-end placement.
8. Core import/export.
9. Optional 3D and AI adapters.
10. Route pilot, rollback drill, and production verification.
11. Soak, cleanup, and handover.

Persistence adapters should be designed before the UI, but their complete user workflows should be integrated and accepted after the workspace exists.

### C. Introduce traceability

Give every requirement a stable ID, for example `DOC-MIG-01`, `INV-SEARCH-04`, `UI-DOCK-03`, and `EXP-SVG-02`. Each phase should map:

`requirement -> implementation owner/path -> fixture/test -> artifact -> release gate`.

This will expose duplication and stop broad checklist items from being marked complete by a narrow test.

### D. Separate capability levels by viewport

Do not imply desktop-equivalent floating panels on every viewport. Define:

- desktop: full authoring and constrained docking;
- tablet: supported authoring subset with edge sheets;
- small viewport: view/review or deliberately limited editing, with an explicit capability statement.

Test only promised behavior, and show a clear explanation for unsupported operations.

### E. Define one command and mutation architecture

All toolbar, menu, context-menu, keyboard, command-palette, AI, import, and accessibility-tree actions should use:

- one typed command registry;
- one action dispatcher;
- one transaction/history boundary;
- one autosave observation path;
- one analytics/audit naming scheme where analytics are permitted.

This is the strongest way to make ΓÇ£every mutation is undoable and savedΓÇ¥ testable.

## Phase-specific corrections

### Phase 00

- Add a baseline capability matrix comparing iframe donor, current Fabric/r3f implementation, and intended native replacement.
- Record browser support, current performance, accessibility findings, document samples, dependency/license status, and production analytics only if permitted.
- Define Phase 01 go/no-go questions; baseline should not inherit final UI/export gates.
- Resolve whether replacing the iframe or the canonical Fabric/r3f surface is the actual user-visible objective.

### Phase 01

- Keep all feasibility code in one declared source-of-truth location; the checklist currently names production paths despite staging-only scope.
- Prove the highest-risk unknowns, not merely easy factories: canvas render/input viability in React, unit conversion, one migrated document, catalog asset loading, and no Svelte runtime dependency.
- Add explicit abort criteria for unacceptable bundle size, interaction latency, license incompatibility, or donor behavior that cannot be ported safely.
- Decide after the spike whether porting, wrapping, or reimplementing is the selected strategy.

### Phase 02

- Split canonical document state, view state, workspace preferences, and transient UI state.
- Specify referential invariants: wall/opening ownership, room derivation, floor ownership, group membership, deletion cascades, orphan repair, and stable IDs.
- Define transaction semantics for multi-object commands and drag coalescing.
- Add migration registry, conversion report, atomic replacement, backup, and rollback.
- Clarify whether rooms are persisted entities, derived geometry, or both, and how divergence is repaired.
- Define collaboration/conflict assumptions even if real-time collaboration is deferred.

### Phase 03

- Add pagination/cursor, cache invalidation, stale-data behavior, rate/error handling, and asset URL expiry rules.
- Specify variant identity separately from product identity and placed configuration.
- Define immutable placement snapshots so later catalog edits do not silently alter existing plans.
- Define deleted/unavailable/discontinued product behavior for BOQ, quote, and reopen.
- Verify content security and allowed origins for images/meshes.

### Phase 03A

- Move docking and final inventory visuals to Phase 05/05A.
- Specify index build/update strategy, worker usage if needed, deterministic ranking, typo tolerance, zero-result recovery, and stable tie-breaking.
- Add saved configuration to favorites/recents, compatibility filters, and replace-selected behavior.
- Define virtualized-grid focus retention and screen-reader behavior; naive virtualization can make keyboard navigation inaccessible.
- Keep SVG geometry semantic and independent from product imagery.
- Define numeric tolerances for physical-scale agreement, sanitization size/depth limits, cache invalidation, font handling, and canonical serialization.
- Avoid promising one renderer for every surface if canvas performance requires a different representation; require shared geometry semantics and conformance tests instead.

### Phase 04

- Move full persistence workflow acceptance after a minimal UI host exists.
- Define autosave debounce, retry/backoff, unload behavior, offline queue, idempotency key, optimistic concurrency token, and conflict resolution.
- Specify guest storage quotas, quota-exceeded handling, recovery export, multi-tab behavior, and storage eviction messaging.
- Define claim semantics: copy or move, guest backup retention, duplicate detection, and failure rollback.
- Decide background-image ownership before cloud-save implementation; it cannot remain an open checklist decision at exit.

### Phase 05

- Split the canvas port into independently releasable vertical slices; the current checklist is effectively an entire CAD product.
- Define constrained docking zones, minimum canvas size, presets, snap thresholds, z-order, focus restoration, safe-mode reset, and responsive behavior.
- Add a typed command registry and accessible project tree/list.
- Specify canvas coordinate transforms, pointer capture/cancel behavior, selection precedence, snap priority, tolerance by zoom, and high-DPI behavior.
- Add first-run choices, contextual empty states, a replayable tour, and a sample plan without blocking experts.
- Define localization behavior for measurement parsing/formatting, not just translated strings.
- Add error boundaries and recoverable UI states for canvas, panels, and asset loading.

### Phase 06

- Split core interchange from optional integrations: JSON/SVG first, then PNG/PDF/DXF, then 3D, then AI.
- Define an export job model: preflight, settings, provenance, progress, cancellation, retry, staleness, preview, multi-floor packaging, and history/retention.
- Define exact supported DXF entities/version and publish a loss report; do not call structural validation a round-trip if no importer exists.
- Add file type, MIME, decompression-bomb, archive traversal, dimension, pixel-count, and payload limits to imports.
- Define 2D/3D `ViewState`: floor, selection, visibility, independent cameras, loading/cancel/retry, missing-model fallback, and edit permissions.
- Treat AI output as untrusted proposals: schema validate, preview diff, confirm, transactionally apply, undo, and record units/model limitations.
- Add privacy/retention rules for uploaded plan data sent to AI services.

### Phase 07

- Use a server/client-safe feature flag with explicit cohort, owner, expiry, telemetry, and kill switch.
- Define fallback behavior for documents created or upgraded by the native editor; the old editor may not be able to reopen them.
- Add pre-swap rollback rehearsal, not only rollback-path existence.
- Test CSP, chunk failures, stale service-worker/cache behavior, deep links, and expired sessions.
- Separate technical route proof from pilot acceptance and broad rollout.

### Phase 08

- Add a soak/adoption gate and fallback-use review before retirement.
- Produce a compatibility report for representative old documents and new documents opened through fallback.
- Archive with provenance, license, revision, and restore instructions.
- Require user approval for deletion, as already stated, and avoid treating cleanup as required for route success.

### Phase 09

- Add an architecture decision log, schema/version table, feature-flag state, rollback runbook, operational dashboards/alerts, and ownership with dates.
- Report requirement IDs that remain partial or deferred.
- Include known data-loss boundaries and compatibility limits prominently, not only in a generic risk register.
- Distinguish ΓÇ£implemented,ΓÇ¥ ΓÇ£verified in staging,ΓÇ¥ ΓÇ£verified in production path,ΓÇ¥ ΓÇ£piloted,ΓÇ¥ and ΓÇ£accepted.ΓÇ¥

### QUALITY-GATES.md

- Add a phase-applicability matrix and cumulative release gate.
- Replace undefined words such as ΓÇ£normal,ΓÇ¥ ΓÇ£stress,ΓÇ¥ ΓÇ£usable,ΓÇ¥ ΓÇ£where applicable,ΓÇ¥ and ΓÇ£enoughΓÇ¥ with fixtures, thresholds, or named decisions.
- Add explicit test-oracle tolerances for geometry, SVG scale, image diffs, memory growth, and timing.
- State supported browser versions/engines and accessibility standard/version.
- Add security gates for imports, SVG, asset URLs, AI payloads, and authorization.
- Add resilience gates for quota exhaustion, multi-tab edits, crash/reload recovery, partial network failure, and corrupted layout preferences.
- Permit documented flaky/blocked results to stop acceptance without making earlier implementation status unknowable.

## Ideas to reject or defer

- **Defer arbitrary free-floating desktop-window behavior.** Constrained docking provides most value with lower accessibility and recovery cost.
- **Defer split 2D/3D view.** Prove single-view state continuity and memory recovery first.
- **Defer shortcut remapping.** Build a shared command registry and collision-free defaults first.
- **Defer product comparison and storefront-like behavior.** Search, variants, replacement, and placement are core.
- **Defer named versions beyond bounded recovery checkpoints** until save/conflict behavior is trustworthy.
- **Defer advanced AI generation.** AI must not sit on the critical path for manual planning.
- **Reject a fake DWG option or DXF relabel.**
- **Reject copying every donor asset into git.** Preserve R2/DB ownership and license provenance.
- **Reject one giant canvas rewrite milestone.** Use vertical slices with fixtures and rollback.
- **Reject pixel-identical donor imitation as the definition of parity.** Preserve validated workflows and contracts while meeting OOFPLWeb accessibility, CSS, and product requirements.
- **Reject automatic legacy overwrite on open.** Migration requires backup, report, validation, and explicit commit.
- **Reject cleanup immediately after route swap.** Require pilot and soak evidence.

## Prioritized revision list

### P0 ΓÇö revise before implementation

1. Add the phase-applicability and cumulative release-gate matrix.
2. Resolve the test-permission versus phase-exit contradiction.
3. Define the MVP/release slices and explicit defer list.
4. Define staging/source-of-truth promotion mechanics.
5. Separate document, view, preference, and transient state.
6. Add the migration/backup/rollback policy.
7. Move inventory docking/UI acceptance from 03A to Phase 05/05A.
8. Define measurable performance, browser, accessibility, geometry, and visual thresholds.
9. Define feature-flag, pilot, rollback, and fallback document compatibility.
10. Decide cloud background-image ownership and guest-to-member claim semantics.

### P1 ΓÇö revise before broad UI work

11. Add the typed command registry and unified mutation/transaction path.
12. Specify constrained responsive docking and viewport capability tiers.
13. Add accessible project tree and virtualized-inventory focus behavior.
14. Add catalog ranking, variants, placement snapshots, and unavailable-product policy.
15. Add onboarding, empty states, and save/recovery/conflict vocabulary.
16. Add import security limits and SVG numeric/sanitization tolerances.
17. Specify 2D/3D `ViewState` and export-job lifecycle.

### P2 ΓÇö revise before route rollout

18. Add pilot cohorts, telemetry boundaries, kill switch, and rollout owner.
19. Add rollback rehearsal and representative legacy-document audit.
20. Add soak/adoption criteria before cleanup.
21. Expand handover with operational ownership, decision records, and status taxonomy.

## Suggested definition of a credible first release

A credible first release does not need every planned feature. It should let a guest and member safely create or open a supported one-floor plan, draw/edit walls and openings, place identified catalog furniture, use accessible core commands, save and recover without data loss, export/import deterministic JSON and SVG, and return through the production routes with a tested rollback. PDF/DXF, multi-floor depth, 3D, AI, arbitrary panel movement, and cleanup can follow as explicitly owned increments.
