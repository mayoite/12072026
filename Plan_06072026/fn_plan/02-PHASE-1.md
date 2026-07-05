# Phase 1 - Open3D Foundation and SVG Production Path

Status: In progress — **1A** (shell) then **1B** (SVG path) per [`00-REVISION.md`](00-REVISION.md)  
Depends on: [`01-START.md`](01-START.md)  
Promotion target: `/planner/open3d` only (guest/canvas remain Phase 2)

**Layout:** new open3d code → [`docs/architecture/MODULE-LAYOUT.md`](../docs/architecture/MODULE-LAYOUT.md) · **UI:** [`MODULE-UI-CONTRACT.md`](../docs/architecture/MODULE-UI-CONTRACT.md) · **Domain:** [`docs/Lockedfiles/INDEX.md`](../docs/Lockedfiles/INDEX.md)

## Outcome

**1A:** A pilot-ready Open3D desktop/tablet workspace — route containment, semantic CSS, CAD interaction, baseline 2D editing.  
**1B:** A secure SVG block production path (admin publish → planner catalog) for three reference variants.  
1A acceptance does **not** require 1B completion.

---

## Phase 1A — Open3D shell (pilot)

### 1. Baseline and Ownership

- [ ] Capture 1440x900, 1024x768, 768x1024, and 390x844 screenshots.
- [ ] Capture DOM identity, console output, failed requests, and framework overlays.
- [ ] Record current interaction and bundle performance.
- [ ] Inventory planner controls, packages, tokens, inline styles, raw values, breakpoints, and route chrome.
- [ ] Separate canonical document, view, workspace preference, engine, and transient state ownership.
- [ ] Record the exact starting revision and dirty-worktree state.

### 2. Route and Shell

- [x] Classify `/planner/open3d` as a workspace route.
- [x] Hide marketing header, footer, chatbot, and obstructive cookie presentation.
- [x] Use one `100dvh` workspace with safe-area support.
- [x] Prevent page-level horizontal and vertical scrolling.
- [x] Isolate scrolling inside panels; drawer isolation remains a Phase 2 concern.
- [ ] Preserve authentication, CSRF, service worker, and error boundaries.
- [ ] Verify direct navigation and refresh for guest and authenticated users.

### 3. Theme and CSS

- [x] Create planner semantic tokens mapped to One&Only tokens.
- [x] Define named panel, motion, z-index, touch, focus, and safe-area tokens.
- [x] Open3d route imports `open3d-workspace.css` bundle (UI-0).
- [ ] Move static presentation from JSX into CSS Modules (audit open).
- [ ] Remove emoji controls and use Phosphor icons — **partial:** tool rail / top bar use Phosphor; `inventoryTaxonomy.ts` still uses emoji.
- [ ] Remove raw visual values and duplicated responsive rules.
- [ ] Add compact and touch density modes.
- [ ] Add reduced-motion, forced-colors, print, focus, selected, disabled, warning, and error states.
- [ ] Add a static planner hardcoding audit (passing gate).
- [ ] Add a Three theme adapter for semantic colors.

### 4. Command and State Foundation

- [x] Define `PlannerCommand` type and `executePlannerCommand` (unit-tested).
- [x] Define `PlannerToolState`.
- [x] Define `PlannerSelection` type (`store/selection.ts`).
- [ ] **P0:** Route all document mutations through `executePlannerCommand` — canvas hook still calls `dispatchOpen3dAction` directly.
- [ ] Restrict zundo history to successful document commands (enforced in command layer; not wired through all surfaces).
- [ ] Exclude panels, search, loading, camera, and notifications from document undo.
- [x] Add preference schema versioning and corrupt-state recovery.
- [x] Preserve document data when preferences fail validation.

### 5. Professional Workspace

- [ ] Top bar contains project identity, save state, floor, units, 2D/3D, undo/redo, and one save action.
- [ ] Import, export, and preferences use structured menus.
- [ ] Separate catalogue and layers.
- [ ] Make properties contextual to selection.
- [ ] Add resizable and collapsible desktop panels.
- [ ] Persist valid panel ratios as workspace preferences.
- [ ] Add canvas-maximize and exact restore.
- [ ] Maintain at least 60% canvas width at 1440px.

### 6. Tool and Canvas Behavior

- [ ] Implement select, pan, room, wall, opening, dimension, and placement states.
- [ ] `Escape` cancels uncommitted work.
- [ ] `Enter` commits valid numeric or drawing input.
- [ ] `Space` temporarily pans without losing the armed tool.
- [ ] Display active tool, shortcut, modifiers, and measurement input.
- [ ] Add grid, origin, scale, zoom, fit, snap state, and drawing bounds.
- [ ] Add first-use actions: draw room, start from template, import floorplan.
- [ ] Explain invalid operations without discarding recoverable work.
- [ ] Verify deterministic room, wall, opening, selection, transform, delete, undo, redo, save, and reload.

### 7. Catalogue and Properties

