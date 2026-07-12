# Toolbar / canvas tool rail notes

**Where:** `agents-work/` (tracked). **Not** `results/`. **Not** a Plans/P0x gate.

**Surface:** `CanvasToolRail.tsx` · `canvas-tool-rail.module.css` · map honesty in `canvasTool.ts` (unchanged tiers).

## Bar

- RAC + Phosphor only — no Lucide, no second toolbar.
- Ordinary professional tool chrome (Excel/Sheets class).
- Deferred tools stay honest: arm only, no fake geometry.

## Changes (this pass)

| Area | What |
|------|------|
| Cascade | Module rail owns look vs legacy `body.planner-workspace .pw-tool-rail` |
| Overflow | Vertical rail: `min-height: 0`, thin scrollbar, top-align (no center-clip) |
| Focus | Inset ring — parent `overflow:hidden` no longer clips outline |
| Density | `compact` / `touch` shell attrs + coarse pointer widths/targets |
| Mobile | Horizontal strip scroll + safe-area pad; shortcuts hidden |
| Deferred | Dashed face, light icon weight, muted meta: “arms only, no full geometry” |
| Live | Tooltip meta still “Live on Fabric canvas” |

## Tests

```text
pnpm --filter oando-site exec vitest run \
  tests/unit/features/planner/toolShortcutTruth.test.ts \
  tests/unit/features/planner/canvasToolRail.a11y.test.tsx \
  tests/unit/features/planner/canvasToolPaletteAuthority.test.ts \
  --reporter=json \
  --outputFile=../results/planner/world-standard-wave/09-shortcuts-chrome/vitest-unit.json
```

**Result (2026-07-12 Slice D):** 3 files · **23** tests passed (8 shortcut + 5 a11y + 10 palette/tiers).  
Detail: `agents-work/world-standard-wave/09-shortcuts-chrome/NOTES.md`

## Out of scope

Inventory · Properties · Fabric geometry · Plans cards · `results/` (dump only)
