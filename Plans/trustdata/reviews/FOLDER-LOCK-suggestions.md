# FOLDER-LOCK — evidence path reconciliation (2026-07-09)

> **Status:** **APPLIED** 2026-07-09 into RESULTS-MAP, CHECKPOINTS, MASTER-CHECKLIST, AGENT-RULES, 00-START, INDEX, RESEARCH-MAP phase routing, and phases P01/P02/P08/P09/P10.  
> **Scope:** Trustdata plan docs only — no product code, no evidence tree moves (gate folders still create-on-execute).  
> **Authority after apply:** `Plans/trustdata/RESULTS-MAP.md` (this lock). Older reviews (P09 S1 dual-`08`, MAPS dual-`08`, P10 “ban 09”) are **superseded** for path names.

---

## Problem (repo data)

| Conflict | What experts did | Why it collides |
|----------|------------------|-----------------|
| Dual `08-*` | P08 mesh → `08-mesh-quality/`; P09 revised to `08-shortcuts-chrome/` (to match then-RESULTS-MAP) | Same numeric prefix for **W7** and **W8**; P10 anti-drift banned `09-*` while P09 phase originally wanted `09-*` |
| Dual `01-*` | P01 → `01-product-truth/`; P02 expert → `01-engine-lock/` (not `02-engine-lock`) | Two different phases share `01-` prefix; hard to scan folder list |
| Journey owns `02-*` | P07 correctly uses gold path `02-browser-open3d-journey/` | Blocks any “P02 = 02-engine-lock” scheme |

No invented schemes beyond owner lock below.

---

## FINAL lock (owner 2026-07-09)

Root: `results/planner/world-standard-wave/`

| Phase / gate | Canonical folder | Notes |
|--------------|------------------|-------|
| CP-00 / W0 | `00-start/` | Unchanged |
| **P01** baseline | **`00-product-truth/`** | Was `01-product-truth/` — frees `01-` for engine |
| **P02** engine | **`01-engine-lock/`** | Not `02-engine-lock/` (journey owns `02-`) |
| **P07** W1–W2 browser | **`02-browser-open3d-journey/`** | Design gold path; optional alias `07-browser-journey/` pointer only |
| **P03** W3 | **`03-select-delete/`** | Unchanged |
| **P04** W4 | **`04-orbit-continuity/`** | Unchanged |
| **P05** W2 symbols | **`05-symbols-svg/`** | Unchanged |
| **P06** W5–W6 | **`06-save-honesty/`** (+ `save-reload/` for W5) | Unchanged |
| **P08** W7 | **`08-mesh-quality/`** | Unchanged; sole `08-*` |
| **P09** W8 | **`09-shortcuts-chrome/`** | Was wrongly locked to `08-shortcuts-chrome/` |
| **P10** pack | **`10-handover/`** | Unchanged |

**No `07-*` primary gate folder** (journey stays `02-*`). Do not invent `07-mesh-*` or similar.

---

## Suggestions applied

| ID | Priority | Change |
|----|----------|--------|
| FL-1 | P0 | P01 evidence root → `00-product-truth/` everywhere (not phase filename `P01-product-truth.md`) |
| FL-2 | P0 | P09 / W8 evidence root → `09-shortcuts-chrome/` everywhere |
| FL-3 | P0 | Reverse P09/P10 “ban `09-shortcuts-chrome`” anti-drift; new anti-drift: **do not** use `08-shortcuts-chrome/` for W8 |
| FL-4 | P0 | RESULTS-MAP: dual-`08` gone; dual-`01` gone; aliases for retired names |
| FL-5 | P0 | CHECKPOINTS CP-01 + CP-09 paths updated |
| FL-6 | P0 | MASTER-CHECKLIST P01/P09/W8 paths updated |
| FL-7 | P0 | AGENT-RULES evidence table + stream ownership paths updated |
| FL-8 | P1 | P01/P08/P09/P10 phase narrative + expert notes acknowledge this lock |
| FL-9 | P1 | P02 folder note still forbids `02-engine-lock/`; mention P01 is `00-product-truth/` so `01-engine-lock/` is unique |
| FL-10 | P2 | INDEX: one-line pointer that RESULTS-MAP holds FINAL folder lock |

---

## Retired names (pointer only if ever created)

| Retired / mistaken | Points to | Rule |
|--------------------|-----------|------|
| `01-product-truth/` | `00-product-truth/` | `NOTES.md` absolute pointer; do not split artifacts |
| `08-shortcuts-chrome/` | `09-shortcuts-chrome/` | Same |
| `02-engine-lock/` | `01-engine-lock/` | Already forbidden by P02 expert revise |
| `09-shortcuts-chrome/` (as “invented”) | — | **No longer retired** — this **is** canonical W8 |

---

## Supersedes (do not re-apply)

- `reviews/P09-suggestions.md` S1 (“use `08-shortcuts-chrome/` not `09-`”) — **reversed by this lock**
- `reviews/P10-suggestions.md` S2 anti-drift “do not invent `09-…`” — **reversed for W8 only**
- `reviews/P01-suggestions.md` paths using `01-product-truth/` — evidence root only; phase file name unchanged
- P08 note that P09 lives under `08-shortcuts-chrome/` — update to `09-shortcuts-chrome/`

Phase **file** names stay `P01-product-truth.md` … `P10-evidence-handover.md` (plan IDs ≠ evidence folder numbers).

---

## Verify after apply (docs grep)

Expect **zero** of these as **canonical** claim (alias sections may still name them as retired):

- Agent contracts claiming W8 → `08-shortcuts-chrome/` without “retired”
- Agent contracts claiming P01 evidence → `01-product-truth/` without “retired”
- Dual statement “two folders share the `08-` prefix by design”

Expect present:

- `00-product-truth/` for P01 / CP-01  
- `09-shortcuts-chrome/` for P09 / CP-09 / W8  
- `08-mesh-quality/` for P08 / W7 only  

---

## Not in scope

- Creating empty folders under `results/planner/world-standard-wave/`
- Renaming any existing evidence (none of these dirs required yet)
- Product code, commits beyond owner “commit as we go” for this docs slice
- Changing design-spec wording outside trustdata pack
