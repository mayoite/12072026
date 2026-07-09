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

**Live only:** [`Plans/README.md`](Plans/README.md) → **[`Plans/trustdata/`](Plans/trustdata/)** (INDEX · 00-START · phases · CHECKPOINTS).

| Path | Role |
|------|------|
| `Plans/trustdata/` | Active world-standard / product plan |
| `archive/Plans/` | Historical packs only — not authority |

Do not use `Plans/00-governance/`, `Plans/01-execution/`, or `Plans/02-recovery/` — those trees are archived.

## Agent workflow artifacts (1B)

Agent narrative outputs (observations, work-done, failures, executive-summary + PLAN) live under:

- `archive/1b-5phase-agent-workflow/` — archived 1b-5phase agent workflow (5 phases + PLAN.md)
- `archive/Agents_work/` (reviews/, benchmark/, checklists/, notes/)
- First-pass reports preserved in `archive/1b-5phase-first-pass/` and `archive/recovery-reconcile-*`

See `Plans/README.md`, `archive/Agents_work/README.md`, and `AGENTS.md` (narratives ≠ gate evidence; evidence stays in `results/`).

## Other plan packets

- `archive/Plans/done/database-consolidation-3-file-plan/` — 2 Supabase + R2 packet
- `archive/Plans/done/tech-stack-docs-3-file-plan/` — tech-stack docs packet
- `archive/Plans/done/planner-unified-3-file-plan/` — canonical planner packet
- `archive/Plans/done/sketch-to-plan-3-file-plan/` — sketch-to-plan packet
- `archive/Plans/wip/` — superseded multi-file packets

## Planner execution (historical `plann/`)

**Historical** — renamed/consolidated into `Plans/`. See [`Plans/README.md`](Plans/README.md) for current.

Old paths referenced in archives/recovery data only.

## Feature documentation

- `site/features/planner/CONTENTS.md` — Planner feature overview
- `site/features/catalog/CONTENTS.md` — Catalog feature overview
- `site/features/shared/CONTENTS.md` — Shared feature code
- Each feature subdirectory has its own `CONTENTS.md`

## Tech-stack site

- `tech-stack-generator/` (under site/) — Vite render shell for tech-stack + site-workflows documentation (builds to `site/tech-stack-docs/`, served at `/tech-stack-docs/`)
- Commands: **`START.md`** (Tech-stack docs)
- Audit: `docs/audit/tech-stack-generator/`
