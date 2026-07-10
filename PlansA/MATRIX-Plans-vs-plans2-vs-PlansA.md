# Difference matrix — Plans · plans1 · plans2 · PlansA

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` only · **no worktrees**  
**Method:** Parallel inventory subagents (`/using-superpowers`) — wave 1: Plans + plans2 + PlansA; wave 2: **plans1** + **plans1↔plans2 deep residual diff**. Head synthesis.  
**Rule:** **All four folders stay separate.** This file is comparison only — not a merge of trees.

| Folder | Path | Keep? | Job |
|--------|------|-------|-----|
| **Plans** | `Plans/` | **Yes** | Program how + RESULTS-MAP (AGENTS live plan) |
| **plans1** | `plans1/` | **Yes** | Idiots2 residual package (source of PlansA primary files) |
| **plans2** | `plans2/` | **Yes** | Idiots residual package (source of PlansA `*.plans2.md`) |
| **PlansA** | `PlansA/` | **Yes** | Merged residual **execute** package (open this to run) |

**Also on disk (not matrix columns):** `archive/Plans/`, `archive/Idiots/`, `archive/Idiots2/`.

---

## 1. One-screen role matrix (4-way)

| Dimension | **Plans/** | **plans1/** | **plans2/** | **PlansA/** |
|-----------|------------|-------------|-------------|-------------|
| **What it is** | World-standard **program tree**: phase execute cards, expert notes, Research maps | Residual **execute package** Idiots2 + code reviews | Residual **execute package** Idiots + code reviews | **Merged** residual execute (plans1 + plans2) |
| **Former name** | Always `Plans/` | `idiotplanners/` | `idiotplanners2/` | New 2026-07-10 merge |
| **Self-claimed authority** | AGENTS live: INDEX → phase card → RESULTS-MAP | Still titles **PRIMARY** (stale vs PlansA) | **REFERENCE**; PRIMARY → **PlansA** | **PRIMARY execute** — supersedes dual-run |
| **Who opens for work** | HOW + folder lock | RED recovery / Idiots2 dumps | RED recovery / Idiots dumps | **Day-to-day residual execute** |
| **Brainstormer** | None cited | **Idiots2** → `archive/Idiots2/` | **Idiots** → `archive/Idiots/` | Both; Idiots2 primary narrative |
| **File count (.md)** | **78** | **28** | **28** | **60** |
| **Root kit** | README + INDEX + Research (no EXECUTE-NOW) | 8 roots (no MERGE-NOTES) | 8 roots (no MERGE-NOTES) | **9+** roots incl. MERGE-NOTES + **this matrix** |
| **Per-phase shape** | Multi-file cards + expert appendices | IMPL + CODE-REVIEW | IMPL + CODE-REVIEW | Primary (plans1) + `*.plans2.md` + README |
| **P11** | **No** | Yes · `11-integration-closeout/` | Yes · `11-world-standard-closeout/` | Yes · **`11-integration-closeout/`** (+ alias) |
| **MERGE-NOTES / MATRIX** | Pointer only | — | — | **Yes** |
| **RESULTS-MAP** | **Owns** `Plans/Research/RESULTS-MAP.md` | Cites Plans | Cites Plans | Cites Plans |
| **Product code** | How only | Plan only | Plan only | Plan only |
| **Keep separate?** | **Yes** | **Yes** | **Yes** | **Yes** |

---

## 2. Authority map (binding)

```
Owner message
  → AGENTS.md
    → Plans/     = program map + RESULTS-MAP folder lock + phase HOW cards
    → PlansA/    = residual EXECUTE spine (what to do now)
    → plans1/    = Idiots2 source archive (PlansA primary IMPL/reviews copied from here)
    → plans2/    = Idiots source archive (PlansA *.plans2.md copied from here)
