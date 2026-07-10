# plans1 — Master executable plan package (P01–P11)

**Created:** 2026-07-10  
**Skill:** writing-plans-repo-brainstorm (repo first → idiotplanners reviews → residual-only execute)  
**Checkout:** `D:\OandO07072026` main only · **no worktrees**  
**Authority:** User Wins · `AGENTS.md` · live repo · **code-review reports win over raw IMPLEMENTATION-PLAN rewrite prose**

---

## Purpose

Synthesize **idiotplanners** P01–P10 (`IMPLEMENTATION-PLAN.md` + `CODE-REVIEW-REPORT.md`) into one coherent package so the next engineer/agent can:

1. Re-prove gates after **`results/` was deleted** (every historical GATE/CP PASS is **unproven**).
2. Execute **residual work only** — do **not** rewrite product code that reviews mark as already landed.
3. Close with **P11** = integration / world-standard close-out / final honest ship gate.

This package is **not** a product feature rewrite. It is an **execute spine** for evidence + residual honesty debt.

**PRIMARY package** for the monorepo. `plans2` + `idiotplanners2` are **reference only** (same product, second draft). Do **not** run both trees end-to-end.

---

## Package contents

| File | Role |
|------|------|
| [**EXECUTE-NOW.md**](./EXECUTE-NOW.md) | **Start here** — single spine, kill order, suggested changes (copied to plans2 + both idiotplanners*) |
| [**00-START.md**](./00-START.md) | Session-zero card — prereqs, first commands, stop rules |
| [**EXECUTABLE-PLAN.md**](./EXECUTABLE-PLAN.md) | Master plan — tasks P00–P10 residual + cross-cutting, test matrix, false-green catalog |
| [**P11-CHECKLIST.md**](./P11-CHECKLIST.md) | Final integration / ship honesty gate after P01–P10 residual DONE |
| [**CHANGES-JUSTIFICATION.md**](./CHANGES-JUSTIFICATION.md) | Why this package differs from raw idiotplanners plans |
| [**CHECKLIST-MASTER.md**](./CHECKLIST-MASTER.md) | Flat checkbox board P00–P11 |
| [**REFERENCES.md**](./REFERENCES.md) | Source path map (idiotplanners, archive, Plans, code anchors) |
| [**README.md**](./README.md) | This index |

---

## Kill order (one spine)

```
P00 session zero (00-START)
  → P01 product-truth evidence (00-product-truth/)
  → P02 engine-lock evidence (01-engine-lock/) + OWNER A or explicit DEFERRAL
  → P03 W3 residual unit gaps + browser (03-select-delete/)
  → P07 W1–W2 journey rewrite + honest identity (02-browser-open3d-journey/)
  → P06 W5–W6 residual honesty + UUID e2e (06-save-honesty/)
  → P04 W4 orbit harden + evidence (04-orbit-continuity/)
  → P05 W2 symbols re-prove only (05-symbols-svg/) — NO geometry thrash
  → P08 W7 mesh evidence + smoke + G5 honesty (08-mesh-quality/) — NO toe rewrite
  → P09 W8 aria + rail + evidence (09-shortcuts-chrome/)
  → P10 Mode A FAIL-honest pack (10-handover/) — Mode B only if all W folders map-min green on HEAD
  → P11 integration close-out (this package P11-CHECKLIST)
```

**Folder numbers ≠ phase numbers** — canonical map: `Plans/Research/RESULTS-MAP.md`.

| Order | Phase | Evidence folder under `results/planner/world-standard-wave/` |
|------:|-------|---------------------------------------------------------------|
| 0 | Session zero | `00-start/` (optional NOTES) |
| 1 | P01 | `00-product-truth/` |
| 2 | P02 | `01-engine-lock/` |
| 3 | P03 | `03-select-delete/` |
| 4 | P07 | `02-browser-open3d-journey/` |
| 5 | P06 | `06-save-honesty/` (+ `save-reload/`) |
| 6 | P04 | `04-orbit-continuity/` |
| 7 | P05 | `05-symbols-svg/` |
| 8 | P08 | `08-mesh-quality/` |
| 9 | P09 | `09-shortcuts-chrome/` |
| 10 | P10 | `10-handover/` |
| 11 | P11 | Wave-root integrity + buyer journey pack (see P11-CHECKLIST) |

---

## How to execute

0. Open **[EXECUTE-NOW.md](./EXECUTE-NOW.md)** (binding single spine + review changes).
1. Open **[00-START.md](./00-START.md)** and complete session-zero checkboxes.
2. Follow **[EXECUTABLE-PLAN.md](./EXECUTABLE-PLAN.md)** Task 00…N in kill order.
3. For each phase residual: land evidence under **repo-root** `results/planner/world-standard-wave/<canonical>/` only.
4. Tick **[CHECKLIST-MASTER.md](./CHECKLIST-MASTER.md)** as you go.
5. After P01–P10 residual DONE criteria: run **[P11-CHECKLIST.md](./P11-CHECKLIST.md)**.
6. If plan vs review conflict: **repo + CODE-REVIEW-REPORT** win. See **[CHANGES-JUSTIFICATION.md](./CHANGES-JUSTIFICATION.md)**.

**Commands primer:** `START.md` · **conduct:** `AGENTS.md` · **evidence rules:** `testing-handbook.md`.

---

## Cross-cutting fixes (every phase)

| Fix | Why |
|-----|-----|
| Brainstormer path = `archive/Idiots2/P0X-…/REPORT.md` | Root `Idiots2/` **absent** (all reviews) |
| Recreate `results/` before claiming any PASS | Entire tree deleted (`a98e29f`); layout gate fails without it |
| PowerShell greps: `rg` may be missing | Prefer `Select-String` / fail-closed if tool absent |
| No `site/results/` or `site/test-results/` | AGENTS layout hard rule · `pnpm run check:layout` |
| Phase-card DONE/PASS = **narrative only** | Reviews: paper-green without disk artifacts |
| No competitor copy | Research ideas under `D:\websites` only |
| Single writer per package; main checkout only | AGENTS parallel rules |

---

## Verdict snapshot (from CODE-REVIEW-REPORT.md)

| Phase | Review verdict | Product rewrite? |
|-------|----------------|------------------|
| P01 | APPROVE-WITH-FIXES | **No** — inventory only |
| P02 | APPROVE-WITH-FIXES | **No** — evidence lock |
| P03 | APPROVE-WITH-FIXES | **No** — Mode A gap tests |
| P04 | APPROVE-WITH-FIXES | Minimal harden only |
| P05 | APPROVE re-prove only | **No** unless units RED |
| P06 | FAIL / NOT GREEN | **Yes residual** honesty/ids/help |
| P07 | CONDITIONAL APPROVE | **Yes** journey rewrite (not product engine) |
| P08 | CONDITIONAL mesh OK · CP FAIL | Evidence + smoke; **no** toe rewrite |
| P09 | APPROVE residual | aria + rail + evidence |
| P10 | Mode A only · Mode B blocked | Pack honesty only |

Full table + residual checklists: [EXECUTABLE-PLAN.md](./EXECUTABLE-PLAN.md).

---

## Done when (package)

- [x] All required docs under `plans1/` exist with real content
- [ ] Executor completes P00–P11 checklists with live `results/` evidence
- [ ] No false-green CP/W PASS without map-minimum artifacts on **this** HEAD

**Ethics:** no competitor clone. **YAGNI:** refuse virgin engine/geometry rewrites reviews forbid.
