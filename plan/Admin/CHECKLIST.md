# Admin checklist

**Status:** PARTIAL  
**Pair:** `FEATURES.md` = live code map.  
**This file:** evidence (Part A) + phases A0–A14 (Part B) + **order factory** Part C.  
**Blockers:** `../../Failures.md` — **owner blockers NONE**.  
**Tasks:** `IMPLEMENTATION-PLAN.md` · **Stack:** `REALITY-AND-STACK.md`  
**Owner rules:** `../../Agents.md`

**How to read:** Part C first (ship) → IMPLEMENTATION-PLAN → FEATURES → REALITY.  
**Status honesty:** unit green + browser open = **PARTIAL**, not PASS.  
**Do not invent owner permission gates.**

---

## Part A — Evidence and completion rules

**Status:** OPEN  
**Authority:** This file is the **execution spine** for finishing Admin.

**Code maps:** `FEATURES.md`  
**UI bar:** `docs/architecture/07-ADMIN-UI-BENCHMARK.md` · shared shell `docs/architecture/06-UI-BENCHMARK.md`  
**Security bar:** `docs/architecture/10-SECURITY-BENCHMARK.md`  
**DB-SVG contract:** `docs/architecture/08-DATABASE-SVG-CONTRACT.md`  
**Active blockers:** `../../Failures.md`  
**Agent reports:** `../../agent-reports/` · `ADMIN.md` (one track file). Never one mega dump.

---

## 1. Outcome

**Primary — daily order factory (exact client configs):**

```text
fields + options → Maker drawer → multipath SVG → publish
  → guest place → BOQ name/SKU
```

- Close on **exact** size/options (not nearest photo).  
- Grow library **as needed** (desk first; new drawer only when a job needs a new shape).  
- Durable live intent: **Supabase + R2**. Code disk default until agent flips `SVG_RELEASE_AUTHORITY=db` after place proof — **not an owner hold**.  
- Do **not** rebuild Planner.

**Also:** draft freehand (Excalidraw), lifecycle, price books, ops — secondary to the factory loop.

**Not:** Planner redesign, “all furniture types day one”, AI geometry as publish truth, fake cutover claims, five designers per permutation.

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
| Admin-focused unit | Named vitest under `tests/unit/app/admin/`, `tests/unit/app/api/admin/`, `tests/unit/features/admin/` |
| Admin browser (when claiming UI) | Playwright admin scripts — honest auth mode recorded |
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
| Never | Mark checkboxes PASS without parent evidence; never fake R2/DB cutover |

---

## 4. Scope boundary

### In

- `site/app/admin/**`, `site/app/api/admin/**`
- `site/features/admin/**`
- Admin-facing CRM shell routes under `/admin/crm/**` (demo store honesty)
- SVG publish pipeline, lifecycle, price books, catalog managers, themes, analytics, plans
- Parametric library under `features/planner/asset-engine/svg/parametric/` + Admin form (Part C)
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
- Dual-write when enabled still ≠ release authority — do not claim DB cutover.  
- Tests never mutate `site/inventory/descriptors/` or released catalog rows.  
- Admin layout requires `requireAuthUser("/admin", "admin")`.  
- Admin APIs require `requireAdminSession` or `withAuth({ role: "admin" })`.  
- CSRF + rate limits on mutating admin routes stay fail-closed.  
- UI admits disk authority where source is disk (`AdminSvgEditorListView` copy).  
- Parametric pen = **Maker.js only** (Part C). Forms only. No AI geometry.

---

## 6. Failure registry — status vocabulary

Statuses: **PASS** | **PARTIAL** | **FAIL** | **OPEN**.  
Update only with fresh evidence.

**Id scheme:** design prefix is **AF-**. **One ID = one failure = one bar.** Never reuse an ID for a second meaning.  
Optional **ADM-*** aliases are 1:1 only (table below). FEATURES and Part B cite **AF-** ids only.

### Canonical AF registry (single source)

