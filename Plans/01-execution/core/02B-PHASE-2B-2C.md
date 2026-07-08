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

### 2B.2 — Selection & Interaction (Evaluate Canvas Engine)

> The current pure Canvas 2D approach has no selection handles, resize grips, or rotation widgets. These are needed for production. This section evaluates whether to adopt a library or hand-code them.

**Spike (2 days):**
- [ ] Prototype Konva integration for ONE interaction — furniture selection with drag + resize handles
  - Install `konva` + `react-konva` in a branch
  - Render furniture items as Konva nodes on a transparent layer over the existing canvas
  - Test: click to select, drag to move, handles to resize, rotation handle
  - Measure: code complexity vs hand-rolling equivalent in Canvas 2D

**Decision gate:** Based on spike results, choose ONE:

| Option | What It Means | When to Choose |
|--------|--------------|----------------|
| **K (Konva hybrid)** | Konva for interactive objects (furniture, selection), Canvas 2D for static grid/walls | Spike succeeds, layering works without flicker/perf issues |
| **F (Fabric.js full)** | Replace FeasibilityCanvas entirely with Fabric.js canvas | Konva fails AND Fabric proves more capable at full-canvas replacement |
| **H (Hand-roll)** | Continue coding all interactions in raw Canvas 2D | Both libraries add more complexity than they solve |

**After decision:**
- [ ] Implement chosen approach for: select, move, resize, rotate, delete on furniture items
- [ ] Implement wall selection + property editing
- [ ] Implement room selection + property editing
- [ ] Multi-select with bounding box

### 2B.3 — 2D ↔ 3D State Continuity

The 2D canvas and 3D viewer must share the same project state. When a user toggles between views, everything must persist.

- [ ] Verify `workspaceCanvas.project` state (walls, rooms, furniture coordinates) is shared between FeasibilityCanvas and ThreeLazyViewer
- [ ] Toggle 2D → 3D preserves: room dimensions, wall positions, furniture positions and rotations
- [ ] Toggle 3D → 2D preserves: any changes made in 3D mode
- [ ] Default boot: 2D `FeasibilityCanvas` (not 3D)
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

### 2C.3 — Product Type Pipelines

**Custom furniture (parametric) — no file uploads:**
- [ ] Admin sets W/D/H bounds + material selection in Puck
- [ ] Server stores JSON only (no files)
- [ ] Client generates 2D footprint via `ParametricBuilder.generate2DFootprint()`
- [ ] Client generates 3D mesh via `ParametricBuilder.generate3DMesh()`
- [ ] Extend `ParametricBuilder` beyond boxes: L-shapes, U-shapes for counters; door/drawer faces for cabinets

**Static/branded items (dual-asset upload):**
- [ ] Admin uploads `.glb` (3D model) and `.svg` (2D footprint) via Puck fields
- [ ] Server validates: file size limits, GLTF structure validation, SVG sanitisation
- [ ] Files stored to Supabase Storage, URLs saved in descriptor JSON
- [ ] Client renders `.glb` with Three.js, `.svg` on 2D canvas

**Extruded items (SVG → 3D):**
- [ ] Admin uploads `.svg` outline + enters thickness + selects material
- [ ] `GlbExtruderPreview.tsx` generates 3D preview in admin panel
- [ ] On publish: browser exports `.glb` blob → uploads to server
- [ ] Server validates `.glb` (file size, GLTF structure) before persisting
- [ ] Stored `.glb` served to planner for 3D rendering

### 2C.4 — Catalog End-to-End

The ultimate integration test: admin creates a product, it appears in the customer catalog, and the customer can use it.

- [ ] Admin creates product → publishes → product appears in planner catalog
- [ ] Customer selects product → places in room → sees 2D footprint
- [ ] Customer toggles 3D → sees 3D model/mesh
- [ ] Product variants (colour, material) work in both views
- [ ] Catalog search (Fuse.js) works with new Supabase-sourced data

### 2C Gates

| Gate | Check |
|------|-------|
| Parametric | Admin can publish a parametric product end-to-end |
| Static | Admin can publish a static product with uploaded `.glb` + `.svg` |
| Extruded | Admin can publish an extruded product with SVG → 3D |
| Integration | All three product types appear in customer catalog and render in 2D + 3D |
| CI | `pnpm run typecheck` + `pnpm run test` — pass |
| Security | SVG security fixtures (malicious SVG rejected) |
| Determinism | Pipeline determinism (identical input → identical output) |
