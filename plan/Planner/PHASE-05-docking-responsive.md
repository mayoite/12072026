# PHASE-05 — Docking + responsive

**Parallel:** yes · **Blocks on:** — · **Proof:** live browser + screenshots

---

## In plain words
The planner has side and bottom panels (inventory, properties, layers). This phase lets a user
arrange them — dock them to an edge, float them, or collapse them — and remembers that layout
next time. It also makes the whole thing work on phone-sized screens (375×812) and proves the
**workspace height chain** — canvas fills its container at every breakpoint, no clipped layout.

## Why this matters
Professionals want their own layout; casual users are often on a laptop or tablet. A canvas that
collapses to zero height or overflows makes the product look broken even when features work.
The docking engine is already half-built — this phase finishes and proves it.

## What exists today (grounded in code)
- `editor/useDockingSystem.ts` — `docked | floating | collapsed`; persists to `localStorage`.
- `ui/MobileDrawerSheet.tsx`, `ui/BottomSheet.tsx` — mobile panel containers.
- `editor/workspace.module.css` — height/overflow chain.
- Height chain must be re-proved at four breakpoints (not assumed from a one-off manual check).

## Steps
1. Surface dock / undock / collapse controls; confirm layout persists across reload.
2. Audit mobile drawers: no focus trap, rail + save + view toggle reachable at 375×812.
3. **Height chain proof** at 375×812, 1280×720, 1920×1080, 2560×1440 — canvas fills container,
   no unexpected scrollbars.

## Done when
Boxes in `plan/Planner/CHECKLIST.md` → PHASE-05.

## How to prove
Rearrange panels, reload, confirm layout restored. Run height/overflow check at four breakpoints.
Shrink to 375×812 and complete draw→place→save→3D one-handed.

Raw artifacts → `results/planner/phase-05/`. Report → `agents-work/reports/planner-phase-05.md`.

## Guardrails
- Do not edit `core/locked/**` CSS to pass — layout truth, not locked-file hacks.
- Persisted layout must survive reload.

## Out of scope
- Console-error audit and standing regression spec — Planner P07.
- Marketing site chrome — Site P02.