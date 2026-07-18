# TechStack checklist

**Status:** OPEN  
**Pair:** `FEATURES.md` = live code map (feature → path → gap).  
**This file:** all-encompassing execution document for the track  -  evidence rules **and** full phase checklist (what is required, what exists, what is open).  
**Active blockers:** `../../Failures.md`  
**Doc set:** only `CHECKLIST.md` + `FEATURES.md` per track.

---

## Part A  -  Evidence and completion rules

_Evidence and completion rules. Wins on how to prove done._

**Status:** OPEN  
**Authority:** This file is the **execution contract** for **toolchain, engines, workspace, CI, and dependency health**.  
**Relation to plan files:**  
- `Part B (phase checklist in this file)`  -  same phase journey (**T0–T8**) and **TF** failure registry; detailed checklists  
- `FEATURES.md`  -  live code map (engines, scripts, env **names**, CI → path → gap)  
- Where this file and `Part B (phase checklist in this file)` conflict on **how to prove done**, **this file wins**  
- Phase scope and TF ids stay **1:1** with `Part B (phase checklist in this file)`  

**Relation to fact docs:**  
- `docs/Lockedfiles/03-dependencies-engines-current.md`  -  architectural limits  
- `docs/architecture/11-RUNTIME-ARCHITECTURE.md`  -  live runtime shape  
- `docs/architecture/08-DATABASE-SVG-CONTRACT.md`  -  DB/R2 SVG target  
- `docs/architecture/10-SECURITY-BENCHMARK.md`  -  security release IDs  
- Root / `site` `package.json` + lockfiles  -  **version authority**  

Where a fact doc and this file conflict on **how to prove done**, **this file wins**.  
Where they conflict on **which package version is installed**, **lockfile wins**.

**Not:** Site copy, Planner canvas features, Admin product UX. Those use their own contracts.  
**Agent reports:** `../../agent-reports/TECH-STACK.md` + short dated slices (≤40–50 lines).

---

## 1. Outcome

A **maintainable, installable, releasable monorepo** where:

1. **One install path**  -  pnpm from repo root; Node and pnpm pins are real and **CI-aligned**.  
2. **Engines stay singular**  -  one interactive 2D engine, one 3D stack, one admin SVG authoring embed, server owns publish.  
3. **Dependencies earn their keep**  -  direct deps have live imports or documented build roles.  
4. **Gates are honest**  -  layout, lint, typecheck, test, build, secrets, release:gate are runnable and green for release claims.  
5. **Secrets and envs**  -  never in git; `.env.local` pattern enforced; names only in docs.  
6. **Storage and DB clients**  -  match locked policy (Drizzle/postgres, R2 via S3 API, no new unauthorized stack for DB-SVG).  
7. **Docs stay thin**  -  stack policy not duplicated as fiction; FEATURES tracks code.

**Benchmark:** Stripe/Vercel-class monorepo hygiene (reproducible installs, strict CI, lockfile truth)  -  not their product UI.

---

## 2. Truth rules (non-negotiable)

| Rule | Meaning |
|------|---------|
| Lockfile wins for versions | Not chat memory, not outdated MD |
| Code wins for engines | Live imports prove the engine list |
| Fresh command wins for gates | Exit 0 in the claiming session |
| Unit ≠ release | Green unit suite is not full `release:gate` |
| `results/` is not proof | Raw output only |
| OPEN / FAIL / PASS / PARTIAL | Same vocabulary as Planner/Site contracts |
| No nested installs | Never `pnpm install` inside `site/` or `tech-docs-generator/` |
| No second canvas engine | Fabric only for interactive 2D |
| No competitor stack | No competitor packages, assets, or trade dress |
| Secrets | `.env.local` / platform secrets only |
| Plan ticks ≠ PASS | FEATURES/FINISH checkboxes need §2.1 evidence |

### 2.1 What counts as PASS

All that apply:

1. **Policy** written in Lockedfiles / architecture docs matches code.  
2. **Automated proof**  -  named command exit 0.  
3. **Dependency claim**  -  `pnpm why` / import grep / lockfile entry shown when asserting “in use” or “removed”.  
4. **CI claim**  -  workflow file path + pin equals root `packageManager` intent + last green or local repro of same script.  
5. **No silent pin drift**  -  root `packageManager` and CI pnpm pin agree.  
6. Status flipped only with that evidence.

