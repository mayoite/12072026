# Execute 3/5 — pose / document continuity product audit

**Date:** 2026-07-10  
**Track:** P04 FROM SCRATCH (W4 orbit continuity)  
**Seat:** Execute 3/5 — product audit only (no thrash)  
**HEAD at audit:** `f692ca963a68224e2daefee70b65d780a9ef766d`  
**Verdict:** **OK** — continuity = document only; 2D↔3D must not invent ids. No product fix required.

---

## Law (product)

| Rule | Meaning |
|------|---------|
| **Continuity = document only** | `Open3dProject` is sole pose authority. View mode (2D/3D) is chrome. Unmount/remount 3D rebuilds from document; never rewrite document pose from mesh. |
| **Ids are sticky** | Scene nodes and meshes carry `id` / `userData.entityId` from document entity ids. **2D↔3D must not invent ids.** |
| **Document rotation = degrees** | Furniture `Open3dFurnitureItem.rotation` is plan degrees (canvas / properties / pureActions `% 360`). |
| **Node rotation = radians** | Adapter converts once: `degreesToRadians(item.rotation)`. |
| **Mesh sign flip intentional** | `mesh.rotation.y = -node.rotation` (plan Y → world Z / Y-up). Not drift. |

---

## Files audited

| File | Role | Result |
|------|------|--------|
| `site/features/planner/open3d/3d/buildOpen3dSceneNodes.ts` | Pure document → scene nodes | **GREEN** |
| `site/features/planner/open3d/3d/createSceneObjectFromNode.ts` | Node → THREE mesh; sign flip + entityId | **GREEN** |
| `site/features/planner/open3d/model/types.ts` | `Open3dFurnitureItem.rotation` | **GREEN** (degrees by convention; see residual note) |
| `site/features/planner/open3d/model/units.ts` | `degreesToRadians` / `normalizeDegrees` | **GREEN** |
| `site/features/planner/open3d/3d/ThreeViewerInner.tsx` | Rebuild effect: nodes → meshes; GLB replace by entityId | **GREEN** (read for continuity wire) |
| Units / continuity tests | `poseContinuityW4`, `documentViewContinuity`, adapter + mesh factory | **Support GREEN** (not re-run this seat) |

---

## 1. `buildOpen3dSceneNodes` — degrees → radians

**Path:** `site/features/planner/open3d/3d/buildOpen3dSceneNodes.ts`

### Id pass-through (no invent)

- Walls: `id: wall.id` (L71).
- Furniture: `id: item.id` (L111).
- Adapter is pure: `Pick<Open3dProject, "floors" | "activeFloorId">` in → `Open3dSceneNode[]` out. **Does not mutate project.**

### Furniture rotation conversion

```ts
// Document rotation is degrees (2D canvas, properties); scene nodes are radians.
rotation: degreesToRadians(item.rotation),
```

- `degreesToRadians` (`model/units.ts`): `normalizeDegrees(degrees) * Math.PI / 180`.
- Negative document angles normalize (e.g. −90 → 270°) before convert — unit suite asserts this.

### Wall rotation (not document degrees)

- Walls have **start/end** points, not a degrees field on the wall entity for plan angle.
- Node rotation = `Math.atan2(dy, dx)` — **already radians** from geometry.
- Document furniture degrees and wall atan2 radians both land on `Open3dSceneNode.rotation` as **radians** before mesh factory. Dual source, single node unit. Correct.

### Pose fields from document

| Document | Node |
|----------|------|
| `item.id` | `id` |
| `item.position.x/y` (mm) | `xMm` / `yMm` |
| `item.width/depth/height` × scale | `widthMm` / `depthMm` / `heightMm` |
| `item.rotation` **degrees** | `rotation` **radians** via `degreesToRadians` |
| `geometryMode` / modular / workstation options | shallow-copied pass-through |

---

## 2. `createSceneObjectFromNode` — mesh sign + entityId

**Path:** `site/features/planner/open3d/3d/createSceneObjectFromNode.ts`

All four mesh paths set:

1. `name = node.id`
2. `userData.entityId = node.id` (no new UUID)
3. `rotation.y = -node.rotation` (intentional sign)

| Path | Lines (approx) | entityId | `rotation.y` |
|------|----------------|----------|--------------|
| modular-cabinet-v0 Group | L109–123 | `node.id` | `-node.rotation` |
| workstation-v0 Group | L149–162 | `node.id` | `-node.rotation` |
| parametric box Mesh | L176–189 | `node.id` | `-node.rotation` |
| wall / fallback BoxGeometry | L220–225 | `node.id` | `-node.rotation` |

