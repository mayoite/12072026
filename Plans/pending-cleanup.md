# Pending Cleanup List (Updated)

## Completed/Superseded Plans Archived (no stubs left, as per instruction)
- Plan_06072026/
- 00-governance/00-global-standard-revision/
- 01-execution/research/
- 01-execution/specialists/
- 1b-5phase-agent-workflow/ (duplicate in Plans/)
- workflows/sequential-5-phase-agent/ (superseded template)
- workflows/workflows/ (duplicate subdir)
- meta/SUBAGENT-NOTES.md (full notes)
- Other historical from earlier: 02-proposed/, etc. in archive/Plans/

Full content in archive/Plans/

## Stubs for Recent Executed Plans (kept as record)
- site-workflows-plan-2026-07.md
- current-issues-resolution-2026-07.md

## Active Authority Plans (left full)
- 00-governance/01-phase1-execution/ (00- to 10- + README; some small files left as-is)
- 01-execution/core/ (00-REVISION, 01-START, 02-PHASE-1, 03-PHASE-2, 04-HANDOVER, phase1-checklist + README)

## Root Folders Archived
- open3d-floorplan/, open3d-next-staging/, agent-tools/, terminals/, Agents_work/, mcps/, results/ (and old results subdirs)

## Other Items Done
- Duplicate workflows/ subdir archived
- meta/SUBAGENT-NOTES archived (no stub)
- Plans/README.md updated to remove references to archived items (Agents_work/, Plan_06072026/, etc.), added note on stubs for executed.
- pending-cleanup.md updated
- Temp files cleaned
- Final-clean: updated all live stale refs (Plans/0x, phase1-checklist, DOC-MAP, Readme, TESTING, Workflows.tsx) from Plans/1b-5phase... / Agents_work/ to archive/1b-5phase-agent-workflow/ and archive/Agents_work/. Reconciled phase1 status (1A/1B COMPLETE noted in 02-PHASE-1.md etc.)
- Generator package name aligned to oando-site-workflow-docs for filter consistency.
- Site tech-stack / workflows built successfully (pnpm --filter oando-site-workflow-docs build exit 0; output site/tech-stack-docs/)

## Notes
- No evidence in results/ (archived)
- Followed archive over delete
- Kept required active plans
- Site-workflow implemented in site/tech-stack-generator (data + enhanced Workflows.tsx with modules, diagrams, etc.)
- Generator output to site/tech-stack-docs/ (served at /tech-stack-docs/ + next rewrites aligned)
- Package updated to oando-site-workflow-docs
- Phase 1A/1B execution complete per agent workflow + checklist; see archive/ for reports.

If more pending identified, add here.

Last updated: 2026-07-06
