# 01B Feasibility Slice: Native Open3D Spine

## Objective

Prove the smallest native Next.js Open3D path from `open3d-floorplan/` under `site/features/planner/open3d/` before expanding production behavior.

## Non-negotiable priorities and sequence

Treat these as co-dependent release dimensions: **workflow/data/auth integrity; drawing-tool/geometry correctness; UX/accessibility; UI/responsive layout; inventory architecture; recoverable dockable toolbars/panels; visual consistency/performance**. Every dimension is release-blocking. Build the feasibility slice directly in `site/features/planner/open3d/`; validate with `site/tests/unit/features/planner/open3d/`.

**Mandatory acceptance:** `QUALITY-GATES.md` applies to this phase.

**Governing decisions:** `IMPLEMENTATION-DECISIONS.md` applies to this phase.

## Inputs to read

- Phase 01A evidence.
- `open3d-floorplan/src/lib/models/types.ts`
- `open3d-floorplan/src/lib/stores/project.ts`
- `open3d-floorplan/src/lib/services/datastore.ts`
- `open3d-floorplan/src/lib/components/embedded/Open3dPlannerEditor.svelte`
- `site/features/planner/model/plannerDocument.ts`
- `site/features/planner/model/plannerEnvelope.ts`
- `site/features/planner/document/plannerDocumentBridge.ts`
- `site/features/planner/persistence/plannerImport.ts`
- `site/features/planner/persistence/offline or draft/local storage files as applicable`

## Scope

- Implement the native Open3D slice under `site/features/planner/open3d/`.
- Use `open3d-floorplan/` as source reference.
- Route swap to `/planner/guest/` and `/planner/canvas/` is Phase 07 (done); feasibility modules remain testable without Fabric iframe.
- Do not delete iframe/static embed or Fabric/r3f code.
- Consume the canonical theme from `site/app/css/`; do not establish a staging-only theme.
- No explicit `any`, ignore directives, skipped tests, or skipped coverage lines.
- Require at least the 90% hard floor and target 95% statements, branches, functions, and lines globally and per file for the Phase 01B converted scope.

## Checklist

- [x] `01B-MOD-01` Add `open3d-next-staging/src/model/` with minimal strict types for `Project`, `Floor`, `Wall`, `Door`, `Window`, `FurnitureItem`, and `BackgroundImage`.
- [x] `01B-MOD-02` Add Open3D scene envelope type for storing project data inside existing `PlannerDocument.sceneJson`.
- [x] `01B-UNIT-01` Define supported display units: millimetres (`mm`), centimetres (`cm`), metres (`m`), inches (`in`), and feet-and-inches (`ft-in`).
- [x] `01B-UNIT-02` Keep one canonical persisted geometry unit (`mm`) and add explicit conversions between canonical millimetres, Open3D centimetres, and every supported display unit.
- [x] `01B-UNIT-03` Add degree normalization, bounds conversion, precision/rounding rules, and feet-and-inches formatting/parsing.
- [x] `01B-FACT-01` Add `createOpen3dProject` and `createRectangularRoomProject` factories.
- [x] `01B-ACT-01` Add one pure state operation: `addWall` or `addFurniture`.
- [x] `01B-PERS-01` Add one guest-local repository proof that cannot call `/api/plans`.
- [x] `01B-EXP-01` Add JSON export/import proof for the minimal project.
- [x] `01B-ROUTE-01` Add a hidden component or internal-only mount path if needed, but keep default planner routes unchanged.
- [x] `01B-PROOF-01` Prove React canvas render/input viability, one migrated document, catalog asset loading, and absence of Svelte runtime dependency.
- [x] `01B-GO-01` Record go/no-go criteria for interaction latency, bundle impact, license compatibility, and unsafe donor behavior.
- [x] `01B-TEST-01` Add fixture files only in the correct test/fixture location selected by current repo conventions, not under `data/`.

## Exit gate

Evidence home: `results/planner/phase-01b/exit-gate/` (one artifact per item; cross-referenced from the HANDOVER execution list).

- [ ] `01B-EXIT-01` Empty project initializes.
- [ ] `01B-EXIT-02` One wall or furniture action mutates state through a pure action.
- [ ] `01B-EXIT-03` Guest-local save/load round-trips without protected API calls.
- [ ] `01B-EXIT-04` JSON export/import round-trips.
- [ ] `01B-EXIT-05` Changing display units does not change stored geometry or physical dimensions.
- [ ] `01B-EXIT-06` Current production routes and fallback iframe remain unchanged.

## Evidence required

