# P14 — Validation and clearances

**Status:** OPEN — blocked by P13 · **Depends:** P13

## Outcome

A buyer finds and fixes layout issues before export or quote.

## Build

Overlap, wall, opening, boundary, aisle, chair, and accessibility rules. One saved validation authority serves UI, export, and quote.

## UI gates

- Summary shows severity, location, objects, and remedy.
- One action focuses the issue on canvas.
- Advisory waivers need a saved reason. Hard errors stay blocking.
- Empty and all-clear states are explicit.

## PASS gates

- Known invalid layouts create stable issue IDs.
- Detect → focus → fix → clear passes without reload.
- Waivers survive reload and remain auditable.
- Export and quote use the same result.
- Browser screenshots and accessibility checks pass.

**Evidence:** `results/planner/product-wave/14-validation-clearances/`

**Next:** P15.
