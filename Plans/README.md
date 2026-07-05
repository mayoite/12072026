# Plans

Start here.

## Purpose

- `fn_plan/` = execution plan
- `rules_plan/` = governance plan

Use `fn_plan/` to do the work.
Use `rules_plan/` to resolve conflicts, gates, and standards.

## Authority Order

1. Current user direction
2. `AGENTS.md`
3. repo-root `PACKAGES.md`
4. [`rules_plan/01-phase1-execution/01-implementation-decisions.md`](rules_plan/01-phase1-execution/01-implementation-decisions.md)
5. [`rules_plan/00-global-standard-revision/00-benchmark-summary.md`](rules_plan/00-global-standard-revision/00-benchmark-summary.md)
6. [`fn_plan/00-REVISION.md`](fn_plan/00-REVISION.md)
7. [`fn_plan/01-START.md`](fn_plan/01-START.md)
8. [`fn_plan/02-PHASE-1.md`](fn_plan/02-PHASE-1.md)
9. [`fn_plan/03-PHASE-2.md`](fn_plan/03-PHASE-2.md)
10. [`fn_plan/04-HANDOVER.md`](fn_plan/04-HANDOVER.md)
11. Remaining `fn_plan/` files as supporting execution docs

If `fn_plan/` conflicts with `PACKAGES.md` or `rules_plan/`, governance wins.

## Execution Order

1. Read this file.
2. Read [`rules_plan/01-phase1-execution/01-implementation-decisions.md`](rules_plan/01-phase1-execution/01-implementation-decisions.md).
3. Read [`fn_plan/00-REVISION.md`](fn_plan/00-REVISION.md).
4. Read [`fn_plan/01-START.md`](fn_plan/01-START.md).
5. Execute from [`fn_plan/02-PHASE-1.md`](fn_plan/02-PHASE-1.md).
6. Promote only after [`fn_plan/03-PHASE-2.md`](fn_plan/03-PHASE-2.md) conditions are met.
7. Use [`fn_plan/04-HANDOVER.md`](fn_plan/04-HANDOVER.md) for live status and blockers.

## When To Open Rules

Open `rules_plan/` when you need:

- package or tool authority
- quality gates
- benchmark rationale
- route or contract governance
- conflict resolution between plan docs

## What Not To Do

- Do not treat research files as execution authority.
- Do not merge analysis notes into live plan files without an explicit decision.
- Do not let execution docs override governance docs on package pins, gates, or standards.
