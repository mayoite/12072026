# Phase 03 — SVG Pipeline Implementation

Date: 2026-07-04
Status: Planned

## Objective
Ship `scripts/generate-svg.mjs` that turns a Zod-validated `BlockDescriptor` (Phase 02) into a canonical SVG string (runtime-served from `public/svg-catalog/`) and a PNG thumbnail (cached on R2). The pipeline is idempotent — same input yields byte-identical SVG and a content-addressed PNG URL.

## Inputs to read
- `D:\new\plannnerplan\IMPLEMENTATION-DECISIONS.md` — Option A pipeline, dual-output rule (SVG → public, PNG → R2)
- `D:\new\plannnerplan\QUALITY-GATES.md` — golden fixtures, sanitization, performance budgets
- `D:\new\plannnerplan\FAILURESPLAN.md` — PLAN-FAIL-0402 ownership, PLAN-FAIL-018 fixture requirement
- `D:\new\PACKAGES.md` — Option A pin rationale and skip rationale
- `D:\new\plannnerplan\phases\02-catalog-source-of-truth-and-blockdescriptor.md` — descriptor shape consumed
- `D:\new\plannnerplan\phases\04-admin-portal-svg-editor.md` — API contract that triggers the script

## Scope
In scope: `site/scripts/generate-svg.mjs`, six pipeline steps, three fixture blocks (union / difference / intersection themes), R2 PNG upload via existing `catalog_snapshot_upload_r2.ts` helper, sanitization pass on output, golden SVG/PNG assertions, deterministic environment for fixtures.

Out of scope: `fabric.loadSVGFromString` runtime calls (this phase produces SVG strings; runtime mounting is a later consumer concern), Mantine helpers, second export symbol system, PNG thumbs written to `public/svg-catalog/`.