**Position:** plan mm → metres (`mmToMeters`); plan Y → world Z; modular/workstation floor origin `y = 0`; box/wall center at half height.

**GLB async path (related, not rewritten):** `loadGeneratedGlbObject` also uses `-node.rotation` + `entityId: node.id`. `ThreeViewerInner` replaces by `child.userData.entityId === node.id` — still document id, not invented.

Unit: `createSceneObjectFromNode.test.ts` — “applies plan rotation about world Y (negated)” → modular/box/wall all `rotation.y === -rot`.

---

## 3. Document types — rotation convention

**Path:** `site/features/planner/open3d/model/types.ts`

```ts
export interface Open3dFurnitureItem {
  id: string;
  catalogId: string;
  position: Open3dPoint;
  rotation: number;  // convention: plan degrees (see units.ts + pureActions)
  ...
}
```

### Live convention proof (code, not JSDoc on field)

| Location | Fact |
|----------|------|
| `model/units.ts` L24–27 | Comment: plan/document rotation is **degrees**; scene nodes use radians |
| `pureActions.rotateFurniture` | `(fi.rotation + angle) % 360` — degree ring |
| `pureActions.setFurnitureRotation` | `((angle % 360) + 360) % 360` |
| Adapter L118–119 | Explicit convert degrees → radians |
| `poseContinuityW4.test.ts` | Document stays `rotation: 90` after rebuild; node ≈ `degreesToRadians(90)` |
| `documentViewContinuity.test.ts` | Place/update in degrees; node rad; **ids stable** across pose edit |

**Residual (doc only, not product RED):** `Open3dFurnitureItem.rotation` has no adjacent `/** degrees */` JSDoc. Convention is enforced by adapter + ops + tests. **Do not thrash** types mid-P04 for a comment unless a separate docs slice wants it.

---

## 4. 2D↔3D id continuity

| Layer | Id contract |
|-------|-------------|
| Document | `Open3dFurnitureItem.id` / wall `id` — UUID (or factory) at **create** only |
| Scene node | `Open3dSceneNode.id === item.id \| wall.id` |
| THREE mesh | `name` + `userData.entityId === node.id` |
| Fabric 2D (support) | `furnitureFabricMapper`: “entityId on Fabric objects MUST equal Open3dFurnitureItem.id — **never invent ids**” |
| Viewer rebuild | `buildOpen3dSceneNodes` → `addNodesToGroup` / GLB swap by entityId |

**Out of scope for this law (not view-toggle invent):** `importUtils.generateId` on **import** of foreign files — new entities on ingest, not 2D↔3D remount.

**Double rebuild:** pure adapter twice with same project → same node ids / xMm / yMm / rotation (unit: `poseContinuityW4`, `documentViewContinuity`). Document furniture id/position/rotation unchanged after rebuilds.

---

## 5. Continuity chain (one diagram)

```
Open3dProject (sole authority)
  furniture.rotation: degrees
  furniture.id / wall.id: sticky UUIDs
        │
        ▼  buildOpen3dSceneNodes (pure; no mutate)
Open3dSceneNode
  id = document id
  rotation: radians (furniture: degreesToRadians; wall: atan2)
        │
        ▼  createSceneObjectFromNode
THREE.Object3D
  userData.entityId = node.id
  rotation.y = -node.rotation   ← intentional sign
```

View toggle 2D→3D→2D→3D: remount rebuilds from document. **No id invent. No document degrees rewrite to radians.**

---

## Mode B

**Not required.** Product path matches P04 IMPLEMENTATION-PLAN §1.1 and phase law “pose continuity = document only.” No rewrite of adapter, mesh factory, or document rotation units.

---

## Risk list

| # | Severity | Item | Action |
|---|----------|------|--------|
| R1 | **None product** | Degrees/radians/sign/id path is consistent and unit-backed | **OK — leave** |
| R2 | Residual docs | `Open3dFurnitureItem.rotation` lacks `/** degrees */` JSDoc | Optional later; **no thrash now** |
| R3 | Out of seat | Browser 2D↔3D orbit pack / console honesty still separate P04 seats | Not this audit |
| R4 | Out of seat | Vitest pose/orbit packs may need fresh log deposit under `04-orbit-continuity/` | Exec other seats / Task unit re-prove |

**No product RED. No code change from this seat.**

---

## Return

**OK**
