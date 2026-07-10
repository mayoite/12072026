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
- **Domain map (current vs proposed)** — `docs/Lockedfiles/INDEX.md` → `<module>/current.md` + `proposed.md`
- **Where new code goes** — `docs/architecture/MODULE-LAYOUT.md`
- **UI module contract (anti-drift)** — `docs/Lockedfiles/ui/MODULE-UI-CONTRACT-Locked.md` + `ui-execution/`
- **Design-system intake (Penpot first)** — `docs/architecture/DESIGN-SYSTEM-INTAKE.md`
- **Architecture docs** — `docs/architecture/README.md` + `architecture/current.md` / `proposed.md`
- **Doc revision log** — `archive/Plans/01-execution/specialists/09-DOC-REVISION.md`
- **Execute plans** — `Plans/INDEX.md`
- **Locked reference copies** — `docs/Lockedfiles/conduct/` + `INDEX.md` (`DomainTruthLocked.md` → redirect)

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
