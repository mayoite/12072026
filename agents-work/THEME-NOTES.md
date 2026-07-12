# Theme notes (agent work — not a Plans card / not a gate)

**Where:** `agents-work/` (tracked). **Not** `results/` (gitignored dump only).

## Bar

- **Ours:** tools, React Aria rail, Phosphor, Fabric 2D host, mm document — our implementation.
- **Look & feel:** ordinary professional tool chrome (panels, rail, main surface, status) — Excel/Sheets/diagram-app class. General practice, not special snowflake, not competitor brand.
- **Seeing other software is normal.** Stealing assets/code/brand is not. No need to re-sermon that.
- **Layout first:** one library scrollport, viewport-bound panels, no canvas host blowout.

## Overflow (theme = layout)

| Fix | File |
|-----|------|
| Side panels fill height, no stretch past viewport | `site/features/planner/editor/workspace.module.css` |
| `.panelContent` clips; child owns one scroll | same |
| Categories not a second vertical scroller | `site/features/planner/editor/inventory.module.css` |
| Results grid sole vertical scroll | same |
| Shell/workspace `minmax(0,1fr)` | `workspace.module.css` |
| Host class chain for route height | planner route host dual class (Chrome W1 seat) |

## Out of scope here

Plans/P0x gates · W-proof · copy renames as “theme” · results/ dumps.