**PARTIAL** = policy or code written, gate not green, or env-dependent.

---

## 3. Evidence protocol

### 3.1 Gates (stack release / “stack healthy” claim)

From **repo root**. All exit **0** for a full stack PASS:

| Gate | Command |
|------|---------|
| Layout | `pnpm run check:layout` |
| Failures file | `pnpm run check:failures` |
| Agents / docs purity | `pnpm run check:agents-md`  /  `check:agents-folder`  /  `check:active-docs`  /  `check:plans-purity`  /  `check:docs-purity` |
| Fast monorepo gate | `pnpm run gate` |
| Lint | `pnpm run lint` |
| Typecheck | `pnpm run typecheck` (stable; no missing `.next/dev/types` race) |
| Unit | `pnpm run test` |
| Secrets | `pnpm run lint:secrets` |
| Sharp / native | `pnpm run check-sharp` (as required by build) |
| Build | `pnpm run build` |
| Full release | `pnpm run release:gate` (turbo → site `release:gate`) |
| Fast release | `pnpm run release:gate:fast` (PR path) |
| Tech-docs (if claimed) | `pnpm run tech-docs:gate` |

Product tracks may ship features under FAIL gates only if owner accepts **OPEN** release.  
**Stack contract PASS** requires the table above (or owner-documented subset with explicit waiver in `Failures.md`).

### 3.2 Report shape

`agent-reports/YYYY-MM-DD-techstack-<slice>.md` (≤50 lines) + INDEX.

```text
# Title
Verdict: PASS | PARTIAL | FAIL | OPEN
Evidence: commands + exits + package names
Done / Not done
```

### 3.3 Agents

Implementer changes toolchain or deps → parent re-runs install-from-clean reasoning, `gate`, and dependency proof.  
No “removed unused package” PASS without lockfile + import grep evidence.  
No FINISH checkbox PASS without parent evidence in the same session.

---

## 4. Scope boundary

### In

| Area | Path / surface |
|------|----------------|
| Package manager | Root `package.json` `packageManager`, `pnpm-workspace.yaml`, install guards |
| Node engine | `engines.node` ≥24 |
| Workspace packages | `site/` (`oando-site`), `tech-docs-generator/` (`oando-tech-docs`) |
| Canvas / 3D / SVG engines | Fabric (2D); Three + R3F + Drei (3D); Excalidraw (admin draft); Maker.js (parametric pen — Admin K1 OPEN, form still template) |
| CSS toolchain | Tailwind / postcss / locked CSS tree under `site/app/css/` |
| Next runtime | Next 16 app router, Vercel root = `site` |
| Test runners | Vitest, Playwright configs under `site/config/build/` |
| CI | `.github/workflows/*` pins aligned to root |
| Secrets lint | secretlint scripts |
| Turbo | `turbo.json` release orchestration |
| Env contract | `.env.example` vs `lib/env.server.ts` vs `validate-launch-env.mjs` (**names only**) |
| DB clients | Drizzle, postgres, Supabase clients (boundaries only) |
| Object storage | R2 via AWS S3 SDK policy |
| i18n stack | next-intl only on Site |
| Direct dependency hygiene | Live import or build role |

### Out

- Feature work inside Planner/Site/Admin product UX (use those contracts).  
- Content of BOQ / catalog SKUs.  
- Choosing commercial price authority (product).  
- Restoring production data (ops runbooks).

### Cross-track

| Dependency | Owner |
|------------|--------|
| DB-SVG cutover incomplete | Architecture + Failures.md  -  stack must not pretend R2/DB is live authority |
| DEV_AUTH_BYPASS | Stack must keep production-disabled; Site/Admin prove auth |
| Windows dev | `pool: 'forks'` Vitest; PowerShell scripts  -  stack must not assume only Unix |

---

## 5. Non-negotiable stack decisions

