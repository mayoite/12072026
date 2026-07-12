# SEO-track board

**Scope:** Sitemap, metadata, canonicals, robots/noindex, JSON-LD.  
**Shape:** BOARD-only until a row needs its own card.  
**Nothing here is complete.**

## Honest scores

| | Now | Blocker |
|--|-----|---------|
| Plan honesty | ~6 | Queue exists; acceptance was soft |
| Product | ~3 | No closed SEO evidence pack; STATIC_PATHS diverge from live routes |

| ID | Name | Status | Green when |
|----|------|--------|------------|
| **SEO1** | Sitemap ↔ live routes | **OPEN** | Diff of indexable public routes vs sitemap; allowlist for noindex; file in `results/seo/` |
| **SEO2** | Per-page metadata | **OPEN** | Audit table title/description/OG for marketing templates |
| **SEO3** | Product/category canonicals | **OPEN** | Canonical rules match `productStaticParams` / slug policy |
| **SEO4** | robots / noindex | **OPEN** | Policy doc + live headers for app/auth routes |
| **SEO5** | JSON-LD | **OPEN** | Not landed |

### Next action (only)

**SEO1** — finish inventory started at [`results/seo/seo1-sitemap-diff.md`](../../results/seo/seo1-sitemap-diff.md). Classify each gap: index | noindex | bug. No SEO2 until SEO1 green.

**Depends on:** Site pages existing. Do not assume marketing DONE.

**Kill list:** Content thrash; claiming SEO done from sitemap file existing.
