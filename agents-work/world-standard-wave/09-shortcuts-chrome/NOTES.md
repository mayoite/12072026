# P09 / W8 shortcuts & chrome — NOTES

**When:** 2026-07-12 (Slice D re-prove)  
**HEAD:** `0bc58eb5f5a90195c5bc888ee3c44b6ff8b7415d`  
**Host:** Fabric + RAC rail · Phosphor only · no Lucide · no second toolbar

## Require differently

| Tier | Tools | Bar |
|------|-------|-----|
| live | select · pan · wall · opening · placement · door · window | shortcut = label = handler |
| deferred | room · dimension · text | arm + honest guidance only; runtime → select |

## Authority (code read this pass)

| Piece | Source | Truth |
|-------|--------|-------|
| Shortcuts | `CANVAS_TOOL_SHORTCUTS` | V R W O M P D N T H — unique |
| Labels | `CANVAS_TOOL_LABELS` | Select Room Wall Opening Dimension Place Door Window Text Pan |
| Tiers | `CANVAS_TOOL_REQUIREMENT` | live vs deferred as above |
| Keyboard | `useWorkspaceKeyboard` | `TOOL_BY_SHORTCUT_KEY` inverted from map only |
| Palette | `PALETTE_TOOLS` → `buildPaletteCommands` | rail + door/window/text extras |
| Rail | `RAIL_NAV_TOOLS` + `RAIL_DRAW_TOOLS` | RAC ToggleButtonGroup; deferred names + `data-deferred` |
| Runtime | `runtimeToolFor` | opening→door; window→window; room/dim/text→select |
| Live geometry | `OOPlannerWorkspace` | wall→`addPlannerWall`; door/opening→`addPlannerDoor`; window→`addPlannerWindow` |

### Live id → key → handler

| id | key | label | Fabric path |
|----|-----|-------|-------------|
| select | V | Select | select |
| pan | H | Pan | pan |
| wall | W | Wall | wall → addPlannerWall |
| opening | O | Opening | door → addPlannerDoor |
| placement | P | Place | placement / catalog place |
| door | D | Door | door → addPlannerDoor |
| window | N | Window | window → addPlannerWindow |

### Deferred (arm only)

| id | key | label | Runtime |
|----|-----|-------|---------|
| room | R | Room | select (no corner-room geometry) |
| dimension | M | Dimension | select (not D — no Dimension→D rebind) |
| text | T | Text | select |

## Unit (fresh this session)

```text
pnpm --filter oando-site exec vitest run \
  tests/unit/features/planner/toolShortcutTruth.test.ts \
  tests/unit/features/planner/canvasToolRail.a11y.test.tsx \
  tests/unit/features/planner/canvasToolPaletteAuthority.test.ts \
  --reporter=json --outputFile=../results/planner/world-standard-wave/09-shortcuts-chrome/vitest-unit.json
```

| Pack | Result |
|------|--------|
| toolShortcutTruth | **8/8** green |
| canvasToolRail.a11y | **5/5** green |
| canvasToolPaletteAuthority | **10/10** green |
| **Total** | **23/23** green · success:true |

Dump: `results/planner/world-standard-wave/09-shortcuts-chrome/vitest-unit.json`  
(Law: dump only — PASS from this NOTES + live code, not by re-reading dump.)

## Browser (optional light)

**Not run** — no local dev server on `:3000` this session.  
Unit honesty is the W8 close bar. Optional residual: rail visible + deferred attrs on live host.

## Residual / law

- Do **not** claim deferred room-rectangle as W1.
- No Dimension→D rebind · no Lucide · no RAC drop · no second toolbar.
- Product code **unchanged** this pass — honesty already held.
