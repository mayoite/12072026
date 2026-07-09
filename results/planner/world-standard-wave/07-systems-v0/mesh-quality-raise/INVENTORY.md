# Workstation mesh quality raise — inventory

**Date:** 2026-07-09  
**Scope:** Gap between current `workstation-v0` multi-part mesh and the **cabinet-v0** W7 quality bar.  
**Authority:** Code + `07-systems-v0/NOTES.md` + `08-mesh-quality/NOTES.md`.  
**Slice goal:** Minimal readable raise — **legs + unique part names**. Not photoreal.

---

## 1. What already works

### geometryMode `workstation-v0`
- Furniture stamps `geometryMode: "workstation-v0"` and serializable `workstationOptions` on place.
- Viewer path: `createSceneObjectFromNode` detects mode → `generateWorkstationV0Mesh` → multi-part `THREE.Group` (no designer GLB, sync procedural fallback).
- Catalog demo items and free configurator both land on this mode (not single apology `box`).

### Multi-part procedural mesh
| Piece | Source | Behavior |
|-------|--------|----------|
| Pure plan | `generateWorkstationV0MeshPlan` | mm sizes, positions, role colors |
| THREE build | `generateWorkstationV0Mesh` | one `BoxGeometry` mesh per part |
| Roles | desk, return, pedestal, panel, overhead | role-colored materials |
| Layout | `workstationPlanPrims` → footprint-centered | L/linear + modules |
| Heights | constants | worktop 30mm slab at `heightMm`; panel 1100; overhead 350 + 200 gap; pedestal floor→under top |

Constants already locked in mesh module:
- `WORKTOP_THICKNESS_MM = 30`
- `PANEL_HEIGHT_MM = 1100`
- `OVERHEAD_HEIGHT_MM = 350`
- `OVERHEAD_GAP_MM = 200`

### Place stamp path
- `placeWorkstationConfigOnProject` → `addFurniture` + stamp:
  - `catalogId` = `workstationConfigKey` (`ws-v0-…`)
  - footprint W/D from `workstationFootprintMm`
  - `height` from config
  - `geometryMode: "workstation-v0"`
  - `workstationOptions` (shape, length/depth/height mm, modules)
  - action type `PLACE_WORKSTATION_V0`
- Inventory / catalog: `placeCatalogItemInProject` routes `ws-v0-…` → same helper.
- Batch: `placeWorkstationInstancesOnProject` / Place N seats.
- Scene rebuild: options → `workstationConfigFromOptions` → mesh; fallback parse key or desk-only linear.

### Systems v0 product surface (not mesh, but live)
- Size grid + linear/L, modules, configurator panel, plan Block2D prims, place/delete e2e, batch + quantity BOQ, 3D multi-part screenshot evidence (`42-workstation-mesh-3d.png`).

### Cabinet-v0 pattern to match (quality bar reference)
Cabinet already sets the **named multiparts** bar (W7 / P08):
- Unique child names: `toe` → `carcass` → `door-slab` | `door-left`/`door-right`
- Readable silhouette (base band + body + face)
- Height integrity (toe **replaces** bottom of carcass; no SKU overshoot)
- Part count matrix + materials contrast
- Same architectural shape as workstation mesh: options → pure geometry → group; place stamps `geometryMode` + options; scene factory builds group

---

## 2. Honest residual (vs cabinet-v0 bar)

Workstation multi-part is **landed but below** the cabinet “not apology boxes” bar for furniture readability.

| Gap | Detail |
|-----|--------|
| **Floating tops** | Desk/return are thin 30mm slabs with top face at `heightMm`. No continuous understructure unless a pedestal prim happens to sit under them. Reads as levitating work surface. |
| **No legs** | No leg / post / frame parts. Pedestal is a storage box role only, not a structural four-post or C-leg system. |
| **Boxy only** | Every part is a single axis-aligned box. No edge break, rail, or thickness hierarchy beyond role height. |
| **Non-unique names** | `part.name = role` (`"desk"`, `"return"`, …). L-shape or repeated roles collide on `mesh.name`. Cabinet locks **unique** names (`toe`, `carcass`, `door-slab`). |
| **No support band analog** | Cabinet’s `toe` gives a ground-contact readable band. Workstation has no equivalent ground language (legs or plinth). |
| **Height story weaker** | Worktop floats at work height; nothing spans floor→top except optional pedestal under one zone. Silhouette fails three-quarter “this is a desk” without support. |

**Already documented residual** (`07-systems-v0/NOTES.md`): *Still boxy multiparts — worktop slab + pedestal/panel/overhead boxes; no legs, handles, or photoreal materials.*

**Does not claim** world-standard product mesh complete — only that multiparts + place path exist.

---

## 3. Recommended minimal quality raise (this slice)

**In scope for implementer — two bullets only:**

