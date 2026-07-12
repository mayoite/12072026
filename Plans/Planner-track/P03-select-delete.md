# P03 — Select / delete / undo (W3)

**Status:** **PASS** — owner accept 2026-07-12 (unit + browser id set on `planner-fabric-stage`).

**Gate:** **W3** / CP-03 — select furniture on **live Fabric 2D only** · Delete/Backspace remove · Ctrl/Cmd+Z restore **same id + pose**.  
**Evidence:** `results/planner/world-standard-wave/03-select-delete/`  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Sole host (hard):** `data-testid="planner-fabric-stage"` only.  
**Forbidden hosts:** archive `planner-2d-canvas` · any second interactive plan canvas · flag-OFF alternate-host theater · product `open3d/` folder (does not exist as live tree).

**Goal:** Buyer selects furniture on Fabric stage, deletes, undoes to same entity.

**Bar:** Furniture only — no multi-select, 3D pick, openings as first-class targets.  
**Upgrade rule:** Wire select **on Fabric** (`planner-fabric-stage` only). Do **not** add a second plan host to “prove W3.”

**Out of scope:** Orbit (P04) · save (P06) · full journey (P07) · chrome/W8 · second plan host · engine re-open (P02).

---

## Green-when (unit vs browser — split)

| Layer | Green-when | Not enough alone |
|-------|------------|------------------|
| **Unit** | Pure pick hit/miss/top-most/rotation · pure `applySelectionDelete` + history undo **same id + pose** · keyboard handler contracts · logs under `03-select-delete/` | **Not** W3 / CP-03 PASS · **not** browser substitute |
| **Browser** | Live `/planner/guest` or `/planner/canvas` · interact **only** with `[data-testid="planner-fabric-stage"]` · select → Delete/Backspace → Ctrl/Cmd+Z · **id + pose** identity (not count-only) · `run.json` + PNG/trace under `03-select-delete/` | Count-only · unit-only · archive host · wrong testid |
| **W3 / CP-03 card** | **Unit green and browser green** on this HEAD + Plans status updated | Either layer alone = **FAIL** for the gate |

**Hard rule:** unit **+** browser under `03-select-delete/`. Unit alone = **FAIL** for W3. Browser on any host except `planner-fabric-stage` = **FAIL**.

---

## Architecture (target = Fabric host only)

```
Select (V) → PlannerCanvasStage (PlannerFabricStage)
  → pick / Fabric object hit → setSelection({ type: "furniture", ids })
Delete|Backspace → useWorkspaceKeyboard → applySelectionDelete (pure)
  → one updateProject → selection none
Ctrl/Cmd+Z → history.undo → same id + pose
Esc → clears draw/place and selection
```

Document selection only. Rotation stays **degrees** in document.  
`pickFurnitureAtPoint` may remain the pure hit helper — call it from Fabric stage / workspace, not from any deleted archive path.

---

## Touch list (live tree only)

| File | Role |
|------|------|
| `features/planner/canvas/PlannerFabricStage.tsx` | Select pointer → selection (raise here); sole stage |
| `features/planner/project/lib/geometry/canvasPicking.ts` | `pickFurnitureAtPoint` (pure) |
| `features/planner/editor/OOPlannerWorkspace.tsx` | `deleteSelection`, Esc |
| `features/planner/editor/useWorkspaceKeyboard.ts` | Del/Bksp + `preventDefault` |
| `features/planner/editor/workspaceEntityHelpers.ts` | Pure `applySelectionDelete` |
| Units | pick · delete+undo · keyboard · **Fabric** select |
| Browser | select → delete → undo on **`planner-fabric-stage` only** |

No `modules/` maze. No second canvas package. Paths above are the product surface.

---

## Kill order

- [x] CP-02 owner **PASS** (2026-07-12)
- [x] Evidence dir + HEAD + NOTES (Approach A; host named `planner-fabric-stage`) — unit dump only; browser OPEN
- [x] **Unit green-when:** pick hit/miss/top-most/rotation — log under `03-select-delete/`
- [x] **Unit green-when:** pure delete + undo same id/pose; one history step for multi-id · batch place → single-id selection (`selectionAfterBatchPlace`)
- [x] Wire Fabric select → `setSelection`; empty clears — live host + e2e
- [x] Del/Bksp + Esc on live host — e2e Delete + unit keyboard
- [x] **Browser green-when:** select → delete → undo id+pose; PNGs + `identity-proof.json` under `03-select-delete/`
- [x] Sole host `planner-fabric-stage` · no alternate-host theater
- [x] Plans: CHECKPOINTS CP-03 → **PASS** (owner 2026-07-12)

**Owner accept:** priced / noted 2026-07-12 — browser e2e + identity-proof under `03-select-delete/`.  
**Next (sequence):** [P04](./P04-orbit-continuity.md).

**Pace (owner calibration):** this card = 5k finish for select only — not mesh/P5D. 3D door stays open. See [BOARD calibration](./BOARD.md#owner-calibration-2026-07-12--5k-before-marathon).
