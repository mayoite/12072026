# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read first

This repo has a governance layer that supersedes generic instincts. Before non-trivial work, read:

- **`AGENTS.md`** — the "constitution" (~60 lines). Execution freedom, hard-stop actions requiring the owner's OK, git rules, layout law. **User message beats all rules.**
- **`START.md`** — every dev/test/release command (source of truth; commands below are a subset).
- **`Readme.md`** — repo facts, app paths, data-access rules.
- **`Plans/INDEX.md`** — the current active lane, status, blockers, next actions.
- **`Failures.md`** — gate policy; read before running Playwright/release gates.
- **`testing-handbook.md`** — mandatory output-integrity policy (no test suppression, no silent pass).

Owner intent lives in `ayushdocs/` (5 files). Agent process handbooks live in `Agents/` (`Agents/INDEX.md`, floor is `Agents/Agents-01-STANDARD.md`).

## Big picture

pnpm monorepo for `oando.co.in` — a unified furniture **planner** + marketing site. The only real app is `site/` (Next.js 16, React 19, package name `oando-site`). The repo root is a workspace wrapper; a second package `site/tech-stack-generator/` (Vite, `oando-site-workflow-docs`) generates tech-stack docs.

**Install and run pnpm from the repo root only.** Never `npm install` under `site/` or `site/tech-stack-generator/` — the `preinstall` guard and `check:layout` enforce this. `site/node_modules/` is an expected gitignored workspace shim.

### The planner (active surface)

The live workspace is a **hybrid 2D/3D furniture planner**. New planner code goes in `site/features/planner/open3d/` (canonical tree) or `site/features/planner/canvas-fabric-stage/` (live Fabric 2D stage). Everything under `features/planner/_archive/` and the frozen root `features/planner/{editor,model,store,...}` is legacy — **do not add files there.** See `docs/architecture/01-MODULE-LAYOUT.md` for the full module map and the "new module decision tree."

- 2D: Fabric (`canvas-fabric-stage`) + a `FeasibilityCanvas`; 3D: Three.js via `@react-three/fiber` / `drei`.
- State: Zustand + zundo (undo/redo). Store lives in `open3d/store/`.
- `PlannerCommand` seam exists in `open3d/lib/commands/` but is **not yet fully wired** through `useWorkspaceCanvas` — `plannerCommandWiring.test.ts` is red by design until it is.

### Layer rules (site/)

- `app/` — routes/HTTP only (thin pages, layouts, API route handlers). Business logic and Zod schemas live in `features/` or `lib/`.
- `features/` — vertical product domains (`planner`, `catalog`, `crm`, `ops`, `shared`, `site-assistant`, `ai`, `admin`).
- `components/` — marketing / site chrome only (`home/`, `site/`, `ui/`, `products/`).
- `lib/` — pure TS (site-data, auth helpers, catalog adapters). No React screens, no `*.module.css`.
- `platform/` — DB + Supabase clients.
- `tests/` — **mirror** `features/`, never co-locate under `features/`. Enforced by `test:layout:check`.

### Data access

Server-side Postgres CRUD uses **Drizzle**, not new Supabase `.from()` queries:

- **Products DB:** `PRODUCTS_DATABASE_URL` → `platform/drizzle/productsDb.ts` + `schema/catalog.ts`
- **Admin/planner DB:** `SUPABASE_AUTH_DATABASE_URL` → `platform/drizzle/adminDb.ts` + `schema/planner.ts`
- Supabase HTTP clients are for **Auth** (and legacy routes until migrated) only.

### Styles

All CSS lives under `site/app/css/` — feature folders never get their own `css/`. Tokens are the single source (`app/css/core/theme.css`); **no hex in components**. See `docs/architecture/04-CSS-SOLUTION.md`.

### Assets

App SDKs (tldraw, model-viewer, Draco) → `site/public/cdn/` (in git). Catalog images + 3D → Cloudflare R2 `oando-asset-cdn` (cloud only). Path strings live in the DB, never hard-coded.

## Common commands

Run from repo root unless noted. Full list: `START.md`.

```powershell
pnpm install                    # repo root only
copy .env.example .env.local    # then fill keys at repo root

pnpm run dev                    # site + planner → http://localhost:3000
                                # guest planner → http://localhost:3000/planner/guest/
pnpm run build                  # check-sharp + build site + build tech-stack docs
pnpm run start                  # standalone production server

pnpm run typecheck              # site TS (tsc --noEmit)
pnpm run lint                   # ESLint, --max-warnings=0
pnpm run lint:secrets           # secretlint (root)
pnpm run test                   # full Vitest suite
```

Single test file (from `site/`):

```powershell
cd site
pnpm exec vitest run tests/unit/offlineStorage.test.ts --config vitest.site.config.ts
```

Targeted Vitest (from repo root or `site/`):

```powershell
pnpm --filter oando-site exec vitest run planner   # planner only
pnpm --filter oando-site run test:unit             # non-planner unit
pnpm --filter oando-site run test:watch            # watch mode
```

Playwright E2E (needs `pnpm --filter oando-site run test:browsers:install` once; **read `Failures.md` gate policy first**):

```powershell
pnpm --filter oando-site run test:a11y
pnpm --filter oando-site run test:e2e:nav
pnpm --filter oando-site run test:planner-catalog
```

Gates:

```powershell
pnpm run gate                   # layout + doc + agent checks, then site fast gate
pnpm run release:gate           # full: lint → typecheck → test → build → a11y → e2e → coverage
```

## Hard rules (from AGENTS.md law)

- **No `any`** in handwritten code. TypeScript is 6.x.
- **Test integrity:** no suppression, no silent pass, no hollow "paper moon" (a passing `pass`/JSON is not a shipped product). Audited by `test:audit:hollow` / `test:audit:gate-skips` / `test:audit:eslint-disable`.
- **Secrets** → `.env.local` (repo root) only, loaded via `site/scripts/loadEnvLocal.cjs`.
- **Evidence / test output** → repo-root `results/` only. Never `site/results/` or `site/test-results/`.
- **Ask before:** purchases/seats, force-push or deleting a remote branch, destroying owner data, competitor-asset edges, opening a new product area. Otherwise you have full execute freedom (code, tests, browser, commands, commits, push).
- Git: repo-root checkout only, **no worktrees**.
