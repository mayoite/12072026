# Mandatory Quality Gates

Authority: every slice in `plan-foundation.md`, `plan-delivery.md`, and `plan-closeout.md` must satisfy the applicable gates below. A checklist item is not complete without preserved evidence. Skipped, blocked, flaky, warning-producing, or artifact-missing checks are NOT passes.

## Gate applicability

| Phase | Required local acceptance | Deferred cumulative gates |
|---|---|---|
| 01 | Engine locks enforced; Fabric 7.4.0 + Three.js r185+r3f verified | All implementation/UI gates |
| 02 | Catalog domain + Zod BlockDescriptor survived round-trip | Final inventory UI |
| 03 | Generate-svg script + 3 fixture blocks (union/difference/intersection) | Docking/final visuals in 06 |
| 04 | Admin editor mounts Puck; descriptors validate via Zod | Browser soak, full a11y |
| 05 | Portal Puck.Render renders 3 saved blocks server-side | Lazy 3D, export |
| 06 | Planner svgBlockDescriptorLoader wired; search parity | Final panel chrome |
| 07 | withAuth admin gate; permission matrix enforced | Member persistence UX |
| 08 | JSON-on-disk descriptor persistence + atomic rename | Supabase migration |
| 09 | Lazy 3D + SVG/PNG/PDF/DXF export round-trips | json-render activation |
| 10 | Route swap behind flag; rollback drill evidence | Soak + cleanup |

Deferred means NOT passed. Earlier phases may reach `Implemented`; release dependencies require Verified/Promoted/Accepted.

## Mandatory source-quality gate

- All visual tokens resolve from `site/app/css/` semantic tokens. No parallel theme system.
- Zero explicit `any` in handwritten converted-planner code.
- Zero `@ts-ignore`, `@ts-nocheck`, ESLint-disable, coverage-ignore, skipped-test, only-test, or equivalent bypass in converted-planner code/tests.
- Coverage target 95% statements/branches/functions/lines globally and per handwritten production file. Hard floor 90%. 90–94.99% passes floor but is target-incomplete.
- Coverage excludes generated/vendor/build/result trees only per repository handbook.
- Missing console/report artifacts make coverage incomplete even when percentages are green.

## Test layers

### Unit and property tests
- Unit conversion, geometry, state actions, undo/redo, parsing, validation, identity, SVG generation, BlockDescriptor Zod.
- Boundary/invalid/corrupt/empty/oversized/negative/precision/future-version inputs.
- Deterministic IDs/time where snapshots are asserted.

### Integration and contract tests
- Generator round-trip: Zod descriptor → scripts/generate-svg.mjs → SVG string + PNG bytes → loader.
- Guest/member/admin authorization matrix.
- Block descriptor persistence round-trip (read-then-equal).
- Admin-descriptor 422 mapping (004-ERR-03 in Phase 04).

### UI interaction tests (deferred to Phase 05/06)
- Puck editor — drag, drop, save, load, undock, recolor, escape, cancel.
- Portal Puck.Render — mount + reveal + accessibility roles.
- Planner consumer — symbol hot-swap, fallback when descriptor absent.

### Drawing-tool tests (deferred to Phase 06)
- Wall draw, close, cancel, endpoint drag, snap, pan, zoom.
- Door/window placement along walls, type/size changes.
- Furniture click-place / drag-place / undo parity.

### Visual regression tests (deferred to Phase 06/09)
- Empty, simple, complex, loading, error, missing-asset, selected, dragging, modal, 2D, 3D.
- Desktop 1440×900, 1920×1080; tablet 1024×768; small 390×844.

### Design benchmark gate
- Dated benchmark exists for design-affecting slices.
- Five+ relevant leading products compared across required dimensions.
- Observed facts and recommendations separated.
- Primary-agent acceptance/rejection decisions recorded.
- Binding design brief exists before implementation.
- Donor visual patterns retained need explicit justification.

### Global Standard Gate (Binding)
- Fresh dated benchmark report exists (per design-benchmark-protocol.md and 2026-07-04 benchmark report).
- Independent UI review (per REVIEW-WORKFLOW) signed off on global standard + UI/UX/SVG/features/packages compliance.
- Anti-copy + pattern attestation in Decision Log (cite specific principles from benchmark report).
- Applies to Phases 03, 04, 05, 06, 10 and any package/SVG/feature/UI changes.
- "Implemented" only after gate; "Verified" requires live site validation.
- Enforced GS benchmark gate (0415): release gate + phase exits must check the three prerequisites above for UI-affecting work; no bypass.
- Cross-refs: implementation-decisions.md §Global Standard Framework, UI/UX Standards, SVG/Features/Packages Mandates.
- Provisional pending live site validation after tests and site up (design §16).

**Note (GS 0415/0416/0419/0420):** Review per `review-workflow.md`. Features per `plan-delivery.md`. Packages per I-D + `PACKAGES.md`. Track in root `Failures.md`.

**Critique merge note (2026-07-04)**: Incorporated from critique:
- Error taxonomy gates now require sticky suffixes for 409 (hashMismatch, lockBusy, saveConflict) and 422 for versionMismatch (not 404).
- Forbidden actions strengthened per phase omissions list (e.g., no shell:true in Phase 04, no base64 PNG inline in Phase 05).
- Status vocab hygiene enforced (no "Removed-task" labels).
- Phase 10 residue (STAGING_PHASE_01A_RESIDUE) excised.
- Service key leak in Phase 07: use regex pattern, not single env var.
See `plan-delivery.md` and root `Failures.md` for details.

### Accessibility tests
- Keyboard reachability for every command.
- Names/roles/states/relationships/modal focus correct.
- Escape behavior consistent. No trap except intentional modal.
- WCAG AA contrast.
- Live-region announcements restrained; coalesce windows.

### Performance and stability tests (provisional budgets)
- SVG pipeline: p95 ≤ 200 ms for 3-block fixture; 100 blocks ≤ 1s.
- Inventory search/filter: p95 ≤ 100ms at 1,000 records; ≤ 200ms at 10,000.
- 3D code/renderer absent from default 2D load.
- No sustained heap growth after 20 panel cycles or 10 2D/3D cycles.

## SVG and export tests

- Golden fixtures for every symbol family and theme.
- Deterministic markup, stable viewBox.
- Physical-dimension agreement between definition, canvas, preview, and export.
- Sanitization tests: scripts, handlers, external execution, malformed markup, oversized.
- JSON round-trip structural validation for SVG, PNG, PDF, DXF outputs.
- Do NOT claim DWG support without a verified writer.

## Security and resilience gates

- Import limits: MIME/type, bytes, image pixels, archive entries, nesting depth, traversal rejection.
- SVG limits: scripts, event handlers, foreign/external execution, unsafe URLs, malformed markup, oversized.
- Asset allowlist/CSP behavior for images, meshes, textures, fonts.
- Authorization tests for every guest/member/admin read and mutation.
- AI payload schema, privacy/retention, prompt/data boundaries.

## Phase exit rule

A phase exits only when:
- Applicable automated gates pass.
- Visual and interaction evidence reviewed.
- No unexplained warning/browser error/failed request/skip/retry/timeout remains.
- Blockers and skipped checks are recorded in root `Failures.md` and `resolved-failures.md`.
- Staging behavior is verified before code moves.
- Moved production-path behavior is verified again.
- Coverage ≥ 90% floor globally and per file with no bypass; target status reported separately.

If checks lack permission, code may be reported `Implemented, verification pending`; the phase is not accepted.
