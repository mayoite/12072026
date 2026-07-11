# Start — dev, test, and release commands

**Open when running commands** · conduct `AGENTS.md` · repo facts `Readme.md` · doc routing `docs/Lockedfiles/INDEX.md` · test layout `TESTING.md` · gate policy `Failures.md`

Repo root (`pnpm-workspace.yaml`). Package manager: **pnpm**.

## First time

```powershell
pnpm install
copy .env.example .env.local   # then fill keys at repo root
```

Env is loaded from repo-root `.env.local` via `site/scripts/loadEnvLocal.cjs` (Next, Playwright, scripts). `pnpm run start` also loads it before the standalone server boots if the file exists.

Check required keys:

```powershell
pnpm --filter oando-site exec node scripts/validate-launch-env.mjs
```

---

## Dev servers

- **Site + planner** — `pnpm run dev` → http://localhost:3000
- **Planner guest** — same server → http://localhost:3000/planner/guest/
- **Turbo dev** — `pnpm run dev:turbo` → http://localhost:3000
- **Tech-stack docs** — `pnpm run dev:tech-stack` (see terminal for port)
- **Production preview** — `pnpm run build` then `pnpm run start` → http://localhost:3000

**Stale port 3000:** if restart fails with “Another next dev server is already running”, stop the listed PID or:

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
pnpm run dev
```

Restart dev after changing `.env.local`.

**Dashboards:** members → `/dashboard` (planner, portal). Admins → `/admin` (CRM, ops, catalog). Guest → `/planner/guest/` (no login).

---

## Typecheck & lint

```powershell
pnpm run typecheck              # site TS
pnpm run lint                   # ESLint (site)
pnpm run lint:secrets           # secretlint (root)

pnpm --filter oando-site run typecheck:scripts
pnpm run typecheck:tech-stack
```

---

## Tests (Vitest)

```powershell
pnpm run test                   # full suite (~1772 tests)
pnpm --filter oando-site exec vitest run planner   # planner only (2065 tests, 381 files)
pnpm --filter oando-site run test:unit         # non-planner unit
pnpm --filter oando-site run test:watch        # watch mode
pnpm --filter oando-site run test:coverage     # planner coverage
pnpm --filter oando-site run test:coverage:site
pnpm run test:tech-stack        # tech-stack-generator package
```

Single file (from `site/`):

```powershell
cd site
pnpm exec vitest run tests/unit/offlineStorage.test.ts --config vitest.site.config.ts
```

Artifact paths: repo-root `results/` (see **`TESTING.md`**); archive/results/ kept for history (archive over delete).

---

## Tests (Playwright)

Read `Failures.md` gate policy first (`AGENTS.md` → Gates). Needs browser + env.

Install Chromium once:

```powershell
pnpm --filter oando-site run test:browsers:install
```

```powershell
pnpm --filter oando-site run test:a11y           # accessibility
pnpm --filter oando-site run test:e2e:nav        # site navigation smoke
pnpm --filter oando-site run test:planner-catalog   # planner E2E (some skips)
pnpm --filter oando-site run test:planner-catalog:watch   # UI mode
```

Playwright loads env from repo-root `.env.local` via `playwright.config.ts`.

---

## Release gate

Read `Failures.md` gate policy first (`AGENTS.md` → Gates).

```powershell
pnpm run release:gate
```

Site-only: lint → typecheck → test → build → a11y → e2e nav → planner-catalog → coverage ×2.

---

## Tech-stack docs

```powershell
pnpm run docs:sync:tech-stack    # regenerate Documents/ + renderer generated-data
pnpm run docs:check:tech-stack   # verify manifest + accuracy gate
pnpm run docs:gate:tech-stack    # check + coverage + typecheck + build
pnpm run build:tech-stack
pnpm run preview:tech-stack     # http://localhost:4173 after build
pnpm run test:tech-stack
```

Renderer: `site/tech-stack-generator/` → build to repo-root `tech-stack-docs/` + data in `tech-stack-generated/` (see `AGENTS.md` layout).

---

## Docs (root link check)

```powershell
pnpm run docs:check:root-links   # DOC-MAP.md, Readme.md, Lockedfiles/INDEX.md
```

---

## Useful site-only scripts

Prefix with `pnpm --filter oando-site run` or `cd site` then `pnpm run`:

- `catalog:ingest` — ingest planner catalog CSV
- `db:test` — test Supabase DB connections (`PRODUCTS_DATABASE_URL`, `SUPABASE_AUTH_DATABASE_URL`)
- `db:apply` — apply products Supabase migrations
- `supabase:backup` — backup Supabase
- `audit:supabase:catalog` — catalog audit
- `assets:cdn:upload` — upload catalog assets to R2
- `assets:cdn:audit` — audit CDN paths

---

## Quick smoke (manual)

```powershell
# AI advisor (dev server must be running)
Invoke-RestMethod -Uri "http://localhost:3000/api/planner/ai-advisor/" -Method POST -ContentType "application/json" -Body '{"mode":"chat","messages":[{"role":"user","content":"ping"}]}'

# Planner catalog API
Invoke-RestMethod -Uri "http://localhost:3000/api/planner/catalog/"
```

---

## See also

`Readme.md` · `TESTING.md` · `Failures.md` · `OPERATIONS_RUNBOOK.md` · `.env.example`
