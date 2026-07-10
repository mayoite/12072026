# CHANGES-JUSTIFICATION — plans1 vs raw idiotplanners

**Purpose:** Justify every material change this master package makes relative to executing each `plans1/P0X-*/IMPLEMENTATION-PLAN.md` in isolation.  
**Rule:** CODE-REVIEW-REPORT + live repo win over plan rewrite pastes.  
**Date:** 2026-07-10

---

## Why one spine (EXECUTE-NOW) — not both trees

**From:** Two full trees (`plans1` + `plans2`) + two packages (`plans1` + `plans2`) looked like two programs to run.  
**To:** Single board [`EXECUTE-NOW.md`](./EXECUTE-NOW.md) copied to `plans1`, `plans2`, `plans1`, `plans2`.  
**Primary:** `plans1` + `plans1` (Idiots2). **Secondary:** `plans2` + `plans2` (Idiots) = reference only.  

**Justification:** Same phases, same product; dual waves were parallel drafts. Running both thrash evidence and double residual work. Both review waves agree on residual vs rewrite and `results/` unproven.

---

## Why re-prove not rewrite

| Phase | Review verdict | Product state | Package posture |
|-------|----------------|---------------|-----------------|
| P01 | APPROVE-WITH-FIXES | Inventory phase by design | Evidence re-materialize only |
| P02 | APPROVE-WITH-FIXES | Feasibility + Fabric flag + Three/orbit **landed** | Freeze + unit re-run into `01-engine-lock/` |
| P03 | APPROVE-WITH-FIXES | Select/delete/undo **landed** | Mode A: gap tests + browser re-prove |
| P04 | APPROVE-WITH-FIXES | Orbit three-layer product **landed** | Harden + evidence; no R3F port |
| P05 | APPROVE re-prove only | Multi-prim Block2D **22/22 green** | **No** geometry thrash unless RED |
| P06 | FAIL residual | Flush spine partial; help/ids incomplete | Residual **code** + evidence |
| P07 | CONDITIONAL | Partial journey **false-green** | Rewrite **e2e** not engine |
| P08 | CONDITIONAL mesh OK | Toe→carcass→door **landed** | Evidence + smoke; **skip** Task 03 rewrite |
| P09 | APPROVE residual | Map invert **22/22 green** | aria/rail/evidence only |
| P10 | Mode A only | No results tree | FAIL-honest pack; Mode B blocked |

**Citation pattern:** each row from `plans1/P0X-*/CODE-REVIEW-REPORT.md` “Already exists / Residual / Bottom line.”

**Why:** Full-plan Task pastes include recovery dumps that tempt executors to re-land green code. Reviews repeatedly say **rewrite would thrash**. This package drops virgin rewrites from the kill path.

---

## Why path corrections (`archive/Idiots2`)

**From (plans / README):** `Idiots2/P0X-*/REPORT.md` at repo root.  
**To:** `archive/Idiots2/P0X-*/REPORT.md`.  

**Justification:** Root `Idiots2/` **does not exist** on disk (every CODE-REVIEW B/M finding: P01 B2, P02 B1, P03 M1, P04 M2, P05 M1, P06 M5, P07 H2, P08 M3, P09 M1, P10 M2). Content under archive is valid; path is wrong.

**Also:** `Plans/trustdata/`, root `ayushdocs/`, old CHECKPOINTS/MASTER live paths → use `Plans/phases`, `Plans/Research`, `Plans/Research/Others` for historical notes only.

---

## Why P11 exists

**From:** idiotplanners stop at P10 handover.  
**To:** New **P11** integration / world-standard close-out.

**Justification:**

1. Owner required P11 checklist for **buyer journey + evidence integrity + layout + no false-green**.
2. P10 Mode A only certifies honesty of missing/partial packs — it does **not** re-run a full cross-gate buyer path on HEAD.
3. Historical `W-GATES` false-green (GATE PASS while “not re-run on HEAD”) needs a dedicated integration audit (P10 H1).
4. P01–P09 are phase-siloed; ship decision needs one serial spine.

---

## Why 00-START exists

**From:** Each plan has its own Task 00 scaffolding; no shared session card.  
**To:** Single `plans1/00-START.md`.

**Justification:**

1. Owner required **00 start** executable card.
2. Cross-cutting preflight (worktree, `results/` missing, `rg` missing, Fabric OFF, archive path) repeated in all reviews — should run **once**.
3. Layout gate fails until `results/` exists (P10 B4) — session zero owns first mkdir.

