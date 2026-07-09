# Agent B — Mesh / 3D / SVG–Block2D / Fabric / Asset Pipeline Honesty Audit

**Date:** 2026-07-09  
**Scope:** Independent code-only audit of mesh symbols, 3D viewer, Block2D/SVG, fabric furniture flag, and GLB asset pipeline.  
**Authority:** Live sources under `D:\OandO07072026\site` only. Plan docs / NOTES / prior pass claims are **not** evidence.  
**Auditor:** Agent B (mesh-symbols)

---

## Verdict (one line)

**Procedural boxes and Block2D prims are the real product path; designer GLB is correctly blocked; system GLB is a narrow cabinet-v0 opt-in; Fabric-on replaces readable 2D symbols with empty rects; multiple 2D symbol authorities still compete.**

---

## Top findings (severity-ordered)

### F1 — CRITICAL: Fabric flag ON kills Block2D symbols and draws empty rects

When `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1`, workspace:

1. Forces FeasibilityCanvas furniture layer **off**
2. Mounts `FurnitureFabricLayer`, which paints **plain Fabric `Rect`s** (opacity `0.22`, no stroke, no prims, no door/desk cues)

| Path | Behavior |
|------|----------|
| Flag OFF (default) | `furnitureBlock2DFromItem` → `renderBlock2DCentered` — real plan symbols |
| Flag ON | Furniture layer hidden; Fabric rect ghost only |

**Files:**
- `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx` (lines ~223–231, ~889–920)
- `D:\OandO07072026\site\features\planner\open3d\canvas-fabric-stage\FurnitureFabricLayer.tsx` (lines ~137–162)
- `D:\OandO07072026\site\features\planner\open3d\canvas-fabric-stage\fabricFurnitureFlag.ts`

**Honesty label:** **Fake / empty symbols when flag enabled.** Stage is pose-proof infrastructure, not a furniture symbol renderer.

```137:162:D:\OandO07072026\site\features\planner\open3d\canvas-fabric-stage\FurnitureFabricLayer.tsx
    for (const item of furniture) {
      const pose = furnitureToFabricPose(item, transform);
      const rect = new Rect({
        left: pose.left,
        top: pose.top,
        width: pose.width,
        height: pose.height,
        angle: pose.angle,
        originX: "center",
        originY: "center",
        fill: resolveFurnitureFill(item),
        opacity: 0.22,
        strokeWidth: 0,
        // ...
      });
```

---

### F2 — HIGH: Default 3D product mesh is procedural boxes, not catalog GLB

Honest in comments; easy to oversell as “real assets.”

| Geometry mode | 3D builder | Reality |
|---------------|------------|---------|
| `modular-cabinet-v0` | `generateCabinetV0Mesh` | Toe + carcass + door **BoxGeometry** parts |
| `workstation-v0` | `generateWorkstationV0Mesh` | Role-colored **boxes** (desk/return/pedestal/panel/overhead) |
| everything else with W/D/H | `ParametricBuilder.generate3DMesh` | **Single** light-gray box `#f9fafb` |
| walls / missing dims | local `BoxGeometry` | Empty box fallback |

**Files:**
- `D:\OandO07072026\site\features\planner\open3d\catalog\workstationMeshV0.ts` — header: *“Not photoreal GLB”*; `BoxGeometry` per part
- `D:\OandO07072026\site\features\planner\open3d\catalog\modularCabinetV0.ts` — *“component choices without designer GLB”*
- `D:\OandO07072026\site\features\planner\open3d\3d\createSceneObjectFromNode.ts` — routes above; always `meshSource: "procedural"` on sync path
- `D:\OandO07072026\site\features\planner\open3d\catalog\parametricBuilder.ts` — single-box mesh for non-modular

**Honesty label:** Modular paths are **multi-part boxes**, not product photography meshes. Non-modular catalog = **empty box**.

---

### F3 — HIGH: GLB load path exists but product default rarely uses it; silent fail keeps boxes

Pipeline shape:

