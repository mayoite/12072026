# Oando website and planner

pnpm workspace: Site, Admin, and Planner in `site/`.

## Product loop
Admin publishes inventory → Site acquires visitors → Planner designs → branded BOQ → customer sends to Oando.

Catalog truth and BOQ handoff matter as much as the canvas.

## Repository layout

### Repo root
| Path                        | Purpose |
|-----------------------------|---------|
| `site/`                     | Next.js product (`oando-site`) — only application code |
| `plan/`                     | Current execution checklists |
| `docs/`                     | Architecture, API, database reference |
| `Agents/`                   | Agent process and quality bar |
| `scripts/`                  | Repo-wide gates and layout checks |
| `.github/`                  | CI workflows |
| `Failures.md`               | Active blockers and release gate policy |
| `AGENTS.md`                 | Agent rules and repo layout policy |
| `Testing-handbook.md`       | Testing policy and command reference |
| `Readme.md`                 | This file — setup, testing, operations |
| `package.json`, `pnpm-workspace.yaml` | Workspace root |
| `results/`                  | Raw tool output only |
| `agent-reports/`            | Agent-authored notes (not proof of completion) |
| `tech-docs-generator/`      | Optional repo-intelligence tool |
| `.archive/`                 | Historical reference only |
| `websites/`                 | External research reference only |
| `PROTECTED/`                | Private owner material — never open, edit, or cite |

### `site/` product tree
| Path                        | Purpose |
|-----------------------------|---------|
| `site/app/`                 | Routes, layouts, API handlers — keep thin |
| `site/features/`            | Domain behavior (Planner, Admin tools) |
| `site/components/`          | Shared and marketing UI |
| `site/lib/`                 | Utilities, catalog core, analytics |
| `site/platform/`            | Drizzle schema, Supabase clients, migrations |
| `site/i18n/`                | `next-intl` messages and routing |
| `site/config/`              | ESLint, Playwright, build, route contract |
| `site/app/css/`             | Shared styling system |
| `site/tests/`               | Unit, integration, browser tests |
| `site/scripts/`             | Site npm scripts |
| `site/public/`              | Static web assets |
| `site/inventory/descriptors/` | Live SVG descriptor authoring inventory |
| `site/public/svg-catalog/`  | Live compiled SVG output |

## Code map
| Area      | Path |
|-----------|------|
| Routes    | `site/app/` |
| Site      | `site/app/(site)/`, `site/components/home/` |
| Planner   | `site/features/planner/`, `site/app/planner/` |
| Admin     | `site/features/admin/`, `site/app/admin/` |
| Catalog   | `site/lib/catalog/`, `site/inventory/descriptors/`, `site/public/svg-catalog/` |
| Platform  | `site/platform/` |

**Engines:** Fabric (2D canvas), Three.js (3D). Published SVG is the primary planner symbol.

## Catalog and SVG authority
Code default: disk (`site/inventory/descriptors/` + `site/public/svg-catalog/`). Durable target: Products DB + R2. Local dev may flip `SVG_RELEASE_AUTHORITY=db` in `.env.local` — cutover status and blockers live in `Failures.md` and `docs/architecture/08-DATABASE-SVG-CONTRACT.md`.

## i18n
Site marketing: `next-intl`. Planner and Admin UI: English only.

## Commands

**Dev**
PowerShell
```powershell
pnpm run dev
```
Routes: `/`, `/planner/guest/`, `/admin/`

**Checks**
PowerShell
```powershell
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run check:layout
pnpm run check:failures
pnpm run check:plans-purity
pnpm run check:docs-purity
```

**Release**
PowerShell
```powershell
pnpm run release:gate
```

Browser verification: Use only `http://localhost:3000`

## Testing
Full policy: `Testing-handbook.md`. Summary:
- Evidence only for behavior executed.
- Unit green ≠ browser proof.
- No hidden skips.
- Isolated temp data + cleanup.
- Output to root `results/<track>/`.
- Never mutate canonical catalog.

## Operations
Deploy, backup, recovery, incidents. See `docs/database/RESTORE-RUNBOOK.md`.

**Smoke:** `/`, `/planner`, `/sitemap.xml`

## Assets, CDN, catalog scripts
R2 bucket: `oando-asset-cdn`.

Common tasks via `pnpm --filter oando-site run`:
- `assets:cdn:audit`, `assets:cdn:fix -- --apply`
- `catalog:organize:dry`, `audit:svg-catalog`
- `db:apply`, `db:test`, `seed`, `seed:managed`

## Pointers
- Execution: `plan/README.md`
- Architecture: `docs/INDEX.md`
- Engines / persistence: `docs/architecture/12-DEPENDENCIES-ENGINES.md`