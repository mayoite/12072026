# Documentation Map

**Last updated:** 2026-07-05

**Owns:** index of reference docs. Which doc to open → `docs/Lockedfiles/conduct/ReadmeLocked.md`.

## Lockedfiles

**Index:** [`docs/Lockedfiles/INDEX.md`](docs/Lockedfiles/INDEX.md) — domain map (`<module>/current.md` + `proposed.md`).

```
docs/Lockedfiles/
├── INDEX.md
├── conduct/          ← frozen conduct snapshots (AgentsLocked, ReadmeLocked, TestingLocked, TestingHandbookLocked)
├── ui/
│   └── MODULE-UI-CONTRACT-Locked.md
├── planner/          ← current.md · proposed.md
├── admin/
├── site/
├── …                 ← one folder per domain module (see INDEX.md)
└── DomainTruthLocked.md  ← redirect → INDEX.md
```

- **Conduct snapshots** — `docs/Lockedfiles/conduct/` (`AgentsLocked.md`, `ReadmeLocked.md`, `TestingLocked.md`, `TestingHandbookLocked.md`)
- **Module UI contract (locked)** — `docs/Lockedfiles/ui/MODULE-UI-CONTRACT-Locked.md`
- **Domain truth (per module)** — `docs/Lockedfiles/<module>/current.md` + `proposed.md` (e.g. `planner/`, `admin/`, `architecture/`)

## Root doc chain

- `AGENTS.md` — Agent conduct
- `Readme.md` — Repo facts, layout, app paths, data, CSS
- `START.md` — Dev, test, and release commands
- `TESTING.md` — Test layout and artifact paths
- `Failures.md` — Gate policy, blockers, skips
- `HANDOVER.md` — Active session status and priority backlog
- `OPERATIONS_RUNBOOK.md` — Deploy, backup, incidents
- `DOC-MAP.md` — This file
- `ADMIN_workflow.md` — Admin UI routes and workflow

## Architecture

- [`docs/architecture/README.md`](docs/architecture/README.md) — **start here**; expert matrix and authority stack
- [`docs/architecture/MODULE-LAYOUT.md`](docs/architecture/MODULE-LAYOUT.md) — Where routes, features, components, and CSS live
- [`docs/architecture/MODULE-UI-CONTRACT.md`](docs/architecture/MODULE-UI-CONTRACT.md) — Module UI contract (live); locked: `docs/Lockedfiles/ui/MODULE-UI-CONTRACT-Locked.md`
- [`docs/architecture/ADMIN-UI-CONTRACT.md`](docs/architecture/ADMIN-UI-CONTRACT.md) — Admin UI rules (proposed; UI-2)
- [`docs/architecture/CSS-SOLUTION.md`](docs/architecture/CSS-SOLUTION.md) — CSS operating model
- [`docs/architecture/SITE-MARKETING-UI-CONTRACT.md`](docs/architecture/SITE-MARKETING-UI-CONTRACT.md) — Marketing (UI-3 deferred)
- [`docs/architecture/COMPONENT_ARCHITECTURE.md`](docs/architecture/COMPONENT_ARCHITECTURE.md) — Component map (current + proposed §)
- [`docs/architecture/DATA_FLOW.md`](docs/architecture/DATA_FLOW.md) — Flows §1–4 legacy; §5–6 open3d + SVG
- [`docs/architecture/DEPLOYMENT.md`](docs/architecture/DEPLOYMENT.md) — Deployment notes
- [`docs/architecture/SYSTEM_OVERVIEW.md`](docs/architecture/SYSTEM_OVERVIEW.md) — **redirect** → `COMPONENT_ARCHITECTURE.md`, `DATA_FLOW.md`
- [`docs/architecture/STRUCTURE_GUIDELINES.md`](docs/architecture/STRUCTURE_GUIDELINES.md) — **redirect** → `CSS-SOLUTION.md`, `AGENTS.md`
- **Locked baseline** — `docs/Lockedfiles/architecture/current.md` + `proposed.md`

