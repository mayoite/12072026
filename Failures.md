# Active failures

This file contains active failures only.

Remove an entry when its fix is freshly verified.

---

## BLOCK: DB-SVG-01..05 — Products DB is not released SVG authority

- **Scope:** Admin Phase 2 DB SVG cutover (`plan/Admin/CHECKLIST.md`); contract `docs/architecture/08-DATABASE-SVG-CONTRACT.md`.
- **IDs open:** `DB-SVG-01`, `DB-SVG-02`, `DB-SVG-03`, `DB-SVG-04`, `DB-SVG-05`.
- **Symptom / reason for blocking:**
  1. Live publish path is **disk** (`publishDescriptorWithPipeline` → block-descriptors + `public/svg-catalog`), not a Products DB transaction.
  2. No live tables/migrations found for `block_descriptors`, `published_svg_revisions`, `svg_artifacts`, or product `published_svg_revision_id` pointer.
  3. `svgRevisionRepository.server.ts` is an adapter **contract only** — not the production authority.
  4. Locked note: `docs/Lockedfiles/03-dependencies-engines-current.md` — **“The SVG database adapter is not live.”**
  5. Admin list UI states source as disk block-descriptors.
- **What does *not* close these IDs:** Disk dual-write units (DB-SVG-06..09 disk mapping), pure TypeScript contracts, Playwright UI smoke, green Admin unit suite.
- **Next:** Schema + Drizzle write path (immutable revisions + pointer in one transaction) → Planner DB reads → migration dry-run/parity (DB-SVG-17/18) → cutover. Verify with real DB tests on isolated rows only.
- **Blocks:** Closing Phase 2 DB acceptance; claiming Products DB owns released SVG.

---

## BLOCK: DB-SVG-17 / DB-SVG-18 — migration dry-run and DB/source parity

- **Scope:** Admin Phase 2 cutover acceptance.
- **Symptom:** No verified migration dry-run report that inventories additions/conflicts/rejects/footprints/hashes; no proven database vs approved-source parity before removing disk authority.
- **Depends on:** DB-SVG-01..05 live adapter.
- **Next:** Implement dry-run + parity tooling against isolated non-release data; record fresh commands and exit codes in the Admin checklist.
- **Blocks:** Production cutover off disk SVG authority.

---

## FAIL: Admin code coverage below 80% (full tree)

- **Scope:** `features/admin/**/*.{ts,tsx}` unit coverage meter.
- **Command (baseline 2026-07-13):**  
  `pnpm --filter oando-site exec vitest run --coverage tests/unit/admin --coverage.include="features/admin/**/*.{ts,tsx}" --coverage.all=true`  
  → ~**44% statements / 35% branches / 40% functions / 46% lines**.
- **Later work:** Three agents added large unit suites (pricing file store/admin server, admin core utils/nav/inventory, SVG residual form-controls/revision/lock/rollback/etc.). **Full Admin tree not re-measured after those suites at ≥80%.**
- **Symptom:** Page shells, `catalogAdminHandlers`, many preview panels, and other UI modules still dilute overall %. Pricing pure modules and several core pure files are high coverage in isolation.
- **Next:** Re-run the same coverage command; record new %; keep writing tests for remaining 0% modules until statements/lines ≥80% or explicitly lower the floor with owner alignment.
- **Blocks:** Any claim “Admin coverage ≥80%” without a fresh summary file.

---

## GAP: Unauthenticated Admin smoke not proven under this env

- **Scope:** `site/tests/e2e/admin-smoke.spec.ts` (production auth gate).
- **Command:** Playwright `admin-smoke.spec.ts` (2026-07-13).
- **Result:** **8 skipped** — suite detects `DEV_AUTH_BYPASS=1` (from `.env.development.local` / webServer env).
- **Symptom:** No fresh proof that `/admin/*` redirects to `/access/?next=` or that production ignores bypass.
- **Next:** Run against production `build && start` with `DEV_AUTH_BYPASS` unset and not loaded from dev env.
- **Blocks:** Claiming production auth gate for Admin routes from bypass-enabled local runs.

---

## GAP: Chrome DevTools MCP / Lighthouse a11y path blocked

- **Scope:** `/a11y-debugging` and `/chrome-devtools-cli` via Chrome DevTools MCP.
- **Symptom:** No Google Chrome stable at standard install paths on this Windows host. Playwright Chromium ≠ MCP Chrome channel.
- **Mitigation used (does not close this gap):** Playwright + axe WCAG on Admin primary journeys under `DEV_AUTH_BYPASS=1` (`results/admin/2026-07-13T-admin-phases-final/reports/`).
- **Next:** Install Google Chrome stable (or configure MCP Chromium channel); re-run Lighthouse navigation on `/admin/svg-editor`, edit slug, `/admin/price-books`.
- **Blocks:** Claiming MCP Lighthouse a11y scores for Admin.

---

## OPEN: Live Planner retire/restore placement not browser-verified

- **Scope:** Admin catalog lifecycle → Planner canvas after retire/restore.
- **Symptom:** Unit/disk lifecycle paths exist; no fresh end-to-end browser proof on live Planner canvas.
- **Next:** Browser journey with isolated data; never mutate canonical catalog.
- **Blocks:** Closing residual checklist item for live Planner retire/restore placement.

---

## RISK: Canonical catalog / local seed noise in worktree

- **Scope:** Working tree hygiene (not a product PASS/FAIL of features).
- **Symptom observed:** dirty or untracked  
  - `results/admin/catalog-ops/_catalog-lifecycle.json`  
  - `results/admin/catalog-ops/_descriptor-audit.jsonl`  
  - `site/features/admin/data/price-books/_price-book-audit.jsonl`  
  - `.tmp/...`  
  - (resolved) `.websites/` — untracked and deleted locally; gitignored  
- **Rule:** Tests must never mutate canonical catalog files.
- **Next:** Diff and restore accidental catalog/seed changes before release commits; keep tests on temp dirs only.
- **Blocks:** Clean commit hygiene if noise is staged by mistake.

---

## COMMENT: Disk-path Admin publish vs DB residual (honest boundary)

- **Scope:** Checklist honesty.
- **Comment:** Green Admin units, Playwright under bypass, and DB-SVG-06..09 **disk** mapping do **not** prove Products DB authority. Keep DB-SVG-01..05 / 17 / 18 open until live DB path is verified per `08-DATABASE-SVG-CONTRACT.md`.
- **Next:** No checklist tick without fresh DB evidence.

---

## COMMENT: Admin unit suite status (verified 2026-07-13)

- **Command:** `pnpm --filter oando-site exec vitest run tests/unit/admin --reporter=default`
- **Result:** **63 files, 422 tests, exit 0** (fresh run after coverage agents).
- **Comment:** Earlier intermittent fails (`AdminInventoryPageView` multi-match, `useDebouncedCompile` pending race) are **not** active on this run. Do not re-add as FAIL without a new red command.
- **Not a PASS record for DB or coverage floor** — unit green only.