| ID | Failure | Bar to clear | Status |
|----|---------|--------------|--------|
| AF-01 | Unauth admin page gate | Unit + browser, bypass off → `/access` | PARTIAL (unit; browser OPEN) |
| AF-02 | Disk publish path regressions | Isolated unit + optional browser | OPEN |
| AF-03 | Unauth `/api/admin/*` gate | 401/403 unit, bypass off | PARTIAL (unit; browser OPEN) |
| AF-04 | Deploy auth without bypass | Preview/prod real admin session | OPEN |
| AF-05 | Bulk/advanced dominance on SVG list | UX rebalance + browser | OPEN |
| AF-06 | Phone catalog layout | Browser 390×844 | PARTIAL (unit; browser OPEN) |
| AF-07 | Price book governance UX | Browser draft→approve→activate | PARTIAL (unit; browser OPEN) |
| AF-08 | CRM presented as production | Demo honesty + browser | PARTIAL (unit; browser OPEN) |
| AF-09 | Catalog isolation in tests | No canonical writes | PARTIAL (unit guard) |
| AF-10 | Production-auth smoke | `test:admin:production-auth` | OPEN |
| AF-11 | AI freeform SVG generate | Decision or implement (C-AI ≠ AF-11) | OPEN (not implemented) |
| AF-12 | CI canonical hash gate | Automated isolation gate | OPEN |
| AF-13 | Internal language on SVG list | Customer-safe copy | OPEN |
| AF-14 | Full CSRF/rate matrix | Mutators + browser sample | **PARTIAL→PASS unit + browser sample** (2026-07-18): `audit-api-route-safety` unit green; e2e `admin-csrf-matrix-af14.spec.ts` 2/2 — mutators fail-closed without CSRF (≥1× 403 + `x-csrf-rejected`); full Chromium tour of every mutator still optional |
| AF-15–17 | Planner consumer / artifact bytes | DB-SVG co-own | **PARTIAL** (2026-07-18): place pins `sourceSvgRevisionId` when preview is revision API; unit `c4GuestPlaceLoadRule` + `svgPreviewAssets` green; live GET revision → `image/svg+xml` + immutable ETag. Still OPEN: disk fallback under db authority (DB-SVG-16), full pin on all place paths / save persistence browser |
| AF-18a | Dual-write mode honesty | Modes unit-green; live R2 probe | PARTIAL (modes unit; R2 OPEN) |
| AF-18 | Full DB-SVG cutover | Failures.md + browser place + flip | OPEN |
| AF-19 | Family release browser journey | Browser family → Planner parity | OPEN |
| **K1** | Form/CLI/publish must use Maker only | Single Maker `drawLinearDesk`; unit green | unit-green (2026-07-18) — browser C3 still OPEN |
| **K2** | “via Maker” claim needs unit | Unit proves Maker ids; template not form pen | unit-green (2026-07-18) — residual template only |
| **K3** | Form UI must bind full Zod knobs | Model + UI bind all schema mm knobs | unit-green (2026-07-18) — browser OPEN |

### Optional session aliases (1:1 — do not invent new meanings)

| Alias | = AF |
|-------|------|
| ADM-AUTH-01 | AF-01 |
| ADM-AUTH-02 | AF-03 |
| ADM-AUTH-03 | AF-04 |
| ADM-AUTH-SMOKE | AF-10 |
| ADM-SVG-DISK | AF-02 |
| ADM-SVG-DUAL | AF-18a |
| ADM-DB-SVG | AF-18 |
| ADM-CRM-HUB | AF-08 |
| ADM-PRICE | AF-07 |
| ADM-FAM | AF-19 |
| ADM-PARAM-MAKER / PROOF / FIELDS | K1 / K2 / K3 |

Add new **AF-** ids rather than burying issues or reusing a number.

---

## 7. Execution phases (map to Part B)

| Phase | Focus | Exit |
|-------|-------|------|
| A0 | Test isolation | No canonical catalog mutation |
| A1 | Auth gates | Unauth → access / 401/403 (unit) |
| A2 | Excalidraw draft studio | Draft path only; not parametric authority |
| A3 | Disk publish pipeline | Compile fail-closed; S4 disk |
| A4–A6 | Lifecycle / families / price books | Unit green; browser OPEN |
| A7–A8 | DB-SVG / consumer | Disk authority until cutover |
| A9–A11 | Ops / CRM honesty / security | Demo honesty; auth matrix |
| A12–A14 | Release gates / a11y / residual AF | `check:layout` + focused proof |
| **Part C** | Parametric Maker library | K1–K3 → C3 browser → C4 place |

---

## Part B — Phase checklist

_Phase work list. Status claims need Part A evidence._

### Publish authority (live)