1. `createSceneObjectFromNode` **always** builds procedural first  
2. `ThreeViewerInner` filters `shouldLoadGlb(node.generatedGlbUrl)` then async `loadGeneratedGlbObject`  
3. Fail / policy reject → **keep procedural**, no UI error  
4. `placeCatalogItemInProject` **intentionally omits** `generatedGlbUrl`  
5. Only `cabinet-v0` inventory place routes to write+stamp (`shouldPlaceModularWithGeneratedGlb` id/slug only — **ignores** `geometryMode`)  
6. `modularCabinetV0GlbExport` is **plan-only** (`binaryExportStatus: "plan-only"`); real bytes are G5 `exportModularGlbBinary`  
7. On disk under public: only two fixture GLBs + `.gitkeep`  
   - `public/catalog-assets/generated/modular-cabinet-v0-600x580x720-slab-oak.glb` (~4.2 KB)  
   - `public/catalog-assets/generated/modular-cabinet-v0-600x580x720-slab-white.glb` (~4.3 KB)  
   Size consistent with box-export, not rich designer meshes.

**Files:**
- `D:\OandO07072026\site\features\planner\open3d\3d\ThreeViewerInner.tsx` (~255–311)
- `D:\OandO07072026\site\features\planner\open3d\3d\loadGeneratedGlbObject.ts`
- `D:\OandO07072026\site\features\planner\lib\glbAssetPolicy.ts` — rejects designer static; allows `catalog-assets/generated/*` + `blob:`
- `D:\OandO07072026\site\features\planner\open3d\catalog\placementAction.ts` (~273–331)
- `D:\OandO07072026\site\features\planner\asset-engine\mesh\shouldPlaceModularWithGeneratedGlb.ts`
- `D:\OandO07072026\site\features\planner\open3d\catalog\modularCabinetV0GlbExport.ts`
- `D:\OandO07072026\site\features\planner\asset-engine\mesh\exportModularGlbBinary.ts`
- `D:\OandO07072026\site\app\api\planner\generated-glb\route.ts`
- `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx` (~471–538)

**Honesty label:**  
- Designer GLB as product path: **correctly blocked**  
- System GLB as default experience: **false for almost all SKUs**  
- “GLB ready” depends on API write + stamp; message can still say procedural if write skipped  
- **Path-only stamp** (writeToPublic false) can set `generatedGlbUrl` without a fetchable file → load fails → silent box  

**Dual authority:** Document may claim generated GLB while viewer shows procedural boxes after silent miss.

---

### F4 — HIGH: Multiple 2D symbol authorities (dual/triple authority)

Plan symbols are **not** one pipeline:

| Authority | What it draws | Used by |
|-----------|---------------|---------|
| `furnitureBlock2DFromItem` | Block2D prims (modular cabinet cues, workstation plan prims, bridge, or box) | `FeasibilityCanvas` (default 2D) |
| `resolveCatalogItemBlock2D` / `blocks2d` | Buddy/catalog procedural symbols | Via bridge inside furnitureBlock2D fallback |
| `resolveFurniture2DFootprint` | Centered SVG **path** only: cabinet-v0 or **box** | Parametric / footprint helpers — **not** FeasibilityCanvas |
| `svgSymbols.ts` | Phase 03A inventory SVG registry | Catalog/inventory preview path — separate from open3d canvas |
| SVG **publish** (`compileSvgForPublish` / asset-engine) | Descriptor → publish SVG | Admin publish — **not** planner canvas furniture |
| `svgCompiler.server.ts` | Explicit **`v1-reference-only`** | Not live publish authority |
| Fabric rects | Empty pose boxes | Flag-on overlay only |

**Files:**
- `D:\OandO07072026\site\features\planner\open3d\catalog\furnitureBlock2D.ts`
- `D:\OandO07072026\site\features\planner\catalog\furnitureBlocks2d.ts` (**name collision**: kind resolver only, not symbols)
- `D:\OandO07072026\site\features\planner\catalog\catalogBlockBridge.ts`
- `D:\OandO07072026\site\features\planner\catalog\renderBlockPrims.tsx` → `blockToSvg`
- `D:\OandO07072026\site\lib\catalog\renderBlock2DToCanvas.ts`
- `D:\OandO07072026\site\features\planner\open3d\catalog\parametricBuilder.ts` (`resolveFurniture2DFootprint`)
- `D:\OandO07072026\site\features\planner\open3d\catalog\svg\svgSymbols.ts`
- `D:\OandO07072026\site\features\planner\asset-engine\svg\compileSvgForPublish.ts`
- `D:\OandO07072026\site\features\planner\open3d\catalog\svg\svgCompiler.server.ts` (line 10: *NOT publish authority*)

**Honesty label:** Open3d canvas symbols ≠ SVG publish ≠ inventory `svgSymbols` ≠ Fabric. Claiming “one SVG pipeline for planner furniture” is **false**.

---

### F5 — MEDIUM: Workstation 2D / 3D dual config authority

**3D** (`createSceneObjectFromNode`):

