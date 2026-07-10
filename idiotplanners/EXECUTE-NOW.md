# EXECUTE-NOW — Single spine (do not run both plan trees)

**Date:** 2026-07-10  
**Status:** Binding execute board for residual + re-prove work  
**Checkout:** `D:\OandO07072026` main only · **no worktrees**

---

## 1. What you use (read this once)

| Role | Path | Use |
|------|------|-----|
| **PRIMARY execute package** | `plans1/` | 00-START → EXECUTABLE-PLAN → P11 |
| **PRIMARY deep plans + reviews** | `idiotplanners/` | From **Idiots2**; full tasks when a phase needs detail |
| **SECONDARY reference only** | `idiotplanners2/` + `plans2/` | From **Idiots**; cross-check, never a second full program |
| **Product truth** | Live `site/features/planner/` + open3d | **Repo wins** over any plan PASS prose |

**Do not** execute P01–P10 twice (idiotplanners then idiotplanners2).  
**Do** one kill order below. Use the secondary tree only when primary is silent or conflicts — then **repo decides**.

This file is **copied** into:

- `plans1/EXECUTE-NOW.md` (canonical)
- `plans2/EXECUTE-NOW.md`
- `idiotplanners/EXECUTE-NOW.md`
- `idiotplanners2/EXECUTE-NOW.md`

All four should stay **identical**. Edit `plans1/EXECUTE-NOW.md` first, then re-copy.

---

## 2. Suggested changes applied (from code reviews)

These replace raw plan prose when they disagree:

| # | Change | Why (reviews) |
|---|--------|----------------|
| C1 | **One spine only** — primary = Idiots2 / `idiotplanners` / `plans1` | Dual trees are parallel drafts, not two programs |
| C2 | **`results/` missing ⇒ every historical CP/GATE PASS is unproven** | Both review waves; owner deleted evidence |
| C3 | **Re-prove / residual only** — do not rewrite engines, mesh toe, symbol geometry, or keyboard map invert when unit-green | P02/P05/P08/P09 reviews |
| C4 | **Brainstorm paths** → `archive/Idiots/` and `archive/Idiots2/` (root Idiots* often absent) | P01–P02 reviews both trees |
| C5 | **Windows greps** — do not assume `rg` on PATH; use repo tools / Select-String / fail-closed | P01 reviews |
| C6 | **E2E honesty** — furniture **count alone is not UUID/mm/rotation proof** (W3/W4/W5/W1–W2) | P03/P04/P06/P07 |
| C7 | **P06 real residual** — help still lies about account save slots; tighten save labels/testids/flush; UUID e2e | Both P06 reviews |
| C8 | **P07 real residual** — journey rewrite: cabinet-v0 identity, Opening, second SKU from place action, proof JSON | Both P07 reviews |
| C9 | **P09 residual** — fix stale `aria-keyshortcuts`; rail a11y; evidence under `09-shortcuts-chrome/` | Both P09 reviews |
| C10 | **P10 Mode A only** until wave green on HEAD — Mode B / CP-10 PASS blocked | Both P10 reviews |
| C11 | **P11** after P01–P10 residual DONE — integration close-out, not a rewrite phase | plans1 package |
| C12 | Evidence **only** repo-root `results/planner/world-standard-wave/<canonical>/` — never `site/results/` | AGENTS.md |

---

## 3. Kill order (serial — one phase at a time)

```
P00  00-START / session zero
  → P01  product-truth inventory + evidence shell
  → P02  engine-lock freeze + re-prove (no engine rebuild)
  → P03  W3 select/delete residual units + browser re-prove
  → P07  W1–W2 draw/place journey (real residual)
  → P06  W5–W6 save honesty (real residual)
  → P04  W4 orbit continuity re-prove + harden
  → P05  W2 symbols re-prove ONLY (no geometry thrash)
  → P08  W7 mesh evidence + smoke honesty (no toe rewrite)
  → P09  W8 aria + rail + evidence
  → P10  Mode A FAIL-honest handover pack
  → P11  world-standard close-out (plans1/P11-CHECKLIST.md)
```

**Folder numbers under results ≠ phase numbers.** Map:

| Order | Phase | Evidence folder (`results/planner/world-standard-wave/`) | Deep plan | Review (primary) | Review (secondary) |
|------:|-------|----------------------------------------------------------|-----------|------------------|--------------------|
| 0 | P00 | `00-start/` optional | `plans1/00-START.md` | — | — |
| 1 | P01 | `00-product-truth/` | `idiotplanners/P01-…/IMPLEMENTATION-PLAN.md` | same `CODE-REVIEW-REPORT.md` | `idiotplanners2/P01-…` |
| 2 | P02 | `01-engine-lock/` | `idiotplanners/P02-…` | review | review |
| 3 | P03 | `03-select-delete/` | `idiotplanners/P03-…` | review | review |
| 4 | P07 | `02-browser-open3d-journey/` | `idiotplanners/P07-…` | review | review |
| 5 | P06 | `06-save-honesty/` (+ `save-reload/`) | `idiotplanners/P06-…` | review | review |
| 6 | P04 | `04-orbit-continuity/` | `idiotplanners/P04-…` | review | review |
| 7 | P05 | `05-symbols-svg/` | `idiotplanners/P05-…` | review | review |
| 8 | P08 | `08-mesh-quality/` | `idiotplanners/P08-…` | review | review |
| 9 | P09 | `09-shortcuts-chrome/` | `idiotplanners/P09-…` | review | review |
| 10 | P10 | `10-handover/` | `idiotplanners/P10-…` | review | review |
| 11 | P11 | wave-root integrity | `plans1/P11-CHECKLIST.md` | — | — |

