# PlansA — Merged residual execute package (PRIMARY)

**Checkout:** `D:\OandO07072026` main only · **no worktrees**  
**Date:** 2026-07-10  
**Role:** **Single execute path** for the world-standard residual wave. Supersedes dual-running `plans1/` then `plans2/`.  
**Difference matrix (4-way):** [`MATRIX-Plans-vs-plans2-vs-PlansA.md`](./MATRIX-Plans-vs-plans2-vs-PlansA.md) — **Plans · plans1 · plans2 · PlansA** (folders stay separate)  
**10 phase difference docs (+ archive/Plans):** [`diff/`](./diff/) — `01`…`10` highlighting main deltas across **archive/Plans · Plans · PlansA · plans1 · plans2**

---

## Both sources read

| Source | Lineage | Role in merge |
|--------|---------|---------------|
| [`plans1/`](../plans1/) | Idiots2 (`archive/Idiots2/`) + code reviews | Prefer when both agree; denser residual task spine |
| [`plans2/`](../plans2/) | Idiots (`archive/Idiots/`) + code reviews | Cross-check; stricter honesty kept when stricter |

**Coverage honesty (this package write):**

| Class | Coverage |
|-------|----------|
| Package roots both (README, EXECUTE-NOW, 00-START, EXECUTABLE-PLAN, CHECKLIST-MASTER, P11, CHANGES-JUSTIFICATION, REFERENCES) | **Full read** |
| All `P01–P10/CODE-REVIEW-REPORT.md` (plans1 + plans2 = 20 files) | **Full read** |
| Residual IMPL: P06, P07, P09 (plans1 + plans2) | **Full** (headers, residual tables, task maps, key code contracts) |
| Re-prove IMPL: P01–P05, P08, P10 (plans1 + plans2) | **Open + section-header skim** + residual/re-prove posture from CODE-REVIEW; deep TDD dumps not re-pasted |

Do **not** treat historical `plans1` “primary / plans2 secondary” as still requiring two programs. **PlansA is the one program.**

---

## Start here

| Doc | Role |
|-----|------|
| [**EXECUTE-NOW.md**](./EXECUTE-NOW.md) | Binding single spine + kill order |
| [**00-START.md**](./00-START.md) | Session zero |
| [**EXECUTABLE-PLAN.md**](./EXECUTABLE-PLAN.md) | Master residual tasks Task 00…N |
| [**CHECKLIST-MASTER.md**](./CHECKLIST-MASTER.md) | Flat P00–P11 board |
| [**P11-CHECKLIST.md**](./P11-CHECKLIST.md) | Final close-out |
| [**MERGE-NOTES.md**](./MERGE-NOTES.md) | plans1 vs plans2 decisions |
| [**CHANGES-JUSTIFICATION.md**](./CHANGES-JUSTIFICATION.md) | Why residual / one spine |
| [**REFERENCES.md**](./REFERENCES.md) | Path map back to plans1/plans2 |

## Per-phase folders (P01–P10) — full set lives here

Each phase has **both** trees’ files (not only package docs):

| File in `PlansA/P0X-*/` | Meaning |
|-------------------------|---------|
| `IMPLEMENTATION-PLAN.md` | Primary (from plans1) |
| `CODE-REVIEW-REPORT.md` | Primary review (from plans1) |
| `IMPLEMENTATION-PLAN.plans2.md` | Secondary plan (from plans2) |
| `CODE-REVIEW-REPORT.plans2.md` | Secondary review (from plans2) |
| `README.md` | Provenance for that phase |

| Phase | Folder |
|-------|--------|
| P01 | [P01-product-truth/](./P01-product-truth/) |
| P02 | [P02-engine-lock/](./P02-engine-lock/) |
| P03 | [P03-select-delete/](./P03-select-delete/) |
| P04 | [P04-orbit-continuity/](./P04-orbit-continuity/) |
| P05 | [P05-symbols-svg/](./P05-symbols-svg/) |
| P06 | [P06-save-honesty/](./P06-save-honesty/) |
| P07 | [P07-draw-place-journey/](./P07-draw-place-journey/) |
| P08 | [P08-mesh-quality/](./P08-mesh-quality/) |
| P09 | [P09-shortcuts-chrome/](./P09-shortcuts-chrome/) |
| P10 | [P10-evidence-handover/](./P10-evidence-handover/) |

Deep recovery: open **`PlansA/P0X-*/IMPLEMENTATION-PLAN.md`** first; cross-check `*.plans2.md`. Sources `plans1/` and `plans2/` remain as originals.

---

## Merge rules (binding)

1. **One execute path** — PlansA only; no dual-run plans1 then plans2.
2. **Repo + code reviews win** over rewrite pastes and phase-card PASS.
3. Prefer **plans1** when both agree; when conflict, prefer **stricter residual / honesty** from either review.
4. **Residual code:** P06, P07, P09 (+ small P03 unit gaps, P04 wiring/console harden).
5. **Re-prove only:** P01, P02, P05, P08 (no geometry thrash if unit green).
6. **P10 Mode A** until wave map-min green on HEAD; Mode B blocked until then.
7. **P11** after P01–P10 residual DONE.
8. Evidence **only** `results/planner/world-standard-wave/<canonical>/`.
9. Brainstorm: `archive/Idiots2/` (plans1 lineage), `archive/Idiots/` (plans2 lineage). Root `Idiots*` absent.

---

## Kill order

```
P00 → P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10 → P11
```

---

## How to execute

1. Read [EXECUTE-NOW.md](./EXECUTE-NOW.md) + [00-START.md](./00-START.md); complete session zero.
2. One phase at a time per kill order; tick [CHECKLIST-MASTER.md](./CHECKLIST-MASTER.md) with **disk paths**.
3. For residual code phases, follow [EXECUTABLE-PLAN.md](./EXECUTABLE-PLAN.md) checkboxes; open `PlansA/P0X-*/CODE-REVIEW-REPORT.md` first, optional `CODE-REVIEW-REPORT.plans2.md`.
4. Deposit evidence under RESULTS-MAP folders only.
5. Close with [P11-CHECKLIST.md](./P11-CHECKLIST.md) → SHIP-HONESTY READY or NOT READY.

**Sources preserved:** `plans1/` and `plans2/` are **not** deleted. PlansA supersedes them as execute authority only.
