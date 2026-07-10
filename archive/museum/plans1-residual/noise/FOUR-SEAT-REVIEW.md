# Four-seat review — residual plan package

**Date:** 2026-07-10  
**Checkout:** `.`  
**Method:** Parallel subagents · `/using-superpowers`  
**Seats:** Executing agent · Planning expert · Critic · Benchmarker  
**Subject:** Execute spine after “plans1 not PlansA” clarity fix  

**Disk at review (re-proved):**

| Path | Status |
|------|--------|
| `plans1/` | Live (29 md) |
| `plans2/` | Live (28 md) |
| `Plans/` | **Missing at root** (only `archive/Plans/`) |
| `PlansA/` | **Missing at root** (only `archive/PlansA/`) |
| `results/` | **Missing** |

---

## Scoreboard

| Seat | Verdict | Score |
|------|---------|------:|
| **1. Executing agent** | PASS-WITH-FIXES | **6 / 10** execute clarity |
| **2. Planning expert** | PASS-WITH-FIXES | Authority model **5 / 10** |
| **3. Critic** | **SHIP-WITH-FIXES** (path purge first) | — |
| **4. Benchmarker** | Gold-adjacent residual package | **84 / 100** |

**Consensus:** Residual *content* (kill order, FG bans, P06/P07/P09 debt) is strong. **Path / authority graph is broken.** Do not thrash agents until maps resolve on disk.

---

## 1. Executing agent

**Job:** Can a zero-context agent run tomorrow without drowning?

### Verdict: PASS-WITH-FIXES (6/10)

**Would open first 30 min:**  
`START-HERE` → `EXECUTE-NOW` → `00-START` → `EXECUTABLE-PLAN` Task 00 only → `CHECKLIST-MASTER` P00 → phase review for P01.

**Friction (ranked):**
1. Dead `Plans/Research/RESULTS-MAP.md` (map only in `archive/Plans/…`)
2. Dead root `PlansA/` demotion links
3. Too many start docs before first product tick
4. IMPL still cites missing `Idiots2/` roots
5. P06 “Task 07” confusable with phase P07
6. Twin `plans2/` invites dual-run
7. Map-minimum artifact names murky without RESULTS-MAP

**Residual clarity:** P06/P07/P09 **clear**; P03/P04 grey band.

**Required before start (executor):**
1. Fix every RESULTS-MAP pointer to a path that exists  
2. Fix PlansA paths → `archive/PlansA/`  
3. One-line authority stamp on START-HERE matching disk  
4. Kill “Live Plans authority” section that 404s  
5. Fence plans2 as non-execute  
6. Collapse START-HERE + EXECUTE-NOW  
7. Normalize archive/Idiots2 paths  

---

## 2. Planning expert

**Job:** Architecture, kill order, residual discipline, single authority.

### Verdict: PASS-WITH-FIXES

**Strengths:**
1. Entry funnel START-HERE → review-first  
2. Approach A residual wave is real  
3. False-green model product-grade  
4. Kill order matches buyer spine  
5. PlansA demotion was right product decision  

**Defects (ranked):**
1. Broken map authority (blocker)  
2. AGENTS still says live `Plans/` first (multi-narrative)  
3. archive PlansA MERGE-NOTES still “execute = PlansA”  
4. plans2 not a clean secondary (still full program + “prefer PlansA”)  
5. Archive docs still say “live tree”  
6. P07 stop-condition if cabinet identity fails under-specified  
7. Leaf IMPL dumps still rewrite-shaped  

**Kill order:** **Sound. No reorder.**  
`P00→P01→P02→P03→P07→P06→P04→P05→P08→P09→P10→P11`

**Residual vs rewrite:** Solid doctrine; theater risk at leaf IMPLs + dual trees.

**Authority model: 5/10** — coherent as intent, unstable on disk.

---

## 3. Critic

**Job:** Attack dual authority, paper process, lies, ceremony.

