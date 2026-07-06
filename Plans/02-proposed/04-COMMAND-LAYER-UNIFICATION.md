# 04 — Command Layer Unification

Status: P0.
Owner: __________
Exit date: __________
Depends on: 02
[PARALLEL-OK with 03]

## Goal

Make `executePlannerCommand` the only planner document mutation path.

## Why

Direct `dispatchOpen3dAction` use outside the command layer breaks trust in undo/redo, validation, permissions, and save/reload behavior.

## Tasks

1. Find every direct `dispatchOpen3dAction` call outside the command layer.
2. Convert each call site to `PlannerCommand` + `executePlannerCommand`.
3. Add `plannerCommandWiring.test.ts` first as a failing test.
4. Scope undo history to successful document commands only.
5. Exclude panel state, search state, loading state, camera state, and notifications from undo.
6. Re-run the manual acceptance flow on `/planner/open3d`:
   - draw room,
   - add opening,
   - place object,
   - edit properties,
   - undo/redo,
   - save,
   - reload.

## Exit criteria

- No direct document mutation path remains outside the command system.
- `plannerCommandWiring.test.ts` passes.
- Save/reload and undo/redo behave consistently.
