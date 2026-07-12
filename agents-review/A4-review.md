# A4 — Consolidated analysis (review · status · evidence)

> **2026-07-12 raise:** authority bridge (`sceneParts` → `blocks` through parse), undo→form sync, load-from-blocks, canvas-first shell CSS/layout. Plan card rewritten for honest critical path. **Browser disk proof still OPEN.**
>
> Plan card: [../Plans/Admin-track/A4-no-code-svg-studio.md](../Plans/Admin-track/A4-no-code-svg-studio.md) · Unit log: [../results/admin/no-code-svg-studio/A4-authority-raise.txt](../results/admin/no-code-svg-studio/A4-authority-raise.txt)

---

# Part 1 — Product-standard review


> Reviews the *plan* against a professional product bar. Does not change scope or owner intent — it sharpens outcome, sequencing, honesty, and acceptance so "done" is never ambiguous. (Status audit is Part 2 of this doc.)

## Verdict

The A4 card is **directionally correct and unusually honest** (it already admits "flawless is unproven"). Its weaknesses are not vision — they are **sequencing risk, soft acceptance language, and one unstated critical-path dependency** that lets the track *look* advanced while the core value is still unwired.

Single most important correction: **A4 is not "done when the tools exist" — it is done when a drawn shape survives the full round-trip to a published artifact.** Everything else serves that sentence.

## 1. Outcome realism — where a real non-coder gets stuck

The stated outcome is the right north star. But the plan lets each sub-section be built in isolation, and the audit confirms the failure mode: the canvas is mounted **without `onDocumentChange`**, so visual edits never reach publish. A non-coder today would draw a shape, hit Publish, and get the *form's* artifact — not what they drew. That is a silent-wrong-result: the worst UX outcome.

**Fix in the plan:** add an explicit A4.0.1 gate — *"the scene document is the sole publish authority; the descriptor form derives from it, never the reverse."* Until that gate is green, no A4.x sub-item may be marked done, because none are reachable by a real user.

## 2. Sequencing — what must move earlier

The card orders A4.0 → A4.6 linearly. Two things are mis-ordered against real risk:

- **Data-loss guards (A4.4) are too late.** "Autosave, reload recovery, unsaved-exit guard" sit in section 4, after the whole tool system. The moment a user can *make* an edit (A4.2), they can *lose* one. An editor that loses work on an accidental tab-close is abandoned before its tooling matters. **Move dirty-state + exit guard + autosave to immediately follow the first mutating tool.**
- **The scene→publish wiring (implicit) precedes everything.** It is the load-bearing unlock and should be the first named item after A4.0, not an unwritten assumption.

Recommended real critical path:
`A4.0 foundation → scene→publish wiring → first mutating tool → data-loss guards → property inspector → richer tools/preview → proof`

## 3. Honest scope — language that will bite you

The plan uses evaluative words with no test: **"flawless," "professional visual editor," "infinite-feeling stage," "solid."** Replace each with an observable:

| Vague | Observable replacement |
|-------|------------------------|
| "professional visual editor" | "select→resize→rotate→publish works keyboard-only, no raw SVG shown" |
| "primitive tools are solid" | "each primitive: create, undo, re-select, edit, redo — all reversible with named history" |
| "infinite-feeling stage" | "pan/zoom to 4 fixed fixtures returns to zoom-to-fit within 1 gesture" |

## 4. Acceptance clarity — every sub-item needs a buyer-visible proof

A4.6 lists proofs, but A4.1–A4.5 describe *features*, not *checks*. Each sub-item should carry its own "Green when…" line so it closes independently:

- **A4.1 Green when:** an added shape lands on grid coordinates; all three backgrounds render; zoom-to-fit frames the full artboard from any pan.
- **A4.2 Green when:** a rectangle can be created, moved, resized, rotated, duplicated, deleted — each reversible via named undo.
- **A4.3 Green when:** changing width in the inspector moves the *canvas* node (not just the form) and undo reverts it with the correct label.
- **A4.4 Green when:** a tab-close mid-edit reloads to the exact unsaved scene; "reset to published" restores byte-identical prior revision.
- **A4.5 Green when:** authoring stage and server-compiled artifact are pixel-compared on 3 fixtures; p95 preview latency ≤500 ms is logged, not asserted.

## 5. Risk & under-specification

