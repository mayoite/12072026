# Documentation Map

**Last updated:** 2026-06-30

**Owns:** index of reference docs. Which doc to open → `docs/Lockedfiles/ReadmeLocked.md`.

## Lockedfiles

- `docs/Lockedfiles/AgentsLocked.md` — frozen `AGENTS.md` conduct snapshot
- `docs/Lockedfiles/ReadmeLocked.md` — frozen doc-routing layer
- `docs/Lockedfiles/TestingLocked.md` — frozen `TESTING.md` artifact contract

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

- `docs/architecture/CSS-SOLUTION.md` — Concrete CSS operating model and migration order
- `docs/architecture/COMPONENT_ARCHITECTURE.md` — Component layers
- `docs/architecture/DATA_FLOW.md` — Data flow overview
- `docs/architecture/DEPLOYMENT.md` — Deployment notes
- `docs/architecture/SYSTEM_OVERVIEW.md` — **redirect** → `COMPONENT_ARCHITECTURE.md`, `DATA_FLOW.md`
- `docs/architecture/STRUCTURE_GUIDELINES.md` — **redirect** → `CSS-SOLUTION.md`, `AGENTS.md`

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

## Plans

- `plans/README.md` — plan index
- `plans/tech-stack-generator-7-file-plan/` — active tech-stack generator pack (2026-06-30)
- `archive/plans/done/database-consolidation-3-file-plan/` — 2 Supabase + R2 packet
- `archive/plans/done/tech-stack-docs-3-file-plan/` — tech-stack docs packet
- `archive/plans/done/planner-unified-3-file-plan/` — canonical planner packet
- `archive/plans/done/sketch-to-plan-3-file-plan/` — sketch-to-plan packet
- `archive/plans/wip/` — superseded multi-file packets

## Feature documentation

- `site/features/planner/CONTENTS.md` — Planner feature overview
- `site/features/catalog/CONTENTS.md` — Catalog feature overview
- `site/features/shared/CONTENTS.md` — Shared feature code
- Each feature subdirectory has its own `CONTENTS.md`

## Tech-stack site

- `tech-stack-generator/` — Vite render shell for tech-stack documentation
- Commands: **`START.md`** (Tech-stack docs)
- Audit: `docs/audit/tech-stack-generator/`
