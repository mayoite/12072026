# PHASE-04 — Priced BOQ and export

**Parallel:** no · **Blocks on:** Buyer P01 · P03 · Admin P05 · **Proof:** live browser + export bytes

---

## Outcome

Buyer and sales see what is planned, priced, invalid, and unpriced.

## Build

One calculation groups family, configuration, module, finish, and room. It powers UI, PDF,
workbook, and JSON.

## UI gates

- Totals show quantity, unit price, adjustment, tax, and total.
- Unpriced never appears as zero.
- Every line links to placed object IDs.
- Price-book version and calculation time stay visible.

## PASS gates

- Linear/L project totals match Admin P05 price-book rules.
- Edit, delete, save, and reload stay deterministic.
- Buyer P03 hard errors block quote-ready status.
- PDF and workbook pass visual review.
- All exports match the same calculation hash.

## Steps

1. Consume Admin P05 price-book JSON contract.
2. Show totals, line IDs, price-book version, calculation time.
3. Block quote-ready when Buyer P03 hard errors present.
4. PDF and workbook visual review against same calculation hash.

## Done when

[UI-BAR.md](../UI-BAR.md) ticked · [CHECKLIST.md](./CHECKLIST.md) PHASE-04.

## How to prove

Linear/L project totals match Admin P05 fixture rules. Export PDF/workbook/JSON; verify hash match
after edit/save/reload.

Report → `agents-work/reports/buyer-phase-04.md`. Raw artifacts → `results/buyer/phase-04/`.