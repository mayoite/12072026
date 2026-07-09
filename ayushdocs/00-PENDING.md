# Pending list (owner)

**Last updated:** 2026-07-09 (truth-lock — authority docs ↔ `results/planner/world-standard-wave/`)  
**Rule:** finish open kill-path fully before inventing a new epic. Resolve blockers; do not park them.  
**Honesty:** P0.1–P0.3 are **spine**, not ship quality. Owner rejected thin “journey only” bar.  
**Active standard:** `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`  
**W0:** **Unlocked — Approach A** (product journey first). Recorded in `Plans/trustdata/00-START.md` + `results/planner/world-standard-wave/00-start/NOTES.md`.  
**Evidence:** `results/planner/world-standard-wave/` · truth map `TRUTH-LOCK.md`  
**Agents / one-task:** `AGENTS.md` only.

Legend: `W` world-standard · `P0` spine history · `P1` hard path · `OPS` infra

---

## W — World-standard planner (ACTIVE)

| # | Item | Status |
|---|------|--------|
| **W0** | Design + approach | **UNLOCKED — Approach A** (product-journey first; B/C not selected) |
| **W1–W2** | Draw + place journey + symbols | **PASS** evidence — `02-browser-open3d-journey/`, `05-symbols-svg/` |
| **W3** | Select / delete / undo (furniture) | **PASS** — `03-select-delete/` |
| **W4** | Orbit + 2D↔3D continuity | **PASS** — unit + browser (`04-orbit-continuity/` browser-run.json + shots) |
| **W5–W6** | Save hard-reload + local-only honesty | **PASS** — `06-save-honesty/` (local IDB only; not cloud) |
| **W7** | Mesh quality bar (cabinet-v0) | **PASS** bar met — `08-mesh-quality/`; residual: raise readability later (not photoreal) |
| **W8** | Shortcuts map truth | **PASS** — `09-shortcuts-chrome/` |
| **Pack** | CP-10 handover + E: backup | **OPEN** — `10-handover/` missing; needs CP-04 closed first |
| **Research** | Competitive ideas only — `D:\websites\research\2026-07-09-world-standard\` | Packed |

**Not blocked on W0.** Gates run against evidence; open pack residual is **CP-10 handover** (optional next).

---

## Honest residuals (not “blocked on W0”)

| Residual | Note |
|----------|------|
| **W4 browser orbit/continuity e2e** | **Closed** — configurator Place 4 seats path; orbit attr + count restore |
| **Mesh quality raise** | Cabinet-v0 / workstation multiparts still boxy; handles/legs/AO later — bar already PASS for readable parts |
| **Fabric full stage** | Destination still later (Approach A); flag OFF expected |
| **Cloud / member save** | W6 is local-only honesty; cloud wire is a later gate if owner wants |
| Openings select browser | Unit landed; no dedicated e2e yet |
| Wall delete cascade browser | Unit landed; no UI e2e yet |
| `next build` `/contact` createContext | Pre-existing build gate — separate |
| SSR / multi-tenant catalogs | Later |

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