- **CSP / license / round-trip** (A4.0 spike criteria) — make each a recorded artifact in `results/admin/no-code-svg-studio/`, not a claim. (Agent produced exactly this.)
- **Performance gate** — "p95 ≤500 ms on catalog fixtures" needs a named fixture set and a captured measurement, or it is unfalsifiable.
- **Accessibility** — "keyboard-only and screen-reader run" needs the specific assistive path enumerated (tab order, ARIA roles on tools).
- **Failure injection** (compile/persist/auth/asset) — specify the *expected user-visible behavior* for each failure, not just "inject it."

## 6. What to tell your boss (truthful)

> Admin A1–A3 are done and proven. A4.0 — the editor's typed foundation, engine adapter, deterministic serializer, and undo/redo — is committed and green (19/19 scene tests). A4.1–A4.5 are partially built; the next unlock is wiring the visual canvas into the publish pipeline — a scoped, well-understood change with a clear green check. The plan has been sharpened so each remaining step has a concrete, demonstrable acceptance test.

## The refinement standard (applies to every plan file)

1. **Outcome first** — one sentence a buyer would recognize; no internal jargon in the outcome line.
2. **Every claim observable** — replace "flawless/solid/professional" with a "Green when…" check.
3. **Data-loss & failure states are first-class**, never an afterthought section.
4. **Critical-path dependencies are explicit**, not assumed.
5. **Evidence path named** for anything claimed done.
6. **Preserve owner intent and structure** — sharpen, never redirect the product.

---

# Part 2 — Status audit (grounded in live code)


> [BOARD](../Plans/Admin-track/BOARD.md) · [A4 card](../Plans/Admin-track/A4-no-code-svg-studio.md) · **Bar:** [00-QUALITY-BAR](../Plans/00-QUALITY-BAR.md)
> Audit date: 2026-07-12 · Method: read every file under `site/features/planner/admin/svg-editor/` and its committed tests; ran the scene suite.

**One-line verdict:** A4.0 (engine foundation) is real, committed, and green. The visual canvas is mounted in the edit view but is **not yet wired to the publish path** (`SvgStudioCanvas` is rendered without `onDocumentChange` — see `AdminSvgEditorEditView.tsx:368`), so today the canvas is a working authoring surface whose edits do not reach serialize -> compile -> publish. Everything above A4.0 is partial or scaffolding.

## Status table

| Sub | Status | Grounded in real files | What's actually there (one line) |
|-----|--------|------------------------|----------------------------------|
| **A4.0** engine foundation | **DONE** | `scene/svgSceneDocument.ts`, `scene/svgEngineAdapter.ts`, `scene/svgJsEngineAdapter.ts`, `scene/svgSceneHistory.ts`, `scene/svgSceneSerializer.ts` + tests `scene/svgScene.test.ts` (14), `scene/svgSceneStress.test.ts` (4), `scene/svgJsEngineAdapter.dom.test.ts` (1) — **19/19 green**, committed `a48a8400`. | Typed `SvgSceneDocument` authority; engine-adapter seam (headless + SVG.js impls); deterministic serializer with z-order prefix + numeric normalization; bounded named undo/redo; existing V1 descriptor/compiler kept as the publish boundary (round-trips through the real `compileSvgBlockV1`). |
| **A4.1** canvas & navigation | **PARTIAL** | `SvgStudioCanvas.tsx`, `scene/svgJsEngineAdapter.ts:170` (wheel zoom), `:135` (drag-pan), `:229` (zoomToFit) | Pan (drag empty canvas), zoom-to-cursor (wheel), zoom-to-fit + reset buttons on a finite viewBox. **Missing:** rulers, grid, guides, snap controls, light/dark/checkerboard backgrounds, actual-size vs fit preview, minimap. |
| **A4.2** tool system | **PARTIAL** (thin) | `SvgStudioCanvas.tsx:160-206` (add rect/circle, delete, front/back, hide, lock); pointer-select via `svgJsEngineAdapter.ts:135` | Single-select + add-rectangle, add-circle, delete, bring-to-front/send-to-back, hide, lock. **Missing:** multi-select, move/resize/rotate/duplicate, group/ungroup, the rest of the primitive tools (rounded-rect, ellipse, line, polyline, polygon, path), pen/node editing, align/distribute/isolate, mounting/focus/semantic-region tools, keyboard shortcuts, command palette. |
| **A4.3** layers & inspector | **PARTIAL** | Layer list `SvgStudioCanvas.tsx:236-254`; property form `SvgEditorForm.tsx` + `svgEditorFormModel.ts` | Layer list with select-sync, hide, lock (no rename, no drag-reorder, no grouping, no search). A rich descriptor **property form exists** — but it edits the *descriptor* (`descriptorToFormState`), **not the selected scene node's geometry** (x/y/size/radius/fill token/stroke). No per-object inspector wired to canvas selection; no plain-language desk/chair/storage templates. |
| **A4.4** history, drafts, recovery | **PARTIAL** | `scene/svgSceneHistory.ts` (+ tests); wired at `SvgStudioCanvas.tsx:108,144-158` | Undo/redo with named operations and bounded depth is done and wired. **Missing:** dirty-state tracking, reset-to-published, autosaved local draft, reload recovery, unsaved-exit guard, visibly distinct draft/preview/published states. (Confirmed no `localStorage.setItem` / `beforeunload` anywhere in the folder.) |
| **A4.5** preview & validation | **PARTIAL** | `LiveCompiledSvgPreview.tsx`, `useDebouncedCompile.ts`, `PublishedSvgPreview.tsx`, `GlbExtruderPreview.tsx`, `ModelViewerPreview.tsx`, validation issues in `SvgEditorForm` | Real server-compiled live preview, published preview, and 3D extrusion previews exist and validation issues surface in the form. **But** preview is driven by the *form*, not the scene — there is no side-by-side authoring-stage-vs-artifact from the same scene, no plan-scale/thumbnail/portal-card/contrast modes, no missing-token warning that focuses the object, and **no measured p95 <=500 ms latency gate**. |
| **A4.6** proof | **NOT-STARTED** | evidence dir `results/admin/no-code-svg-studio/` (not populated); only the 500-shape stress + determinism proof exists as unit tests | No browser three-variant create->edit->undo->recover->compile->publish run, no keyboard-only/screen-reader pass, no desktop/tablet/narrow screenshots, no failure-injection matrix. The stress/round-trip bullet is covered by `svgSceneStress.test.ts`; the rest is unbuilt. |

