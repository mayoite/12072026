# 00 Start

Goal: freeze the working baseline before repairs.

## Entry Condition

- Current repo is `D:\codex07072026`.
- The working tree is clean or every dirty file is understood.
- The active module scope is known.

## Read First

1. `AGENTS.md`
2. `Readme.md`
3. `START.md`
4. `Failures.md`
5. `testing-handbook.md`
6. `gpt5.5.md`
7. `Plans/02-recovery/01-module-baseline.md`

## Commands

```powershell
git status --short --branch
git log -5 --oneline
```

## Exit Evidence

1. Current branch.
2. Current commit.
3. Dirty or clean state.
4. Open blockers.
5. Next selected phase.

## Phase Decision Record

Every phase must record:

| Field | Required |
| --- | --- |
| Standard | The rule or benchmark being applied |
| Owner | Module owner or current agent |
| Evidence | Exact command, exit code, and artifact path |
| Refusal | What was refused or deferred |
| Next step | The next smallest action |

Gate evidence must land under `results/<module>/<phase>/<cmd>/`.

Narrative without artifacts is not release-grade evidence.

## Do Not Do

1. Do not repair code in this phase.
2. Do not stage `.env.local`.
3. Do not claim old evidence still applies.
4. Do not call a phase complete without a decision record.

## Stop Conditions

1. Working tree has unexplained changes.
2. Remote and local state disagree.
3. The requested scope is unclear.
