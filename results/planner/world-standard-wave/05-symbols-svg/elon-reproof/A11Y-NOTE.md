# P05 A11Y note — Block2D symbols are canvas pixels (not SR content)

| Field | Value |
|--------|--------|
| **Phase** | P05 / CP-05 (W2 plan symbols) |
| **Date** | 2026-07-09 |
| **URL (live)** | `http://localhost:3000/planner/guest/` |
| **Title** | Planner Workspace \| One&Only |
| **Product change** | **None** — no Critical chrome a11y issue found on this pass |
| **Verdict (W2 symbols)** | **Confirmed:** plan symbols are **not** screen-reader-exposed as discrete nodes |

## Method

1. chrome-devtools MCP: page already on guest planner; `take_snapshot` (a11y tree).
2. `evaluate_script`: canvas DOM probe (count, `aria-label`, fallback text, media in tree).
3. `list_console_messages` `types: ["issue"]` (+ errors) for Critical chrome flags.
4. Code cross-check: `FeasibilityCanvas` → `furnitureBlock2DFromItem` → `renderBlock2DCentered` (Canvas2D).

### Artifacts this note

| File | Meaning |
|------|---------|
| `A11Y-NOTE.md` | This note |
| `a11y-snapshot-live.txt` | Compact a11y tree from live guest planner |

## Confirmation: symbols are not SR-exposed

### Live accessibility tree

Under `region "Drawing canvas"` the tree exposes **one** canvas control only:

```text
region "Drawing canvas"
  Canvas "Floor plan drawing surface"
    description="Tool: wall. Snap: none. Walls: 4."
    keyshortcuts="V W D T H Tab Escape Control+Z Control+Shift+Z Control+Y 0 + -"
    StaticText "Floor plan for Untitled plan, with 4 walls."
  generic live="polite" … (tool / snap / wall counts)
```

**Not present in the a11y tree as children of the plan surface:**

- No per-furniture / per-cabinet roles
- No `role="img"` plan marks
- No SVG/path nodes for Block2D prims on the plan
- No name/description listing placed SKUs on the canvas

Catalog chrome (e.g. “Add Modular Cabinet to canvas”) is **inventory UI**, not plan-geometry exposure.

### Live DOM probe (same session)

| Check | Result |
|--------|--------|
| `<canvas>` count | **1** |
| `aria-label` | `Floor plan drawing surface` |
| Canvas element children | **0** (fallback text only as text nodes) |
| Canvas fallback text | `Floor plan for Untitled plan, with 4 walls.` — walls only; **no furniture names** |
| Status strip (aggregate) | Body text includes **`4 furniture`** / **`4 walls`** — counts, not geometry |

Session state had furniture on the plan (status **4 furniture**) while the a11y tree still exposed only the single named canvas + wall-oriented fallback. That is the W2 honesty proof: **symbols can be painted and still not exist as SR nodes.**

### Code path (authoritative)

`site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`:

- Furniture layer: `furnitureBlock2DFromItem(item)` then `renderBlock2DCentered(context, block, …)` on a **2D canvas context**.
- Comment in source: procedural Block2D → canvas; not external GLB/SVG downloads for plan marks.
- Canvas chrome: `aria-label="Floor plan drawing surface"` + live status (`canvas-status-embedded` / `canvas-status`) for tool/snap/wall summary — **not** a vector inventory of symbols.

Published SVG (`compileSvgForPublish` / `svg-catalog`) is a **separate authority** (see `05-symbols-svg/04-svg-honesty/NOTES.md`). It does **not** drive FeasibilityCanvas plan paint today.

## Residual (honest, out of scope for W2 symbols)

| Residual | Severity for P05/W2 | Notes |
|----------|---------------------|--------|
| **Plan geometry is not vector SR content** | **Accepted residual** | Canvas bitmap path cannot expose walls/openings/furniture as navigable, named objects the way SVG DOM or a structured scene graph could. |
| Per-item place/select announced only via aggregate chrome / properties | Out of scope W2 | W2 bar is **readable 2D symbols** (visual Block2D quality), not SR-readable floor plan. |
| Full planner chrome a11y (landmarks, labels, etc.) | **Not re-litigated here** | Prior: `results/planner/a11y-open3d/`, `ayushdocs/06-A11Y-OPEN3D.md`, quality/elon a11y reports. This note is **symbol exposure only**. |

**W2 / P05 scope honesty:** claiming “accessible plan symbols” would be false. Claiming “Block2D symbols are canvas pixels and therefore not SR-exposed as vector content” is **true** and matches the product architecture.

## Chrome issues while on page

| Source | Result |
|--------|--------|
| DevTools a11y `issue` messages | **None** in this capture |
| Console `error` (preserved) | Resource **404** (not a Critical a11y chrome defect) |

**No product code change** — task rule: change only if Critical chrome issue while on page.

## Bottom line

1. **Confirmed:** Block2D plan symbols are **canvas pixels** drawn via Canvas2D; they are **not** discrete screen-reader nodes.
2. **Residual:** The canvas plan is **not** accessible as vector SR content — honest **out of scope** for W2 symbol quality (P05).
3. **Path:** `results/planner/world-standard-wave/05-symbols-svg/elon-reproof/A11Y-NOTE.md`
4. **No ship change** from this pass.