### The load-bearing gap (why A4.1-A4.5 stay "partial")
`AdminSvgEditorEditView.tsx:210` seeds a scene with `sceneFromDescriptor(descriptor)` and mounts `<SvgStudioCanvas initialDocument={studioScene} />` at line 368 — **without** the `onDocumentChange` callback the component already exposes (`SvgStudioCanvas.tsx:59,148`). So the serializer, history, and canvas all work, but a shape drawn on the canvas is never lifted back into the descriptor form state that `publishDescriptorWithPipeline` consumes. The canvas is a demo; the form is still the only publish authority. Closing this seam is the first backlog item and unlocks the acceptance value of nearly everything else.

## Sequenced backlog (next 8, dependency order, one-sitting each)

| # | Item | Size | Acceptance check to mark green |
|---|------|------|-------------------------------|
| 1 | **Wire scene -> publish.** Pass `onDocumentChange` from `AdminSvgEditorEditView` into `SvgStudioCanvas`; on change, serialize the scene and merge the resulting parts/viewBox into the form state that feeds `publishDescriptorWithPipeline`. | **M** | Add a rectangle on the canvas, Publish, and the compiled artifact on disk contains that rectangle. A unit test asserts a canvas edit reaches `serializeSceneToDefinition` -> form state. |
| 2 | **Selected-node property inspector.** When a node is selected, show editable x/y/size (radius for circle) + fill/stroke token; commit edits through the existing named-history `apply`. | **M** | Select a rect, change width in the inspector -> canvas updates and Undo reverts it with the correct operation label. |
| 3 | **Grid + snap + background toggle (A4.1).** Overlay a grid on the viewBox, snap new/added shapes to the grid increment, add light/dark/checkerboard background switch. | **S** | Toggle grid on; an added shape lands on grid coordinates; background switch visibly changes all three modes. |
| 4 | **Dirty state + reset-to-published + unsaved-exit guard (A4.4).** Track dirty vs. the loaded published doc; add a reset button and a `beforeunload`/route guard. | **S** | Editing flips a visible "unsaved" indicator; Reset restores the published scene; navigating away with edits prompts. |
| 5 | **Autosaved local draft + reload recovery (A4.4).** Persist the scene to `localStorage` per slug on commit; offer a recovery banner on reload. | **M** | Edit, reload the page, accept the recovery banner -> the edited scene is restored (no server round-trip). |
| 6 | **Direct move + resize handles (A4.2 core).** Drag the selected node to move; drag corner handles to resize; both as named, undoable ops. | **L** *(sliceable: move first, resize second)* | Drag a rect to a new position and resize it via a handle; both commit distinct undoable operations and serialize correctly. |
| 7 | **More primitives + duplicate + multi-select (A4.2).** Add line, ellipse, rounded-rect tools; duplicate (offset copy); shift-click multi-select. | **M** | Each tool adds the right node kind; duplicate produces an offset copy with a fresh id; shift-click selects two nodes. |
| 8 | **A4.6 proof harness.** Playwright script: create -> edit -> undo -> recover draft -> compile -> publish for fixed/configurable/parametric, dropping screenshots + a run log into `results/admin/no-code-svg-studio/`. | **L** | The evidence folder contains a passing three-variant run with desktop/tablet/narrow screenshots and the published bytes. |

