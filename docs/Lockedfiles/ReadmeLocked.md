# Readme — doc chain (locked copy)

Frozen reference snapshot. Live repo facts: repo-root `Readme.md`. Update this copy only when intentionally locking the doc-routing layer.

## Which doc to open

Don't load every file each task. Open the one that matches:

- **Always** — `AGENTS.md`
- **Run a command or gate** — `START.md`
- **Edit app paths, data, CSS, DB** — `Readme.md`
- **Test paths, layout, artifacts** — `TESTING.md`
- **Test evidence and output integrity** — `testing-handbook.md`
- **Gate policy, blockers, skips** — `Failures.md`
- **Active lane / session status** — `HANDOVER.md`
- **Deploy, backup, incidents** — `OPERATIONS_RUNBOOK.md`
- **Find any doc** — `DOC-MAP.md`
- **Admin UI routes and workflow** — `ADMIN_workflow.md`
- **Locked reference copies** — `docs/Lockedfiles/` (`AgentsLocked.md`, `ReadmeLocked.md`, `TestingLocked.md`, `TestingHandbookLocked.md`)

## Doc layers

- `AGENTS.md` — conduct
- `Readme.md` — orientation and repo facts (paths, data, CSS, DB)
- `START.md` — commands
- `TESTING.md` — test layout and artifact paths
- `testing-handbook.md` — mandatory output preservation, warning review, and no-bypass policy
- `Failures.md` — gate policy and blockers
- `HANDOVER.md` — session status
- `OPERATIONS_RUNBOOK.md` — deploy, backup, incidents
- `DOC-MAP.md` — documentation index

## Editing docs

Each file owns its layer. Don't copy content upward. Lock snapshots in `docs/Lockedfiles/` only when deliberately freezing a version.
