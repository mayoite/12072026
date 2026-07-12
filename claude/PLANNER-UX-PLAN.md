# Planner UI/UX improvement plan (UX-01 … UX-08)

**Date:** 2026-07-12 · **HEAD:** `7807198d` · **Host:** Fabric `planner-fabric-stage`
**Why this exists:** P01–P16 are *honesty gates* (does geometry paint, does reload preserve IDs, does the label lie). They are **not** a UI/UX plan. They never spec the toolbar, the inspector, interaction, responsiveness, empty/onboarding states, or theming as a *product* — only as pass/fail. This plan covers that missing layer and is grounded in the components that actually exist today.

**Rule of engagement:** every card obeys `CONSTRAINTS.md` "UI bar" (public entry, desktop + 375×812, keyboard + visible focus, empty/loading/error/success, honest labels, real browser proof). Fabric stays the sole 2D host. No second canvas. UI PASS needs a real browser run + screenshots, never units alone.

---

## The real UI surface today (what the P-cards omit)

| Component | File | State |
|-----------|------|-------|
| Top bar | `editor/TopBar.tsx` | View 2D/3D, floors, units, undo/redo, save pill, export/import, focus, density, Prefs |
| Tool rail | `editor/CanvasToolRail.tsx` + `editor/canvasTool.ts` | RAC toggle groups, live/deferred tiers, tooltips |
| Properties | `editor/PropertiesPanel.tsx` | Selected-entity fields |
| Layers | `editor/LayersPanel.tsx` | Bottom panel |
| Inventory | `editor/InventoryPanel.tsx` | Catalogue |
| Command palette | `editor/CommandPalette.tsx` | Trigger + list |
| Mobile | `ui/MobileDrawerSheet.tsx`, `ui/BottomSheet.tsx` | Drawers |
| Theme | `components/PlannerThemeToggle.tsx` | **Defined, never mounted** |
| Empty / skeleton | `ui/PlannerEmptyCanvas.tsx`, `ui/PlannerSkeleton.tsx` | Present |

### Concrete defects already found (evidence, not speculation)
1. **Dead Prefs controls** — `TopBar.tsx:437-439` Prefs menu `onAction` handles only `"density"`; **"Toggle grid" and "Toggle snap" do nothing**, though `plannerUIStore.toggleGrid`, `snapToGrid`, and `workspacePreferences.{gridEnabled,snapEnabled}` all exist. Toolbar ships buttons that lie by silence.
2. **Theme toggle not mounted** — `PlannerThemeToggle` has zero product JSX usages (only its own unit test); the live workspace can't switch theme. (Matches P09 REPROVE.)
3. **Deferred tools on the rail** — `room`, `dimension`, `text` arm as `select` and paint nothing (`canvasTool.ts:139-145`). Honest today via a "deferred" dot, but they are permanent stubs, not a plan to finish them.

---

## Sequence

```
UX-01 Toolbar truth ─┬─ UX-02 Selection inspector ─ UX-03 Snap/grid/measure
                     └─ UX-04 Theme mount ─ UX-05 Responsive/mobile
UX-06 Empty/onboarding ─ UX-07 Feedback/errors ─ UX-08 A11y + keyboard proof
```
One active card. UX-01 first — a toolbar that lies undermines every later card.

---

## UX-01 — Toolbar truth & completeness
**Outcome:** every control on the top bar and rail does what it says or is visibly, honestly deferred.
**Build:** wire Prefs → grid/snap to the store (kill the dead `onAction`); make deferred rail tools either function or move off the primary rail into a labelled "coming soon" affordance; single source of truth stays `canvasTool.ts`.
**PASS gates:** no control is a no-op; grid/snap toggle visibly changes the canvas and persists via `workspacePreferences`; deferred tools never appear as equal peers to live tools; browser proof clicks every top-bar + rail control and screenshots the result at desktop + 375×812.

