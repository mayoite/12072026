# Documentation index

**Budget: ≤25 live files under `docs/`.** Process → `Agents/`. Execution → `plan/`. Commands → `Readme.md`.

**How to operate (ship discipline):** [`approach.md`](./approach.md) — factory loop first; no soft PASS; hardcoding/CSS gates.

Start: `architecture/README.md` (vision + **current vs target** table). **SVG authority:** code default = disk; local dev may set `SVG_RELEASE_AUTHORITY=db` in `.env.local`; full cutover OPEN in `../Failures.md`. Dual-write optional when Products DB + R2 ready ≠ cutover. Target contract: `08-DATABASE-SVG-CONTRACT.md`. One blockers file per track: `../agent-reports/{PLANNER,ADMIN,SITE,TECH-STACK}.md`.

## Architecture (14)

| Doc | Content |
|---|---|
| `architecture/README.md` | Vision, tracks, **current vs target**, benchmarks |
| `architecture/01-MODULE-LAYOUT.md` through `13-PARAMETRIC-PRODUCT-FACTORY.md` | Module layout, domains, UI contracts, CSS, data flow, benchmarks, runtime, engines, parametric factory |

## Technical (6)

| Doc | Content |
|---|---|
| `api/ROUTE-INDEX.md` | API sources + generated route table — `pnpm --filter oando-site run docs:sync:routes` |
| `database/SCHEMA.md` | Two DBs, catalog + SVG tables honesty, Drizzle paths |
| `database/SEEDING.md` | Seed / apply commands (root env, no proof pollution) |
| `database/ADVISORS.md` | DB security/performance lints |
| `database/RESTORE-RUNBOOK.md` | Backup, restore, degraded mode |
| *(execution, not under docs/)* `plan/TechStack/CHECKLIST.md` + `FEATURES.md` | Stack health checklist + code map — install, gates, deps, CI |

## Site package maps (4) — `docs/site/`

Product code stays in `site/`. Package docs live here only.

| Doc | Content |
|---|---|
| `site/ARCHITECTURE.md` | Decision tree, folders, inventory, CSS, CDN, aliases |
| `site/features.md` | Planner / site / admin feature maps |
| `site/tests.md` | Name-mirror rules + inventory counts |
| `site/route-classification.md` | Generated live page/API routes |

Execution: `../plan/README.md`. Commands / ops / testing: `../Readme.md`.
