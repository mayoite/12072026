# Phase 05 — Portal Public Render

Date: 2026-07-04
Status: Planned

## Objective
Server-render saved `BlockDescriptor` JSON via `@puckeditor/core`'s `<Puck.Render>` at `/portal/svg-catalog/[slug]`, surfacing an index at `/portal/svg-catalog`. Portal consumes the same `puckBlockRegistry.ts` that admin mounts and never forks the render shape — read-only preview, not an editor. SVG inline from `public/svg-catalog/`, PNG thumb via R2 CDN, Zod-validated descriptor at the boundary.

## Inputs to read
- `D:\new\plannnerplan\IMPLEMENTATION-DECISIONS.md` — `/portal/svg-catalog` route row, dual-output rule (SVG public + PNG R2)
- `D:\new\plannnerplan\QUALITY-GATES.md` — server-render evidence, a11y roles, performance budgets
- `D:\new\plannnerplan\FAILURESPLAN.md` — PLAN-FAIL-0404 ownership, deferral notes on Playwright host
- `D:\new\PACKAGES.md` — Puck + Ark UI install rationale
- `D:\new\plannnerplan\phases\02-catalog-source-of-truth-and-blockdescriptor.md` — schema + loader consumed
- `D:\new\plannnerplan\phases\03-svg-pipeline-implementation.md` — SVG/PNG outputs consumed
- `D:\new\plannnerplan\phases\04-admin-portal-svg-editor.md` — `puckBlockRegistry.ts` produced

## Scope
In scope: index + slug routes under `site/app/(site)/portal/svg-catalog/`, RSC server-render via `getPuckData(slug)` reading `site/block-descriptors/{slug}.json`, registry import alias shared with admin, OG/SEO metadata, 404 path, pillbar chrome, roving-focus + live-region a11y, server-render round-trip test, type-checked registry import lint.
Out of scope: Puck editor hydration (read-only portal), Supabase persistence (Phase 08), export/3D lazy (Phase 09), public member actions (Phase 06 reads the same descriptors at consumer side).

## Architecture
```mermaid
flowchart LR
    A[GET /portal/svg-catalog/[slug]] --> B[RSC: getPuckData(slug)]
    B --> C[svgBlockDescriptorLoader.tryLoad]
    C -->|invalid| D[Open3dDescriptorError.invalid → 404 page with NotFound component]
    C -->|valid| E[<Puck.Render config=puckBlockRegistry data=savedJson />]
    E --> F[SVG inline from /cdn/svg-catalog/{slug}.svg]
    E --> G[PNG thumb from /cdn/site-block-thumbs/{slug}.png]
    H[GET /portal/svg-catalog index] --> I[loadAll → slug cards grid]
```

Single registry import path: `features/planner/admin/puckBlockRegistry.ts` (canonical, declared by Phase 04) is re-exported via a one-line alias at `site/app/(site)/portal/svg-catalog/puckBlockRegistry.ts`. The portal alias re-exports verbatim — no forked copy and no `as any` casts in the alias file. Admin and portal always read the same file; portal never substitutes its own copy. Server components only; client islands limited to Puck's own runtime when needed. RSC fetch cache enabled at the route segment.

