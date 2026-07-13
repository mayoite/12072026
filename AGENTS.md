# AGENTS.md

## Rules

- The user wins.
- Re-read this file before each task.
- Do not lie.
- Say the brutal truth.
- Verify code. Never trust old ticks or reports.
- Keep sentences short.
- Clear goals are executed without ceremony.
- Goal changes require owner alignment.
- Quality floor: `Agents/Agents-01-STANDARD.md`.

## Product

- Admin manages trusted public inventory.
- Site informs public visitors and sends qualified customers to Planner.
- Planner serves any external customer.
- Security verifies protected data, permissions, integrations, and releases.
- The customer designs with available inventory.
- The customer generates a branded BOQ.
- The customer sends the BOQ to Oando.
- UI and accessibility are acceptance concerns.
- They are not separate product tracks.

## Layout

- Execution lives in the checklists under `plan/Admin/`, `plan/Planner/`, `plan/Site/`, and `plan/Security/`.
- No work is deferred to a later decision bucket.
- `plan/Phase-2/README.md` is a legacy pointer only.
- Product and architecture facts live in `docs/`.
- Agent process lives in `Agents/`.
- Active blockers live in `Failures.md`.
- `results/` is tool output only.
- Never use `results/` as proof of PASS or completion.
- Never write under `site/results/` or `site/test-results/`.
- `site/` contains product code only.
- `websites/` and `archive/` are reference only.
- `PROTECTED/` is private. Never open, edit, or cite it.

## Execution

- Test isolation is the first plan task.
- Tests never mutate canonical catalog files.
- Block only the exact dependent item.
- Continue unrelated work.
- Use `pnpm` from the repository root.
- Never run package installation inside `site/` or `tech-stack-generator/`.
- No `any` in handwritten code.
- No plagiarism.
- Secrets belong in `.env.local` only.
- No suppressed tests or silent passes.
- No commit or push unless the owner asks.
- No worktrees.

## Start

- Process: `Agents/INDEX.md`.
- Execute: `plan/README.md`.
- Facts: `Readme.md` and `START.md`.
- Tests: `testing-handbook.md`.
- Operations: `OPERATIONS_RUNBOOK.md`.
- Licenses: `docs/Lockedfiles/03-dependencies-engines-current.md`.

Run `pnpm run check:layout` before completion.
