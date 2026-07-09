# Pending list (owner)

**Last updated:** 2026-07-09 (world-standard wave — superpowers + 7 agents)  
**Rule:** finish open kill-path fully before inventing a new epic. Resolve blockers; do not park them.  
**Honesty:** P0.1–P0.3 are **spine**, not ship quality. Owner rejected thin “journey only” bar.  
**Active standard:** `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` (awaiting approach approval)  
**Evidence:** `results/planner/world-standard-wave/WAVE.md`  
**One owner task at a time** — finish it. Parallel agents (max 8–10) only **inside** that task; tests as sibling agents for the same task, never multi-epic thrash.

Legend: `W` world-standard · `P0` spine history · `P1` hard path · `OPS` infra

---

## W — World-standard planner (ACTIVE)

| # | Item | Status |
|---|------|--------|
| **W0** | Design + approach (A product-journey / B Fabric-first / C chrome-first) | **NEEDS OWNER PICK** |
| **W1–W8** | See design spec gates (draw, place, select/delete, 2D↔3D+orbit, save/reload, honest save, mesh bar, shortcuts) | Blocked on W0 |
| **Research** | Competitive ideas only — `D:\websites\research\2026-07-09-world-standard\` | Packed |

---

## P0 — Product spine (history — not “done product”)

| # | Item | Status |
|---|------|--------|
| **P0.1** | Admin SVG publish E2E + dev auth bypass | **DONE (spine)** |
| **P0.2** | G5 write + stamp + G8 URL + **cabinet-v0 UI place wire** | **DONE (unit)** — not browser product |
| **P0.3** | Nested `main` + `data-viewport` hydration | **DONE (code)** |
| **P0.4** | “Good mesh” bar + browser visual smoke | **Absorbed into W7 + W2** |

### Residuals (not open blockers)

| Item | Note |
|------|------|
| Chrome visual smoke P0.2/P0.3 | Optional re-capture |
| `next build` `/contact` createContext | Build gate — separate |
| SSR 2c/32G | Later |

---

## P1 / P2 / OPS

Unchanged from earlier docs — Fabric cutover, Supabase 2C, SSR later.

## Tech-stack scripts (names kept)

```
pnpm dev:tech-stack
pnpm build:tech-stack
pnpm preview:tech-stack
```

## results/

You do **not** need every old folder — see [16-RESULTS-RETENTION.md](./16-RESULTS-RETENTION.md).