| Decision | Rule |
|----------|------|
| Install | Root only; `preinstall` guard |
| Linker | Hoisted as configured; no nested lockfiles |
| 2D | Fabric sole interactive engine |
| 3D | Three.js + R3F + Drei helpers only |
| Admin SVG UI | `@excalidraw/excalidraw` embed; host owns publish |
| Parametric pen | Maker.js only (locked); not a second canvas. Form pen still template until Admin K1 |
| Publish truth | Server compile + sanitize  -  not client engine |
| Site i18n | `next-intl` only; Planner/Admin English only |
| Catalog DB access | Drizzle + postgres for Products work; no new `.from()` catalog paths |
| Artifacts | R2 via AWS S3 client for immutable artifacts (target); live SVG disk until cutover |
| Runtime writes | No production writes under `site/public` for generated GLB |
| Handwritten `any` | Forbidden in product/test source |
| Licenses | Verify before add; paid assets approved |
| CI pins | pnpm action version matches root `packageManager` major.minor.patch intent |

---

## 6. External benchmark (capability only)

| Bar | Expectation |
|-----|-------------|
| Reproducible install | Clean CI from lockfile without manual steps |
| Supply chain | Pin managers; secret scan; no secrets in tree |
| Engine monoculture | One primary solution per problem (canvas, router, i18n) |
| Release evidence | SEC-REL-01…05 spirit: versions recorded, gates pass or Failures.md active |
| Type safety | `tsc --noEmit` green on product package |

---

## 7. Failure registry

**Canonical ids for execution:** **TF-01…TF-24** in `Part B (phase checklist in this file)`.  
**Synonyms:** **TS-01…TS-22** = TF-01…TF-22 (same bar). Prefer TF in finish reports.

Statuses: **PASS** | **PARTIAL** | **FAIL** | **OPEN**.

| ID | Failure | Bar to clear | Status seed (2026-07-17 inventory) |
|----|---------|--------------|-------------------------------------|
| TS-01 / TF-01 | Nested install possible / used | Guard + CI only root install | OPEN |
| TS-02 / TF-02 | pnpm pin drift (root vs CI) | packageManager 11.13.0 = CI action version | **PASS** (CI 11.13.0, T-W1) |
| TS-03 / TF-03 | Node engine violated in CI image | Node ≥24 on CI | PARTIAL |
| TS-04 / TF-04 | Second 2D canvas engine introduced | Fabric-only grep clean | PARTIAL |
| TS-05 / TF-05 | Direct dep with no import / role | Remove or document | OPEN |
| TS-06 / TF-06 | `release:gate` / `gate` not green | Fresh exit 0 | OPEN |
| TS-07 / TF-07 | Typecheck flakes on `.next/dev/types` | Stable tsc story (exclude or generate) | OPEN |
| TS-08 / TF-08 | Secrets in tree | `lint:secrets` exit 0; no committed secrets | OPEN |
| TS-09 / TF-09 | Env example drift | `.env.example` covers required server keys (names only) | PARTIAL  -  FEATURES env table; OpenAI optional |
| TS-10 / TF-10 | DB-SVG marketed as live authority | Failures.md + Lockedfiles honest; disk live | PARTIAL |
| TS-11 / TF-11 | Dual-write incomplete treated as PASS | Dual-write proved or OPEN | OPEN |
| TS-12 / TF-12 | Tech-docs broken / unowned | tech-docs gate green or package optional documented | OPEN |
| TS-13 / TF-13 | Sharp / native binary broken on Windows | `check-sharp` + build | OPEN |
| TS-14 / TF-14 | Playwright / Vitest misconfig for Windows | forks pool; paths work | PARTIAL |
| TS-15 / TF-15 | Turbo cache hides real FAIL | Clean run or cache-bust proof | OPEN |
| TS-16 / TF-16 | License / competitor package risk | Audit list; none present | OPEN |
| TS-17 / TF-17 | i18n second framework introduced | next-intl only | PARTIAL |
| TS-18 / TF-18 | Supabase client boundary violated | No new catalog `.from()` paths | OPEN |
| TS-19 / TF-19 | Production GLB or publish writes `site/public` | Code path 501 / storage only | PARTIAL |
| TS-20 / TF-20 | Docs budget broken / stack fiction in docs | Lockedfiles matches code; plan duo present | PARTIAL |
| TS-21 / TF-21 | Install/docs claim pnpm@11.13 but CI differs | Align pins | **PASS** (T-W1) |
| TS-22 / TF-22 | Hoisted monorepo phantom deps | No app import of undeclared package | OPEN |
| TF-23 | CI logs under `site/results/` | Prefer root `results/` | PASS  -  workflows tee to `results/tooling` / `results/site` (90b55c74) |
| TF-24 | Fast gate CI timeout | Job succeeds or timeout adjusted with proof | OPEN |

