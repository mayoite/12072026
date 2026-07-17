# Tech stack completion plan

Status: **OPEN**.

**Proof bar:** For PASS claims and “stack healthy” release language, follow `COMPLETION-CONTRACT.md` (stricter evidence). This file is the detailed phase checklist (T0–T8), 1:1 with the contract.

Owner instruction: toolchain, gates, env honesty, dependency and engine health only. No Planner canvas, Admin SVG UX, or Site marketing work here.

## Outcome

A maintainable, installable, releasable monorepo:

1. One install path (pnpm root; Node ≥24).
2. Singular engines (Fabric 2D, Three stack 3D, Excalidraw admin embed).
3. Dependencies with live role or documented build role.
4. Honest gates — exit 0 in the claiming session.
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

Every item starts unchecked. Flip only with COMPLETION-CONTRACT proof.

### T0 — Inventory and honesty

- [PASS] Snapshot root + site engines from package.json vs lockfile (FEATURES + FIX-TECHSTACK 2026-07-17).
- [PASS] Confirm live Fabric / Three / Excalidraw imports (FEATURES inventory).
- [PASS] List stack-related `Failures.md` blockers (DB-SVG disk live).
- [PASS] Diff Lockedfiles persistence/engines vs code (FEATURES).
- [PASS] Record pnpm root pin vs CI pin (TF-02 cleared 2026-07-17 T-W1: CI 11.13.0).

**Exit:** Honest TF registry.  
**Proof:** short inventory + commands in agent report.

### T1 — Install and workspace

- [PASS] Root-only install documented and guarded.
- [PASS] Workspace packages only: `site`, `tech-docs-generator`.
- [PASS] No nested `package-lock` under workspace packages.
- [PASS] Node ≥24; pnpm pin match CI intent (root + CI **11.13.0**, T-W1).

**Exit:** Clean install from lockfile reproduces.  
**Proof:** `pnpm install` / frozen install exit 0; guard evidence.

### T2 — Engine monoculture

- [PASS] Fabric only for interactive 2D.
- [PASS] Three stack only for 3D.
- [PASS] Excalidraw only for admin SVG studio embed.
- [PASS] No second i18n framework on Site.

**Exit:** Grep policy clean.  
**Proof:** import inventory in report.

### T3 — Dependency hygiene

- [ ] Every direct `site` dependency has import or build role.
- [ ] Remove or justify dead deps.
- [ ] License check on additions.
- [ ] No competitor packages.

**Exit:** TF-05 clear for site package.  
**Proof:** dep audit + lockfile.

### T4 — Type, lint, unit stability

- [ ] `pnpm run lint` exit 0 (max-warnings 0). (FAIL this session: Planner files)
- [ ] `pnpm run typecheck` exit 0 (stable; no `.next/dev/types` race). (FAIL this session: PlannerFabricStage)
- [ ] `pnpm run test` exit 0 or FAIL list owned in Failures.md.
- [PASS] Windows Vitest `pool: 'forks'` preserved.
- [PASS] Health unit: `tests/unit/app/api/health/route.test.ts` exit 0 (FIX-TECHSTACK).

**Exit:** lint + typecheck + focused/full unit as claimed.  
**Proof:** command exits same session.

### T5 — Security and secrets

- [ ] `pnpm run lint:secrets` exit 0.
- [PASS] `.env.example` lists required names (no values).
- [PASS] AI chain documented: Gemini + OpenRouter primary/backup; OpenAI not required.
- [PASS] DEV_AUTH_BYPASS production-disabled path not regressed by stack changes (documented).

**Exit:** Secrets + env name contract honest.  
**Proof:** secretlint + env table names only.

### T6 — Build and release

- [ ] `pnpm run check-sharp` as required by build.
- [ ] `pnpm run build` exit 0.
- [ ] `pnpm run release:gate` exit 0 **or** active Failures.md waiver with owner accept.
- [PASS] Vercel root = `site`.

**Exit:** Production artifact builds.  
**Proof:** build exit 0; deploy remains owner-only.

### T7 — Data plane clients (boundary only)

- [PASS] Drizzle schemas present for owned tables.
- [PASS] R2 client uses intact S3 credential pair (names in FEATURES; preferred pair SET).
- [PASS] Live vs target SVG authority documented: **disk live**.
- [PASS] No false claim that Products DB/R2 is SVG release authority.
- [PASS] `GET /api/health` returns `{ ok: true }` without secrets.

**Exit:** Lockedfiles persistence table matches code; Failures.md DB-SVG honest.  
**Proof:** paths + Failures.md + health unit.