### Verdict: SHIP-WITH-FIXES (mandatory path fixes before any execute agent)

**Fatals:**
| ID | Flaw |
|----|------|
| F1 | Live `Plans/` gone; package still treats it as law |
| F2 | Root `PlansA/` gone; banners still point root |
| F3 | plans2 “prefer PlansA” + archive PlansA PRIMARY stubs |
| F4 | plans1 soft CONDITIONAL APPROVE vs plans2 FAIL (P07) — merge claimed, hardness not absorbed |

**Overbuilt:** Entire PlansA dual-file dump; twin packages; 35 FG IDs; full IMPL dumps in-tree.  
**Underbuilt:** One disk-true authority table; plans2 hardness into plans1 reviews; path re-prove in 00-START.

**Critic one-page rule:**
1. Execute only `plans1/START-HERE` → CODE-REVIEW → EXECUTABLE residual  
2. Maps: `archive/Plans/Research/RESULTS-MAP.md` until live Plans restored  
3. Evidence only under `results/planner/world-standard-wave/<canonical>/`  
4. Kill order as plans1  
5. Code residual: P07, P06, P09  
6. Re-prove: P01–P02, P03 unit+browser, P04/P05/P08 evidence-first  
7. P10 Mode A; Mode B blocked until map-min green  
8. Paper PASS without results path + log = FAIL  
9. If plans2 says FAIL and plans1 says APPROVE → **gate is FAIL**  
10. Do not open archive PlansA execute stubs for work  

---

## 4. Benchmarker

**Job:** Score vs gold-standard residual package.

### Overall: **84 / 100**

| Dimension | Score |
|-----------|------:|
| Single entrypoint | 9 |
| Task granularity | 9 |
| TDD / proof-first | 9 |
| Evidence path lock | **7** (path drift) |
| False-green prevention | **10** |
| Residual vs greenfield honesty | **10** |
| Kill order | 9 |
| Phase ownership | 8 |
| Recoverability | 8 |
| Time-to-first-action | 9 |
| Doc bloat (plans1 alone) | 8 |
| W1–W8 alignment | 9 |

**Gold already:** FG system; residual honesty + kill order; entrypoint + phase grain (~10–15 min to first action).

**Top gaps to ~95:**
1. Co-locate RESULTS-MAP with execute authority  
2. Mechanical map-min verifier  
3. Stop confusable parallel trees  

**Execute fitness rank:**
| Rank | Tree | Why |
|-----:|------|-----|
| 1 | **plans1** | START-HERE + residual spine |
| 2 | plans2 | Same shape, stale sole-authority risk |
| 3 | archive/Plans | Best map/how; not residual spine |
| 4 | archive/PlansA | ~70 files; confuses execute |

---

## Combined required actions (priority)

| # | Action | Seats that demand it |
|---|--------|----------------------|
| 1 | Restore live `Plans/` **or** rewrite all map pointers to `archive/Plans/Research/RESULTS-MAP.md` | All four |
| 2 | Point PlansA research → `archive/PlansA/` only; stamp MERGE-NOTES historical | Executor, Planner, Critic |
| 3 | Fix plans2 “prefer PlansA” → plans1 only | Critic, Planner |
| 4 | AGENTS.md: residual execute = `plans1/START-HERE.md` | Planner, Critic |
| 5 | If plans2 FAIL vs plans1 APPROVE → treat gate FAIL | Critic |
| 6 | Optional: thin residual contract frontmatter per phase | Planner, Executor |
| 7 | Optional: map-min checker script | Benchmarker |

---

## Head synthesis (honest)

| Claim | Truth |
|-------|--------|
| “Execute plans1” | Right direction |
| “Clarity fixed” | **Incomplete** — root Plans/PlansA vanished again; pointers still 404 |
| Residual plan quality | **Strong** (benchmarker 84) |
| Ready to thrash product residual | **No** until path authority is disk-true |

**Next land after this review:** path honesty pass (restore or re-point) before P01 product work.
