# 04 Guest, Member, Admin Auth And Persistence

## Objective

Wire the Open3D staging repository and command layer into the existing OOFPLWeb guest/member/admin permission model, enforce the feature gate (Save/Export/Import/Open/Print hidden or disabled for guests), and implement guest-to-member promotion so that in-memory guest work is saved to the cloud API on first authenticated save.

## Non-negotiable priorities and sequence

Treat these as co-dependent release dimensions: **workflow/data/auth integrity; drawing-tool/geometry correctness; UX/accessibility; UI/responsive layout; inventory architecture; recoverable dockable toolbars/panels; visual consistency/performance**. Every dimension is release-blocking. Auth and persistence must preserve editor layout, panel state, inventory context, and active workflow. Prove guest/member permission enforcement and cloud save/load in `open3d-next-staging/` before production integration.

**Mandatory acceptance:** `QUALITY-GATES.md` applies to this phase.

**Governing decisions:** `IMPLEMENTATION-DECISIONS.md` applies to this phase.

## Auth and persistence model (confirmed)

### Guest (unauthenticated)

- All drawing and editing functions are available: pan, zoom, walls, openings, furniture placement, undo/redo.
- The following controls are **hidden or disabled** in the UI: Save, Export, Import, Open (file), Print.
- Guest work lives in memory only. There is no local save, no IndexedDB write, no browser cache, and no download for guests.
- If the guest closes the tab without signing in, work is lost. This is intentional and must be communicated clearly in the UI (Phase 05 owns the copy/UX; this phase owns the contract).
- Guests have no plan UUID. There is nothing to load from the API.
- Guests never call `/api/plans` or `/api/plans/[id]` under any circumstance.

### Guest-to-member promotion

- When a guest signs in or signs up while a project is open, their current in-memory Open3D project state is saved via the authenticated API path (`plannerSaves.ts` → `plannerCloudApi.ts`) as the first cloud save.
- No migration from IndexedDB or local storage is involved. The source is the live in-memory state at the moment authentication completes.
- After promotion the session becomes a standard member session with a cloud-assigned UUID.
- The staging layer must expose a `promoteGuestSession(client, inMemoryProject)` contract callable by the host; the actual trigger and UX (dialog, spinner, error recovery) is Phase 05.

### Member (authenticated)

- Full access to all drawing functions plus Save, Export, Import, Open, Print.
- Cloud persistence via `plannerSaves.ts` → `plannerCloudApi.ts` → `/api/plans` and `/api/plans/[id]`.
- Load uses the `?id=<uuid>` query parameter on `/planner/canvas`.
- All existing error categories are preserved (see error categories below).

### Admin

- Same runtime as member for planner purposes. Admin list/delete via `listAdminPlansFromApi` is already handled in `plannerCloudApi.ts`; Phase 04 does not change it.
- Admin routes remain separate from planner runtime.

## Source of truth for the feature gate

- **Permission matrix:** `site/features/planner/model/plannerPermissions.ts` — `PLANNER_GUEST_BLOCKED_ACTIONS` is the canonical list: `persist`, `import`, `export`, `publish`, `share`. The staging command registry must call `plannerActionIsBlocked()` before executing any command that maps to these actions.
- **Route-level enforcement:** `site/config/route-contract.json` → `plannerGuestCookie.blockedActions` carries the same list for middleware enforcement. Phase 04 does not change the route contract; it reads it as a reference.

## Existing infrastructure (read-only during Phase 04)

- `plannerCloudApi.ts` — all API calls with typed error codes: `planner:no-auth` (401), `planner:save-failed`, `planner:load-failed`, `planner:list-failed`, `planner:delete-failed`. Status 403 surfaces through `planner:no-auth` at 403; 404 on load returns `null`.
- `plannerSaves.ts` — wraps cloud API with Supabase auth resolution; `resolveUserId` throws `planner:no-auth` if session is absent.
- `plannerPermissions.ts` — permission matrix for guest/authenticated/admin; `plannerActionIsBlocked()` is the query function.
- `route-contract.json` — route authority; `plannerGuestCookie.blockedActions` mirrors `PLANNER_GUEST_BLOCKED_ACTIONS`.
- `plannerSession.ts` — session envelope; read before wiring.
- `cloudPlanHydration.ts` — read before wiring load path.

Phase 04 does not modify any of the files above. It creates the Open3D staging contract layer that consumes them.

## Error categories to preserve

All categories already implemented in `plannerCloudApi.ts`; the staging contract layer must not flatten them:

| Category | Code | HTTP status | User-visible meaning |
|---|---|---|---|
| Unauthenticated | `planner:no-auth` | 401 | Session expired or not signed in |
| Forbidden | `planner:no-auth` | 403 | Insufficient permission for this plan |
| Not found | load returns `null` | 404 | Plan does not exist or was deleted |
| Corrupt payload | `planner:load-failed` | 200 + parse fail | Plan data cannot be read |
| Unsupported schema | version migration reject | — | Plan version too old or too new |
| Network failure | `planner:*` + no status | — | Request did not complete |
| Save conflict | `planner:save-failed` | 409 | Concurrent edit; stale write rejected |

