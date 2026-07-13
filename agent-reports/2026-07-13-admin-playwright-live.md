# Admin Playwright live redo — 2026-07-13

## Request

Install Playwright; redo Admin phases with a11y-debugging, smoke, screenshots, and live tests.

## Done

| Item | Result |
|------|--------|
| Playwright Chromium install | OK (`@playwright/test` 1.61.1) |
| Live suite | **20/20 passed** (~29s, workers=1, `DEV_AUTH_BYPASS=1`) |
| Smoke (phases 1–4 routes) | PASS |
| Screenshots | `results/admin/2026-07-13T-admin-phases-final/screenshots/` (16 PNGs) |
| Axe WCAG 2.2 AA (primary journeys) | **0 violations** (svg-list, svg-edit, price-books) |
| Mobile shell scroll | PASS (no page-level horizontal overflow) |
| Price book draft→approve→activate→rollback | PASS |
| Isolated SVG publish | PASS (canonical files unchanged) |

## Specs run

- `tests/e2e/admin-phases-live.spec.ts` (new)
- `tests/e2e/admin-svg-inventory-preview-p01.spec.ts`
- `tests/e2e/admin-svg-publish-p01.spec.ts`
- `tests/e2e/admin-svg-scene-publish-a401.spec.ts`
- `tests/e2e/admin-pricing-pricebook-p05.spec.ts`

## Code fixes required for green live

1. **Client `node:fs` build error** — `AdminPriceBookPageView` imported `priceBookGovernance` which pulled `node:fs`. Split audit I/O into `priceBookGovernance.server.ts`.
2. **`.admin-badge--warn` contrast** — 4.29 → ≥4.5 (ADM-A11Y-01 axe).
3. **E2E selectors** — Edit link uses `aria-label` with slug; bulk import lives in closed `<details>`; price-book uses `window.confirm` (dialog accept); strict `getByText('approved')` scoped to lifecycle list.

## Not done / residual

- Chrome DevTools MCP Lighthouse: **blocked** — no Google Chrome stable executable on this machine. Axe via Playwright is the a11y evidence.
- Unauth admin-smoke (`admin-smoke.spec.ts`) needs production build **without** `DEV_AUTH_BYPASS` (skipped under bypass).
- DB-SVG-01..05, 17, 18 still open.
- Live Planner retire/restore placement still open.

## Honest claim

Browser acceptance for Admin primary journeys (list, studio, inventory filters, price books) is green under dev auth bypass. That is not a production-auth gate proof and not a Products-DB authority proof.