---

## 8. Execution phases (T0–T8)  -  1:1 with Part B phases (phases)

Checklists live in `Part B (phase checklist in this file)`. Contract summary:

| Phase | Name | Exit |
|-------|------|------|
| **T0** | Inventory and honesty | Honest TF registry + FEATURES snapshot |
| **T1** | Install and workspace | Clean install; **CI pnpm = packageManager** |
| **T2** | Engine monoculture | Grep policy clean |
| **T3** | Dependency hygiene | TF-05 clear for site |
| **T4** | Type, lint, unit stability | lint + typecheck + test exit 0 |
| **T5** | Security and secrets | secretlint + env contract |
| **T6** | Build and release | build + release:gate honest |
| **T7** | Data plane clients | Lockedfiles persistence matches code; disk SVG honesty |
| **T8** | Docs and ops closure | Reproducible from Readme + lockfile |

### Order

```text
T0 inventory
  → T1 install/workspace
    → T2 engines
      → T3 deps
        → T4 lint/type/test
          → T5 secrets/security
            → T6 build/release
T7 data clients (parallel after T1; honesty continuous)
T8 docs (continuous; gates release claim)
```

---

## 9. Required proof matrix

| Claim | Minimum proof |
|-------|----------------|
| “pnpm only” | Guard script + CI uses pnpm |
| “pnpm pin aligned” | Root `packageManager` string matches CI `pnpm/action-setup` version |
| “Node 24” | engines field + CI node version |
| “Fabric only 2D” | No konva/paper/pixi interactive imports in site |
| “No public GLB write” | Route/storage tests exit 0 |
| “Deps clean” | Each direct dep: import path or BUILD-ROLE note in Lockedfiles |
| “Release ready stack” | §3.1 full table green |
| “DB is SVG authority” | **Forbidden** until 08-contract cutover proved |

---

## 10. How this exceeds Lockedfiles alone

| Area | Lockedfiles / runtime docs | This contract + CHECKLIST Part B (phases) |
|------|----------------------------|----------------------------|
| Facts | Version/policy statements | **PASS recipe** + commands |
| Engines | Table | Phase T2 + FEATURES paths + grep proof |
| Deps | Prefer existing | TF-05 + audit phase |
| CI | Mentioned loosely | §3.1 + FEATURES CI table + TF-02 |
| Failures | Failures.md generic | **TF/TS registry** |
| Agents |  -  | Parent re-verify + short reports |
| False completion | Easy if MD outdated | Lockfile + exit 0 required |

---

## 11. Immediate priority queue

1. **T0** complete with recorded gate exits.  
2. ~~**TF-02 / TF-21**~~  -  CI pnpm **11.13.0** (**PASS**, T-W1).  
3. **TF-07**  -  stabilize typecheck (`.next/dev/types` race).  
4. **T4**  -  lint/typecheck/test green.  
5. **T3**  -  dead direct deps.  
6. **T6**  -  build + release:gate.  
7. **T7**  -  keep DB-SVG honesty (TF-10/11).  
8. **T8**  -  Lockedfiles sync when anything engine-related lands.

---

## 12. Owner acceptance

Tech stack is **complete** (healthy for release) only when:

1. §3.1 gates all green (or each miss is an active `Failures.md` item with owner accept).  
2. No Critical TF open (nested install, secret leak, second canvas engine, false DB authority, **silent pin drift**).  
3. Lockedfiles + 11-RUNTIME match live imports and lockfile.  
4. `FEATURES.md` paths still resolve.  
5. Another engineer can install and pass `pnpm run gate` from clean clone instructions in `Readme.md`.

