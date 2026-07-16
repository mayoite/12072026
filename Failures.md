# Active failures

Active only. Remove when fix is freshly verified.

---

## BLOCK: DB-SVG-01..05 — Products DB not SVG authority

- **Scope:** Admin Phase 2; `docs/architecture/08-DATABASE-SVG-CONTRACT.md`.
- **Symptom:** Disk (`inventory/descriptors/`, `public/svg-catalog/`) still owns publish. Dual-write is best-effort stub; no product `published_svg_revision_id`; Planner falls back to disk.
- **Next:** Real payload + one DB transaction → Planner artifact-byte reads → isolated DB verify.
- **Blocks:** Phase 2 cutover; “DB owns released SVG” claims.

---

## BLOCK: DB-SVG-18 — parity tooling before cutover

- **Depends on:** live adapter (DB-SVG-01..05).
- **Progress (2026-07-16):** DB-SVG-17 dry-run **exit 0** — `pnpm --filter oando-site exec tsx scripts/svg-disk-db-dry-run.ts` → `results/admin/svg-disk-db-dry-run/dry-run.json` (5 descriptors, 0 missing SVG). Disk inventory only; not DB authority.
- **Next:** Prove DB vs approved-source parity tooling; then remove disk authority only after 01..05.
- **Blocks:** Removing disk authority.

---

## OPEN: Admin coverage functions/branches under Vitest thresholds

- **Command:** `pnpm run test:coverage:admin` (or vitest admin coverage config).
- **Fresh 2026-07-16:** statements **81.68%**, lines **83.35%** (floor ≥80% **met**); functions **79.97%**, branches **72.13%** → process exit **1**.
- **Config:** `site/vitest.admin.coverage.config.ts` → `results/coverage-admin/`
- **Next:** +1 function and ~101 branches (or lower thresholds with owner sign). Single process only.
- **Blocks:** “Admin coverage thresholds all green” claims. Does **not** block “statements/lines ≥80%” (now true).

---

## OPEN: Chrome DevTools MCP / Lighthouse a11y

- **Check:** `pnpm run check:chrome-mcp`
- **Symptom:** No Chrome stable at standard Windows paths.
- **Mitigation:** Playwright + axe under bypass (not MCP Lighthouse).
- **Next:** Install Chrome; Lighthouse on `/admin/svg-editor`, edit slug, `/admin/price-books`.
- **Blocks:** MCP Lighthouse a11y scores.
