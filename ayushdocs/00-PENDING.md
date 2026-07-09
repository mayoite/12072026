# Pending list (owner)

**Last updated:** 2026-07-09 (non-stop wave: tests + P0.2 UI wire + P0.3 a11y code)  
**Rule:** finish P0.n fully before starting P0.n+1. Resolve blockers; do not park them.  
**Tests do not block other work** — run in parallel agents.

Legend: `P0` product spine · `P1` hard path · `P2` plan/platform · `OPS` infra

---

## P0 — Product spine

| # | Item | Status |
|---|------|--------|
| **P0.1** | Admin SVG publish E2E + dev auth bypass | **DONE** |
| **P0.2** | G5 write + stamp + G8 URL + **cabinet-v0 UI place wire** | **DONE** (unit); Chrome visual optional |
| **P0.3** | Nested `main` + `data-viewport` hydration | **DONE** (code) |
| **P0.4** | “Good mesh” bar + browser visual smoke | **NEXT** |

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
