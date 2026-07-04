# Handover — active backlog

**Last updated:** 2026-06-30

**Owns:** session status and priority backlog only. Full blocker list → [`Failures.md`](Failures.md). Commands → [`START.md`](START.md). Which doc to open → [`docs/Lockedfiles/ReadmeLocked.md`](docs/Lockedfiles/ReadmeLocked.md).

**Git:** `main` — verify live before trusting; Vitest CI batch fix is **local uncommitted** as of this update.

---

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
