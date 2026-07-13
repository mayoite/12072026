# Active failures

This file contains active failures only.

Remove an entry when its fix is freshly verified.

## PLANNER-OVERLAP-001

- Scope: Planner furniture validation.
- Command: `pnpm --filter oando-site exec vitest run tests/unit/features/planner/lib/validation/furnitureOverlap.test.ts --reporter=dot`.
- Result: exit 1 on 2026-07-13.
- Symptom: overlapping furniture returns no issue.
- Code: `site/features/planner/lib/validation/furnitureOverlap.ts` returns an empty array.
- Impact: overlap validation cannot be claimed.
- Next: implement issue creation and rerun the focused test.
- Blocked work: only Planner overlap-validation acceptance.
