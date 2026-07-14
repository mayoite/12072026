# Admin checklist

Status only. Code map: `FEATURES.md`. Requirements: `PHASE-01` … `PHASE-04`.

Reconciled against `site/` on 2026-07-14. **Unit-complete items live in FEATURES.md, not here.**

## Step 0 — test isolation

- [x] Catalog-writing unit/e2e tests use tmp dirs (`tests/unit/admin/svg-editor/`, isolated publish workers).
- [ ] Automated canonical `block-descriptors/` hash gate in CI (not in `check:layout` today).

## Phase 1 — SVG-first authoring

- [x] AI-assisted SVG generation (Gemini prompt-to-SVG). `FEATURES-ADDED.md`
- [x] GLB Extruder and model viewer 3D previews. `FEATURES-ADDED.md`
- [x] Saved inventory views (filter/sort persistence). `FEATURES-ADDED.md`
- [x] Dual-read test harness. `FEATURES-ADDED.md`
- [ ] Fresh browser proof recorded with commands and exit codes (`admin-phases-live`, `admin-svg-publish-p01`; 2026-07-13 evidence ages out).
- [ ] Production auth smoke without `DEV_AUTH_BYPASS` (`admin-smoke.spec.ts`).

## Phase 2 — catalog lifecycle and Planner handoff

- [ ] `DB-SVG-01` … `DB-SVG-05` Products DB is released SVG revision and pointer authority (`block_descriptors` never written). **Dual-write scaffolded** — `DrizzleSvgRevisionPersistence` + `ImmutableSvgRevisionRepository` injected in `publishSvgEditorAction`. DDL migration `20260714100000_create_svg_revisions.sql`.
- [ ] `DB-SVG-17` disk→DB migration dry-run report.
- [ ] `DB-SVG-18` database and approved source parity before cutover.
- [ ] One DB transaction publish (artifact + revision + pointer + audit).
- [ ] API publish matches server-action DB dual-write (`POST /api/admin/svg-editor` has no `dbRepository` today).
- [ ] Planner `svg-blocks` reads committed DB artifact bytes (today: `loadBuyerVisibleDescriptors()` from disk).
- [x] Standard and configurator catalog full CRUD. `FEATURES-ADDED.md`
- [x] Catalog 3-in-1 API consolidation. `FEATURES-ADDED.md`
- [x] Canvas configuration viewer and workspace library browser. `FEATURES-ADDED.md`
- [x] Route inventory page. `FEATURES-ADDED.md`
- [x] Plans administration (list, search, view, open). `FEATURES-ADDED.md`
- [x] Theme manager with CDN publish. `FEATURES-ADDED.md`
- [x] Runtime feature flags management. `FEATURES-ADDED.md`
- [x] Analytics dashboard (plan volume, furniture, exports). `FEATURES-ADDED.md`
- [ ] Fresh integration + browser proof for catalog publication journey.

## Phase 3 — product families

- [x] Workstation family authoring UI and release drive. `FEATURES-ADDED.md`
- [x] Workstation migration choice (append/replace). `FEATURES-ADDED.md`
- [ ] 2D / 3D / BOQ parity browser journey with released family fixture.
- [ ] `ADM-FAM-01`, `ADM-FAM-02` fresh browser proof.

## Phase 4 — commercial governance

- [x] Quote price book pinning. `FEATURES-ADDED.md`
- [x] Price book file store and admin server. `FEATURES-ADDED.md`
- [ ] Full browser journey: draft → approve → activate → **retire → restore** → rollback (P05 covers approve/activate/rollback only).
- [ ] Retired product blocked on live Planner canvas (unit `placementPolicyForLifecycle` only today).
- [ ] `ADM-PUB-02`, `ADM-PRICE-*`, `ADM-ROLE-01`, `ADM-AUDIT-01` fresh browser proof.

## Cross-cutting extras (features found in codebase, `FEATURES-ADDED.md`)

- [x] CRM module (Clients, Projects, Quotes).
- [x] Customer queries inbound queue.
- [x] CSRF protection on all mutation routes.
- [x] Rate limiting on all API routes.

## Completion

- [ ] End-to-end publish → Planner consume under **DB authority** (not disk-only).
- [ ] Failed publication preserves prior public product under DB authority.
- [ ] Fresh commands and exit codes recorded here.
- [ ] Only active failures remain in `../../Failures.md`.

## Browser evidence (2026-07-14)

- [x] **Retire → Restore e2e** (`tests/e2e/admin-svg-retire-restore.spec.ts`): admin inventory retire/restore + buyer catalog API verification.
- Playwright Chromium installed via `pnpm --filter oando-site exec playwright install chromium`.
- Suite (20/20): `admin-phases-live` + inventory preview + publish p01 + scene a401 + price-book p05.
- Env: `DEV_AUTH_BYPASS=1` (dev turbo).
- Evidence: `results/admin/2026-07-13T-admin-phases-final/` (screenshots, axe reports, logs).

## Residual open (cannot close without browser/DB cutover)

1. End-to-end publish → Planner consume under DB authority (DB-SVG-04, 05, 17, 18).
2. Retired product blocked on live Planner canvas browser proof (unit-tested only today).
3. Chrome DevTools MCP Lighthouse not run here (system Chrome channel missing; Playwright Chromium + axe used instead).
