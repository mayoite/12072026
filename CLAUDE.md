# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Oando's website + planner: a pnpm/turbo monorepo. Product loop: **Admin publishes inventory → Site acquires visitors → Planner designs → branded BOQ → customer sends to Oando.** Catalog truth and BOQ handoff matter as much as the canvas.

Two workspace packages (`pnpm-workspace.yaml`):
- **`site/`** (`oando-site`) — the Next.js 16 / React 19 application; the only product code.
- **`tech-docs-generator/`** (`oando-tech-docs`) — optional repo-intelligence tool.

Everything else at the repo root (`docs/`, `plan/`, `Agents/`, `scripts/`, `results/`, `agent-reports/`) is process, execution checklists, gates, or generated output — not shipped code.

## Environment & workflow rules

- **pnpm only, from the repo root.** Never run `pnpm install` (or any install) inside `site/` or `tech-docs-generator/` — a `preinstall` guard (`scripts/guard-workspace-install.mjs`) enforces this.
- Node `>=24`, `pnpm@11.9.0`. `nodeLinker: hoisted`.
- Windows / PowerShell is the dev environment (scripts use `.ps1`, `pwsh`). Vitest uses `pool: 'forks'` for Windows V8-coverage safety.
- Secrets live **only** in repo-root `.env.local` (copy from `.env.example`). `site/` reads the root env.
- **No handwritten `any`.** No silent test skips or suppressed tests. No `results/` file is ever proof of PASS/completion.
- Do not commit or push unless the owner explicitly asks. No git worktrees.
- Re-read `AGENTS.md` before each task; it is the authoritative conduct + layout policy.
- **Status vocabulary:** use `OPEN` for unverified work and `FAIL` for a fresh failing check — never claim done from a plan tick, an old report, or a unit test standing in for a browser outcome. `Failures.md` holds active blockers only; remove an entry as part of its verified fix.

## Common commands (run from repo root)

```powershell
pnpm install                      # setup (root only)
pnpm run dev                      # proxies to `pnpm --filter oando-site dev` → routes: / , /planner/guest/ , /admin/
pnpm run lint                     # eslint, --max-warnings=0
pnpm run typecheck                # tsc --noEmit
pnpm run test                     # vitest run (unit/integration)
pnpm run build                    # check-sharp + next build + tech-docs build
```

`dev` runs Next on **Webpack** (`next dev --webpack`); Turbopack is opt-in via `pnpm run dev:turbo`.

Anything under `site/` scripts runs via `pnpm --filter oando-site run <script>` (or the root proxies above).

**Single test:** `pnpm --filter oando-site exec vitest run tests/unit/path/To.test.ts`
**Planner-only unit:** `pnpm --filter oando-site run test:planner`
**Browser (Playwright) suites:** `test:planner-catalog`, `test:a11y`, `test:e2e:planner-world`, etc. — configured via `site/config/build/playwright.config.ts`.

**Gates & release (read `Failures.md` first):**
- `pnpm run gate` — layout + docs/plans purity + agents checks + `site` fast gate.
- `pnpm run release:gate` (turbo) — full: lint, typecheck, test, build, a11y, coverage.
- `pnpm run check:layout` — repo layout guard; **run before declaring a task done** (per `AGENTS.md`).
- `p0` smoke targets: `pnpm run p0`, `p0:svg`, `p0:g8`, `p0:admin-svg`.
- Deploy (owner only): `pnpm run vercel:preview` / `vercel:prod`. Vercel root is **`site`**.

The full script surface for DB, backups, CDN/asset ops, seeding, and catalog QA lives in `site/package.json` and is documented in `Readme.md` → "Assets, CDN, catalog scripts".

## Architecture

### `site/` layers (keep the boundary)

| Layer | Role |
|---|---|
| `app/` | Routes, layouts, API handlers — keep **thin**. Groups: `(site)/`, `admin/`, `planner/`, `api/`. |
| `features/` | Domain behavior & domain UI: `planner/`, `admin/`, `site/`, `crm/`, `ops/`, `shared/`. |
| `components/` | Shared + marketing presentation (`components/home/`). |
| `lib/` | Utilities, catalog adapters (`lib/catalog/`), analytics, auth, storage. |
| `platform/` | Drizzle schema + Supabase clients + migrations (`platform/drizzle/`, `platform/supabase/`). |
| `i18n/` | `next-intl` messages + routing. |
| `config/` | Build, ESLint, Playwright, DB types, route contract. |

