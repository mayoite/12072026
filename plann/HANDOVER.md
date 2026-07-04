# Planner Overhaul Handover

Status: Phase 1 foundation in progress
Revision: Record before execution
Active phase: Phase 1
Active route: `/planner/open3d`
Rollback path: Existing Open3D route and explicit Fabric fallback routes

## Objective

Deliver the professional One&Only planner and the safe Lego-like SVG block system defined in `START.md`, using the two execution phases without changing engine ownership or document compatibility.

## Completed

- [x] Master architecture defined.
- [x] Global benchmark principles defined.
- [x] Package ownership defined.
- [x] CSS and no-hardcoding contract defined.
- [x] SVG security and publication model defined.
- [x] Phase 1 and Phase 2 checklists created.
- [x] Phase 1 route containment: `/planner/open3d` now uses workspace body and chrome rules.
- [x] Phase 1 semantic token foundation: shared planner surface, control, panel, motion, and z-index tokens.
- [x] Phase 1 responsive foundation: safe-area spacing, shared viewport thresholds, tokenized panel sizing, and reduced-motion timing.
- [x] Inventory fallback index initializes synchronously before asynchronous descriptor replacement.
- [x] Versioned workspace preference schema with safe corrupt-state recovery.
- [x] Explicit planner tool lifecycle and semantic panel contracts.

## Verified

- Commands: Focused Vitest route/workspace tests; TypeScript typecheck; live HTTP route request.
- Evidence: `results/site/planner-phase-1/route-shell-tests/`, `responsive-shell-tests-rerun/`, `workspace-preferences-tests/`, and corresponding `typecheck-*` directories.
- Viewports: 390x844 live containment check plus prior 1329x912 desktop baseline.
- Workflows: `/planner/open3d` returns HTTP 200, receives planner workspace classes, contains the planner workspace, and has no page-width overflow.

Focused tests and typecheck pass. Production build, accessibility gates, package installation, Supabase migration, and publication checks have not run for this phase.

## Package Decisions

Adopted:

- Existing Fabric and Three engine ownership.
- Puck and Zod for registered admin composition.
- Admin-only SVG.js with selection and resize plugins.
- DOMPurify before SVGO.
- Flatten.js and polygon-clipping for approved geometry.
- resvg and Sharp for server output.
- Supabase-backed immutable revision metadata and artifact references.

Deferred:

- Exact package versions until dependency and license review.
- Exact Supabase schema until Phase 1 interface review.

Rejected:

- Second canvas engine.
- Second page builder.
- Arbitrary scripts, CSS, URLs, executable formulas, or unrestricted SVG.
- SVG authoring packages in planner bundles.

## Open Risks

- SVG.js/Fabric overlap: owner Phase 1; blocked unless package boundaries prove admin-only isolation.
- Parametric constraint conflicts: owner Phase 2; publication must fail on ambiguity.
- SVGO structural changes: owner Phase 1; blocked unless locked plugins pass visual and structural tests.
- Native renderer limits: owner Phase 1; resvg and Sharp remain server-only with safety limits.
- Route promotion risk: owner Phase 2; guest/canvas remain unchanged until Open3D acceptance.

## Next Action

Define the command and selection contracts, then route the first document mutation through them.

## Handover Update Template

```md
Status:
Revision:
Active phase:
Active route:
Rollback path:

## Completed
- Checklist IDs only

## Verified
- Command:
- Evidence:
- Viewports:
- Workflows:

## Package Decisions
- Adopted:
- Deferred:
- Rejected:

## Open Risks
- Risk / owner / blocking condition

## Next Action
- One decision-free implementation item
```

## Preservation Statement

Fabric remains the 2D engine. Three/r3f/drei remain the 3D stack. Existing documents, package locks, repository governance, and rollback routes remain preserved until verified implementation explicitly changes their status.
