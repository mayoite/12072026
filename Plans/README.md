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
2. `AGENTS.md`
3. repo-root `PACKAGES.md`
4. [`00-governance/01-phase1-execution/01-implementation-decisions.md`](00-governance/01-phase1-execution/01-implementation-decisions.md)
5. [`00-governance/00-global-standard-revision/00-benchmark-summary.md`](00-governance/00-global-standard-revision/00-benchmark-summary.md)
6. [`01-execution/core/00-REVISION.md`](01-execution/core/00-REVISION.md)
7. [`01-execution/core/01-START.md`](01-execution/core/01-START.md)
8. [`01-execution/core/02-PHASE-1.md`](01-execution/core/02-PHASE-1.md)
9. [`01-execution/core/03-PHASE-2.md`](01-execution/core/03-PHASE-2.md)
10. [`01-execution/core/04-HANDOVER.md`](01-execution/core/04-HANDOVER.md)
If `01-execution/` conflicts with `PACKAGES.md` or `00-governance/`, governance wins.

## Execution order

1. Read this file.
2. Read [`00-governance/01-phase1-execution/01-implementation-decisions.md`](00-governance/01-phase1-execution/01-implementation-decisions.md).
3. Read [`01-execution/core/00-REVISION.md`](01-execution/core/00-REVISION.md).
4. Read [`01-execution/core/01-START.md`](01-execution/core/01-START.md).
5. Execute from [`01-execution/core/02-PHASE-1.md`](01-execution/core/02-PHASE-1.md).
6. Promote only after [`01-execution/core/03-PHASE-2.md`](01-execution/core/03-PHASE-2.md) conditions are met.
7. Use [`01-execution/core/04-HANDOVER.md`](01-execution/core/04-HANDOVER.md) for live status and blockers.

## When to open governance

Open `00-governance/` when you need:

- package or tool authority
- quality gates
- benchmark rationale
- route or contract governance
- conflict resolution between plan docs

## Install

1. Copy `.cursor/rules/planner-governance.mdc` into your repo `.cursor/rules/`.
2. Copy `prompts/*` into your repo `plans/` folder or any prompt folder you prefer.
3. In Cursor, open the prompt file you want and run it in Agent mode unless the file is a review prompt.

## What not to do

- Do not treat historical/completed plans (now archived to `archive/Plans/`) as live authority.
- Gate command evidence stays in `results/` (`TESTING.md`).
- Do not let execution docs override governance docs on package pins, gates, or standards.
- Completed/superseded plans are archived without stubs in Plans/.

## Mode guide

- Execution prompts: Agent mode + terminal.
- Delivery or checkout: Agent mode + browser/dev server.
- Review prompts: Read-only / Ask mode.
- Finalizer: Agent mode after all 3 reviews exist.