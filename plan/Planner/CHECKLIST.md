# Planner checklist

**Status:** OPEN  
**Code map:** `FEATURES.md`  
**Blockers:** `../../Failures.md`  
**Notes (not proof):** `../../agent-reports/PLANNER.md`

## Outcome

Office planning: room → place furniture → Review → branded BOQ → send to Oando.

## Rules

- Live code wins. Unit ≠ browser. `results/` ≠ PASS.
- Status: **OPEN** · **PARTIAL** · **PASS** · **FAIL**.
- Canvas dominant. Sketch-to-Plan stays; AI optional never required.
- Guest UUID isolation; owner-scoped cloud save.
- Disk SVG still live authority until cutover (`Failures.md`).

## Open now (important)

| Item | Status |
|------|--------|
| Browser commercial loop (place → BOQ → send) | OPEN |
| Brand / parametric SVG place on guest canvas | OPEN |
| Room outline / durable dims browser (PF-05/06) | OPEN |
| Catalog compare (PF-22) | FAIL / weak |
| Full browser matrix P16 | OPEN |
| Quote to Oando live CRM browser | PARTIAL |
| Branded PDF Chromium download | PARTIAL |
| 2D/3D parity browser | OPEN |

## Phases (P0–P17)

| Id | Work | Status |
|----|------|--------|
| P0 | Test isolation | PARTIAL |
| P1 | Entry / UUID / identity | PARTIAL (unit + some e2e; migrate OPEN) |
| P2 | Document / units / mm | PARTIAL |
| P3 | Workflow shell | PARTIAL |
| P4 | Draw room | OPEN / PARTIAL unit |
| P5 | Import / underlay / Sketch | PARTIAL |
| P6 | Place furniture | OPEN browser |
| P7 | 2D/3D parity | OPEN browser |
| P8 | Validation / review | PARTIAL |
| P9 | BOQ truth | PARTIAL |
| P10 | Send to Oando | PARTIAL |
| P11 | Export honesty | PARTIAL |
| P12 | AI (non-blocking) | PARTIAL |
| P13 | Persistence / conflict | PARTIAL |
| P14 | A11y | OPEN / PARTIAL |
| P15 | Perf / structure | OPEN |
| P16 | Browser matrix | OPEN |
| P17 | Final gates / docs | OPEN |

## Not this track

Admin SVG studio redesign · Site marketing · DB cutover ownership (Admin; Planner consumes).
