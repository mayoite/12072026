# Execution Roadmap Index

This document tracks the active, authorized execution plans for the O&O Project. All legacy, bureaucratic, or aborted plans (like the original Phase 00 Governance and the original Recovery Plan) have been moved to the `archive/` directory.

## Current Authorized Plans (Source of Truth)

### 1. `05-MASTER-PIVOT-PLAN.md`
- **Status:** COMPLETED
- **Summary:** The plan that established our baseline. We successfully ripped out ~648 dead Tailwind CSS classes across the planner UI, locking the architecture to Vanilla CSS (`app-shell.css`). We also re-wrote the `POST /api/admin/svg-editor` route to run the geometry compiler *before* persisting to the database, eliminating silent data corruption. 

### 2. `06-PHASE-2-UI-ASSET-PIVOT.md`
- **Status:** IN PROGRESS
- **Summary:** The master strategy for resolving the two deepest architectural flaws:
  - **The UI Component Conflict:** Isolating Ark UI strictly to the Planner/Admin modules (where complex state machines are needed) and purging Radix/Ark from all standard marketing/shell components (reverting to pure Vanilla React).
  - **The 100-lb Backend Compiler:** Deleting the fragile `generate-svg.mjs` node script completely. The backend API no longer does geometry math. We are pivoting to two client-side rendering strategies:
    - **Option A (Parametric Engine):** For custom furniture. The client reads JSON dimensional bounds and generates 3D meshes and 2D SVGs procedurally in the browser.
    - **Option B (Dual-Asset):** For static/branded decor. The Admin simply uploads a `.glb` (for 3D) and an `.svg` footprint (for 2D) into Puck, and the client renders them directly.

---

*Note: Older phase documents (`01-START.md`, `02-PHASE-1.md`, etc.) are historical references for the repository setup and do not supersede the active pivot plans listed above.*
