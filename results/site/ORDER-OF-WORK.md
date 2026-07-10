# Multi-track work order (save context · use agents)

**Date:** 2026-07-10  
**Law:** One **phase ID per track** at a time. **Parallel across tracks OK.** Never two phases of the **same** track.

Prefix letter is **not** sacred — pick one and stick to it. What matters is **ID uniqueness + serial within track**.

---

## Tracks (examples)

| Track | Prefix (example) | Meaning | Serial rule |
|-------|------------------|---------|-------------|
| **Site / design suite** | `D0`…`D6` (or `S0`…) | Website UI + load + portal shell | Never `D3`+`D4` together |
| **Plans (planner product)** | `P01`…`P10` | `Plans/phases/` world-standard | Never `P01`+`P02` together |
| **Admin** | `A1` `A2`… | Admin surface | Never `A1`+`A2` together |
| **AI / assistant** | `AI1` `AI2`… | Site assistant / AI product | Never `AI1`+`AI2` together |

### Parallel examples (OK)

- `D3` + `A1` + `P07` at once (different tracks, different packages)  
- `AI1` + `D5` if packages do not collide  

### Forbidden

- `P01` and `P02` in parallel  
- `D3` and `D4` in parallel  
- Two writers on the same package  

**Agents:** Prefer subagents for heavy work so head window stays small. Brief: `/using-superpowers` + track ID + `Agents/Agents-css.md` if UI.

---

## Site track (`D*`) — status

| ID | Name | Status | Evidence |
|----|------|--------|----------|
| **D0** | Stop thrash / this file | **DONE** | this file |
| **D1** | Site loads (`/`, seating, portal usable) | **DONE** | `dfd596a` |
| **D2** | Home = design base (inventory) | **DONE** | `results/site/design-base-home/` |
| **D3** | Products suite align to home | **DONE** | `1f8c26c`, `141569c`, `ui-websuite-products/` |
| **D4** | Marketing suite align to home | **DONE** | `4c89431`, `ui-websuite-marketing/D4-CLOSED.md`, `d4-close/*`, NOTES + after/* |
| **D5** | Catalog image residual | **DONE** (path code) | `ui-websuite-products/D5-IMAGE-RESIDUAL.md` — 268/279 flagships; **11** need asset/JSON migration |
| **D6** | Portal real DB list | queued | honest error UI only so far |

**Design base:** Homepage. Suite aligns to home.  
**CSS:** never edit `site/app/css/core/locked/**` (`Agents/Agents-css.md`).

---

## Other tracks (placeholders — owner fills order)

| ID | Status |
|----|--------|
| **A1**… | not started this arc |
| **AI1**… | not started this arc |
| **P07** etc. | planner residual after site D* or owner reorders |

---

## Active

```
Tracks may run in parallel: D* · A* · AI* · P*
Within a track: one ID only.
D5 path residual DONE (47 slug-folder wins). 11 SKUs still need assets/data migration — not more path heuristics.
Next site track: D6 when activated.
Evidence: results/<track-or-site>/…
```
