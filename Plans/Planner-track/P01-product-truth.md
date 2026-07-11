# P01 — Product truth inventory

**Status:** OPEN / REPROVE — not complete. Old `00-product-truth/` packs are clues only.

**Gate:** CP-01 baseline — map what open3d **does** vs what docs/UI **claim** (paths required).  
**Evidence:** `results/planner/world-standard-wave/00-product-truth/`  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Data-backed inventory + contradictions so later phases fix real gaps (W1–W8), not stories.

**Scope:** Inventory only — **no** product-feature code under `site/features/planner/open3d/**`. Read tree; write evidence under `00-product-truth/` only.

**Out of scope:** Select/delete (P03) · orbit (P04) · Fabric cutover · mesh · new journey product code · package upgrades · CRM/auth/SSR.

---

## Truth anchors (re-verify)

| Topic | Live path / note |
|-------|------------------|
| Planner source | `site/features/planner/open3d/` |
| App hosts | `site/app/planner/` · UI adapters `site/features/planner/ui/` |
| Interim 2D | FeasibilityCanvas — sole interactive 2D on open3d routes |
| Fabric | Destination; archive `_archive/fabric/`; overlay flag default OFF; `/planner/fabric*` → open3d |
| 3D | Three + orbit path (`Lazy3DViewer` / `ThreeViewerInner`) |
| Persist | IDB first; cloud honesty = P06 |
| Units | `site/tests/unit/features/planner/open3d/` |

---

## Required artifacts (all unchecked)

| File | Role |
|------|------|
| `INVENTORY.md` | What code actually does (hosts, tools, gates W1–W8 surface) |
| `CONTRADICTIONS.md` | Claim vs code with **file paths** |
| `HEAD.txt` · `run.json` | Checkout, approach A, vitestSmoke, cp01 |
| `NOTES.md` | Non-claims; spine vs world-standard results pointers |
| Vitest smoke log | Required attempt — `ok` \| `failed` \| `skipped` + reason (no silent skip) |

Minimum greps / checks: key open3d files exist; W4/W6 claim strings vs code; Failures.md row if blocked.

---

## Kill order (unchecked)

- [ ] Evidence dir + HEAD + `run.json` (approach A, no worktrees)
- [ ] Tree inventory of production open3d + route/host wiring (claim vs code)
- [ ] Capability matrix for W1–W8 (code surface only — not “works”)
- [ ] Claims corpus: `ayushdocs/` + WAVE/README vs code
- [ ] Existing tests/results map (what is already proven vs theater)
- [ ] Deep read: FeasibilityCanvas · OOPlannerWorkspace · ThreeViewerInner
- [ ] Land `INVENTORY.md` + `CONTRADICTIONS.md`; vitest smoke recorded
- [ ] CP-01 only after artifacts exist — then hand off to [P02](./P02-engine-lock.md)

**Do not** claim “works” without browser proof. Opinion-only inventory = fail.  
**Stop log:** `Failures.md` (phase `P01`).
