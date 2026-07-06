# Subagent Notes

Reference only. Not execution authority.

## Useful Conclusions

### Plans layout

- `00-governance/` and `01-execution/` stay separate; governance wins on pins, gates, standards.
- `workflows/sequential-5-phase-agent/` is the reusable 5-phase dispatch pattern (four root files: `README`, `WORKFLOW`, `RUN`, `PROMPTS`).
- Each **run** gets `Plans/<slug>/` with five phase folders; agent reports live there.
- `Agents workflow/` is the Phase 1B run instance — `PLAN.md` + `PROMPTS.md` filled; folders match workflow (`03-critic` then `04-ui-expert`). First-pass reports preserved; re-run per `RUN.md` for substantive completion.
- `archive/plans/02-proposed/` is preserved agent consolidation — not live authority.
- `meta/` (this file) is coordinator notes only.

### Agent work vs gate evidence

- **Agent output** — reports → `Plans/<slug>/NN-<role>/`; reviews → `Agents workflow/reviews/`; preserved; do not delete or demote.
- **Gate evidence** — vitest, lint, typecheck, Playwright → `results/<module>/…` with `*-run.json` + `*-raw.log` per `TESTING.md`.
- Read agent reports before moving or archiving. Relocation organizes; it does not downgrade.

### 5-phase workflow (current)

| # | Folder | Skill |
|---|--------|-------|
| 1 | `01-repair-agent/` | `/implement` — one root-cause cluster, minimal diff |
| 2 | `02-benchmarker/` | `/check-work` — named gate bundle under `{{GATE_MODULE}}` |
| 3 | `03-critic/` | `/review` + a11y tools — before UI work |
| 4 | `04-ui-expert/` | generalPurpose + UI contract + REC-01 |
| 5 | `05-planner/` | generalPurpose — execution plan, not setup-only |

- Each agent writes four reports (`observations`, `work-done`, `failures`, `executive-summary`) with substance rules in `WORKFLOW.md`.
- Orchestrator dispatches only; does not ghost-write reports.
- Prior context: earlier `executive-summary.md` **if any**, completed phases this run only.
- Phase gate: do not advance on open `failures.md` blockers unless user overrides.
- Fill `{{GATE_MODULE}}` per run (e.g. `results/planner/phase-1b`).

### Repo

- Canonical repo: `D:\oandO04072026`. Avoid stale C: worktrees for execution.

## Practical Reading Order

1. [`../README.md`](../README.md)
2. [`../00-governance/01-phase1-execution/01-implementation-decisions.md`](../00-governance/01-phase1-execution/01-implementation-decisions.md)
3. [`../01-execution/core/02-PHASE-1.md`](../01-execution/core/02-PHASE-1.md)
4. [`../workflows/sequential-5-phase-agent/RUN.md`](../workflows/sequential-5-phase-agent/RUN.md) — when running a 5-phase workflow
5. [`../01-execution/core/04-HANDOVER.md`](../01-execution/core/04-HANDOVER.md) — live status

## What Was Rejected

- Treating draft or archived plans as live authority
- Merging overlapping draft text into live execution files without a decision
- Moving agent reports into `results/` or calling them gate scratch
- Orchestrator writing agent reports instead of agents
- Simulated a11y/review passes without `failures.md` skip declaration
- Blanket “read all prior” when no prior phases completed this run
- Advancing workflow phases despite open blockers in `failures.md`