Items 1-5 are each finishable in one sitting; 6 and 8 are the "L" items and should be sliced. Do them in order — 1 is the unlock, 2-5 make the canvas trustworthy, 6-7 make it feel like a real editor, 8 turns "Done means" from a claim into evidence.

## What to tell your boss

The admin track's foundation is solid and honestly reported. **A1-A3 are DONE** — a real browser publish journey, the full 5/5 live descriptor pipeline with zero orphans, and production auth that rejects anonymous access. On **A4 (the visual authoring engine)**, the hardest architectural piece — **A4.0 — is built, committed (`a48a8400`), and green: 19 passing tests** proving a single typed scene document as the editor authority, a swappable engine adapter (SVG.js behind a seam), deterministic serialization that round-trips through the *real* production compiler, bounded named undo/redo, and a 500-shape stress test. A working visual canvas with pan/zoom, layers, and shape tools is already mounted in the editor. The candid gap is that the canvas isn't yet connected to the publish pipeline, and the professional-editor surface (property inspector on selection, drag-resize, drafts/recovery, preview parity) is still to come. That's exactly what the sequenced backlog above addresses, smallest-unlock-first: one focused change connects the canvas to publish, and four small items after it make the studio trustworthy. We are not claiming "flawless" — we're claiming a proven foundation and a credible, short path to the buyer-visible three-variant proof that closes A4.

---

# Part 3 — A4.0 foundation evidence


**Card:** `Plans/Admin-track/A4-no-code-svg-studio.md` -> section `## A4.0 — engine foundation`
**Commit:** `a48a84002707765b85501cce88276e0bcee15512` — feat(admin-svg): A4.0 engine foundation — SVG.js adapter rework + DOM/stress tests
**Branch:** `main` · **Captured:** 2026-07-12 · **Working dir for tests:** `site/`

**Test command:**

    pnpm exec vitest run \
      tests/unit/admin/svg-editor/scene/svgJsEngineAdapter.dom.test.ts \
      tests/unit/admin/svg-editor/scene/svgSceneStress.test.ts \
      --config vitest.site.config.ts

**Result:** 2 files / **5 tests passed, 0 failed, 0 skipped** (exit 0). Raw log: `test-output.txt`.

---

## Scope honesty (read this first)

A4.0 is a **foundation layer**, not the shipped A4 engine. The card's own status line says
"the current form + preview is a foundation, not a professional visual editor; 'Flawless' is
unproven." This report evaluates **only the five A4.0 bullets** against the committed code.
A4.1-A4.6 (canvas/navigation, full tool system, layer tree + inspector, history/drafts/recovery,
preview + validation, and the create->publish proof) are **NOT the subject of this bundle** and
are largely unbuilt or stub-level — see "Beyond A4.0" at the end.

The "Done means" bar in the card — a catalog manager completes the three-variant scenario
without instructions, code, JSON, or dev tools; unit tests and an SVG file are not enough — is
**NOT met** and is not claimed to be met here. This is unit/DOM-level evidence only.

---

## Per-bullet verdicts

### 1. "One typed SvgSceneDocument is the editor authority." — PASS

- Fully typed, immutable model: `SvgSceneDocument` with a discriminated `SvgSceneNode` union
  (rect/circle/line/path/text), viewBox, metadata — `svgSceneDocument.ts:112` (interface),
  `:77` (node union), `:23`/`:99` (style/metadata).
- Immutable update primitives all return a **new** document, never mutate: `replaceNode`
  (`:148`), `addNode` (`:172`), `removeNode` (`:181`), `reorderNode` (`:191`).
