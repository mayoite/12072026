# 00 — Plan revision (2026-07-08)

**Status:** Locked coordinator decisions  
**Supersedes:** The original 2026-07-05 revision, `01-START.md` §5/§8, and the legacy SVG Option A architecture.

## Authority stack (after this revision)

1. User message + `AGENTS.md`
2. **`01-execution/core/INDEX.md`** (Active execution roadmap)
3. **`01-execution/core/00-REVISION.md`** (This file — architectural product rules)
4. `01-execution/core/05-MASTER-PIVOT-PLAN.md` (Locked baseline)
5. `01-execution/core/06-PHASE-2-UI-ASSET-PIVOT.md` (Active phase plan)

---

## Decision 1 — The Asset Pipeline (Killing the Backend Compiler)

**Call:** The server-side geometry math compiler (`generate-svg.mjs`, `flatten-js`, `svgo`) is **DEAD** and removed from the repository. The server is now a dumb pipe that exclusively validates and persists JSON (via Zod).

**The New Pipeline:**
We support two client-side rendering strategies driven by the `BlockDescriptor` JSON:
1. **Parametric Engine (For Custom Furniture):** The Admin inputs dimensional bounds (W/D/H) via Puck. The client dynamically generates 3D meshes (via Three.js) and 2D procedural SVG footprints based solely on the JSON. Zero asset uploads.
2. **Dual-Asset Strategy (For Static/Branded Decor):** The Admin uploads a highly detailed `.glb` model and a simple `.svg` footprint directly via Puck. The client renders the files directly with zero mathematical processing.

| Item | Status | Notes |
|------|---------|--------|
| `@puckeditor/core` | Yes | Mounted in Admin for JSON configuration and direct asset URL uploads. |
| `generate-svg.mjs` | **DELETED** | Server no longer processes SVG math. |
| `flatten-js`, `polygon-clipping`, `svgo` | **DELETED** | Removed from backend requirements. |

---

## Decision 2 — UI Component Strategy (React Aria + Vanilla)

**Call:** We are eliminating component bloat and event-listener conflicts by adopting React Aria for complex components and Vanilla React for simple ones. Ark UI and Radix UI are officially marked for purging.

| Surface | Strategy |
|---------|----------|
| Planner Module | **React Aria Components.** The standard for desktop-grade keyboard accessibility and strict number fields. To be implemented phase-wise. |
| Global Shell, Landing, Marketing | **Pure Vanilla React.** Zero-dependency components powered entirely by `app-shell.css`. Radix and Ark are banned. |
| Tailwind CSS | **DELETED.** 648 dead utility classes purged. `app-shell.css` is the sole source of truth for the UI layout. |

---

## Decision 3 — Routes and promotion

| Route | Call |
|-------|------|
| `/planner/open3d` | The unified 2D/3D workspace. Customers start in 2D (`FeasibilityCanvas`) and seamlessly toggle to 3D. Must respect `100dvh` and strict `overflow: hidden` constraints. |
| `/planner/fabric` (Archive) | **DEPRECATED.** The isolated 2D-only sandbox is being retired to focus all efforts on the unified Open3D shell. |
| `/admin/svg-editor` | Transformed from a JSON text box into a visual Puck configuration tool for JSON/Asset management. |

---

## Execution order (for agents)

```text
1. This revision (Locked)
2. Execute Phase 2 Part 1: Install `react-aria-components` and migrate the Planner UI (TopBar, CommandPalette).
3. Execute Phase 2 Part 2: Puck Editor UI updates for Option B (GLB/SVG uploads).
4. Close Phase 2 and lock Verification tests.
```

---

*Locked 2026-07-08. React Aria and the Client-Side Asset Pipeline are now the architectural standard.*
