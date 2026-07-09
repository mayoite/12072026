# TW2 — open3d console clean (known preview SVG 404s)

**Result: PASS**

## What

Playwright e2e `site/tests/e2e/open3d-console-clean.spec.ts`:

1. Opens open3d stack (`/planner/open3d` warm + guest workspace load)
2. Listens for `requestfinished` / `response` on:
   - `/proof-chair.svg`
   - `/placeholder-cabinet.svg`
3. Collects console errors mentioning those filenames
4. Asserts **zero** 404 hits and **zero** console errors for those paths
5. Direct `page.request.get` also expects ok (not 404)

Companion unit (pre-existing): `catalogPreviewAssets.test.ts` — files exist under `site/public/`.

## Run

```text
PLAYWRIGHT_BASE_URL=http://localhost:3000
pnpm exec playwright test -c config/build/playwright.config.ts tests/e2e/open3d-console-clean.spec.ts --reporter=list
```

- Playwright: **1 passed** (~12s)
- Unit catalog preview: **1 passed**

## Evidence

| File | Role |
|------|------|
| `playwright-raw.log` | Full list reporter output |
| `console-clean-report.json` | Network hits + 404/console buckets |
| `run.json` | Pass summary |
| `01-open3d-loaded.png` | Viewport after open3d load |
| `unit-catalog-preview-raw.log` | Vitest static asset check |

Network hits this run: proof-chair ×2 status 200, placeholder-cabinet ×1 status 200. `notFound404: []`, `consoleErrorsForAssets: []`.
