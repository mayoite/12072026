# W5 hard-reload proof (2026-07-09)

## Result
**PASS** — 1/1 Playwright chromium

## Flow
1. One-shot clear of planner localStorage + `planner-workspace-db` via `clearPlannerStorageInPage` (no init-script wipe on reload)
2. Guest enter (`preservePlannerState: true`) + open3d canvas
3. Catalog **Add … to canvas** + canvas click (W3 pattern; no step-bar)
4. Status shows furniture count increased
5. **Save draft** → wait **Saved locally** / **Draft saved locally**
6. `page.reload` (same storage)
7. Poll until furniture count restored to pre-reload value

## Command
```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-save-honesty.spec.ts --reporter=line
```

## Artifacts
- `06-playwright-raw.log`
- `06-browser-run.json`
- `01-before-save.png` / `02-saved-local.png` / `03-after-hard-reload.png`

## Notes
- Dev server was up on `:3000` (PLAYWRIGHT_BASE_URL); no turbopack fallback needed.
- Guest workspace title often remains **Untitled plan** (prop default); W5 signal is **furniture count** after IDB restore.
- `clearPlannerStorage` init-script would re-delete IDB on reload — hard-reload tests must use `clearPlannerStorageInPage` once.
