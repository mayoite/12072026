# A7a — Pricing / BOQ governance · kill addendum

**Addendum to:** [A7-pricing-boq-governance.md](./A7-pricing-boq-governance.md).  
**Status:** OPEN · **Depends:** A6 BOM mapping. Unblocks Planner **P15**.  
**Evidence:** `results/admin/pricing-boq-governance/`

Original A7 acceptance is the complete bar. Kills only. **Not done** until original + owner happy.

## Kill order

| ID | Slice | Green when (slice) | Unlocks |
|----|--------|--------------------|---------|
| **A7.0** | Repo truth | Where quotes/BOQ/price live today (or “none”) | A7.1 |
| **A7.1** | Price book version model | Create draft book with effective date + currency; reload stable | A7.2 |
| **A7.2** | Map one family component → unit price | Preview calculation on a fixture project shows qty × unit | A7.3 |
| **A7.3** | No silent zero | Missing rule → “price unavailable”; finalize blocked | A7.4 |
| **A7.4** | Activate / pin past quotes | New activation; prior quote totals **byte-identical** | A7.5 |
| **A7.5** | Permissions + rollback | Viewer cannot activate; rollback audit event; no delete of history | A7 full |

## Not done by

Hard-coded unit prices in Planner · spreadsheet export only · PARTIAL “price field.”

## Reopen rule

PARTIAL pricing work → **OPEN** until A7 acceptance + owner OK.
