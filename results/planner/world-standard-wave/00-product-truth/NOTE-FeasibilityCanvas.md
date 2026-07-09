# NOTE — FeasibilityCanvas (P01 deep read)

## 1. Props / handle API
`FeasibilityCanvasProps` + `FeasibilityCanvasHandle` (forwardRef). Tools, project data, selection callbacks, place handlers.

## 2. Tools implemented
Wall draw, select, pan/zoom transform, room/dimension variants as wired by workspace. See file for tool switch.

## 3. Furniture hit-testing / selection
Furniture pick on select tool; selection ring; integrates with workspace selection state.

## 4. What it does not do
Not Fabric full stage; not Three 3D; not cloud save; walls stay here even when Fabric furniture overlay ON.

## 5. Dependencies
Workspace store/model (`Open3dProject`), placement callbacks, keyboard via parent OOPlannerWorkspace.
