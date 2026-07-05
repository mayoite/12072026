# Doc revision — coordinator authority (2026-07-05)

**Status:** In progress — executor + architecture subagents running (2026-07-05)  
**Workflow:** Composer subagent batch → **this file** (revision calls) → executor/parent apply  
**Does not replace:** `plann/REVISION-2026-07-05.md` (product decisions)

---

## Locked layout (approved)

```text
docs/Lockedfiles/
  INDEX.md
  DomainTruthLocked.md          → redirect to INDEX.md
  conduct/
    AgentsLocked.md
    ReadmeLocked.md
    TestingLocked.md
    TestingHandbookLocked.md
  ui/
    MODULE-UI-CONTRACT-Locked.md
  <module>/
    current.md
    proposed.md
```

**Modules:** `repo-shell`, `site`, `planner`, `admin`, `crm`, `ops`, `auth`, `database`, `svg-pipeline`, `tech-stack`, `tests`, `platform-api`, `documentation`, `dependencies-engines`, `ui-execution`, `architecture`

**Deprecated:** flat `docs/Lockedfiles/domain/*` — redirect stubs only until links updated.

---

## Coordinator calls (locked)

| Call | Rationale |
|------|-----------|
| **Module subdirs** | User-approved; one folder per domain |
| **No full-repo MD sweep** | CONTENTS.md generated; archive untouched |
| **RESEARCH-* frozen** | Reference only; one-line supersede link |
| **REVISION file frozen** | Subagents cannot change product decisions |
| **New planner code → open3d/** | MODULE-LAYOUT authority |
| **Option F rejected** | No design-system program in docs |
| **push back on scope** | Agents propose; coordinator trims |

---

## Batch status

| Batch | Scope | Subagent | Apply |
|-------|--------|----------|-------|
| A | `docs/architecture/*.md` (11) | [834bed8f](834bed8f-8b87-4f2d-be8d-080f5427cd71) running | Pending |
| B | Locked module pairs (16) | Executor P3 only | Partial |
| C | `plann/HANDOVER`, START, PHASE-* | Done | **Applied** |
| D | Readme, DOC-MAP, ReadmeLocked | Done | **Applied** |
| **Executor** | Links, UI contract sync, planner/tests/ui-execution, open3d README | [5763436a](5763436a-5a22-4db3-baf4-9c0bd05def01) running | In progress |
| **Structure** | `Lockedfiles/<module>/` subdirs | Parent | **Done** |
| **Parent** | COMPONENT_ARCHITECTURE locked path; open3d README route truth | Parent | **Done** |

---

## Apply order

1. Batch D — routing  
2. Batch A — architecture  
3. Batch C — plann execution  
4. Batch B — locked module files  
5. Move conduct + ui; delete `domain/` stubs after link sweep  
6. `docs:sync` — **not** in this pass unless user asks  

---

## Post-apply verification

- [x] `docs/Lockedfiles/<module>/current.md` + `proposed.md` layout
- [x] `docs/Lockedfiles/INDEX.md` root index
- [x] `conduct/`, `ui/` subdirs
- [x] No doc claims `/planner/open3d` redirects-only (open3d README fixed)
- [ ] `domain/` redirect only (stubs remain)
- [ ] All architecture docs link MODULE-LAYOUT + README (batch A running)
- [x] `planner/proposed.md` points at `features/planner/open3d/`
- [x] `ReadmeLocked.md` lists module subdirs
