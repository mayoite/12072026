# Interface contract

## Shared rules

- Semantic design tokens; same state vocabulary on every surface.
- Distinct loading, empty, error, offline, saving, and success states.
- No silent fallback or forced interaction to hide failure.
- Every action has a visible result; destructive actions need confirmation or recovery.
- WCAG 2.2 AA; keyboard completion without dragging; focus visible and unobscured.

## Surface rules

| Surface | Rules | Acceptance |
|---|---|---|
| **Planner** | Canvas dominant; clear tool/catalog/properties/view regions; panels follow selection without covering work; controls reachable at supported widths; one document and selection for 2D + 3D. Benchmark screenshots = density/workflow only — no copied assets or trade dress. | `06-UI-BENCHMARK.md` |
| **Site** | First viewport: purpose + one primary action; distinct loading/empty/unavailable/degraded; Site→Planner handoff keeps product + revision identity; mobile keeps core workflows usable. | `09-SITE-UI-BENCHMARK.md` |
| **Admin** | Catalog status + current revision always visible; canvas-first SVG authoring; draft version, DB source, released revision, artifact state visible; explicit create/edit/preview/publish/retire/restore; draft ≠ published; field-level validation; intentional publish; distinct conflict/auth/storage/transaction errors. **Live:** disk is publish authority until DB cutover — UI must not imply DB release when only disk wrote. | `07-ADMIN-UI-BENCHMARK.md` |
| **Security UX** | Distinct unauthenticated/unauthorized/expired/stale/rate-limited/offline/server errors; recoverable failure preserves safe work + one next action; no protected detail in messages; keyboard/AT recovery. | `10-SECURITY-BENCHMARK.md` |

## Verification

UI acceptance needs a fresh browser run. Unit tests alone cannot close UI work.
