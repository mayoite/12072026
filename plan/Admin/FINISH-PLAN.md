# Admin world-standard completion plan

Status: OPEN.

**Proof bar:** For new PASS claims and release, follow `COMPLETION-CONTRACT.md` (stricter evidence). This file keeps the detailed phase checklist (A0–A14) and AF failure table.

Owner instruction: Admin track. Agents only when the owner asks; parent re-verifies gates.

## Outcome

Deliver a trustworthy inventory + commercial admin workflow.

1. Author SVG symbols and descriptors.  
2. Publish with disk as live authority (honest dual-write when ready).  
3. Manage catalog lifecycle, families, and price books.  
4. Serve Planner and Site consumers with trusted inventory.

## Truth rules

- Live code wins.
- Fresh browser behaviour wins.
- Every checklist item starts unchecked until proven in-session.
- Unit tests do not prove UI acceptance alone.
- Old reports do not prove completion.
- `results/` contains raw output only.
- Active blockers belong in `Failures.md`.
- No Admin failure may be hidden behind a later phase.
- No completed item may remain marked `OPEN`.
- No unverified item may be marked complete.
- Bypass-on probes are not production auth proof.

## Scope boundary

Included:

- Admin routes and API routes.
- SVG editor, publish pipeline, lifecycle, rollback, bulk import.
- Catalog managers (standard / configurator / planner-facing).
- Product families, price books, themes, analytics, plans, inventory views.
- Admin CRM shell under `/admin/crm/**` (demo workspace honesty).
- Admin auth gates (layout, proxy, API).
- Admin tests and browser acceptance for Admin surfaces.
- `plan/Admin/**` and `agent-reports/ADMIN.md`.

Excluded:

- Planner canvas/document redesign.
- Site marketing redesign.
- Full DB-SVG cutover faked as done.
- Production CRM backend.
- Tech-docs product work.
- Commits/pushes unless owner asks.

## Non-negotiable product decisions

- Disk (`inventory/descriptors/`, `public/svg-catalog/`) is live publish authority until cutover is proven.
- Products DB + R2 dual-write is optional and fail-soft for disk success when R2 is dead.
- Dual-write stub payloads are not revision authority.
- Tests never mutate canonical catalog files.
- `requireAuthUser("/admin", "admin")` on admin layout.
- Admin APIs use `requireAdminSession` or `withAuth({ role: "admin" })`.
- CSRF + rate limits on mutations stay fail-closed.
- UI copy admits disk authority while DB is not live authority.
- `DEV_AUTH_BYPASS=1` is local/non-prod only (`isDevAuthBypassEnabled`).

## Publish authority (live)

| Surface | Authority | Notes |
|---------|-----------|--------|
| `publishDescriptorWithPipeline.ts` | Disk | Optional `dbRepository` / artifact store |
| `resolveSvgPublishDualWrite.ts` | Gate | enabled only if DB configured **and** R2 ready |
| `publishSvgEditorAction.ts` / `POST /api/admin/svg-editor` | Disk + optional dual-write | Same injection rules |
| Lifecycle / audit | `results/admin/catalog-ops/` | Not Products DB |

Full cutover items remain OPEN in `Failures.md` (DB-SVG-01…16).

## Auth path (live)

| Layer | Code | Unauth behaviour (bypass off) |
|-------|------|-------------------------------|
| Edge proxy | `site/proxy.ts` | `/admin/*` → redirect `/access?next=…` |
| Admin layout | `site/app/admin/layout.tsx` | `requireAuthUser("/admin", "admin")` → access |
| API helper | `site/app/api/admin/_lib/server.ts` | `requireAdminSession` → 401/403 JSON |
| withAuth | `site/features/shared/api/withAuth.ts` | role `admin` → 401/403 |

Local: set `DEV_AUTH_BYPASS=1` for interactive admin without a real session. Do not claim deploy auth from that mode. Do not kill an owner’s running dev server to flip the flag.

## Failure registry (AF)

Statuses: **PASS** | **PARTIAL** | **FAIL** | **OPEN**. Update only with fresh evidence. Map also to `COMPLETION-CONTRACT.md` ADM-* where noted.