- The live studio treats the document as the single authority and feeds the renderer from it:
  `SvgStudioCanvas.tsx:111` (`history.present.document`), `:141` (`adapter.render(document)`).
  The adapter contract states the renderer "never becomes the source of truth" —
  `svgEngineAdapter.ts:5-9`.
- **Caveat (not a fail):** it is the authority *for geometry*. The A4-final publish still goes
  through the **separate** `SvgEditorFormState` (`AdminSvgEditorEditView.tsx:147`/`:223`,
  `onPublishAction(form)`), not the scene document. Scene = authority for the canvas surface;
  form = authority for the published descriptor at this commit. Not yet unified. Bullet 1 as
  written is satisfied for the editor model; full end-to-end authority is A4.3+.

### 2. "Engine adapter owns mount, destroy, events, viewport, and serialization." — PASS

- Interface defines exactly these: `svgEngineAdapter.ts:47` — render, get/set viewport,
  zoomToFit/resetViewport, serialize, on, destroy.
- SVG.js implementation covers all:
  - mount: `svgJsEngineAdapter.ts:84` createSvgJsEngineAdapter -> `:89` SVG().addTo(container).
  - destroy: `:246` removes DOM + global listeners, clears sets, draw.remove(); second call is a
    safe no-op (`:247`). Verified by DOM test (`svgJsEngineAdapter.dom.test.ts:71-74`: svg is
    null after destroy; second destroy() does not throw).
  - events: pointerdown/dblclick/wheel/pan at `:187-192`; typed on() at `:240`.
  - viewport: viewBox pan/zoom, get/set/zoomToFit/reset at `:215-236`.
  - serialization: `:237` serialize() -> serializeSceneToDefinition(current).
- DOM-free reference adapter (createHeadlessEngineAdapter, `svgEngineAdapter.ts:78`) implements
  the same contract for SSR-safety and testing.
- **Caveat (not a fail):** zoomToFit() and resetViewport() are currently **identical** (both
  setBox({ ...home }), `:229-236`) — reset does not restore zoom=1/origin distinct from fit.
  Acceptable for a foundation; tighten in A4.1. Ownership of the five responsibilities is real,
  so PASS.

### 3. "Direct scene -> compiler adapter. No hidden JSON textarea." — PARTIAL

- Scene->descriptor path is real and direct: `svgSceneSerializer.ts:180`
  serializeSceneToDefinition(doc) maps nodes -> SvgBlockDefinitionV1 parts with no intermediate
  JSON string, and the stress test compiles that output through the **real** server compiler
  compileSvgBlockV1 (`svgSceneStress.test.ts:68-73`, PASS).
- There is genuinely **no JSON textarea** in the scene/canvas surface — `SvgStudioCanvas.tsx` is
  icon-button + layer-tree only; the document is edited via typed primitives, not raw text.
- **Why PARTIAL, not PASS:** the *live studio* does not yet publish from the scene. At this
  commit the canvas (SvgStudioCanvas) and the publish form (SvgEditorForm -> onPublishAction) are
  **two parallel surfaces** in `AdminSvgEditorEditView.tsx` (canvas `:368`, form+publish
  `:379`/`:223`). The scene document's serialize() output is **not** wired into the publish
  action — nothing calls serializeSceneToDefinition from the publish path in the committed UI.
  "Direct scene -> compiler" is proven in tests and in the serializer, but the end-to-end product
  path from the visual canvas to publish is not connected. True for the seam, not yet the flow.

### 4. "Deterministic IDs, ordering, numeric precision, and undo transactions." — PARTIAL

- **IDs — PASS.** Stable editor ids survive edits; replaceNode forbids id/kind changes
  (`svgSceneDocument.ts:158-163`); duplicate ids rejected (`:173`, `:241`). z-order is carried by
  array position, not id (`:117`).
- **Ordering — PASS.** Paint order = array index; the serializer encodes z-order into a
  zero-padded `z####-` id prefix so it survives the compiler's id-sort, loader strips it back
  (`svgSceneSerializer.ts:51-59`, `:85-86`, `:200-202`). Round-trip proven:
  `svgSceneStress.test.ts:58-66` (500 nodes, id + order preserved).