Route pages import from `features/` and `components/`; keep logic out of `app/`.

**Engines:** Fabric (2D canvas) + Three.js / react-three-fiber (3D). The published **SVG** is the primary planner symbol; `Block2D` is only a load/missing fallback. **One normalized document** drives 2D, 3D, save, and BOQ — preserve stable identity and millimetre units across all four.

**Planner has parallel trees** (`features/planner/project/` = live canvas document model; `catalog-api/` = panels/resolvers; `cloud-store/` = cloud saves). Do not invent a third — consolidate duplicates rather than grow both.

### Path aliases (`site/tsconfig.json`, mirrored in `vitest.config.ts`)

`@/features/*`, `@/lib/*`, `@/components/*`, `@/app/*`, `@/types/*` (→ `config/database/types/*`), `@/*` (→ `site/` root).
Supabase clients are `@/platform/supabase/*` — **not** `@/lib/supabase/*` (removed).

### Catalog & SVG authority (live vs target — code wins until cutover)

There is a deliberate split between the current live state and the target. **When docs and code differ, code wins until cutover is proven.**

| Surface | **Live authority (2026-07)** | Target |
|---|---|---|
| Admin publish | **Disk** — `site/inventory/descriptors/` + `site/public/svg-catalog/` (`publishDescriptorWithPipeline.ts`) | Products DB + R2 |
| Planner SVG read | **Disk** — `loadBuyerVisibleDescriptors()` | DB revision bytes via API |
| Marketing catalog | Products DB — `catalog_products` | (same) |
| Planner managed catalog | Products DB — `planner_managed_products` | (same) |
| Lifecycle + audit | `results/admin/catalog-ops/` (gitignored) | Durable store |

DB dual-write is a best-effort stub: both `publishSvgEditorAction.ts` and `POST /api/admin/svg-editor` inject `dbRepository` when `PRODUCTS_DATABASE_URL` is set (upserting `svg_revisions` + `block_descriptors`), but with a stub payload — disk stays the real authority. Cutover is tracked in `plan/Admin/CHECKLIST.md` (`DB-SVG-01…05`) and `docs/architecture/08-DATABASE-SVG-CONTRACT.md`.

### i18n

Site marketing uses `next-intl` (locales `en`, `hi`, `fr`, `de`, `es`; `localePrefix: 'never'`). Planner and Admin UI are **English only**.

## Testing

- **Name-mirror:** `site/<path>/File.ts` → `site/tests/unit/<path>/File.test.ts`. Rules in `docs/site/tests.md`.
- **Evidence discipline:** unit-green ≠ browser proof; old results ≠ current status; no hidden skips. Browser journeys are required for UI acceptance — target the changed route, capture console errors / failed requests / a11y failures, and check desktop + mobile widths. No forced clicks or raised timeouts to mask blocked controls.
- **Never mutate canonical catalog** (committed descriptors or released DB rows) in tests. Use isolated temp data, fixtures outside canonical paths, `finally` cleanup, idempotent reruns.
- Test output goes to `results/<track>/<run-id>/…` (tracks: `admin`, `planner`, `site`, `tooling`) — **never** under `site/results/` or `site/test-results/`. Overwrite each command's own folder; no timestamped dumps.
- Audit gates enforce this: `test:audit:hollow` (no export-only stubs), `test:audit:gate-skips` (no silent skips), `test:audit:eslint-disable`. They run inside `release:gate`.

## Key pointers

- Execution checklists: `plan/README.md` (`plan/Admin/`, `Planner/`, `Site/`, `Security/`).
- Architecture & data facts: `docs/INDEX.md`, `docs/site/ARCHITECTURE.md` ("where do I edit?" decision tree).
- Active blockers & release gate policy: `Failures.md`.
- Agent process & quality bar: `Agents/INDEX.md`, `Agents/Agents-01-STANDARD.md`.
- `PROTECTED/` is private owner material — never open, edit, or cite it. `.archive/` and `websites/` are reference only; do not import them in `site/`.