| Surface | Authority | Notes |
|---------|-----------|--------|
| `publishDescriptorWithPipeline.ts` | Disk | Optional `dbRepository` / artifact store |
| `resolveSvgPublishDualWrite.ts` | Gate | enabled only if DB configured **and** R2 ready |
| `publishSvgEditorAction.ts` / `POST /api/admin/svg-editor` | Disk + optional dual-write | Same injection rules |
| Parametric publish | `publishLinearDeskAction.ts` | Disk via same pipeline; Maker SVG via `compileLinearDeskSvg` |
| Lifecycle / audit | `results/admin/catalog-ops/` | Not Products DB |

Full cutover OPEN in `Failures.md`. **No `SVG_RELEASE_AUTHORITY=db` in this plan.**

### Auth path (live)

| Layer | Code | Unauth behaviour (bypass off) |
|-------|------|-------------------------------|
| Edge proxy | `site/proxy.ts` | `/admin/*` → `/access?next=…` |
| Admin layout | `site/app/admin/layout.tsx` | `requireAuthUser("/admin", "admin")` |
| API helper | `site/app/api/admin/_lib/server.ts` | `requireAdminSession` → 401/403 |
| withAuth | `site/features/shared/api/withAuth.ts` | role `admin` → 401/403 |

### Failure registry (AF)

Canonical list lives in **Part A §6** only. Do not redefine AF ids here.  
When flipping status, edit §6 (and FEATURES gap text if it cites that id).

### A0. Test isolation

- [ ] Admin publish tests use temporary inventory roots only.  
- [ ] No test writes committed `site/inventory/descriptors/` or released DB rows.  
- [ ] No runtime test writes under `site/public/` except isolated fixtures with cleanup.  
- [ ] Isolation suite fail-loud on violation.

Exit: Admin tests isolated; baseline FAIL list reproducible.  
**Stop:** if tests write committed inventory — fix isolation first.

### A1. Shell, auth, navigation

- [ ] Proxy treats `/admin` as protected (`isProtectedPath`).  
- [ ] Unit: unauth `/admin` redirects to `/access` when bypass off.  
- [ ] Unit: `requireAuthUser("/admin", "admin")` redirects when unauthenticated.  
- [ ] Unit: non-admin member rejected from admin surface.  
- [ ] Unit: admin layout calls `requireAuthUser("/admin", "admin")`.  
- [ ] Unit: `requireAdminSession` 401 without session / 403 non-admin.  
- [ ] Unit: `resolveAuthContext("admin")` rejects unauth when bypass off.  
- [ ] Browser: unauth admin journey with bypass off.  
- [ ] Deploy/preview: real admin session without bypass (**AF-04**).  
- [ ] Production-auth smoke script (**AF-10**).  
- [ ] Dashboard / nav browser re-proof.

Exit: Automated unauth gates proven with bypass mocked off. Deploy auth remains OPEN until proven.

### A2. Excalidraw-first authoring (draft only)

- [ ] Inventory list + studio shell remain primary freehand draft path.  
- [ ] Supported Excalidraw subset contracts unit-covered.  
- [ ] Form identity + legacy `sceneParts` bridge honesty.  
- [ ] AI freeform SVG generate not claimed (AF-11).  
- [ ] Excalidraw is **not** parametric publish authority (Part C = Maker).

### A3. Publish pipeline (disk)

- [ ] Publish path: compile → S4 disk → persist; fail-closed on compile failure.  
- [ ] Rollback and stale-draft gates unit-green (re-verify on change).  
- [ ] Browser publish smoke optional; isolation required.  
- [ ] Supabase storage mirror remains best-effort (must not roll back disk).

### A4. Catalog lifecycle and bulk

- [ ] Lifecycle draft/release/retire/restore paths unit-green.  
- [ ] Bulk import advanced path; UX dominance open (AF-05).  
- [ ] Phone layout unit-proven (AF-06); browser viewport OPEN.

### A5. Product families

- [ ] Family form unit-green; browser release journey OPEN (**AF-19**).  
- [ ] Workstation family → Planner parity open (**AF-19**).

### A6. Price books / commercial governance

- [ ] Filesystem price book paths unit-green (draft → approve → activate + audit).  
- [ ] Browser draft → approve → activate OPEN until proven.  
- [ ] Currency primary + Advanced minor units honesty.

### A7. DB-SVG cutover