## Inputs to read

- Phase 03A inventory-system and SVG-generation contracts.
- `site/features/planner/persistence/plannerCloudApi.ts`
- `site/features/planner/persistence/plannerSaves.ts`
- `site/features/planner/persistence/plannerSession.ts`
- `site/features/planner/persistence/cloudPlanHydration.ts`
- `site/features/planner/model/plannerPermissions.ts`
- `site/config/route-contract.json`
- `site/app/api/plans/route.ts`
- `site/app/api/plans/[id]/route.ts`

## Scope

- Phase 04 establishes the repository and permission contracts in `open3d-next-staging/`. Full persistence UX acceptance (save dialogs, status indicators, error toasts, promotion dialog) is deferred to Phase 05.
- Auth remains owned by Next.js/Supabase server/API boundaries. No auth code moves into Open3D client code.
- Admin mode remains separate from planner runtime.
- Drizzle remains the server CRUD path for planner/catalog rows.

## Checklist

- [x] **04-PERM-01** Read `plannerPermissions.ts`; wire `plannerActionIsBlocked()` into the Open3D staging command registry so that commands mapping to `persist`, `import`, `export`, `publish`, `share` are disabled for guests before execution.
- [x] **04-PERM-02** In the staging UI, hide or disable Save, Export, Import, Open (file), and Print controls when the session context is `guest`. Read the blocked-actions list from `PLANNER_GUEST_BLOCKED_ACTIONS`; do not hardcode a separate list.
- [x] **04-REPO-01** Implement `MemberPlanRepository` in `open3d-next-staging/` wrapping `plannerSaves.ts`: `load(client, saveId)`, `save(client, document)`, `list(client)`, `delete(client, saveId)`.
- [x] **04-REPO-02** Implement `promoteGuestSession(client, inMemoryProject)`: resolve auth, call `savePlannerDocumentToSupabase` with a new UUID, return the saved `PlannerDocument`. This is the only path by which guest in-memory state becomes a cloud plan.
- [x] **04-REPO-03** Ensure the staging layer has no code path by which a guest session can invoke `savePlannerDocumentToSupabase`, `savePlanToApi`, or any `/api/plans` fetch.
- [x] **04-ERR-01** Map all `PlannerStorageError` / `PlannerCloudApiError` codes to distinct `Open3dPersistenceError` variants in staging: `unauthenticated`, `forbidden`, `not-found`, `corrupt`, `unsupported-schema`, `network`, `conflict`. Do not flatten to a generic "save failed".
- [x] **04-ERR-02** Write fixture tests covering all seven error categories. Each fixture must assert that the correct error variant is produced from the corresponding API response or rejection.
- [x] **04-SCHEMA-01** Confirm that `PlannerDocument` `sceneJson` can represent the current Open3D in-memory project state; document any gap as a blocker in `FAILURESPLAN.md` before proceeding.
- [ ] **04-SCHEMA-02** Decide how large background images are handled: compressed data URL, R2 reference, or blocked cloud save with a visible status. Record the decision in this file's decision log. Do not leave it implicit.
- [x] **04-ROUTE-01** Keep `/planner/canvas/?id=<uuid>` as the member edit route. Do not change the route contract.
- [x] **04-ROUTE-02** Preserve portal links: `/portal/`, `/portal/[id]`, and `/planner/canvas/?id=<uuid>`.
- [ ] **04-COVER-01** Achieve ≥95% statements, branches, functions, and lines for all handwritten staging persistence files; hard floor is 90%.

## Exit gate

- [x] Guest commands that map to blocked actions are disabled/hidden; guests cannot reach Save, Export, Import, Open, or Print.
- [x] Guests never call `/api/plans` or `/api/plans/[id]` — proven by fixture test asserting no fetch is issued.
- [x] `MemberPlanRepository` load/save/list/delete works against the existing plan APIs with fixture proof.
- [x] `promoteGuestSession` saves in-memory state to the cloud API when called with an authenticated client.
- [x] Each of the seven error categories maps to a distinct error variant with fixture evidence.
- [ ] Background image size decision is recorded in the decision log.
- [x] Admin routes and APIs remain outside planner runtime.

## Evidence required

- [x] Fixture tests for permission gate enforcement (guest cannot trigger blocked commands).
- [x] Fixture test asserting no fetch to `/api/plans` from a guest session.
- [x] `MemberPlanRepository` request/response proof against API contract.
- [x] `promoteGuestSession` round-trip proof.
- [x] Error classification fixture list (seven categories).
- [ ] Decision log entry for background image handling.
- [ ] Coverage report at or above the 90% hard floor.

## Phase governance

### Forbidden actions

