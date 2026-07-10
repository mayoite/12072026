# Five-seat synthesis — full ownership of all four plan trees

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` HEAD `eeb86bf` (re-check)  
**Method:** Four parallel **tree-owner** agents (each owns one tree only) → **fifth seat: head synthesis**  
**Unlike prior four-seat review:** each owner was required to fully inventory **their** tree (not skim plans1-only).

| Seat | Tree | Confidence | Files owned |
|------|------|------------|------------:|
| Owner 1 | **Plans/** | MED–HIGH | 78 |
| Owner 2 | **plans1/** | HIGH | 30 |
| Owner 3 | **plans2/** | HIGH (~0.90) | 28 |
| Owner 4 | **PlansA/** | HIGH (0.92) | 70 |
| **Seat 5** | **All four** | Synthesis | — |

Full owner reports live in agent transcripts; this file is the **cross-tree** decision record.

---

## 1. What each tree is (disk-true)

| Tree | Files | Genre | Execute residual? | Best use |
|------|------:|-------|-------------------|----------|
| **Plans/** | 78 | Program **how** + RESULTS-MAP + Others hub | **No** | Folder names, W gates, kill-order *history*, expert essays |
| **plans1/** | 30 | Residual **execute** package (2 files/phase) | **Yes — PRIMARY** | Day-to-day residual wave |
| **plans2/** | 28 | Residual package twin (Idiots) | **Reference only** (harder FAIL language) | Override soft APPROVE; P06 leave-flush detail |
| **PlansA/** | 70 | Merge dump (5 files/phase + matrix + 10 diffs) | **No — research only** | MERGE-NOTES / dual-review comparison |

---

## 2. Authority graph (after all four owners)

```
Owner message
  → AGENTS.md
      → plans1/START-HERE.md     ← residual EXECUTE (only)
      → Plans/Research/RESULTS-MAP.md  ← evidence folder lock
      → plans2/ CODE-REVIEW only ← if FAIL vs plans1 APPROVE → gate FAIL
      → PlansA/                  ← optional archaeology; do not run
