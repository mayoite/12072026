# Active Blockers and Failures

- **DB-SVG cutover (authority).** Live release authority remains **disk**. Dual-write is **proven for 22 brand heroes** on owner env (not cutover — browser place still OPEN).

  **Schema (done):** `published_svg_revision_id` applied 2026-07-18 (`db:apply`). Verify: `scripts/db_verify_published_svg_pointer.ts`.

  **Step 1 dual-write publish (done for 22 brand heroes + legacy desk, 2026-07-18):**  
  `pnpm --filter oando-site exec tsx scripts/db_dual_write_publish_batch.ts` → **ok=22 fail=0**.  
  Sample: `oando-fluid-desk-1600-r-86a867f48fcd557ba426` (+ full set printed by batch).  
  Legacy proof remains: `desk-linear-1200-001-r-e85ab01e78e21e8b18b3`.

  **Step 2 Planner revision bytes (API proven for dual-write path):**  
  `GET /api/planner/catalog/svg/{revisionId}` → 200 SVG (legacy + brand revisions written).  
  Disk authority **merges** full disk inventory + revision pointers.

  **Still OPEN for full cutover:**  
  1. ~~Dual-write all buyer heroes~~ **DONE** (owner env batch 22/22).  
  2. Browser place of brand / revision-URL symbol on guest canvas (not only API JSON).  
  3. Preview env `SVG_RELEASE_AUTHORITY=db` smoke, then optional prod flip.  
  **Do not set `SVG_RELEASE_AUTHORITY=db` until (2) is browser-proved for the buyer set.**

  **Product score ceiling:** SVG **brand** quality (names, families, marketing join) — see `docs/superpowers/specs/2026-07-18-four-module-svg-brand-design.md`. Generic OFL plan kit remains the main 8.5 blocker, not chrome.

  Reports: `agent-reports/2026-07-18-db-svg-residual.md`, design/plan under `docs/superpowers/`.
