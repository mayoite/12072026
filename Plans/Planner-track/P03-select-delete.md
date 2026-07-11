# P03 — Select / delete / undo (W3)

**Status:** OPEN / REPROVE — not complete. Old `03-select-delete/` packs are clues only.

**Gate:** **W3** / CP-03 — select furniture on 2D · Delete/Backspace remove · Ctrl/Cmd+Z restore **same id + pose**.  
**Hard rule:** unit **+** browser under `03-select-delete/`. Unit alone = **FAIL**. Journey folder must not substitute.  
**Evidence:** `results/planner/world-standard-wave/03-select-delete/`  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Buyer on `/planner/open3d` (or guest) selects furniture, deletes it, undoes to same entity.

**Bar:** Furniture only — no multi-select, 3D pick, Fabric cutover, openings as first-class targets.

**Out of scope:** Orbit (P04) · save (P06) · full journey (P07) · chrome/W8 · Fabric walls.

---

## Architecture

```
Select (V) → FeasibilityCanvas → pickFurnitureAtPoint → setSelection({ type: "furniture", ids })
Delete|Backspace → useWorkspaceKeyboard → applySelectionDelete (pure)
  → one updateProject (multi-id must not N× history) → selection none
Ctrl/Cmd+Z → history.undo → same id + pose
Esc → clears draw/place **and** selection
```

Prove with Fabric furniture flag **OFF**. Document selection only — no Fabric-stage / `firstFurnitureCenter` as W3 proof. Furniture rotation stays **degrees** in document (pick converts for hit math).

---

## Touch list

| File | Role |
|------|------|
| `…/lib/geometry/canvasPicking.ts` | `pickFurnitureAtPoint` |
| `…/canvas-feasibility/FeasibilityCanvas.tsx` | Select pointer path |
| `…/editor/OOPlannerWorkspace.tsx` | `deleteSelection`, Esc |
| `…/editor/useWorkspaceKeyboard.ts` | Del/Bksp + `preventDefault` |
| `…/editor/workspaceEntityHelpers.ts` | Pure `applySelectionDelete` |
| Units | pick · delete+undo · keyboard · feasibility select |
| Browser | Playwright or chrome-devtools select→delete→undo |

Prefix: `site/features/planner/open3d/`.

---

## Kill order (unchecked)

- [ ] Evidence dir + HEAD + NOTES (Approach A)
- [ ] Unit: `pickFurnitureAtPoint` (hit / miss / top-most / rotation)
- [ ] Pure delete + undo same id/pose; **one** history step for multi-id
- [ ] Wire `deleteSelection`; Del/Bksp `preventDefault`
- [ ] Canvas select furniture (Select tool); empty clears
- [ ] Esc clears selection
- [ ] Unit pack logs under `03-select-delete/` (exit 0)
- [ ] **Browser:** select → delete → undo; `run.json` + raw log + PNGs/trace
- [ ] No `any`; commits on `.` only

**W3 red until** browser artifacts exist under `03-select-delete/`. Count-only browser ≠ id/pose proof.  
**Next:** [P07](./P07-draw-place-journey.md) (journey) / fill [P04](./P04-orbit-continuity.md) per BOARD kill order.
