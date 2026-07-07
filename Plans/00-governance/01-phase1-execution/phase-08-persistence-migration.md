Execute Phase 08 only.

Primary path focus:
- site/features/planner/** persistence and storage paths
- migration-related files
- results/**
- Failures.md

Goal:
Add durable descriptor persistence with locking, version safety, and dual-read evidence.

Must complete:
- writer with O_EXCL lock behavior
- atomic rename / JSON-on-disk persistence
- 409.lock_busy handling
- 409.hash_mismatch handling
- 422 versionMismatch handling
- dual-read signed evidence
- migration apply path if available

Check IDs:
- 08-PERS-04
- 08-PERS-10

Known constraint:
- PLAN-FAIL-0409 remains deferred until migration owner runs db:apply for block_descriptors table

Return exactly:
1. Scope executed.
2. Files changed.
3. Checks run.
4. Evidence paths.
5. Gate result by check ID.
6. Status recommendation.
7. Open blockers.
8. Next smallest safe slice.
