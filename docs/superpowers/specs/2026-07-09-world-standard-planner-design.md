# Design: World-standard open3d planner (O&O)

**Date:** 2026-07-09  
**Status:** **APPROVED** — Approach **A** (Product Journey First) · implementation unlock recorded 2026-07-09  
**Record:** `Plans/trustdata/00-START.md` · evidence `results/planner/world-standard-wave/00-start/NOTES.md`  
**Authority:** Owner message > `AGENTS.md` > `Plans/trustdata/` > this spec > ayushdocs honesty  
**Checkout:** `.` only · commit as we go · no worktrees  
**Research:** Ideas only (`D:\websites`, ethics). Firecrawl was for ideas, not copy.  
**Bar:** Global manufacturer-planner standard · quality over speed · no approach re-debate.

---

## 1. Problem

P0 checkboxes and unit-green spines do **not** meet the ordered product standard.  
The product must feel like a **serious manufacturer furniture planner**, not a demo of boxes.

Honest today:

- Happy path **exists** in code (wall → place → 2D → 3D → local save).
- User-visible quality **fails** world bar (no furniture select/delete, boxes in 3D, no browser acceptance, no cloud save, SVG not canvas authority).

---

## 2. Product standard (definition of done)

### North star (O&O, not a clone)

> A facilities buyer can, **without a developer**, open the planner, lay out a small office with **real O&O-scale furniture**, switch **2D↔3D** with orbit, **select/edit/delete**, **save and return** the next day, and trust dimensions enough to **quote** later.

### Acceptance gates (all required)

| ID | Gate | Proof |
|----|------|--------|
| **W1** | Draw structure (walls + door opening) on `/planner/open3d` or guest | Playwright + screenshots |
| **W2** | Place ≥2 catalog items including **cabinet-v0**; 2D symbols readable (Block2D, not empty blob) | Playwright + PNG |
| **W3** | Select furniture + Delete/Backspace removes it; undo restores | Unit + Playwright |
| **W4** | 2D↔3D toggle preserves pose; **3D orbit** enabled | Playwright + console clean |
| **W5** | Save → hard reload → same walls + furniture ids | Playwright (wait autosave or explicit flush) |
| **W6** | Member path: status text does not lie — “local” vs “cloud” truthful; cloud wire **or** honest local-only label | Code + UI copy + test |
| **W7** | Mesh quality **bar doc** + visual: modular not “apology boxes” for cabinet-v0 (toe/door/carcass readable) | Visual smoke + NOTES |
| **W8** | Tool/shortcut labels match handlers | Unit + keyboard test |

**Out of scope for this design (later phases):** photoreal renders, full Fabric walls cutover if W1–W8 can land on Feasibility+select first, multiplayer, AR, Supabase multi-tenant catalog migration, SSR.

---

## 3. Approaches (choose one)

### Approach A — **Product Journey First** (recommended)

Ship W1–W8 on **current FeasibilityCanvas + document model**, fix select/delete/orbit/save honesty, raise cabinet-v0 mesh + Block2D symbols, add open3d Playwright pack.

| Pros | Cons |
|------|------|
| Matches owner pain (“it doesn’t work”) | Defers full Fabric 2B.2 |
| Uses existing spine | Temporary dual-engine debt |
| Fastest path to browser truth | Must not abandon Fabric decision |

### Approach B — **Fabric Full Stage First**

Stop Feasibility interactive tools; complete Fabric walls/furniture/select before browser journey.

| Pros | Cons |
|------|------|
| Aligns Plan A 2B.2 literally | Long dark period; historically thrashy |
| One 2D engine end-state | Higher risk of “still not working” for weeks |

### Approach C — **Chrome + 2A First**

Finish RAC, CSS gates, mobile drawers before canvas product loop.

| Pros | Cons |
|------|------|
| Premium feel | Canvas still unusable → user still says “not working” |

**Owner pick (locked 2026-07-09): A.** Fabric (B) remains the 2D destination **after** W1–W8 green. 2A items that block W (Delete, labels, a11y that hide tools) stay pulled into A. Do not re-open B/C unless the owner changes the goal.

---

## 4. Architecture (Approach A)

```
Document (open3d project, UUID entities)
    ├── FeasibilityCanvas (structure + furniture hit-test + Block2D draw)
    ├── Inventory place → placementAction / modular G5-G8
    ├── ThreeViewerInner (orbit ON; procedural + optional GLB)
    └── Autosave (IDB) + honest status; cloud as follow-on slice
```

**Non-negotiables from Plan A / 00A:**

- No designer static GLB  
- Entity ids = `crypto.randomUUID` via `newEntityId`  
- Fabric remains **target** full 2D engine; flag path preserved  
- Phosphor only; CSS modules/tokens  
- Evidence under `results/planner/world-standard-wave/`

### Key file targets (implementation plan will expand)

| Concern | Primary paths |
|---------|----------------|
| Select furniture | `FeasibilityCanvas.tsx`, pick helpers |
| Delete key | `OOPlannerWorkspace.tsx` + `useWorkspaceKeyboard.ts` |
| Orbit | `ThreeViewerInner.tsx` / lazy viewer props |
| Place UX | `OOPlannerWorkspace.tsx`, `InventoryPanel.tsx` |
| 2D symbols | `furnitureBlock2D.ts`, `renderBlock2DToCanvas.ts` |
| Mesh bar | `modularCabinetV0.ts` |
| Browser proof | NEW `site/tests/e2e/open3d-world-standard-journey.spec.ts` |
| Autosave flush | `useOpen3dWorkspaceAutosave.ts`, `persistence.ts` |

---

## 5. Workstreams (parallel agents max 8)

| # | Stream | Skills |
|---|--------|--------|
| 1 | Furniture select + delete + undo | TDD, systematic-debugging |
| 2 | Tool/shortcut truth | TDD |
| 3 | 3D orbit + continuity assert | chrome-devtools, TDD |
| 4 | Block2D + cabinet mesh quality bar | TDD, verification |
| 5 | Autosave flush + honest save copy | TDD |
| 6 | Playwright open3d journey W1–W5 | verification, chrome-devtools |
| 7 | 2A blockers only (dead prefs, inventory a11y noise) | a11y |
| 8 | Docs: 00-PENDING + honesty + evidence index | Agents-docs |

**Process:** subagent-driven development per stream after plan approval · commit each landable slice · push on owner ask.

---

## 6. Testing strategy

1. **Red/green unit** for pick furniture, deleteSelection wiring, shortcut map, mesh footprint.  
2. **Playwright** gold pattern copy from `admin-svg-publish-p01` → `results/planner/world-standard-wave/02-browser-open3d-journey/`.  
3. **No claim “works”** without screenshots + `playwright-run.json` proof block.  
4. Re-run `pnpm p0:g8` / `p0:unit` as non-regression each wave.

---

## 7. What we will not do

- Call P0 enough  
- Copy competitor UI/assets  
- Worktrees / vibe isolation  
- Multi-week plan without browser proof  
- Expand to CRM/SSR while W1–W8 red  

---

## 8. Owner approval checklist

- [ ] North star wording OK  
- [ ] Approach **A / B / C** chosen (recommend A)  
- [ ] Gates W1–W8 OK (edit list if needed)  
- [ ] Then: write `docs/superpowers/plans/2026-07-09-world-standard-planner.md` and execute  

**Spec path:** `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`
