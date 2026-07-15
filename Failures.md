# Active failures

This file contains active failures only.

Remove an entry when its fix is freshly verified.

---

## BLOCK: DB-SVG-01..05 — Products DB is not released SVG authority

- **Scope:** Admin Phase 2 DB SVG cutover (`plan/Admin/CHECKLIST.md`); contract `docs/architecture/08-DATABASE-SVG-CONTRACT.md`.
- **IDs open:** `DB-SVG-01`, `DB-SVG-02`, `DB-SVG-03`, `DB-SVG-04`, `DB-SVG-05`.
- **Symptom:** Disk publish (`inventory/descriptors/`, `public/svg-catalog/`) remains authority. Dual-write is best-effort after disk commit with stub revision payload. No `published_svg_revision_id` product pointer. Planner `svg-blocks` still falls back to disk descriptors.
- **Progress (2026-07-15):** Restored missing `svgRevisionRepository.server.ts` + unit tests. Migration `20260714100000_create_svg_revisions.sql` and Drizzle tables exist under interim names.
- **Next:** Real descriptor payload in dual-write, one DB transaction (revision + artifacts + pointer + audit), Planner reads committed artifact bytes, live DB verification on isolated rows only.
- **Blocks:** Closing Phase 2 DB acceptance; claiming Products DB owns released SVG.

---

## BLOCK: DB-SVG-17 / DB-SVG-18 — migration dry-run and DB/source parity

- **Scope:** Admin Phase 2 cutover acceptance.
- **Symptom:** No verified dry-run report or proven database vs approved-source parity before removing disk authority.
- **Progress (2026-07-15):** Added read-only dry-run script `site/scripts/svg-disk-db-dry-run.ts` → `results/admin/svg-disk-db-dry-run/dry-run.json`.
- **Next:** Run dry-run from repo root; implement DB parity tooling; record fresh commands and exit codes in the Admin checklist.
- **Depends on:** DB-SVG-01..05 live adapter for parity half.
- **Blocks:** Production cutover off disk SVG authority.

---

## OPEN: Scripts typecheck — fixes landed, re-verify required

- **Scope:** `site/scripts/tsconfig.json` broad script compilation.
- **Command:** `pnpm --filter oando-site run typecheck:scripts`
- **Progress (2026-07-15):** Fixed `svgBlockDescriptorLoader` result narrowing, `audit-product-quality` scene image typing, DB script `exitCode` narrowing, `generate_blocks` `Prim` narrowing.
- **Next:** Re-run command; remove this entry only on exit `0`.
- **Blocks:** Claiming broad scripts typecheck is green.

---

## OPEN: Admin code coverage below 80% (full tree)

- **Scope:** `features/admin/**/*.{ts,tsx}` unit coverage meter.
- **Command:** `pnpm run test:coverage:admin` (root proxy) or `pnpm --filter oando-site run test:coverage:admin`
- **Config:** `site/vitest.admin.coverage.config.ts` → `results/coverage-admin/` + `results/coverage-reports/admin/`
- **Progress (2026-07-15):** Added editor unit tests (`units`, `elementUtils`, `gridSnapping`, `elementFactory`) and `useAdminSvgEditorPublish` initial-state test. Added dedicated admin coverage script with 80% thresholds.
- **Next:** Re-run coverage command on a working shell; add tests for remaining untested `editor/*.tsx` and `views/edit-shell/*.tsx` if floor still missed.
- **Blocks:** Any claim “Admin coverage ≥80%” without a fresh summary exit `0`.

---

## OPEN: Unauthenticated Admin smoke not proven under this env

- **Scope:** `site/tests/e2e/admin-smoke.spec.ts` (production auth gate).
- **Symptom:** Local Playwright webServer loads `DEV_AUTH_BYPASS=1`; smoke suite skips (8 tests) when bypass is on.
- **Command:** `pnpm run test:admin:production-auth` → `site/scripts/run-admin-production-auth-smoke.ps1` (build + standalone start, bypass unset, evidence in `results/admin/production-auth/`).
- **Next:** Run command on a working shell; remove entry only when all 8 tests pass and `run-meta.json` records exit `0`.
- **Blocks:** Claiming production auth gate for Admin routes from bypass-enabled local runs.

---

## OPEN: Chrome DevTools MCP / Lighthouse a11y path blocked

- **Scope:** Chrome DevTools MCP Lighthouse on Admin primary routes.
- **Symptom:** No Google Chrome stable at standard Windows install paths. Playwright Chromium ≠ MCP Chrome channel.
- **Check:** `pnpm run check:chrome-mcp` → `site/scripts/check-chrome-stable.ps1` (exit `0` when Chrome found).
- **Install:** `winget install --id Google.Chrome -e` or https://www.google.com/chrome/
- **Mitigation:** Playwright + axe on Admin journeys under bypass (`results/admin/2026-07-13T-admin-phases-final/reports/`).
- **Next:** Install Chrome stable; run `check:chrome-mcp`; re-run Lighthouse on `/admin/svg-editor`, edit slug, `/admin/price-books`.
- **Blocks:** Claiming MCP Lighthouse a11y scores for Admin.

---

## OPEN: Planner retire/restore canvas — test fixed, Playwright run required

- **Scope:** Admin catalog lifecycle → Planner canvas after retire/restore (`side-table-001`).
- **Spec:** `site/tests/e2e/admin-svg-retire-restore.spec.ts` step 4b — guest workspace, catalog search, zero Place CTA when retired.
- **Progress (2026-07-15):** Fixed false-pass selector (`/Add side-table/i` → `/Place — Add Side Table|Add Side Table to canvas/i`); added `waitForPlannerCatalogReady`. Run script: `pnpm run test:e2e:admin-retire-restore` → `results/admin/retire-restore-canvas/run-meta.json`.
- **Precondition:** Script `ensure-retire-restore-precondition.mjs` sets `side-table-001` → `live` in `results/admin/catalog-ops/_catalog-lifecycle.json` before run.
- **Command:** `pnpm run test:e2e:admin-retire-restore` (on exit `0` auto-updates checklists + removes this entry)
- **Next:** Green exit `0`; tick `plan/Admin/CHECKLIST.md` Phase 4 retire/restore + Planner canvas lines; remove this entry.
- **Blocks:** Closing `ADM-PUB` retire/restore browser journey and Planner retired-symbol placement proof.