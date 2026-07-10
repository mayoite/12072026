# P04 — Planner 3D and persistence truth

## Buyer problem

A client needs confidence that the plan they approved is the plan they see in 3D and after reopening it. A count-only demo is not enough if position, dimensions, identity, or save status changes.

## Outcome

The P03 plan has one document model. It renders coherently in 2D and 3D, supports orbit, saves locally with honest language, and reloads with the same entities and poses.

## Scope

1. Trace document → 2D stage → scene node → Three/R3F object mapping.
2. Prove position, dimensions, rotation, and entity ID survive 2D → 3D → 2D.
3. Prove orbit is enabled and browser console errors are treated as failures.
4. Prove save, hard reload, and restore using the same document identity.
5. Label persistence accurately. Local persistence must never claim cloud collaboration or member sync.

## Evidence

`results/10072026/P04-planner-3d-and-save/` contains:

- unit tests for identity and pose mapping;
- browser screenshots: 2D plan, 3D orbit view, restored 2D plan, hard-reload result;
- saved document snapshots before and after reload;
- console output with a hard assertion on relevant errors;
- a single run record with HEAD and worktree state.

## Acceptance

- The same IDs, dimensions, and poses appear before and after the view round trip.
- Browser proof and unit proof are from one recorded working state.
- The 3D system is legible as parts, not only stacked anonymous boxes.
- Save state is clear and survives hard reload.

## Non-goals

- Cloud multi-user sync.
- Photoreal material rendering.
- A second 2D engine.

## Handoff

P05 uses this stable document and rendering contract to generate system variants.
