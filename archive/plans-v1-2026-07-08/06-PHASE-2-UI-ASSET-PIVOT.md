# Phase 2: The UI and Asset Pivot (Final Decisions)

This document records the strategic decisions made on 2026-07-08 regarding the three core pillars of the O&O architecture. These choices definitively resolve the technical debt accumulated during Phase 1.

## 1. UI Component Strategy: React Aria + Vanilla
**The Decision:** We are adopting **React Aria Components** exclusively for the Planner module, while keeping the global shell and marketing pages pure Vanilla React (`app-shell.css`). We are formally purging Radix UI and Ark UI from the repository.

**Why we chose this:**
- Ark UI and Radix UI were fundamentally conflicting in the DOM, causing silent layout breaks (like the `100dvh` failure).
- Building complex, accessible CAD components (like dragging menus and strict number fields) in pure Vanilla React is a massive waste of engineering time.
- **Adobe's React Aria** was built specifically for web-based design tools. It provides best-in-class keyboard navigation, focus trapping, and strict numeric inputs, making it the perfect choice for a professional spatial planner.

---

## 2. Canvas Strategy: Unified Open3D
**The Decision:** We are formally deprecating the legacy 2D-only Fabric sandbox (`/planner/fabric`). All spatial planning will now occur within the unified `/planner/open3d` workspace.

**Why we chose this:**
- Custom furniture cannot be sold effectively with a flat 2D canvas alone.
- The `open3d` workspace natively boots into a **2D top-down view** (via `FeasibilityCanvas`), meaning we are *not* losing 2D. Customers still start in a familiar 2D drafting mode, but they can now hit a toggle to instantly visualize their custom casework in 3D without losing state. 
- Maintaining two entirely separate planner routes was causing massive feature drift and code duplication.

---

## 3. Asset Pipeline Strategy: Parametric + Dual-Asset Hub
**The Decision:** We are formally killing the server-side SVG math compiler (`generate-svg.mjs`). The backend is now a dumb pipe for Zod-validated JSON. The client will handle asset generation using two distinct strategies:

**Why we chose this:**
- **The Parametric Engine:** Custom furniture (like casework and cabinets) requires infinite dimensional scaling. The client must be able to procedurally generate a 3D mesh and a 2D SVG footprint on the fly based on the Admin's JSON bounds (W/D/H).
- **The Dual-Asset Hub:** Branded, static decor (like lamps, plants, laptops) look terrible when procedurally generated. For these items, the Admin will use the Puck visual editor to directly upload a `.glb` file (for 3D) and an `.svg` footprint (for 2D), bypassing all math. 
- We absolutely need *both* strategies to support a diverse, professional catalog.

---

*Note: The granular, step-by-step technical execution for these decisions is tracked in the `07A`, `07B`, and `07C` blueprints.*
