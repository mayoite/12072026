# Admin checklist

Status only. Code map: `FEATURES.md`. Requirements: `PHASE-01` … `PHASE-04`.

Reconciled against `site/` on 2026-07-14. **Unit-complete items live in FEATURES.md, not here.**

## Step 0 — test isolation

- [ ] Automated canonical `inventory/descriptors/` hash gate in CI (not in `check:layout` today).

## Phase 1 — SVG-first authoring

- [ ] Fresh browser proof recorded with commands and exit codes (`admin-phases-live`, `admin-svg-publish-p01`; 2026-07-13 evidence ages out).
- [ ] Production auth smoke without `DEV_AUTH_BYPASS` (`admin-smoke.spec.ts`).

## Phase 2 — catalog lifecycle and Planner handoff

- [ ] `DB-SVG-01` … `DB-SVG-05` Products DB is released SVG revision and pointer authority. Today: publish upserts `svg_revisions` + `block_descriptors` when `PRODUCTS_DATABASE_URL` is set, but with a stub payload and no `published_svg_revision_id` product pointer — disk remains the real authority.
- [ ] `DB-SVG-17` disk→DB migration dry-run report.
- [ ] `DB-SVG-18` database and approved source parity before cutover.
- [ ] One DB transaction publish (artifact + revision + pointer + audit).
- [ ] Real DB dual-write payload — `POST /api/admin/svg-editor` and `publishSvgEditorAction.ts` both inject `dbRepository` when `PRODUCTS_DATABASE_URL` is set (wiring parity done), but the revision payload is still a hardcoded `{slug}-r1` stub and DB is not yet authority.
- [ ] Planner `svg-blocks` reads committed DB **artifact bytes** by revision/storage key. Today: `loadBuyerVisibleDescriptorsWithDb()` reads `block_descriptors` definition JSON when configured (disk fallback), not artifact bytes.
- [ ] Fresh integration + browser proof for catalog publication journey.

## Phase 3 — product families

- [ ] 2D / 3D / BOQ parity browser journey with released family fixture.
- [ ] `ADM-FAM-01`, `ADM-FAM-02` fresh browser proof.

## Phase 4 — commercial governance

- [ ] Full browser journey: draft → approve → activate → **retire → restore** → rollback (P05 covers approve/activate/rollback only).
- [ ] Retired product blocked on live Planner canvas (unit `placementPolicyForLifecycle` only today).
- [ ] `ADM-PUB-02`, `ADM-PRICE-*`, `ADM-ROLE-01`, `ADM-AUDIT-01` fresh browser proof.

## Completion

- [ ] End-to-end publish → Planner consume under **DB authority** (not disk-only).
- [ ] Failed publication preserves prior public product under DB authority.
- [ ] Fresh commands and exit codes recorded here.
- [ ] Only active failures remain in `../../Failures.md`.