## Architecture
```mermaid
flowchart LR
    A[BlockDescriptor JSON] --> B[Step 1 @flatten-js/core: measure]
    B --> C[Step 2 polygon-clipping: Martinez booleans union/difference/intersection]
    C --> D[Step 3 assemble d= paths; validate viewBox stable]
    D --> E[Step 4 svgo: optimize paths]
    E --> F[Step 5 write public/svg-catalog/{slug}.svg idempotent]
    F --> G[Step 6 @resvg/resvg-js: render PNG thumb]
    G --> H[Step 7 catalog_snapshot_upload_r2.ts → R2 <bucket per IMPLEMENTATION-DECISIONS.md>/{slug}.png]
    H --> I[Returns svg:string, thumbBuffer:Buffer, dimensions:{w,h}]
}

The script exposes a module API `runPipeline(descriptor)`. No DOM, no Fabric runtime, no `fabric.loadSVGFromString`. Fabric consumption is the runtime's responsibility in Phase 05 / Phase 06 wiring.

## Checklist
### Script (03-SVG)
- 03-SVG-01 Script file: `site/scripts/generate-svg.mjs` (ESM; Node 20 LTS declared in script shebang).
- 03-SVG-02 Step 1 — `@flatten-js/core`: compute perimeter, closest-point, segment length, bbox; passed-through input shape matches descriptor `viewBox`.
- 03-SVG-03 Step 2 — `polygon-clipping`: union, difference, intersection selectable by descriptor `variant` tag; Martinez algorithm.
- 03-SVG-04 Step 3 — assemble `d=` paths deterministically (no `Date.now()`, no `Math.random()`); stable viewBox assertion `{x, y, width, height}` finite and equal to descriptor.
- 03-SVG-05 Step 4 — `svgo` runs (preset-safe): no ID rewriting, no class removals that observers depend on, no `<style>` swallowing.
- 03-SVG-06 Step 5 — write `public/svg-catalog/{slug}.svg` idempotent (content-addressed; same input → same bytes).
- 03-SVG-07 Step 6 — `@resvg/resvg-js` render PNG thumb; `width × height × DPI` matches viewBox aspect invariant.
- 03-SVG-08 Step 7 — PNG thumb uploaded via existing `catalog_snapshot_upload_r2.ts` helper into the bucket designated by `IMPLEMENTATION-DECISIONS.md` (see Decisions §Owner-approved authorities); NOT written to `public/svg-catalog/`.
- 03-SVG-09 Module exports `runPipeline(descriptor) → { svg: string, thumbBuffer: Buffer, dimensions: { width: number, height: number } }`.

### Fixtures (03-FIX)
- 03-FIX-01 Three fixture blocks: `_fixtures/chaise.json` (union theme), `_fixtures/side-table.json` (difference theme), `_fixtures/sectional.json` (intersection theme).
- 03-FIX-02 Golden SVG string assertion per fixture: byte diff ≤ 0.1% (floating point formatting tolerance); commit fixture under `scripts/generate-svg/__goldens__`; tolerance is not relaxed by explicit-gate promotion (see §03-VERI-02).
- 03-FIX-03 PNG dimension assertion: `width / height` equals viewBox `width / height`; rendered size commits.
- 03-FIX-04 Theme-token assertion: each fixture SVG contains at least one occurrence of `currentColor`.
- 03-FIX-05 Missing-asset fallback fixture: descriptor circle missing geometry emits cross-hatched fallback path (per benchmark binding #8), distinct exit code 8.

### Sanitization (03-SAN)
- 03-SAN-01 Output sanitization strips: `<script>`, inline event handlers (`on*`), `<foreignObject>`, `<image href="javascript:...">`, external `<use href="https://...">` allowed-list only, oversized attributes > 4 KB rejected.
- 03-SAN-02 Malformed SVG input → pipeline exits with `Open3dPipelineError.malformedSvg` (Phase 02 error taxonomy reused).
- 03-SAN-03 Sanitization unit-tested in 12 negative cases (script / handler / foreignObject / oversized / XLink etc.).

### Performance (03-PERF)
- 03-PERF-01 p95 ≤ 200 ms for 3-block fixture; 100 blocks ≤ 1 s on a 4-core 3 GHz reference.
- 03-PERF-02 PNG render thread memory peak ≤ 200 MB for 4096×4096 viewBox (cap at 2048 as guard).
- 03-PERF-03 svgo preset declarative; benchmark once and freeze in `scripts/generate-svg/svgo.config.cjs` — no runtime parameter drift.

### Verification (03-VERI)
- 03-VERI-01 Pipeline runs against all three fixtures end-to-end with `pnpm run scripts:generate-svg -- --fixture chaise` exit code 0.
- 03-VERI-02 Golden diff ≤ 0.1% per fixture is the single exit-gate assertion; explicit-gate promotion is a separate operational step that does not relax the 0.1% cap.
- 03-VERI-03 R2 upload idempotency: second run with same fixture yields the same CDN URL.

## Exit gate
- `runPipeline` executes cleanly for chaise / side-table / sectional fixtures.
- Golden SVG byte diff ≤ 0.1% for all three.
- PNG dimensions aspect-correct, theme-token present.
- Sanitization tests pass on all 12 negative cases.
- R2 round-trip returns the same URL on re-run (content-addressed).
- p95 ≤ 200 ms for 3-block fixture verified locally; 100-block run ≤ 1 s.
- Status flow: `Planned → Implemented` after pipeline + fixtures green; `Verified in staging` after admin (Phase 04) invokes the script through `/api/admin/svg-editor`; `Accepted` after portal (Phase 05) reads the SVGs and reports zero hot-swap fallbacks.

## Phase governance
### Forbidden actions
- Do NOT call `fabric.loadSVGFromString` in this script (runtime responsibility). Touch Fabric only to read the existing canvas instance at admin-time wiring in Phase 04.
- Do NOT write PNG thumbs to `public/svg-catalog/`; PNGs go to R2 (bucket per `IMPLEMENTATION-DECISIONS.md`).
- Do NOT introduce a second export-only symbol system; the descriptor is the source of truth.
- Do NOT randomize SVG output; vg output must be deterministic for golden fixture equality.
- Do NOT skip sanitization steps; PNG/SVG output is user-facing and CDN-served.

### Phase entry checklist
- `@flatten-js/core`, `polygon-clipping`, `svgo`, `@resvg/resvg-js` installed (Phase 01).
- `catalog_snapshot_upload_r2.ts` helper already exists in repo.
- Phase 02 schema ships at least one valid fixture descriptor.
- `pnpm` script `scripts:generate-svg` registered in `site/package.json`.

### Rollback criteria
- Golden diff > 0.1% on a non-explicit gate run → abort promotion; revert script change and inspect.
- Sanitization regression (script-tag slipping through) → abort and ship hotfix before any further pipeline run.
- R2 URL drift on idempotent run → blob storage regression; freeze pipeline until bucket write semantics re-verified.

### Risk register
- Risk: svgo preset drift causing golden diffs. Mitigation: freeze preset at install; require explicit gate to bump svgo.
- Risk: polygon-clipping numerical instability on near-degenerate inputs. Mitigation: fixtures include collapse-near-zero cases; tolerance is ≤ 0.1%.
- Risk: R2 upload lock contention on concurrent saves. Mitigation: content addressing de-dupes; concurrent same-content writes idempotent.

### Success metrics
- 3-block p95 ≤ 200 ms; 100-block p95 ≤ 1 s.
- Golden drift: 0%.
- Sanitization negative-case pass rate: 100% (12/12).
- PNG aspect invariant: 100%.

### Dependencies
- `@flatten-js/core`, `polygon-clipping`, `svgo`, `@resvg/resvg-js` (Phase 01).
- `catalog_snapshot_upload_r2.ts` (existing helper, must be verified).
- Phase 02 fixtures (`_fixtures/*.json`).

### Performance budgets
- p95 ≤ 200 ms / 3-block.
- 100-block ≤ 1 s.
- Memory ceiling: 200 MB for largest viewBox 2048×2048.
- `@resvg/resvg-js` thread count fixed at 2 per invocation to avoid contention.

### Security considerations
- SVG sanitization gates script, event handlers, foreignObject, javascript: hrefs.
- R2 bucket name is the one locked in `IMPLEMENTATION-DECISIONS.md` (no path traversal via slug).
- SLUG → path: kebab-case regex enforced; reject any descriptor whose slug doesn't match `^[a-z][a-z0-9-]{1,63}$`.

### Accessibility considerations
- SVG output embeds `<title>` and `<desc>` derived from descriptor fields with sanitization rules.
- Theme-token contract (`currentColor` and semantic CSS variables) preserves user-controlled contrast modes — no hardcoded hex.
- R2 CDN URL preserves cache headers; Phase 06 and Phase 09 inherit.

### Decision log
- 2026-07-04 — Decision: Option A pipeline locked. Reason: PACKAGES.md skip-rationale review rejects paper.js / svg.js / svg-path-commander; Martinez is the only sound public-domain boolean algorithm; `@resvg/resvg-js` avoids Chromium in build scripts. Alternatives: Option B (Playwright + Chromium for PNGs) — rejected due to speed and runtime cost; reserved for explicit permission case. Owner: SVG agent.
- 2026-07-04 — Decision: PNG thumbs on R2 only, not `public/svg-catalog/`. Reason: IMPLEMENTATION-DECISIONS dual-output rule; CDN-cached imagery separation from runtime-served small SVG. Alternatives: co-locate under `public/` — rejected to avoid runtime diff churn. Owner: SVG agent.
- 2026-07-04 — Decision: golden diff tolerance 0.1% per fixture. Reason: floating-point formatting variation across OS locales must not break CI yet must catch real regressions. Alternatives: 0% (exact match) — rejected as flaky; 1% — rejected as masking. Owner: SVG agent.
- 2026-07-04 — Decision: phase files cite bucket ownership by file (`IMPLEMENTATION-DECISIONS.md`) rather than the bucket literal. Reason: §00-PRE-03 consolidation; avoid drift across phases. Alternatives: embed bucket literal in every phase — rejected (re-introduces scattered authority). Owner: SVG agent.
