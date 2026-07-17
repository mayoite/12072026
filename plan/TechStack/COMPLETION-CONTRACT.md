# Tech stack completion contract

**Status:** OPEN  
**Authority:** This file is the **execution contract** for **toolchain, engines, workspace, CI, and dependency health**.  
**Relation to fact docs:**  
- `docs/Lockedfiles/03-dependencies-engines-current.md` — architectural limits (engines, i18n, persistence rules)  
- `docs/architecture/11-RUNTIME-ARCHITECTURE.md` — live runtime shape  
- `docs/architecture/08-DATABASE-SVG-CONTRACT.md` — DB/R2 SVG target  
- `docs/architecture/10-SECURITY-BENCHMARK.md` — security release IDs  
- Root / `site` `package.json` + lockfiles — **version authority**  

Where a fact doc and this file conflict on **how to prove done**, **this file wins**.  
Where they conflict on **which package version is installed**, **lockfile wins**.

**Not:** Site copy, Planner canvas features, Admin product UX. Those use their own contracts.  
**Agent reports:** `../../agent-reports/` — short multi-files + INDEX only.

---

## 1. Outcome

A **maintainable, installable, releasable monorepo** where:

1. **One install path** — pnpm from repo root; Node and pnpm pins are real.  
2. **Engines stay singular** — one interactive 2D engine, one 3D stack, one admin SVG authoring embed, server owns publish.  
3. **Dependencies earn their keep** — direct deps have live imports or documented build roles.  
4. **Gates are honest** — layout, lint, typecheck, test, build, secrets, release:gate are runnable and green for release claims.  
5. **Secrets and envs** — never in git; `.env.local` pattern enforced.  
6. **Storage and DB clients** — match locked policy (Drizzle/postgres, R2 via S3 API, no new unauthorized stack for DB-SVG).  
7. **Docs stay thin** — `docs/` budget; stack policy not duplicated as fiction.

**Benchmark:** Stripe/Vercel-class monorepo hygiene (reproducible installs, strict CI, lockfile truth) — not their product UI.

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

### 2.1 What counts as PASS

All that apply:

1. **Policy** written in Lockedfiles / architecture docs matches code.  
2. **Automated proof** — named command exit 0.  
3. **Dependency claim** — `pnpm why` / import grep / lockfile entry shown when asserting “in use” or “removed”.  
4. **CI claim** — workflow file path + last green or local repro of same script.  
5. **No silent pin drift** — root `packageManager` and CI pnpm pin agree.  
6. Status flipped only with that evidence.

**PARTIAL** = policy written, gate not green, or env-dependent.

---

## 3. Evidence protocol

### 3.1 Gates (stack release / “stack healthy” claim)

From **repo root**. All exit **0** for a full stack PASS:

| Gate | Command |
|------|---------|
| Layout | `pnpm run check:layout` |
| Failures file | `pnpm run check:failures` |
| Agents / docs purity | `pnpm run check:agents-md` · `check:agents-folder` · `check:active-docs` · `check:plans-purity` · `check:docs-purity` |
| Fast monorepo gate | `pnpm run gate` |
| Lint | `pnpm run lint` |
| Typecheck | `pnpm run typecheck` (stable; no missing `.next/dev/types` race) |
| Unit | `pnpm run test` |
| Secrets | `pnpm run lint:secrets` |
| Sharp / native | `pnpm run check-sharp` (as required by build) |
| Build | `pnpm run build` |
| Full release | `pnpm run release:gate` (or turbo equivalent) |
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

---

## 4. Scope boundary

### In

| Area | Path / surface |
|------|----------------|
| Package manager | Root `package.json` `packageManager`, `pnpm-workspace.yaml`, install guards |
| Node engine | `engines.node` ≥24 |
| Workspace packages | `site/` (`oando-site`), `tech-docs-generator/` (`oando-tech-docs`) |
| Canvas / 3D / SVG engines | Fabric; Three + R3F + Drei; Excalidraw embed |
| CSS toolchain | Tailwind / postcss / locked CSS tree under `site/app/css/` |
| Next runtime | Next 16 app router, Vercel root = `site` |
| Test runners | Vitest, Playwright configs under `site/config/build/` |
| CI | `.github/workflows/*` pins aligned to root |
| Secrets lint | secretlint scripts |
| Turbo | release orchestration |
| Env contract | `.env.example` vs server readers (`lib/env.server.ts`) |
| DB clients | Drizzle, postgres, Supabase clients (boundaries only) |
| Object storage | R2 via S3 SDK policy |
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
| DB-SVG cutover incomplete | Architecture + Failures.md — stack must not pretend R2/DB is live authority |
| DEV_AUTH_BYPASS | Stack must keep production-disabled; Site/Admin prove auth |
| Windows dev | `pool: 'forks'` Vitest; PowerShell scripts — stack must not assume only Unix |

