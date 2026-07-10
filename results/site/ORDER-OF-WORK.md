# Website / suite — ordered work (stop thrash)

**Date:** 2026-07-10  
**Rule:** One phase complete with proof, then next. No parallel epics.  
**Design base:** Homepage is the visual system root. Suite pages align to it.  
**CSS:** `Agents/Agents-css.md` — never edit `site/app/css/core/locked/**`.

---

## Kill order (site UI + function)

| # | Phase | Done when | Evidence |
|---|--------|-----------|----------|
| **0** | **Baseline / stop thrash** | This file + tip stable; no concurrent writers on same package | `ORDER-OF-WORK.md` |
| **1** | **Site loads** | `/`, `/products/seating/`, `/portal/` return usable pages (no 500 / red error boundary) | curl + Chrome NOTES |
| **2** | **Home = design base (verify only unless broken)** | Document home tokens/classes used as base; fix only if base itself is broken | `results/site/design-base-home/` |
| **3** | **Products suite align to home** | Seating (then one more category) grid/media/spacing matches home card language | `results/site/ui-websuite-products/` |
| **4** | **Marketing suite align to home** | Projects + trusted-by (then portfolio) match shell/type/card language | `results/site/ui-websuite-marketing/` |
| **5** | **Catalog image paths** | Real thumbs where files exist; honest placeholder only when missing | path resolve + sample PNGs |
| **6** | **Portal functional** | List plans or honest empty; no uncaught DB crash | portal NOTES + pass/fail |

**Planner open3d residual (P04/P08/…)** stays **after** site order unless owner reorders.

---

## Explicitly not now

- Homepage “vanity” redesign  
- Parallel agents on home + products + planner  
- Locked CSS rewrites  
- New product features  

---

## Status

| Phase | Status |
|-------|--------|
| 0 | **DONE** — this file |
| 1 | **DONE** — portal no longer red-boundary (`dfd596a`); `/` seating portal 200 |
| 2 | **DONE** — `results/site/design-base-home/` |
| 3 | **DONE** — `results/site/ui-websuite-products/` |
| 4–6 | queued |

---

## Active rule for agents

```
One phase only. CSS: Agents/Agents-css.md.
Home = design base (phase 2). Suite = align (3–4).
Evidence under results/site/.
```
