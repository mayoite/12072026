# P03 — Planner 2D buyer journey

## Buyer problem

A designer cannot trust a planner that only demos isolated buttons. They need to create a room, place a system, adjust it, select it, delete it, undo a mistake, and understand what is selected.

## Outcome

On the current live 2D stage, a user can make a small office layout with walls, an opening, and at least two placed items including the reference workstation or cabinet. Symbols are readable at normal working zoom.

## Scope

1. Prove the live 2D host from P00. Do not revive archived canvas code merely because old tests reference it.
2. Implement or repair wall and opening creation, catalog placement, selection, delete/backspace, undo, and clear selection.
3. Make the selection and tool chrome explain the current mode and selected entity.
4. Give the reference system a readable 2D representation. An empty filled rectangle fails this phase.
5. Add focused unit coverage for model actions and a serial browser journey for the complete interaction.

## Evidence

`results/10072026/P03-planner-2d/` contains:

- raw unit logs for geometry, placement, selection, deletion, and undo;
- browser screenshots: empty plan, walls/opening, placed system, selected system, deleted system, undone system;
- browser console and network logs;
- `run.json` with exact before/after entity counts and verified ref.

## Acceptance

- Browser proof shows a wall, an opening, and two placed items.
- The selected entity is clearly furniture, not an ambiguous canvas click.
- Delete removes exactly the selected item. Undo restores the same identity and pose.
- The normal-zoom 2D symbol shows useful structure. It is not a blank tile.

## Non-goals

- Full Fabric migration if P00 shows it is already complete.
- Multi-user editing.
- Photoreal rendering.

## Handoff

P04 starts from a saved P03 document and must preserve its entities exactly.
