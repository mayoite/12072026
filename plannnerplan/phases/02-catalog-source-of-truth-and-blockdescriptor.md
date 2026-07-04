# Phase 02 — Catalog Source of Truth + BlockDescriptor

Date: 2026-07-04
Status: Planned

## Objective
Codify the `BlockDescriptor` Zod schema as the single contract between admin (writes), portal (renders), and planner (consumes). Export snapshot-readonly types so every downstream reader shares the same shape, and ship a typed loader that surfaces `Open3dDescriptorError.invalid` on malformed input.

## Inputs to read
- `D:\new\plannnerplan\IMPLEMENTATION-DECISIONS.md` — admin → Zod → pipeline flow
- `D:\new\plannnerplan\QUALITY-GATES.md` — round-trip gate, 422 mapping (004-ERR-03), snapshot immutability
- `D:\new\plannnerplan\FAILURESPLAN.md` — PLAN-FAIL-0406 ownership, prior PLAN-FAIL-015/-017 resolution
- `D:\new\PACKAGES.md` — zod version + admin panel set
- `D:\new\plannnerplan\phases\01-engine-lock-and-workspace-bootstrap.md` — install context (zod present)
- `D:\new\CONTENTS.md` — `features/planner/open3d/catalog/svg/` location

## Schema anchoring (per BP-02 in plans/2026-07-04/benchmark.md)
- `@zod-schema: features/planner/open3d/catalog/svg/svgTypes.ts`
- The schema is the **single contract** consumed by Phase 03 generator, Phase 04 admin editor, and Phase 06 descriptor loader (no forks; traceability via XX-XXX-NN IDs).
- Cross-ref design spec + benchmark for single-source rule (avoids PLAN-FAIL-0406). Provisional per 2026-07-04 Global Standard.

## Scope
In scope: defining Zod `BlockDescriptor` schema, identity rules, geometry contract, mounting contract, theme-token-only cartography, snapshot immutability marker, scope-typed `Open3dDescriptorError` taxonomy, the `svgBlockDescriptorLoader` reader at `site/block-descriptors/`.

Out of scope: any Puck wiring (Phase 04), any Zod schema duplicated at admin or portal routes (single source rule), persistence-on-Supabase (Phase 08), PNG/SVG emission (Phase 03), planner-side consumer changes (Phase 06).

## Architecture
```mermaid
flowchart LR
    A[Admin /admin/svg-editor POST] -->|sends JSON| B[Zod BlockDescriptor.parse]
    B -->|valid| C[(site/block-descriptors/{slug}.{n}.json)]
    B -->|invalid| D[Open3dDescriptorError.invalid → 422]
    E[Portal /portal/svg-catalog/[slug]] -->|reads desc| C
    F[Planner svgBlockDescriptorLoader] -->|reads desc| C
    G[scripts/generate-svg.mjs Phase 03] -->|reads desc| C
    C --> H[snapshot immutability: schemaVersion + checksum]
```

Single source-of-truth file: `site/features/planner/open3d/catalog/svg/svgTypes.ts`. The schema is re-exported by `svgBlockDescriptorLoader.ts` and consumed (read-only) by every other module — no parallel type definitions anywhere in `site/features/`.

## Checklist
### Schema (02-CAT)
- 02-CAT-01 `zod.BlockDescriptor` exported from `features/planner/open3d/catalog/svg/svgTypes.ts`; no nested re-exports from `open3d-floorplan/`.
- 02-CAT-02 Three variant tags: `fixed | configurable | parametric` (discriminated union, exhaustive).
- 02-CAT-03 Geometry contract: `widthMm`, `depthMm`, `heightMm`, `seatHeightMm?`, `weightKg?`, all `number().positive()`; `viewBox` is `{x, y, width, height}` finite.
- 02-CAT-04 Identity: `id` (uuid v4 string), `slug` (kebab reserved), `sku?`, `parentProductId?`, `sourceProvenance` (string union: `donor | native | migrated`).
- 02-CAT-05 Mounting contract: enum `floor | wall | ceiling | floating` per benchmark binding #12; `mountingPoints?: Array<{plane: MountPlane, offsetMm: Vec2}>` for parametric.
- 02-CAT-06 Roving focus arrays typed (`Array<{key: string, focusSelector: string, label: string}>`); live-announcement categories typed as `enum` (`status | error | success | polish`).
- 02-CAT-07 Cartography: `themeTokens` is a record of `string` keys mapping to `string` values drawn from `currentColor` or named semantic CSS variables (`--color-*`, `--space-*`, `--radius-*`); reject any `#[0-9a-fA-F]{3,8}` literal at parse step.
- 02-CAT-08 ID generation deterministic: `generatedAt` is set ONCE at first write (epoch seconds) and FROZEN inside the descriptor on every subsequent read/write; `createdBy` injected from session (Phase 07 owns session); `schemaVersion` is a literal pinned at the schema site. The parser rejects any attempt to overwrite an existing `generatedAt`.
- 02-CAT-09 Snapshot immutability: `BlockDescriptorSnapshot.parse(input)` applies a SHA-256 content hash and rejects any input whose declared `checksum` does not match the recomputed value (defends against mutated fields).
- 02-CAT-10 `svgBlockDescriptorLoader.ts` reads `site/block-descriptors/*.json` synchronously at module init, registers in a `Map<slug, descriptor>`; missing file is `Open3dDescriptorError.notFound` (distinct from `.invalid`).
- 02-CAT-11 Parser entry points (annex to §02-CAT-08): `parseFresh(input) → descriptor` writes `generatedAt` at first write (epoch seconds, once) and sets a deterministic ID; `parseExisting(input) → descriptor` verifies `generatedAt` is unchanged against the previously persisted value, and if a re-write attempts to mutate it, surfaces `Open3dDescriptorError.hashMismatch` (matching §02-ERR-03) — refusing the parse, not silently overwriting.

