# P03 — Select / delete / undo (W3)

**Status:** REPROVE — select/delete/undo implementation and 2026-07-11 dual-gate evidence exist, but PASS has not been re-run on this checkout.

**Gate:** **W3** / CP-03 — select furniture on **live Fabric 2D** · Delete/Backspace remove · Ctrl/Cmd+Z restore **same id + pose**.  
**Hard rule:** unit **+** browser under `03-select-delete/`. Unit alone = **FAIL**.  
**Evidence:** `results/planner/world-standard-wave/03-select-delete/`  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Buyer selects furniture on Fabric stage, deletes, undoes to same entity.

**Bar:** Furniture only — no multi-select, 3D pick, openings as first-class targets.  
**Upgrade rule:** Wire select **on Fabric** (`planner-fabric-stage` only). Do **not** add a second plan host to “prove W3.”

**Out of scope:** Orbit (P04) · save (P06) · full journey (P07) · chrome/W8 · second plan host.

---

## Architecture (target = Fabric host)

```
Select (V) → PlannerCanvasStage (Fabric)
  → pick / Fabric object hit → setSelection({ type: "furniture", ids })
Delete|Backspace → useWorkspaceKeyboard → applySelectionDelete (pure)
  → one updateProject → selection none
Ctrl/Cmd+Z → history.undo → same id + pose
Esc → clears draw/place and selection
```

Document selection only. Rotation stays **degrees** in document.  
`pickFurnitureAtPoint` may remain the pure hit helper — call it from Fabric stage / workspace, not from archive.

---

## Touch list

| File | Role |
|------|------|
| `canvas-fabric-stage/PlannerFabricStage.tsx` | Select pointer → selection (raise here) |
| `…/lib/geometry/canvasPicking.ts` | `pickFurnitureAtPoint` (pure) |
| `…/editor/OOPlannerWorkspace.tsx` | `deleteSelection`, Esc |
| `…/editor/useWorkspaceKeyboard.ts` | Del/Bksp + `preventDefault` |
| `…/editor/workspaceEntityHelpers.ts` | Pure `applySelectionDelete` |
| Units | pick · delete+undo · keyboard · **Fabric** select |
| Browser | select → delete → undo on live canvas |

---

## Kill order (unchecked)

- [ ] Evidence dir + HEAD + NOTES (Approach A; Fabric host named)
- [ ] Unit: pick hit/miss/top-most/rotation
- [ ] Pure delete + undo same id/pose; one history step for multi-id
- [ ] Wire Fabric select → `setSelection`; empty clears
- [ ] Del/Bksp + Esc on live host
- [ ] Unit logs under `03-select-delete/`
- [ ] **Browser:** select → delete → undo; `run.json` + PNGs/trace
- [ ] Sole host `planner-fabric-stage` · no flag-OFF alternate-host theater

**W3 red until** browser artifacts under `03-select-delete/`.  
**Next (sequence):** [P04](./P04-orbit-continuity.md) only.
