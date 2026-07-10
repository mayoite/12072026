# Plans Folder Difference Matrix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Plan skill:** writing-plans (docs reconcile — no product TDD).  
> **Execution mode chosen:** subagent-driven inventory + head synthesis (owner: option 2 / subagents).

**Goal:** Keep `Plans/`, `plans2/`, and `PlansA/` as three separate folders and publish one canonical difference matrix so agents stop dual-running or collapsing trees.

**Architecture:** Program tree (`Plans/`) owns HOW + RESULTS-MAP. Residual execute package (`PlansA/`) owns day-to-day residual spine after merging plans1+plans2. Reference package (`plans2/`) keeps Idiots wave-1 plans+reviews. Matrix lives under PlansA; thin pointer under Plans.

**Tech Stack:** Markdown plan trees only · git · PowerShell path checks · no `site/` product changes.

**Inputs consumed:**
- Repo read: 2026-07-10 HEAD at start `a4d5cf9` — live `Plans/` was missing; restored from git
- Subagent inventories: Plans (archive then restore), plans2, PlansA
- Merge authority: `PlansA/MERGE-NOTES.md`

**Done when:**
- [x] Live `Plans/` exists again (77 md)
- [x] Canonical matrix at `PlansA/MATRIX-Plans-vs-plans2-vs-PlansA.md`
- [x] Pointers from Plans, plans2, PlansA README/REFERENCES
- [x] Three folders remain separate (no delete/merge of trees)
- [ ] Commit + push when wiring landed

---

## File map

| Path | Responsibility |
|------|----------------|
| `PlansA/MATRIX-Plans-vs-plans2-vs-PlansA.md` | **Canonical** 3-way difference matrix |
| `Plans/DIFFERENCE-MATRIX.md` | Thin pointer to canonical matrix |
| `Plans/README.md` | Link execute → PlansA + matrix |
| `plans2/README.md` | Demote to reference; link PlansA + matrix |
| `PlansA/README.md` | Link matrix |
| `PlansA/REFERENCES.md` | Path map entry for matrix |
| `docs/superpowers/plans/2026-07-10-plans-folder-matrix.md` | This plan |

---

## Task list

### Task 1: Restore live Plans/

**Files:**
- Restore: `Plans/**` from git HEAD (or `archive/Plans` if needed)

- [x] **Step 1: Confirm missing**

```powershell
Test-Path D:\OandO07072026\Plans
# was False
```

- [x] **Step 2: Restore**

```powershell
cd D:\OandO07072026
git checkout HEAD -- Plans/
# Expect: Plans\INDEX.md, Plans\Research\RESULTS-MAP.md exist; ~77 files
```

- [x] **Step 3: Verify**

```powershell
(Get-ChildItem Plans -Recurse -File | Measure-Object).Count
Test-Path Plans\Research\RESULTS-MAP.md
```

Expected: count ≥ 50; RESULTS-MAP True.

---

### Task 2: Inventory three trees (subagents)

- [x] **Step 1: Spawn explore subagent — Plans**
- [x] **Step 2: Spawn explore subagent — plans2**
- [x] **Step 3: Spawn explore subagent — PlansA**
- [x] **Step 4: Head merges inventories into matrix**

---

### Task 3: Write canonical matrix

**Files:**
- Create: `PlansA/MATRIX-Plans-vs-plans2-vs-PlansA.md`

- [x] **Step 1: Write full matrix** (roles, structure, kill order, evidence, per-phase posture, keep-separate policy)
- [x] **Step 2: Placeholder scan** — no TBD/TODO left in matrix
- [x] **Step 3: Confirm three folders named keep-separate**

---

### Task 4: Wire pointers (subagent)

**Files:**
- Modify: `PlansA/README.md`, `plans2/README.md`, `Plans/README.md`, `PlansA/REFERENCES.md`
- Create: `Plans/DIFFERENCE-MATRIX.md`

- [x] **Step 1: Subagent applies pointer edits**
- [x] **Step 2: Head verifies links resolve** — all paths True; MATRIX matches in READMEs

---

### Task 5: Commit

- [x] **Step 1–2: Stage + commit** (this session)
- [ ] **Step 3: Push origin when green enough (agent call)**

---

## Self-review

| Check | Result |
|-------|--------|
| Spec: table of differences for all three | Covered in matrix §§1–10 |
| Keep separate folders | §11 policy |
| Matrix in plan folder | `PlansA/` + pointer `Plans/` |
| Subagents used | 3× explore + 1× wire |
| No product code | Yes |
| Placeholder scan | Clean |

---

## Execution handoff

Plan + matrix authored. Remaining: pointer wiring verification + commit (Task 4–5).

**Default:** finish inline in this session after wire subagent returns.
