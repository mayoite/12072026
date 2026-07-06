# Plans

Start here.

## Layout

| Folder | Role |
|--------|------|
| [`00-governance/`](00-governance/) | Binding pins, benchmarks, quality gates, review workflow |
| [`01-execution/`](01-execution/) | Day-to-day Phase 1A/1B work and promotion sequencing |
| [`../Agents_work/1b-5phase-agent-workflow/`](../Agents_work/1b-5phase-agent-workflow/) | Phase 1B five-agent run — `PLAN.md` + 4-file agent reports (01-repair through 05-planner) |
| [`Plan_06072026/`](Plan_06072026/) | Reconciled from C:\oando06072026forrecovery — execution contract + 02-09 domain plans (SVG, evidence, lockedfiles, routes etc.) |
| [`meta/`](meta/) | Coordinator notes — reference only |
| [`../Agents_work/`](../Agents_work/) | Preserved agent output — reviews, narratives, notes |

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
11. Remaining `01-execution/specialists/` files as supporting execution docs

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

## What not to do

- Do not treat `01-execution/research/`, `meta/`, or `Agents_work/` as execution authority for gates.
- Gate command evidence stays in `results/` (`TESTING.md`); agent narratives go in `Agents_work/`.
- Do not delete agent work — `archive/Plans/02-proposed/`, `Agents_work/`, and `archive/*recovery-reconcile*` are preserved. Agent reports consolidated under `Agents_work/1b-5phase-agent-workflow/`.
- Do not treat archived `02-proposed/` as live execution authority.
- Do not merge analysis notes into live plan files without an explicit decision.
- Do not let execution docs override governance docs on package pins, gates, or standards.