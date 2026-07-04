# Phase 01B Execution Benchmark: React Canvas Feasibility

Date: 2026-07-03  
Access date for all web sources: 2026-07-03  
Status: advisory only. The primary agent retains final authority.

## Scope

Phase 01B is a hidden feasibility slice. It proves React-owned canvas input, command wiring, snap feedback, responsive capability, and evidence quality. It does not approve final visual design, route replacement, inventory UI, docking, or donor imitation.

Products reviewed:

- Floorplanner and Planner 5D: floor-planning workflow patterns
- AutoCAD Web and SketchUp for Web: command, snap, and workspace patterns
- Figma: keyboard-first command access
- SketchUp 3D Warehouse: later inventory-search principles

## Benchmark Takeaways

- Mature authoring tools keep the canvas primary and make the active tool and cancel path obvious.
- Precision requires visible snap type/target feedback, deterministic priority, and clean cancellation.
- Important commands should be reachable from multiple surfaces, even in a feasibility build.
- Responsive evidence should prove capability per tier, not imply full parity.

## Phase 01B Must Prove

1. One pointer-coordinate pipeline from client coordinates to canonical millimetres.
2. Pointer capture, `pointercancel`, lost capture, blur, and unmount all converge without stuck state or partial mutation.
3. Mouse, pen, and single-touch input share one Pointer Events path.
4. Pan and zoom never mutate document geometry.
5. High-DPI rendering preserves correct hit testing in CSS-coordinate semantics.
6. One continuous wall or line command has preview, commit boundary, undo, and cancel-without-history.
7. `Esc`, explicit cancel, and context-menu safety all produce the same command outcome.
8. Endpoint, grid, and angle snapping are visible, deterministic, and tolerance-based.
9. One command is registered once and invoked from a test strip, keyboard shortcut, and searchable command surface.
10. The hidden host mounts safely on desktop and tablet tiers without route replacement or public UI debt.

## Host Rules

- Keep the host minimal: landmark, canvas wrapper, one canvas, compact command strip, status/live region, optional diagnostics, deterministic reset.
- Do not mount donor UI, production inventory, public navigation, arbitrary docking, or full persistence chrome.
- Keep the canvas dominant. Test chrome must be bounded and removable.

## Responsive Proof Matrix

- Desktop (`>=1280px`): draw, snap, pan/zoom, cancel, undo, resize proof.
- Tablet (`768-1279px`): draw, touch/pointer, pan/zoom, cancel, compact command surface.
- Small (`<768px`): mount, review, pan/zoom, and clearly limited editing only.

Record actual viewport size, DPR, input type, and whether each behavior is proven or deferred.

## Explicit Deferrals

Defer:

- final information architecture;
- final visual language;
- movable/dockable toolbar system;
- inventory UI;
- save/conflict UI;
- 2D/3D transition;
- export flows;
- route replacement.

Reject:

- donor pixel parity;
- copied competitor colors, wording, icons, marker shapes, or layouts;
- an oversized 01B demo that hides feasibility risk with polish;
- claims of tablet or small-screen authoring parity without direct proof.

## Approval Evidence

The phase should not be treated as passed unless it shows:

1. React owns rendering and input without donor runtime composition.
2. Cancel and lost-input paths cannot leave a stuck command.
3. One draw action is undoable and cancel leaves no mutation.
4. Snap candidates are visible and deterministic across zoom and DPR.
5. Canonical millimetres remain stable across unit and viewport changes.
6. Pan, zoom, and resize preserve geometry and mapping.
7. Keyboard and visible controls invoke the same registered command.
8. The hidden host mounts safely at desktop and tablet tiers.
9. Performance and bundle impact are measured in the required evidence format.
10. One catalog asset loads by stable identity with safe fallback.
11. One migrated document opens without source overwrite and emits a conversion report.
12. License and provenance checks permit the selected strategy.