- [ ] Dual-write modes unit-honest (**AF-18a**).  
- [ ] Do not claim R2 success without live probe.  
- [ ] Keep `Failures.md` DB-SVG cutover OPEN until browser place + authority flip.

### A8. Planner / consumer handoff

- [ ] `svg-blocks` DB-aware load + disk fallback mapped.  
- [ ] Not artifact-byte authority until cutover.

### A9. Ops surfaces

- [ ] Plans, features, analytics, themes, inventory, settings reachable under admin shell.  
- [ ] Browser proof open per surface.

### A10. CRM (Admin-mounted)

- [ ] `/admin/crm` is pipeline hub (not redirect-only).  
- [ ] CRM remains localStorage demo — labelled in UI (AF-08).  
- [ ] No production CRM claim. Customer-queries remain distinct server-backed manage auth.

### A11. Security matrix

- [ ] Auth unit gates (A1).  
- [ ] CSRF + rate limits: admin mutators matrix unit + audit sample.  
- [ ] Production-auth smoke (AF-10).

### A12–A14. Release, a11y, residual polish

- [ ] `pnpm run check:layout` before completion claims (re-run each session).  
- [ ] Focused lint + admin unit for claimed slice.  
- [ ] Build when release-claiming.  
- [ ] A11y sample on changed admin routes when UI-claiming.  
- [ ] Clear residual AF ids with evidence only.

### Reference code roots

- `site/features/admin/`  
- `site/app/admin/`  
- `site/app/api/admin/`  
- `site/features/crm/`  
- `site/features/planner/asset-engine/svg/` (parametric + Maker)  
- `site/lib/auth/devAuthBypass.ts`, `session.ts`  
- `site/proxy.ts`  
- `site/inventory/descriptors/`, `site/public/svg-catalog/`

### Related docs

- `FEATURES.md` — live code map  
- `IMPLEMENTATION-PLAN.md` — K1→C4 TDD tasks  
- `REALITY-AND-STACK.md` — market + engines  
- `../../docs/architecture/13-PARAMETRIC-PRODUCT-FACTORY.md` — generic factory contract
- `docs/architecture/08-DATABASE-SVG-CONTRACT.md`  
- `Failures.md` — active blockers  
- `agent-reports/ADMIN.md` — track notes  

---

## Part C — Order factory (fields → SVG → place) — GROW AS NEEDED

**Status:** PARTIAL (Maker pen + guest identity unit green; C3/C4 browser OPEN)  
**Live pen = Maker.js.** Template residual only.  
**Code map:** `FEATURES.md` · **Tasks:** `IMPLEMENTATION-PLAN.md` · **Stack:** `REALITY-AND-STACK.md`

**Owner-aligned model:** exact client options close orders; form not free invent; library as you go; Maker only; reuse Planner place/BOQ; Supabase+R2 dual intent; **no owner blockers**.

**Current owner lock:** generic product shell; existing `AdminSvgDockHost` factory preset; React Aria controls; Tailwind v4 with all new CSS under `site/app/css/core/locked/`; first production drawer = configurable desk assembly (linear/U, workstation count, aisle, dimensions, options). See `../../docs/architecture/13-PARAMETRIC-PRODUCT-FACTORY.md`.

**Code truth:** form/CLI/publish → `drawLinearDesk` → Maker; guest `oando-…` slug/SKU + live lifecycle unit-green. **NEXT:** C3 browser (160 cm → publish → disk) → C4 place/BOQ.

**Ship Linear desk v1 (done enough)** — all required before C5 polish / C6 types / C-AI product claim:

| Gate | Required |
|------|----------|
| K1 + K2 | Maker-only pen; unit proves it |
| K3 | Form knobs match schema (or explicit defaults policy) |
| C3 browser | 160 cm → preview → publish → `svg-catalog` + descriptor |
| C4 browser | Guest place + BOQ name/SKU at **1280** and **390** |

Planner **toolbars stay** Fabric + Dockview + React Aria (no rebuild).

### Stack (locked — one line)

| Layer | Choice |
|-------|--------|
| **Engine pen** | **Maker.js** only — do not switch pens |
| **Brain** | Eng type drawers (schema + draw functions) |
| **Client** | Forms only (no code) |
| **Canvas** | Fabric (keep) |
| **Chrome** | Dockview + React Aria (keep) |
| **AI** | Optional **field draft** only (C-AI). Never geometry. **A is not AI** |

