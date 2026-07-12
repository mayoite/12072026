# P15 — Priced BOQ and export

**Status:** OPEN — blocked by P14 and Admin A7 · **Depends:** P12 + P14 + A7

## Outcome

Buyer and sales see what is planned, priced, invalid, and unpriced.

## Build

One calculation groups family, configuration, module, finish, and room. It powers UI, PDF, workbook, and JSON.

## UI gates

- Totals show quantity, unit price, adjustment, tax, and total.
- Unpriced never appears as zero.
- Every line links to placed object IDs.
- Price-book version and calculation time stay visible.

## PASS gates

- Linear/L project totals match Admin A7 rules.
- Edit, delete, save, and reload stay deterministic.
- P14 hard errors block quote-ready status.
- PDF and workbook pass visual review.
- All exports match the same calculation hash.

**Evidence:** `results/planner/product-wave/15-priced-boq-export/`

**Next:** P16.