- Do not move auth into Open3D client code.
- Do not allow any guest code path to call `/api/plans` or `/api/plans/[id]`.
- Do not store API keys or auth state in browser storage.
- Do not flatten `planner:no-auth` (401), `planner:no-auth` (403), `not-found`, `corrupt`, `network`, and `conflict` into a single "save failed" state.
- Do not change `/planner/guest` (public) or `/planner/canvas` (protected) route semantics.
- Do not add Supabase CRUD outside Drizzle.
- Do not implement the persistence UX (dialogs, toasts, status indicators, promotion dialog) — that is Phase 05.
- Do not create or reference any guest local save, IndexedDB write, or download mechanism for guests.
- Do not modify `plannerCloudApi.ts`, `plannerSaves.ts`, `plannerPermissions.ts`, or `route-contract.json` in this phase.

### Phase entry checklist

- [ ] Phase 03A inventory domain and SVG engine verified (or deferred with explicit evidence).
- [ ] `plannerCloudApi.ts` and `plannerSaves.ts` read and understood.
- [ ] `plannerPermissions.ts` permission matrix read; `PLANNER_GUEST_BLOCKED_ACTIONS` confirmed.
- [ ] `route-contract.json` `plannerGuestCookie.blockedActions` confirmed to match permission matrix.
- [ ] Background image size decision owner identified.

### Rollback criteria

- If any guest code path issues a fetch to `/api/plans`, abort and isolate before continuing.
- If auth leaks into Open3D client code, abort and move logic to server/API boundary.
- If `PlannerDocument` `sceneJson` cannot represent Open3D in-memory state, abort and resolve the schema gap first.
- If background image payload decision is unresolved and payloads exceed safe size, abort and decide before wiring save.
- If coverage cannot reach the 90% hard floor, abort and reassess.

### Risk register

- **Risk:** In-memory state cannot be fully expressed as `PlannerDocument` `sceneJson`. **Impact:** critical — blocks promotion and member save. **Mitigation:** validate schema fit in checklist item 04-SCHEMA-01 before implementing repository; record gaps in `FAILURESPLAN.md`. **Owner:** persistence agent. **Status:** open.
- **Risk:** Background image payload exceeds safe `sceneJson` size. **Impact:** high — could cause 413 errors or corrupt saves. **Mitigation:** decide on compressed data URL, R2 reference, or blocked save with visible message in 04-SCHEMA-02 before wiring cloud save. **Owner:** persistence agent. **Status:** open.
- **Risk:** Error categories are flattened to a single variant, hiding permission and data-loss cases. **Impact:** high. **Mitigation:** seven distinct error variants with fixture tests in 04-ERR-01 and 04-ERR-02. **Owner:** persistence agent. **Status:** open.

### Success metrics

- Guest commands that map to blocked actions produce no API calls and are disabled in UI: ✅
- `MemberPlanRepository` save/load uses authenticated plan APIs: ✅
- `promoteGuestSession` saves in-memory state on first authenticated save: ✅
- Seven distinct error categories each map to a distinct variant: ✅
- Admin routes remain outside planner runtime: ✅
- Coverage ≥95% target (≥90% hard floor) globally and per file: ⚠️ (pre-existing debt)

### Dependencies on external systems

- Phase 03A inventory contracts.
- `/api/plans` and `/api/plans/[id]` routes (no changes to these in Phase 04).
- Drizzle planner/catalog schema.
- Supabase auth boundaries.
- `plannerCloudApi.ts`, `plannerSaves.ts`, `plannerPermissions.ts`, `route-contract.json` (all read-only in Phase 04).

### Performance budgets

- Member cloud save: p95 ≤2s.
- Member document load: p95 ≤500ms.
- Guest-to-member promotion save: p95 ≤2s (same budget as member save; single call).
- Permission gate check (blocked-action lookup): <1ms synchronous.

### Security considerations

- Guests never call `/api/plans` or `/api/plans/[id]`.
- No API keys or auth state in browser storage.
- Auth owned by Next.js/Supabase server/API boundaries; not duplicated in Open3D client code.
- Admin routes separate from planner runtime.
- All seven error categories are surfaced distinctly so permission failures cannot be silently swallowed.

### Accessibility considerations

- Save status states have accessible names: Unsaved, Saving, Saved, Offline, Conflict, Save failed, Session expired. (These are contract labels; Phase 05 owns the live-region announcements and visual indicators.)
- Error messages produced by this layer must be screen-reader-friendly strings, not raw error codes.
- Recovery actions (retry, sign-in redirect) must be keyboard-accessible when wired in Phase 05.

### Decision log

- **2026-07-03:** Background image handling (04-SCHEMA-02) **deferred** to Phase 05 when full persistence UX is implemented. Decision owner: Phase 05 agent. Reason: requires UI/UX work for visible status messaging.
- *(Any other key choices made during implementation to be recorded here.)*

## Risks/blockers

- `PlannerDocument` `sceneJson` schema may not fully represent the current Open3D in-memory state — must be validated before wiring save/promotion.
- Background image payload may exceed safe size for `sceneJson` — ownership decision required before cloud save is wired.
- Error categories must not be flattened; hiding a 401 or 403 behind "save failed" causes data-loss confusion.
