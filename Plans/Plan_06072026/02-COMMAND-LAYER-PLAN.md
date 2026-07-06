# 02 — Command Layer Unification (P0, blocking)

Owner: ______________
Target exit date: ______________
Blocks: everything in 03-09 that touches planner document state

## Problem

`useWorkspaceCanvas` and other surfaces still call `dispatchOpen3dAction` directly instead of
routing through `executePlannerCommand`. Undo/redo, permissions, validation, and persistence are
only trustworthy if every document mutation goes through one command pipeline.

## Work items (in order)

1. Grep the full codebase for `dispatchOpen3dAction` call sites outside the command layer.
2. For each call site, replace with an equivalent `PlannerCommand` + `executePlannerCommand` call.
   Do not add a second parallel mutation path "temporarily" — convert in place.
3. Add `plannerCommandWiring.test.ts` as a red test first (TDD), asserting no direct dispatch
   call sites remain outside the command module.
4. Wire zundo history scope to only successful document commands; explicitly exclude panel,
   search, loading, camera, and notification state from undo.
5. Re-run the full 1A acceptance workflow manually: room -> opening -> place -> edit -> undo/redo
   -> save -> reload on /planner/open3d.
6. Capture evidence under results/site/phase-1a/command-wiring/.

## Exit criteria

- Zero direct `dispatchOpen3dAction` calls outside the command module (grep-verified, evidence attached).
- `plannerCommandWiring.test.ts` passes.
- Manual 1A workflow passes with no console errors on 1440x900 and 390x844.
- Evidence artifacts exist and are reviewed by someone other than the implementer.

## Do not do here

- Do not touch icon policy, SVG pipeline, or descriptor models in this pass. Keep this change surgical.