**One line:** Maker.js. Build drawers on it. Don't switch pens. AI may suggest fields after C2 — never paths.

### GitHub / npm links (approved stack)

| Component | Role | Link | Pin (site) |
|-----------|------|------|------------|
| **This monorepo** | Product + planner import paths | https://github.com/mayoite/12072026 | origin |
| **Maker.js** | Geometry pen (only) | https://github.com/microsoft/maker.js · npm `makerjs` | `^0.19.2` |
| **Fabric.js** | Planner canvas place (keep) | https://github.com/fabricjs/fabric.js · npm `fabric` | `7.4.0` |
| **Excalidraw** | Admin draft studio only | https://github.com/excalidraw/excalidraw · npm `@excalidraw/excalidraw` | `^0.18.1` |
| **Dockview** | Shell chrome (keep) | https://github.com/mathuo/dockview | lockfile |
| **React Aria** | A11y chrome (keep) | https://github.com/adobe/react-spectrum | lockfile |

**Do not add as product core:**

| Avoid | Link (reference only) | Why |
|-------|----------------------|-----|
| react-planner | https://github.com/cvdlab/react-planner | Whole planner app — duplicates ours |
| Free “furniture plan engines” | various GitHub | No fields→pro Oando library |

### Import / reuse (planner + Maker) — locked

**Meaning:** reuse **this monorepo’s planner packages** and **Maker.js from npm**.  
**Not meaning:** pull in a whole GitHub floorplanner / react-planner / competitor app.

| Source | Import / reuse | Do not |
|--------|----------------|--------|
| **Planner (repo)** | `features/planner/model/units.ts` (mm/cm) | Rebuild unit convert in Admin |
| **Planner (repo)** | `features/planner/asset-engine/svg/*` (Maker recipes, makerJsToPath, normalize, compileSvgForPublish) | Fork a second asset-engine under admin-only |
| **Planner (repo)** | Catalog types / publish IR (`svgTypes`, descriptors) | Invent a parallel product schema |
| **Planner (repo)** | Fabric place path for C4 (published SVG URL) | Re-draw symbols on canvas |
| **GitHub / npm** | **`makerjs` only** (already in `site/package.json`) | New geometry pen (Paper, Konva host, etc.) |
| **GitHub apps** | — | react-planner, Sweet Home, Archilogic SDKs |

**Rules:**

- [ ] Admin parametric **imports** planner `units` + asset-engine draw/Maker — no duplicate convert/draw stacks.  
- [ ] Form preview and publish call the **same selected** Maker drawer; current compatibility path is `drawLinearDesk`.
- [ ] No new npm geometry engine without owner + `docs/architecture/12-DEPENDENCIES-ENGINES.md` update.  
- [ ] No vendor UI that replaces Dockview / Fabric / Admin shell.

### C0. Product rules (non-negotiable)

- [ ] Client never writes code, recipes, or path data.  
- [ ] Client: pick **type** → fill **fields** → live preview → publish.  
- [ ] Canonical storage unit = **mm** (matches planner document).  
- [ ] UI may show/edit **mm or cm**; convert at boundary (`displayValueToMm` / `mmToDisplayValue` in `features/planner/model/units.ts`).  
- [ ] Published SVG always mm viewBox + image-safe hex fills.  
- [ ] Greys / old maker blobs not sold as "done" brand inventory.  
- [ ] New type = new drawer + schema (eng). Client cannot invent unlimited topology without eng.  
- [ ] Geometry pen = **Maker.js** only for this track (no Paper switch, no freehand publish truth).

### C1. Units: mm and cm

**Facts already in repo:**

| API | Role |
|-----|------|
| Document / SVG / geometry | **mm** only |
| `displayValueToMm` / unit mm\|cm\|m\|in | Form → canonical |
| `mmToDisplayValue(mm, unit)` | Canonical → form |
| `mmToPlannerCm` / `plannerCmToMm` | cm helpers |

**Code:** `features/planner/model/units.ts` · form model `features/admin/svg-editor/parametric/linearDeskFormModel.ts`

**Rules for Admin forms:**

