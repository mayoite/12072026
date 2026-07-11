# Planner Fabric browser proof

Date: 2026-07-11
Route: `http://localhost:3000/planner/guest/`

## Result

PASS after dev-server restart.

## Verified

- `data-testid="open3d-fabric-stage"` exists.
- Fabric creates two canvas layers at 716x603.
- Wall draw changes 4 walls / 4 objects to 5 walls / 5 objects.
- The new wall is selectable.
- Delete changes 5 walls to 4 walls.
- Undo restores 5 walls. Redo becomes available.
- Catalog placement adds one furniture item and one seat.
- Placement result: 6 objects, 5 walls, 1 furniture, 1 seat.

## Evidence

- Screenshot: `planner-fabric-journey.png`
- Trace: `planner-fabric-journey.trace`
- Network: `planner-fabric-journey.network`

## Caveat

The first browser session hit a stale CSS chunk while the dev process had exited. The server was restarted with `pnpm dev`; the complete journey then passed.
