# Active Blockers and Failures

- **DB-SVG cutover (authority).** Live release authority remains **disk** (`inventory/descriptors/`, `public/svg-catalog/`). Lifecycle audit remains filesystem (`results/admin/catalog-ops/`). **Enabled dual-write ≠ cutover.**

  **Applied 2026-07-18:** Products DB pointer migration `20260716100000_add_published_svg_revision_id.sql` (`planner_managed_products.published_svg_revision_id`) via `pnpm --filter oando-site run db:apply`. Verified with `scripts/db_verify_published_svg_pointer.ts`. Dual-write resolve soft-skips when column missing (`skipped_schema_missing`).

  **OPEN (numbered):**
  1. One real Admin dual-write publish of an inventory product (disk + R2 artifacts + DB revision + product pointer; 0 products ok; >1 reject).
  2. Planner `svg-blocks` / revision API serves committed R2 bytes without disk-only reliance for that product.
  3. Only after (1)–(2): optional `SVG_RELEASE_AUTHORITY=db`, then re-prove no silent disk override.

  **Do not set `SVG_RELEASE_AUTHORITY=db` until (1) and (2) are proven.** Contract `DB-SVG-01`…`20` stays open. Detail: `agent-reports/2026-07-18-db-svg-residual.md`. Prior: `agent-reports/2026-07-17-fail0-w2.md`.