- [ ] Each linear field stores **mm** in product JSON / descriptor.  
- [ ] Form control: label shows unit; input value in selected display unit.  
- [ ] On blur/save: parse number → `displayValueToMm` → prefer whole mm.  
- [ ] Prefer **cm** for marketing-friendly UX; always convert to mm before draw/publish.  
- [ ] Height fields mm canonical; plan draw may ignore height until 3D.  
- [ ] No dual storage of cm+mm that can drift.  
- [ ] Unit tests: 160 cm → 1600 mm; 1400 mm → 140 cm; round-trip stable.

### C2. Type 1 — Linear desk (fields + drawer)

#### Critic blockers (must clear before C2/C3 PASS)

| Id | Blocker | Required fix | Status |
|----|---------|--------------|--------|
| **K1** | Form/publish/CLI must use Maker only | One API: `drawLinearDesk(fields)` = Maker; form + CLI + publish all call it | unit-green |
| **K2** | “via Maker” needs unit proof | Unit proves Maker part ids; template not form pen | unit-green |
| **K3** | Form UI missing schema knobs | Model + UI bind all schema mm knobs incl. topGap/backInset | unit-green — browser OPEN |

- unit-green: **K1** closed: no second pen on parametric path (unit: `drawLinearDesk.test.ts` + compile)  
- unit-green: **K2** closed: unit proves Maker path (`compileLinearDeskSvg` asserts Maker ids, no frame)  
- unit-green: **K3** closed: form UI + model = schema 1:1 (pedestalTopGap + pedestalBackInset controls)  

#### Fields (exact live schema — v1)

Source: `site/features/planner/asset-engine/svg/parametric/linearDeskFields.ts`  
(`LinearDeskFieldsSchema`)

| Field | Unit store | Notes (schema) |
|-------|------------|----------------|
| type | literal | `linear-desk` |
| widthMm | mm | 600–3000 |
| depthMm | mm | 400–1200 |
| heightMm | mm | 400–1200; default 750; BOQ |
| topThicknessMm | mm | plan worksurface strip; default 120 |
| pedestalWidthMm | mm | each; default 200 |
| pedestalInsetMm | mm | from side edges; default 120 |
| pedestalTopGapMm | mm | below top band; default 40 |
| pedestalBackInsetMm | mm | from back; default 80 |
| pedestalCount | 0 or 2 | default 2 |
| modesty | bool | default false |
| seriesId | text | optional; max 64 |
| name | text | optional; max 120 |
| sku | text | optional; max 64 |
| slug | text | optional; `/^[a-z][a-z0-9-]{1,63}$/` |
| (display only) | mm or cm | form session unit — not stored as parallel geometry |

**Fit constraints (Zod superRefine):** dual pedestals need width ≥ `2*inset + 2*pedestalWidth + 40`; depth ≥ `top + topGap + 40 + backInset`.

- unit-green: Zod `LinearDeskFieldsSchema` + constraints remain green.  
- unit-green: `drawLinearDesk(fields)` via **Maker.js only** → multipath parts (`desk-top`, `pedestal-l`/`pedestal-r`, modesty when set).  
- unit-green: Map full schema knobs into Maker recipe (`fieldsToLinearDeskMakerRecipe` → recipe insets).  
- [ ] Quality bar: at **40px thumb** reads as desk; meet or beat `sample-desk-1` (browser / visual OPEN).  
- unit-green: `fields → SVG string` (sanitize via existing pipeline helpers).  
- unit-green: Unit: change width 1400→1800 regenerates different valid SVG.  
- unit-green: CLI: `scripts/render-linear-desk.mts` → isolation/`results` default; `--catalog` owner only.  
- unit-green: **Delete dual authority:** form/CLI/publish use Maker only; template deprecated residual only.

**Paths (live):**

| Role | Path |
|------|------|
| Schema | `features/planner/asset-engine/svg/parametric/linearDeskFields.ts` |
| Template draw (**deprecated residual — not publish pen**) | `…/drawLinearDeskFromTemplate.ts` |
| Maker draw (**live pen**) | `…/drawLinearDesk.ts` — `drawLinearDesk` / `renderLinearDeskSvg` |
| Barrel | `…/parametric/index.ts` (Maker pen) |
| Maker recipes | `features/planner/asset-engine/svg/makerJsRecipes.ts` — `buildLinearDeskMakerModel`, `buildLDeskMakerModel`, `buildMakerModel` |
| Maker → path | `features/planner/asset-engine/svg/makerJsToPath.ts` — `compileMakerRecipeToPaths` |
| Form model | `features/admin/svg-editor/parametric/linearDeskFormModel.ts` |
| Form UI | `features/admin/svg-editor/parametric/LinearDeskParametricForm.tsx` |
| Compile | `features/admin/svg-editor/parametric/compileLinearDeskSvg.ts` |
| Publish | `features/admin/svg-editor/parametric/publishLinearDeskAction.ts` |
| Route | `app/admin/svg-editor/parametric/page.tsx` → `/admin/svg-editor/parametric` |
| CLI | `scripts/render-linear-desk.mts` |
| Sample bar | `public/svg-catalog/sample-desk-1.svg` |
| Units | `features/planner/model/units.ts` |

