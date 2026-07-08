# Plan A — 02B: Phase 2B — Canvas & Open3D + Phase 2C — Asset Engine

**Parent:** [00A-START.md](00A-START.md) · **Prev:** [01A-PHASE-2A.md](01A-PHASE-2A.md) · **Next:** [03C-HANDOVER.md](03C-HANDOVER.md)

---

## Phase 2B — Canvas & Open3D Unification

**Goal:** Make the 2D/3D workspace production-ready. Solidify the canvas, unify state, complete the draw→save→reload flow.

**Prerequisite:** Phase 2A gates pass

---

### 2B.1 — Canvas Stabilisation

The `FeasibilityCanvas.tsx` (1075 lines) is the heart of the 2D editor. It is hand-rolled using the HTML5 Canvas 2D API and is fragile — any pointer math change can break drawing tools. This section adds the safety net.

- [ ] Audit `FeasibilityCanvas.tsx` — identify fragile pointer math, missing edge cases
- [ ] Add unit tests for coordinate transforms:
  - `screenToProject` / `projectToScreen`
  - `zoomTransformAt`
  - `snapDrawingPoint`
- [ ] Add unit tests for hit-testing:
  - `pointInPolygon`
  - `pickWallAtPoint` / `pickWallWithPosition`
- [ ] Test deterministic flow: draw room → add wall → add door → add window → place furniture → undo → redo → save → reload
- [ ] Fix any discovered state desynchronisation between canvas and workspace store

### 2B.2 — Fabric.js full stage (chosen 2D engine)

> **Decision (locked):** One 2D engine = **Fabric.js v7 full stage**. No Canvas+Konva hybrid. Pure Canvas hand-roll is **not** the tooling destination.  
> Document model + `PlannerCommand` stay engine-agnostic; Fabric nodes carry `entityId` (UUID); never persist Fabric objects.

**Cutover (not “insurance”):**
- [ ] Client-only Fabric stage mounts in open3d workspace
- [ ] Furniture: select, move, resize, rotate, delete — all via commands
- [ ] Wall draw + wall select + property edit via commands
- [ ] Room select + multi-select + marquee
- [ ] Retire interactive responsibility from `FeasibilityCanvas` (delete or static underlay only during migration)
- [ ] Fail gate: if Fabric spike is **unworkable** (perf/UX evidence), switch to **Konva full stage** (still one engine, still no hybrid)

### 2B.3 — 2D ↔ 3D State Continuity

Same **document** (UUIDs, mm). Two views: Fabric (2D) + Three/R3F (3D). No hybrid 2D layers.

- [ ] `workspace` project shared; both views rebuild from document
- [ ] Toggle 2D → 3D / 3D → 2D preserves walls, openings, furniture pose
- [ ] Default boot: **2D** plan view
- [ ] `parametricBuilder.generate3DMesh()` (and generated GLBs) feed planner 3D — not designer-only asset dumps
- [ ] Integrate `parametricBuilder.generate3DMesh()` with the 3D viewer for furniture items

### 2B.4 — Draw → Save → Reload Flow

This is the core acceptance test: can a user create something, leave, come back, and find it unchanged?

- [ ] Complete flow: draw room → add opening → place item → edit dimensions → undo/redo → save → reload
- [ ] Complete keyboard equivalent through layers, commands, and numeric controls
- [ ] Existing documents remain compatible after reload
- [ ] Autosave works without data loss
- [ ] Cloud save to Supabase works for authenticated users

### 2B.5 — Route Cleanup

- [ ] Update stale "Fabric-backed" comments in `guest/page.tsx` and `canvas/page.tsx`
- [ ] Verify `/planner/fabric/*` routes are unreachable from navigation (already archived)
- [ ] Update `importGraphProof.ts` to reflect current state

### 2B Gates

| Gate | Check |
|------|-------|
| Acceptance | Full draw → save → reload test — pass |
| State | 2D ↔ 3D toggle preserves all state — verified |
| Decision | Canvas engine decision documented with evidence |
| Console | No errors on `/planner/open3d`, `/planner/guest`, `/planner/canvas` |
| CI | `pnpm run typecheck` + `pnpm run test` — pass |

---

## Phase 2C — Asset Engine & Admin Publishing

**Goal:** Complete the admin publish pipeline so products flow from admin creation → catalog → planner placement. This is where the three product types (parametric, static, extruded — described in [00A-START.md](00A-START.md#product-types--why-three-pipelines)) become real.

**Prerequisite:** Phase 2B gates pass

---

### 2C.1 — Full Puck Editor Mount

Currently, `AdminSvgEditorEditView.tsx` uses a JSON text editor. This step replaces it with the visual Puck editor.

- [ ] Replace JSON text box with full `<Puck editor={...} config={...} onPublish={...}>`
- [ ] Admin visually composes block configuration using Puck fields
- [ ] `onPublish` sends validated JSON to `POST /api/admin/svg-editor`
- [ ] API route runs SVG pipeline (validate → compile → sanitize → optimise → render PNG → persist)
- [ ] On failure: return 422 with error message, Puck shows error to admin
- [ ] On success: persist descriptor to **Supabase** (not disk)

### 2C.2 — Storage Migration (Disk → Supabase)

Currently, block descriptors are persisted to `site/block-descriptors/` on disk. This works for local dev but not for production. This step migrates to Supabase.

- [ ] Migrate block descriptor JSON from `site/block-descriptors/` to Supabase Postgres
- [ ] Migrate asset files (`.glb`, `.svg`, thumbnails) to Supabase Storage
- [ ] Update `catalogClient.ts` to fetch from Supabase instead of disk/API
- [ ] Maintain backward compatibility: read from disk as fallback during migration
- [ ] Remove disk-based persistence code after migration verified

### 2C.3 — Product Type Pipelines (system-generated first)

**P0 must-do — modular / parametric (choose every component → good mesh/GLB):**
- [ ] Admin chooses components (carcass, doors, top, legs, hardware style) + W/D/H + materials in Puck
- [ ] Server stores structured JSON only for default path
- [ ] 2D: `ParametricBuilder` (and successors) footprint from options
- [ ] 3D: generate mesh / optional export GLB from same options — **designers do not hand-author 100 GLBs**
- [ ] Extend beyond boxes: L/U, door/drawer faces, part library quality bar (“good GLB/mesh”)

**P1 — Extruded (SVG → system-generated 3D only):**
- [ ] Admin uploads SVG outline + thickness + material
- [ ] `GlbExtruderPreview` + upload under `catalog-assets/generated/`
- [ ] Server validates generated GLB (`validateGlbAsset`)
- [x] Designer static GLB upload path **removed** (policy + `glbAssetPolicy` + Zod)

**No P2 static/designer GLB.** Do not reintroduce hand-authored product GLBs.

### 2C.4 — Catalog End-to-End

- [ ] Admin publishes **parametric/modular** product → catalog → place in 2D + 3D
- [ ] Variants (material/colour) work without designer GLBs
- [ ] Catalog search (Fuse.js) with Supabase-sourced data

### 2C Gates

| Gate | Check |
|------|-------|
| **Must-do modular** | Component choices produce good 2D + 3D without designer GLB |
| Extruded | SVG → **generated** 3D only |
| **No static GLB** | Designer GLB URLs rejected by policy/Zod/catalog save |
| Integration | Catalog place in 2D + 3D |
| CI | typecheck + tests |
| Security | Malicious SVG rejected |
| Determinism | Same options → same geometry output |
