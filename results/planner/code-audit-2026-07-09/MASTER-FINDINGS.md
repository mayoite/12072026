# Code audit — trust the repo (2026-07-09)

**Method:** Read live code under `site/features/planner` + tests/config.  
**Not trusted:** plan checkboxes, NOTES “PASS”, owner narrative.  
**Agents:** A interaction/persist · B mesh/symbols · C tests/gates (full reports alongside).  
**Tip at audit:** `7fc5a32` (docs) — product code same family as systems-v0 lands.

---

## What the code actually is

A real open3d workspace with:

- FeasibilityCanvas 2D + Three 3D
- Document model (floors, walls, furniture, UUID-ish entities)
- Systems v0 workstation rules + configurator + batch place
- Cabinet-v0 multi-part mesh; workstation multi-part boxes
- Local IDB autosave with “Saved locally” copy
- Many unit tests; open3d Playwright specs exist as files

It is **not** a finished manufacturer planner. Several paths look complete in demos (0° place, count-based e2e) while core math/UI/money is incomplete.

---

## Critical / high (buyer-visible or correctness)

### 1. Furniture rotation: degrees in document, radians in 3D (BUG)

| Layer | Unit |
|-------|------|
| Document / pureActions | **degrees** (`normalizeDegrees`, `% 360`) |
| Scene node type comment | “Radians” |
| Wall nodes | `Math.atan2` → **radians** (OK) |
| Furniture nodes | `rotation: item.rotation` **no convert** |
| Three | `mesh.rotation.y = -node.rotation` as radians |

**Effect:** Default place at 0° looks fine. Any rotate-in-2D furniture is **wrong in 3D**. Silent until someone rotates.

**Files:** `model/actions/furniture.ts`, `model/operations/pureActions.ts`, `3d/buildOpen3dSceneNodes.ts`, `3d/createSceneObjectFromNode.ts`

### 2. BOQ / quote has no money

`workstationBoqV0.ts`: qty + footprint + label only. Explicit “price later.”  
`workstationBoqToQuoteCartItems` → `{ id, name, qty }` only.  
Catalog items (demo + systems) often **omit `pricing`**.  
UI still offers price sort keys.

**Effect:** Cannot quote a facilities buyer. Success metric (BOQ > photoreal) is unfinished in code.

### 3. Catalog is mostly demo / sample, not O&O SKUs

`demoCatalogItems.ts`: proof item + sample sofa/desk/table/chair + workstation matrix.  
Fallback when API empty: demo list.  
Workstation catalog has placeholder images, no real price, “Premium laminate” marketing string.

**Effect:** Product story is systems rules; inventory truth is still samples.

### 4. 3D is view-only; incomplete scene

- No raycast select/delete in 3D (`ThreeViewerInner`)
- Scene nodes: **walls + furniture only** — no doors/windows/rooms (`buildOpen3dSceneNodes`)
- Most SKUs → single parametric **box**; only cabinet-v0 / workstation-v0 multi-part

### 5. Export menus over-promise

`OOPlannerWorkspace.tsx`: PDF/PNG path message **“coming soon”** while other export paths exist.  
Preflight/UI can still present export affordances.

### 6. Wall delete does not cascade openings

`applySelectionDelete` filters the selected collection only.  
`pureActions.removeWall` has cascade logic but product delete path doesn’t use it → orphan doors/windows risk.

### 7. Cloud save is dead code next to honest local labels

`workspaceStatusLabels.ts`: correctly says local.  
`memberPlanRepository.ts` + guest promotion exist; **not wired** into open3d autosave path (IDB only).  
Labels honest; cloud capability is shelfware.

### 8. GLB path almost never runs

Place leaves procedural default; `generatedGlbUrl` opt-in narrow.  
Viewer loads GLB only when policy allows; else silent procedural.  
Public generated fixtures tiny/scarce. Product 3D = boxes.

### 9. Fabric flag ON is a trap

Default OFF → real Block2D.  
Flag ON → Feasibility furniture layer off; Fabric draws empty/low-opacity rects (no prims).  
Must not “enable Fabric” expecting better symbols.

### 10. Tests / gates do not police the product

- Open3d e2e specs (**8 files**) not on default `gate` / release:fast
- Planner coverage allowlist ~ systems spine files only — editor/3d/persistence out
- Journey e2e: cabinet preferred **but falls back** to any catalog add
- Mesh e2e: count + screenshot, **not** multi-part mesh assert
- Soft select cues in systems place e2e (OR of weak signals)

---

## Medium (structure / maintainability)

| Issue | Evidence |
|-------|----------|
| God files | `FeasibilityCanvas` ~39KB, `OOPlannerWorkspace` ~35KB, `pureActions` ~35KB, `PropertiesPanel` ~37KB |
| Dual 2D engines | Feasibility live; Fabric flag + `_archive/fabric` |
| Dual symbol authority | Block2D canvas ≠ SVG publish pipeline ≠ `svgSymbols` |
| AI sketch stub | `sketchToPlan.ts` returns placeholder “success” path |
| Properties / command stubs | Reset/commit/save command paths incomplete per agent-A |
| Openings not first-class select | Select hits furniture → wall → room; doors/windows stretch |
| Workstation 2D vs 3D | 2D from catalogId parse; 3D from workstationOptions; overhead in 3D not plan prims |
| `totalSeats = totalInstances` | 1 seat per instance assumption in BOQ |

---

## What is *not* a lie (code does these)

- Select furniture + Delete + undo path exists (2D)
- Orbit default ON + `data-orbit-enabled`
- Autosave labels say “locally”
- Systems v0 pure rules + place + batch + configurator
- Cabinet-v0 named parts (toe/carcass/door) in mesh module
- Designer static GLB policy exists (blocks spoof)

These are real — they are also **narrow** relative to a quote-ready product.

---

## Priority if quality > time (suggested order)

1. **Fix rotation degrees→radians** (correctness bug; small, high impact)  
2. **Priced BOQ/GST on systems v0** (business metric)  
3. **Wire or hide** PDF/PNG / cloud / AI stubs (stop lying chrome)  
4. **Wall delete cascade** + opening select if structure tools matter  
5. **Don’t turn on Fabric** until symbols real  
6. **Put open3d e2e on a real gate script** (or stop claiming browser-green)  
7. Mesh polish only after money + rotation honesty  

---

## Agent report paths

- `agent-a-interaction-persist.md`  
- `agent-b-mesh-symbols.md`  
- `agent-c-tests-gates.md`  
