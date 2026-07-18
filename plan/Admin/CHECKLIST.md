# Admin checklist

**Status:** OPEN  
**Pair:** `FEATURES.md` = live code map (feature → path → gap).  
**This file:** all-encompassing execution document for the track — evidence rules **and** full phase checklist (what is required, what exists, what is open).  
**Active blockers:** `../../Failures.md`  
**Doc set:** only `CHECKLIST.md` + `FEATURES.md` per track.

---

## Part A — Evidence and completion rules

_Former COMPLETION-CONTRACT content. Wins on how to prove done._

**Status:** OPEN  
**Authority:** This file is the **execution contract** for finishing Admin.  

**Code maps:** `FEATURES.md` (live paths; code-area sections may be finer than contract phase groups).  
**Detailed checklist:** `this checklist (phase section)`.  
**UI bar:** `docs/architecture/07-ADMIN-UI-BENCHMARK.md` · shared shell in `docs/architecture/06-UI-BENCHMARK.md`.  
**Security bar:** `docs/architecture/10-SECURITY-BENCHMARK.md`.  
**DB-SVG contract:** `docs/architecture/08-DATABASE-SVG-CONTRACT.md`.  
**Active blockers:** `../../Failures.md` (real unresolved only).  
**Agent reports:** `../../agent-reports/` — short slices + `ADMIN.md` (one track file). Never one mega dump.

---

## 1. Outcome

Deliver a trustworthy **inventory + commercial admin** workflow:

1. Author SVG symbols and descriptors from isolated drafts.  
2. Publish to **disk** (live authority) with honest dual-write when DB+R2 ready.  
3. Manage catalog lifecycle, families, price books, and ops surfaces.  
4. Hand trusted inventory to Planner and Site consumers.

**Not:** Planner redesign, Site marketing redesign, production CRM backend, fake R2/DB cutover.

---

## 2. Truth rules (non-negotiable)

| Rule | Meaning |
|------|---------|
| Live code wins | Not plan ticks, not agent prose |
| Fresh browser wins | UI claims require current Chromium on current source |
| Unit ≠ browser | Unit-green is never UI or publish acceptance alone |
| `results/` is not proof | Raw tool output only; never PASS evidence alone |
| Old reports die | Dated baselines do not clear checkboxes |
| OPEN / FAIL / PASS / PARTIAL | OPEN = unverified. FAIL = fresh fail. PASS = evidence below. PARTIAL = code without full proof |
| No hidden deferral | An Admin failure is not “later phase” without an explicit **AF** or **ADM** id |
| No silent skip | No `test.skip`, no forced clicks, no raised timeouts to mask blocks |
| No handwritten `any` | Handwritten product/test code |
| Secrets | `.env.local` only |
| No canonical catalog mutation in tests | Use tmp dirs / fixtures outside committed inventory |

### What counts as PASS

A checklist item is **PASS** only when **all** that apply are true:

1. **Code** exists on the claimed path (FEATURES or this file).  
2. **Automated proof** for pure logic: focused vitest exit 0 with named files.  
3. **Browser proof** for admin-visible behaviour: Playwright or documented Chromium session — route, viewport, steps, console errors = 0, failed requests = 0.  
4. **Security-sensitive** behaviour: unit or integration that proves admin role / CSRF / rate limit; browser if customer-facing path.  
5. **Command + exit** recorded in the same session that claims PASS.  
6. Checkbox flipped **in the same change** as the proof, or left OPEN.

**Partial code with unit only** → mark **PARTIAL** in status tables, leave checklist **unchecked**.

### Auth honesty (Admin-specific)

| Claim | Proof required |
|-------|----------------|
| Unauth `/admin/*` blocked | Unit: proxy + `requireAuthUser(..., "admin")` with `DEV_AUTH_BYPASS` **off** → `/access`. Browser with bypass **off** preferred for release. |
| Unauth `/api/admin/*` blocked | Unit: `requireAdminSession` / `withAuth(role: "admin")` → **401/403** with bypass **off**. |
| Local bypass | `DEV_AUTH_BYPASS=1` **and** non-production only. Bypass-on probes are **not** production auth proof. |
| Deploy auth | **NOT PROVEN** until a session without bypass is exercised against the deployed/preview host. |

---

## 3. Evidence protocol

### 3.1 Gates (release acceptance)

Run from repo root. All must exit **0** for release claim:

