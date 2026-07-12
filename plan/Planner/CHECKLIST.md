# Planner — CHECKLIST

Tick [UI-BAR.md](../UI-BAR.md) **and** the phase section below. Live browser proof required. Units/typecheck alone never tick a box.

## PHASE-01 — SVG import
- [ ] P05 Task 0 baseline: `modularCabinetV0.test.ts` + `fabricBlock2D.test.ts` green on HEAD (log before edits)
- [ ] `svgPlanSymbolCache` wired in placement path (`getSvgPlanImage`); Block2D paints while loading
- [ ] Placed item paints published SVG (not flat box)
- [ ] Missing `.svg` → Block2D fallback, no console error (`open3d-p05-cabinet-multiprim.spec.ts` regression guard)
- [ ] `open3d-cp05-symbols-s7.spec.ts` rewritten: planner paints catalog + HTTP multipath honesty; inventory thumb separate from canvas paint
- [ ] Scale/rotate/save/reload preserves symbol
- [ ] Screenshots desktop + 375×812

## PHASE-02 — Toolbar truth
- [ ] Grid toggle works + persists
- [ ] Snap toggle works + persists
- [ ] No control is a silent no-op
- [ ] Deferred tools marked, not equal peers

## PHASE-03 — Inspector + units
- [ ] Edit width → canvas updates → undo restores (labelled)
- [ ] ft-in display; stored mm unchanged
- [ ] Empty/multi/locked states honest
- [ ] Keyboard-editable, visible focus

## PHASE-04 — Snap/measure
- [ ] Snap-on lands on grid; snap-off freehand
- [ ] Endpoint snap closes room
- [ ] Dimension tool (M) already live from UI P01 — verify snap + measure work together (do not re-promote M here)

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
- [ ] Chrome notes restored: `CANVAS-NOTES.md`, `TOOLBAR-NOTES.md`, `LAYOUT-OVERFLOW.md`, `P05-SVG-HONESTY-NOTES.md` under `agents-work/`
- [ ] axe/lighthouse clean
- [ ] Trace + screenshots attached

## PHASE-08 — Select/delete/undo
- [ ] Pointer selection resolves correct entity ID
- [ ] Delete removes entity from document and canvas
- [ ] Undo restores same ID, pose, rotation, options
- [ ] Selection state and visible count accurate
- [ ] `applySelectionDelete.test.ts` + `open3d-w3-select-delete.spec.ts` green

## PHASE-09 — 2D↔3D orbit continuity
- [ ] Three viewer reads live project
- [ ] Orbit does not mutate project
- [ ] IDs, pose, rotations, counts unchanged 2D→3D→2D
- [ ] Loading/error states keep return path
- [ ] `open3d-w4-orbit-continuity.spec.ts` green

## PHASE-10 — 3D mesh quality
- [ ] Cabinet-v0 toe/carcass/door readable in live Three viewer
- [ ] Part names, order, size, count match option set
- [ ] 2D footprint and mesh height dimensionally true
- [ ] 2D↔3D switch preserves identity and pose
- [ ] WebGL screenshots desktop + 375×812
- [ ] Mesh e2e specs green

## PHASE-11 — Theme mount
- [ ] `PlannerThemeToggle` mounted in workspace chrome
- [ ] Preference survives reload; no wrong-theme flash
- [ ] Chrome, Fabric, Three, forms, focus states switch in both themes
- [ ] Theme change does not mutate document geometry
- [ ] Browser proof desktop + 375×812 both themes

## PHASE-12 — Handover re-proof
- [ ] `pnpm run check:layout` exit 0 (no forbidden `site/results/`)
- [ ] Typecheck exit 0
- [ ] `hostWiringP01` 4/4 on HEAD
- [ ] `open3d-world-standard-journey.spec.ts` green
- [ ] `open3d-systems-v0-batch-place.spec.ts` green
- [ ] P01–P11 residuals closed or owner-waived in report
- [ ] CP-01 accepted or named open
- [ ] HEAD.txt + handover report committed path named
