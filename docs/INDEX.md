# Documentation index

**Budget: ≤24 live files under `docs/`.** Process → `Agents/`. Execution → `plan/`. Commands → `Readme.md`.  
Allowed exception inside budget: `site/OUTSTANDING-ITEMS.md` (thin index → track CHECKLISTs; not a fifth plan file).

**How to operate (ship discipline):** [`approach.md`](./approach.md) — factory loop first; no soft PASS; hardcoding/CSS gates.

Start: `architecture/README.md` (vision + **current vs target** table). Live SVG = disk; dual-write optional when Products DB + R2 ready ≠ cutover; target = Products DB (`08-DATABASE-SVG-CONTRACT.md`). Active cutover: `../Failures.md`. One blockers file per track: `../agent-reports/{PLANNER,ADMIN,SITE,TECH-STACK}.md`.

## Architecture (13)

| Doc | Content |
|---|---|
| `architecture/README.md` | Vision, tracks, **current vs target**, benchmarks |
| `architecture/01-MODULE-LAYOUT.md` | Code ownership, product roots |
| `architecture/02-DOMAINS.md` | Site, Admin, Planner, contracts |
| `architecture/03-MODULE-UI-CONTRACT.md` | Interface quality |
| `architecture/04-CSS-SOLUTION.md` | Styling ownership (`locked/chrome`, `locked/svg`, …) |
| `architecture/05-DATA_FLOW.md` | Live disk path + target DB flow, BOQ |
| `architecture/06-UI-BENCHMARK.md` | Planner acceptance |
| `architecture/07-ADMIN-UI-BENCHMARK.md` | Admin SVG (freehand + parametric) acceptance |
| `architecture/08-DATABASE-SVG-CONTRACT.md` | DB SVG publication contract |
| `architecture/09-SITE-UI-BENCHMARK.md` | Site acceptance |
| `architecture/10-SECURITY-BENCHMARK.md` | Security acceptance |
| `architecture/11-RUNTIME-ARCHITECTURE.md` | Live runtime, boundaries, Planner flow |
| `architecture/12-DEPENDENCIES-ENGINES.md` | Engines, i18n, persistence, CSS homes |

(Removed wrong path: `docs/Lockedfiles/` — was a one-file oddity.)

## Technical (6)

| Doc | Content |
|---|---|
| `api/ROUTE-INDEX.md` | API sources + generated route table — `pnpm --filter oando-site run docs:sync:routes` |
| `database/SCHEMA.md` | Two DBs, catalog + SVG tables honesty, Drizzle paths |
| `database/SEEDING.md` | Seed / apply commands (root env, no proof pollution) |
| `database/ADVISORS.md` | DB security/performance lints |
| `database/RESTORE-RUNBOOK.md` | Backup, restore, degraded mode |
| *(execution, not under docs/)* `plan/TechStack/CHECKLIST.md` + `FEATURES.md` | Stack health checklist + code map — install, gates, deps, CI |

## Site package maps (5) — `docs/site/`

Product code stays in `site/`. Package docs live here only.

| Doc | Content |
|---|---|
| `site/ARCHITECTURE.md` | Decision tree, folders, inventory, CSS, CDN, aliases |
| `site/features.md` | Planner / site / admin feature maps |
| `site/tests.md` | Name-mirror rules + inventory counts |
| `site/route-classification.md` | Generated live page/API routes |
| `site/OUTSTANDING-ITEMS.md` | Thin outstanding index → `plan/<Track>/` (K1–K3 unit-green; C3/C4 browser OPEN; not PASS proof) |

Execution: `../plan/README.md`. Commands / ops / testing: `../Readme.md`.
