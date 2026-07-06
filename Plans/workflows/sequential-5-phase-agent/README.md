# Sequential 5-phase agent workflow

Five agents, strict order. Each writes four substantive reports. Orchestrator dispatches only; does not advance on open blockers.

| File | Contents |
|------|----------|
| [`WORKFLOW.md`](WORKFLOW.md) | Identity, rules, report substance, phases |
| [`RUN.md`](RUN.md) | New run, dispatch, done criteria |
| [`PROMPTS.md`](PROMPTS.md) | Agent prompts |

| # | Folder | Skill |
|---|--------|-------|
| 1 | `01-repair-agent/` | `/implement` |
| 2 | `02-benchmarker/` | `/check-work` |
| 3 | `03-critic/` | `/review` + a11y tools |
| 4 | `04-ui-expert/` | generalPurpose + UI contract + REC-01 |
| 5 | `05-planner/` | generalPurpose — execution plan |

Reports → `Plans/<slug>/`. Gates → `{{GATE_MODULE}}/`.