| ID | Failure | Bar to clear | Status |
|----|---------|--------------|--------|
| AF-01 | Unauth admin page gate unproven | Unit + optional browser, bypass off → `/access` | PASS (unit 2026-07-17 FIX-ADMIN); browser OPEN |
| AF-02 | Dual-write / R2 honesty | Modes unit-green; no fake R2 success | PASS (unit EXEC-4 modes); live R2 probe OPEN |
| AF-03 | Unauth `/api/admin/*` gate | 401/403 unit, bypass off | PASS (unit 2026-07-17 FIX-ADMIN); browser OPEN |
| AF-04 | Deploy auth without bypass | Preview/prod real admin session | OPEN |
| AF-05 | Bulk/advanced dominance on SVG list | UX rebalance + browser | OPEN |
| AF-06 | Phone catalog layout | Admin UI benchmark mobile | PASS (unit A-W2 cards-priority/labels/≥44px); browser OPEN |
| AF-07 | Price book raw minor units / risk weight | Governance UX + browser | PARTIAL (unit UX EXEC-5); browser OPEN |
| AF-08 | CRM presented as production | Demo banners + hub honesty | PASS (unit hub + localStorage labels EXEC-6); browser OPEN |
| AF-09 | Catalog isolation in tests | No canonical writes | PASS (unit EXEC-1 guard + A0 suite) |
| AF-10 | Production-auth smoke | `test:admin:production-auth` | OPEN |
| AF-11 | AI SVG generate | Product decision or implement | Not implemented |
| AF-12 | CI canonical hash gate | Automated isolation gate | OPEN |
| AF-13 | Internal language on SVG list | Customer-safe copy | OPEN |
| AF-14 | Full CSRF/rate matrix | All mutation routes proven | PARTIAL (ops routes EXEC-6; full matrix OPEN) |
| AF-15–17 | Planner consumer / artifact bytes | DB-SVG co-own | OPEN / PARTIAL |
| AF-18 | Dual-write not cutover | Failures.md DB-SVG remains | OPEN (cutover) |

## Execution order

Dependencies are strict. A blocked item stops only its direct dependants. Phase ids match `FEATURES.md`.

### A0. Test isolation

- [PASS] Admin publish tests use temporary inventory roots only (EXEC-1 `catalogWriteIsolation` + A0 suite).
- [PASS] No test writes committed `site/inventory/descriptors/` or released DB rows (guard throws under Vitest).
- [PASS] No runtime test writes under `site/public/` except isolated fixtures with cleanup (guard + suite).
- [PASS] Record every fresh failing admin test as `FAIL` (isolation suite fail-loud).

Exit gate: Admin tests isolated; baseline FAIL list reproducible.

### A1. Shell, auth, navigation

- [PASS] Proxy treats `/admin` as protected (`isProtectedPath`).
- [PASS] Unit: unauth `/admin` redirects to `/access` when bypass off.
- [PASS] Unit: `requireAuthUser("/admin", "admin")` redirects when unauthenticated (bypass off).
- [PASS] Unit: non-admin member rejected from admin surface.
- [PASS] Unit: admin layout calls `requireAuthUser("/admin", "admin")`.
- [PASS] Unit: `requireAdminSession` 401 without session / 403 non-admin (bypass off).
- [PASS] Unit: `resolveAuthContext("admin")` rejects unauth when bypass off.
- [ ] Browser: unauth admin journey with bypass off (do not kill owner dev server).
- [ ] Deploy/preview: real admin session without bypass (**AF-04 / AF-10** OPEN).
- [ ] Dashboard / nav browser re-proof.

Exit gate: Automated unauth gates proven with bypass mocked off. Deploy auth remains OPEN.

### A2. Excalidraw-first authoring

- [ ] Inventory list + studio shell remain primary authoring path.
- [ ] Supported Excalidraw subset contracts unit-covered; full safe path open.
- [ ] Form identity + legacy `sceneParts` bridge honesty.
- [ ] AI SVG generate not claimed (AF-11).

