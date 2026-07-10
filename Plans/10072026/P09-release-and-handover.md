# P09 — Release decision and handover

## Buyer problem

The owner needs to know what is actually usable, what is still risky, and how to recover from failure. A folder full of screenshots is not a release decision.

## Outcome

O&O receives an honest prototype release pack. It states what a buyer can do today, what staff can operate, what data is local or cloud-backed, and what must not be promised.

## Scope

1. Assemble the P00–P08 proof into one release board.
2. Run the agreed release checks from a cleanly recorded state.
3. Verify deployment configuration, environment validation, database and asset backup procedures, origin push, and mirror push attempt.
4. Run a deployed or production-style smoke for public site, planner, admin publish, project/BOQ, and AI review where enabled.
5. Write rollback notes and a short operator guide.

## Evidence

`results/10072026/P09-release-and-handover/` contains:

- `HEAD.txt`, worktree state, and release command logs;
- release board with PASS, HALF, OPEN, or FAIL per buyer outcome;
- deployed smoke proof or explicit local-only limitation;
- origin and mirror backup logs;
- rollback and operator notes;
- a final residual list.

## Acceptance

- The release board distinguishes usable prototype behavior from deferred work.
- Every green claim links to fresh evidence.
- Backup and recovery claims have command output, not prose alone.
- The owner can decide: release, limited internal release, or do not release.

## Non-goals

- Pretending the six-month prototype is enterprise parity.
- Hiding unresolved cloud, data, or pricing limitations.

## Final rule

“Prototype ready” means the stated buyer workflow works. It does not mean every future product family, cloud feature, or commercial automation is complete.
