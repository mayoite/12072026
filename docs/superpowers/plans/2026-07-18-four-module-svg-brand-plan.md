# Plan: Four modules — SVG brand program + dual-write proof

**Design:** `docs/superpowers/specs/2026-07-18-four-module-svg-brand-design.md`  
**Branch:** main · No worktrees

## P0 — This session / immediate

### T-DW-1 Dual-write publish proof (TechStack + Admin)
- Script: `site/scripts/db_dual_write_publish_proof.ts`
- Link managed product → `desk-linear-1200-001` (or `--slug=`)
- Publish with dual-write deps
- Print revision_id + pointer + artifact list
- Verify SQL + readiness still enabled

### T-DW-2 Step 2 planner bytes check
- After T-DW-1: query `published_svg_revision_id`
- Document GET `/api/planner/catalog/svg/{id}` + svg-blocks expectation
- Optional: curl against running `pnpm dev` if available

### T-PLAN Four-module SVG brand program (plan only if time; execute next waves)
- Admin: map marketing folder heroes → 30 plan slugs
- Planner: buyer filter brand names
- Site: continuity
- TechStack: cutover after multi-SKU proof

## P1 — Next execution waves (do not skip SVG)

### Wave A — Brand plan inventory (Admin + asset-engine)
1. Rename/reseed top desks/chairs/tables with **commercial names + SKUs** (not only OFL-*).  
2. Improve multiprim quality (no collapsed blobs).  
3. Publish all via pipeline + dual-write.  
4. Buyer-visible only.

### Wave B — Planner brand identity
1. Inventory shows series/name/SKU/footprint.  
2. siteProduct focuses matching item.  
3. BOQ uses brand name/SKU.

### Wave C — Site brand join
1. PDP optional plan SVG preview when published.  
2. Continuity banner uses product display name when known.

### Wave D — Cutover
1. Dual-write ≥5 heroes proven.  
2. Preview `SVG_RELEASE_AUTHORITY=db`.  
3. Prod flip.

## Explicit: SVG cannot be deferred

Chrome/Help/BOQ honesty already shipped. **Score ceiling is SVG brand quality.** Every wave after P0 must include Admin plan SVG work.
