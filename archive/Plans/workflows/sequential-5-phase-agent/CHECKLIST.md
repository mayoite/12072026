# Workflow checklist

## Before start

- [ ] `WORKFLOW.md` / `PLAN.md` filled (slug, goal, authority doc, surfaces, repo root)
- [ ] Execution authority doc read
- [ ] `Plans/<slug>/` created with five phase subfolders
- [ ] Phase prompts scoped (`phases/*/PROMPT.md` → instance context)
- [ ] Optional worktree created and clean

## Per phase

- [ ] Prior phase summary read
- [ ] Agent prompt has no report path references
- [ ] Subagent dispatched with four-section output contract
- [ ] Four report files written under `NN-<role>/`
- [ ] Gate commands wrapped with `scripts/run-evidence-cmd.ps1`
- [ ] Skips logged in `Failures.md`

## After phase 5

- [ ] [`VERIFICATION.md`](VERIFICATION.md) complete
- [ ] `Plans/README.md` lists instance
- [ ] Handover / execution checklist updated if applicable