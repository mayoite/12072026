# Difference matrix — Plans · plans2 · PlansA

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` only · **no worktrees**  
**Method:** Parallel inventory subagents (`/using-superpowers`) on each tree; head synthesis.  
**Rule:** **All three folders stay separate.** This file is the comparison only — not a merge of content into one tree.

| Folder | Path | Keep? |
|--------|------|-------|
| **Plans** | `Plans/` | **Yes** — program how + RESULTS-MAP (AGENTS live plan) |
| **plans2** | `plans2/` | **Yes** — Idiots wave-1 residual package (reference) |
| **PlansA** | `PlansA/` | **Yes** — merged residual **execute** package (this folder) |

**Also on disk (out of this 3-way matrix but related):** `plans1/` (Idiots2 twin of plans2), `archive/Plans/` (backup of Plans), `archive/Idiots/`, `archive/Idiots2/`.

---

## 1. One-screen role matrix

| Dimension | **Plans/** | **plans2/** | **PlansA/** |
|-----------|------------|-------------|-------------|
| **What it is** | World-standard **program tree**: phase execute cards, expert notes, Research maps | Residual **execute package** from Idiots (wave 1) + code reviews | **Merged** residual execute package (plans1 + plans2 synthesis) |
| **Former name** | Always `Plans/` | `idiotplanners2/` | New 2026-07-10 merge |
| **Self-claimed authority** | AGENTS live plan: INDEX → phase card → RESULTS-MAP | **Conflict:** README/EXECUTE-NOW = **SECONDARY** (prefer plans1); older docs = **sole** residual | **PRIMARY execute** — supersedes dual-running plans1 then plans2 |
| **Who should open it to do work** | Product **how** + evidence **folder lock** | Deep recovery / Idiots-lineage cross-check | **Day-to-day residual execute** (start here) |
| **Brainstormer lineage** | None cited inside tree | **Idiots** (`archive/Idiots/`) | Both; **Idiots2 primary narrative** + Idiots secondary |
| **Sibling twin** | — | `plans1/` (Idiots2) | Consumes both plans1 + plans2 |
| **File count (.md)** | **77** | **28** | **59** |
| **Root package kit** | No EXECUTE-NOW / 00-START / EXECUTABLE-PLAN / P11 | Yes (8 roots) | Yes (9 roots, includes **MERGE-NOTES**) |
| **Per-phase shape** | Multi-file cards: `P0X-*.md`, suggestions, expert appendices | `IMPLEMENTATION-PLAN.md` + `CODE-REVIEW-REPORT.md` | Primary plan+review (from plans1) + `*.plans2.md` + phase `README.md` |
| **P11** | **No** (structure notes reject P11 as program phase) | Yes — `11-world-standard-closeout/` | Yes — `11-integration-closeout/` (+ alias for plans2 name) |
| **MERGE-NOTES** | No | No | **Yes** — plans1 vs plans2 decisions |
| **RESULTS-MAP** | **Yes** — `Plans/Research/RESULTS-MAP.md` (folder lock) | Points at Plans/Research (depends on Plans live) | Points at Plans/Research; evidence table mirrored in package |
| **Evidence wave root** | Documents `results/planner/world-standard-wave/` | Same | Same |
| **`results/` on disk** | Required for PASS; currently often **missing** = unproven | Same honesty | Same honesty |
| **Product code** | How only (no site/) | Plan only | Plan only |
| **Keep separate?** | **Yes** | **Yes** | **Yes** |

---

## 2. Authority / when to use which

```
Owner message
  → AGENTS.md
    → Plans/              = program map, kill order history, RESULTS-MAP folder lock, phase HOW cards
    → PlansA/             = residual EXECUTE spine (what to do now after code reviews)
    → plans2/             = reference only (Idiots residual + secondary reviews)
    → plans1/             = reference only (Idiots2 residual + primary reviews; also copied into PlansA)
