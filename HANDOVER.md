# Handover — active backlog

**Last updated:** 2026-07-04 (planner phase-01 executor, BLOCK on typecheck)
**Planner authority:** `plans/01-phase1-execution/01-implementation-decisions.md`. Routing: `plans/01-phase1-execution/00-handover-routing.md`. Phase specs → `archive/plans/2026-07-05_phase1-execution/phases/`.

**Owns:** session status and priority backlog only. Full blocker list → [`Failures.md`](Failures.md). Commands → [`START.md`](START.md). Which doc to open → [`docs/Lockedfiles/ReadmeLocked.md`](docs/Lockedfiles/ReadmeLocked.md).

**Git:** `main` — verify live before trusting; Vitest CI batch fix is **local uncommitted** as of this update; `site/package.json` + `pnpm-lock.yaml` carry Phase 01 Tier-1 install + strict-pin edits (local uncommitted).

---

## Phase 01 — Engine Lock & Workspace Bootstrap (Planner plan, NEW section)

**Status:** **Blocked on typecheck** (per Failures.md active section — PLAN-FAIL-0412 now Resolved; see Failures.md / resolved-failures.md). (Consolidated 2026-07-05: only 2 failure files.)

**What is done (Implemented part):**

- Tier-1 lockstep install: 9/9 packages installed in `site/` (`@flatten-js/core`, `polygon-clipping`, `svgo`, `@resvg/resvg-js`, `@puckeditor/core`, `@ark-ui/react`, `react-aria-components`, `zod`, `@phosphor-icons/react`). `@vercel-labs/json-render` deferred (not in npm registry; option A unblock). `fabric` re-pinned to strict `7.4.0` (no caret). `three` bumped `^0.185.0` → `^0.185.1`. Lockfile sync exit 0. Evidence: `results/planner/phase-01/install/`.
- PLAN-FAIL-0401 → Resolved 2026-07-04 (Phase 01 executor).

**What is blocked (not Implemented until typecheck clean):**

- `pnpm --filter oando-site run typecheck` exit 2. 27 pre-existing planner-type errors in `features/planner/open3d/{3d,ai,catalog}/` (TS2724 private re-export `_Open3d*`; TS18048 `Open3dConfigurability|undefined` and `value|undefined`). Errors pre-date this install (no Tier-1 package added by Phase 01 is imported by any of those files). All Phase 01 exit-gate checkpoints in §01-VERI cannot be claimed until typecheck is green. Captured: `results/planner/phase-01/typecheck/typecheck-run.json`.
- Lint (`pnpm --filter oando-site run lint --max-warnings=0`) **skipped** — per AGENTS.md "Skipped = say skipped"; running lint over a typecheck-failing tree would mislead.
- Vitest smoke (`pnpm --filter oando-site run test:planner`) **skipped** for the same reason.

**Next step (requires owner decision):** planner agent fixes pre-existing planner-type debt under `site/features/planner/open3d/` (out of Phase 01 scope; Phase 06/03 own this surface). After typecheck is green, return to Phase 01 executor for lint → vitest smoke → Implemented → Verified in staging.

## Open (priority order)

1. **CI** — Commit + push Vitest marketing/layout batch (`nextIntlServerEnMock`, portfolio paths, catalog `CI` stub); confirm `release-gate.yml` green
2. **Deploy** — Vercel Git builds **not green**; dashboard/project root must match one-app `site` config (you / ops)
3. **Deploy** — Confirm Vercel **Root Directory = `site`** so [`site/vercel.json`](site/vercel.json) is active (you)
4. **Tech stack** — Fix `tech-stack-docs.yml` failure ([run 28444011898](https://github.com/ayushonmicrosoft/OOFPLWeb/actions/runs/28444011898)); Phase 2.4 renderer migration (agent)
5. **Site UI** — Wave 2 snapshots (`test:site-ui --update-snapshots`); de/es/fr human copy (Phase 4c)
6. **Gate** — Full `release:gate` after Vitest push; not run locally this session

---

## Recent proof (local)

| Check | Result |
|-------|--------|
| Vitest CI batch (14 files, `CI=true`) | **28/28** passed |
| `site-ui.yml` on main | **success** ([28444011893](https://github.com/ayushonmicrosoft/OOFPLWeb/actions/runs/28444011893)) |
| `supabase-backup-r2` cron | **success** ([28425171234](https://github.com/ayushonmicrosoft/OOFPLWeb/actions/runs/28425171234)) |
| `release:gate` remote (pre-fix) | **failure** Vitest 13 files ([28441341603](https://github.com/ayushonmicrosoft/OOFPLWeb/actions/runs/28441341603)) |

---

## Vercel (current truth)

- **Project** — `ayushs-projects-1/oando-platform`
- **Git** — `ayushonmicrosoft/OOFPLWeb` · branch `main`
- **Root Directory** — should be **`site`**
- **`site/vercel.json`** — workspace `pnpm install` from repo root, then `next build` in `site/`

Deploy procedure: **`OPERATIONS_RUNBOOK.md`**.

---

## Verify (Vitest-only)

Commands: **`START.md`**

- `pnpm --filter oando-site exec vitest run` (targeted files — see `Failures.md` resolved table)
- `pnpm run docs:test:tech-stack`
- `pnpm run docs:check:tech-stack`
- `pnpm --filter oando-site run db:test`

---

## Next agent

1. Commit Vitest batch + push; watch `release-gate.yml`.
2. Fix Vercel monorepo deploy **or** park Vercel — ask before more dashboard/API churn.
3. Log new blockers in `Failures.md` only.

Plans: `plans/README.md`
