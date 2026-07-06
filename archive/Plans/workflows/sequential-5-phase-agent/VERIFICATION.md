# Verification

Workflow is **complete** only when all pass.

## Structure

- [ ] `Plans/<slug>/` exists with exactly five phase subfolders: `01-repair-agent` … `05-planner`
- [ ] Each phase folder has exactly four files: `observations.md`, `work-done.md`, `failures.md`, `executive-summary.md`
- [ ] `05-planner/executive-summary.md` is a usable execution plan (not setup-only)

## Agent discipline

- [ ] Grep agent prompts/outputs: no report folder or filename mentions
- [ ] Phase 4 critic: real tool results cited (a11y, snapshots, playwright) or failures.md declares skip with reason

## Evidence

- [ ] Gate runs under `results/<module>/<phase>/<cmd>/` with `*-run.json` + `*-raw.log`
- [ ] No agent narrative `.md` files under `results/`
- [ ] `Failures.md` updated for open items

## Process

- [ ] `AGENTS.md` and `testing-handbook.md` followed
- [ ] Start and end revision recorded in planner executive summary or handover