- Prefers `node.workstationOptions` → else `parseWorkstationConfigKey(catalogId)` → else default linear desk  
- Honors `geometryMode === "workstation-v0"`

**2D** (`workstationBlock2DFromItem`):

- **Only** parses `catalogId` / `sourceCatalogId` / `sourceSlug`  
- **Ignores** `geometryMode` and `workstationOptions`  
- `parseWorkstationConfigKey` rebuilds config **without** stored `heightMm` (defaults)

**Also:** `workstationPlanPrims` omits **overhead** (3D mesh adds overhead as vertical bin). Plan view never shows overhead module even when modules include it.

**Files:**
- `D:\OandO07072026\site\features\planner\open3d\catalog\furnitureBlock2D.ts` (~182–187, ~288–304)
- `D:\OandO07072026\site\features\planner\open3d\3d\createSceneObjectFromNode.ts` (~92–128)
- `D:\OandO07072026\site\features\planner\open3d\catalog\workstationMeshV0.ts` (~157–175)
- `D:\OandO07072026\site\features\planner\open3d\catalog\workstationSystemV0.ts` (~189–265)

**Honesty label:** 2D and 3D can diverge if options stamped without a parseable `ws-v0-…` key, or if height/options differ from key.

---

### F6 — MEDIUM: Fabric flag debt (default OFF, incomplete product)

- Flag: exact string `"1"` only; missing / `"true"` / `"0"` → **false**  
- Default production path: FeasibilityCanvas Block2D (good)  
- Flag-on path: incomplete (empty rects, F1)  
- Full legacy Fabric planner lives under `_archive/fabric/` — second historical authority, not wired as live open3d default  

**Files:**
- `D:\OandO07072026\site\features\planner\open3d\canvas-fabric-stage\fabricFurnitureFlag.ts`
- `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx`
- `D:\OandO07072026\site\features\planner\_archive\fabric\…`

**Honesty label:** Flag is real debt — enables dual canvas authority without feature-complete furniture symbols.

---

### F7 — MEDIUM: Unit / catalog bridge debt feeds generic boxes

`open3dLikeBuddyCatalogItem` divides open3d mm by **10** so buddy catalog fields (misnamed `*Mm` holding cm) can pass through `normalizeCatalogMm` ×10. Comment admits dual unit models:

- Open3d document: real **mm**  
- Buddy catalog bridge: **cm-as-Mm** + heuristic repair (`plannerCanvasUnits` ≥ 1000 → /10)

Wrong category/tag → bridge may fail → fall through to `buildGenericBlock2D` or final **`boxBlock`** (single rect).

**Files:**
- `D:\OandO07072026\site\features\planner\open3d\catalog\furnitureBlock2D.ts` (~248–339)
- `D:\OandO07072026\site\features\planner\catalog\catalogBlockBridge.ts` (~35–63)

**Honesty label:** Generic single-rect plan symbol is a common fallback for non-modular, non-workstation inventory — not “detailed catalog SVG.”

---

### F8 — LOW: Stale / misleading comments

| Location | Issue |
|----------|--------|
| `ThreeLazyViewer.tsx` ~80 | *“In production, this would import from a real Three.js component”* — it **does** lazy-import `ThreeViewerInner` |
| `furnitureBlockUsesCenteredPath` | Always returns `false`; comment admits prior “dead lie” — fixed, but name still historical noise |
| Stages docs in asset-engine | Call G8 “partial” — matches code; do not treat as full GLB product |

**File:** `D:\OandO07072026\site\features\planner\open3d\3d\ThreeLazyViewer.tsx`

---

### F9 — LOW: Viewer is real and lazy; not a fake stub

Positive honesty:

- `Lazy3DViewer` Suspense-loads `ThreeViewerInner`  
- Scene rebuilds from document via `buildOpen3dSceneNodes`  
- OrbitControls optional; WebGL probes exist  
- Entity ids on meshes for continuity  

**Files:**
- `D:\OandO07072026\site\features\planner\open3d\3d\ThreeLazyViewer.tsx`
- `D:\OandO07072026\site\features\planner\open3d\3d\ThreeViewerInner.tsx`
- `D:\OandO07072026\site\features\planner\open3d\3d\buildOpen3dSceneNodes.ts`

---

## Per-area scorecard

