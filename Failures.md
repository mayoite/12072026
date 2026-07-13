# Active failures

This file contains active failures only.

Remove an entry when its fix is freshly verified.

## LAYOUT-001

- Scope: Repository layout gate.
- Command: `pnpm run check:layout` from `E:\12072026`.
- Result: exit 1 on 2026-07-13.
- Symptom: `.tech-stack-generated/` is present and contains tracked generated data and documentation files forbidden by the active repository layout.
- Impact: repository completion and release claims are blocked. Focused Admin implementation and verification may continue.
- Next: move approved generated artifacts to the governed output location or remove the forbidden tracked tree, then rerun `pnpm run check:layout`.
- Blocked work: only repository-wide layout completion and gates that include `check:layout`.

## PLANNER-OVERLAP-001

- Scope: Planner furniture validation.
- Command: `pnpm --filter oando-site exec vitest run tests/unit/features/planner/lib/validation/furnitureOverlap.test.ts --reporter=dot`.
- Result: exit 1 on 2026-07-13.
- Symptom: overlapping furniture returns no issue.
- Code: `site/features/planner/lib/validation/furnitureOverlap.ts` returns an empty array.
- Impact: overlap validation cannot be claimed.
- Next: implement issue creation and rerun the focused test.
- Blocked work: only Planner overlap-validation acceptance.
