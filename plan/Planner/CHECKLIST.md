# Planner — CHECKLIST

Tick [UI-BAR.md](../UI-BAR.md) and the phase section below. Live browser proof required.

## PHASE-01 — SVG import
- [x] Baseline reproof: `modularCabinetV0.test.ts` + `fabricBlock2D.test.ts` green on HEAD (log before edits)
- [x] `svgPlanSymbolCache` wired in placement path (`getSvgPlanImage`); Block2D paints while loading
- [x] Placed item paints published SVG (not flat box)
- [x] Missing `.svg` → Block2D fallback, no console error (`open3d-p05-cabinet-multiprim.spec.ts` regression guard)
- [x] `open3d-cp05-symbols-s7.spec.ts` rewritten: planner paints catalog + HTTP multipath honesty; inventory thumb separate from canvas paint
- [x] Scale/rotate/save/reload preserves symbol (`open3d-p01-svg-symbol-persist.spec.ts` + `projectParser` previewImageUrl round-trip)
- [x] Screenshots desktop + 375×812 (`results/planner/phase-01-svg-persist/browser/`)

## PHASE-02 — Toolbar truth
- [x] Grid toggle works + persists
- [x] Snap toggle works + persists
- [x] No control is a silent no-op
- [x] Deferred tools marked, not equal peers

## PHASE-03 — Inspector + units
- [x] Edit width → canvas updates → undo restores (labelled)
- [x] ft-in display; stored mm unchanged
- [x] Empty/multi/locked states honest
- [x] Keyboard-editable, visible focus

## PHASE-04 — Snap/measure
- [x] Snap-on lands on grid; snap-off freehand
- [x] Endpoint snap closes room
- [ ] Dimension tool (M) already live from UI P01 — verify snap + measure work together (do not re-promote M here) — **blocked** UI P01

## PHASE-05 — Docking/responsive
- [ ] Dock/float/collapse persists across reload
- [ ] Height chain: canvas fills container at 375 / 1280 / 1920 / 2560
- [ ] No unexpected overflow/scrollbars at any target size
- [ ] Full journey at 375×812, canvas unclipped
- [ ] Primary action reachable one-handed

## PHASE-06 — Onboarding/feedback
- [ ] Empty→first placement in ≤3 steps, no dev flags
- [ ] Loading + error states visible
- [ ] Guest never says "cloud" pre-save
- [ ] No console/hydration errors

## PHASE-07 — Workflow + a11y
- [ ] Full buyer story keyboard-only
- [ ] Journey uses live theme from PHASE-11 (not mouse-only theme bypass)
- [ ] Zero console errors on guest workspace load
- [ ] Height/chrome audit turned into a repeatable check (not a one-off screenshot)
- [ ] axe/lighthouse clean
- [ ] Trace + screenshots attached

## PHASE-08 — Select/delete/undo
- [x] Pointer selection resolves correct entity ID
- [x] Delete removes entity from document and canvas
- [x] Undo restores same ID, pose, rotation, options
- [x] Selection state and visible count accurate
- [x] `applySelectionDelete.test.ts` + `open3d-w3-select-delete.spec.ts` green

## PHASE-09 — 2D↔3D orbit continuity
- [x] Three viewer reads live project
- [x] Orbit does not mutate project
- [x] IDs, pose, rotations, counts unchanged 2D→3D→2D
- [x] Loading/error states keep return path
- [x] `open3d-w4-orbit-continuity.spec.ts` green

## PHASE-10 — 3D mesh quality
- [x] Cabinet-v0 toe/carcass/door readable in live Three viewer
- [x] Part names, order, size, count match option set
- [x] 2D footprint and mesh height dimensionally true
- [x] 2D↔3D switch preserves identity and pose
- [x] WebGL screenshots desktop + 375×812
- [x] Mesh e2e specs green

## PHASE-11 — Theme mount
- [x] `PlannerThemeToggle` mounted in workspace chrome
- [x] Preference survives reload; no wrong-theme flash
- [ ] Chrome, Fabric, Three, forms, focus states switch in both themes
- [x] Theme change does not mutate document geometry
- [x] Browser proof desktop + 375×812 both themes

## PHASE-12 — Handover re-proof
- [ ] `pnpm run check:layout` exit 0 (no forbidden `site/results/`) — **BLOCKED** `PLAN-FAIL-0416`
- [x] Typecheck exit 0
- [x] `hostWiringP01` 4/4 on HEAD
- [x] `open3d-world-standard-journey.spec.ts` green
- [x] `open3d-systems-v0-batch-place.spec.ts` green
- [ ] Open P01–P11 items closed or owner-waived in handover report
- [ ] HEAD recorded in handover report
