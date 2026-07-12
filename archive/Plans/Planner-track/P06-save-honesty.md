# P06 — Save and reload honesty

**Status:** PASS · **CP:** CP-06

## Outcome

A buyer saves, reloads, and recovers the same local plan.

## PASS gates

- Guest save uses local persistence and says local.
- Member UI does not say cloud before a cloud save succeeds.
- Hard reload preserves IDs, pose, room, openings, and options.
- Corrupt primary data reports recovery or failure clearly.
- Save, dirty, saving, saved, and error states are visible.
- Unit and browser reload journeys pass.

**Evidence:** `results/planner/world-standard-wave/06-save-honesty/`

**Next:** P07.