### T8 — Docs and ops closure

- [PASS] Plan trio present: COMPLETION-CONTRACT, FEATURES, FINISH-PLAN.
- [PASS] `check:plans-purity` allows TechStack and requires trio (exit 0 FIX-TECHSTACK).
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
| T3 | OPEN | Dead-dep audit not closed |
| T4 | FAIL | lint exit 1, typecheck exit 2 (Planner paths); health unit 0 |
| T5 | PARTIAL | Env names documented; preferred R2 SET; Resend SET; OpenAI MISSING (ok) |
| T6 | OPEN | release:gate not run for PASS |
| T7 | PARTIAL | Health route + unit exist; DB-SVG disk authority in Failures.md |
| T8 | PARTIAL | Plan trio + purity allowlist fixed; layout/purity 0; full docs closure open |

**Stack healthy claim:** **forbidden** until §3.1 of COMPLETION-CONTRACT is green or owner-waived in Failures.md.

## Failure registry (TF) — 1:1 with COMPLETION-CONTRACT

Statuses: **PASS** | **PARTIAL** | **FAIL** | **OPEN**. Prefer **TF** ids in finish reports. **TS-n** = **TF-n** for n≤22.

| ID | Failure | Bar to clear | Status (2026-07-17) |
|----|---------|--------------|---------------------|
| TF-01 | Nested install possible / used | Guard + CI only root install | OPEN |
| TF-02 | pnpm pin drift (root vs CI) | packageManager 11.13.0 = CI action version | **PASS** (CI 11.13.0, T-W1) |
| TF-03 | Node engine violated in CI image | Node ≥24 on CI | PARTIAL |
| TF-04 | Second 2D canvas engine introduced | Fabric-only grep clean | PARTIAL |
| TF-05 | Direct dep with no import / role | Remove or document | OPEN |
| TF-06 | `release:gate` / `gate` not green | Fresh exit 0 | OPEN |
| TF-07 | Typecheck flakes on `.next/dev/types` | Stable tsc story | OPEN |
| TF-08 | Secrets in tree | `lint:secrets` exit 0 | OPEN |
| TF-09 | Env example drift | `.env.example` covers required names | PARTIAL |
| TF-10 | DB-SVG marketed as live authority | Failures.md + Lockedfiles; disk live | PARTIAL |
| TF-11 | Dual-write incomplete treated as PASS | Dual-write proved or OPEN | OPEN |
| TF-12 | Tech-docs broken / unowned | tech-docs gate or optional doc | OPEN |
| TF-13 | Sharp / native broken on Windows | `check-sharp` + build | OPEN |
| TF-14 | Playwright / Vitest Windows misconfig | forks pool; paths work | PARTIAL |
| TF-15 | Turbo cache hides real FAIL | Clean run or cache-bust | OPEN |
| TF-16 | License / competitor package risk | Audit list; none present | OPEN |
| TF-17 | i18n second framework | next-intl only | PARTIAL |
| TF-18 | Supabase client boundary violated | No new catalog `.from()` | OPEN |
| TF-19 | Production GLB/publish writes `site/public` | 501 / storage only | PARTIAL |
| TF-20 | Docs budget / stack fiction | Lockedfiles + plan trio | PARTIAL |
| TF-21 | Docs claim pnpm@11.13 but CI differs | Align pins | **PASS** (T-W1) |
| TF-22 | Hoisted monorepo phantom deps | No undeclared app imports | OPEN |
| TF-23 | CI logs under `site/results/` | Prefer root `results/` | PASS — workflows tee to `results/tooling` / `results/site` (90b55c74) |
| TF-24 | Fast gate CI timeout | Job succeeds or timeout adjusted | OPEN |

## Cross-track blockers

| Item | Owner |
|---|---|
| DB-SVG cutover incomplete | Architecture + `Failures.md` — stack must not pretend DB/R2 is live SVG authority |
| Product auth / DEV bypass | Site/Admin tracks prove auth; stack keeps production-disabled contract |
| Planner/Site/Admin feature gaps | Their contracts |

## Immediate priority

1. Stabilize typecheck (**TF-07**).
2. Fresh lint + typecheck + unit (**T4**).
3. Dead direct deps (**T3 / TF-05**).
4. Build + release:gate (**T6 / TF-06**).
5. Keep DB-SVG honesty (**T7 / TF-10**).
6. ~~Align CI pnpm pin~~ — **TF-02 / TF-21 PASS** (T-W1).
