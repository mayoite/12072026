# Doc revision — coordinator authority (2026-07-05)

**Status:** Complete (2026-07-05) — all batches applied; plan files renamed to `00-`…`09-` (see [`README.md`](README.md))  
**Workflow:** Composer subagent batch → **this file** (revision calls) → executor/parent apply  
**Does not replace:** `01-execution/core/00-REVISION.md` (product decisions)

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
| A | `docs/architecture/*.md` (11) | [Architecture revision](834bed8f-8b87-4f2d-be8d-080f5427cd71) | **Applied** |
| B | Locked module pairs (16) | [Batch B](7967ca46-62de-477b-95cc-654289490bf0) + [remainder](d51cb1e9-b958-412d-b2a4-e764a3b0c090) | **Applied** |
| C | `04-HANDOVER`, `01-START`, `02-PHASE-1`, `03-PHASE-2` | [Batch C](c4445117-051b-4e72-bfd9-f8ed738fb48b) | **Applied** |
| D | Readme, DOC-MAP, ReadmeLocked | [Batch D](232dd56a-e3cb-434a-8dd4-fe22ee403178) | **Applied** |
| **Executor** | Links, UI contract sync, planner/tests/ui-execution | [Doc executor](5763436a-5a22-4db3-baf4-9c0bd05def01) | **Applied** |
| **Structure** | `Lockedfiles/<module>/` subdirs + `Plans/README.md` | Parent | **Done** |

---

## Apply order

1. Batch D — routing  
2. Batch A — architecture  
3. Batch C — fn_plan execution  
4. Batch B — locked module files  
5. Move conduct + ui; delete `domain/` stubs after link sweep  
6. `docs:sync` — **not** in this pass unless user asks  

---

## Post-apply verification

- [x] `docs/Lockedfiles/<module>/current.md` + `proposed.md` layout
- [x] `docs/Lockedfiles/INDEX.md` root index
- [x] `conduct/`, `ui/` subdirs
- [x] No doc claims `/planner/open3d` redirects-only (open3d README fixed)
- [x] `domain/` redirect only (stubs remain — intentional)
- [x] All architecture docs link MODULE-LAYOUT + README + INDEX
- [x] Stale `Lockedfiles/domain/` links swept (2 intentional stubs only)
- [x] `01-execution/` files numbered `00-`…`09-`; cross-refs updated
- [x] `planner/proposed.md` points at `features/planner/open3d/`
- [x] `ReadmeLocked.md` lists module subdirs