- [ ] React Query owns remote catalogue lifecycle.
- [ ] Fuse owns local ranking after server filtering.
- [ ] React Aria owns accessible search and collection behavior.
- [ ] Click and drag placement produce one validated `PlannerPlacementPayload`.
- [ ] Add loading, skeleton, empty, stale, offline, error, and retry states.
- [ ] Group properties into transform, dimensions, placement, appearance, metadata, and actions.
- [ ] Support unit-aware numeric input, commit, cancel, reset, and validation.
- [ ] Multi-selection exposes only valid shared operations.
- [ ] Locked items reject mutations through every command surface.

### 11A — Shell acceptance (required for 1A sign-off)

- [ ] Complete: draw room → add opening → place item → edit dimensions → undo/redo → save → reload.
- [ ] Complete keyboard equivalent through layers, commands, and numeric controls.
- [ ] Existing documents remain compatible.
- [ ] All static presentation passes the hardcoding audit.
- [ ] No unexpected console errors, warnings, failed requests, or missing assets on `/planner/open3d`.
- [ ] Evidence captured under `results/<module>/<phase>/<cmd>/`.
- [ ] Warnings, retries, skips, and expected diagnostics are classified.

### 12A — Phase 1A gates

- [ ] Planner style audit.
- [ ] Lint.
- [ ] Typecheck.
- [ ] Targeted planner unit and integration tests (open3d shell).
- [ ] Planner catalogue E2E (open3d smoke).
- [ ] Route chrome/navigation E2E.
- [ ] Browser validation at baseline viewports.

---

## Phase 1B — SVG production path

*Not blocking 1A sign-off. Requires 1A P0 command wiring before parallel work is recommended.*

### 8. SVG Block Foundation

- [x] ~~Add approved SVG.js packages~~ — **rejected for Phase 1** (Option A; see revision).
- [x] Add DOMPurify as a direct dependency.
- [x] Define `SvgBlockDefinitionV1`.
- [x] Define part, parameter, action, constraint, variant, style, mounting, and lifecycle schemas.
- [x] Define `BlockDefinition`, `BlockInstance`, `CompositionDocument`, and `PublishedRevision` (types + Zod).
- [x] Create a Zod metadata registry.
- [x] Generate Puck field definitions from approved Zod metadata.
- [x] Keep Puck admin-only; establish package boundary tests.
- [ ] **P0:** Mount full `<Puck config onPublish>` editor on `/admin/svg-editor/[id]` — today: JSON edit view + `Render` preview only.

### 9. Deterministic SVG Pipeline

- [x] Build deterministic descriptor normalization (compiler module).
- [ ] Build full geometry and constraint validation (reference fixtures only).
- [x] Build deterministic SVG compilation (`svgCompiler.server.ts`).
- [x] Add parsed element and attribute allowlists.
- [x] Sanitize with DOMPurify before SVGO.
- [ ] Lock the SVGO plugin configuration (integration test).
- [x] Preserve viewBox, semantic IDs, accessibility metadata, and reusable groups (compiler contract).
- [x] Generate canonical PNG with resvg.
- [x] Generate thumbnail derivatives with Sharp.
- [x] Generate checksums and typed diagnostics.
- [ ] **P0:** Unify exec `generate-svg.mjs` and in-process compiler (single authority) — dual path remains via `svgPipelineRunner.ts`.
- [ ] Store descriptors, validation reports, revisions, and artifact references in Supabase — **deferred Phase 08**; disk persist OK for 1B.
- [x] Prove Node-only packages are absent from client bundles (boundary tests).

### 10. Reference Blocks

Prove the full path with:

- [x] Reference definitions in repo (fixed table, configurable door, parametric cabinet — compiler tests).
- [ ] One fixed block published end-to-end.
- [ ] One configurable door or window published end-to-end.
- [ ] One parametric cabinet or furniture family published end-to-end.
- [ ] Admin draft and preview (full Puck compose).
- [ ] Validation failure and recovery (admin UX).
- [ ] Publication and immutable revision (disk + interface; Supabase in Phase 08).
- [ ] Planner 2D placement from published block.
- [ ] Thumbnail output on R2.
- [ ] Existing-version reload.

### 11B — SVG path acceptance (required for 1B sign-off)

- [ ] Identical SVG descriptors produce byte-identical canonical SVG.
- [ ] Malicious SVG fixtures fail before persistence or rendering.
- [ ] Preview, SVG, PNG, and planner output match within documented tolerances.
- [ ] Published revisions are immutable and rollback-capable (disk + revision contract minimum).
- [ ] SVG authoring and native rendering packages are absent from planner chunks.

### 12B — Phase 1B gates (add to 12A before full Phase 1 complete)

- [ ] SVG security fixtures.
- [ ] Determinism and checksum tests.
- [ ] Admin svg-editor + portal svg-catalog route tests.
- [ ] Production build.
- [ ] Accessibility tests (admin + portal surfaces).

---

## 13. Rollback

- Preserve the previous Open3D route behind a route-level rollback boundary.
- Do not promote shared changes to guest or canvas before **Phase 1A + 1B** acceptance (Phase 2 promotion per [`03-PHASE-2.md`](03-PHASE-2.md)).
- Roll back for document incompatibility, geometry regression, placement failure, non-deterministic undo, unsafe SVG acceptance, or route containment failure.
- Preserve all failure evidence.
