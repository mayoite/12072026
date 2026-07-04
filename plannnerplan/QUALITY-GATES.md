# Mandatory Quality Gates

## Authority

Every phase in this plan must satisfy the applicable gates below. A checklist item is not complete without preserved evidence. **Skipped, blocked, flaky, warning-producing, or artifact-missing checks are not passes.**

Cross-phase decisions and status definitions come from `IMPLEMENTATION-DECISIONS.md`.

Design-affecting acceptance also requires the current benchmark and design brief defined by `DESIGN-BENCHMARK-PROTOCOL.md`.

## Non-negotiable release dimensions

Build and validate in dependency order:

1. Workflow integrity, data safety, and auth correctness
2. Drawing-tool and geometry correctness
3. UX and accessibility
4. UI structure and responsive layout
5. Inventory architecture and arrangement
6. Dockable, movable, and recoverable toolbars/panels
7. Visual outlook, consistency, and performance

Every dimension is release-blocking. Feature presence or visual quality cannot compensate for failure in another dimension.

## Gate applicability

| Phase | Required local acceptance | Deferred cumulative gates |
|---|---|---|
| 00 | Start controls, file roles, selected phase, predecessor/status review | All implementation/UI gates |
| 01A | Baseline facts, capability matrix, donor/license inventory, current-route evidence | All implementation/UI gates |
| 01B | Feasibility risks, minimal core tests, React input/render proof, go/no-go decision | Full UI, browser, route, export, inventory scale |
| 02 | Domain, migration, invariants, actions, history, corruption and round-trip tests | Final UI and route workflows |
| 03 | Catalog contracts, identity, variants, placement snapshots, auth boundaries | Final inventory UI |
| 03A | Inventory domain/index and SVG engine tests, scale/security/performance fixtures | Docking and final inventory visuals to Phase 05 |
| 04 | Repository/auth/claim/offline/conflict implementation tests | Full user-facing persistence acceptance after Phase 05 host |
| 05 | Workspace UI, docking, accessibility, visual, inventory UI, interaction and workflow gates | Advanced exports/3D/AI |
| 06 | Import/export/3D/AI gates applicable to implemented release slice | Unimplemented later release slices |
| 07 | Production-path, browser, route, feature-flag, fallback and rollback rehearsal | Soak/cleanup |
| 08 | Soak, adoption, compatibility, archive and explicit cleanup approval | None |
| 09 | Traceability, status truth, ownership, runbooks and residual-risk acceptance | None |

Deferred means **not passed**. Record destination phase and owner. Earlier phases may reach `Implemented`; release dependencies require the status defined in `IMPLEMENTATION-DECISIONS.md`.

## Required test layers

### Mandatory source-quality gate

- Theme and reusable visual tokens resolve from `site/app/css/`; no staging-only competing palette or token system.
- Zero explicit `any` in handwritten converted-planner code.
- Zero `@ts-ignore`, `@ts-nocheck`, ESLint-disable, coverage-ignore, skipped-test, only-test, or equivalent bypass in converted-planner code/tests.
- Coverage target is 95% for statements, branches, functions, and lines globally and per handwritten production file. The hard floor is 90% for every metric globally and per file; 90–94.99% passes the floor but must be reported as target-incomplete.
- Coverage applies to the converted handwritten scope; exclusions require the repository handbook classification, not an ad hoc planner exception.
- Missing console/report artifacts make coverage incomplete even when percentages are green.

### Unit and property tests

- Unit conversion, geometry, state actions, undo/redo, parsing, validation, identity, and SVG generation.
- Boundary, invalid, corrupt, empty, oversized, negative, precision, and future-version inputs.
- Deterministic IDs/time where snapshots or serialized output are asserted.
- Property-based or generated cases for conversion round-trips, geometry invariants, and serialization where practical.

### Integration and contract tests

