Execute Phase 10 only.

Primary path focus:
- route swap and feature flag files
- release manifest files
- handover docs
- results/**
- Failures.md

Goal:
Deliver flagged pilot, rollback drill evidence, signed promotion manifest, cleanup control, and structured handover.

Must complete:
- feature-flagged route swap
- cohort and kill-switch config
- rollback drill <= 30 seconds with evidence
- signed promotion manifest
- grep-then-signoff cleanup workflow
- residue purge from approved scope only
- handover doc with route status and risk register

Check IDs:
- 10-FLAG-01
- 10-ROLL-01
- 10-HAND-01

Do not delete before signatures:
- OOPlanner/
- open3d-next-staging/
- site/_archive/fabric/

Return exactly:
1. Scope executed.
2. Files changed.
3. Checks run.
4. Evidence paths.
5. Gate result by check ID.
6. Status recommendation.
7. Open blockers.
8. Next smallest safe slice.
