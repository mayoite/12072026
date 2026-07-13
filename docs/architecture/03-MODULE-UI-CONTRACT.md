# Interface contract

## Shared rules

- Use semantic design tokens.
- Use the same state vocabulary across surfaces.
- Show loading, empty, error, offline, saving, and success distinctly.
- Never hide a failure behind forced interaction or silent fallback.
- Every action needs a visible result.
- Destructive actions need recovery or confirmation.
- Meet WCAG 2.2 AA.
- Support keyboard completion without dragging.
- Keep focus visible and unobscured.

## Planner

- The canvas is the dominant surface.
- Tools, catalog, properties, and view controls have clear regions.
- Contextual panels follow selection.
- Panels must not cover essential work.
- Essential controls remain reachable at supported widths.
- 2D and 3D use one document and one selection model.

Reference screenshots set density and workflow benchmarks only.

Do not copy their assets or trade dress.

## Admin

- Catalog status and current revision are always visible.
- Create, edit, preview, publish, retire, and restore are explicit actions.
- Draft and published states cannot be confused.
- Validation identifies the exact field or operation.
- Publication requires an intentional action.

## Verification

UI acceptance requires a fresh browser run.

Unit tests alone cannot close UI work.