```

| Need | Open |
|------|------|
| Evidence folder names | `Plans/Research/RESULTS-MAP.md` |
| Phase product-how card | `Plans/phases/P0X-*/` |
| **Execute residual today** | `PlansA/EXECUTE-NOW.md` |
| Why merge chose X | `PlansA/MERGE-NOTES.md` + **this matrix** |
| Idiots2 deep plan | `plans1/P0X-*/IMPLEMENTATION-PLAN.md` |
| Idiots deep plan | `plans2/P0X-*/IMPLEMENTATION-PLAN.md` |
| Primary code-review residual | `PlansA/P0X-*/CODE-REVIEW-REPORT.md` (= plans1 copy) |
| Secondary review cross-check | `PlansA/P0X-*/CODE-REVIEW-REPORT.plans2.md` |

**Do not** dual-run plans1 then plans2 then PlansA.  
**Do not** treat Plans phase PASS prose as live green without `results/` paths.  
**plans1 title “PRIMARY” is stale** — execute authority is **PlansA**.

---

## 3. Structure matrix (4-way)

| Structure item | Plans | plans1 | plans2 | PlansA |
|----------------|:----:|:------:|:------:|:------:|
| `README.md` | ✓ | ✓ | ✓ | ✓ |
| `INDEX.md` | ✓ | — | — | — |
| `phases/` tree + EXPERT-PASS | ✓ | — | — | — |
| `Research/RESULTS-MAP.md` | ✓ | cite | cite | cite |
| `Research/Others/` | ✓ | — | — | — |
| `EXECUTE-NOW.md` | — | ✓ (claims self primary) | ✓ (points PlansA) | ✓ (binding) |
| `00-START.md` | — | ✓ | ✓ | ✓ merged |
| `EXECUTABLE-PLAN.md` | — | ✓ denser | ✓ thinner | ✓ residual contracts |
| `CHECKLIST-MASTER.md` | — | ✓ | ✓ | ✓ |
| `P11-CHECKLIST.md` | — | ✓ | ✓ | ✓ merge |
| `CHANGES-JUSTIFICATION.md` | — | ✓ | ✓ | ✓ |
| `REFERENCES.md` | — | ✓ | ✓ | ✓ |
| `MERGE-NOTES.md` | — | — | — | ✓ |
| `MATRIX-…md` | pointer | — | — | ✓ canonical |
| `P0X/IMPLEMENTATION-PLAN.md` | — | ✓ | ✓ | ✓ from plans1 |
| `P0X/CODE-REVIEW-REPORT.md` | — | ✓ | ✓ | ✓ from plans1 |
| `P0X/*.plans2.md` | — | — | — | ✓ from plans2 |
| `P0X/README.md` provenance | different | — | — | ✓ |
| Expert appendices | ✓ | — | — | — |

---

## 4. Kill order (shared spine)

| Step | Plans (INDEX) | plans1 / plans2 / PlansA |
|------|---------------|--------------------------|
| Session zero | CP-00 optional | **P00** `00-START` |
| 1–10 | P01→P02→P03→P07→P06→P04→P05→P08→P09→P10 | Same |
| 11 | **(none)** | **P11** close-out |

```
P00 → P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10 → P11
```

Evidence wave root (all packages that execute): `results/planner/world-standard-wave/`.

---

## 5. Evidence folder matrix

| Canonical folder | Plans phase | plans1 / plans2 / PlansA |
|------------------|-------------|---------------------------|
| `00-start/` | CP-00 | P00 |
| `00-product-truth/` | P01 | P01 |
| `01-engine-lock/` | P02 | P02 |
| `02-browser-open3d-journey/` | P07 | P07 |
| `03-select-delete/` | P03 | P03 |
| `04-orbit-continuity/` | P04 | P04 |
| `05-symbols-svg/` | P05 | P05 |
| `06-save-honesty/` (+ `save-reload/`) | P06 | P06 |
| `08-mesh-quality/` | P08 | P08 |
| `09-shortcuts-chrome/` | P09 | P09 |
| `10-handover/` | P10 | P10 |
| `11-integration-closeout/` | — | plans1 + **PlansA** |
| `11-world-standard-closeout/` | — | plans2 only (alias → integration) |

**Forbidden primary names:** `01-product-truth/`, `02-engine-lock/`, `08-shortcuts-chrome/`, `07-mesh-quality/`, `site/results/`.

---

## 6. CODE-REVIEW verdict matrix (plans1 vs plans2 → PlansA)

| Phase | **plans1** | **plans2** | **PlansA execute posture** |
|-------|------------|------------|----------------------------|
| **P01** | APPROVE-WITH-FIXES | APPROVE-WITH-FIXES | Re-prove inventory pack; Select-String; no open3d thrash |
| **P02** | APPROVE-WITH-FIXES | APPROVE-WITH-FIXES | Freeze only → `01-engine-lock/`; no rebuild |
| **P03** | APPROVE-WITH-FIXES Mode A | **FAIL UNPROVEN** | **Stricter:** unit + browser mandatory; unit-alone FAIL |
| **P04** | APPROVE-WITH-FIXES | **FAIL NOT PROVEN** | Re-prove + `workspaceOrbitWiring` + console harden |
| **P05** | APPROVE re-prove only | APPROVE residual-only | Re-prove; skip geometry unless RED |
| **P06** | **FAIL NOT GREEN** | **FAIL NOT GREEN** | **Code residual** (union); cancel cloud Task 07 |
| **P07** | **CONDITIONAL APPROVE** | **FAIL CP-07** | **Code residual** journey rewrite; place-CTA identity |
| **P08** | CONDITIONAL (mesh OK / evidence FAIL) | FAIL evidence; plan OK | Evidence + smoke; skip toe rewrite if green |
| **P09** | APPROVE residual | **FAIL W8** until residual | **Code residual** aria + rail M/W + evidence |
| **P10** | Mode A OK · Mode B blocked | Mode A OK · Mode B blocked | Mode A FAIL-honest default; Mode B blocked |

**PlansA residual code set:** P06 + P07 + P09 (+ P03 unit gaps, P04 wiring/console).  
**Re-prove only:** P01, P02, P05, P08.

---

## 7. Residual deep-diff (plans1 ↔ plans2) — material only

### 7.1 P06 save honesty

| Class | Items |
|-------|--------|
| **Shared** | Help over-claims account slots · missing save testids · no `projectRef` · W5 count≠UUID · weak write mocks · evidence gone · **Task 07 cancel cloud** |
| **plans1-only** | `formatAutosaveStatus` two-arg residual · optional restore-settled Task 09 · denser task numbering |
| **plans2-only (stricter)** | Leave bare `saver.flush()` called out · dual label tables · “Local save failed” string · denser leave/projectRef rigor |
| **PlansA keeps** | **Union**; plans2 leave-flush rigor; cancel cloud 07 |

### 7.2 P07 draw/place journey

| Class | Items |
|-------|--------|
| **Shared** | Rewrite partial journey · wall Δ + Opening · cabinet-v0 + second SKU · PNG >5k · storyboard · no configurator sole green · Feasibility Approach A |
| **plans1-only** | Idiots2 brainstorm lock · forced `includesCabinetV0=true` / body-text false-greens flagged in review |
| **plans2-only** | Idiots brainstorm lock · FAIL-harder language · explicit configurator ban Done-when |
| **PlansA keeps** | Journey rewrite + **identity from place CTA**; drop force-true / body-text / configurator-only greens |

### 7.3 P09 shortcuts chrome

| Class | Items |
|-------|--------|
| **Shared** | Skip invert if green · aria-keyshortcuts · rail regression · evidence `09-shortcuts-chrome/` · ban Dimension→D · ban `08-shortcuts` folder |
| **plans1-only** | Softer “APPROVE residual” framing |
| **plans2-only** | FAIL W8 until residual+evidence · explicit Dimension(M)/Wall(W) |
| **PlansA keeps** | **aria + rail M/W + evidence** (stricter) |

### 7.4 P11 merge

| Topic | plans1 | plans2 | PlansA |
|-------|--------|--------|--------|
| Evidence folder | `11-integration-closeout/` | `11-world-standard-closeout/` | **`11-integration-closeout/`** |
| Buyer journey | Deep (P11.5 style) | Light | **plans1 depth** |
| SHIP-HONESTY | Explicit | Implicit | **Kept** |
| CROSSWALK | Folder audit only | Explicit CROSSWALK.md | **plans2 kept** |
| DUAL-LANGUAGE | Implicit | Explicit GATE≠PRODUCT | **plans2 kept** |

---

## 8. What is the same (all four / execute three)

1. Checkout `D:\OandO07072026` only, no worktrees.  
2. Kill middle: P01→P02→P03→P07→P06 then fill → P10.  
3. Evidence root: repo-root `results/planner/world-standard-wave/`.  
4. Folder numbers ≠ phase numbers.  
5. Repo wins over plan PASS; paper PASS banned.  
6. No competitor paste into product.  
7. W1–W8 vocabulary.  
8. plans1 + plans2 both have full P01–P10 CODE-REVIEW-REPORT (old “no reviews” claim is **false**).

---

## 9. What differs (decision-useful)

| Topic | Winner for executors | Why |
|-------|----------------------|-----|
| Day-to-day residual | **PlansA** | Single spine + MERGE-NOTES + dual reviews co-located |
| Evidence folder lock | **Plans/Research/RESULTS-MAP.md** | AGENTS + canonical names |
| Product-how / experts | **Plans/phases/** | Appendices + EXPERT-PASS |
| Idiots2 dumps | **plans1** | Source of PlansA primary files |
| Idiots dumps | **plans2** | Source of `*.plans2.md` |
| Stricter FAIL language | **plans2** (P03/P04/P07/P09) | PlansA absorbed into gate honesty |
| Denser residual contracts | **plans1** | PlansA EXECUTABLE prefers denser spine |
| P11 board | **PlansA** | Merge of both P11 styles |
| Stale “I am PRIMARY” | **plans1 README** | Ignore for execute; use PlansA |

---

## 10. File-count & lineage

| | Plans | plans1 | plans2 | PlansA |
|--|------:|-------:|-------:|-------:|
| Total `.md` | 78 | 28 | 28 | 60 |
| Lineage | Program | Idiots2 | Idiots | Both (merged) |
| Former folder | — | idiotplanners | idiotplanners2 | — |
| Primary IMPL source for PlansA | — | **Yes** | via sidecars | Self |
| Self execute claim | Program | PRIMARY (stale) | Reference → PlansA | **Sole PRIMARY** |

---

## 11. Keep-separate policy (binding)

| Action | Allowed? |
|--------|----------|
| Keep Plans, plans1, plans2, PlansA as four folders | **Required** |
| Delete plans1 or plans2 after matrix | **No** |
| Dual-run full programs | **No** |
| Execute from PlansA; maps from Plans; RED dumps from plans1/plans2 | **Yes** |
| Collapse plans1 into Plans/phases | **No** (different genre) |

---

## 12. Inventory sources (subagents)

| Wave | Tree / task | Role |
|------|-------------|------|
| 1 | Plans | explore inventory (restore live tree) |
| 1 | plans2 | explore inventory |
| 1 | PlansA | explore inventory |
| 1 | pointer wire | general-purpose README links |
| **2** | **plans1** | explore inventory (**needed for matrix**) |
| **2** | **plans1↔plans2 residual deep diff** | explore decision tables (**needed for matrix**) |

---

## 13. Quick links

| Doc | Path |
|-----|------|
| This matrix (canonical) | `PlansA/MATRIX-Plans-vs-plans2-vs-PlansA.md` |
| Thin pointer | `Plans/DIFFERENCE-MATRIX.md` |
| PlansA execute | `PlansA/EXECUTE-NOW.md` |
| Merge decisions | `PlansA/MERGE-NOTES.md` |
| Plans entry | `Plans/README.md` |
| RESULTS-MAP | `Plans/Research/RESULTS-MAP.md` |
| plans1 entry | `plans1/README.md` |
| plans2 entry | `plans2/README.md` |

---

**Bottom line:** Four folders, four jobs — **Plans** = program + folder lock; **PlansA** = execute now; **plans1** = Idiots2 source; **plans2** = Idiots source. Matrix is incomplete without plans1 + plans1↔plans2 residual tables (wave 2). Do not collapse; do not dual-run.
