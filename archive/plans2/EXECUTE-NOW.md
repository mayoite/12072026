# EXECUTE-NOW — Single spine (consolidated)

**Date:** 2026-07-10  
**Canonical path:** `plans1/EXECUTE-NOW.md`  
**Copy:** also `plans2/EXECUTE-NOW.md` (keep identical)  
**Checkout:** `D:\OandO07072026` main only · **no worktrees**

---

## 1. Folders (after consolidate)

| Role | Path | Former name |
|------|------|-------------|
| **PRIMARY (use this)** | `plans1/` | master package + `idiotplanners/` phases |
| **SECONDARY (reference)** | `plans2/` | master package + `idiotplanners2/` phases |
| Redirect stubs only | `idiotplanners/`, `idiotplanners2/` | README → plans1 / plans2 |

Everything for a phase (plan + code review) lives under:

- `plans1/P0X-*/IMPLEMENTATION-PLAN.md` + `CODE-REVIEW-REPORT.md`
- `plans2/P0X-*/…` (secondary)

**Do not** run plans1 and plans2 as two full programs.

---

## 2. Suggested changes (from code reviews)

| # | Change |
|---|--------|
| C1 | One spine: **plans1 primary**, plans2 reference |
| C2 | `results/` missing ⇒ historical CP/GATE PASS unproven |
| C3 | Re-prove / residual only — no engine/mesh/symbol/keymap rewrite when unit-green |
| C4 | Brainstorm paths: `archive/Idiots2/` (primary), `archive/Idiots/` (secondary) |
| C5 | No bare `rg` assumption on Windows — fail-closed greps |
| C6 | E2E count ≠ UUID/mm/rotation proof |
| C7 | **P06** residual: help honesty, UUID e2e, save testids |
| C8 | **P07** residual: journey rewrite (cabinet-v0, Opening, second place, proof JSON) |
| C9 | **P09** residual: `aria-keyshortcuts`, rail a11y, evidence |
| C10 | **P10** Mode A only until wave green on HEAD |
| C11 | **P11** after P01–P10 residual DONE |
| C12 | Evidence only `results/planner/world-standard-wave/<canonical>/` |

---

## 3. Kill order

```
P00 → P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10 → P11
```

| Order | Phase | Evidence folder | Deep plan + review |
|------:|-------|-----------------|--------------------|
| 0 | P00 | `00-start/` optional | `plans1/00-START.md` |
| 1 | P01 | `00-product-truth/` | `plans1/P01-product-truth/` |
| 2 | P02 | `01-engine-lock/` | `plans1/P02-engine-lock/` |
| 3 | P03 | `03-select-delete/` | `plans1/P03-select-delete/` |
| 4 | P07 | `02-browser-open3d-journey/` | `plans1/P07-draw-place-journey/` |
| 5 | P06 | `06-save-honesty/` | `plans1/P06-save-honesty/` |
| 6 | P04 | `04-orbit-continuity/` | `plans1/P04-orbit-continuity/` |
| 7 | P05 | `05-symbols-svg/` | `plans1/P05-symbols-svg/` |
| 8 | P08 | `08-mesh-quality/` | `plans1/P08-mesh-quality/` |
| 9 | P09 | `09-shortcuts-chrome/` | `plans1/P09-shortcuts-chrome/` |
| 10 | P10 | `10-handover/` | `plans1/P10-evidence-handover/` |
| 11 | P11 | wave-root integrity | `plans1/P11-CHECKLIST.md` |

Map also: `Plans/Research/RESULTS-MAP.md`.

---

## 4. Per-phase posture

| Phase | Posture | Residual focus |
|-------|---------|----------------|
| P01 | Inventory + evidence | Pack under `00-product-truth/` |
| P02 | Re-prove freeze | No engine rebuild |
| P03 | Residual + re-prove | Unit gaps + browser evidence |
| P04 | Re-prove + harden | Orbit evidence; no R3F port |
| P05 | Re-prove only | No geometry thrash unless RED |
| P06 | **Code residual** | Help / UUID e2e / labels |
| P07 | **Code residual** | Full journey honesty |
| P08 | Evidence + honesty | No toe rewrite |
| P09 | **Code residual** | aria + rail + evidence |
| P10 | Mode A pack | Mode B blocked until green |
| P11 | Close-out | After residuals DONE |

---

## 5. Session zero

- [ ] On `D:\OandO07072026` main
- [ ] Read this file + `plans1/00-START.md`
- [ ] `git rev-parse HEAD` into evidence NOTES
- [ ] Treat missing `results/` as unproven
- [ ] One phase at a time; tick `plans1/CHECKLIST-MASTER.md` with paths

---

## 6. How to run one phase

1. Read `plans1/P0X-*/CODE-REVIEW-REPORT.md`
2. Optional: `plans2/P0X-*/CODE-REVIEW-REPORT.md` cross-check
3. Residual tasks from `plans1/P0X-*/IMPLEMENTATION-PLAN.md` (skip “do not rebuild”)
4. Land evidence under correct results folder
5. Commit; no CP PASS without folder + HEAD + commands

Master tasks: `plans1/EXECUTABLE-PLAN.md`.

---

## 7. False-green hard fails

| Trap | Rule |
|------|------|
| PASS notes, folder gone | FAIL until re-prove |
| Count-only e2e for identity gates | Not enough |
| Unit green, no `results/` tee | Not CP evidence |
| Account save-slot help while IDB-only | P06 debt |
| Forced cabinet-v0 true from body text | P07 debt |
| Mode B with empty results | Blocked |

---

## 8. Bottom line

**One product. One execute path: `plans1/`.**  
`plans2/` = second draft for reference.  
Work = re-prove + real residuals (P06 / P07 / P09 + honesty).
