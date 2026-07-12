# Canvas stage — height chain (post properties/toolbar)

**Scope:** sole host `planner-fabric-stage` + rail/stage chrome. Not inventory, not P05/P06.

## Problem

Fabric stage could still participate in a min-content feedback loop:

1. `flex: 1 1 auto` let canvas pixel size influence flex basis.
2. Locked CSS treated only `.open3d-canvas-embedded` as the stage slot; live Fabric host was testid-only and missed mobile flex rules.
3. Fabric’s `.canvas-container` (inline width/height) could sit outside a strict fill box.

Historical symptom: multi-viewport (2k+) stage height → tool `scrollIntoView` / wall hit targets off-screen.

## Fixed

| Layer | Change |
|-------|--------|
| `plannerFabricStage.module.css` | `flex: 1 1 0%`, `min-height: 0`, `overflow: hidden`; pin Fabric `.canvas-container` to `inset: 0` / 100% of host |
| `PlannerFabricStage.tsx` | Add `open3d-canvas-embedded` class (CSS bridge); resize prefers `.canvas` / `.open3d-canvas-with-rail` and still caps at `window.innerHeight` |
| `workspace-open3d-route-host.css` | `with-rail` is `position: relative` + `flex: 1 1 0%` + `overflow: hidden`; stage slot rules for embedded **and** `[data-testid="planner-fabric-stage"]`; first-use / guidance / placement hints absolute (no layout push) |
| `workspace.module.css` | `.canvas > *` and with-rail/stage selectors use `flex: 1 1 0%` + `overflow: hidden` |
| `PlannerHost.tsx` | Unchanged — still dual `planner-route-host open3d-route-host` |

## Height chain (law)

```
body.planner-workspace (h-dvh, overflow hidden)
  → #main-content:has(.open3d-route-host) (100dvh, min-height 0)
  → .open3d-route-host (height 100%, min-height 0, overflow hidden)
  → .shell[data-fill-parent] (100%, grid: auto / minmax(0,1fr) / auto)
  → .workspace (minmax(0,1fr), overflow hidden)
  → .canvas (min-height 0, overflow hidden, flex column)
  → .open3d-canvas-with-rail (flex 1 1 0%, overflow hidden, position relative)
  → [data-testid=planner-fabric-stage].open3d-canvas-embedded (flex 1 1 0%, overflow hidden)
  → Fabric .canvas-container (absolute fill) + setDimensions capped
```

Status pills live in shell footer (`grid-area: status`, auto row). Placement/first-use overlays are absolute over the stage — they do not grow the flex column.

## Pointer / wall path

Host capture-phase pointer handlers on the stage root are unchanged. No second toolbar. No inventory/properties thrash.

## Residual

- Browser proof not re-run in this pass; unit CSS has no dedicated height-chain test file. Optional: Playwright measure `planner-fabric-stage` `getBoundingClientRect().height` ≤ `window.innerHeight` and `≤ .canvas.clientHeight`.
- 3D path (`Lazy3DViewer` min-heights) not in scope; only 2D Fabric host.
- If a future Fabric upgrade drops `.canvas-container`, re-check module CSS `:global` hooks.

## Files touched

- `site/features/planner/canvas/plannerFabricStage.module.css`
- `site/features/planner/canvas/PlannerFabricStage.tsx`
- `site/app/css/core/locked/planner/workspace-open3d-route-host.css`
- `site/features/planner/editor/workspace.module.css`
- `agents-work/CANVAS-NOTES.md` (this file)