### C3. Admin shared-shell operator UI

**Paths:** `features/admin/svg-editor/parametric/*` · route **`/admin/svg-editor/parametric`** · list CTA on SVG inventory (`AdminSvgEditorListView.tsx`).

| UI element | Target behavior | Live today |
|------------|-----------------|------------|
| Type select | Explicit product manifest/registry; production `desk-assembly` first | linear-desk only |
| Product inputs | Drawer-defined sections; desk assembly covers linear/U, workstation count, aisle, dimensions, options | **K3 unit:** linear desk pedestal fields bound |
| Unit toggle | mm / cm via `units.ts` | Wired (form model) |
| Live preview | Same selected **Maker** drawer as publish | Maker `renderLinearDeskSvg` (K1 unit) |
| Validation | Zod under fields | Wired for bound fields |
| Publish | Confirm → disk (+ dual-write if enabled) | Disk via `publishLinearDeskAction`; Maker SVG; **browser OPEN** |
| Suggest fields | **C-AI** after C2 | Not implemented |

**Checklist:**

- unit-green: **K1–K2 unit unblocked** form/publish use Maker draw (browser C3 still required).  
- unit-green: Form fields cover full C2 schema (exact Zod names / display aliases).  
- unit-green: mm/cm toggle wired to `units.ts`.  
- unit-green: Preview always code-drawn (**Maker** only) — unit.  
- unit-green: Publish disabled while invalid or preview failing (code).  
- [ ] **Browser gate:** create a U desk assembly with 12 workstations and 1200mm aisle → preview OK → publish → isolated SVG + descriptor.
- [ ] Console errors = 0; failed requests = 0 on that journey.  
- [ ] No client-side LLM keys.  
- [ ] Auth: admin only (existing gates).  
- [ ] Publish freezes SVG + identity; lifecycle draft→live policy unchanged.  
- [ ] Guest visibility: published parametric product is buyer/approved-visible for C4.

### C4. Planner consume

**Load rule (define + implement before C4 PASS):** On publish, parametric product must become **guest-placeable** without demo pollution — e.g. set buyer/approved lifecycle (or explicit `planner_managed` / published pointer) so catalog loaders that already filter brand/approved include `{slug, previewUrl: /svg-catalog/{slug}.svg}`. Document the exact flag/path in FEATURES when coded. Until then C4 stays OPEN even if C3 disk write works.

- [ ] Catalog loader includes approved parametric products (slug + preview URL).  
- [ ] Guest filter still brand/approved only (no demo pollution).  
- [ ] Place: Fabric paints published SVG (not Block2D miss for these slugs) — **existing toolbars**, no new chrome.  
- [ ] BOQ / review: **name · SKU** from product fields.  
- [ ] **Browser gate:** proof **1280** and **390** — inventory thumb + place desk.  
- [ ] Console errors 0 / failed SVG requests 0 on that journey.

### C5. Finesse (professional bar — after C2 green)

- [ ] Stroke width scales with min(W,D) (clamp e.g. 10–28 mm plan stroke).  
- [ ] Role fills: top darker; pedestals mid; frame stroke-only.  
- [ ] Series presets: Fluid vs Flex default field sets differ.  
- [ ] Inventory thumb and canvas use **same** published SVG bytes.  
- [ ] Form: clear errors when pedestals do not fit.  
- [ ] No `currentColor` / `var(` in published fills.  
- [ ] Optional outer frame stroke weight matches sample-desk readability.  
- [ ] Document facing convention when chair type arrives (C6).

### C6. Later types (gate: C2–C4 green for desk)

Each type = **new schema + new Maker drawer + form switch**. No mega-generic drawer. No pen switch.

