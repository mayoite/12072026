# Documentation index

Start: `architecture/README.md` (vision + **current vs target** table). Live SVG = disk; target = Products DB (`08-DATABASE-SVG-CONTRACT.md`).

## Architecture

| Doc | Content |
|---|---|
| `architecture/README.md` | Vision, tracks, boundaries, benchmarks, quality |
| `architecture/01-MODULE-LAYOUT.md` | Code ownership, product roots |
| `architecture/02-DOMAINS.md` | Site, Admin, Planner, contracts |
| `architecture/03-MODULE-UI-CONTRACT.md` | Interface quality |
| `architecture/04-CSS-SOLUTION.md` | Styling ownership |
| `architecture/05-DATA_FLOW.md` | Live disk path + target DB flow, BOQ |
| `architecture/06-UI-BENCHMARK.md` | Planner acceptance |
| `architecture/07-ADMIN-UI-BENCHMARK.md` | Admin SVG acceptance |
| `architecture/08-DATABASE-SVG-CONTRACT.md` | DB SVG publication contract |
| `architecture/09-SITE-UI-BENCHMARK.md` | Site acceptance |
| `architecture/10-SECURITY-BENCHMARK.md` | Security acceptance |

## Technical

| Doc | Content |
|---|---|
| `api/README.md` | API sources |
| `api/ROUTE-INDEX.md` | Generated routes — `pnpm --filter oando-site run docs:sync:routes` |
| `database/SCHEMA.md` | Tables, indexes, RLS |
| `database/SEEDING.md` | Seed commands |
| `database/ADVISORS.md` | DB security/performance lints |
| `database/RESTORE-RUNBOOK.md` | Backup, restore, degraded mode |
| `Lockedfiles/03-dependencies-engines-current.md` | Engines, i18n, persistence, licenses |

## Site package (moved from `site/*.md`)

Product code stays in `site/`. Package maps live here:

| Doc | Content |
|---|---|
| `site/ARCHITECTURE.md` | `site/` package decision tree + folders |
| `site/tests-CONTENTS.md` | Unit name-mirror layout |
| `site/tests-INVENTORY.md` | Test file counts |
| `site/inventory.md` | Descriptor inventory path |
| `site/features-*.md` | Feature folder maps |
| `site/route-classification.md` | Generated live routes |

Execution: `../plan/README.md`. Commands / ops / testing: `../Readme.md`.
