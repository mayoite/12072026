# Session recap — 2026-07-10 (site suite + process)

**Checkout:** `D:\OandO07072026` · branch `main`  
**Tip at save (approx):** `1f8c26c` / later marketing commits may sit above — **re-check** `git log -5`  
**Dev:** `cd site; pnpm run dev` → **Turbopack** default (`dev:webpack` if needed). Loads **repo-root** `.env.local` via `loadEnvLocal` in next.config.

---

## One sentence

Stopped thrash with ordered site phases; home is design base; locked CSS fenced; portal no longer crashes; products suite + image paths largely landed; marketing suite in flight/residual.

---

## Language: multi-track IDs (not “phase” alone)

**Handbook:** `Agents/Agents-tracks.md` · **Board:** `results/site/ORDER-OF-WORK.md`

| Track | IDs | Meaning |
|-------|-----|---------|
| **Site / design suite** | **D0–D6** | Website load + UI align (home = design base) |
| **Plans** | **P01–P10** | `Plans/phases/` planner spine |
| **Admin** | **A1, A2…** | Admin product |
| **AI** | **AI1, AI2…** | Assistant / AI product |

**Parallel OK:** `D4` + `A1` + `P07` (different tracks).  
**Forbidden:** `D3`+`D4` or `P01`+`P02` (same track).  
Letter prefix optional; **serial within track** is the real rule.

---

## Site track `D*` status

| ID | Name | Status | Key evidence / commits |
|----|------|--------|-------------------------|
| D0 | Stop thrash | DONE | `ORDER-OF-WORK.md` |
| D1 | Site loads | DONE | `dfd596a` portal catch; `/` seating portal 200 |
| D2 | Home = design base | DONE | `results/site/design-base-home/` |
| D3 | Products align to home | DONE | `1f8c26c`, `141569c`, `ui-websuite-products/` |
| D4 | Marketing align to home | CHECK | `4c89431`, `ui-websuite-marketing/` |
| D5 | Catalog image residual | QUEUED | imported/hash paths |
| D6 | Portal real DB list | QUEUED | list still fails under the hood |

---

## Hard rules (do not lose)

1. **`Agents/Agents-css.md`** — **NEVER** edit `site/app/css/core/locked/**`. Custom CSS only outside locked.  
2. **Home = design base** — suite pages align to home; not “skip home forever.”  
3. **One ID per track** — parallel tracks OK; never two IDs of same track. Use agents to save head context.  
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
2. Finish **D4** if open; then **D5** or **D6** (one only)  
3. May start **A1** or **AI1** in parallel with a **D\*** only if packages do not clash  
4. **P\*** planner: one P at a time; can parallel a D/A/AI  

**Use agents** for heavy slices — head only orders tracks and merges.

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
