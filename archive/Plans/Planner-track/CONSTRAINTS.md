# Planner constraints

## Product lock

| Area | Rule |
|------|------|
| Document | UUID v7 · millimetres · `lib/newEntityId` |
| 2D | Fabric `planner-fabric-stage` only |
| 3D | Three + orbit |
| Routes | `/planner/guest` · `/planner/canvas` |
| Code | `editor` · `canvas` · `3d` · `project` · `ui` |
| Toolbar | React Aria Components + Phosphor |
| Themes | Semantic tokens · light/dark · saved preference |
| SVG | Catalog publish only. Never plan-draw. |
| Storage | Local until a cloud save succeeds |

No second canvas. No archive proof. No fake cloud, price, save, or share labels.

## UI bar

Every UI card must prove:

- Public entry. No dev flags or seeded internal route.
- Desktop and 375×812 mobile layouts.
- Keyboard use. Visible focus. Correct names and errors.
- Empty, loading, error, and success states.
- No clipped canvas or hidden primary action.
- Toolbar and theme controls remain reachable at every target size.
- Light and dark themes cover chrome, Fabric, Three, native controls, and focus states.
- Honest storage, validation, price, and permission labels.
- No unexpected console, request, hydration, or accessibility errors.
- Screenshots and a targeted browser trace.

UI PASS requires a real browser run. Unit tests alone are not enough.
