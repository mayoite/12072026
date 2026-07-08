# Phase 2C: The Client-Side Asset Engine

**Goal:** Completely sever reliance on expensive server-side processing for 3D/2D asset generation. This phase establishes a **Dual-Asset Pipeline** that leverages the user's browser (Three.js and Google `<model-viewer>`) to generate, preview, and process 3D models and 2D SVGs for $0 server cost.

---

## 1. The Admin "Zero-Designer" Upload Module
**Target:** `site/features/planner/admin/svg-editor/puckBlockRegistry.tsx`

This module is designed for non-technical Admins to ingest assets without needing a 3D designer. It supports three distinct workflows:

### Workflow A: The "SVG-to-GLB Extruder" (For Flat/Custom Shapes)
For simple objects like custom countertops, uniquely shaped tables, or wall panels, the Admin does not need a 3D model.
1. **Input:** Admin uploads a 2D vector `.svg` file (e.g., a curved table outline) and inputs a `Thickness/Height` (e.g., 30mm) and a `Material Color/Texture`.
2. **Client-Side Generation:** 
   - We use Three.js `SVGLoader` to parse the 2D vector paths in the browser.
   - We use `THREE.ExtrudeGeometry` to instantly pop those flat paths into a 3D mesh.
   - We apply the Admin's selected `THREE.MeshStandardMaterial`.
3. **Export & Save:** 
   - We use `THREE.GLTFExporter` to package the generated mesh into a `.glb` blob directly in the browser's memory.
   - The `.glb` is uploaded to Supabase Storage.
4. **Result:** A fully functional 3D model is created with zero 3D modeling skills and zero server compute.

### Workflow B: The "GLB Auto-Footprint" (For Complex Organic Shapes)
For complex objects like tufted sofas or plants, where an Admin either bought a `.glb` library or used a 3rd-party AI (like Luma API) to generate one.
1. **Input:** Admin uploads the `.glb` file.
2. **Client-Side Processing:**
   - The file is rendered invisibly in the browser.
   - We calculate the `THREE.Box3` bounding box of the entire model.
   - We extract the X and Z dimensions to understand the exact floor space the object consumes.
3. **Auto-SVG Generation:** 
   - The browser automatically generates a top-down 2D `.svg` footprint matching those exact bounds.
   - (Optional) We can render an orthographic top-down camera snapshot for a more detailed 2D plan view.
4. **Result:** The 2D planner asset is generated automatically from the 3D model. The designer doesn't have to draw a matching 2D top-down view.

### Workflow C: Variant & Material Dropdowns
1. **Input:** A `.glb` file containing multiple materials or mesh variants (e.g., a chair with 3 fabric options).
2. **UI Controls:** The Admin panel reads the GLTF node tree and exposes UI `<select>` dropdowns for each variant.
3. **Data Storage:** The Admin's selections are saved into the `BlockDescriptor` JSON payload (e.g., `{"selectedFabric": "Blue_Velvet"}`). The server stores this lightweight JSON, not a heavy 3D file.

---

## 2. The Client-Side Parametric Engine
**Target:** `site/features/planner/open3d/catalog/parametricBuilder.ts` (New module)

For highly modular items (like kitchen cabinets, wardrobes, and basic shelving), we don't store 3D models or SVGs at all. We generate them purely from math on the fly.

### How it works:
1. **The JSON Payload:** The server passes down a simple `BlockDescriptor` (e.g., `type: "cabinet", width: 600, height: 900, depth: 600`).
2. **2D Generation (Open3D Top-Down Mode):** 
   - The `parametricBuilder` returns a standard SVG `<rect width="600" height="600" />` string for the planner canvas.
3. **3D Generation (Open3D 3D Mode):** 
   - The `parametricBuilder` instantiates a `THREE.BoxGeometry(600, 900, 600)`.
   - It dynamically applies cabinet door textures to the front face and wood textures to the sides.
4. **Performance:** Because it is pure math, the browser can render 1,000 parametric cabinets instantly without downloading a single megabyte of `.glb` files.

---

## 3. Summary of Server Architecture
- **Supabase Storage:** Hosts the static `.glb` files generated/uploaded in Workflow A and B.
- **Postgres Database:** Stores only the lightweight JSON `BlockDescriptor` payloads (IDs, dimensions, positions, and selected variants).
- **Compute/Generation:** $0. All extrusion, rendering, and scaling happens locally on the user's GPU via Three.js.
