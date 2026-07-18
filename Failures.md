# Active blockers

**Plan:** `plan/<Track>/CHECKLIST.md` + `FEATURES.md`.

## DB-SVG cutover — OPEN

Live SVG authority = **disk**. Do not set `SVG_RELEASE_AUTHORITY=db` until browser place is proved.

| Step | Status |
|------|--------|
| Schema `published_svg_revision_id` | Applied on owner Products DB (re-verify with script) |
| Dual-write batch 22 heroes | Owner-env report only — re-run `db_dual_write_publish_batch.ts` |
| Revision API returns SVG | Owner-env report — not browser place |
| Browser place brand SVG on guest canvas | **OPEN** |
| Flip authority to DB | **OPEN** |

Brand quality + place matter more than chrome. Greys ≠ brand done.

Parametric desk (Admin PL-2/3) helps symbols; it does **not** clear this cutover alone.
