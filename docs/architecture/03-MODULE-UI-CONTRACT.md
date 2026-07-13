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

Detailed acceptance: `06-UI-BENCHMARK.md`.

## Site

- The first viewport states purpose and one primary action.
- Product loading, empty, unavailable, and degraded states are distinct.
- Site-to-Planner handoff preserves product and revision identity.
- Mobile layouts keep core workflows usable.

Detailed acceptance: `09-SITE-UI-BENCHMARK.md`.

## Admin

- Catalog status and current revision are always visible.
- SVG authoring is canvas-first.
- Draft version, database source, released revision, and artifact state are visible.
- Create, edit, preview, publish, retire, and restore are explicit actions.
- Draft and published states cannot be confused.
- Validation identifies the exact field or operation.
- Publication requires an intentional action.
- Conflict, authorization, storage, and transaction failures are distinct.

Detailed acceptance: `07-ADMIN-UI-BENCHMARK.md`.

## Security experience

- Unauthenticated, unauthorized, expired, stale, rate-limited, offline, and server failures are distinct.
- Recoverable failure preserves safe work and offers one next action.
- Messages reveal no protected detail.
- Recovery is keyboard and assistive-technology usable.

Detailed acceptance: `10-SECURITY-BENCHMARK.md`.

## Verification

UI acceptance requires a fresh browser run.

Unit tests alone cannot close UI work.
