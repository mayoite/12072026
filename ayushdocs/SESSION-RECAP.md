# Session recap — 2026-07-10 (site suite + process)

**Checkout:** `D:\OandO07072026` · branch `main`  
**Tip at save (approx):** `1f8c26c` / later marketing commits may sit above — **re-check** `git log -5`  
**Dev:** `cd site; pnpm run dev` → **Turbopack** default (`dev:webpack` if needed). Loads **repo-root** `.env.local` via `loadEnvLocal` in next.config.

---

## One sentence

Stopped thrash with ordered site phases; home is design base; locked CSS fenced; portal no longer crashes; products suite + image paths largely landed; marketing suite in flight/residual.

---

## Language: “phase” vs plan `P0x`

| Term | Meaning |
|------|---------|
| **Site phases 0–6** | `results/site/ORDER-OF-WORK.md` — this session’s website kill order |
| **Plan `P01`…`P10`** | `Plans/phases/` planner world-standard spine — **separate**; do after site order unless owner reorders |

---

## Site order status

| # | Name | Status | Key evidence / commits |
|---|------|--------|-------------------------|
| 0 | Stop thrash | DONE | `ORDER-OF-WORK.md` |
| 1 | Site loads | DONE | `dfd596a` portal catch; `/` seating portal 200 |
| 2 | Home = design base | DONE | `results/site/design-base-home/` (NOTES, classes, tokens) |
| 3 | Products align to home | DONE | `1f8c26c` grid; `141569c` image paths; `ui-websuite-products/` |
| 4 | Marketing align to home | CHECK | `4c89431` marketing polish; `ui-websuite-marketing/`; re-verify tip |
| 5 | Catalog image residual | QUEUED | soft-seating hash/imported paths still residual |
| 6 | Portal DB real list | QUEUED | honest UI if list fails; **table/query still broken** for real plans |

---

## Hard rules (do not lose)

1. **`Agents/Agents-css.md`** — **NEVER** edit `site/app/css/core/locked/**`. Custom CSS only outside locked.  
2. **Home = design base** — suite pages align to home; not “skip home forever.”  
3. **One phase at a time** — agents only inside active phase (≤2 writers, different packages).  
4. **Evidence** only under repo-root `results/`.  
5. **No worktrees.** Commit/push as you go.

---

## Major lands this arc (not exhaustive)

| Area | What |
|------|------|
| CSS fence | `Agents/Agents-css.md` + AGENTS/ELON pointers |
| Dev speed | `pnpm run dev` → Turbopack; `dev:webpack` opt-in |
| Black images | Raster placeholder; pad/sibling path resolve; no SVG next/image 400 |
| Stacked images | Media isolation, `key={imgSrc}` |
| Portal | Catch list failure → usable shell + error panel |
| AFC brand | Stripped from favicons/copy/assets earlier in session |
| P07 journey | CP-07 rewrite (earlier); planner residual still open |

---

## Known residuals (honest)

- **Portal:** UI loads; **real plan list** still fails if `oando_plans` query broken — need DB/schema/env fix for true function.  
- **Product thumbs:** many real files now resolve (seating ~76/76 flagships per image-path agent); imported/hash paths still placeholders.  
- **Workstations category empty** in local catalog (data, not chrome).  
- **Phase 4** marketing agents may have partially landed — confirm `results/site/ui-websuite-marketing/` + tip.  
- **Planner plan `P04`+** not the active site order.

---

## Next session — start here

1. `git pull` · `git log -5` · read `results/site/ORDER-OF-WORK.md`  
2. If phase 4 incomplete → finish marketing suite only  
3. Then **phase 5** image residual **or** **phase 6** portal DB (owner pick)  
4. Only then resume **Plans `P0x`** planner residual  

**Dev restart:** kill node → `cd site; pnpm run dev` (repo `.env.local`).

---

## Evidence map

```
results/site/
  ORDER-OF-WORK.md
  design-base-home/
  ui-websuite-products/
  ui-websuite-marketing/
  ui-agent-a-home/          # earlier home polish (design base related)
  ui-agent-b-seating/
  a11y-homepage/            # optional a11y residual
```

---

## Do not claim

- Full website “done”  
- Portal cloud plans working  
- Locked CSS rewritten  
- Planner CP-04+ closed this session  