## API

- `docs/api/README.md` — contract source (no OpenAPI on disk)
- `docs/api/ROUTE-INDEX.md` — Full route/method inventory from `site/app/api/**/route.ts`

## Database

- `docs/database/SCHEMA.md` — Schema reference with ERDs + RLS matrix
- `docs/database/SEEDING.md` — Seeding workflow
- `docs/database/ADVISORS.md` — Database advisors (security + performance)
- `docs/database/RESTORE-RUNBOOK.md` — Restore procedures

## Audit (phase 2 lanes — 2026-06-27)

Index: [`docs/audit/README.md`](docs/audit/README.md)

- **Planner** — [`docs/audit/planner/`](docs/audit/planner/) — unified proofs, offline E2E, BOM browser smoke
- **Site UI** — [`docs/audit/siteui/`](docs/audit/siteui/) — release gate, i18n E2E
- **Root** — [`docs/audit/root/`](docs/audit/root/) — root files, env template, remediation note
- **Admin** — [`docs/audit/admin/`](docs/audit/admin/) — Playwright E2E
- **AI** — [`docs/audit/ai/`](docs/audit/ai/) — sketch browser proofs
- **Database** — [`docs/audit/database/`](docs/audit/database/) — advisors, structure, coverage gaps

Legacy comprehensive audit (2026-06-20): not on disk — use [`docs/audit/README.md`](docs/audit/README.md); historical runs in `archive/results/audits/`.

## Plans (`Plans/`)

Binding pins, benchmarks, gates, and execution — [`Plans/README.md`](Plans/README.md):

| # | Pack | Role |
|---|------|------|
| 00 | `Plans/00-governance/` | Phase 0 GS benchmark + Phase 1 pins, gates, review workflow |
| 01 | `Plans/01-execution/` | Day-to-day Phase 1A/1B execution (`core/`, `specialists/`, `research/`) |
| 02 | `Plans/02-proposed/` | Draft consolidation — reference only |

**Start:** `Plans/00-governance/01-phase1-execution/00-handover-routing.md` · **Binding:** `01-implementation-decisions.md` · **Execute:** `Plans/01-execution/core/02-PHASE-1.md`

Historical phase specs stay at `archive/plans/2026-07-05_phase1-execution/` (repo archive — not renamed).

## Other plan packets

- `archive/plans/done/database-consolidation-3-file-plan/` — 2 Supabase + R2 packet
- `archive/plans/done/tech-stack-docs-3-file-plan/` — tech-stack docs packet
- `archive/plans/done/planner-unified-3-file-plan/` — canonical planner packet
- `archive/plans/done/sketch-to-plan-3-file-plan/` — sketch-to-plan packet
- `archive/plans/wip/` — superseded multi-file packets

## Planner execution (`plann/`)

Read in order — [`plann/README.md`](plann/README.md):

| # | File | Role |
|---|------|------|
| 00 | `plann/00-REVISION.md` | Product decisions (Option A, 1A/1B) |
| 01–04 | `01-START` … `04-HANDOVER` | Commands, phases, session status |
| 05–08 | Expert drafts + `06-UI-PLAN` / `08-TEST-PLAN` | UI + test execution authority |
| 09 | `plann/09-DOC-REVISION.md` | Doc batch coordinator log |

## Feature documentation

- `site/features/planner/CONTENTS.md` — Planner feature overview
- `site/features/catalog/CONTENTS.md` — Catalog feature overview
- `site/features/shared/CONTENTS.md` — Shared feature code
- Each feature subdirectory has its own `CONTENTS.md`

## Tech-stack site

- `tech-stack-generator/` — Vite render shell for tech-stack documentation
- Commands: **`START.md`** (Tech-stack docs)
- Audit: `docs/audit/tech-stack-generator/`
