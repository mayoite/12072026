# ADMIN.md — one plan, parallel streams

**HEAD:** `7807198d` · **Module:** `site/features/planner/admin/` · **Engine:** SVG.js (authoring) — never Fabric here.
**Replaces:** Admin BOARD + A1..A8 + A5a/A6a/A7a/A8a kill-files (redundant). Guardrails inline. Status table at bottom.

## Owner locks (2026-07-12)
1. **SVG authoring = SVG.js, in admin only.** What you draw *is* the artifact (real `<rect>`/`<path>` DOM → clean bytes). Fabric's `toSVG()` is a lossy raster→vector translation; it is banned from admin. `svgPackageBoundaries.test.ts` stays green.
2. **Admin does not block Planner.** The two tracks meet at **contracts**, not a dependency chain: the published `.svg` + descriptor (SVG contract), the price-book JSON (pricing contract), the workstation-family JSON (systems contract). Each side builds against a fixture of the contract and integrates at the seam. No "P15 frozen until A7."
3. **`results/` is not proof.** Green = live browser run + bytes on disk on **this** checkout.

## Contracts admin owns (the seams Planner consumes)
| Contract | File / shape | Planner consumer |
|----------|--------------|------------------|
| Symbol SVG | `public/svg-catalog/{slug}.svg` + `BlockDescriptor` | `svgPlanSymbolCache.ts` (Planner Stream C) |
| Price book | price-book JSON (Stream E) | Planner P15 / BOQ |
| Workstation family | family JSON (Stream D) | Planner P12 configurator |

---

### Stream A — Authoring quality (the real fix)
**Engines:** `admin/svg-editor/SvgStudioCanvas.tsx`, `scene/svgJsEngineAdapter.ts`, `publishDescriptorWithPipeline.ts`.
**Problem:** published symbols are 300–480 byte flat single-rect stubs.
**Benchmark:** Planner 5D symbol editor — layered body/carcass/door/handle, correct mm footprint, legible at 25% and 100% zoom.
**Checklist:** author a desk as layered geometry → live preview matches → Publish → on-disk bytes are multi-part (not one `<rect>`) → re-render in Planner is distinct.
**Blocks on:** nothing. **Start here (one-symbol vertical slice first).**

### Stream B — Catalog lifecycle & bulk ops (was A5)
**Engines:** `admin/AdminCatalogPageView.tsx`, `adminCatalogClient.ts`, `catalogAdminHandlers.ts`.
**Benchmark:** a catalog manager imports/edits/retires many items without dev tools.
**Checklist:** all-or-nothing CSV/bulk import; per-item state (live/draft/retired) visible; edit preserves slug identity.
**Blocks on:** A (needs a trustworthy publish path).

### Stream C — Studio tools depth (was A4.1–A4.5)
**Engines:** `svg-editor/scene/*`, node inspector, history.
**Checklist:** rect/circle/line/arc + select/move/resize/delete as named undo ops; node inspector edits x/y/size/fill; dirty/exit guard; reset-to-published.
**Blocks on:** A.

### Stream D — Workstation system authoring (was A6) — **contract owner**
**Engines:** `AdminCatalogEditorDrawer.tsx` (`workstationJson`), `project/catalog/workstationSystemV0.ts`.
**Checklist:** author a released family version → emits the workstation-family JSON contract → one version drives 2D/3D/BOQ. (Planner P12 builds against a fixture of this in parallel.)
**Blocks on:** A + B.

### Stream E — Pricing / BOQ governance (was A7) — **contract owner**
**Engines:** new price-book model + migration; `platform/supabase/migrations.admin/`.
**Checklist:** price book with versioning → emits price-book JSON contract → Planner BOQ reads it. Fixture-first so Planner P15 is unblocked.
**Blocks on:** nothing (independent of A–D; start in parallel).

### Stream F — Release, audit, rollback (was A8)
**Engines:** descriptor archive + revision snapshots (`side-table-001.*.json`), new approve/rollback surface.
**Checklist:** publish → approve → rollback to prior revision → audit log; no revision deleted.
**Blocks on:** A.

---

## Status
| Stream | Owns | State | Blocks on |
|--------|------|-------|-----------|
| A | Authoring quality (SVG.js) | OPEN — stubs are flat | — |
| B | Catalog lifecycle / bulk | OPEN | A |
| C | Studio tool depth | PARTIAL (shell + adapters landed) | A |
| D | Workstation family (contract) | OPEN (JSON textarea only) | A,B |
| E | Pricing / BOQ (contract) | OPEN | — |
| F | Release / audit / rollback | OPEN (artifacts exist, no workflow) | A |

**Done DONE (verified in code, keep as-is):** admin SVG publish E2E (`admin-svg-publish-p01.spec.ts`), pipeline census (5 live/5 published/0 orphans), production auth (`devAuthBypass.ts` false-in-prod). These were A1–A3.
