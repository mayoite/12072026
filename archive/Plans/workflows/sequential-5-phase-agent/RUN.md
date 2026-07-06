# Run

## New run

Set: `WORKFLOW_SLUG`, `PHASE_GOAL`, `EXECUTION_DOC`, `REPO_ROOT`, `SURFACES`, `GATE_MODULE`.

```powershell
$slug = "<slug>"
$phases = "01-repair-agent","02-benchmarker","03-critic","04-ui-expert","05-planner"
$reports = "observations.md","work-done.md","failures.md","executive-summary.md"
New-Item -Force -ItemType Directory "Plans/$slug" | Out-Null
foreach ($p in $phases) {
  New-Item -Force -ItemType Directory "Plans/$slug/$p" | Out-Null
  foreach ($r in $reports) { New-Item -Force -ItemType File "Plans/$slug/$p/$r" | Out-Null }
}
Copy-Item "Plans/workflows/sequential-5-phase-agent/WORKFLOW.md" "Plans/$slug/PLAN.md"
```

Fill `PLAN.md`. Record `git rev-parse HEAD` as run start SHA in phase 1 `executive-summary.md`. Optional worktree: `git worktree add worktrees/$slug -b exec/$slug`.

## Dispatch (×5)

1. Fill `PROMPTS.md` for this phase.
2. Agent loads skill; reads prior `executive-summary.md` **if any** (completed phases `01`..`(N-1)` only).
3. Agent overwrites four reports with substantive content per `WORKFLOW.md`.
4. Orchestrator verifies files exist and are non-empty stubs.
5. If `failures.md` has open blockers → stop; log `Failures.md`; wait for user unless override.
6. Gate evidence under `{{GATE_MODULE}}/<cmd>/` with `*-run.json` + `*-raw.log`.

## Done

- [ ] Five folders; four agent-written reports each with substance rules met
- [ ] Phase 3: a11y/review artifacts cited **or** explicit tool skip in `failures.md`
- [ ] Phase 5: `executive-summary.md` is executable plan — **not** setup-only
- [ ] No agent `.md` under `results/`
- [ ] End SHA in planner `executive-summary.md` or handover