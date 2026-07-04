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

## Global Standard Scoring (for Critic / QA / UI reviews — 0416)

Each of Critic, QA, UI **must** return explicit scores + pass/fail for GS compliance on relevant slices (no summary merging until primary):

- **Benchmark Currency**: Fresh dated report exists (plans/2026-07-04/benchmark.md or per DESIGN-BENCHMARK-PROTOCOL)? (Pass/Fail + date)
- **Anti-copy Attestation**: All visuals/tokens/UI from site/app/css/ semantic only; no donor/competitor trade dress/palettes/geometry without justification + cite? (Pass/Fail + specific benchmark § cited)
- **UI/UX Standards Alignment** (per I-D): Figma minimize-UI, Sketchfab cursor/search facets (≤24, catalogue-first), AutoCAD command surface, Planner 5D 2D↔3D continuity, Floorplanner properties? (Score 0-5 per dimension + evidence)
- **Features/Packages/SVG Mandates**: Catalogue-first + search parity in inventory (0419); locked Tier-1 only with GS justification (0420); Option A SVG contract? (Pass/Fail + cites)
- **Gate Readiness (0415)**: All 3 prerequisites met for "Implemented"? (list: benchmark, independent signed review, attestation in Decision Log)
- **Evidence**: Artifacts in results/... per testing-handbook; no bypass. (Pass/Fail)

Output format (independent):
```
GS-SCORE:
- Benchmark: PASS/FAIL (cite)
- Anti-copy: PASS/FAIL (cite §)
- UI/UX dims: [Figma: x/5, Sketchfab: x/5, ...]
- Features/Pkg: PASS/FAIL
- Gate: READY/BLOCKED
- Open: ...
```
Primary incorporates only validated findings. Applies to GS items 0415/0416/0419/0420. Revisit after live validation (design §16).

## Full Execution + Artifacts Requirement (0416)
Workflow is not complete (and cannot support "Implemented") until:
- Each of Critic, QA, UI executes independently (reads benchmark + plan + live evidence).
- Each produces full GS-SCORE + signed review doc.
- Artifacts captured: results/reviews/critic-review.md , qa-review.md , ui-review.md (per testing-handbook format + phase Decision Log entries with dates/signoffs).
- Evidence of execution (e.g. dated sections) present before primary finalization or phase status change.
- For packages/features: include 0420/0419 scores.
Static enforcement: phases/04/05/06 gate checklists require verification of these artifacts.

## CI / Gate Notes for Agent Reviews (enforcement)
- CI/release gate (see START.md + plannnerplan/QUALITY-GATES.md + root Failures.md) must fail or block if GS prerequisites missing (no benchmark, no signed reviews/, missing attestations).
- Review artifacts MUST use repo results/<module>/reviews/ or results/planner/phase-*/ (never root or E:); preserve raw + run.json equivalents for reviews.
- Add to phase exit: "REVIEW-WORKFLOW executed + results/reviews/ present + GS-SCOREs validated".
- No opinion passing; independent files only. Shell-blocked runs logged as INCOMPLETE (per Failures.md); static review of docs counts for doc gates only.
- Cross: design §6, benchmark, I-D Global Standard Package Review, phases Global Standard Gate sections.