---

## 5. Non-negotiable stack decisions

| Decision | Rule |
|----------|------|
| Install | Root only; `preinstall` guard |
| Linker | Hoisted as configured; no nested lockfiles |
| 2D | Fabric sole interactive engine |
| 3D | Three.js + R3F + Drei helpers only |
| Admin SVG UI | `@excalidraw/excalidraw` embed; host owns publish |
| Publish truth | Server compile + sanitize — not client engine |
| Site i18n | `next-intl` only; Planner/Admin English only |
| Catalog DB access | Drizzle + postgres for Products work; no new `.from()` catalog paths |
| Artifacts | R2 via AWS S3 client for immutable artifacts (target); live SVG disk until cutover |
| Runtime writes | No production writes under `site/public` for generated GLB |
| Handwritten `any` | Forbidden in product/test source |
| Licenses | Verify before add; paid assets approved |

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

## 7. Failure registry (TS) — tech stack

Statuses: **PASS** | **PARTIAL** | **FAIL** | **OPEN**.

| ID | Failure | Bar to clear | Status seed |
|----|---------|--------------|-------------|
| TS-01 | Nested install possible / used | Guard + CI only root install | OPEN until grepped CI |
| TS-02 | pnpm pin drift (root vs CI) | Identical pnpm major/minor intent | OPEN |
| TS-03 | Node engine violated in CI image | Node ≥24 on CI | OPEN |
| TS-04 | Second 2D canvas engine introduced | Fabric-only grep clean | OPEN |
| TS-05 | Direct dep with no import / role | Remove or document | OPEN |
| TS-06 | `release:gate` / `gate` not green | Fresh exit 0 | OPEN |
| TS-07 | Typecheck flakes on `.next/dev/types` | Stable tsc story (exclude or generate) | FAIL if currently flaking |
| TS-08 | Secrets in tree | `lint:secrets` exit 0; no committed secrets | OPEN |
| TS-09 | Env example drift | `.env.example` covers required server keys (names only) | OPEN |
| TS-10 | DB-SVG marketed as live authority | Failures.md + Lockedfiles honest; disk live | PARTIAL (documented) |
| TS-11 | Dual-write incomplete treated as PASS | Dual-write proved or OPEN | OPEN |
| TS-12 | Tech-docs broken / unowned | tech-docs gate green or package optional documented | OPEN |
| TS-13 | Sharp / native binary broken on Windows | `check-sharp` + build | OPEN |
| TS-14 | Playwright / Vitest misconfig for Windows | forks pool; paths work | PARTIAL if unit green |
| TS-15 | Turbo cache hides real FAIL | Clean run or cache-bust proof | OPEN |
| TS-16 | License / competitor package risk | Audit list; none present | OPEN |
| TS-17 | i18n second framework introduced | next-intl only | OPEN |
| TS-18 | Supabase client boundary violated | No new catalog `.from()` paths | OPEN |
| TS-19 | Production GLB or publish writes `site/public` | Code path 501 / storage only | PARTIAL (recent intent) |
| TS-20 | Docs budget broken / stack fiction in docs | ≤23 docs files; Lockedfiles matches code | OPEN |
| TS-21 | **NEW** Install/docs claim pnpm@11 but CI differs | Align pins | OPEN |
| TS-22 | **NEW** Hoisted monorepo phantom deps | No app import of undeclared package | OPEN |

---

## 8. Execution phases (T0–T8)

### T0 — Inventory and honesty

- [ ] Snapshot root + site engines from package.json  
- [ ] Confirm live canvas/3D/excalidraw imports  
- [ ] List Failures.md stack-related blockers  
- [ ] Diff Lockedfiles vs code  

**Exit:** Honest TS registry.  
**Proof:** short inventory report + commands.

### T1 — Install and workspace

- [ ] Root-only install documented and guarded  
- [ ] Workspace packages only: site, tech-docs-generator  
- [ ] No nested package-lock  
- [ ] Node ≥24, pnpm pin match CI  

**Exit:** Clean install from empty store reproduces.  
**Proof:** `pnpm install` exit 0; guard script test.

