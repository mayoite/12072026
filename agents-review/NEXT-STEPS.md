# Next steps — all tracks

**Updated:** 2026-07-12 · Quality paramount · no flattery · no 9.5 theater  
Boards: [Planner](../Plans/Planner-track/BOARD.md) · [Admin](../Plans/Admin-track/BOARD.md) · [Site](../Plans/Site-track/BOARD.md) · [SEO](../Plans/SEO-track/BOARD.md) · [Security](../Plans/Security-track/BOARD.md) · Bar: [00-QUALITY-BAR](../Plans/00-QUALITY-BAR.md)

> GATE PASS ≠ ship. Code landed ≠ browser green. Screenshots without bytes ≠ publish proof.

## One next action per track

| Track | Next action | Green when (observable) | Blocked by | Evidence |
|-------|-------------|-------------------------|------------|----------|
| **Planner** | **CP-03 / P03** re-prove on **this** tree: Fabric select → delete → undo | Browser asserts **same furniture id + pose** after undo (not count-only); screenshots + `run.json` | Nothing except time/auth for browser | `results/planner/world-standard-wave/03-select-delete/` |
| **Admin** | **A4.0.1 disk proof** on `E:\12072026`: rect on stage → live compile → Publish | `public/svg-catalog/{slug}.svg` contains drawn geometry; shell stage visible without form wall | Wrong-path servers, missing admin session | `results/admin/no-code-svg-studio/` |
| **Site** | **S1** — owner decision only until then | Written OK to cut `@fancyapps/ui` **or** explicit “leave” | **Owner gate** — do not cut without OK | `results/site/s1-deps/` when executed |
| **SEO** | **SEO1** — sitemap vs live routes | Diff file lists missing + extra paths; no silent “looks fine” | — | `results/seo/seo1-sitemap-diff.md` |
| **Security** | **SEC4** advisors **or** document blocker | `db:advisors:security` **0 ERROR** log, or `results/security/` names the real env blocker | DB credentials / network | `results/security/` |

## Do not do until the row above is green

| Track | Kill list |
|-------|-----------|
| Planner | P11–P16 product features; Feasibility restore; claiming CP-10 pack |
| Admin | A5–A8; more A4 tools (pen, multi-select, minimap); GLB theater |
| Site | “Site complete”; silent dep cuts; redesign as S2 |
| SEO | SEO2–5 content thrash before SEO1 diff |
| Security | Weakening CSP for PASS; claiming SEC3 track DONE from A3 slice alone |

## Ship spine (cross-track)

1. **Prod gate:** `next build` + `/contact` working — still flagged OPEN in owner pending; do not claim prod-ready.  
2. **Planner trust:** CP-03 → 07 → 06 → 04 → 05 → 08 → 09 → **10 pack** (pack ≠ ship).  
3. **Buyer product:** P11–P16; **Admin A6** unblocks P12; **Admin A7** unblocks P15.  
4. **Admin A4** browser-closed before A5 ops scale.

## Honest scores (this checkout — not goals)

| Track | Plan honesty | Product/engine | Why not higher |
|-------|--------------|----------------|----------------|
| Planner | ~7.5 | ~4 | REPROVE language good; browser id/pose gap; buyer OPEN |
| Admin | ~8.5 | ~5 | A4 plan sharpened; authority code real; no disk proof; A5–A8 empty |
| Site | ~8 | ~5 | S1/S2 honest; marketing not done |
| SEO | ~6 | ~3 | BOARD exists; no evidence pack; routes diverge |
| Security | ~7 | ~4 | Rows honest OPEN; only A3 slice has proof |

**9.5 is not claimed.** Plan honesty rises by keeping this table true. Product rises only with proof.

## What “done” is not

- Green Vitest without `results/` path  
- Old packs from another machine path  
- Restoring foreign skill packs  
- Score inflation  
