# PLANNER.md — one plan, 7 parallel streams

**HEAD:** `7807198d` · **Host:** Fabric `planner-fabric-stage` · **Benchmark:** Planner 5D (authoring + plan render class)
**Replaces:** BOARD + CHECKPOINTS + EXECUTE + START + CONSTRAINTS (their redundancy is the problem). Guardrails live inline per stream. Status table at bottom.

## Owner locks (2026-07-12)
1. **SVG authoring stays in the ADMIN module, on its own engine (SVG.js).** Do NOT move authoring to Fabric. The `svgPackageBoundaries` test that keeps admin(SVG.js) and planner(Fabric) separate stays enforced. One engine per module — this is correct, not a defect.
2. **Planner imports & renders the published SVG.** `svgPlanSymbolCache.ts` (S7) becomes the real plan-draw path; Block2D is fallback only. The old `SVG: catalog publish only, never plan-draw` rule is **dead** (owner override).
3. **The problem is quality, not the engine.** Published symbols must be crisp at plan zoom, correct mm footprint, layered (body/door/handle distinct), byte-diffable — not the current 300–480 byte flat stubs.

## Architecture (two modules, one engine each — by design)
```
ADMIN (SVG.js authoring) ──publish──▶ public/svg-catalog/{slug}.svg ──svgPlanSymbolCache──▶ PLANNER (Fabric render)
     Stream A (quality up)                   Stream B (gate)                     Stream C (import path)
```

## Parallelism
Streams **A–G touch different files** and run concurrently. No global "one card at a time." A stream blocks only on its own dependency, named per stream.

---

### Stream A — Admin SVG authoring quality (SVG.js, stays in admin)
**Engines:** `admin/svg-editor/SvgStudioCanvas.tsx` + `scene/svgJsEngineAdapter.ts` (SVG.js) → `publishDescriptorWithPipeline.ts` → `svgPipelineRunner.ts`. **Keep** the `svgPackageBoundaries` test green.
**Benchmark:** Planner 5D symbol editor — draw rect/circle/line/arc, layer, snap, name, publish.
**Buyer checklist:** author draws a desk on the SVG.js stage → live preview matches → Publish → bytes on disk match preview.
**Guardrail:** authoring stays SVG.js in the admin module; never import Fabric here; scene→blocks bridge stays the disk boundary.
**Blocks on:** nothing. Start now.

### Stream B — SVG quality gate
**Engines:** `svgPipelineRunner.ts`, `asset-engine/svg/compileSvgForPublish.ts`, `public/svg-catalog/`.
**Benchmark:** Planner 5D plan symbols — legible at 100% and 25% zoom, true mm scale.
**Checklist:** re-publish the 5 existing stubs through the admin authoring path; each is layered, scaled, and visually distinct; before/after byte + screenshot diff.
**Guardrail:** reject any symbol that renders as a flat box or wrong footprint.
**Blocks on:** A (needs richer authored geometry).

### Stream C — Planner SVG import/render (Fabric)
**Engines:** `project/catalog/svg/svgPlanSymbolCache.ts` (S7), `fabricBlock2D.ts` fallback, `placementAction.ts`.
**Checklist:** place a catalog item → published SVG paints on the Fabric plan → missing/failed SVG falls back to Block2D silently → scale/rotate/save/reload preserve it.
**Guardrail:** SVG is the primary paint; Block2D never claimed as the SVG; planner never imports SVG.js.
**Blocks on:** nothing (loader exists); render quality improves as B lands.

### Stream D — Toolbar truth
**Engines:** `editor/TopBar.tsx` (kill dead `onAction`, line ~437), `canvasTool.ts`, `CanvasToolRail.tsx`, `plannerUIStore.toggleGrid`.
**Checklist:** grid + snap toggles actually change the canvas and persist; deferred tools (room/dimension/text) either work or leave the primary rail; no control is a no-op.
**Blocks on:** nothing.

### Stream E — Inspector + units
**Engines:** `PropertiesPanel.tsx` → real node inspector, `project/model/units.ts` (`mm/cm/m/in/ft-in`).
**Checklist:** select entity → edit x/y/size/rotation in the active unit → canvas updates → undo restores; mm stays document authority under imperial display; empty/multi/locked states honest.
**Blocks on:** nothing.

### Stream F — Docking + responsive
**Engines:** `editor/useDockingSystem.ts` (`docked|floating|collapsed`, dock/undock/move/resize), `ui/MobileDrawerSheet.tsx`, `BottomSheet.tsx`.
**Checklist:** panels dock/float/collapse and persist; full journey works at 375×812 with canvas never clipped and primary action always reachable.
**Blocks on:** nothing.

### Stream G — Buyer workflow + a11y proof
**Engines:** live `/planner` + `/planner/guest` routes, `CommandPalette.tsx`.
**Checklist (the actual user story):** land → empty state → draw room → place SVG furniture → edit in inspector → switch 3D → save → export BOQ — keyboard-only, both themes, screenshots. Benchmark the flow against Planner 5D step count.
**Blocks on:** consumes A–F; runs continuously as they land (integration proof, not a final gate that freezes others).

---

## Status
| Stream | Owns | State | Blocks on |
|--------|------|-------|-----------|
| A | Admin SVG authoring quality (SVG.js) | OPEN | — |
| B | SVG quality gate | OPEN | A |
| C | Planner SVG import (Fabric) | PARTIAL (loader exists, unused) | — |
| D | Toolbar truth | OPEN (dead grid/snap) | — |
| E | Inspector + units | OPEN | — |
| F | Docking + responsive | PARTIAL (docking coded) | — |
| G | Buyer workflow + a11y | OPEN | A–F |

**Proof rule (only rule kept from old plan):** live browser run + screenshots. Units/typecheck alone never close a stream.
