# A4 — Visual SVG authoring engine

**Status:** IN PROGRESS — foundation + authority bridge + canvas-first shell landed on code; browser disk proof still required for A4.0.1 green.

**Outcome:** A non-coder draws a furniture **inventory symbol** on a stage they can see without scrolling, previews the real compile, and publishes **that** geometry to `public/svg-catalog/{slug}.svg`. Metadata is secondary. No code, JSON, or raw SVG required.

**Boundary (owner lock 2026-07-12):**

| Surface | Owns | Does **not** own |
|---------|------|------------------|
| **Planner live workspace** | `features/planner/project/` + Fabric stage — room/layout plan-draw | Drawing catalog SVG as the plan canvas |
| **SVG catalog** | **Inventory only** — published bytes under `public/svg-catalog/` | Live plan-draw |
| **Admin A4 studio** | **All drawing tools for inventory authoring** — tool richness aims at commercial-class symbol studios (e.g. Planner 5D / 3D Planner *authoring* level for furniture symbols) | Replacing Fabric as the room planner |

**Honesty bar:** Unit green ≠ product green. Catalog SVG ≠ Fabric plan-draw. Full toolset is the **A4 destination** after authority + shell + disk proof — not a reason to skip A4.0.1.

---

## Engine decision

**SVG.js** behind `SvgEngineAdapter` for stage geometry. Fabric stays Planner-only. Descriptor publish SoT remains **`BlockDescriptor`** (`blocks` + `viewBox`). Studio scene serializes to V1 `parts`, then adapters map **rect/circle → `blocks`** so geometry survives `BlockDescriptorSchema` (which has **no** `parts` field).

---

## Critical path (do in order — no parallel feature farm)

```
A4.0 foundation ✅
→ A4.0.1 sole authority (code ✅ · browser disk OPEN)
→ A4.0.2 canvas-first shell (code ✅ · browser re-proof OPEN)
→ first mutate proven + dirty/exit guard
→ selected-node inspector
→ richer tools / preview modes
→ A4.6 three-variant browser proof
```

**Kill list until shell + authority are buyer-green (A4.0.1–0.2):** minimap, pen/path node editing, multi-select/group, templates, command palette, GLB polish as product work, a11y matrix theater, more form fields.  
**After green:** raise full inventory drawing tools (commercial-class authoring) **here** — still publish-to-catalog only; never claim studio is the room planner.

---

## A4.0 — engine foundation — DONE (with caveats)

- Typed `SvgSceneDocument` authority for the stage.
- Engine adapter: mount, destroy, events, viewport, serialize.
- Deterministic serialize + 500-shape stress through real compilers (unit).
- Named bounded undo/redo (unit + canvas UI).
- Existing descriptor + pipeline remain the **disk** boundary.

**Caveats (do not overclaim):** spike license/CSP artifacts not all under `results/`; “direct scene → compiler” is true only after adapters map to `blocks`.

**Green when (met for foundation only):** scene unit suite green on this checkout · evidence under `results/admin/no-code-svg-studio/`.

---

## A4.0.1 — scene is sole publish geometry authority — CODE LANDED · PRODUCT OPEN

**Product rule:** Scene document owns geometry. Form owns metadata. Form `blocks` rows must not override a committed scene.

**On disk now:**
- Open seeds `sceneParts` / `sceneViewBox` from `sceneFromDescriptor` (loads `blocks` when present; else footprint).
- Canvas commits (including **undo/redo**) call `onDocumentChange` → form scene fields.
- `formStateToDescriptorInput` maps scene parts → **`blocks`** (stale form blocks replaced) so `parseAdminPayload` / `freezeFreshDescriptor` retain geometry.
- Circles map to bounding rects for the boolean pipeline; `normalizeDescriptorForPipeline` accepts circle parts the same way.
- Unit: `scenePublishAuthority.test.ts` includes **parse → compile** path (not raw-only).