- **Numeric precision — PASS.** normalizeNumber rounds to fixed decimals and kills -0
  (`svgSceneSerializer.ts:45-49`, SCENE_NUMERIC_PRECISION = 3 at `:39`); applied on every geometry
  field. Byte-identical descriptor across repeated serialization proven:
  `svgSceneStress.test.ts:86-91`.
- **Undo transactions — PARTIAL.** A bounded, named-transaction history model exists and is
  well-formed: `svgSceneHistory.ts` — commit with a human label (`:44`), undo/redo (`:64`/`:75`),
  depth bound DEFAULT_HISTORY_LIMIT = 100 (`:26`, trim at `:52`), labels for UX
  (undoLabel/redoLabel `:87`/`:92`). Wired into the live component (`SvgStudioCanvas.tsx:108`,
  `:146` commit, `:157-158` undo/redo). **But:** neither of the two A4.0 test files named in this
  bundle exercises the history at all — there is **no passing undo/redo test in this evidence
  set**. History correctness here rests on code reading, not the captured tests. (A separate
  `svgScene.test.ts` exists in the tree but is outside the two files this bundle was scoped to
  run.) Marked PARTIAL because the "undo transactions" claim is **not proven by the evidence run**.

### 5. "Existing descriptor fields and compiler remain the publish boundary." — PASS

- The serializer targets the **existing** SvgBlockDefinitionV1 schema unchanged and emits every
  descriptor head field (schemaVersion, typeId, lifecycle, physicalDimensionsMm, accessibility,
  parameters/actions/constraints/variants/mounting) — `svgSceneSerializer.ts:152-172`, `:180-193`.
- The **real** server compiler is the oracle in the stress test, not a stub: compileSvgBlockV1
  from open3d/catalog/svg/svgCompiler.server produces a real `<svg` and a 64-hex SHA-256 checksum
  (`svgSceneStress.test.ts:11`, `:68-73`, PASS).
- The live publish path is untouched and still runs the S1-S6 pipeline via onPublishAction ->
  publishDescriptorWithPipeline (`AdminSvgEditorEditView.tsx:14-16` docstring, `:223`). No new
  persistence format was introduced — `sceneFromDescriptor.ts:6-10` states the scene is an
  authoring surface, not a persistence format.

---

## Verdict summary

| # | A4.0 bullet | Verdict |
|---|-------------|---------|
| 1 | Typed SvgSceneDocument is the editor authority | **PASS** |
| 2 | Adapter owns mount/destroy/events/viewport/serialization | **PASS** |
| 3 | Direct scene -> compiler, no hidden JSON textarea | **PARTIAL** — seam + serializer proven; live publish still runs off the separate form, scene serialize() not wired to publish |
| 4 | Deterministic IDs / ordering / precision / undo transactions | **PARTIAL** — IDs/ordering/precision PASS & tested; undo model exists & is wired but is **not covered by this evidence run** |
| 5 | Existing descriptor + compiler remain publish boundary | **PASS** |

**3 PASS · 2 PARTIAL · 0 NOT-YET** across the five A4.0 bullets.

---

## Test-integrity notes (per testing-handbook.md)

- Command, working dir, revision, exit code recorded above; raw stdout/stderr preserved verbatim
  in `test-output.txt`. No `--silent`, no reporter removed, no `|| true`.
- **0 skipped, 0 retries, 0 timeouts.** No console warnings/errors emitted by either file (the run
  log shows only the Vitest summary; no stderr diagnostics to classify).
- The DOM test guards on `typeof document === "undefined"` and would return early (a silent no-op
  that still counts as passed) if run outside a DOM env. This run used vitest.site.config.ts, which
  provides a DOM environment, so the assertions **did** execute (1 test, ~218 ms, real
  querySelectorAll counts asserted) — not a vacuous skip here. Flagged for honesty: in a non-DOM
  config this test would pass without asserting anything.
- The stress test asserts against the **real** compileSvgBlockV1, not a mock — the compile and
  checksum assertions are genuine.

## Beyond A4.0 (explicitly NOT delivered — do not read the PASSes as more than they are)

Per the card's `## Current residuals`: no full tool palette, no snapping/guides/grouping, no
rulers/minimap, no property inspector wired to the scene, no draft recovery / unsaved-exit guard,
no preview performance gate, and no keyboard/screen-reader or multi-viewport proof. The visual
canvas that exists (SvgStudioCanvas) offers add-rect/add-circle, reorder, hide/lock, undo/redo, and
zoom-to-fit only. A4.1-A4.6 remain open.