| Gate | Command |
|------|---------|
| Layout | `pnpm run check:layout` |
| Lint | `pnpm run lint` |
| Typecheck | `pnpm run typecheck` |
| Admin-focused unit | Named vitest files under `tests/unit/app/admin/`, `tests/unit/app/api/admin/`, `tests/unit/features/admin/` |
| Admin browser (when claiming UI) | `pnpm --filter oando-site run` scripts for admin Playwright — only with honest auth mode recorded |
| Build | `pnpm run build` (or site production build) |

Any gate FAIL → product phase may still progress; **release PASS is forbidden**.

### 3.2 Report shape (every slice)

Write under `agent-reports/YYYY-MM-DD-fix-admin.md` or `agent-reports/YYYY-MM-DD-admin-<slice>.md` (≤40–50 lines):

```text
# Title
Verdict: PASS | PARTIAL | FAIL | OPEN
Evidence: commands + exits + routes
Done (bullet + path)
Not done (bullet + why)
```

Update `agent-reports/ADMIN.md` in place (Deploy auth, Done/Open next, Date).

### 3.3 Agents

| Role | Must |
|------|------|
| Implementer | Change code + tests; no PASS claim without commands |
| Parent | Re-run focused tests; keep ADMIN.md honest |
| Never | Mark FINISH checkboxes PASS without parent evidence; never fake R2/DB cutover |

---

## 4. Scope boundary

### In

- `site/app/admin/**`, `site/app/api/admin/**`
- `site/features/admin/**`
- Admin-facing CRM shell routes under `/admin/crm/**` (demo store honesty)
- SVG publish pipeline, lifecycle, price books, catalog managers, themes, analytics, plans
- Admin tests under `site/tests/**` that target admin
- `plan/Admin/**`, `agent-reports/ADMIN.md`

### Out

- Planner canvas/document redesign
- Site marketing redesign
- Full DB-SVG cutover to R2 revision authority (tracked in Failures.md until proven)
- Production multi-tenant CRM backend
- Secrets, production deploys, commits unless owner asks

---

## 5. Product non-negotiables

- **Disk is live SVG publish authority** until DB-SVG cutover is proven end-to-end.  
- Dual-write attaches only when Products DB is configured **and** R2 ListObjects succeeds; dead R2 must not roll back disk publish.  
- Dual-write payload may still be stub/incomplete — do not claim revision authority.  
- Tests never mutate `site/inventory/descriptors/` or released catalog rows.  
- Admin layout requires `requireAuthUser("/admin", "admin")`.  
- Admin APIs require `requireAdminSession` or `withAuth({ role: "admin" })`.  
- CSRF + rate limits on mutating admin routes stay fail-closed.  
- UI admits disk authority where source is disk (`AdminSvgEditorListView` copy).

---

## 6. Failure registry — status vocabulary

Statuses: **PASS** | **PARTIAL** | **FAIL** | **OPEN**.  
Update only with fresh evidence.

**Id scheme:** design prefix is **AF-** (`plan/_meta/DOC-SET-DESIGN.md`).  
**ADM-*** ids are session aliases for auth/SVG slices (same bar). FEATURES gap rows may cite either.

| ID | Alias | Failure | Bar to clear | Status seed |
|----|-------|---------|--------------|-------------|
| AF-10 / AF-01 | ADM-AUTH-01 | Unauth admin pages not proven | Unit + optional browser with bypass off → `/access` | PARTIAL (unit green 2026-07-17; browser OPEN) |
| AF-10b / AF-03 | ADM-AUTH-02 | Unauth admin APIs not proven | Unit 401/403 with bypass off | PARTIAL (unit green 2026-07-17; browser OPEN) |
| AF-10c / AF-04 | ADM-AUTH-03 | Deploy auth with real session | Preview/prod without bypass | OPEN |
| AF-02 | ADM-SVG-DISK | Publish disk path regressions | Isolated unit + optional browser | OPEN |
| AF-02 / AF-18 | ADM-SVG-DUAL | Dual-write honesty | `resolveSvgPublishDualWrite` modes unit green; no fake R2 success | PARTIAL (modes unit green) |
| AF-18 | ADM-DB-SVG | Full cutover (DB-SVG-01..16) | Failures.md + 08-contract | OPEN |
| AF-08 | ADM-CRM-HUB | CRM index hub vs redirect | Unit matches live hub page | PASS (unit hub + localStorage labels EXEC-6 2026-07-17); browser OPEN |
| AF-07 | ADM-PRICE | Price book governance browser | Playwright with honest auth | OPEN (UI risk FAIL in benchmark seed) |
| AF-09 | ADM-FAM | Family release browser journey | Browser proof | OPEN |

