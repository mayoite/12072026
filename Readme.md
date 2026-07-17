# Oando website and planner

pnpm workspace: Site, Admin, and Planner in `site/`.

## Product loop

Admin publishes inventory → Site acquires visitors → Planner designs → branded BOQ → customer sends to Oando.

Catalog truth and BOQ handoff matter as much as the canvas.

## Repository layout

### Repo root

| Path | Purpose |
|---|---|
| `site/` | Next.js product (`oando-site`) — only application code |
| `plan/` | Current Planner checklist plus verified Admin, Planner, and Site code maps |
| `docs/` | Architecture, API, database reference (`docs/INDEX.md`) |
| `Agents/` | Agent process and quality bar (`Agents/INDEX.md`) |
| `scripts/` | Repo-wide gates and layout checks (`check:layout`, `check:docs-purity`, `check:failures`, `guard-workspace-install.mjs`) |
| `.github/` | CI workflows (e.g. nightly Supabase backup to R2) |
| `Failures.md` | Active blockers and release gate policy |
| `AGENTS.md` | Agent rules and repo layout policy |
| `Readme.md` | This file — setup, testing, operations |
| `package.json`, `pnpm-workspace.yaml` | Workspace root; proxies into `site/` and `tech-docs-generator/` |
| `results/` | Raw tool output only — never PASS/done state; catalog ops → `results/admin/catalog-ops/` |
| `agent-reports/` | Agent-authored reports (not proof of completion) |
| `tech-docs-generator/` | Optional repo-intelligence tool (`pnpm run tech-docs:*`) |
| `generated-documents/data/` | Generated tech-docs data |
| `generated-documents/docs/` | Generated tech-docs Markdown |
| `generated-documents/site/` | Generated static docs site |
| `.archive/` | Historical reference on disk (legacy plans, migration packets) — do not import in `site/` |
| `websites/` | External research reference when present — do not import in `site/` |
| `PROTECTED/` | Private owner material — never open, edit, or cite |

Do not write under `site/results/` or `site/test-results/`. Cache/tooling dirs (`.tmp/`, `node_modules/`, `.next/`) are not product surfaces.

### `site/` product tree

| Path | Purpose |
|---|---|
| `site/app/` | Routes, layouts, API handlers — keep thin |
| `site/features/` | Domain behavior (Planner, Admin tools) |
| `site/components/` | Shared and marketing UI |
| `site/lib/` | Utilities, catalog core, analytics |
| `site/platform/` | Drizzle schema, Supabase clients, migrations |
| `site/i18n/` | `next-intl` messages and routing config |
| `site/config/` | ESLint, Playwright, build, route contract |
| `site/app/css/` | Shared styling system |
| `site/tests/` | Unit, integration, browser tests |
| `site/scripts/` | Site npm scripts (seed, db, CDN, docs sync) |
| `site/public/` | Static web assets |
| `site/inventory/descriptors/` | Live SVG descriptor authoring inventory |
| `site/public/svg-catalog/` | Live compiled SVG output (paired with descriptors) |
| `site/features/admin/data/` | Local admin runtime (price-book store, audit log) — not live catalog authority |

**Folder map and decision tree:** `docs/site/ARCHITECTURE.md`.

## Code map (by product area)

| Area | Path |
|---|---|
| Routes | `site/app/` |
| Site | `site/app/(site)/`, `site/components/home/`, `site/features/site/data/`, `site/i18n/` |
| Planner | `site/features/planner/`, `site/app/planner/` |
| Admin | `site/features/admin/`, `site/app/admin/` |
| Catalog | `site/lib/catalog/`, `site/lib/catalog/site/`, `site/inventory/descriptors/`, `site/public/svg-catalog/` |
| Platform | `site/platform/` |

**Engines:** Fabric (2D canvas), Three.js (3D). Published SVG is the primary planner symbol.

## Catalog and SVG authority

**Target:** Products DB owns released SVG truth — `docs/architecture/08-DATABASE-SVG-CONTRACT.md`. Active blockers live in `Failures.md`.

| Surface | Live authority | Notes |
|---|---|---|
| Admin publish | **Disk** — `inventory/descriptors/`, `public/svg-catalog/` | `publishDescriptorWithPipeline.ts` |
| Planner SVG API | DB-aware when configured, disk fallback | `loadBuyerVisibleDescriptorsWithDb()` — not revision artifact bytes |
| Marketing catalog | Products DB | `catalog_products` |
| Planner managed catalog | Products DB | `planner_managed_products` |
| DB dual-write | Best-effort stub when `PRODUCTS_DATABASE_URL` set | Both `publishSvgEditorAction.ts` and `POST /api/admin/svg-editor` inject `dbRepository`; disk remains authority |
| Lifecycle + audit | `results/admin/catalog-ops/` | `_catalog-lifecycle.json`, `_descriptor-audit.jsonl` |

Tests must never mutate canonical catalog (committed descriptors or released DB rows).

## i18n

Site marketing: `next-intl`; locales `en`, `hi`, `fr`, `de`, `es`; `localePrefix: 'never'`. Planner and Admin UI: English only. Details: `docs/Lockedfiles/03-dependencies-engines-current.md`.

