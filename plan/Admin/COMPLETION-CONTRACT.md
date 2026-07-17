# Admin completion contract

**Status:** OPEN  
**Authority:** This file is the **execution contract** for finishing Admin.  
**Relation to `FINISH-PLAN.md`:** Same product journey and phase intent (**A0–A14** checklist; contract phases A0–A6 group the same work). **Stricter** evidence, security, UI, and reporting rules. Where this file and `FINISH-PLAN.md` conflict on **how to prove done**, **this file wins**. Product scope still matches FINISH-PLAN.

**Code maps:** `FEATURES.md` (live paths; code-area sections may be finer than contract phase groups).  
**Detailed checklist:** `FINISH-PLAN.md`.  
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

Same phase ids as `FINISH-PLAN.md` so work maps 1:1.  
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