## Checklist
### Routes (05-PORT)
- 05-PORT-01 Route: `site/app/(site)/portal/svg-catalog/page.tsx` — index listing registered descriptors from `loadAll()`, card grid with thumbnail.
- 05-PORT-02 Route: `site/app/(site)/portal/svg-catalog/[slug]/page.tsx` — server-rendered single-block preview.
- 05-PORT-03 `getPuckData(slug)` reads `site/block-descriptors/{slug}.json` via `svgBlockDescriptorLoader.tryLoad`, returning `Result<puckData, Open3dDescriptorError>`.
- 05-PORT-04 Registry import: `puckBlockRegistry.ts` shared with Phase 04 (canonical path `features/planner/admin/puckBlockRegistry.ts`); portal alias at `site/app/(site)/portal/svg-catalog/puckBlockRegistry.ts` is one import line — no forked registry and no `as any` cast. (See IMPLEMENTATION-DECISIONS §\"Module paths\".)
- 05-PORT-05 `<Puck.Render config={registry} data={savedJson} />` mounts at the slug path; `mode="preview"` (no edit affordances).
- 05-PORT-06 Image optimization: PNG thumb via R2 CDN URL at `https://cdn.oando.co.in/site-block-thumbs/{slug}.png`, `next/image` with remote-pattern allowlist for the CDN host.
- 05-PORT-07 SVG inline served from `public/svg-catalog/{slug}.svg` — no second fetch, no re-render pipeline on portal mount.
- 05-PORT-08 Catalog metadata: 404 page when `slug` missing or descriptor invalid; 200 with `NotFound` component on `Open3dDescriptorError.notFound`.
- 05-PORT-09 `generateMetadata` per slug: title, description, OG image = same PNG thumb; `robots: { index: true, follow: true }`, draft flag always `false`.
- 05-PORT-10 Pillbar: registry version (`puckBlockRegistry.version`) + descriptor version (`schemaVersion`) chips visible above the render frame on every portal page.

### Accessibility (05-A11Y)
- 05-A11Y-01 Roving focus on the card grid: `Array<{key, focusSelector, label}>` typed; arrow-key navigation; home/end; first card auto-focuses on filter change (per benchmark binding #9).
- 05-A11Y-02 Live region `role="status" aria-live="polite"` for asset load / save-submit feedback; coalesces within a 250 ms window for filter changes (per benchmark binding #10).
- 05-A11Y-03 SVG element carries `role="img"` plus `aria-label` derived from descriptor `title` (Zod schema enforces non-empty); decorative-only leaves omit the role (per benchmark binding #5).

### Performance (05-PERF)
- 05-PERF-01 p95 page mount ≤ 800 ms on warm cache; RSC fetch cache keyed by `[slug, registry-version, schemaVersion]`; cache invalidation follows Phase 04 atomic rename.
- 05-PERF-02 Markup size no larger than 60 KB for any 3-block fixture preview; PNG thumbs (R2) budget ≤ 80 KB each.

### Tests (05-TEST)
- 05-TEST-01 Server-render round-trip: save a descriptor via Phase 04 → fetch `/portal/svg-catalog/{slug}` → assert `200` + `role="img"` + `<title>` text matches.
- 05-TEST-02 Block registry import type-checked: missing registry export at `puckBlockRegistry.ts` fails CI (`tsc --noEmit` over `site/app/(site)/portal/svg-catalog/`).
- 05-TEST-03 RSC caching regression: identical request within 60 s returns same bytes (`etag` parity); different `schemaVersion` returns fresh bytes.
- 05-TEST-04 404 + descriptor-invalid seats: each surfaces the `NotFound` component with apology copy that does not mention internal error types.

## Exit gate
- `/portal/svg-catalog` serves a card grid with thumb + slug + title; Playwright mock auth green.
- `/portal/svg-catalog/[slug]` server-renders a saved descriptor with `<Puck.Render>`; no client-side Puck editor hydration appears in the build output.
- 404 + invalid-descriptor paths confirmed; OG metadata renders correctly.
- Registry import alias is one line; `tsc --noEmit` fails the build if registry drift detected.
- Pillbar reads registry-version + descriptor version; chip text refreshed on rotation.
- Status flow: `Planned → Implemented` after routes + RSC render + a11y green; `Verified in staging` after save/preview round-trip via Phase 04 API; `Promoted` after Phase 07 wires no-edit rail guarantee; `Accepted` after Phase 06 planner consumer reads the same descriptor without typing regressions.

## Phase governance
### Forbidden actions
- Do NOT silently fork `<Puck.Render>` shape between admin and portal — single registry import alias is the contract; no `as any` cast in the alias file (`tsc --noEmit` CI gate).
- Do NOT hydrate client-side with the Puck editor in portal routes; portal is read-only `<Puck.Render>` only.
- Do NOT inline base64 PNG in any descriptor response — only the R2 CDN URL is permitted.
- Do NOT call `fabric.loadSVGFromString` here — descriptor-driven SVG is already produced by Phase 03; runtime SVG mounting is a Phase 06 / Phase 09 consumer concern.
- Do NOT serve `index.html` for missing slugs from inline error data — always respond 404.

### Phase entry checklist
- Phase 02 loader green; at least one fixture descriptor available.
- Phase 03 SVG/PNG outputs present; R2 path verified.
- Phase 04 `puckBlockRegistry.ts` exists and exports a typed registry.
- Phase 07 `withAuth` available (admin-only routes not used yet; just verification gate).

### Rollback criteria
- Server-render round-trip test fails twice consecutively → abort; reinstate direct registry import without alias.
- 404 returns 200 → abort and re-fix NotFound wiring before any other sub-step.
- `tsc --noEmit` quietly emits `any` cast in portal render → abort and ban `as any` in regex CI guard.

### Risk register
- Risk: Puck registry drift between admin and portal. Mitigation: single alias file; `tsc --noEmit` regression gate.
- Risk: RSC cache stale after Phase 04 atomic rename. Mitigation: cache key includes `schemaVersion`; cache purge path is owned by Phase 04's save action.
- Risk: OG image twice the size of inline SVG. Mitigation: R2 CDN URL only, never base64-embedded.
- Risk: Puck block returning non-server-safe call (e.g. `useEffect`). Mitigation: registry entries must be tagged `isServerSafe: true` at declaration; CI lint enforces.

### Success metrics
- Portal p95 mount ≤ 800 ms warm; first-byte ≤ 200 ms warm.
- Markup size ≤ 60 KB on 3-block fixture.
- A11y violations: 0 in axe-core scan on the rendered slug page.
- Lint guard fires on first attempt at a portal-only registry shape drift.

### Dependencies
- Phase 02 `svgBlockDescriptorLoader`, `BlockDescriptor` Zod schema.
- Phase 03 outputs in `public/svg-catalog/` + R2 PNG thumbs.
- Phase 04 `puckBlockRegistry.ts` + save action.
- Phase 07 `withAuth` middleware (read-only, but verified).

### Performance budgets
- p95 page mount ≤ 800 ms; first-byte ≤ 200 ms (warm).
- Markup ≤ 60 KB / 3-block fixture.
- RSC fetch cache expired at 60 s or on rotation signal.
- PNG thumb cap 80 KB per slug.

### Security considerations
- `/portal/*` is public; no write surfaces exposed. `<Puck.Render>` is preview-only — never bind `onPublish`.
- Catalog metadata never includes admin-only fields (no `createdBy`, no save secret).
- R2 PNG URL is allowlisted via `next/image` remote-pattern; no open proxy.
- Zod parse happens server-side at the slug boundary — invalid descriptors never reach the rendered DOM as raw HTML.

### Accessibility considerations
- Card grid respects roving-focus array; verification: tabindex + arrow-key parity.
- Live-region announces filter changes only; not flooded on initial load.
- SVG with `role="img"` + `aria-label`; `<title>` and `<desc>` already required by Phase 03 sanitization.

### Decision log
- 2026-07-04 — Decision: portal mounts `<Puck.Render mode="preview">`, never `<Puck>` editor. Reason: portal is read-only; Puck editor bundle ships in admin only. Alternatives: portal mounts full Puck with `editable={false}` — rejected (larger bundle, same risk surface). Owner: UI agent.
- 2026-07-04 — Decision: PNG thumbs served exclusively from R2 CDN. Reason: IMPLEMENTATION-DECISIONS dual-output rule; PNGs are CDN-cached imagery, not runtime-served. Alternatives: base64-embed in descriptor — rejected for size. Owner: UI agent.
- 2026-07-04 — Decision: cache key `[slug, registry-version, schemaVersion]`. Reason: registry or schema drift must invalidate, idle save does not. Alternatives: time-only TTL — rejected (stale renders). Owner: UI agent.
- 2026-07-04 — Decision: registry import alias is one line, not a parallel copy. Reason: drift between admin and portal registries is the single largest regression risk. Alternatives: separate registry namespaces — rejected (re-introduces the drift). Owner: UI agent.
