# Orchestrator runbook

For the human or lead agent running the workflow. Agents never see this file's path references in their prompts.

## Before phase 1

1. Read `AGENTS.md`, `WORKFLOW.md` / `PLAN.md`, execution authority doc.
2. Confirm repo root is `{{REPO_ROOT}}` (not a stale worktree path).
3. Create `Plans/{{WORKFLOW_SLUG}}/` if not exists (see [`START.md`](START.md)).
4. Note start revision: `git rev-parse HEAD`.

## Per phase (repeat 1 → 5)

1. Read prior phase `executive-summary.md` (if any).
2. Open [`phases/NN-<role>/PROMPT.md`](phases/) — fill `{{PHASE_SCOPE}}` and `{{PRIOR_SUMMARY}}`.
3. Dispatch subagent with **only**:
   - Scoped task from PROMPT
   - Output contract: `**Observations**` (bullets), `**Work Done**` (bullets), `**Failures**` (bullets), then executive summary prose
   - No folder names, no file paths, no "write to disk"
4. Wait for completion.
5. Parse four sections from response.
6. Write into `Plans/{{WORKFLOW_SLUG}}/NN-<role>/` using stubs in [`reports/`](reports/).
7. Run gate commands via `scripts/run-evidence-cmd.ps1` → `results/<module>/<phase>/<cmd>/`.
8. Update `Failures.md` for skips/blockers.
9. Pass **short** summary to next phase (no paths).

## After phase 5

1. Run [`VERIFICATION.md`](VERIFICATION.md).
2. Link instance from `Plans/README.md` if new.
3. Update execution checklist / handover if phase goal met.

## Prompt hygiene

- Grep agent prompts and outputs: zero matches for `Plans/`, `observations.md`, `workflow-slug`, numbered phase folder names.
- If agent mentions paths, strip before writing reports; fix prompt for rerun.

## Evidence hygiene

- Every gate command: `*-run.json` + `*-raw.log` under `results/`.
- Never put agent narratives in `results/`.
- Never delete agent report folders after review.