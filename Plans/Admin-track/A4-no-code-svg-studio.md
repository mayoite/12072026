# A4 — Visual SVG authoring engine

**Status:** IN PROGRESS — A4.0 foundation is committed and green (commit `a48a8400`, 19/19 scene tests). A4.1–A4.5 are partial; A4.6 not started. The current form + preview is a foundation, not yet the full visual editor. Review · status · evidence (one doc): [../../agents-review/A4-review.md](../../agents-review/A4-review.md).

**Outcome:** A non-coder creates, edits, validates, previews, and publishes a furniture symbol visually. The structured form becomes the property inspector. It is not the main experience.

**Boundary:** This engine authors publish SVG artifacts. Planner plan-draw remains Block2D → Fabric until a separate owner decision changes that product architecture.

## Engine decision

Preferred spike: **SVG.js** with select, resize, drag, and pan/zoom plugins. It manipulates SVG directly and its resize tooling supports handles, rotation, grid, and angle snapping. Fabric stays the Planner engine; its own docs warn SVG import/export is not 1:1, so using Fabric here risks authoring drift.

Do not install from enthusiasm. A4.0 must prove license, TypeScript support, React cleanup, CSP compatibility, 500-shape performance, deterministic serialization, and round-trip fidelity. If the spike fails, record why and choose the next engine.

## A4.0 — engine foundation — DONE

- One typed `SvgSceneDocument` is the editor authority.
- Engine adapter owns mount, destroy, events, viewport, and serialization.
- Direct scene → compiler adapter. No hidden JSON textarea.
- Deterministic IDs, ordering, numeric precision, and undo transactions.
- Existing descriptor fields and compiler remain the publish boundary.
- **Green when** — committed `a48a8400`: typed scene authority + adapter mount/destroy proven by a real-DOM test; a 500-shape scene serializes through the real `compileSvgBlockV1` byte-identically on round-trip; panzoom dependency removed; typecheck + lint clean. Evidence: [`results/admin/no-code-svg-studio/`](../../results/admin/no-code-svg-studio/).

## A4.0.1 — scene is the sole publish authority (CRITICAL PATH — the unlock)

The load-bearing gap: the canvas is mounted without `onDocumentChange`, so visual edits never reach publish. Until this is closed, no A4.x sub-item below is reachable by a real user.

- The scene document is the single publish authority; the descriptor form derives from it, never the reverse.
- **Green when** a rectangle drawn on the canvas appears in the published artifact on disk — not the form's artifact. No A4.x card below may be marked done until this is green.

## A4.1 — canvas and navigation

- Infinite-feeling stage with finite viewBox/artboard.
- Pan, zoom to cursor, zoom-to-fit, reset, rulers, grid, guides, and snap controls.
- Light/dark/checkerboard backgrounds. Actual-size and fit preview.
- Minimap only if the usability test proves it is needed.
- **Green when** an added shape lands on grid coordinates with snap on; all three backgrounds (light/dark/checkerboard) render; zoom-to-fit frames the full artboard from any pan position in one gesture.

## A4.2 — tool system

- Select, multi-select, move, resize, rotate, duplicate, delete, group, and ungroup.
- Rectangle, rounded rectangle, ellipse, line, polyline, polygon, and path tools.
- Pen/node editing only after every primitive tool passes its create→edit→undo→redo check.
- Align, distribute, order, lock, hide, and isolate.
- Mounting point, focus target, and semantic-region tools for Planner metadata.
- Keyboard shortcuts, command palette, tooltips, and visible active-tool state from one command map.
- **Green when** a rectangle can be created, moved, resized, rotated, duplicated, and deleted — each action reversible via named undo with the correct label.

## A4.3 — layers and inspector

- Searchable layer tree with rename, reorder, hide, lock, group, and selection sync.
- Basic inspector: position, size, rotation, radius, fill token, stroke token.
- Advanced inspector: viewBox, mounting, accessibility, parameters, and asset links.
- Plain-language templates for desk, chair, storage, workstation, and custom block.
- Expert values never require code syntax or raw SVG.
- **Green when** changing width in the inspector moves the selected *canvas node* (not just the form), and undo reverts it with the correct named label.

## A4.4 — history, drafts, and recovery

> Sequencing: dirty-state, unsaved-exit guard, and autosave must land **as soon as the first mutating tool (A4.2) exists** — a user who can make an edit can lose one. Do not defer these behind the full tool system.

- Undo/redo with named operations and a bounded history. *(A4.0: done.)*
- Dirty state, reset to published, autosaved local draft, reload recovery, and unsaved-exit guard.
- Draft, preview, and published are visibly different states.
- Publishing never destroys the prior revision.
- **Green when** a tab-close mid-edit reloads to the exact unsaved scene; "reset to published" restores the byte-identical prior revision; publishing writes a new revision without deleting the old.

## A4.5 — preview and validation

- Side-by-side authoring stage and the real server-compiled artifact.
- Plan-scale preview, catalog thumbnail, portal card, and 3D extrusion preview.
- Theme token and contrast modes. Missing-token warnings.
- Validation summary focuses and zooms to the offending object/control.
- Publish disabled until current scene, descriptor, and compiled artifact are valid.
- **Green when** the authoring stage and the server-compiled artifact are pixel-compared on 3 fixtures and match; p95 preview latency ≤500 ms on the named catalog fixture set is **logged, not asserted**; publish is disabled while any of scene/descriptor/artifact is invalid.

## A4.6 — proof

- Create → edit → undo → recover draft → compile → publish for fixed, configurable, and parametric variants.
- Keyboard-only and screen-reader browser run (enumerate tab order and ARIA roles on tools).
- Desktop, tablet, and narrow-layout screenshots.
- 500-shape stress test and deterministic round-trip test. *(A4.0: done.)*
- Failure injection for compile, persist, auth, and asset upload — each with a defined, buyer-legible user-visible outcome, not just an injected fault.
- **Green when** the evidence folder holds a passing three-variant browser run with desktop/tablet/narrow screenshots and the published bytes. Proof output → `results/admin/no-code-svg-studio/` (generated test evidence).

## Current residuals (post A4.0)

- A4.0 delivered: typed scene authority, engine adapter, deterministic serializer, and named undo/redo — committed and green.
- The visual canvas is mounted but **not yet wired to publish** (see A4.0.1) — the form is still the publish authority.
- No grid/guides/snap/backgrounds, no move/resize/rotate/multi-select/group, no per-object inspector, no templates.
- No dirty-state, autosave, reload recovery, or unsaved-exit guard.
- Preview modes are driven by the form, not the scene; no performance gate captured.
- Puck editor adapters remain legacy/portal compatibility code, not the authoring engine.

## Done means

A new catalog manager completes the three-variant browser scenario without instructions, code, JSON, or developer tools. Unit tests and an SVG file on disk are not enough.
