# Systems v0 BOQ — priced INR + GST

**Date:** 2026-07-09  
**Evidence:** `vitest-raw.log` (5/5 pass)

## What

- Pure list unit prices (`workstationV0UnitPriceInr`) by size/shape + modules  
- GST default **18%** (`WORKSTATION_V0_GST_RATE`)  
- Summary: `subtotalInr` · `gstInr` · `totalInr` · `currencyCode: INR`  
- Export JSON + quote cart names include ex-GST unit; UI toast shows total incl. GST  

## Honest

Demo **list schedule** for the wedge — not multi-tenant ERP / live catalog prices.

## Tests

```
pnpm exec vitest run workstationBoqV0.test.ts workstationBoqExport.test.ts
# 5 passed
```