- PlannerDocument, drafts, cloud persistence, catalog APIs, admin boundaries, AI adapters, exports, and asset fallbacks.
- Guest/member/admin authorization matrix.
- Save/load/import/export/version-migration round-trips.
- No guest request to protected plan APIs unless explicitly initiated by an authorized transition.

### UI interaction tests

- Mouse, touch/pointer, keyboard-only, drag/drop, context menu, selection, multi-selection, and cancellation flows.
- Dock, undock, move, resize, collapse, reopen, viewport clamp, layout persistence, and reset-layout.
- Inventory search, categories, filters, favorites, recent items, collections, preview, click-place, and drag-place.
- Undo/redo and autosave must observe every user-visible mutation.

### Drawing-tool tests

- Wall chain draw, close loop, cancel, endpoint drag, parallel move, split, join, duplicate, curved wall, and delete cascades.
- Door/window placement, wall snapping, movement along wall, type/size changes, overlap prevention, and orphan repair.
- Room detection for rectangle, L-shape, T-junction, adjacent shared-wall, complex multi-room, and imported geometry.
- Grid, angle, endpoint, guide, object, and wall snapping with defined priority and zoom-dependent tolerance.
- Selection precedence, marquee/multi-select, pointer capture/cancel, touch/pointer behavior, high-DPI coordinates, pan, zoom, and zoom-to-fit.
- Measurements, annotations, stairs, columns, background images, layers, locks, groups, and floor changes as their release slice enables them.
- Every drawing mutation uses the shared command/action/transaction/history/autosave path.

### Visual regression tests

- Approved screenshots for empty, simple, complex, loading, error, missing-asset, selected, dragging, modal, docked, floating, 2D, and 3D states.
- Desktop: 1440×900 and 1920×1080.
- Tablet: 1024×768.
- Small viewport: 390×844 where the workflow is supported.
- Light, dark, high-contrast, print/export, and reduced-motion states where applicable.
- Compare canvas visibility, clipping, overlap, hierarchy, spacing, contrast, density, and toolbar reachability.
- Compare against the accepted fresh-design brief, not donor pixel parity.

### Design benchmark gate

- Dated execution benchmark exists for the phase/slice and cites current direct sources.
- At least five relevant leading products were compared across the required dimensions.
- Observed facts and recommendations are separated.
- Primary-agent acceptance/rejection decisions are recorded.
- Binding design brief exists before implementation.
- Donor visual patterns retained in the design have explicit justification.

### Accessibility tests

- Keyboard reachability and visible focus for every command.
- Correct names, roles, states, relationships, and modal focus management.
- Escape behavior is consistent.
- No keyboard trap except intentional modal containment.
- WCAG AA contrast for text and essential controls.
- Automated accessibility scan plus manual keyboard workflow.

### Performance and stability tests

- Define measurements before testing; do not invent targets after results.
- Inventory test datasets: 100, 1,000, and 10,000 records.
- Record initial render, search response, filter response, placement response, and memory trend.
- Record canvas interaction responsiveness for empty, normal, and stress fixtures.
- Verify lazy 3D loading and no default-view 3D initialization.
- Repeated floor/view/panel switching must not leak subscriptions, canvases, renderers, or event listeners.

Provisional budgets, to be replaced only by a documented baseline decision:

- pointer-to-visual feedback during normal drag/pan: p95 ≤ 50 ms;
- inventory search/filter: p95 ≤ 100 ms at 1,000 records and ≤ 200 ms at 10,000;
- placement acknowledgement: p95 ≤ 100 ms;
- 3D code/renderer absent from default 2D load;
- no sustained heap growth after 20 repeated panel cycles or 10 2D/3D cycles.

Record hardware/browser tier, cold/warm state, fixture, sample count, p50/p95, and measurement window.

### SVG and export tests