Until then: **Status remains OPEN.**

---

## Part B  -  Phase checklist (full)

_Full phase checklist: what is required, what exists, what is open._

Status: **OPEN**.

**Proof bar:** Evidence section above + FEATURES.md code paths. PASS needs same-session proof.

Owner instruction: toolchain, gates, env honesty, dependency and engine health only. No Planner canvas, Admin SVG UX, or Site marketing work here.

## Outcome

A maintainable, installable, releasable monorepo:

1. One install path (pnpm root; Node ≥24).
2. Singular engines (Fabric 2D, Three stack 3D, Excalidraw admin embed).
3. Dependencies with live role or documented build role.
4. Honest gates  -  exit 0 in the claiming session.
5. Secrets only in `.env.local` / platform secrets.
6. Data clients match Lockedfiles; **disk** remains live SVG authority until cutover proved.
7. Thin docs; stack policy not fiction.

## Truth rules

- Lockfile wins versions.
- Code wins engines.
- Fresh command wins gates.
- Unit green ≠ `release:gate` PASS.
- `results/` is not proof.
- OPEN = unverified. FAIL = fresh fail. PASS = evidence in same session.
- PARTIAL = policy or partial code without full gate.
- No silent skips. No handwritten `any` in product/test source.
- Never print secret values. Env **names** only in plans and reports.

## Scope

**In:** root/site package managers, CI pins, engines, test runners, env contract, health API, R2/DB client boundaries, tech-docs ownership, layout/purity scripts, stack plan docs.

**Out:** Planner product features, Admin catalog UX, Site copy/SEO, commercial price authority, restoring production data.

## Phase checklist

Every item starts unchecked. Flip only with CHECKLIST Part A (evidence) proof.

### T0  -  Inventory and honesty

- [PASS] Snapshot root + site engines from package.json vs lockfile (FEATURES + FIX-TECHSTACK 2026-07-17).
- [PASS] Confirm live Fabric / Three / Excalidraw imports (FEATURES inventory).
- [PASS] List stack-related `Failures.md` blockers (DB-SVG disk live).
- [PASS] Diff Lockedfiles persistence/engines vs code (FEATURES).
- [PASS] Record pnpm root pin vs CI pin (TF-02 cleared 2026-07-17 T-W1: CI 11.13.0).

**Exit:** Honest TF registry.  
**Proof:** short inventory + commands in agent report.

### T1  -  Install and workspace

- [PASS] Root-only install documented and guarded.
- [PASS] Workspace packages only: `site`, `tech-docs-generator`.
- [PASS] No nested `package-lock` under workspace packages.
- [PASS] Node ≥24; pnpm pin match CI intent (root + CI **11.13.0**, T-W1).

**Exit:** Clean install from lockfile reproduces.  
**Proof:** `pnpm install` / frozen install exit 0; guard evidence.

### T2  -  Engine monoculture

- [PASS] Fabric only for interactive 2D.
- [PASS] Three stack only for 3D.
- [PASS] Excalidraw only for admin SVG studio embed.
- [PARTIAL] Maker.js present for parametric recipes; Admin form still template multipath (Admin K1 OPEN — product track).
- [PASS] No second i18n framework on Site.

**Exit:** Grep policy clean.  
**Proof:** import inventory in report.

### T3  -  Dependency hygiene

- [PARTIAL] Every direct `site` dependency has import or build role. (48/49 USED; model-viewer BUILD_ROLE CDN; 8 idle devDeps NO_IMPORT  -  T1 2026-07-17)
- [PARTIAL] Remove or justify dead deps. (idle listed in `agent-reports/2026-07-17-plan-T1.md`; none removed  -  owner cut/keep)
- [PASS] License check on additions. (no additions this session)
- [PASS] No competitor packages. (package-name scan clean)

**Exit:** TF-05 clear for site package.  
**Proof:** dep audit + lockfile.

### T4  -  Type, lint, unit stability

