# Remaining plan exec — 2026-07-16

## Commands run

| Step | Command | Exit | Notes |
|------|---------|------|-------|
| Admin coverage | `pnpm --filter oando-site exec vitest run --coverage --config vitest.admin.coverage.config.ts --maxWorkers=4` | **1** | Threshold fail on functions/branches only; tests **796 passed** |
| Coverage report | `node site/scripts/generate-coverage-report.mjs admin` | 0 | `results/coverage-reports/admin/` |
| Production auth | `pnpm run test:admin:production-auth` | **0** | Fixed smoke script (dedicated PORT=3105, force `DEV_AUTH_BYPASS=0`, no reuse of `:3000` dev) |
| DB-SVG-17 dry-run | `pnpm --filter oando-site exec tsx scripts/svg-disk-db-dry-run.ts` | **0** | 5 descriptors, 0 missing SVG |
| Layout | `pnpm run check:layout` | **0** | |

## Coverage % (fresh `results/coverage-admin/coverage-summary.json`)

| Metric | % | Covered / Total | Floor |
|--------|---|-----------------|-------|
| **Statements** | **81.68** | 3563 / 4362 | ≥80 **met** |
| **Lines** | **83.35** | 3260 / 3911 | ≥80 **met** |
| Functions | 79.97 | 787 / 984 | ≥80 **miss by 1 function** |
| Branches | 72.13 | 2537 / 3517 | ≥75 **miss** |

Log: `results/admin-coverage-run-final.log`  
Human report: `results/coverage-reports/admin/coverage-report.{csv,html,json}`

### Coverage work done

- Expanded unit tests: `catalogAdminHandlers`, `priceBookDrizzleStore.server`, `drizzleSvgPersistence.server`, `workstationFamilyAuthor`.
- Fixed broken `import os from "node:os"` across admin (and related) unit tests after parallel edits stripped them.
- Await fixes for async `priceBookAdmin.server` helpers.
- Aligned `catalogLifecycle.db.server` tests with usable-geometry DB filter.

Vitest **global** thresholds still fail (functions + branches) → command exit **1**. Statements/lines floors from Failures.md are **met**.

## Production auth

- **Exit 0**, 8/8 Playwright tests.
- Evidence: `results/admin/production-auth/run-meta.json`
- Smoke script hardened: `site/scripts/run-admin-production-auth-smoke.ps1`
  - Forces `DEV_AUTH_BYPASS=0` (overrides `.env.local` for this process)
  - Starts production standalone on **PORT 3105** (avoids leftover `pnpm dev` on 3000)
  - Does not set Playwright webServer reuse path that attaches to dev

## DB-SVG dry-run

- Script: `site/scripts/svg-disk-db-dry-run.ts`
- Exit **0**
- Report: `results/admin/svg-disk-db-dry-run/dry-run.json`
- `descriptorCount=5`, `missingSvgCount=0`
- **Does not claim DB authority.** Disk inventory inventory only; no DB write; no parity gate (DB-SVG-18 still open).

## Still blocked / open

| Item | Status |
|------|--------|
| DB-SVG-01…05 cutover | **BLOCK** — disk still authority; dual-write stub |
| DB-SVG-18 parity tooling | **OPEN** — dry-run inventory only |
| Admin coverage thresholds | **OPEN** — functions 79.97%, branches 72.13% (stmts/lines OK) |
| Chrome MCP / Lighthouse a11y | **OPEN** — no Chrome stable install |
| Browser Excalidraw publish journey | **OPEN** — not invented |
| Phase 3/4 full browser commercial chain | **OPEN** |

## Plan hygiene

- `Failures.md` / `FEATURES.md` / `CHECKLIST.md` updated for auth PASS + coverage remeasure + dry-run exit.
- No commit. No PROTECTED/ access.