Other AF seeds from FEATURES/benchmark (not re-verified here): AF-05 bulk UX, AF-06 phone catalog, AF-11 AI SVG missing, AF-12 isolation hash gate, AF-13 internal language, AF-17 Planner consumer bytes.

Add new **AF-** ids rather than burying issues.

---

## 7. Execution phases (map to FINISH-PLAN)

Same phase ids as `this checklist (phase section)` so work maps 1:1.  
**Difference:** each phase has **Exit gate** + **Proof required** + **Stop condition**.

### A0 — Test isolation

**Proof:** no canonical catalog mutation; admin publish tests use tmp dirs.  
**Exit:** Admin unit suites isolated; baseline FAIL list reproducible.  
**Stop:** if tests write committed inventory — fix isolation first.

### A1 — Auth gates

**Exit:** unauth `/admin` → access (proxy + layout); unauth `/api/admin/*` → 401/403.  
**Proof:** unit with bypass mocked **off**; document that local `DEV_AUTH_BYPASS=1` is expected for interactive admin work.  
**Stop:** do not claim deploy auth from bypass-on sessions.

### A2 — SVG author + publish (disk)

**Exit:** compile → S4 disk → persist; rollback/idempotent paths unit-green.  
**Proof:** focused publish unit; browser smoke optional.

### A3 — Dual-write honesty (not cutover)

**Exit:** modes `skipped_no_db` / `skipped_r2_unavailable` / `enabled` unit-proven; UI admits disk.  
**Proof:** `resolveSvgPublishDualWrite.test.ts`.  
**Stop:** never mark DB-SVG cutover PASS without R2 + revision authority proof.

### A4 — Catalog lifecycle + families + price books

**Exit:** lifecycle/bulk/price book code paths unit-green; browser OPEN until proven.  
**Proof:** unit + optional Playwright.  
**EXEC-5 (2026-07-17):** lifecycle draft→live→retire→restore, family authoring, price-book draft→approve→activate unit-green; ADM-PRICE / ADM-FAM browser remain OPEN.

### A5 — Ops + CRM demo honesty

**Exit:** CRM hub live; localStorage demo labelled; no production CRM claim.  
**Proof:** hub unit + nav tests + page shells (EXEC-6 2026-07-17 unit green). Browser OPEN.

### A6 — Release gates

**Exit:** layout + lint + typecheck + focused admin tests + build as required by release policy.  
**Proof:** `check:layout` PASS EXEC-6; focused CRM/ops unit + focused eslint PASS; full release:gate **not** claimed.

---

## 8. Local auth note (operators)

- Interactive admin against a running dev server usually needs `DEV_AUTH_BYPASS=1` in repo-root `.env.local` (non-production).  
- That flag is **local convenience only**.  
- Proving production authorization requires restart/session **without** bypass (or a real admin Supabase session).  
- Do **not** kill an owner’s running dev server to flip the flag; document OPEN instead.

---

## Part B — Phase checklist (full)

_Former FINISH-PLAN content. Full required work: what is there and what is not._

Status: OPEN.

**Proof bar:** Evidence section above + FEATURES.md code paths. PASS needs same-session proof.

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

Statuses: **PASS** | **PARTIAL** | **FAIL** | **OPEN**. Update only with fresh evidence. Map also to `this checklist (evidence section)` ADM-* where noted.

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
| AF-14 | Full CSRF/rate matrix | All mutation routes proven | PASS (unit static auto-discovery 2026-07-17 plan-A2); browser OPEN |
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
- [PASS] CSRF + rate limits: all `app/api/admin/**` mutators auto-discovered in `mutation-route-safety.matrix.test.ts` + audit sample (plan-A2 2026-07-17). withAuth / enforceAdminRateLimit unit green. Browser OPEN.
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
- `this checklist (evidence section)` — proof bar  
- `docs/architecture/08-DATABASE-SVG-CONTRACT.md`  
- `Failures.md` — active blockers  
- `agent-reports/ADMIN.md` — track status