### Error taxonomy (02-ERR)
- 02-ERR-01 `Open3dDescriptorError` is a discriminated union: `.invalid`, `.notFound`, `.versionMismatch`, `.hashMismatch` — each carries a field-path string and machine-readable code.
- 02-ERR-02 `.invalid` maps to HTTP `422.invalid` and `.versionMismatch` maps to HTTP `422.version_mismatch`; field-path is the Zod issue path joined by `.`. Phase 02 owns the full `code → HTTP-shape` map for the four discriminated variants (including `.notFound → 404.not_found` at §02-ERR-06); Phase 08 §08-PERS-10 acts as a citation, not the source of truth.
- 02-ERR-03 `.hashMismatch` at read-time maps to HTTP `409.hash_mismatch`; it is a fatal corruption signal that refuses to load and never silently over-write.
- 02-ERR-04 Error mapper unit-tested for every code → HTTP-shape result (Phase 02 owns the tests, Phase 04 re-uses the mapper via API). The mapper preserves the sticky error-code suffix so the client can distinguish retry semantics: `409.hash_mismatch` vs `409.lock_busy` (Phase 08 citation) vs `409.save_conflict` (Phase 07 citation); the `422.invalid` and `422.version_mismatch` pair is distinguished from the two `409.*` codes by the family prefix alone.
- 02-ERR-05 `.versionMismatch` maps to HTTP `422.version_mismatch`; field-path is the descriptor `schemaVersion` field; client distinguishes retry semantics vs `.invalid` by the sticky code suffix (`.versionMismatch` is not retriable as-is — the schema site must be re-pinned first).
- 02-ERR-06 `.notFound` maps to HTTP `404.not_found`; field-path is the requested descriptor `slug`; Phase 02's loader surfaces this distinct from `.invalid` so missing-file and malformed-file never collapse to a single retry path.

### Tests (02-TEST)
- 02-TEST-01 Zod round-trip: `parse → strip → re-parse` returns identical object (structural equality, identity accepted for minted id only if `idempotent: true`).
- 02-TEST-02 Snapshot irregularity: malformed JSON, missing required field, theme-token containing `#hex` literal, mismatched checksum — each surfaces the correct variant in tests.
  - Post-write-mutate reject path (annex to §02-CAT-11): `parseExisting(input)` invoked with a re-write payload that mutates a previously frozen `generatedAt` surfaces `Open3dDescriptorError.hashMismatch` (matching §02-ERR-03); the parse result is refused, not silently overwritten, and the test fails if the parser accepts the mutated payload.
- 02-TEST-03 Schema grep: `grep -RE "z\.object|z\.discriminatedunion" site/features/planner/open3d/catalog/svg/svgTypes.ts` returns the canonical definitions only.
- 02-TEST-04 Variant exhaustiveness: `Variant` exhaustive switch in test file; adding a new variant fails compile on the test side.

### Loader (02-LOAD)
- 02-LOAD-01 Loader entry point: `features/planner/open3d/catalog/svg/svgBlockDescriptorLoader.ts` exports `loadAll`, `loadBySlug`, `tryLoad` (`Result<descriptor, Open3dDescriptorError>`).
- 02-LOAD-02 Loader directory pinned to `site/block-descriptors/`; traversal rejection enforced (no `..`); file extension whitelist `.json` only.
- 02-LOAD-03 Loader is fully typed; no `any`, no `@ts-ignore`, no `unknown` cast outside `tryLoad` boundary.