- Golden fixtures for every symbol family, theme, rotation, scale, and fallback.
- Deterministic markup and stable viewBox.
- Physical-dimension agreement between definition, canvas, preview, and export.
- Sanitization tests for scripts, event handlers, external execution, malformed markup, and oversized payloads.
- JSON round-trip plus structural validation for SVG, PNG, PDF, and DXF outputs.
- Do not claim DWG support without a genuine verified writer.

### Browser and route tests

- Current supported Chromium path plus at least one secondary browser engine before route replacement.
- Public guest, unauthenticated protected, authenticated member, and admin navigation.
- Direct load, refresh, back/forward, deep link, expired session, offline/reconnect, and fallback activation.
- Route swap requires a tested rollback path.

## Security and resilience gates

- Import limits: MIME/type, bytes, image pixels, archive entries, decompressed bytes, nesting depth, and traversal rejection.
- SVG limits: scripts, event handlers, foreign/external execution, unsafe URLs, malformed depth, and oversized markup.
- Asset allowlist/CSP behavior for images, meshes, textures, and fonts.
- Authorization tests for every guest/member/admin read and mutation.
- AI payload schema, privacy/retention, prompt/data boundaries, confirmation, and rollback.
- Quota exhaustion, multi-tab edits, crash/reload recovery, partial network failure, stale cache/chunk failure, and corrupted workspace preferences.

## UI acceptance matrix

For each major screen or panel, evidence must cover:

- hidden, loading, empty, populated, selected, disabled, error, and recovery states;
- docked left/right/top/bottom where supported;
- floating, moved, resized, collapsed, reopened, and reset;
- viewport resize and persisted-layout restoration;
- long names, large counts, missing previews, slow assets, and unavailable APIs;
- canvas obstruction, stacking order, collision, and reachable close/reset controls.

## Workflow acceptance matrix

At minimum:

1. Start guest plan → draw room → place inventory → change units → save draft → reload.
2. Sign in/claim guest work → cloud save → portal reopen → continue editing.
3. Search/filter inventory → preview → click-place → drag-place → edit → duplicate → undo/redo.
4. Import reference image and RoomPlan independently.
5. Create 2D plan → inspect 3D → return to 2D without state loss.
6. Export JSON/SVG/PNG/PDF/DXF and verify expected structure/scale.
7. Missing/corrupt document and missing image/mesh/SVG recover without erasing current work.
8. Dock/move/resize panels → reload → restore layout → reset layout.

## Fixture matrix

- Empty project.
- Rectangle room.
- L-shaped room.
- Adjacent rooms with shared wall.
- Multi-room T-junction layout.
- Wall with multiple openings.
- Multi-floor project.
- Normal furnished project.
- Large inventory and stress project.
- Legacy Fabric scene.
- Native Open3D scene.
- Corrupt scene.
- Unknown future version.
- Missing image, mesh, texture, and SVG.
- Metric and imperial/display-unit variants.

## Evidence integrity

Follow `testing-handbook.md`. Preserve:

- exact command, working directory, revision, dirty state, operator, timestamps, duration, and exit code;
- raw stdout and stderr;
- structured results, screenshots, traces, videos, console, network failures, coverage, and performance artifacts;
- warnings, retries, skips, filters, timeouts, expected diagnostics, and environment limitations.

No filtering, suppression, reporter removal, forced click, hidden overlay, swallowed error, or deleted artifact may be used to obtain a pass.

## Phase exit rule

A phase exits only when:

- applicable automated gates pass;
- visual and interaction evidence is reviewed;
- no unexplained warning, browser error, failed request, skip, retry, or timeout remains;
- blockers and skipped checks are recorded in `Failures.md`;
- staging behavior is verified before code moves;
- moved production-path behavior is verified again;
- remaining risks have an owner and next action.
- applicable converted-planner coverage is at least the 90% hard floor across all four metrics globally and per file with no bypass; target status against 95% is reported separately.

If checks lack permission, code may be reported `Implemented, verification pending`; the phase is not accepted.
