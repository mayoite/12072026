# VERIFY — full-workflow-demo-2026-07-10

**Seat:** verifier (independent; do not trust implementer claims)  
**Checkout:** `D:\OandO07072026`  
**Phase folder:** `results/planner/full-workflow-demo-2026-07-10/`  
**Date:** 2026-07-10  

Fresh re-runs and on-disk checks only. Implementer / CODE-REVIEW claims re-proven here.

---

## Checklist (verifier brief)

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 1 | Required files exist | **PASS** | See §1 |
| 2 | Re-run visual smoke exit 0 | **PASS** | §2 |
| 3 | Re-run vitest mesh+legs+stretchers exit 0 | **PASS** | §3 |
| 4 | `visual-smoke-meta.json` lists leg-* and stretcher-* | **PASS** | §4 |
| 5 | `CODE-REVIEW.md` says APPROVE | **PASS** | §5 |
| 6 | No product ship claim in NOTES if present | **PASS** | NOTES absent; no ship claim elsewhere in phase docs |

---

## 1. Required files on disk

| Artifact | Path | Status |
|----------|------|--------|
| GOAL | `results/planner/full-workflow-demo-2026-07-10/GOAL.md` | present |
| ROOT-TRUTH | `results/planner/full-workflow-demo-2026-07-10/ROOT-TRUTH.md` | present |
| GAP | `results/planner/full-workflow-demo-2026-07-10/GAP.md` | present |
| IMPLEMENT | `results/planner/full-workflow-demo-2026-07-10/IMPLEMENT.md` | present |
| CODE-REVIEW | `results/planner/full-workflow-demo-2026-07-10/CODE-REVIEW.md` | present |
| 01-*.png | `01-workstation-v0-three-quarter.png` (also `02-…-side.png`) | present |
| visual-smoke-meta.json | same folder | present |
| vitest-mesh.log | same folder | present |
| ws-v0-visual-smoke.mjs | `site/scripts/ws-v0-visual-smoke.mjs` | present |

---

## 2. Visual smoke re-run (fresh)

```powershell
cd D:\OandO07072026\site
node scripts/ws-v0-visual-smoke.mjs
```

**Exit:** `SMOKE_EXIT=0`

**Stdout (verifier run):**
```text
wrote D:\OandO07072026\results\planner\full-workflow-demo-2026-07-10\01-workstation-v0-three-quarter.png
wrote D:\OandO07072026\results\planner\full-workflow-demo-2026-07-10\02-workstation-v0-side.png
parts desk → leg-desk-0 → leg-desk-1 → leg-desk-2 → leg-desk-3 → stretcher-desk-front → stretcher-desk-back → pedestal
legs leg-desk-0, leg-desk-1, leg-desk-2, leg-desk-3
stretchers stretcher-desk-front, stretcher-desk-back
SMOKE_EXIT=0
```

---

## 3. Vitest mesh + legs + stretchers (fresh)

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/workstationMeshV0.test.ts `
  tests/unit/features/planner/open3d/workstationMeshV0.legs.test.ts `
  tests/unit/features/planner/open3d/workstationMeshV0.stretchers.test.ts
```

**Exit:** `VITEST_EXIT=0`

**Result:** Test Files 3 passed (3); Tests **21 passed (21)**

| File | Tests |
|------|-------|
| `workstationMeshV0.test.ts` | 8 |
| `workstationMeshV0.legs.test.ts` | 9 |
| `workstationMeshV0.stretchers.test.ts` | 4 |

Prior log on disk (`vitest-mesh.log`) also records 3 files / 21 tests passed (implementer run). Fresh re-run confirms green.

---

## 4. Meta lists legs + stretchers

After smoke re-run, `visual-smoke-meta.json` contains:

- **legNames:** `leg-desk-0` … `leg-desk-3` (4)
- **stretcherNames:** `stretcher-desk-front`, `stretcher-desk-back` (2)
- **partNames:** desk → 4 legs → 2 stretchers → pedestal

---

## 5. CODE-REVIEW approval

`CODE-REVIEW.md` states:

- `**Approval: APPROVE**`
- Verdict table: `**Approval** | **APPROVE**`

No Critical issues. Important debt (formula drift without automated parity; scene suite not in implementer vitest evidence) noted as non-blocking for this demo land.

---

## 6. Product ship claim

- `NOTES.md`: **absent** → N/A under “if present”
- `GOAL.md` / `IMPLEMENT.md` / `ROOT-TRUTH.md`: scope is visual smoke demo; GOAL explicitly **Not done when: product ship claimed**. No product ship claim found in phase artifacts.

---

## Non-blocking notes (not FAIL criteria for this seat)

1. **GOAL done-when lists scene suite**; implementer + this verifier brief re-ran mesh/legs/stretchers only (21 tests). CODE-REVIEW already flagged scene as process/evidence gap. Does **not** fail this verifier checklist (item 3 is mesh+legs+stretchers).
2. **Formula duplication** in smoke vs product mesh remains maintainability debt (APPROVE with eyes open). Do not treat smoke as long-term mesh oracle without parity path A/B.

---

## Verdict

All six verifier-brief checks passed with fresh command evidence.

VERDICT: PASS