## UX-02 — Selection inspector
**Outcome:** selecting any entity shows an editable inspector; edits are reversible via named undo.
**Build:** extend `PropertiesPanel` to a real node inspector — position (mm), size, rotation, layer, lock, per-type fields (wall thickness, opening width, furniture options); edits go through document actions, not direct mutation.
**PASS gates:** change width in the inspector → canvas updates and count/label stay accurate; undo restores prior value with a correct label; empty (nothing selected), multi-select, and locked states each render truthfully; keyboard-editable with visible focus.

## UX-03 — Snap, grid, and measurement
**Outcome:** drawing is precise — snap to grid/endpoints, visible grid, and a working measure/dimension.
**Build:** surface `snapToGrid`/`snapToNearestEndpoint`/`snapToSegment` (already in `lib/geometry`) in the interaction; promote the `dimension` tool from deferred to live (it's currently `M` → select alias).
**PASS gates:** snap-on placement lands on grid within tolerance; endpoint snap closes a room; dimension tool measures and annotates a real segment; toggling snap off restores freehand; browser proof with screenshots.

## UX-04 — Theme mount & parity
**Outcome:** a visible live theme control; light/dark cover chrome, Fabric, Three, native controls, focus states; preference survives reload with no flash.
**Build:** mount `PlannerThemeToggle` in the workspace chrome; verify token coverage across all surfaces; guard first-paint theme. (Closes P09's live gap.)
**PASS gates:** toggle switches every surface; reload keeps choice; no wrong-theme flash; contrast/focus/selected/disabled/hover/error pass in both themes; theme change never mutates document colors, IDs, pose, or geometry.

## UX-05 — Responsive & mobile
**Outcome:** the full journey works at 375×812 without covering the canvas or the primary action.
**Build:** audit `MobileDrawerSheet`/`BottomSheet`/panel toggles; ensure rail, save, and view toggle stay reachable; no clipped canvas.
**PASS gates:** draw → place → save → 3D switch complete on mobile viewport; drawers don't trap focus; every primary action reachable one-handed; screenshots at 375×812 and a tablet width.

## UX-06 — Empty state & onboarding
**Outcome:** a first-time buyer knows what to do from a blank canvas.
**Build:** strengthen `PlannerEmptyCanvas` — clear next action (start blank / starter room / template), honest "local draft" language for guests; loading via `PlannerSkeleton`.
**PASS gates:** public `/planner` entry with no dev flags → empty state → first wall/placement in ≤3 obvious steps; loading and error states render; guest copy says local, never cloud.

## UX-07 — Feedback, status & error honesty
**Outcome:** save, dirty, saving, saved, error, validation, and permission states are always visible and never overstate.
**Build:** audit the save pill (`workspaceStatusLabels` / `PlannerSaveIndicator`), export/import feedback, and failure toasts; guest never sees "cloud" before a cloud save succeeds.
**PASS gates:** each state is visible and truthful; corrupt-data reload reports recovery or failure clearly; no silent failures; no console/hydration/request errors during the journey.

## UX-08 — Accessibility & keyboard proof
**Outcome:** the whole planner is keyboard-operable with correct names, roles, and focus in both themes.
**Build:** full keyboard map (tools, palette, panels, inspector); RAC focus management audit; SR names for every control; the command palette as the keyboard spine.
**PASS gates:** complete a draw→place→save journey keyboard-only; visible focus throughout; axe/lighthouse a11y clean on the live route; screenshots + targeted browser trace at desktop and 375×812.

---

## How this relates to P01–P16
These UX cards **do not replace** the honesty gates — they sit alongside them and can only PASS on the live Fabric host with real browser proof, same bar. P05/P08/P09 residuals feed UX-01/UX-04. Buyer cards P11–P16 should not open until at least UX-01…UX-04 are green, or they'll build product features on a toolbar that still has dead controls.

## Open decisions for the owner
1. **Scope:** should deferred tools (room outline, text) be *finished* (UX-01/03) or *removed* from the rail until their P-card lands?
2. **Placement:** is this a new `Plans/Planner-track/` UX sub-track, or folded into P09 (toolbar/themes) which already owns some of it?
3. **Priority vs. buyer cards:** fix UX debt first, or interleave with P11+?
