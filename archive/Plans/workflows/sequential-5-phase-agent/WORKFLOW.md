# Workflow

Copy to `Plans/<slug>/PLAN.md`. Fill placeholders before run.

## Identity

| Field | Value |
|-------|-------|
| Slug | `{{WORKFLOW_SLUG}}` |
| Goal | `{{PHASE_GOAL}}` |
| Authority | `{{EXECUTION_DOC}}` |
| Repo | `{{REPO_ROOT}}` |
| Surfaces | `{{SURFACES}}` |
| Gate module | `{{GATE_MODULE}}` e.g. `results/planner/phase-1b` |

## Rules

1. Sequential — one agent at a time.
2. Agent writes four reports; orchestrator dispatches and verifies only.
3. Reports → `Plans/<slug>/NN-<role>/`. Gates → `{{GATE_MODULE}}/<cmd>/` via `scripts/run-evidence-cmd.ps1`.
4. Read `AGENTS.md`, skill `SKILL.md`, authority doc; prior `executive-summary.md` **if any** from **completed earlier phases this run only** (folders `01`..`(N-1)`).
5. Skipped runs = INCOMPLETE → `failures.md` + `Failures.md`.
6. **Phase gate:** orchestrator does not dispatch phase N+1 if phase N `failures.md` has open blockers — unless user overrides.

## Reports (each phase)

| File | Substance required |
|------|-------------------|
| `observations.md` | Bullets with evidence: paths, SHAs, exit codes, artifact locations |
| `work-done.md` | Bullets: files touched, commands run, gates executed |
| `failures.md` | Bullets: each skip/blocker, reason, owner; empty if none |
| `executive-summary.md` | `Revision: <sha>` then verdict (proceed / block), summary, detail, next step |

## Phases (order matters)

| # | Folder | Skill | Delivers |
|---|--------|-------|----------|
| 1 | `01-repair-agent/` | `/implement` | Root-cause fixes — **one issue cluster per pass**, minimal diff |
| 2 | `02-benchmarker/` | `/check-work` | Named gate bundle under `{{GATE_MODULE}}`; GS + evidence integrity |
| 3 | `03-critic/` | `/review` + browser/a11y | Findings before UI work; real tool output or declared skip |
| 4 | `04-ui-expert/` | generalPurpose + UI contract + REC-01 | Thin fixes/improvements **after** critic, on `{{SURFACES}}` |
| 5 | `05-planner/` | generalPurpose | **Execution plan** in `executive-summary.md` — not setup-only |

**Why critic before UI:** review finds defects; UI expert acts on them. Avoid improve-then-tear-down.

## Run layout

```
Plans/<slug>/
  PLAN.md
  01-repair-agent/ … 05-planner/   # four .md each
```

Report filenames are fixed: `observations.md`, `work-done.md`, `failures.md`, `executive-summary.md`.