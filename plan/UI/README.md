# UI track

**HEAD:** `7807198d` · **Host:** Fabric `planner-fabric-stage`.

Phases are **independent files**, executable in parallel by their own agent.

- **UI bar:** [../UI-BAR.md](../UI-BAR.md) — required every phase close.
- **Checklist:** [CHECKLIST.md](./CHECKLIST.md).
- **Failures:** root — [../FAILURES.md](../FAILURES.md).
- **Proof:** a live run gates each tick; `results/` is a dump.

## Phases
| File | Owns | Parallel? | Blocks on |
|------|------|-----------|-----------|
| [PHASE-01-annotations-m-t.md](./PHASE-01-annotations-m-t.md) | Dimension (M) + Text (T) tools go live | yes | — |
| [PHASE-02-onboarding-entry.md](./PHASE-02-onboarding-entry.md) | Public buyer entry + brief/room | yes | — |

**Chrome / height / console proof** is not a UI phase — it lives in **Planner P05** (layout at
breakpoints) and **Planner P07** (repeatable workspace proof).

## Why this track exists
Each phase ends in a **buyer-visible** delta, proven live — not read-only audits.

## Owner locks
- Fabric is the sole 2D host — no second canvas, no Excalidraw UI chrome (leaf math/render libs
  only).
- Proof = live browser run + screenshots. Read-only audits are not a phase closing.

## Relationship to Planner track
UI PHASE-01 (M/T tools) **owns** dimension (M) and text (T) promotion — Planner PHASE-04 inherits
and only verifies snap + measure together. UI PHASE-02 (onboarding) feeds Planner PHASE-06.
Execution order and contracts: [../README.md](../README.md).