### T2 — Engine monoculture

- [ ] Fabric only for interactive 2D  
- [ ] Three stack only for 3D  
- [ ] Excalidraw only for admin SVG studio embed  
- [ ] No react-router in site (tech-docs SPA only)  

**Exit:** Grep policy clean.  
**Proof:** import inventory script or rg evidence in report.

### T3 — Dependency hygiene

- [ ] Every direct `site` dependency has import or build role  
- [ ] Remove or justify dead deps  
- [ ] License check on additions  
- [ ] No competitor packages  

**Exit:** TS-05 clear for site package.  
**Proof:** dep audit report + lockfile.

### T4 — Type, lint, unit stability

- [ ] lint max-warnings 0  
- [ ] typecheck stable (fix `.next` include race)  
- [ ] vitest full suite green or FAIL list owned  
- [ ] Windows forks pool preserved  

**Exit:** `lint` + `typecheck` + `test` exit 0.  
**Proof:** command exits same session.

### T5 — Security and secrets

- [ ] `lint:secrets` green  
- [ ] CSRF / withAuth patterns not regressed by stack changes  
- [ ] DEV bypass production-disabled  
- [ ] Env example without secret values  

**Exit:** SEC-REL-03 spirit for secrets + dep gates.  
**Proof:** secretlint + sample auth unit.

### T6 — Build and release

- [ ] `check-sharp` + site build + tech-docs build  
- [ ] `release:gate` or documented waiver in Failures.md  
- [ ] Vercel root = site; no wrong root deploy  

**Exit:** Production artifact builds.  
**Proof:** build exit 0; note deploy is owner-only.

### T7 — Data plane clients (boundary only)

- [ ] Drizzle schemas present for owned tables  
- [ ] R2 client credential pair integrity  
- [ ] Live vs target SVG authority documented (disk live)  
- [ ] No unauthorized new DB packages for cutover  

**Exit:** Lockedfiles persistence table matches code.  
**Proof:** file paths + Failures.md DB-SVG open items honest.

### T8 — Docs and ops closure

- [ ] Lockedfiles updated when engines change  
- [ ] Runtime architecture date + code agree  
- [ ] docs budget held  
- [ ] Agent/process checks green  

**Exit:** Stack claim reproducible by another engineer from docs + lockfile.  
**Proof:** docs purity + layout + gate scripts.

---

## 9. Required proof matrix

| Claim | Minimum proof |
|-------|----------------|
| “pnpm only” | Guard script + CI uses pnpm |
| “Node 24” | engines field + CI node version |
| “Fabric only 2D” | No konva/paper/pixi interactive imports in site |
| “No public GLB write” | Route/storage tests exit 0 |
| “Deps clean” | Each direct dep: import path or BUILD-ROLE note in Lockedfiles |
| “Release ready stack” | §3.1 full table green |
| “DB is SVG authority” | **Forbidden** until 08-contract cutover proved |

---

## 10. Dependency order

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

## 11. How this exceeds Lockedfiles alone

| Area | Lockedfiles / runtime docs | This contract |
|------|----------------------------|---------------|
| Facts | Version/policy statements | **PASS recipe** + commands |
| Engines | Table | Phase T2 + grep proof |
| Deps | Prefer existing | TS-05 + audit phase |
| CI | Mentioned loosely | §3.1 full gate table |
| Failures | Failures.md generic | **TS-01…TS-22** registry |
| Agents | — | Parent re-verify + short reports |
| False completion | Easy if MD outdated | Lockfile + exit 0 required |

---

## 12. Immediate priority queue

1. **T0** — inventory engines + pins vs CI.  
2. **TS-07** — stabilize typecheck (`.next/dev/types` race).  
3. **T4** — lint/typecheck/test green.  
4. **T3** — dead direct deps.  
5. **T6** — build + release:gate.  
6. **T7** — keep DB-SVG honesty (TS-10/11).  
7. **T8** — Lockedfiles sync when anything engine-related lands.

---

## 13. Owner acceptance

Tech stack is **complete** (healthy for release) only when:

1. §3.1 gates all green (or each miss is an active `Failures.md` item with owner accept).  
2. No Critical TS open (nested install, secret leak, second canvas engine, false DB authority).  
3. Lockedfiles + 11-RUNTIME match live imports and lockfile.  
4. Another engineer can install and pass `pnpm run gate` from clean clone instructions in `Readme.md`.

Until then: **Status remains OPEN.**
