# P11 — Project brief and room

**Status:** OPEN · **Depends:** P10

## Outcome

A first-time buyer creates and reloads an editable room from the public Planner entry.

## Build

Brief: project, client, location, seats, work mode, budget, units. Room: width, depth, doors, windows, columns, and keep-out zones. Start blank or from an owned template.

## UI gates

- One short wizard. Plain defaults. Inline correction.
- Full keyboard path. Visible focus. No mouse-only control.
- 375×812 and desktop layouts keep the main action visible.
- Guest says local draft. Member says cloud only after cloud save succeeds.

## PASS gates

- Public `/planner` → setup → live Fabric room. No dev flags.
- Brief, dimensions, openings, constraints, and IDs survive hard reload.
- Millimetres remain document authority under metric or imperial display.
- Browser proof covers keyboard setup, mobile, reload, and screenshots.

**Evidence:** `results/planner/product-wave/11-project-brief-room/`

**Next:** P12.