## Commands

Run from repo root. pnpm only. Secrets in `.env.local`.

**Setup**

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm --filter oando-site exec node scripts/validate-launch-env.mjs
```

**Dev** — `pnpm run dev` · routes: `/`, `/planner/guest/`, `/admin/`

**Checks** — `lint` · `typecheck` · `test` · `check:layout` · `check:failures` · `check:plans-purity` · `check:docs-purity`

**Release** — read `Failures.md` first · `pnpm run release:gate` · preview: `vercel:preview` · prod: `vercel:prod` (owner only)

**Routes doc** — `pnpm --filter oando-site run docs:sync:routes`

**Tech docs** (optional) — `pnpm run tech-docs:dev` · `tech-docs:generate` · `tech-docs:check` · source: `tech-docs-generator/`

## Testing

- Evidence only for behavior executed; unit green ≠ browser proof; no hidden skips; old results ≠ current status.
- Isolated temp data; catalog fixtures outside canonical paths; `finally` cleanup; idempotent reruns; no product file mutation on failure; no forced clicks in browser tests.
- Output: `results/<track>/<run-id>/{logs,reports,screenshots,traces}/` — tracks: `admin`, `planner`, `site`, `tooling`. Never under `site/`. Never PASS/done state in `results/`.
- Record: command, cwd, times, exit code, scope, retries/skips, log paths, console/errors, traces, dirty-tree impact.
- Run focused tests while coding; browser journey for UI acceptance; gates only for their decision. Checklist for completion; `Failures.md` for blockers. Inventory: `site/tests/INVENTORY.md`.

## Operations

Deploy · backup · recovery · incidents. Conduct: `AGENTS.md`. Restore detail: `docs/database/RESTORE-RUNBOOK.md`. Vercel root: **`site`** ([`site/vercel.json`](site/vercel.json)).

| Action | Steps |
|---|---|
| Production | `Failures.md` gate → `release:gate` → `vercel:prod` |
| Preview | `vercel:preview` |
| Rollback | Vercel Instant Rollback, or good commit + `vercel:prod` |

**Backup policy:** 2 Supabase + R2. Products catalog SQL, admin auth/CRM/plans, R2 `oando-asset-cdn` assets, repo zip.

| Command | Purpose |
|---|---|
| (GitHub Actions) `supabase-backup-r2.yml` | Nightly SQL + `backups/catalog/catalog-latest.json` |
| `db:backup:pgdump -- --target products\|admin` | Local dump |
| `backup:supabase:r2` / `backup:r2` / `repo:backup:r2` | Offsite |
| `supabase:backup` | Routine JSON |
| `db:backup-dropped` | Pre-drop safety |
| `backup:github-secrets:sync` | Actions secrets |

Pre-apply backup when SQL has `DROP`, type change, or backfill. Apply: `db:apply` · `db:apply:admin`. Advisors before gate: `db:advisors:security` (zero ERRORs) — `docs/database/ADVISORS.md`.

| Incident | Check |
|---|---|
| Planner down | `/planner` 200, deploy, WebGL, `PlannerErrorBoundary`, IndexedDB |
| Auth | `NEXT_PUBLIC_SUPABASE_*`, Supabase status, guest planner |
| DB | `db:test`, dashboard, pool |
| Catalog images | `assets:cdn:audit` → `assets:cdn:fix -- --apply`, R2 bucket |

**Smoke:** `/`, `/planner`, `/sitemap.xml`. **Launch:** `launch:env`, `launch:smoke`, `audit:hosted:runtime`. **Recovery:** `recovery:snapshot`, `recovery:watch`. **Maintenance:** `SITE_MAINTENANCE_MODE=readonly` on Vercel.

### Assets, CDN, catalog scripts

R2 bucket: `oando-asset-cdn`. Lifecycle/audit → `results/admin/catalog-ops/`, not `inventory/descriptors/`.

| Task | `pnpm --filter oando-site run …` |
|---|---|
| Audit / fix CDN paths | `assets:cdn:audit` · `assets:cdn:fix -- --apply` |
| Unresolved paths | `assets:cdn:replacements` |
| Download / upload assets | `assets:cdn:catalog` · `assets:cdn:upload` |
| Vendor sync | `assets:cdn:sync` |
| Catalog organize (dry) | `catalog:organize:dry` |
| Degraded snapshot | `catalog:snapshot:r2` |
| SVG audit / sync | `audit:svg-catalog` · `sync:descriptor-svgs` |
| Seeds | `seed` · `seed:configurator` · `seed:managed` · `seed:block-descriptors` |
| DB ops | `db:apply` · `db:apply:admin` · `db:test` · `db:sync-drizzle` · `db:advisors` |
| Site UI | `check:site-ui` · `check:i18n:parity` |
| Catalog QA | `catalog:blocks:qa` · `catalog:qa:sheet` · `catalog:ingest` |
| SVG smoke | `scripts:smoke:svg` · `scripts:smoke:svg:batch` · `p0:svg` |

## Pointers

- Execution: `plan/README.md`
- Architecture: `docs/INDEX.md`
- Engines / persistence: `docs/Lockedfiles/03-dependencies-engines-current.md`
