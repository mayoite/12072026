# Oando unified planner + marketing site

pnpm monorepo for `oando.co.in`. Next.js in `site/`.

**Active:** `site/features/planner/` + `site/app/planner/` (hybrid planner: Fabric-backed 2D canvas + Three/r3f 3D view).

## Which doc to open

→ **`docs/Lockedfiles/conduct/ReadmeLocked.md`** (locked). Repo facts and app paths continue below.

## Layout

```
repo-root/          ← pnpm workspace wrapper (package.json, pnpm-lock.yaml)
├── site/           ← Next.js app (oando-site)
├── tech-stack-generator/  ← Vite source (oando-tech-stack-docs); build output — see `tech-stack-generator/README.md`
├── docs/           ← reference docs (architecture, api, audit)
├── archive/        ← historical outputs + `archive/migrationdocs/`
└── Plans/          ← governance + execution plans (see Plans/README.md)
```

Inside `site/`: `app/` · `features/planner/` · `components/` · `lib/` · `tests/` · `scripts/` · `platform/` · `config/` · `results/`

**Where code goes:** [`docs/architecture/MODULE-LAYOUT.md`](docs/architecture/MODULE-LAYOUT.md) · **Architecture index:** [`docs/architecture/README.md`](docs/architecture/README.md)

## Environment

Copy `.env.example` → repo-root `.env.local`. Minimum keys: `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_*`, `OPENROUTER_API_KEY_*`, `SUPABASE_AUTH_DATABASE_URL`, `PRODUCTS_DATABASE_URL`. Validate keys: **`START.md`** (First time).

## Data access

- All Postgres row CRUD on the server uses **Drizzle** (`productsDb`, `adminDb`). Do not add new Supabase `.from()` queries for catalog/planner data.
- **Products DB:** `PRODUCTS_DATABASE_URL` → `platform/drizzle/productsDb.ts` + `schema/catalog.ts`
- **Admin DB:** `SUPABASE_AUTH_DATABASE_URL` → `platform/drizzle/adminDb.ts` + `schema/planner.ts`
- Supabase HTTP clients → **Auth** (and legacy routes until migrated), not new catalog/planner SQL.

## Tech-stack docs

`tech-stack-generator/` → `Documents/tech-stack-docs/`. Regenerate via **`START.md`** (Tech-stack docs); don't hand-edit generated files.

## Static data

- Site copy, nav trees, and the local catalog index live in `site/lib/site-data/`.
- `data/` is legacy and should not receive new app-facing content.
- Mirror CSS only for UI-owned folders; do not mirror `data/`, `lib/`, or `api/` into a parallel style tree.

## Config

- Route contract metadata lives in `site/config/route-contract.json`.

## i18n

- Locale message files live in `site/i18n/messages/`.
- `site/i18n/request.ts` loads the active locale JSON from that folder.

## CSS

- **Base:** `site/app/css/base/` for global primitives such as `animations.css`.
- **Tokens:** `site/app/css/core/tokens/theme.css` is the single source; no hex in components.
- **Entry:** `globals.css` -> `site/app/css/index.css` (base + foundation + `core/chrome` shell).
- **Site:** `site/app/css/core/site/bundles/*` per layout.
- **Planner:** `site/app/css/core/planner/bundles/*` for workspace styling.

CSS operating model: [`docs/architecture/CSS-SOLUTION.md`](docs/architecture/CSS-SOLUTION.md). Module folders and ownership: [`docs/architecture/MODULE-LAYOUT.md`](docs/architecture/MODULE-LAYOUT.md) · [`docs/architecture/README.md`](docs/architecture/README.md).

## Assets & CDN

- **App SDKs** (tldraw, model-viewer, Draco) → `site/public/cdn/` — in git, deployed
- **Catalog images + 3D** → R2 `oando-asset-cdn` — cloud only
- **Local mirror / upload source** → `asset-cdn/` — gitignored
- **Path strings** → Supabase DB only

Upload and audit commands: **`START.md`** · **`OPERATIONS_RUNBOOK.md`** (Assets & catalog).

## Planner delivery loop

1. Define acceptance evidence
2. Smallest complete increment
3. Test → critique → revise → retest

## Quick start

Install, dev server, and all other commands: **`START.md`**.

## Test evidence

All test, lint, typecheck, build, Playwright, accessibility, coverage, and audit runs are captured under repo-root `results/<module>/<phase>/<cmd>/` in the standardized `<cmd>-run.json` + `<cmd>-raw.log` format (never to the repo root, `E:`, or any other drive path). `testing-handbook.md` is the mandatory output-integrity policy. A test run is incomplete if exit status, stdout/stderr, warnings, skips, or required artifacts are missing. Reporters and evidence must not be deleted, suppressed, or bypassed before review.

TypeScript `any` is prohibited in handwritten production, planner, script, and configuration code except for a documented, narrow, temporary exception. Tests/mocks and generated or tool-owned output are exempt only within the scope defined by the handbook.

http://localhost:3000 · guest planner `/planner/guest/`

TypeScript **6.x**. Dev: `next dev --webpack`. Vercel Root Directory = `site`. Test output: repo-root `results/` (detail **`TESTING.md`**; locked copy **`docs/Lockedfiles/TestingLocked.md`**).

Other reference: `docs/architecture/`, `docs/api/ROUTE-INDEX.md`, `docs/audit/`.