### A. Legs (ground contact under worktops)
- Add procedural **leg** box parts under desk (and return when present).
- Goal: kill floating-top read; three-quarter view shows posts from floor to underside of worktop (or clear knee zone + short stubs — implementer call; prefer simple corner posts first).
- Pattern after cabinet: named mesh children, mm constants exported from mesh module, height integrity (legs + worktop total story must not invent a second height system).
- Do **not** require real product CAD; boxes are fine if they read as structure.

### B. Unique part names
- Stop using bare role as the only name when duplicates can exist.
- Adopt stable unique strings, e.g. `desk`, `return`, `pedestal`, `panel`, `overhead`, and for legs `leg-fl`, `leg-fr`, `leg-bl`, `leg-br` (or `leg-0`… with documented order).
- Align with cabinet W7 discipline: **exact name strings** testable; plan names === mesh names.
- Keep `userData.role` for role semantics; `name` for identity.

### Suggested acceptance (minimal)
1. Default linear desk mesh has **≥1 leg parts** with floor Y≈0 and top under worktop.
2. Every child `mesh.name` unique within the group.
3. Existing place stamp / `geometryMode` / options serialization **unchanged** (no new document fields required unless legs need options — prefer derived from size).
4. Unit: plan part list names + count; scene object child names.
5. Optional: one headless or e2e 3D shot showing non-floating desk (evidence under this folder).

**Not required this slice:** handles, cable trays, screens with thickness profiles, material families beyond current role hex colors, GLB export polish.

---

## 4. Key file paths for implementer

| Role | Path |
|------|------|
| **Primary edit — mesh plan + THREE** | `site/features/planner/open3d/catalog/workstationMeshV0.ts` |
| **Named-parts reference (cabinet)** | `site/features/planner/open3d/catalog/modularCabinetV0.ts` |
| **Place stamp** | `site/features/planner/open3d/catalog/placementAction.ts` (`placeWorkstationConfigOnProject`) |
| **Scene factory** | `site/features/planner/open3d/3d/createSceneObjectFromNode.ts` |
| **Config / prims / footprint** | `site/features/planner/open3d/catalog/workstationSystemV0.ts` |
| **Options type on furniture** | `site/features/planner/open3d/model/types.ts` (`Open3dWorkstationV0Options`, geometryMode union) |
| **Catalog seeds** | `site/features/planner/open3d/catalog/workstationCatalogV0.ts` |
| **Unit tests (extend)** | `site/tests/unit/features/planner/open3d/workstationMeshV0.test.ts` |
| **Scene factory tests** | `site/tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts` |
| **Placement tests** | `site/tests/unit/features/planner/open3d/workstationPlacementV0.test.ts` |
| **Cabinet bar (normative style)** | `results/planner/world-standard-wave/08-mesh-quality/NOTES.md` |
| **Systems context** | `results/planner/world-standard-wave/07-systems-v0/NOTES.md` |
| **This inventory** | `results/planner/world-standard-wave/07-systems-v0/mesh-quality-raise/INVENTORY.md` |

### Likely touch pattern
1. Extend `generateWorkstationV0MeshPlan` to emit leg parts + unique names (pure mm).
2. `generateWorkstationV0Mesh` already maps plan → named boxes — should pick up legs if plan is complete.
3. Update `countWorkstationV0Parts` expectations in unit tests.
4. Scene factory / place path: **no change** if options shape unchanged.
5. Evidence: vitest log + optional PNG under `results/planner/world-standard-wave/07-systems-v0/mesh-quality-raise/`.

---

## 5. Out of scope (explicit)

| Item | Why out |
|------|---------|
| **Photoreal GLB / designer assets** | Product rule: procedural modular path; no hand-made product GLB under `public/`. |
| **Fabric cutover** | Separate systems track; live path is open3d. |
| **Priced BOQ** | Quantity BOQ exists; pricing is a later product slice. |
| **Handles, hinges, edge banding, AO beauty pass** | Cabinet residual also skips these; not this raise. |
| **Client multi-tenant catalogs (Philips/Ford)** | Catalog identity work, not mesh quality. |
| **Free height UI** | Deferred in systems NOTES; mesh can still use `heightMm` from config. |
| **Broad mesh-quality wave for all furniture** | This slice is **workstation-v0 only**; cabinet W7 already closed its bar. |

---

## 6. Gap summary (one glance)

```
cabinet-v0 bar:   toe + carcass + door(s)  | unique names | ground contact | height integrity
workstation now:  floating worktop boxes   | role names   | optional pedestal only | multiparts live
this slice:       + legs under tops        | + unique names
later:            materials polish, optional visual smoke, priced BOQ, Fabric — not here
```

---

## 7. Source map

| Claim | Source |
|-------|--------|
| Floating tops / no legs residual | `workstationMeshV0.ts` heightForRole + NOTES honest residual |
| Multipart + stamp live | `placementAction.ts`, `createSceneObjectFromNode.ts`, 07 NOTES “Multi-part 3D mesh — done” |
| Cabinet named parts bar | `modularCabinetV0.ts`, 08-mesh-quality NOTES |
| Place path geometryMode | `placeWorkstationConfigOnProject` lines stamp `workstation-v0` + options |
