# Admin checklist

Status only. Code map: `FEATURES.md`. Requirements: `PHASE-01` … `PHASE-04`.

Reconciled against `site/` on 2026-07-14. **Unit-complete items live in FEATURES.md, not here.**

## Step 0 — test isolation

- [x] Catalog-writing unit/e2e tests use tmp dirs (`tests/unit/features/admin/svg-editor/`, isolated publish workers).
- [ ] Automated canonical `inventory/descriptors/` hash gate in CI (not in `check:layout` today).

## Phase 1 — SVG-first authoring

- [ ] Fresh browser proof recorded with commands and exit codes (`admin-phases-live`, `admin-svg-publish-p01`; 2026-07-13 evidence ages out).
- [ ] Production auth smoke without `DEV_AUTH_BYPASS` (`admin-smoke.spec.ts`).

## Phase 2 — catalog lifecycle and Planner handoff

- [ ] `DB-SVG-01` … `DB-SVG-05` Products DB is released SVG revision and pointer authority (`block_descriptors` never written).
- [ ] `DB-SVG-17` disk→DB migration dry-run report.
- [ ] `DB-SVG-18` database and approved source parity before cutover.
- [ ] One DB transaction publish (artifact + revision + pointer + audit).
- [ ] API publish matches server-action DB dual-write (`POST /api/admin/svg-editor` has no `dbRepository` today).
- [ ] Planner `svg-blocks` reads committed DB artifact bytes (today: `loadBuyerVisibleDescriptors()` from disk).
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