- [ ] `pnpm run lint` exit 0 (max-warnings 0). (FAIL this session: Planner files)
- [ ] `pnpm run typecheck` exit 0 (stable; no `.next/dev/types` race). (FAIL this session: PlannerFabricStage)
- [ ] `pnpm run test` exit 0 or FAIL list owned in Failures.md.
- [PASS] Windows Vitest `pool: 'forks'` preserved.
- [PASS] Health unit: `tests/unit/app/api/health/route.test.ts` exit 0 (FIX-TECHSTACK).

**Exit:** lint + typecheck + focused/full unit as claimed.  
**Proof:** command exits same session.

### T5  -  Security and secrets

- [PASS] `pnpm run lint:secrets` exit 0 (T-W3 2026-07-17).
- [PASS] `pnpm --filter oando-site run scan:secrets` exit 0 (T-W3).
- [PASS] `pnpm --filter oando-site run launch:env` exit 0 (T-W3).
- [PASS] `.env.example` lists required + FEATURES env names (no values); `DEV_AUTH_BYPASS` name documented T-W3.
- [PASS] AI chain documented: Gemini + OpenRouter primary/backup; OpenAI not required.
- [PASS] DEV_AUTH_BYPASS production-disabled path not regressed by stack changes (`isDevAuthBypassEnabled` forces false when `NODE_ENV===production`).

**Exit:** Secrets + env name contract honest.  
**Proof:** secretlint + env table names only.

### T6  -  Build and release

- [PASS] `pnpm run check-sharp` exit 0 (T-W3: sharp 0.35.2 / libvips 8.18.3).
- [ ] `pnpm run build` exit 0.
- [ ] `pnpm run release:gate` exit 0 **or** active Failures.md waiver with owner accept.
- [PASS] Vercel root = `site`.

**Exit:** Production artifact builds.  
**Proof:** build exit 0; deploy remains owner-only.

### T7  -  Data plane clients (boundary only)

- [PASS] Drizzle schemas present for owned tables.
- [PASS] R2 client uses intact S3 credential pair (names in FEATURES; preferred pair SET).
- [PASS] Live vs target SVG authority documented: **disk live** (Failures.md, Lockedfiles, `.env.example` `SVG_RELEASE_AUTHORITY`).
- [PASS] No false claim that Products DB/R2 is SVG release authority.
- [PASS] `GET /api/health` returns `{ ok: true }` without secrets (unit T-W3 exit 0).

**Exit:** Lockedfiles persistence table matches code; Failures.md DB-SVG honest.  
**Proof:** paths + Failures.md + health unit.

### T8  -  Docs and ops closure

- [PASS] Plan duo present: CHECKLIST + FEATURES only.
- [PASS] `check:plans-purity` allows TechStack duo CHECKLIST+FEATURES only (exit 0 FIX-TECHSTACK).
- [ ] Lockedfiles updated when engines change.
- [PASS] `pnpm run check:layout` exit 0 before claim done.
- [PASS] Agent track file `agent-reports/TECH-STACK.md` honest (OPEN/PARTIAL until gates).

**Exit:** Another engineer can install and run `pnpm run gate` from Readme.  
**Proof:** layout + purity + gate scripts.

## Current execution (2026-07-17)

| Phase | Status | Truth |
|---|---|---|
| T0 | PASS (inventory) | Engines inventoried; CI pnpm TF-02 **PASS** (T-W1) |
| T1 | PARTIAL | Guard + workspace; CI pin **11.13.0** (T-W1); install proof open |
| T2 | PASS (code map) | Fabric/Three/Excalidraw monoculture mapped |
| T3 | PARTIAL | Audit done (T1); 8 idle devDeps wait owner cut/keep; TF-05 OPEN |
| T4 | FAIL | lint exit 1, typecheck exit 2 (Planner paths); health unit 0 |
| T5 | PASS (T-W3 session) | lint:secrets 0; scan:secrets 0; launch:env 0; env names cover validate-launch + env.server + FEATURES |
| T6 | PARTIAL | check-sharp **PASS** (T-W3); build + release:gate **not** run  -  no stack healthy claim |
| T7 | PASS (honesty T-W3) | Health unit 0; disk SVG authority in Failures.md + Lockedfiles + .env.example |
| T8 | PARTIAL | Plan duo + purity; layout 0 (T-W3); full docs closure open |