---

## Why kill-order merges/drops

**From (Plans/INDEX + individual plans):**

```
P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10
```

**To (same spine + P00 + P11; residual-only inside each):**

```
P00 → P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10 → P11
```

| Change | Justification | Source |
|--------|---------------|--------|
| Keep INDEX kill order | Serial spine already correct; Approach A | `Plans/INDEX.md` · all reviews kill-order notes |
| Do **not** reorder to P01…P10 numeric | Folder numbers ≠ phase; journey before fill | RESULTS-MAP |
| Drop full product Task sequences where green | Reviews: Mode A / skip-if-green | P03, P05, P08, P09 reports |
| Elevate P07 rewrite priority after P03 | Buyer W1–W2 false-green is high | P07 CONDITIONAL + B1/B2 |
| P06 after P07 | Save honesty after place path stable | INDEX order |
| P04/P05/P08/P09 as fill | After spine buyer gates | INDEX |
| P10 last among original 10 | Pack after content | INDEX · P10 review |
| P11 after P10 | Integration needs residual DONE | Owner |

---

## Why evidence-first / Mode A vs Mode B for P10

**From (phase card / historical pack):** Imply CP-10 PASS / GATE PASS rows.  
**To:** **Mode A default** = FAIL-honest six-file pack when tree empty; **Mode B** only when every primary folder map-min green **on this HEAD**.

**Justification:** P10 CODE-REVIEW: entire `results/` deleted (`a98e29f`); CHECKPOINTS/MASTER missing; historical W-GATES over-greened; Mode B readiness **0/100**. Layout fails without `results/`.  

