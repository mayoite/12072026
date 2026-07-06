# Phase 1B — 5-phase agent workflow

Filled instance of `Plans/workflows/sequential-5-phase-agent/WORKFLOW.md`.

## Identity

| Field | Value |
|-------|-------|
| Slug | `1b-5phase-agent-workflow` |
| Goal | Phase 1B SVG production path — admin → publish → catalog for 3 variants |
| Authority | `Plans/01-execution/core/02-PHASE-1.md` |
| Repo | `D:\oandO04072026` |
| Surfaces | `/planner/open3d`, `admin/svg-editor`, SVG catalog pipeline |
| Gate module | `results/planner/phase-1b` |

## Context

1A (Open3D shell pilot) complete. 1B blocked on full publish, gates, and evidence.

**First pass (2026-07-06):** setup run under old rules — reports preserved in phase folders. Re-run phases per `PROMPTS.md` and `../workflows/sequential-5-phase-agent/RUN.md` for substantive completion.

## Rules

1. Sequential — one agent at a time.
2. Agent writes four reports; orchestrator dispatches and verifies only.
3. Reports → this folder, `NN-<role>/`. Gates → `results/planner/phase-1b/<cmd>/` via `scripts/run-evidence-cmd.ps1`.
4. Read `AGENTS.md`, skill `SKILL.md`, authority doc; prior `executive-summary.md` if any from completed earlier phases this run.
5. Skipped runs = INCOMPLETE → `failures.md` + `Failures.md`.
6. Phase gate: no advance on open `failures.md` blockers unless user overrides.

## Reports (each phase)

| File | Substance required |
|------|-------------------|
| `observations.md` | Bullets with evidence: paths, SHAs, exit codes, artifact locations |
| `work-done.md` | Bullets: files touched, commands run, gates executed |
| `failures.md` | Bullets: skip/blocker, reason, owner; empty if none |
| `executive-summary.md` | `Revision: <sha>` · verdict (proceed / block) · summary · detail · next step |

## Phases

| # | Folder | Skill | Delivers |
|---|--------|-------|----------|
| 1 | `01-repair-agent/` | `/implement` | SVG/Puck/compiler fixes — one cluster, minimal diff |
| 2 | `02-benchmarker/` | `/check-work` | `results/planner/phase-1b/` gate bundle; GS + evidence |
| 3 | `03-critic/` | `/review` + a11y tools | Review findings before UI work |
| 4 | `04-ui-expert/` | generalPurpose + UI contract + REC-01 | Thin UI fixes on listed surfaces after critic |
| 5 | `05-planner/` | generalPurpose | Execution plan in `executive-summary.md` |

## Also here

- [`PROMPTS.md`](PROMPTS.md) — filled dispatch prompts
- [`reviews/`](reviews/) — cross-cutting reviews from first pass