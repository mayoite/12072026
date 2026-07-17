# Active Blockers and Failures

- **DB-SVG cutover (authority).** Live release authority remains **disk**. Dual-write is **proven for one SKU** (not cutover).

  **Schema (done):** `published_svg_revision_id` applied 2026-07-18 (`db:apply`). Verify: `scripts/db_verify_published_svg_pointer.ts`.

  **Step 1 dual-write publish (done for one product, 2026-07-18):**  
  `pnpm --filter oando-site exec tsx scripts/db_dual_write_publish_proof.ts`  
  → `desk-linear-1200-001` revision `desk-linear-1200-001-r-e85ab01e78e21e8b18b3`  
  → artifacts descriptor+svg+png on R2; product pointer set on `managed-desk-linear-1200-001`.

  **Step 2 Planner revision bytes (done for that SKU):**  
  `GET /api/planner/catalog/svg/{revisionId}` → 200 SVG  
  `svg-blocks` `previewImageUrl` uses `/api/planner/catalog/svg/...` for that desk.  
  Disk authority **merges** full disk inventory + revision pointers (partial dual-write no longer shrinks catalog to DB-only rows).

  **Still OPEN for full cutover:**  
  1. Dual-write publish **all buyer plan SKUs** (or accepted multi-hero set ≥5–30 brand SVGs) with pointers.  
  2. Browser place of revision-URL symbol on guest canvas (not only API JSON).  
  3. Preview env `SVG_RELEASE_AUTHORITY=db` smoke, then optional prod flip.  
  **Do not set `SVG_RELEASE_AUTHORITY=db` until (1)+(2) for the full buyer set.**

  **Product score ceiling:** SVG **brand** quality (names, families, marketing join) — see `docs/superpowers/specs/2026-07-18-four-module-svg-brand-design.md`. Generic OFL plan kit remains the main 8.5 blocker, not chrome.

  Reports: `agent-reports/2026-07-18-db-svg-residual.md`, design/plan under `docs/superpowers/`.