Exit gate: Code map in FEATURES; browser stage measurements open.

### A3. Publish pipeline (disk)

- [PASS] Publish path: compile → S4 disk → persist; fail-closed on compile failure (code + unit path; browser OPEN).
- [PASS] Rollback and stale-draft gates unit-green (existing suite; re-verify on change).
- [ ] Browser publish smoke optional; isolation required.
- [PASS] Supabase storage mirror remains best-effort (must not roll back disk) (code honesty).

Exit gate: Disk authority honest in UI and comments. No canonical catalog mutation from tests.

### A4. Catalog lifecycle and bulk

- [PASS] Lifecycle draft/release/retire/restore paths unit-green (EXEC-5).
- [ ] Bulk import advanced path; UX dominance open (AF-05).
- [PASS] Phone layout unit-proven (AF-06 A-W2: cards-priority, cell labels, ≥44px actions + CSS contract); browser viewport OPEN.

### A5. Product families

- [PASS] Family form unit-green (EXEC-5); browser release journey OPEN.
- [ ] Workstation family → Planner parity open.

### A6. Price books / commercial governance

- [PASS] Filesystem price book paths unit-green (draft → approve → activate + audit EXEC-5).
- [ ] Browser draft → approve → activate OPEN until proven.
- [PASS] AF-07 unit: currency primary + Advanced minor units + activate primary; browser OPEN.

### A7. DB-SVG cutover

- [PASS] Dual-write modes unit-honest (**AF-02** PASS unit EXEC-4: skipped_no_db / skipped_r2_unavailable / enabled).
- [PASS] Do not claim R2 success without live probe (no false success; live probe OPEN).
- [ ] Keep `Failures.md` DB-SVG cutover OPEN until revision authority + pointer + Planner bytes proved.

Exit gate: Dual-write documented; cutover remains OPEN.

### A8. Planner / consumer handoff

- [ ] `svg-blocks` DB-aware load + disk fallback mapped.
- [ ] Not artifact-byte authority until cutover.

### A9. Ops surfaces

- [PASS] Plans, features, analytics, themes, inventory, settings reachable under admin shell (nav unit + page units EXEC-6).
- [ ] Browser proof open per surface.

### A10. CRM (Admin-mounted)

- [PASS] `/admin/crm` is pipeline hub (not redirect-only) — unit green (EXEC-6).
- [PASS] CRM remains localStorage demo — labelled in UI (AF-08) (code/unit EXEC-6; browser OPEN).
- [PASS] No production CRM claim (honest hub + banners; no backend claim). Customer-queries remain distinct server-backed manage auth.

### A11. Security matrix

- [PASS] Auth unit gates (A1) — FIX-ADMIN 2026-07-17.
- [PARTIAL] CSRF + rate limits on ops mutations touched by EXEC-6 (plans, themes publish, features, customer-queries manage). Full AF-14 matrix still open.
- [ ] Production-auth smoke (AF-10).

### A12–A14. Release, a11y, residual polish

- [PASS] `pnpm run check:layout` before completion claims (exit 0 EXEC-6 session).
- [PASS] Focused lint + CRM/ops unit tests green for EXEC-6 slice (full repo lint/typecheck/build OPEN; planner lint noise exists outside scope).
- [ ] Build when release-claiming.
- [ ] A11y sample on changed admin routes when UI-claiming.
- [ ] Clear residual AF ids with evidence only.

Exit gate: Release PASS only with gate table from COMPLETION-CONTRACT.

## Reference code roots

- `site/features/admin/`
- `site/app/admin/`
- `site/app/api/admin/`
- `site/features/crm/` (admin CRM shell)
- `site/lib/auth/devAuthBypass.ts`, `session.ts`
- `site/proxy.ts`
- `site/inventory/descriptors/`, `site/public/svg-catalog/`

## Related docs

- `FEATURES.md` — live code map  
- `COMPLETION-CONTRACT.md` — proof bar  
- `docs/architecture/08-DATABASE-SVG-CONTRACT.md`  
- `Failures.md` — active blockers  
- `agent-reports/ADMIN.md` — track status  