## Exit gate
- Schema compiles; `vite build` of `oando-site` succeeds.
- Round-trip test (02-TEST-01) green across all three variants.
- Snapshot irregularity tests (02-TEST-02) green; the four variants of `Open3dDescriptorError` map to the correct HTTP shape.
- Single grep verifies only one schema source-of-truth file.
- Loader reads `site/block-descriptors/_fixtures/chaise.json` cleanly (Phase 03 fixture provides the file).
- Status moves: `Planned → Implemented` after schema + loader + tests green; `Verified in staging` after Phase 03 first pipeline run reads from the loader; `Accepted` after Phase 06 planner consumer reads without typing regressions.

## Phase governance
### Forbidden actions
- Do NOT maintain duplicate Zod schemas at admin or portal routes — single source rule.
- Do NOT re-export from `open3d-floorplan/` directly under any path.
- Do NOT accept `#hex` literal theme tokens; theme cartography is semantic variable references only.
- Do NOT allow `any` or `@ts-ignore` in `svgTypes.ts` or downstream readers.
- Do NOT silently accept a hash mismatch; surface `.hashMismatch` and refuse to load.

### Phase entry checklist
- Schema file path approved (default: `features/planner/open3d/catalog/svg/svgTypes.ts`).
- `zod` installed (Phase 01).
- `_fixtures/` directory prepared; the three Phase 03 fixtures already ship JSON shells.
- IMPLEMENTATION-DECISIONS variants list confirmed.

### Rollback criteria
- Round-trip test fails after schema revision → abort revision; restore previous schema file from lock.
- Hash immutability bypass lands in PR (silent over-write) → abort and re-plan.
- Loader type signature evolves compatibly with `tryLoad` boundary → acceptable; evolution to wide-typed output is not.

### Risk register
- Risk: Zod minor-version drift breaking `discriminatedUnion` typing. Mitigation: pin `zod` to a fixed minor in `package.json` once install lands.
- Risk: Loader init-on-import blocking cold start on large descriptor sets. Mitigation: lazy `loadAll` behind a getter; first-paint only loads the slugs the planner consumes.
- Risk: Theme hardcoded hex sneaking in via upstream donor blocks. Mitigation: regex in `BlockDescriptor` refines `themeTokens` to `regex(/^(currentColor$|--[a-z0-9-]+$)/i)`.

### Success metrics
- Round-trip parse: p95 ≤ 5 ms for one descriptor; ≤ 80 ms for 100.
- Loader cold read of 100 descriptors: p95 ≤ 60 ms.
- 422 mapping works on first error hit (no second hop).

### Dependencies
- `zod` package (Tier-1 installed in Phase 01).
- Phase 03 fixture JSONs (co-start, schema pre-written before pipeline reads them).

### Performance budgets
- Schema parse: ≤ 1 ms per descriptor.
- File count hard cap: 1,000 descriptors before switching to partitioned subdirectories (Phase 08).

### Security considerations
- Loader rejects path traversal (`..`, absolute paths).
- Hash immutability prevents post-write tampering.
- No JS-execution path on `themeTokens` values — strings only.

### Accessibility considerations
- Roving focus arrays and live-announcement categories are typed so consumers cannot silently drop ARIA semantics.
- Mounting contract exposes a stable shape for assistive-tech descriptions ("chair — floor-mounted — 480 mm seat height").

### Decision log
- 2026-07-04 — Decision: place schema at `features/planner/open3d/catalog/svg/svgTypes.ts`. Reason: importer will reference it from admin, portal, and planner paths; co-locating with the SVG symbol library (canonical per IMPLEMENTATION-DECIONS state ownership) keeps the import relative. Alternatives: `lib/` or `types/` top-level — rejected to avoid pulling downstream readers into a new abstraction layer. Owner: Catalog agent.
- 2026-07-04 — Decision: snapshot immutability via SHA-256 checksum comparison. Reason: a `Mutated Field` failure mode existed in PLAN-FAIL-015 history; checksum catches silent over-writes the lockfile cannot. Alternatives: append-only audit log only — rejected as insufficient (audit log ≠ read-time validation). Owner: Catalog agent.
- 2026-07-04 — Decision: install `@vercel-labs/json-render` references in admin only; AI block-descriptor payloads must still pass Zod. Reason: Tier-3 reserved; never let AI produce descriptors that bypass validation. Alternatives: accept any JSON from AI — rejected. Owner: Catalog agent (recommendation; UI agent owns the wire-up in Phase 04).
- 2026-07-04 — Decision: `generatedAt` is frozen at first write. Reason: idempotent re-save (Phase 08 §08-PERS-05) requires byte-identical output for identical descriptors; a parse-time timestamp would violate that. Alternatives: keep timestamp but add a separate `firstGeneratedAt` — rejected as it introduces a second field for the same fact. Owner: Catalog agent.
