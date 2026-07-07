# Plans

## User coments
1. Added Research.md on 7th July 2026 at 20:40 PM IST
2. Added pending-clean.md up claimed to by Grok on 7th July 2026 at 20:40 PM IST

## Orginal text
Start here.

## Layout

| Folder | Role |
|--------|------|
| [`00-governance/`](00-governance/) | Binding pins, benchmarks, quality gates, review workflow |
| [`01-execution/`](01-execution/) | Day-to-day Phase 1A/1B work and promotion sequencing |

**Recent executed plans (stubs, full archived):**
- `site-workflows-plan-2026-07.md`
- `current-issues-resolution-2026-07.md`

**Phase 1:** 1A + 1B COMPLETE (see `01-execution/core/02-PHASE-1.md` status + `phase1-checklist.md`; agent reports in `archive/1b-5phase-agent-workflow/`).

Completed/superseded plans archived to `archive/Plans/` (no stubs left, per cleanup). See archive for full content.

Use `01-execution/` to do the work.
Use `00-governance/` to resolve conflicts, gates, and standards.

## Authority order

1. Current user direction
2. **`AGENTS.md`** — sole agent conduct authority
3. Planner / product docs below — reference when the task needs them (`PACKAGES.md`, `00-governance/`, `01-execution/`)

## Execution order

1. [`AGENTS.md`](../AGENTS.md)
2. [`Plans.md`](../Plans.md) for planner phase work
3. [`00-governance-checklist.md`](00-governance/01-phase1-execution/00-governance-checklist.md) for phase status

## When to open governance

Open `00-governance/` when you need:

- package or tool authority
- quality gates
- benchmark rationale
- route or contract governance
- conflict resolution between plan docs

## Agent setup

Agents read repo-root **`AGENTS.md`** only. No separate Cursor rules or prompt packs required.

## What not to do

- Do not treat historical/completed plans (now archived to `archive/Plans/`) as live authority.
- Gate command evidence stays in `results/` (`TESTING.md`).
- Do not let execution docs override governance docs on package pins, gates, or standards.
- Completed/superseded plans are archived without stubs in Plans/.

## Mode guide

- Default: Agent mode per `AGENTS.md` (targeted tests; no full suite per phase).
- Ship / release: user triggers full gates (`Failures.md`, `START.md`).