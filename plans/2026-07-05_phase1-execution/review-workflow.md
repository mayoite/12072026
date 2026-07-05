# Benchmark Review Workflow

Date: 2026-07-05

Use after a plan slice, benchmark refresh, or phase update.

---

## Sequence

1. Execution finishes.
2. Critic reviews against the three benchmark files + live evidence.
3. QA reviews independently.
4. UI reviews independently.
5. Primary agent finalizes.

---

## Agent rules

- Read `benchmark-foundation.md`, `benchmark-delivery.md`, `benchmark-governance.md`, and the matching plan file (`plan-foundation.md` / `plan-delivery.md` / `plan-closeout.md`).
- Read root `Failures.md` before gates.
- Each agent returns one independent opinion.
- Do not pass opinions between agents.
- Primary merges only after all three finish.

---

## Primary agent

Receives three reviews. Keeps validated findings only. Updates plan status and `resolved-failures.md` when items close.

---

## Scope

- `plans/2026-07-05_phase1-execution/benchmark-*.md`
- `plans/2026-07-05_phase1-execution/plan-*.md`
- `plans/2026-07-05_phase1-execution/handover-routing.md`
- `plans/2026-07-05_phase1-execution/implementation-decisions.md`
- `plans/2026-07-05_phase1-execution/quality-gates.md`
- `plans/2026-07-05_phase1-execution/design-benchmark-protocol.md`
- Root `Failures.md` and `resolved-failures.md`

Does not replace repo `AGENTS.md`.

---

## Global Standard scoring (0416)

Each reviewer returns:

```
GS-SCORE:
- Benchmark: PASS/FAIL (cite + date)
- Anti-copy: PASS/FAIL (cite §)
- UI/UX: [Figma x/5, Sketchfab x/5, ...]
- Features/Pkg: PASS/FAIL
- Gate: READY/BLOCKED
- Open: ...
```

**Dimensions:** Benchmark currency · Anti-copy · UI/UX alignment · Features/packages/SVG mandates · Gate readiness · Evidence in `results/`.

---

## Artifacts (required before Implemented)

- `results/reviews/critic-review.md`
- `results/reviews/qa-review.md`
- `results/reviews/ui-review.md`

Or `results/planner/phase-*/` with `*-run.json` + `*-raw.log` per `testing-handbook.md`.

Shell-blocked runs are INCOMPLETE. Log in `Failures.md`.

---

## Phase exit

Coordinator checks: REVIEW-WORKFLOW ran · three review files exist · GS-SCOREs validated · Decision Log dated.

Release gate blocks if GS prerequisites missing.

Provisional until live site validation (design §16).
