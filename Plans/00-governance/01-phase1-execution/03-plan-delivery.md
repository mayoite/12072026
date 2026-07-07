# Plan 02 — Delivery (Phases 04–07)

Date: 2026-07-05

Authority: `01-implementation-decisions.md` · gates: `08-quality-gates.md` · failures: root `Failures.md`

Detail was merged from archived phase specs. See `archive/plans/2026-07-05_phase1-execution/phases/`.

---

## Remaining work (summary)

| Phase | Status | What is left |
|-------|--------|--------------|
| 04 | Implemented, verification pending | Live §16 validation. Signed reviews in `archive/1b-5phase-agent-workflow/reviews/`. |
| 05 | Implemented, verification pending | Live §16 validation. Playwright when Phase 05 engine ready. |
| 06 | Implemented, verification pending | Browser soak (`0412`). Coverage floor for `0408` when scheduled. |
| 07 | Implemented, verification pending | Cross-matrix browser soak (`0412`). Middleware widen if needed. |

**Note (post 1B):** Phase 1A/1B foundation complete per `02-PHASE-1.md`, `phase1-checklist.md`, and archived agent reports. Remaining are Phase 2+ items. 1B SVG path delivered via agent sets 01-05.

Blockers: `PLAN-FAIL-0408` open. `PLAN-FAIL-003`/`004` deferred until Phase 05 engine.

---

## Phase 04 — Admin SVG editor

**Goal:** Admin list + edit routes. Puck preview. Atomic save API.

**Done:** Pages at `/admin/svg-editor`. Registry alias. Type-safe Puck. GS cites in code.

**Left:** Dev-server walkthrough. Review artifacts under `archive/1b-5phase-agent-workflow/reviews/`. Mark Verified after live proof.

**Checks:** `04-ADMIN-01` list route · `04-ADMIN-02` edit + Render · `04-ADMIN-09` 422 taxonomy.

---

## Phase 05 — Portal public render

**Goal:** `/portal/svg-catalog` index + slug. Shared registry. R2 thumbs.

**Done:** RSC routes. `Puck.Render` via alias. Loader + metadata. Anti-copy cites.

**Left:** Live render check. OG image on R2. A11y roving-focus evidence.

**Checks:** `05-PORT-01` index · `05-PORT-02` slug Render · `05-PORT-09` generateMetadata.

---

## Phase 06 — Planner inventory consumer

**Goal:** Descriptor-driven catalog in open3d workspace. Catalogue-first. Search parity.

**Done:** `useOpen3dSvgCatalog` in `InventoryPanel`. Loader bind. Facet tests. HTTP probe disk↔API sync.

**Left:** Browser soak (`0412`). 90% coverage proof (`0408`). Live portal→planner UX sign-off.

**Checks:** `06-INV-01` loader path · `06-INV-05` search facets + cursor ≤24 · `06-TEST-01` corrupt/absent/present.

---

## Phase 07 — Auth and permissions

**Goal:** Guest vs member vs admin matrix. No client Supabase. Typed command registry.

**Done:** `plannerPermissions.ts` matrix aligned with `route-contract.json`. Guest command blocking. Admin route static guard. `07-AUTH-09` additive auth codes vs descriptor 422 taxonomy.

**Left:** Cross-matrix browser soak (`0412`). Optional middleware widen.

**Checks:** `07-AUTH-01` matrix table · `07-AUTH-04` guest blocked actions · `07-AUTH-09` 422 mapper additive.

---

## Cross-links

- `06-benchmark-delivery.md`
- `02-plan-foundation.md` · `04-plan-closeout.md`
- `10-review-workflow.md`