- Source files touched.
- Targeted compile/type evidence if user permits checks.
- If checks are not permitted, manual code inspection evidence with skipped checks stated.
- Fixture names and expected outcomes.

## Phase governance

### Forbidden actions

- Do not implement final toolbar layout, inventory UI, or docking system.
- Do not implement 3D, onboarding, or production persistence UI.
- Do not replace production routes (`/planner/guest/`, `/planner/canvas/`).
- Do not delete iframe/static embed or Fabric/r3f code.
- Do not copy donor visual appearance (colors, icons, panel geometry).
- Do not establish a staging-only theme; consume canonical `site/app/css/`.
- Do not add explicit `any`, ignore directives, skipped tests, or coverage bypasses.
- Do not create a promotion manifest or move files to production.

### Phase entry checklist

- [x] Phase 01A baseline accepted.
- [x] Donor inventory complete.
- [x] Staging workspace (`open3d-next-staging/`) created.
- [x] Binding design brief created (`design/01b-feasibility-brief.md`).
- [x] Execution benchmarks reviewed (3 dated reports).

### Rollback criteria

- If React canvas latency exceeds 100ms p95, abort and reassess strategy.
- If coverage cannot reach 90% floor after Test Writer catch-up, abort and reassess.
- If typecheck fails with unresolvable errors, abort and document in FAILURESPLAN.
- If Svelte runtime dependency leaks into staging, abort and isolate.
- If bundle size exceeds 100KB for feasibility slice, reassess scope.

### Risk register

- **Risk:** Svelte store assumptions leak into React. **Impact:** high. **Mitigation:** strict TypeScript, no Svelte imports, pure actions. **Owner:** converter agents. **Status:** mitigated.
- **Risk:** Unit conversion creates silent dimensional corruption. **Impact:** high. **Mitigation:** centralized converters, canonical mm, fixture tests. **Owner:** converter agents. **Status:** mitigated.
- **Risk:** Hidden route becomes public contract. **Impact:** medium. **Mitigation:** no route changes in Phase 01B; Phase 07 controls pilot. **Owner:** Phase 07 agent. **Status:** open.

### Success metrics

- Typecheck passes: ✓ (direct staging check)
- Coverage ≥95% (statements, branches, functions, lines): pending — prior snapshot predates Drawing Workflow Architect changes; rerun per execution list item 4
- Bundle size <50KB for feasibility slice: pending measurement
- p95 pointer-to-visual latency <50ms: ✓ (8.7ms observed in declared sample)
- Zero explicit `any`: ✓
- Zero ignore directives: ✓
- Zero skipped tests: ✓

### Dependencies on external systems

- Donor source at `open3d-floorplan/` (read-only reference).
- Canonical site theme at `site/app/css/core/tokens/theme.css`.
- Vitest/V8 coverage toolchain.
- Testing Library for component tests.

### Performance budgets

- p95 pointer-to-visual feedback: ≤50ms (provisional; 8.7ms observed).
- Canvas initial render: <100ms.
- Bundle size for feasibility slice: <50KB.

### Security considerations

- Guest repository cannot call `/api/plans`.
- No API keys or secrets in staging code.
- No production routes modified.
- SVG sanitization not yet required (no SVG generation in 01B).

### Accessibility considerations

- Canvas has `tabIndex={0}` and token-based `:focus-visible`.
- Toolbar buttons are native controls.
- Accessibility audit identified gaps: W shortcut, keyboard geometry, snap feedback, live-region flooding, responsive tiers.
- Drawing Workflow Architect addressed W shortcut, command authority, and snap behavior.
- Full browser accessibility verification pending (execution list item 2).

### Decision log

- **2026-07-03:** Chose Vitest over Jest. **Reason:** repo already uses Vitest; consistency. **Owner:** test writer agent.
- **2026-07-03:** Selected mm as canonical unit. **Reason:** OOFPLWeb contract; donor uses cm. **Owner:** converter agents.
- **2026-07-03:** Endpoint snap uses nearest candidate with stable tie-breaking. **Reason:** deterministic, accessibility audit finding. **Owner:** Drawing Workflow Architect.
- **2026-07-03:** Command registry owns executable behavior. **Reason:** typed command authority pattern. **Owner:** Drawing Workflow Architect.

## Risks/blockers

- Open3D source uses Svelte stores and mutable state; copying it directly into React will leak framework assumptions.
- Open3D uses centimetres internally while OOFPLWeb persists millimetres; display-unit selection must never mutate canonical geometry.
- Hidden route or feature flag must not become a public contract accidentally.