| Order | Type | Template language (min) |
|-------|------|-------------------------|
| 1 | Meeting rect | Top + 4 leg posts (positive fills) |
| 2 | Task chair | Seat + back + base; facing |
| 3 | Storage bays | Carcass + door bays |
| 4 | L-desk | Main + return (`buildLDeskMakerModel` exists) |

- [ ] Do not start another production drawer until desk assembly is client-usable through C3–C4.
- [ ] Each type: schema + Maker draw + unit + form option + one browser place.

### C7. Non-goals (locked)

- Rebuild Fabric toolbar / Dockview shell  
- Paid $80k configurator  
- Client invents unlimited topology without eng  
- AI geometry / AF-11 freeform SVG generate as publish truth  
- DB cutover / `SVG_RELEASE_AUTHORITY=db` as substitute for drawings  
- "All possible fields for all furniture" on day one  
- Photoreal 3D first  
- Switching geometry pen off **Maker.js**  
- Importing react-planner or full GitHub planner apps  

### C-AI. AI assist (draft fields only — **not** the pen)

**A is not AI.** Engine pen stays **Maker.js**. AI never owns geometry.

| AI may | AI must not |
|--------|-------------|
| Suggest **fields** (JSON → Zod) | Emit path `d` / multipath / SVG as publish truth |
| Suggest **name / SKU / slug** | Auto-publish or write `svg-catalog` |
| Soft QA text | Invent new topology / types |
| | Replace mm/cm convert (use `units.ts`) |
| | Be required for form/preview/publish |

**Flow (after C2 + form shell C3):**

```text
[Suggest fields] → LLM JSON (untrusted)
    → LinearDeskFieldsSchema + fit
    → if fail: show errors, no apply
    → if ok: fill form as DRAFT (badge)
    → human edits
    → preview = Maker drawLinearDesk(fields) only
    → publish = human + server freeze
```

- [ ] **C-AI.0** C2 unit green before AI on any publish-adjacent path.  
- [ ] **C-AI.1** "Suggest fields" → untrusted JSON → Zod + fit → **form draft only**.  
- [ ] **C-AI.2** Preview + publish use **only** Maker `drawLinearDesk` (same as C3).  
- [ ] **C-AI.3** Publish only after human accept + preview OK; no silent apply.  
- [ ] **C-AI.4** Unit: valid draft applies; invalid rejected; AI schema **excludes** path/SVG fields.  
- [ ] **C-AI.5** Kill switch: if AI delays C2/C3, remove AI work; ship desk.  
- [ ] **C-AI.6** (Later) Eng-only type-template assist off publish path + goldens.  
- [ ] **C-AI.7** Admin works with AI disabled / missing keys (fail-open).

**Verdict locked:** **DEFER-UNTIL-C2**, then **ADD-MINIMAL** only.

### C8. Timeline honesty

| Milestone | Rough |
|-----------|--------|
| C1+C2 desk fields + Maker drawer + script | days–weeks |
| C3 Admin forms + preview | + weeks |
| C4 browser place + BOQ | + weeks |
| C5 finesse pass | ongoing |
| **C-AI** suggest fields | After C2; small |
| C6 few more types | months |

**Forever if:** unlimited types + unlimited options + pro craft + zero eng budget.  
**Not forever if:** type 1 done, then type 2 — scoped.

**C2 alone ≠ weeks.** End-to-end client-usable (C3–C4) ≈ weeks.

### C9. Agents / process

- [ ] One implementer at a time on this track.  
- [ ] Parent re-runs unit + browser when claiming.  
- [ ] Update this Part C statuses only with evidence.  
- [ ] FEATURES.md: keep "Parametric library" + Maker rows when code lands.  
- [ ] C-AI does not block C2–C4 ship (C-AI.5 kill switch).  
- [ ] Commit verified slices so work is not lost; push only if owner asks.

### Commands

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/asset-engine/svg/parametric tests/unit/features/admin/svg-editor/parametric tests/unit/features/planner/asset-engine/svg/makerJsRecipes.test.ts
pnpm --filter oando-site run scripts:render-linear-desk -- scripts/generate-svg/_fixtures/linear-desk-param.json
pnpm run dev
# /admin/svg-editor/parametric
# /planner/guest/
pnpm run check:layout
pnpm run check:plans-purity
```