**Still OPEN for product green:**
- Browser: draw rect → live compile shows it → Publish → `public/svg-catalog/{slug}.svg` contains signature coords.
- Evidence pack: screenshots + run log + published snippet under `results/admin/no-code-svg-studio/` on **this** tree (`E:\12072026`), not a foreign path.

**Green when:** those browser+disk checks pass. Until then status stays **OPEN** even if units are green.

---

## A4.0.2 — canvas-first editor shell — CODE LANDED · BROWSER RE-PROOF OPEN

**Product rule:** Stage is the product. Form is a rail.

**On disk now:**
- `AdminSvgEditorEditView` uses `admin-svg-engine-shell`: stage primary + rail (live compile, published artifact, advanced fields collapsed).
- Non-locked CSS: `site/app/css/admin-svg-engine.css` (tokens only; **no** edits to `core/locked/**`).
- Stage targets ≥55vh / flex fill so SVG height is non-zero.
- Fit + **Reset** on toolbar; icon tools have `aria-label`.

**Green when:** at 1280×720, open edit route → stage visible without scrolling past a form wall; shape on stage visible; live compile panel in rail (not a third page chapter). Screenshot in `results/admin/no-code-svg-studio/`.

---

## A4.1 — navigation & stage chrome (after shell)

- Pan, zoom-to-cursor, Fit, Reset (Fit/Reset landed).
- Grid, snap, light/dark/checkerboard artboard modes.
- Rulers/guides only if usability needs them. Minimap only if proven.

**Green when:** snap-on place lands on grid; three backgrounds toggle; Fit frames artboard from any pan in one gesture.

---

## A4.2 — tool system (thin green first)

- **Now thin:** add rect/circle, select, drag/resize (engine selectize), delete, order, hide/lock, undo/redo.
- **Next:** prove move/resize as named history ops with tests; then duplicate; then multi-select.
- **Defer:** pen, full primitive set, group, align, command palette, mounting tools.

**Green when:** create → move → resize → delete each reversible via named undo with correct labels.

---

## A4.3 — layers & inspector

- Layers: select/hide/lock list exists; rename/reorder/search later.
- **Node inspector (missing):** selected x/y/size/radius/fill/stroke → `replaceNode` + history.
- Descriptor form stays **Advanced** metadata only — not scored as geometry inspector.

**Green when:** change width in node inspector → canvas updates; undo restores with correct label.

---

## A4.4 — history, drafts, recovery

- Named undo/redo: done.
- **Next after first trusted mutate:** dirty indicator, unsaved-exit guard, reset-to-published, local draft + reload recovery.

**Green when:** mid-edit reload recovers scene; reset restores published bytes; publish writes new revision without deleting prior.

---

## A4.5 — preview & validation

- Live compile from **form seeded by scene** (not “edit a field…” as the primary path).
- Side-by-side stage vs artifact polish later; log p95 ≤500ms on named fixtures (log, don’t hard-fail CI on flaky latency).

**Green when:** three fixtures pixel-compare stage vs compiled; publish disabled while invalid.

---

## A4.6 — proof

- Fixed / configurable / parametric: create → edit → undo → recover draft → compile → publish.
- Keyboard-only + SR path (not startable until keyboard map exists).
- Desktop/tablet/narrow screenshots + failure-injection buyer outcomes.

**Green when:** `results/admin/no-code-svg-studio/` holds three-variant run + published bytes. **Unit alone never closes A4.6.**

---

## Residuals (honest)

| Item | Status |
|------|--------|
| Scene → blocks → parse → compile (unit) | Landed |
| Canvas-first shell (code) | Landed |
| Browser disk A4.0.1 proof on this checkout | **OPEN** |
| Node property inspector | Not started |
| Dirty / draft / exit guard | Not started |
| Keyboard map / a11y E2E | Not started |
| Dual schema long-term (V1 parts on BlockDescriptor) | Deferred — blocks bridge is the ship path |

---

## Done means

A new catalog manager completes the three-variant browser scenario without instructions, code, JSON, or developer tools. **A green Vitest run is not enough.**
