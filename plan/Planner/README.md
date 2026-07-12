# Planner track

**HEAD:** `7807198d` · **Host:** Fabric `planner-fabric-stage` · **Benchmark:** Planner 5D.

Phases are **independent files** — each is self-contained and executable in parallel by its own agent. `blocks-on` names the only real dependency.

- **UI bar:** [../UI-BAR.md](../UI-BAR.md) — required every phase close.
- **Checklist:** [CHECKLIST.md](./CHECKLIST.md). Phase files point here (no duplicated boxes).
- **Failures:** one for everything at the root — [../FAILURES.md](../FAILURES.md). Only real execution/proof red goes there, not backlog.
- **Proof:** a real live browser run gates each tick. Its screenshots/logs are stored under `results/` — that folder is a dump, never the authority.

## Phases
| File | Owns | Parallel? | Blocks on |
|------|------|-----------|-----------|
| [PHASE-01-svg-import.md](./PHASE-01-svg-import.md) | Fabric renders published SVG | yes | Admin symbol contract (fixture ok) |
| [PHASE-02-toolbar-truth.md](./PHASE-02-toolbar-truth.md) | No dead/lying controls | yes | — |
| [PHASE-03-inspector-units.md](./PHASE-03-inspector-units.md) | Selection inspector + mm/cm/m/in/ft-in | yes | — |
| [PHASE-04-snap-measure.md](./PHASE-04-snap-measure.md) | Snap, grid, measure with live M | yes | P02 + UI P01 |
| [PHASE-05-docking-responsive.md](./PHASE-05-docking-responsive.md) | Dock/float panels + height chain at breakpoints | yes | — |
| [PHASE-06-onboarding-feedback.md](./PHASE-06-onboarding-feedback.md) | Empty state + honest status | yes | — |
| [PHASE-07-buyer-workflow-a11y.md](./PHASE-07-buyer-workflow-a11y.md) | Journey + a11y + console/chrome standing proof | integration | consumes 01–06 |
| [PHASE-08-select-delete-undo.md](./PHASE-08-select-delete-undo.md) | Select, delete, undo on Fabric | yes | — |
| [PHASE-09-orbit-continuity.md](./PHASE-09-orbit-continuity.md) | 2D↔3D orbit continuity | yes | — |
| [PHASE-10-mesh-quality.md](./PHASE-10-mesh-quality.md) | Cabinet-v0 3D mesh quality | yes | — |
| [PHASE-11-theme-mount.md](./PHASE-11-theme-mount.md) | `PlannerThemeToggle` live | yes | P02 |
| [PHASE-12-handover-reproof.md](./PHASE-12-handover-reproof.md) | Layout gate, batch journey, handover pack | integration | P01–P11 · UI P01–P02 |

## Owner locks
- Fabric = sole 2D host; it **renders** SVG, never authors it.
- Published SVG (from Admin track) paints on the plan via `svgPlanSymbolCache.ts`; Block2D = fallback only.
- Proof = live browser run + screenshots. Units/typecheck alone never close a phase.

## Contract consumed (from Admin track)
Symbol SVG: `public/svg-catalog/{slug}.svg` + `BlockDescriptor`. Build PHASE-01 against a fixture; integrate at the seam — do **not** wait for Admin.