**Pack-B recovery:** Allowed with path **remap** (`E:\…\results-world-standard-wave\` ≠ nested plan example) + re-verify — never copy-paste PASS (P10 H2).

---

## Master change table

| Change | From (plan claim / habit) | To (this package) | Justification | Source review finding |
|--------|---------------------------|-------------------|---------------|------------------------|
| Re-prove all gates | Phase card CP PASS | Disk artifacts on HEAD or unproven | `results/` missing | All reviews B1-class |
| Archive Idiots2 path | Root `Idiots2/` | `archive/Idiots2/` | Root absent | P01 B2, P02 B1, … |
| Session zero card | Scattered Task 00 | `00-START.md` | Cross-cutting preflight | Owner + P01 tooling B1 |
| P11 close-out | End at P10 | P11 checklist | Integration / ship honesty | Owner + P10 H1 |
| P01 greps without `rg` | Assume `rg` on PATH | Select-String or install; fail-closed | Empty greps = false matrix | P01 B1 |
| P01 self-check full set | Incomplete `$required` | Include authority-path-map + stale-paths tsv | Self-check false-green | P01 H1 |
| P02 no engine rebuild | Possible thrash from long plan | Evidence Tasks only | Stack already locked | P02 exec summary |
| P02 gsap note | “@gsap/react used” | gsap used; @gsap/react unused | Accuracy | P02 H3 |
| P02 orbit authority | Phase “omit prop” | Helper spread + unit 5b | Phase stale | P02 H1 |
| P03 Mode A only | Risk of greenfield | Gap tests + browser | Code landed | P03 H4 |
| P03 no signature rewrite | Appendix `{project,selection}` | Live returns project only | Repo wins | P03 table |
| P03 Task 05 fixture | Duplicate `depth` key | `rotation: 0` at execute | Snippet bug | P03 M2 |
| P03 prefer selectPlannerTool | Raw getByRole | Helper | Flake | P03 M6 |
| P04 wiring unit | Missing | Add `workspaceOrbitWiring.test.ts` | Three-layer | P04 H2 |
| P04 e2e console | Soft count only | Hard assert + console-messages.txt | False-green | P04 H1 |
| P04 browser claim scope | Goal ids/mm/rotation | Document unit-only pose; browser count/orbit | Honesty | P04 H3 |
| P05 no geometry rewrite | Plan Task 03 full dump | Skip unless RED | 22/22 green | P05 bottom line |
| P05 test count | Phase 17/17 | 13+9=22 | Stale card | P05 M2 |
| P06 help honesty | Deferred risk | Required residual | Buyer lie | P06 B3 |
| P06 W5 UUID | Count-only e2e | UUID equality required | Gate language | P06 B2 |
| P06 projectRef + labels | Listed residual | Keep as residual tasks | Incomplete | P06 H1–H5 |
| P06 cloud Task 07 | Optional wire | **Cancel** default | YAGNI | P06 residual |
| P07 journey rewrite | Partial extend | Full rewrite-in-place | Live ≠ CP-07 | P07 H3 |
| P07 identity | Body text / force true | Place-action identity | B1 false-green | P07 B1 |
| P07 second SKU | Assumed sample-desk-1 | Observe from CTA used | B2 | P07 B2 |
| P07 Opening target | Fixed coords | Bind to successful wall segment | H1 flake | P07 H1 |
| P07 kill configurator W2 | Still in live journey | Hard delete success path | F16 | P07 false-green table |
| P08 skip mesh rewrite | Task 03 full paste | SKIP if formulas green | Mesh landed | P08 B/T03 |
| P08 smoke door color | Plan recolor ≠ mesh | Align or silhouette grade | H2 | P08 H2 |
| P08 G5 validation | happy-dom stub | Honest env/assert | H1 meshStages fail | P08 H1 |
| P09 skip invert rewrite | Task 02 product | Skip if green | 22/22 | P09 verdict |
| P09 aria residual | Optional risk | **Required** for W8 PASS | B2 CP-09.4 | P09 B2 |
| P09 rail a11y | Select/Opening only | Add M/W + anti D | H3 | P09 H3 |
| P10 Mode A default | Mode B ceremony | FAIL-honest pack | Tree gone | P10 verdict |
| P10 E: remap | Nested robocopy examples | Flat `results-world-standard-wave` remap | H2 | P10 H2 |
| Evidence root only | Tools dump site/ | Force root `results/` | AGENTS | All |
| Parallel agents | Up to 8 | Allowed on **disjoint evidence files** only | AGENTS | P01 M7 |
| Commit/push | Plan “push only on ask” vs AGENTS | AGENTS push-when-right; no force | Standing git rules | P01 M4, P10 M6 |
| No competitor copy | Research packs | Ideas only | Ethics | All |

---

## Explicit non-changes (YAGNI — refuse to rebuild)

| Refuse | Why |
|--------|-----|
| Virgin FeasibilityCanvas / open3d engine rewrite | Approach A locked; P02 freeze |
| Fabric walls full cutover | Destination spike only; W gates on Feasibility |
| Konva / second 2D engine | Hybrid ban; fail-forward only with proof |
| R3F port of open3d 3D for W4 | Imperative path landed |
| Re-implement `applySelectionDelete` / pick | P03 already present |
| Re-implement modular Block2D geometry | P05 22/22 |
| Re-implement toe/carcass/door mesh | P08 primary green |
| Re-implement shortcut map invert | P09 22/22 |
| Mount fabric PlannerSaveIndicator into open3d | P06 L3 |
| Cloud autosave wire without owner unlock | P06 Task 07 cancel |
| Multi-SKU symbol art thrash | P05 scope cabinet-v0 |
| Photoreal / designer GLB for W7 | P08 hard reject |
| Dimension→D “fix” | Forbidden; was historical lie |
| Recreate root `Idiots2/` tree | Archive is enough |
| Restore CHECKPOINTS/MASTER as PASS theater | Mode A honest missing |
| Treat E: or git historical packs as HEAD green | P10 H1/H4 |
| P01 “fixes” for importGraphProof / README fabric lies | Contradictions only |
| Worktrees | AGENTS hard ban |

---

## What we intentionally keep from idiotplanners

- RESULTS-MAP folder lock and W1–W8 meanings  
- False-green catalogs (aggregated into EXECUTABLE-PLAN)  
- Approach A (Feasibility first, Fabric destination)  
- Mode A residual checklists and TDD where residual **code** is real  
- Ethics / non-copy fences  
- Kill order spine from `Plans/INDEX.md`  
- Per-phase evidence minimums  

---

## How to use this document during execute

1. Before starting a phase, open the row for that phase in the master table.  
2. If IMPLEMENTATION-PLAN Task says rewrite and this table says skip → **skip** and capture evidence.  
3. If review residual says code change and plan says optional → treat as **required** for PASS when marked B/H for gate.  
4. Escalate only on true goal change or owner-only decisions listed in 00-START.