Canonical map also: `Plans/Research/RESULTS-MAP.md`.

---

## 4. Per-phase posture (both reviews merged)

| Phase | Posture | Already landed (do not rebuild) | Residual / re-prove |
|-------|---------|----------------------------------|---------------------|
| **P01** | Inventory + evidence | Dual host, fabric redirects, open3d paths | Grep tooling, path honesty, `00-product-truth/` pack |
| **P02** | Re-prove freeze | Fabric dest, Feasibility interim, orbit helper ON, pins | Unit logs + freeze notes under `01-engine-lock/` |
| **P03** | Residual + re-prove | Select/delete/undo/keyboard largely live | Unit gaps (locked/pose), browser evidence, id honesty |
| **P04** | Re-prove + harden | Orbit defaults, workspace props, data-orbit-enabled | Layer-2 unit if missing; console contract; evidence |
| **P05** | Re-prove **only** | Multi-prim cabinet-v0, doorStyle, units green | Evidence pack; **no** geometry rewrite unless RED |
| **P06** | **Code residual** | IDB flush spine, partial labels | Help honesty, UUID e2e, testids, projectRef/flush gaps |
| **P07** | **Code residual** | Partial journey | Full W1–W2: Opening, cabinet-v0 id, second place, proof JSON |
| **P08** | Evidence + honesty | Toe→carcass→door mesh L2-shaped | Pack + smoke; fix false-green validation stubs if any |
| **P09** | **Code residual** | Map invert + live keydown matrix unit-green | `aria-keyshortcuts`, rail a11y, evidence |
| **P10** | Mode A pack | Layout rules, RESULTS-MAP | FAIL-honest pack; **block Mode B** until wave green on HEAD |
| **P11** | Close-out | — | Integration checklist only after P01–P10 residual DONE |

---

## 5. Session zero checklist

- [ ] On `D:\OandO07072026` main (no worktree)
- [ ] Read `AGENTS.md` evidence rules + this file §1–§3
- [ ] Open `plans1/00-START.md` and finish its checkboxes
- [ ] Record HEAD: `git rev-parse HEAD` → write into evidence NOTES when created
- [ ] Confirm `results/` state: missing or partial → treat as **unproven**
- [ ] Do **not** restore E: backup blindly as “PASS” without re-read on HEAD
- [ ] One phase at a time; tick `plans1/CHECKLIST-MASTER.md` only with artifact paths

---

## 6. How to run one phase

1. Read **primary** `idiotplanners/P0X-…/CODE-REVIEW-REPORT.md` (verdict + residual).
2. Skim **secondary** `idiotplanners2/P0X-…/CODE-REVIEW-REPORT.md` only if needed.
3. Open deep plan `idiotplanners/P0X-…/IMPLEMENTATION-PLAN.md` for residual tasks — **skip** tasks reviews mark “do not rebuild.”
4. Execute residual / re-prove; land logs under correct `results/…/<folder>/`.
5. Commit landable slice; do not claim CP PASS without folder + HEAD + commands.

Master task detail: `plans1/EXECUTABLE-PLAN.md`.  
Why primary over dual-run: `plans1/CHANGES-JUSTIFICATION.md`.

---

## 7. False-green rules (hard fail)

| Trap | Rule |
|------|------|
| Old NOTES say PASS, folder gone | **FAIL** until re-prove |
| E2E furniture **count** only | Not enough for W5 / journey / continuity Done claims |
| Unit green, no tee under `results/` | Not CP evidence |
| Help says “account named save slots” while open3d is local/IDB | Honesty debt (P06) |
| `includesCabinetV0 = true` from body text only | Journey false-green (P07) |
| GATE column green without HEAD re-run | P10 integrity fail |
| Claiming CP-10 Mode B with empty `results/` | **Blocked** |

---

## 8. Stop / ask owner

Stop and ask only if:

- Goal changes (new product area)
- Paid purchase / new seat
- Force-push or destroy remote
- Mode B “declare ship” while wave incomplete
- Restoring backup would overwrite live product intent

Otherwise agent has full freedom to execute residual spine.

---

## 9. Bottom line

**One product. Two plan drafts. One execute path.**

Primary: **`plans1` + `idiotplanners` (Idiots2 reviews)**.  
Secondary: **`plans2` + `idiotplanners2`** = reference.  
Work: **re-prove evidence + real residuals (P06/P07/P09 + honesty)** — not dual greenfield.

---

## 10. Quick links

| Doc | Path |
|-----|------|
| Session zero | `plans1/00-START.md` |
| Master tasks | `plans1/EXECUTABLE-PLAN.md` |
| Flat board | `plans1/CHECKLIST-MASTER.md` |
| P11 close-out | `plans1/P11-CHECKLIST.md` |
| Why changes | `plans1/CHANGES-JUSTIFICATION.md` |
| Primary plans | `idiotplanners/README.md` |
| Secondary plans | `idiotplanners2/README.md` |
| Evidence map | `Plans/Research/RESULTS-MAP.md` |
