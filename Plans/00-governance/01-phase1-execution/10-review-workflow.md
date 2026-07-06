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

- Read `05-benchmark-foundation.md`, `06-benchmark-delivery.md`, `07-benchmark-governance.md`, and the matching plan file (`02-plan-foundation.md` / `03-plan-delivery.md` / `04-plan-closeout.md`).
- Read root `Failures.md` before gates.
- Each agent returns one independent opinion.
- Do not pass opinions between agents.
- Primary merges only after all three finish.

---

## Primary agent

Receives three reviews. Keeps validated findings only. Updates plan status and `resolved-failures.md` when items close.

---

## Scope

- `00-governance/01-phase1-execution/05-benchmark-foundation.md`
- `00-governance/01-phase1-execution/06-benchmark-delivery.md`
- `00-governance/01-phase1-execution/07-benchmark-governance.md`
- `00-governance/01-phase1-execution/02-plan-foundation.md`
- `00-governance/01-phase1-execution/03-plan-delivery.md`
- `00-governance/01-phase1-execution/04-plan-closeout.md`
- `00-governance/01-phase1-execution/00-handover-routing.md`
- `00-governance/01-phase1-execution/01-implementation-decisions.md`
- `00-governance/01-phase1-execution/08-quality-gates.md`
- `00-governance/01-phase1-execution/09-design-benchmark-protocol.md`
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

**Reviews (agent output):**

- `Agents workflow/reviews/critic-review.md`
- `Agents workflow/reviews/qa-review.md`
- `Agents workflow/reviews/ui-review.md`

**Gate evidence:** `results/<module>/<phase>/<cmd>/` with `*-run.json` + `*-raw.log` per `testing-handbook.md`.

Shell-blocked runs are INCOMPLETE. Log in `Failures.md`.

---

## Phase exit

Coordinator checks: REVIEW-WORKFLOW ran · three review files exist · GS-SCOREs validated · Decision Log dated.

Release gate blocks if GS prerequisites missing.

Provisional until live site validation (design §16).