**Stack healthy claim:** **forbidden** until Part A gates (evidence) is green or owner-waived in Failures.md.

## Failure registry (TF)  -  1:1 with Part A evidence (evidence)

Statuses: **PASS** | **PARTIAL** | **FAIL** | **OPEN**. Prefer **TF** ids in finish reports. **TS-n** = **TF-n** for n≤22.

| ID | Failure | Bar to clear | Status (2026-07-17) |
|----|---------|--------------|---------------------|
| TF-01 | Nested install possible / used | Guard + CI only root install | OPEN |
| TF-02 | pnpm pin drift (root vs CI) | packageManager 11.13.0 = CI action version | **PASS** (CI 11.13.0, T-W1) |
| TF-03 | Node engine violated in CI image | Node ≥24 on CI | PARTIAL |
| TF-04 | Second 2D canvas engine introduced | Fabric-only grep clean | PARTIAL |
| TF-05 | Direct dep with no import / role | Remove or document | PARTIAL (8 idle listed T1; not removed) |
| TF-06 | `release:gate` / `gate` not green | Fresh exit 0 | OPEN |
| TF-07 | Typecheck flakes on `.next/dev/types` | Stable tsc story | OPEN |
| TF-08 | Secrets in tree | `lint:secrets` exit 0 | **PASS** (T-W3: lint:secrets + scan:secrets) |
| TF-09 | Env example drift | `.env.example` covers required names | **PASS** (T-W3: validate-launch + env.server + FEATURES incl. DEV_AUTH_BYPASS) |
| TF-10 | DB-SVG marketed as live authority | Failures.md + Lockedfiles; disk live | **PASS** (honesty; disk still live; cutover remains open via TF-11) |
| TF-11 | Dual-write incomplete treated as PASS | Dual-write proved or OPEN | OPEN |
| TF-12 | Tech-docs broken / unowned | tech-docs gate or optional doc | OPEN |
| TF-13 | Sharp / native broken on Windows | `check-sharp` + build | PARTIAL (check-sharp PASS T-W3; build not run) |
| TF-14 | Playwright / Vitest Windows misconfig | forks pool; paths work | PARTIAL |
| TF-15 | Turbo cache hides real FAIL | Clean run or cache-bust | OPEN |
| TF-16 | License / competitor package risk | Audit list; none present | PARTIAL (competitor packages none; no license gate) |
| TF-17 | i18n second framework | next-intl only | PARTIAL |
| TF-18 | Supabase client boundary violated | No new catalog `.from()` | OPEN |
| TF-19 | Production GLB/publish writes `site/public` | 501 / storage only | PARTIAL |
| TF-20 | Docs budget / stack fiction | Lockedfiles + plan duo | PARTIAL |
| TF-21 | Docs claim pnpm@11.13 but CI differs | Align pins | **PASS** (T-W1) |
| TF-22 | Hoisted monorepo phantom deps | No undeclared app imports | OPEN |
| TF-23 | CI logs under `site/results/` | Prefer root `results/` | PASS  -  workflows tee to `results/tooling` / `results/site` (90b55c74) |
| TF-24 | Fast gate CI timeout | Job succeeds or timeout adjusted | OPEN |

## Cross-track blockers

| Item | Owner |
|---|---|
| DB-SVG cutover incomplete | Architecture + `Failures.md`  -  stack must not pretend DB/R2 is live SVG authority |
| Product auth / DEV bypass | Site/Admin tracks prove auth; stack keeps production-disabled contract |
| Planner/Site/Admin feature gaps | Their contracts |

## Immediate priority

1. Stabilize typecheck (**TF-07**).
2. Fresh lint + typecheck + unit (**T4**).
3. Dead direct deps (**T3 / TF-05**).
4. Build + release:gate (**T6 / TF-06**).
5. Keep DB-SVG honesty (**T7 / TF-10**).
6. ~~Align CI pnpm pin~~  -  **TF-02 / TF-21 PASS** (T-W1).