```

| Need | Open |
|------|------|
| Evidence folder names / forbidden aliases | `Plans/Research/RESULTS-MAP.md` |
| Phase product-how card (CP narrative) | `Plans/phases/P0X-*/` |
| **Execute residual today** | `PlansA/EXECUTE-NOW.md` → `00-START.md` → `EXECUTABLE-PLAN.md` |
| Why merge chose X over Y | `PlansA/MERGE-NOTES.md` + **this matrix** |
| Idiots-only deep plan dump | `plans2/P0X-*/IMPLEMENTATION-PLAN.md` |
| Idiots2 deep plan dump | `plans1/…` or `PlansA/P0X-*/IMPLEMENTATION-PLAN.md` |
| Code-review residual list | `PlansA/P0X-*/CODE-REVIEW-REPORT.md` first; optional `CODE-REVIEW-REPORT.plans2.md` |

**Do not** run plans2 and PlansA as two full programs.  
**Do not** treat Plans phase “PASS” prose as live green without `results/` paths.

---

## 3. Structure matrix

| Structure item | Plans | plans2 | PlansA |
|----------------|:----:|:------:|:------:|
| `README.md` | ✓ | ✓ | ✓ |
| `INDEX.md` | ✓ | — | — |
| `phases/` tree | ✓ | — (flat `P0X-*/` at package root) | — (flat `P0X-*/`) |
| `Research/RESULTS-MAP.md` | ✓ | cite only | cite only |
| `Research/Others/` | ✓ (22 honesty docs) | — | — |
| `EXECUTE-NOW.md` | — | ✓ (copy; claims plans1 primary) | ✓ (PlansA primary) |
| `00-START.md` | — (referenced historically; missing as root) | ✓ | ✓ merged |
| `EXECUTABLE-PLAN.md` | — | ✓ | ✓ residual contracts |
| `CHECKLIST-MASTER.md` | — | ✓ | ✓ |
| `P11-CHECKLIST.md` | — | ✓ | ✓ merged |
| `CHANGES-JUSTIFICATION.md` | — | ✓ | ✓ |
| `REFERENCES.md` | — | ✓ | ✓ |
| `MERGE-NOTES.md` | — | — | ✓ |
| `P0X/IMPLEMENTATION-PLAN.md` | — | ✓ | ✓ (from plans1) |
| `P0X/CODE-REVIEW-REPORT.md` | — | ✓ | ✓ (from plans1) |
| `P0X/*.plans2.md` | — | — | ✓ (from plans2) |
| `P0X/README.md` provenance | phase README different | — | ✓ |
| Expert appendices (`01-react…`, etc.) | ✓ | — | — |
| `EXPERT-PASS.md` | ✓ | — | — |

---

## 4. Kill order matrix

| Step | Plans (INDEX) | plans2 | PlansA |
|------|---------------|--------|--------|
| Session zero | CP-00 optional (doc gaps) | **P00** `00-START` | **P00** `00-START` |
| 1 | P01 product truth | P01 | P01 |
| 2 | P02 engine lock | P02 | P02 |
| 3 | P03 W3 select/delete | P03 | P03 |
| 4 | P07 W1–W2 journey | P07 | P07 |
| 5 | P06 W5–W6 save | P06 | P06 |
| 6–9 fill | P04 · P05 · P08 · P09 | same | same |
| 10 | P10 handover | P10 | P10 |
| 11 | **(none / reject P11)** | **P11** close-out | **P11** close-out |

**Spine string (plans2 / PlansA):**

```
P00 → P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10 → P11
```

**Spine string (Plans INDEX):** same middle without formal P00/P11 package bookends.

---

## 5. Evidence folder matrix (shared RESULTS-MAP)

All three **agree** on wave root: `results/planner/world-standard-wave/`.

| Canonical folder | Plans phase | plans2 / PlansA phase |
|------------------|-------------|------------------------|
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
| `11-world-standard-closeout/` | — | plans2 P11 |
| `11-integration-closeout/` | — | **PlansA P11** (preferred) |

**Forbidden primary names (all packages that cite RESULTS-MAP):**  
`01-product-truth/`, `02-engine-lock/`, `08-shortcuts-chrome/`, `07-mesh-quality/`, `site/results/`.

---

## 6. Per-phase posture matrix (execute residual)

| Phase | Plans (how card focus) | plans2 review posture | PlansA execute posture |
|-------|------------------------|----------------------|------------------------|
| **P01** | Inventory-only truth map | APPROVE-WITH-FIXES; re-prove pack | Re-prove inventory → `00-product-truth/` |
| **P02** | Engine lock; stop thrash | APPROVE-WITH-FIXES; freeze | Re-prove freeze; **no** engine rebuild |
| **P03** | W3 unit + browser | **FAIL UNPROVEN**; browser mandatory | Residual units + **browser mandatory** (unit alone = FAIL) |
| **P04** | W4 orbit three-layer | FAIL NOT PROVEN; verify-first | Re-prove + wiring/console harden; no R3F port |
| **P05** | W2 symbols / Block2D | APPROVE residual-only | Re-prove only; **no** geometry thrash if green |
| **P06** | W5–W6 save honesty | **FAIL NOT GREEN**; code residual | **Code residual** (help, UUID, testids, projectRef, leave flush); cloud Task 07 **cancel** |
| **P07** | W1–W2 browser journey | **FAIL CP-07**; journey rewrite | **Code residual** journey rewrite; place-CTA identity; no configurator-only green |
| **P08** | W7 mesh quality | FAIL evidence; plan evidence-first | Evidence + smoke; skip toe rewrite if green |
| **P09** | W8 shortcuts chrome | FAIL W8 until residual | **Code residual** aria-keyshortcuts + rail a11y + evidence |
| **P10** | Handover pack | Mode A FAIL-honest; Mode B blocked | Mode A default; Mode B blocked until map-min green on HEAD |
| **P11** | N/A in Plans tree | Dual-language + CROSSWALK | Buyer journey + SHIP-HONESTY + dual-language merge |

**PlansA residual code set (binding):** P06 + P07 + P09 (+ P03 unit gaps, P04 wiring/console).  
**Re-prove only:** P01, P02, P05, P08.

---

## 7. Content / honesty conflicts (plans2 internal + cross-tree)

| Issue | Plans | plans2 | PlansA |
|-------|-------|--------|--------|
| Live path vs archive | Was deleted mid-session; **restored to `Plans/`** for AGENTS | Still has dual “sole vs secondary” voice | Claims sole execute; plans1/2 reference |
| “No CODE-REVIEW” claim | N/A | **Stale** — 10 reviews exist under plans2 | Reviews present as primary + `.plans2.md` |
| Idiots vs Idiots2 | Not used | Phase lock Idiots-only; EXECUTE-NOW C4 flips Idiots2 primary | Idiots2 primary lineage for residual narrative |
| Paper PASS | Cards may say DONE | Banned without `results/` | Banned without `results/` |
| Broken internal links | Historical trustdata / checkpoints refs | Cites Plans/ (OK if Plans live) | Cites Plans/ (OK if Plans live) |
| Dual-run risk | N/A | Secondary but long residual spine | **Forbids** dual-run |

---

## 8. File-count & lineage summary

| | Plans | plans2 | PlansA |
|--|------:|-------:|-------:|
| Total `.md` | 77 | 28 | 59 |
| Root docs | 2 (+ Research) | 8 | 9 |
| Phase folders | 10 under `phases/` | 10 flat | 10 flat |
| Files/phase (typical) | 3–7 | 2 | 5 |
| Brainstorm archive | — | `archive/Idiots/` | `archive/Idiots2/` + `archive/Idiots/` |
| Source of primary IMPL | Phase cards (different genre) | Own wave | **plans1** copy |
| Source of secondary IMPL | — | — | **plans2** as `*.plans2.md` |

---

## 9. What is the same in all three

1. **Checkout:** `D:\OandO07072026` only, no worktrees.  
2. **Approach A kill middle:** P01→P02→P03→P07→P06 then P04/P05/P08/P09→P10.  
3. **Evidence root:** repo-root `results/planner/world-standard-wave/` only.  
4. **Folder lock numbers ≠ phase numbers** (P07→`02-browser-…`, P02→`01-engine-lock/`).  
5. **Repo wins** over plan PASS prose.  
6. **No competitor paste** from research scrapes into product.  
7. World-standard **W1–W8** vocabulary for gates.

---

## 10. What differs (decision-useful)

| Topic | Winner for executors | Why |
|-------|----------------------|-----|
| Day-to-day residual tasks | **PlansA** | Single spine; MERGE-NOTES; dual reviews co-located |
| Evidence folder names | **Plans/Research/RESULTS-MAP.md** | AGENTS + historical folder lock authority |
| Product-how / expert depth | **Plans/phases/** | Appendices + EXPERT-PASS not in execute packages |
| Idiots-only plan wording | **plans2** | Wave-1 dumps without Idiots2 bleed |
| P11 close-out board | **PlansA** | Merged plans1 + plans2 styles |
| “Are we dual-running?” | **PlansA says no** | plans2 alone still confuses sole vs secondary |

---

## 11. Keep-separate policy (binding)

| Action | Allowed? |
|--------|----------|
| Keep `Plans/`, `plans2/`, `PlansA/` as three folders | **Required** |
| Delete plans2 after reading this matrix | **No** (owner: keep separate) |
| Copy plans2 content into Plans/phases | **No** (different genre; pollutes program tree) |
| Dual-run full plans2 then PlansA | **No** |
| Use PlansA as execute + Plans for maps + plans2 for RED recovery | **Yes** |
| Archive copy under `archive/Plans/` | OK as backup; **live authority is `Plans/`** when present |

---

## 12. Inventory sources (subagents)

| Tree | Subagent role | Outcome |
|------|---------------|---------|
| Plans | explore inventory | Live missing → used archive; **then head restored `Plans/`** (77 files) |
| plans2 | explore inventory | 28 files; dual authority voice; 10 reviews present |
| PlansA | explore inventory | 59 files; sole execute claim; MERGE-NOTES; broken Plans pointers **fixed by restore** |

---

## 13. Quick links

| Doc | Path |
|-----|------|
| This matrix | `PlansA/MATRIX-Plans-vs-plans2-vs-PlansA.md` |
| PlansA execute | `PlansA/EXECUTE-NOW.md` |
| PlansA merge decisions | `PlansA/MERGE-NOTES.md` |
| Plans entry | `Plans/README.md` |
| Plans index | `Plans/INDEX.md` |
| RESULTS-MAP | `Plans/Research/RESULTS-MAP.md` |
| plans2 entry | `plans2/README.md` |
| plans1 entry | `plans1/README.md` |

---

**Bottom line:** Three folders, three jobs — **Plans** = program + folder lock; **PlansA** = execute residual now; **plans2** = Idiots reference. Do not collapse them; do not dual-run them.
