# P15 — Priced BOQ and export

**Status:** OPEN — priced BOQ is not built.

**Outcome:** A buyer and sales user can understand what is in the plan, what it costs, and what remains unpriced.

## Functional scope

- Group BOM by workstation family, configuration, module, finish, and room.
- Quantity, unit, unit price, adjustment, tax, and total.
- Trace each BOQ line back to placed object IDs.
- Explicit unpriced and invalid lines. Never default to zero.
- PDF, spreadsheet, and machine-readable export from one calculation result.
- Price-book version and calculation timestamp on every export.

## Acceptance

- [ ] A representative linear/L project produces a complete BOM.
- [ ] Totals match Admin A7 price rules.
- [ ] Deleting or editing a run updates quantities deterministically.
- [ ] Exported PDF and workbook are visually verified.
- [ ] Saved project reload reproduces the same BOQ on the same price book.

## Evidence

`results/planner/product-wave/15-priced-boq-export/`

## Dependency

P12 and Admin A7. P14 hard errors block quote-ready status.
