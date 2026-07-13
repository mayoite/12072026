# Agent standard

## Truth

- Live code and fresh commands are authoritative.
- Plans state required work. They do not prove completion.
- Old reports and result files prove nothing.
- Never claim a browser outcome from a unit test.
- Use `OPEN` when work is unverified.
- Use `FAIL` when a fresh check fails.

## Work

- Read the relevant code before changing it.
- Use the smallest sound change.
- Avoid parallel writers on the same files.
- Parallelize independent Admin and Planner items.
- A blocker stops only its dependent item.
- Record active blockers in `Failures.md`.
- Remove a failure when it is resolved.

## Verification

- Start every checklist from unchecked state.
- Verify each item against live code.
- Run focused tests during work.
- Run broader gates only when their scope changed or shipment is claimed.
- UI claims require fresh browser verification.
- Save raw outputs under `results/` when useful.
- Save agent-authored reports under `agent-reports/`, never under `results/`.
- Report the command and exit result in the checklist.

## Git

- Use the root checkout.
- Preserve unrelated user changes.
- Never destroy owner data.
- Never force-push.
- Commit and push only when the owner asks.

## Quality

- Do not fake unavailable infrastructure.
- Do not label demo prices as commercial truth.
- Do not copy competitor assets or trade dress.
- Accessibility and security are acceptance criteria.
- A generated file is not a product outcome.