```

| Doc layer | Plans | plans1 | plans2 | PlansA |
|------------|-------|--------|--------|--------|
| Self-claimed role | How + maps; residual → plans1 | PRIMARY execute | README: secondary; **00-START/EXECUTABLE: sole** | README: research; **EXECUTE-NOW: PRIMARY** |
| Owner consensus | Honest about not being execute | Best runbook | Split-brain inside package | Worst split-brain |

**Critical:** plans2 and PlansA both still have **internal** docs that fight their own README. An agent that opens the wrong first file dual-runs or thrash-executes.

---

## 3. Kill order (all residual packages agree)

```
P00 → P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10 → P11
```

Plans/ program cards use same middle spine (without formal P00/P11 package).  
**Folder numbers ≠ phase numbers** — RESULTS-MAP wins (`P07` → `02-browser-…`, `P02` → `01-engine-lock/`).

---

## 4. CODE-REVIEW hardness — plans1 vs plans2 (from owners)

| Phase | plans1 | plans2 | Winner for gate honesty |
|-------|--------|--------|-------------------------|
| P01 | APPROVE-WITH-FIXES | APPROVE-WITH-FIXES | Tie |
| P02 | APPROVE-WITH-FIXES | APPROVE-WITH-FIXES | Tie |
| P03 | APPROVE-WITH-FIXES | **FAIL UNPROVEN** | **plans2** |
| P04 | APPROVE-WITH-FIXES | **FAIL NOT PROVEN** | **plans2** |
| P05 | APPROVE re-prove | APPROVE residual | Tie |
| P06 | **FAIL NOT GREEN** | **FAIL NOT GREEN** | Tie (plans2 denser leave-flush) |
| P07 | **CONDITIONAL APPROVE** | **FAIL CP-07** | **plans2** |
| P08 | CONDITIONAL | FAIL evidence / plan OK | plans2 label stricter |
| P09 | APPROVE residual | **FAIL W8 NOT SHIP** | **plans2** |
| P10 | Mode A / block B | Mode A / block B | Tie |

**Binding rule (from plans1 START-HERE + both owners):**  
If **plans2 says FAIL** and plans1 says APPROVE → **treat gate as FAIL**.

---

## 5. Residual work class (consensus)

| Class | Phases | Action |
|-------|--------|--------|
| **Code residual** | **P06, P07, P09** (+ P03 unit gaps, P04 wiring/console) | Change product/tests |
| **Re-prove / pack** | P01, P02, P05, P08 | Evidence only if unit-green |
| **Honesty pack** | P10 Mode A | No product under P10 |
| **Close-out** | P11 | After residual DONE |

`results/` **MISSING** on disk → all historical CP/PASS unproven.

---

## 6. Owner findings unique to each tree

### Plans/ (Owner 1)
- **78 files** (INDEX claims 53 — stale; omits Others + DIFFERENCE-MATRIX).
- Strong: RESULTS-MAP folder lock, kill order, EXPERT-PASS, W1–W8.
- Weak: link rot (`00-START`, checkpoints, trustdata); mixed PASS banners (P01/P02/P04/P05 claim PASS; P06–P10 open).
- **No** EXECUTE-NOW in this tree.
- Others/ is honesty hub (not Research/Others).

### plans1/ (Owner 2)
- **30 files**; START-HERE is only sane entry.
- Residual P06/P07 bodies in EXECUTABLE-PLAN are executable.
- Path honesty improved (live Plans present); REFERENCES `Plans/Research/Others` still wrong → real path `Plans/Others/`.
- Leaf IMPLs still cite root `Idiots2/` (should be archive).
- FOUR-SEAT path “Plans missing” is **stale** vs current disk.

### plans2/ (Owner 3)
- **28 files**; denser **FAIL** language.
- **Authority war:** README → plans1 primary; 00-START/EXECUTABLE/CHANGES → plans2 sole.
- Meta docs claim **no CODE-REVIEW** — **false** (10 reviews present).
- Unique residual: leave bare `flush` → `flushPersist`/`projectRef`; P11 `11-world-standard-closeout/` + DUAL-LANGUAGE.
- Good second opinion; bad sole landing without reading README first.

### PlansA/ (Owner 4)
- **70 files**; unique value = MERGE-NOTES + MATRIX + `diff/` only.
- **Split-brain:** README/MERGE banner/diff10 = research; EXECUTE-NOW/00-START/REFERENCES/phase READMEs = still PRIMARY PlansA.
- Dual files convenient for comparing hardness; terrible as runbook (5 files/phase).
- EXECUTE-NOW still points “deep review” at **plans1/** while claiming PlansA primary — third tree thrash.
- **Negative unique value** for execute; museum for merge decisions.

---

## 7. Execute fitness rank (owners + synthesis)

| Rank | Tree | Why |
|-----:|------|-----|
| **1** | **plans1/** | Only coherent residual runbook with START-HERE |
| **2** | **plans2/** | Best gate hardness; entry docs conflict |
| **3** | **Plans/** | Best maps/how; not residual tasks |
| **4** | **PlansA/** | Most confusing; dual authority inside folder |

---

## 8. What an agent opens (disk-true SOP)

### First 30 minutes
1. `plans1/START-HERE.md`  
2. `plans1/EXECUTE-NOW.md`  
3. `plans1/00-START.md` → create `results/…`, HEAD honesty  
4. `plans1/EXECUTABLE-PLAN.md` Task 00 only  
5. `Plans/Research/RESULTS-MAP.md` only if folder names unclear  
6. **Never** start in PlansA or dual-run plans2  

### When stuck on residual code
- Active phase: `plans1/P0X/CODE-REVIEW-REPORT.md` first  
- If soft APPROVE: open `plans2/P0X/CODE-REVIEW-REPORT.md` — **FAIL wins**  
- Optional: `PlansA/MERGE-NOTES.md` or `PlansA/diff/0N-*.md` for merge rationale only  

### For product how / expert depth
- `Plans/phases/P0X-*/` execute card + essays  

---

## 9. Must-fix before thrashing product residual

| # | Fix | Source seats |
|---|-----|----------------|
| 1 | Keep **plans1** as sole execute; do not re-crown PlansA | All four owners |
| 2 | **Stamp** PlansA EXECUTE-NOW / 00-START / phase READMEs / REFERENCES as HISTORICAL (or delete execute claims) | PlansA owner |
| 3 | **Stamp** plans2 00-START / EXECUTABLE / CHANGES “sole authority” and “no reviews” as stale | plans2 owner |
| 4 | Fix plans1 REFERENCES: `Plans/Others/` not `Plans/Research/Others` | plans1 owner |
| 5 | Leaf IMPL brainstorm paths → `archive/Idiots2/` only | plans1 owner |
| 6 | Plans/INDEX file count 53 → 78; fix broken phase links when editing | Plans owner |
| 7 | `results/` still missing — session zero mkdir before any PASS claim | All |

---

## 10. Did each seat read all four?

| Seat | Scope | All four? |
|------|--------|-----------|
| Owner Plans | Full Plans only | **No** (by design — owns one) |
| Owner plans1 | Full plans1 only | **No** (by design) |
| Owner plans2 | Full plans2 only | **No** (by design) |
| Owner PlansA | Full PlansA only | **No** (by design) |
| **Synthesis (this doc)** | Cross-read all four owner reports | **Yes** — all four trees covered via owners |

**Collectively: yes, every tree was fully owned.**  
**Individually: each deep-owned one tree (what you asked for).**

---

## 11. Bottom line

1. **Execute:** `plans1/START-HERE.md` only.  
2. **Maps:** `Plans/Research/RESULTS-MAP.md`.  
3. **Harder reviews:** plans2 when it says FAIL.  
4. **PlansA:** museum (MERGE + MATRIX + diff); not a runbook — still full of primary-execute lies inside the folder.  
5. **Residual code:** P07 → P06 → P09 (after P00–P03 re-prove path).  
6. **Do not** trust phase-card PASS in Plans/ without `results/` on this HEAD.

**Ship residual package?** Ship **plans1** as execute instructions **after** PlansA/plans2 stale-authority stamps (or accept agent risk of opening wrong first file).
