# Oando unified planner + marketing site

pnpm monorepo for `oando.co.in`. Next.js in `site/`.

**Active:** `site/features/planner/` + `site/app/planner/`. Live 2D is Fabric `PlannerCanvasStage` / `open3d-fabric-stage`. Live 3D is imperative Three with orbit. Feasibility / `canvas-feasibility` **does not and will not exist** — not a product or archive proof path.

## Which doc to open

→ **`docs/Lockedfiles/INDEX.md`** (routing). Repo facts and app paths continue below.

→ **Active lane / session status & handover** — see [`Plans/INDEX.md`](Plans/INDEX.md) to discover the current active lane (live status, blockers, next actions, and promotion state).

## Layout

```
repo-root/          ← pnpm workspace wrapper (package.json, pnpm-lock.yaml)
├── site/           ← Next.js app (oando-site)
├── site/tech-stack-generator/  ← Vite source (oando-tech-stack-docs); build output — see `site/tech-stack-generator/README.md`
├── docs/           ← reference docs (architecture, api, audit)
├── archive/        ← historical outputs + `archive/migrationdocs/`
├── Plans/          ← governance + execution plans (see Plans/INDEX.md to discover active session status and lanes)
└── archive/1b-5phase-agent-workflow/ (and archive/Agents_work/) ← archived 1b-5phase agent workflow reports, reviews, benchmarks (narratives only; evidence in results/)
```

Inside `site/`: `app/` · `features/planner/` · `components/` · `lib/` · `tests/` · `scripts/` · `platform/` · `config/` — **no** `results/` (evidence is repo-root `results/` only; see `AGENTS.md`)

**Where code goes:** [`docs/architecture/01-MODULE-LAYOUT.md`](docs/architecture/01-MODULE-LAYOUT.md) · **Architecture index:** [`docs/architecture/README.md`](docs/architecture/README.md)

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

- **Base:** `site/app/css/core/animations.css` for global animation primitives.
- **Tokens:** `site/app/css/core/theme.css` is the single source; no hex in components.
- **Entry:** `globals.css` -> `site/app/css/index.css` imports `core/theme.css`, `core/utilities/*.css`, `core/components/*.css`.
- **Site:** `site/app/css/core/locked/site/` — flat `*.css` + `index.css` per layout.
- **Admin:** `site/app/css/core/locked/admin/` — flat `*.css` + `index.css`.
- **Planner:** `site/app/css/core/locked/planner/` — flat `*.css`; `marketing.css` / `open3d-workspace.css` entry bundles.

CSS operating model: [`docs/architecture/04-CSS-SOLUTION.md`](docs/architecture/04-CSS-SOLUTION.md). Module folders and ownership: [`docs/architecture/01-MODULE-LAYOUT.md`](docs/architecture/01-MODULE-LAYOUT.md) · [`docs/architecture/README.md`](docs/architecture/README.md).

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

## Testing & Evidence

- **Technical Guide & Paths:** [`Agents/Agents-04-testing.md`](Agents/Agents-04-testing.md)
- **Universal Policy:** [`testing-handbook.md`](testing-handbook.md) (Mandatory output-integrity policy for both humans and agents).

http://localhost:3000 · guest planner `/planner/guest/`

TypeScript **6.x**. Dev: `next dev --turbo`. Vercel Root Directory = `site`. Test output: repo-root `results/` (detail **`testing-handbook.md`**).

Other reference: `docs/architecture/`, `docs/api/ROUTE-INDEX.md`, `Plans/INDEX.md`.
