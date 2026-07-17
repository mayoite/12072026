# A-W3 — AF-07 price book UX

**Date:** 2026-07-17  
**Agent:** A-W3  
**Plan:** `plan/Admin/FINISH-PLAN.md` AF-07 · ADM-PRICE · `docs/architecture/07-ADMIN-UI-BENCHMARK.md` commercial governance  

## Scope owned

- `site/features/admin/pricing/**`
- Matching unit tests under `site/tests/unit/features/admin/pricing/**`

**Did not touch:** catalog tables / AF-06, svg-editor, auth, planner, site marketing.

## Verdict

| Item | Status | Evidence |
|------|--------|----------|
| Currency primary in rules table | **PASS (unit)** | `displayPriceForSku` → `primary` via `Intl` currency; primary headers SKU / Price / Unit only |
| Minor units under Advanced | **PASS (unit)** | `<details data-testid="admin-price-book-technical">` collapsed by default; secondary + adj bps only there |
| Action hierarchy | **PASS (unit)** | Activate `admin-btn--primary`; approve `outline`; rollback `outline` + `danger` |
| Draft / approved availability | **PASS (unit)** | Draft: approve + activate enabled; approved: activate only; active: rollback only |
| Pricing domain unit suite | **PASS** | 10 files / **117** tests exit 0 |
| Browser `/admin/price-books` | **OPEN** | No Playwright / Chromium re-proof this session |
| Deploy auth | **OPEN** | Out of scope |

**Brutal truth:** Unit-green ≠ browser acceptance. Old benchmark “raw minor units + equal risk weight” is **mitigated in markup + unit**. Do **not** claim AF-07 production / ADM-PRICE browser PASS.

## Code this session

UI already met ADM-PRICE-01 / risk hierarchy from EXEC-5 (`AdminPriceBookPageView.tsx`). No product markup change required.

**Test hardening only:**

- `site/tests/unit/features/admin/pricing/AdminPriceBookPageView.test.tsx`
  - Primary table headers exclude minor / bps
  - Advanced `<details>` not `open` by default
  - Adj bps only under Advanced
  - Draft + approved action class / enablement cases
  - Shell copy: currency primary; technical under Advanced

## Commands (fresh)

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/admin/pricing
pnpm run check:layout
```

| Command | Result |
|---------|--------|
| pricing unit suite | **117 passed**, 10 files, exit 0 |
| `check:layout` | **OK** — no forbidden site/ paths |

## Isolation

- View tests use in-memory fixtures only; no catalog descriptor / public asset writes.
- No commit, no secrets, no handwritten `any`.

## Status vocabulary

- AF-07 **unit:** **PASS** (re-verified + stronger cases)
- AF-07 **browser:** **OPEN**
- Overall AF-07 product claim: **PARTIAL** until ADM-PRICE browser with honest auth

## Next (not this agent)

1. Browser: `/admin/price-books` — currency primary, Advanced collapsed, confirm text, action weight, honest auth (ADM-PRICE).
2. Optional Playwright: `tests/e2e/admin-pricing-pricebook-p05.spec.ts` with real session, not bypass-as-proof.
