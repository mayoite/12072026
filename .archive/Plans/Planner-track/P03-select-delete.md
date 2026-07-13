# P03 — Select, delete, undo

**Status:** PASS · **CP:** CP-03

## Outcome

A buyer selects one Fabric object, deletes it, and restores it without identity or pose drift.

## PASS gates

- Pointer selection resolves the correct entity ID.
- Delete removes the selected entity from document and canvas.
- Undo restores the same ID, position, rotation, and options.
- Selection state and visible count stay accurate.
- Unit and browser journeys pass on `planner-fabric-stage`.

**Evidence:** `results/planner/world-standard-wave/03-select-delete/`

**Next:** P04.
