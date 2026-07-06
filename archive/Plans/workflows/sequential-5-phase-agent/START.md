# Start a new workflow run

## 1. Identity

```
WORKFLOW_SLUG   = e.g. 2a-5phase-agent-workflow
PHASE_GOAL      = one sentence
EXECUTION_DOC   = Plans/01-execution/core/03-PHASE-2.md
REPO_ROOT       = D:\oandO04072026
SURFACES        = routes/components in scope
```

## 2. Create run folder

From repo root:

```powershell
$slug = "2a-5phase-agent-workflow"
New-Item -ItemType Directory -Force -Path "Plans/$slug"
Copy-Item "Plans/workflows/sequential-5-phase-agent/WORKFLOW.md" "Plans/$slug/PLAN.md"
Copy-Item -Recurse "Plans/workflows/sequential-5-phase-agent/reports" "Plans/$slug/_report-stubs"
```

```powershell
@("01-repair-agent","02-benchmarker","03-ui-expert","04-critic","05-planner") | ForEach-Object {
  $d = "Plans/$slug/$_"
  New-Item -ItemType Directory -Force -Path $d | Out-Null
  @("observations","work-done","failures","executive-summary") | ForEach-Object {
    Copy-Item "Plans/$slug/_report-stubs/$_.md.stub" "$d/$_.md"
  }
}
```

Fill `{{...}}` in `Plans/$slug/PLAN.md`.

## 3. Optional worktree

```powershell
git worktree add "worktrees/$slug" -b "exec/$slug"
```

## 4. Run

Follow [`ORCHESTRATOR-RUNBOOK.md`](ORCHESTRATOR-RUNBOOK.md) from `{{REPO_ROOT}}`. Phases 1 → 5 in order.