| Area | Honest? | Notes |
|------|---------|-------|
| workstationMeshV0 | Yes as boxes | Self-describes multi-part boxes; not GLB |
| modularCabinetV0 | Yes as boxes | Toe/carcass/door; readable multi-part |
| createSceneObjectFromNode | Yes | Procedural first; modular routes correct |
| ThreeViewer / Lazy | Mostly yes | Real Three; stale comment; silent GLB fail |
| furnitureBlock2D / FeasibilityCanvas | Mostly yes (flag OFF) | Real prims; generic box fallback exists |
| Fabric flag | **No when ON** | Empty rects; dual authority |
| GLB policy | Yes on reject | Designer static blocked |
| System GLB product path | Partial | cabinet-v0 only; fixtures tiny; default place unstamped |
| SVG publish | Separate | Not planner canvas furniture authority |

---

## What is *not* wrong (do not over-report)

1. **Designer static GLB blocked by policy** — intentional and implemented.  
2. **Modular cabinet multi-part mesh** — real geometry differentiation (not a single undivided box for toe/door).  
3. **Block2D top-left authorship + `renderBlock2DCentered`** — consistent; `furnitureBlockUsesCenteredPath` no longer lies.  
4. **3D not eager-mounted** — only when `viewMode === "3d"`.  
5. **GLB relative URL resolution** — `resolveGeneratedGlbFetchUrl` pins site root to avoid `/planner/open3d` relative 404 (when a URL is stamped).

---

## Evidence map (read set)

| Target | Path |
|--------|------|
| workstation mesh | `site/features/planner/open3d/catalog/workstationMeshV0.ts` |
| modular cabinet | `site/features/planner/open3d/catalog/modularCabinetV0.ts` |
| GLB plan export | `site/features/planner/open3d/catalog/modularCabinetV0GlbExport.ts` |
| scene factory | `site/features/planner/open3d/3d/createSceneObjectFromNode.ts` |
| scene nodes | `site/features/planner/open3d/3d/buildOpen3dSceneNodes.ts` |
| viewer | `site/features/planner/open3d/3d/ThreeViewerInner.tsx`, `ThreeLazyViewer.tsx` |
| GLB load | `site/features/planner/open3d/3d/loadGeneratedGlbObject.ts` |
| policy | `site/features/planner/lib/glbAssetPolicy.ts` |
| Block2D | `site/features/planner/open3d/catalog/furnitureBlock2D.ts` |
| canvas draw | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` |
| renderBlock2D | `site/lib/catalog/renderBlock2DToCanvas.ts` |
| fabric flag | `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` |
| fabric layer | `site/features/planner/open3d/canvas-fabric-stage/FurnitureFabricLayer.tsx` |
| place / stamp | `placementAction.ts`, `shouldPlaceModularWithGeneratedGlb.ts`, `OOPlannerWorkspace.tsx` |
| public fixtures | `site/public/catalog-assets/generated/*` (2 GLBs + gitkeep) |

---

## Recommended fix order (not executed — audit only)

1. **Do not enable fabric flag in production** until Fabric draws Block2D (or retains FeasibilityCanvas furniture under Fabric pose handles).  
2. **Single 2D authority for open3d:** `furnitureBlock2DFromItem` only; deprecate dual footprint path for canvas, or make it call the same Block2D.  
3. **Workstation 2D:** prefer `geometryMode` + `workstationOptions` before catalogId parse.  
4. **GLB honesty:** UI/docs must say procedural default; stamp only after verified public write; avoid path-only stamp in product place.  
5. **Remove or rewrite** ThreeLazyViewer “would import real Three” comment.  
6. **Rename** `furnitureBlocks2d.ts` vs `furnitureBlock2D.ts` to kill dual-name confusion.

---

## Bottom line for “fake symbols / empty boxes / GLB not loading / dual authority / flag debt”

| Claim under audit | Code truth |
|-------------------|------------|
| Fake symbols | **Yes if Fabric ON** (empty rects). Flag OFF: real Block2D prims (sometimes generic rect). |
| Empty boxes (3D) | **Yes** for most non-modular SKUs; modular = multi-box assemblies still not photoreal. |
| GLB not loading | **Default path never stamps URL** for most items; cabinet-v0 may stamp; silent fallback to boxes; only 2 tiny public fixtures. |
| Dual authority | **Yes** — Block2D vs Fabric vs svgSymbols vs publish SVG vs parametric footprint path; 2D/3D workstation options diverge. |
| Flag debt | **Yes** — env-gated incomplete stage; default OFF is the safer honest path. |

*End of Agent B report. Trust this file only as far as the cited paths; re-verify against `D:\OandO07072026\site` if those files change.*
