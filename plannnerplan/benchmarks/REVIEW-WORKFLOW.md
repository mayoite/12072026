# Benchmark Review Workflow

Date: 2026-07-04

Use this workflow after execution has produced a plan revision, benchmark refresh, or phase brief update.

## Sequence

1. Execution completes for the plan slice.
2. Critic agent reviews the executed output against the benchmark corpus.
3. QA agent reviews the same output independently.
4. UI agent reviews the same output independently.
5. Primary agent finalization.

## Agent rules

- Each agent reads the current benchmark corpus and the live plan docs directly after execution.
- Each agent also performs its own current search or evidence check as needed for the task.
- Each agent returns an independent opinion only.
- Do not pass one agent's opinion to the next agent.
- Do not merge or summarize reviewer opinions until they reach the primary agent.

## Primary-agent rule

The primary agent receives all three independent reviews after they complete, incorporates only the findings that survive validation, and then finalizes the plan.

## Scope

This workflow applies to:

- `plannnerplan/benchmarks/*`
- `plannnerplan/HANDOVER.md`
- `plannnerplan/FAILURESPLAN.md`
- `plannnerplan/IMPLEMENTATION-DECISIONS.md`
- `plannnerplan/QUALITY-GATES.md`
- `plannnerplan/DESIGN-BENCHMARK-PROTOCOL.md`

It does not replace the repo or system instructions; it just standardizes the review handoff order inside `plannnerplan`.

## Intensification for Global Standard Revision (2026-07-04)

- Critic, QA, UI reviews **must** explicitly score against global standard + UI/UX/SVG/features/packages rules from IMPLEMENTATION-DECISIONS.md and 2026-07-04 benchmark report (5-product model, anti-copy, etc.).

- Every UI/SVG/feature/package change requires dated benchmark report before primary agent finalization.

- Evidence capture mandatory (standardized `results/<module>/<phase>/<cmd>/` format per testing-handbook.md).

- Add global standard compliance to primary finalization criteria.

- No opinion passing between agents on global standard matters.

- Provisional pending live site validation after tests and site up (design §16). Update this workflow on revisit.
